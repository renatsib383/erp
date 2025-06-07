<?php

declare(strict_types=1);

namespace App\Admin\Resources\Finance;

use App\Admin\Pages\Payment\PaymentDetailPage;
use App\Admin\Pages\Payment\PaymentFormPage;
use App\Admin\Pages\Payment\PaymentIndexPage;
use App\Models\Finance\Payment;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Page;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;

/**
 * @extends ModelResource<Payment, PaymentIndexPage, PaymentFormPage, PaymentDetailPage>
 */
class PaymentResource extends ModelResource
{
    protected string $model = Payment::class;

    protected string $title = 'Финансы / ДДС';

    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            PaymentIndexPage::class,
            PaymentFormPage::class,
            PaymentDetailPage::class,
        ];
    }

    /**
     * @param Payment $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
    protected function filters(): array
    {
        return $this->fields();
    }

    public function fields(): array
    {
        return [
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
                    40 => 'Сдал',
                    41 => 'Отдал',
                ]),
            Date::make('Дата', 'date_transaction')
                ->default(now()->format('Y-m-d H:i:s')),
            Number::make('Сумма','total')
                ->default(0)->step(0.1),
            BelongsTo::make('Касса', 'cashRegister',  formatted: 'name'),
            Textarea::make('Комментарий','comment'),
        ];
    }
}
