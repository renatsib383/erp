<?php

namespace App\Data\Deals;

use App\Data\BaseData;
use Spatie\LaravelData\Attributes\Validation\Date;

class TaskData extends BaseData
{
    public function __construct(
        #[Date]
        public $start,
        public bool $all_day,
        #[Date]
        public $end,
        public ?int $id,
        public ?string $title,
        public ?string $description,
        public ?int $author,
        public ?int $performer,
        public ?int $type,
        public ?int $status,
        public ?int $deal_id,
        public ?int $duration,
        public ?bool $completed,
    ) {}

    public static function rules(): array
    {
        return [
            'start' => ['required', 'date'],
            'all_day' => ['required', 'boolean'],
            'end' => ['nullable', 'date', 'after_or_equal:start'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable'],
            'performer' => ['nullable', 'numeric'],
            'type' => ['nullable', 'numeric'],
            'status' => ['nullable', 'numeric'],
            'deal_id' => ['nullable', 'numeric'],
            'duration' => ['nullable', 'numeric'],
            'completed' => ['nullable', 'boolean'],
            'author' => ['exclude'],
        ];
    }
}
