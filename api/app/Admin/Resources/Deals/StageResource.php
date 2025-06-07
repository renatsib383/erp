<?php

declare(strict_types=1);

namespace App\Admin\Resources\Deals;

use Illuminate\Database\Eloquent\Model;
use App\Models\Deals\Stage;
use App\Admin\Pages\Stage\StageIndexPage;
use App\Admin\Pages\Stage\StageFormPage;
use App\Admin\Pages\Stage\StageDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<Stage, StageIndexPage, StageFormPage, StageDetailPage>
 */
class StageResource extends ModelResource
{
    protected string $model = Stage::class;

    protected string $title = 'Deals/Stages';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            StageIndexPage::class,
            StageFormPage::class,
            StageDetailPage::class,
        ];
    }

    /**
     * @param Stage $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
