<?php

declare(strict_types=1);

namespace App\Admin\Pages\CashRegister;

use App\Admin\Components\ModelEventsComponent;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Collapse;
use MoonShine\UI\Components\Layout\Divider;
use MoonShine\UI\Fields\Text;
use Throwable;

class CashRegisterIndexPage extends IndexPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return $this->getResource()->fields();
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
            Divider::make(),
            Collapse::make('Журнал изменений', [
                ModelEventsComponent::make($this->getResource())
            ])
        ];
    }
}
