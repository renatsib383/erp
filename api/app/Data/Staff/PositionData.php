<?php

namespace App\Data\Staff;

use App\Data\BaseData;

class PositionData extends BaseData
{
    public function __construct(
        public string $name,
        public ?int $id,
        public ?int $sort=0,
        public mixed $events,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required'],
            'sort' => ['nullable', 'integer'],
        ];
    }
}
