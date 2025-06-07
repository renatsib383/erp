<?php

declare(strict_types=1);

namespace App\Admin\Resources\Works;

use Illuminate\Database\Eloquent\Model;
use App\Models\Works\WorkCategory;
use App\Admin\Pages\WorkCategory\WorkCategoryIndexPage;
use App\Admin\Pages\WorkCategory\WorkCategoryFormPage;
use App\Admin\Pages\WorkCategory\WorkCategoryDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<WorkCategory, WorkCategoryIndexPage, WorkCategoryFormPage, WorkCategoryDetailPage>
 */
class WorkCategoryResource extends ModelResource
{
    protected string $model = WorkCategory::class;

    protected string $title = 'Works/WorkCategories';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            WorkCategoryIndexPage::class,
            WorkCategoryFormPage::class,
            WorkCategoryDetailPage::class,
        ];
    }

    /**
     * @param WorkCategory $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
