<?php

namespace App\Data\Works;

use App\Data\BaseData;

class CategoryData extends BaseData
{
    public function __construct(
        public string $name,
        public ?int $id,
        public ?array $room_types,
        public ?int $sort = 0,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => 'string',
            'room_types' => ['nullable','array'],
            'sort' => ['nullable','integer'],
        ];
    }
}
