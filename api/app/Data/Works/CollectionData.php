<?php

namespace App\Data\Works;


use App\Data\BaseData;

class CollectionData extends BaseData
{
    public function __construct(
        public string $name,
        public int $room_type,
        public ?int $id,
        public ?array $works,
        public ?int $sort = 0,
        public mixed $events,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => 'string',
            'room_type' => 'integer',
            'works' => ['nullable','array'],
            'sort' => ['nullable','integer'],
        ];
    }
}
