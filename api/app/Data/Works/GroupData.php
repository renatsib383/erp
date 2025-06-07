<?php

namespace App\Data\Works;

use App\Data\BaseData;

class GroupData extends BaseData
{
    public function __construct(
        public string $name,
        public int $work_category_id,
        public ?int $id,
        public ?int $sort = 0,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => 'string',
            'work_category_id' => 'integer',
            'sort' => ['nullable','integer'],
        ];
    }
}
