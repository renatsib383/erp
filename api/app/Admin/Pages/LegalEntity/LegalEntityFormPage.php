<?php

declare(strict_types=1);

namespace App\Admin\Pages\LegalEntity;

use App\Admin\Resources\Staff\PositionResource;
use App\Models\Staff\Position;
use MoonShine\Laravel\Fields\Relationships\RelationRepeater;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use App\Admin\Components\ModelEventsComponent;
use Throwable;

class LegalEntityFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     * @throws Throwable
     */
    protected function fields(): iterable
    {
        return [
            Tabs::make([
                Tab::make('Основная информация', [
                    Text::make('Полное наименование организации', 'full_name')->horizontal(),
                    Text::make('Краткое наименование', 'short_name')->horizontal(),
                    Text::make('ИНН', 'inn')->horizontal(),
                    Text::make('КПП', 'kpp')->horizontal(),
                    Text::make('ОГРН', 'ogrn')->horizontal(),
                    Text::make('ОКТМО', 'oktmo')->horizontal(),
                    Text::make('Телефон', 'phone')->horizontal(),
                    Text::make('Эл. почта', 'email')->horizontal(),
                    Text::make('Сайт', 'website')->horizontal(),
                    Text::make('Город', 'city')->horizontal(),
                    Textarea::make('Юр. адрес', 'legal_address')->horizontal(),
                    Text::make('ФИО генерального директора', 'director')->horizontal(),
                    Text::make('ФИО главного бухгалтера', 'glavbuh')->horizontal(),
                    Date::make('Дата гос. регистрации', 'registration_date')->horizontal(),
                ])->icon('tag'),
                Tab::make('Банковские счета', [
                    Json::make('', 'bank_accounts')
                        ->fields([
                            Text::make('БИК', 'bik')->required(),
                            Text::make('Корр. счет', 'corr_account')->required(),
                            Text::make('Счет', 'account')->required(),
                            Text::make('Наименование банка', 'bank_name')->required(),
                            Switcher::make('Активен', 'active')
                        ])->vertical()->removable()
                ])->icon('tag'),
                Tab::make('Печать и факсимиле', [
                    Image::make('Логотип','logo'),
                    Image::make('Факсимиле','facsimile'),
                    Image::make('Печать','stamp'),
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
