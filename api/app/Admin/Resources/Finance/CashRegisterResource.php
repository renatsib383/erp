<?php

declare(strict_types=1);

namespace App\Admin\Resources\Finance;

use App\Admin\Pages\CashRegister\CashRegisterDetailPage;
use App\Admin\Pages\CashRegister\CashRegisterFormPage;
use App\Admin\Pages\CashRegister\CashRegisterIndexPage;
use App\Admin\Resources\Divisions\CompanyResource;
use App\Models\Finance\CashRegister;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\Laravel\Fields\Relationships\HasMany;
use MoonShine\Laravel\Pages\Page;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Text;

/**
 * @extends ModelResource<CashRegister, CashRegisterIndexPage, CashRegisterFormPage, CashRegisterDetailPage>
 */
class CashRegisterResource extends ModelResource
{
    protected string $model = CashRegister::class;

    protected string $title = 'Финансы / Кассы';

    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            CashRegisterIndexPage::class,
            CashRegisterFormPage::class,
            CashRegisterDetailPage::class,
        ];
    }

    /**
     * @param CashRegister $item
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
            Text::make('Наименование', 'name'),
            Text::make('Баланс', 'balance'),
        ];
    }
}
