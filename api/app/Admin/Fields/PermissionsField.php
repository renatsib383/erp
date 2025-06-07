<?php

declare(strict_types=1);

namespace App\Admin\Fields;

use MoonShine\UI\Fields\Field;
use Closure;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use Illuminate\Contracts\Support\Renderable;

class PermissionsField extends Field
{
    protected string $view = 'Admin.fields.permissions-field';

    protected function reformatFilledValue(mixed $data): mixed
    {
        return parent::reformatFilledValue($data);
    }

    protected function prepareFill(array $raw = [], ?DataWrapperContract $casted = null, int $index = 0): mixed
    {
        return parent::prepareFill($raw, $casted, $index);
    }

    protected function resolveValue(): mixed
    {
        return $this->toValue();
    }

    protected function resolvePreview(): Renderable|string
    {
        return (string) ($this->toFormattedValue() ?? '');
    }

    protected function resolveOnApply(): ?Closure
    {
        return function (mixed $item): mixed {
            return data_set($item, $this->getColumn(), $this->getRequestValue());
        };
    }

    protected function viewData(): array
    {
       $value = $this->toFormattedValue();
       $column = $this->getColumn();
        return [
            'value' => $value,
            'column' => $column,
        ];
    }
}
