<?php

declare(strict_types=1);

namespace App\Admin\Resources;

use Illuminate\Database\Eloquent\Model;
use App\Models\Role;
use App\Admin\Pages\Role\RoleIndexPage;
use App\Admin\Pages\Role\RoleFormPage;
use App\Admin\Pages\Role\RoleDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<Role, RoleIndexPage, RoleFormPage, RoleDetailPage>
 */
class RoleResource extends ModelResource
{
    protected string $model = Role::class;

    protected string $title = 'Roles';

    public $titleField = 'name';

    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            RoleIndexPage::class,
            RoleFormPage::class,
            RoleDetailPage::class,
        ];
    }

    /**
     * @param Role $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
