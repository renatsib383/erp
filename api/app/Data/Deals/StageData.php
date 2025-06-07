<?php

namespace App\Data\Deals;

use App\Data\BaseData;

class StageData extends BaseData
{
    public function __construct(
        public int $pipeline_id,
        public string $title,
        public ?int $id,
        public ?string $color,

    ) {}

    public static function rules(): array
    {
        return [
            'title' => ['required','string'],
            'pipeline_id'=>['required','numeric'],
            'color' => ['nullable','string'],
        ];
    }
}

