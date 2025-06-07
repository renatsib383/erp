<?php

namespace App\Data\Remont;

use App\Data\BaseData;

class RoomTypeData extends BaseData
{
    public function __construct(
        public string $name,
        public ?int $id,
        public ?int $sort = 0,
        public mixed $events,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'sort' => ['nullable', 'integer'],
        ];
    }
}
