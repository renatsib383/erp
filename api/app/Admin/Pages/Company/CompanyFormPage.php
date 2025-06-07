<?php

declare(strict_types=1);

namespace App\Admin\Pages\Company;

use App\Admin\Components\CompanyPricelistComponent;
use App\Admin\Resources\Staff\PositionResource;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use MoonShine\UI\Fields\Text;
use App\Admin\Components\ModelEventsComponent;
use Throwable;

class CompanyFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     * @throws Throwable
     */
    protected function fields(): iterable
    {

      //  $isCreated = $this->getResource()->getItem();
      //  dd($isCreated);

        return [
            Tabs::make([
                Tab::make('Основная информация', [
                    Text::make('Название компании', 'name')->required()->horizontal(),
                ])->icon('tag'),
                Tab::make('Прайс лист', [
                    CompanyPricelistComponent::make($this->getResource()),
                ])->icon('tag'),
                Tab::make('Зарплаты', [
                    BelongsToMany::make(
                        'Должности',
                        'positions',
                        fn($item) => "$item->id. $item->name",
                        resource: PositionResource::class
                    )
                        ->columnLabel('Должность')
                        ->fields([
                            Text::make('Оклад', 'salary'),
                        ])
                ])->icon('tag'),
                Tab::make('Разрешения', [

                ])->icon('tag'),
                 Tab::make('Журнал изменений', [
                    ModelEventsComponent::make($this->getResource())
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
