<?php

declare(strict_types=1);

namespace App\Admin\Pages\LegalEntity;

use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Layout\Divider;

use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Components\Collapse;
use App\Admin\Components\ModelEventsComponent;
use Throwable;

class LegalEntityIndexPage extends IndexPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Text::make('Название компании', 'name'),
            Text::make('Наименование организации', 'full_name'),
            Text::make('Краткое наименование организации','short_name'),
            Text::make('Телефон','phone'),
            Text::make('Эл. почта','email'),
            Text::make('Сайт','website'),
            Text::make('Город','city'),
            Text::make('Юр. адрес','legal_address'),
            Text::make('Директор','director'),
            Text::make('Гл. бухгалтер','glavbuh'),
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
            ...parent::bottomLayer(),
            Divider::make(),
            Collapse::make('Журнал изменений', [
                ModelEventsComponent::make($this->getResource())
            ])
        ];
    }
}
