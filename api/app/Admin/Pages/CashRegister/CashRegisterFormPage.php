<?php

declare(strict_types=1);

namespace App\Admin\Pages\CashRegister;

use App\Admin\Components\ModelEventsComponent;
use App\Admin\Resources\Finance\PaymentResource;
use App\Admin\Resources\Staff\EmployeeResource;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Fields\Relationships\HasMany;
use MoonShine\Laravel\Fields\Relationships\HasOne;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use Throwable;

class CashRegisterFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {

        $fields = $this->getResource()->fields();
        $fields[] = HasMany::make(
            'ДДС',
            'payments',
            resource: PaymentResource::class
        );
        $fields[] = BelongsTo::make(
            'Сотрудник',
            'employee',
            resource: EmployeeResource::class
        )->nullable();

        return [
            Tabs::make([
                Tab::make('Основная информация', $fields)->icon('tag'),
                Tab::make('Журнал изменений', [
                    ModelEventsComponent::make($this->getResource()),
                ])->icon('tag'),
            ]),
        ];
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
            ...parent::bottomLayer()
        ];
    }
}
