<?php

declare(strict_types=1);

namespace App\Admin\Fields;

use MoonShine\UI\Fields\Field;
use Closure;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use Illuminate\Contracts\Support\Renderable;
use App\Models\System\ModelEvent;

class ModelEventsField extends Field
{
    protected string $view = 'Admin.fields.model-events-field';

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

        // dd($this->getData());

        $events = ModelEvent::where('eventable_id', $this->getData()->getKey())
            ->where('eventable_type', 'App\Models\Credentials\Company')
            ->orderBy('created_at', 'desc')
            ->get();
        return [
            'events' => $events,
        ];
    }
}
