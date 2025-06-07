<?php

declare(strict_types=1);

namespace App\Admin\Resources\Staff;

use Illuminate\Database\Eloquent\Model;
use App\Models\Staff\Employee;
use App\Admin\Pages\Employee\EmployeeIndexPage;
use App\Admin\Pages\Employee\EmployeeFormPage;
use App\Admin\Pages\Employee\EmployeeDetailPage;

use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<Employee, EmployeeIndexPage, EmployeeFormPage, EmployeeDetailPage>
 */
class EmployeeResource extends ModelResource
{
    protected string $model = Employee::class;

    protected string $title = 'Staff/Employees';

    public $titleField = 'fio';

    public string $column = 'fio';
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            EmployeeIndexPage::class,
            EmployeeFormPage::class,
            EmployeeDetailPage::class,
        ];
    }

    /**
     * @param Employee $item
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
        return [
            BelongsTo::make('Должность', 'position',  formatted: 'name')
        ];
    }
}
