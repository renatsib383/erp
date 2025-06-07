<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{

    // использовать как POST запросы с JSON структурой,
    // так и GET запросы с параметрами в URL,
    // трейт автоматически определит формат и обработает данные
    // соответствующим образом.


    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (isset($filters['filters'])) {
            $filters = $this->parseGetParameters($filters['filters']);
        }

        if (isset($filters['where'])) {
            $this->processWhereConditions($query, $filters['where']);
        }

        if (isset($filters['sort'])) {
            $this->processSortParameters($query, $filters['sort']);
        }

        if (isset($filters['offset'])) {
            $query->offset($filters['offset']);
        }

        if (isset($filters['limit'])) {
            $query->limit($filters['limit']);
        }

        return $query;
    }

    protected function processSortParameters(Builder $query, $sort): void
    {
        if (is_array($sort)) {
            foreach ($sort as $field => $direction) {
                if (is_numeric($field)) {
                    $direction = str_starts_with($direction, '-') ? 'desc' : 'asc';
                    $field = ltrim($direction === 'desc' ? substr($direction, 1) : $direction, '+');
                }
                $query->orderBy($field, $direction);
            }
        } else {
            $sorts = explode(',', $sort);
            foreach ($sorts as $sortItem) {
                $direction = str_starts_with($sortItem, '-') ? 'desc' : 'asc';
                $field = ltrim($direction === 'desc' ? substr($sortItem, 1) : $sortItem, '+');
                $query->orderBy($field, $direction);
            }
        }
    }

    protected function parseGetParameters(array $params): array
    {
        $result = [];
        $where = [];

        foreach ($params as $field => $value) {
            if (in_array($field, ['offset', 'limit'])) {
                $result[$field] = (int)$value;
                continue;
            }

            if ($field === 'sort') {
                $result['sort'] = $value;
                continue;
            }

            if (str_contains($field, '[or]')) {
                $fieldName = str_replace('[or]', '', $field);
                $values = explode(',', $value);

                $orConditions = [];
                foreach ($values as $val) {
                    $orConditions[] = [
                        'field' => $fieldName,
                        'operator' => 'like',
                        'value' => $val
                    ];
                }

                $where[] = ['or' => $orConditions];
                continue;
            }

            if (preg_match('/^(.+?)\[(.+?)]$/', $field, $matches)) {
                $fieldName = $matches[1];
                $operator = $matches[2];

                switch ($operator) {
                    case 'between':
                    case 'in':
                        $value = explode(',', $value);
                        break;
                }

                $where[] = [
                    'field' => $fieldName,
                    'operator' => $operator,
                    'value' => $value
                ];
            } else {
                $where[] = [
                    'field' => $field,
                    'operator' => '=',
                    'value' => $value
                ];
            }
        }

        $result['where'] = $where;
        return $result;
    }

    protected function processWhereConditions(Builder $query, array $conditions): void
    {
        foreach ($conditions as $condition) {
            if (isset($condition['or'])) {
                $query->where(function ($subQuery) use ($condition) {
                    foreach ($condition['or'] as $orCondition) {
                        $this->applyCondition($subQuery, $orCondition, 'or');
                    }
                });
            } else {
                $this->applyCondition($query, $condition, 'and');
            }
        }
    }

    protected function applyCondition(Builder $query, array $condition, string $type = 'and'): void
    {
        $method = $type === 'or' ? 'orWhere' : 'where';
        $field = $condition['field'];
        $operator = $condition['operator'] ?? '=';
        $value = $condition['value'];

        switch ($operator) {
            case 'in':
                $query->{$method . 'In'}($field, $value);
                break;
            case 'between':
                $query->{$method . 'Between'}($field, $value);
                break;
            case 'like':
                $query->{$method . 'Like'}($field, "%{$value}%");
                break;
            case 'null':
                $query->{$method . 'Null'}($field);
                break;
            case 'not_null':
                $query->{$method . 'NotNull'}($field);
                break;
            default:
                $query->$method($field, $operator, $value);
        }
    }
}
