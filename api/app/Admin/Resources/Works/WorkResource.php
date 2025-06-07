<?php

declare(strict_types=1);

namespace App\Admin\Resources\Works;

use Illuminate\Database\Eloquent\Model;
use App\Models\Works\Work;
use App\Admin\Pages\Work\WorkIndexPage;
use App\Admin\Pages\Work\WorkFormPage;
use App\Admin\Pages\Work\WorkDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;
use MoonShine\UI\Fields\Text;

/**
 * @extends ModelResource<Work, WorkIndexPage, WorkFormPage, WorkDetailPage>
 */
class WorkResource extends ModelResource
{
    protected string $model = Work::class;


    protected string $title = 'Works/Works';

    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            WorkIndexPage::class,
            WorkFormPage::class,
            WorkDetailPage::class,
        ];
    }

    /**
     * @param Work $item
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
            Text::make('Описание', 'description'),
        ];
    }

}
