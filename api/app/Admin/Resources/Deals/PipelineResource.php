<?php

declare(strict_types=1);

namespace App\Admin\Resources\Deals;

use Illuminate\Database\Eloquent\Model;
use App\Models\Deals\Pipeline;
use App\Admin\Pages\Pipeline\PipelineIndexPage;
use App\Admin\Pages\Pipeline\PipelineFormPage;
use App\Admin\Pages\Pipeline\PipelineDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<Pipeline, PipelineIndexPage, PipelineFormPage, PipelineDetailPage>
 */
class PipelineResource extends ModelResource
{
    protected string $model = Pipeline::class;

    protected string $title = 'Deals/Pipelines';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            PipelineIndexPage::class,
            PipelineFormPage::class,
            PipelineDetailPage::class,
        ];
    }

    /**
     * @param Pipeline $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
