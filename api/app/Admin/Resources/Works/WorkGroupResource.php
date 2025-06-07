<?php

declare(strict_types=1);

namespace App\Admin\Resources\Works;

use Illuminate\Database\Eloquent\Model;
use App\Models\Works\WorkGroup;
use App\Admin\Pages\WorkGroup\WorkGroupIndexPage;
use App\Admin\Pages\WorkGroup\WorkGroupFormPage;
use App\Admin\Pages\WorkGroup\WorkGroupDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<WorkGroup, WorkGroupIndexPage, WorkGroupFormPage, WorkGroupDetailPage>
 */
class WorkGroupResource extends ModelResource
{
    protected string $model = WorkGroup::class;

    protected string $title = 'Works/WorkGroups';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            WorkGroupIndexPage::class,
            WorkGroupFormPage::class,
            WorkGroupDetailPage::class,
        ];
    }

    /**
     * @param WorkGroup $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
