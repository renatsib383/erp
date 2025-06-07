<?php

declare(strict_types=1);

namespace App\Admin\Resources\Works;

use Illuminate\Database\Eloquent\Model;
use App\Models\Works\WorkCollection;
use App\Admin\Pages\WorkCollection\WorkCollectionIndexPage;
use App\Admin\Pages\WorkCollection\WorkCollectionFormPage;
use App\Admin\Pages\WorkCollection\WorkCollectionDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<WorkCollection, WorkCollectionIndexPage, WorkCollectionFormPage, WorkCollectionDetailPage>
 */
class WorkCollectionResource extends ModelResource
{
    protected string $model = WorkCollection::class;

    protected string $title = 'Works/WorkCollections';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            WorkCollectionIndexPage::class,
            WorkCollectionFormPage::class,
            WorkCollectionDetailPage::class,
        ];
    }

    /**
     * @param WorkCollection $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
