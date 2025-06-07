<?php

namespace App\Services\PrimevueDatatables;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;
use ReflectionClass;
use Throwable;

class PrimevueDatatables
{
    private Builder $query;

    private ?int $currentPage;

    private int $perPage;

    private Collection $filters;

    private Collection $sort;

    private Collection $searchableColumns;

    public function __construct()
    {
        $first = request()->query('first', 0);
        $this->perPage = request()->query('rows', 0);
        $this->filters = request()->collect('filters');
        $this->sort = request()->collect('sort');
        $this->currentPage = ($first / $this->perPage) + 1;
        $this->searchableColumns = collect($this->filters->except('global')->keys());
    }

    public function query(Builder $query): static
    {
        $this->query = $query;

        return $this;
    }

    public static function of(Builder $query): static
    {
        // I'm pretty sure passing $query as an argument doesn't actually do anything.
        $instance = new self($query);

        return $instance->query($query);
    }

    public function make(): array
    {
        $global = collect($this->filters->get('global'));
        $localFilters = collect($this->filters->except('global'));
        $columnNames = $this->searchableColumns;
        //dd($columnNames->except(0));
        $query = $this->query
            ->where(function (Builder $q) use ($columnNames, $global) {
                // Global Search
                if (count($columnNames) && $global && $global->get('value')) {
                    $firstColumn = $columnNames->get(0);
                    $otherColumns = $columnNames->except(0);
                    $firstFilter = new Filter($firstColumn, $global->get('value'), $global->get('matchMode'));
                    $this->applyFilter($firstFilter, $q);
                    foreach ($otherColumns as $column) {
                        $colFilter = new Filter($column, $global->get('value'), $global->get('matchMode'));
                        $this->applyFilter($colFilter, $q, true);
                    }
                }
            })->where(function (Builder $q) use ($localFilters) {
                // Local filters
                foreach ($localFilters as $field => $filter) {
                    if (isset($filter['constraints'])) {
                        foreach ($filter['constraints'] as $const) {
                            if ($const['value']) {
                                $instance = new Filter($field, $const['value'], $const['matchMode']);
                                $this->applyFilter($instance, $q, $filter['operator'] == 'or' ? true : false);
                            }
                        }
                    } else {
                        if (collect($filter)->get('value') !== null) {
                            $instance = new Filter($field, collect($filter)->get('value'), collect($filter)->get('matchMode'));
                            $this->applyFilter($instance, $q);
                        }
                    }
                }
            });
        $with = collect([]);
        foreach ($columnNames as $columnName) {
            $exploded = explode('.', $columnName);
            if (count($exploded) == 2) {
                $with->push($exploded[0]);
            } elseif (count($exploded) == 3) {
                $with->push($exploded[0].'.'.$exploded[1]);
            }
        }
        $query->with($with->toArray());
        $this->applySort($query);

        //echo $query->toSql(); exit;

        $data = $query->paginate($this->perPage, page: $this->currentPage);

        return ['records' => $data->items(), 'total' => $data->total()];
    }

    private function applyFilter(Filter $filter, Builder &$q, $or = false): void
    {
        // Apply Search to a depth of 3
        $filter->buildWhere($q, $or);
    }

    private function applySort(Builder &$q): void
    {
        $this->sort->each(function ($item, $key) use ($q) {
            $key = explode('.', $item['field']);
            if (count($key) === 1) {
                $q->orderBy($item['field'], $item['order'] == 1 ? 'asc' : 'desc');
            } elseif (count($key) === 2) {
                $relationship = $this->getRelatedFromMethodName($key[0], get_class($q->getModel()));
                if ($relationship) {
                    $parentTable = $relationship->getParent()->getTable();
                    $relatedTable = $relationship->getRelated()->getTable();
                    if ($relationship instanceof HasOne) {
                        $parentKey = explode('.', $relationship->getQualifiedParentKeyName())[1];
                        $relatedKey = $relationship->getForeignKeyName();
                    } else {
                        $parentKey = $relationship->getForeignKeyName();
                        $relatedKey = $relationship->getOwnerKeyName();
                    }

                    $q->orderBy(
                        get_class($relationship->getRelated())::query()->select($key[1])->whereColumn("$parentTable.$parentKey", "$relatedTable.$relatedKey"),
                        $item['order'] == 1 ? 'asc' : 'desc'
                    );
                } else {
                    $q->orderBy(str_replace('.', '->', $item['field']), $item['order'] == 1 ? 'asc' : 'desc');
                }
            }
        });

    }

    private function getRelatedFromMethodName(string $method_name, string $class)
    {
        try {
            $method = (new ReflectionClass($class))->getMethod($method_name);

            return $method->invoke(new $class);
        } catch (Throwable $exception) {
            return null;
        }
    }
}
