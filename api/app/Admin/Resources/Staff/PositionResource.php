<?php

declare(strict_types=1);

namespace App\Admin\Resources\Staff;

use Illuminate\Database\Eloquent\Model;
use App\Models\Staff\Position;
use App\Admin\Pages\Position\PositionIndexPage;
use App\Admin\Pages\Position\PositionFormPage;
use App\Admin\Pages\Position\PositionDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<Position, PositionIndexPage, PositionFormPage, PositionDetailPage>
 */
class PositionResource extends ModelResource
{
    protected string $model = Position::class;

    protected string $title = 'Staff/Positions';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            PositionIndexPage::class,
            PositionFormPage::class,
            PositionDetailPage::class,
        ];
    }

    /**
     * @param Position $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
