<?php

declare(strict_types=1);

namespace App\Admin\Resources\Remont;

use Illuminate\Database\Eloquent\Model;
use App\Models\Remont\RoomType;
use App\Admin\Pages\RoomType\RoomTypeIndexPage;
use App\Admin\Pages\RoomType\RoomTypeFormPage;
use App\Admin\Pages\RoomType\RoomTypeDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Laravel\Pages\Page;

/**
 * @extends ModelResource<RoomType, RoomTypeIndexPage, RoomTypeFormPage, RoomTypeDetailPage>
 */
class RoomTypeResource extends ModelResource
{
    protected string $model = RoomType::class;

    protected string $title = 'Remont/RoomTypes';
    
    /**
     * @return list<Page>
     */
    protected function pages(): array
    {
        return [
            RoomTypeIndexPage::class,
            RoomTypeFormPage::class,
            RoomTypeDetailPage::class,
        ];
    }

    /**
     * @param RoomType $item
     *
     * @return array<string, string[]|string>
     * @see https://laravel.com/docs/validation#available-validation-rules
     */
    protected function rules(mixed $item): array
    {
        return [];
    }
}
