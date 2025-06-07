<?php

namespace App\Data\Deals;

use App\Data\BaseData;

class PipelineData extends BaseData
{
    public function __construct(
        public string $name,
        public bool $archive,
        public ?int $id,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required','string'],
            'archive'=>['boolean'],
        ];
    }
}
