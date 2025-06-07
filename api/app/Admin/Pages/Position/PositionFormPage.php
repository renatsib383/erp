<?php

declare(strict_types=1);

namespace App\Admin\Pages\Position;

use App\Admin\Components\ModelEventsComponent;
use App\Admin\Resources\Divisions\CompanyResource;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use MoonShine\UI\Fields\Text;
use Throwable;

class PositionFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Tabs::make([
                Tab::make('Основная информация', [
                    Text::make('Название', 'name')->required(),
                    BelongsToMany::make('Компания', 'companies',
                        fn($item) => "$item->id. $item->name",
                        resource: CompanyResource::class)
                        ->columnLabel('Компания')->fields([
                            Text::make('Оклад', 'salary'),
                        ])
                ])->icon('tag'),
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
