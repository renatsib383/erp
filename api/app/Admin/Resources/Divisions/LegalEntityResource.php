<?php

declare(strict_types=1);

namespace App\Admin\Resources\Divisions;

use App\Admin\Pages\LegalEntity\LegalEntityDetailPage;
use App\Admin\Pages\LegalEntity\LegalEntityFormPage;
use App\Admin\Pages\LegalEntity\LegalEntityIndexPage;

use App\Models\Divisions\LegalEntity;
use MoonShine\Laravel\Pages\Page;
use MoonShine\Laravel\Resources\ModelResource;

/**
 * @extends ModelResource<LegalEntity, LegalEntityIndexPage, LegalEntityFormPage, LegalEntityDetailPage>
 */
class LegalEntityResource extends ModelResource
{
    protected string $model = LegalEntity::class;

    protected string $title = 'Подразделения / Юр. лица';

    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            LegalEntityIndexPage::class,
            LegalEntityFormPage::class,
            LegalEntityDetailPage::class,
        ];
    }

    /**
     * @param LegalEntity $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
