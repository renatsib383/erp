<?php

declare(strict_types=1);

namespace App\Admin\Resources\Deals;

use Illuminate\Database\Eloquent\Model;
use App\Models\Deals\Deal;
use App\Admin\Pages\Deal\DealIndexPage;
use App\Admin\Pages\Deal\DealFormPage;
use App\Admin\Pages\Deal\DealDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<Deal, DealIndexPage, DealFormPage, DealDetailPage>
 */
class DealResource extends ModelResource
{
    protected string $model = Deal::class;

    protected string $title = 'Deals/Deals';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            DealIndexPage::class,
            DealFormPage::class,
            DealDetailPage::class,
        ];
    }

    /**
     * @param Deal $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
