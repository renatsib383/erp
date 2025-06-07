<?php

declare(strict_types=1);

namespace App\Admin\Pages\Payment;

use App\Admin\Components\ModelEventsComponent;
use App\Admin\Resources\Finance\CashRegisterResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Components\Tabs;
use MoonShine\UI\Components\Tabs\Tab;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use Throwable;

class PaymentFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        //dd();
        return [
            Tabs::make([
                Tab::make('Основная информация', [
                    BelongsTo::make('ИД объекта', 'deal',  formatted: 'uid')->searchable(),
                    Select::make('Тип', 'type')
                        ->options([
                            1 => 'Приход',
                            2 => 'Расход',
                            3 => 'Перемещение',
                        ]),

                    Select::make('Операция', 'item') // Приходные операции
                        ->setNameAttribute('item_1')
                        ->showWhen('type',1)
                        ->options([
                            1 => 'Оплата Акта',
                            2 => 'Спецмонтаж',
                            3 => 'Черновой',
                            4 => 'Чистовой',
                            5 => 'Пополнение Депозита',
                            6 => 'Проектирование',
                            7 => 'Прочие поступления',
                        ]),

                    Select::make('Операция', 'item') // Расходные операции
                        ->setNameAttribute('item_2')
                        ->showWhen('type', 2)
                        ->options([
                            20 => 'ФОТр Мастеров',
                            21 => 'Скидка',
                            22 => 'Удержание',
                            23 => 'Переделка',
                            24 => 'Доп расходы',
                            25 => 'Комиссия',
                            26 => 'В компанию',
                            27 => 'ФОТр подряды',
                            28 => 'ФОТр прораба',
                            29 => 'Прочие расходы',
                        ]),
                    Select::make('Операция', 'item') // Операции перемещения
                        ->setNameAttribute('item_3')
                        ->showWhen('type', 3)
                        ->options([
                            40 => 'Сдал',
                            41 => 'Отдал',
                        ]),
                    Date::make('Дата', 'date_transaction')
                        ->default(now()->format('Y-m-d H:i:s')),
                    Number::make('Сумма','total')
                        ->default(0)->step(0.1),
                    BelongsTo::make('Касса', 'cashRegister',  formatted: 'name'),
                    BelongsTo::make('Касса получатель', 'cashRegisterRecipient', formatted: 'name',
                        resource: CashRegisterResource::class
                    )->showWhen('type', 3)->nullable(),
                    Textarea::make('Комментарий','comment'),
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
