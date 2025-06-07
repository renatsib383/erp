<?php

declare(strict_types=1);

namespace App\Admin\Resources\Divisions;

use App\Models\Divisions\Company;
use App\Models\Works\Work;
use App\Admin\Pages\Company\CompanyIndexPage;
use App\Admin\Pages\Company\CompanyFormPage;
use App\Admin\Pages\Company\CompanyDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<Company, CompanyIndexPage, CompanyFormPage, CompanyDetailPage>
 */
class CompanyResource extends ModelResource
{
    protected string $model = Company::class;

    protected string $title = 'Подразделения / Компании';

    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            CompanyIndexPage::class,
            CompanyFormPage::class,
            CompanyDetailPage::class,
        ];
    }

    /**
     * @param Company $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }

    protected function afterCreated(mixed $item): mixed
    {

        
        $works = Work::all();



        foreach ($works as &$work) {
            unset($work->id);
            unset($work->created_at);
            unset($work->updated_at);
            unset($work->deleted_at);

            $work->company_id = $item->id;
        }

        // print_r($works->toArray());

        // exit;
        Work::insert($works->toArray());

        return $item;
    }
}
