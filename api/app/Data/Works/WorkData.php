<?php

namespace App\Data\Works;

use App\Data\BaseData;

class WorkData extends BaseData
{
    public function __construct(
        public string $name,
        public int $price,
        public float $default_value,
        public int $work_group_id,
        public int $factor,
        public int $ed,
        public int $type,
        public ?int $id,
        public ?string $description,
        public ?array $products,
        public ?int $sort = 0,
        public mixed $events,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => 'string',
            'price' => 'numeric',
            'default_value' => 'numeric',
            'work_group_id' => 'numeric',
            'factor' => 'numeric',
            'ed' => 'numeric',
            'type' => 'numeric',
            'description' => ['nullable','string'],
            'products' => ['nullable','array'],
            'sort' => ['nullable','integer'],
        ];
    }
}
