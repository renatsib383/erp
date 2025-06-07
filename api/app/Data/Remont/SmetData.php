<?php

namespace App\Data\Remont;


use App\Data\BaseData;
use Spatie\LaravelData\Attributes\Validation\Date;

class SmetData extends BaseData
{
    public function __construct(
        public int $deal_id,
        public string $name,
        public ?int $id,
        public ?bool $approved=false,
        public ?bool $act_rooms=false,
        public ?float $total=0,
        public ?float $discount=0,
        public ?float $total_discount=0,
        public ?string $comment,
        public ?array $rooms,
        #[Date]
        public ?string $created_at,
        #[Date]
        public ?string $updated_at,
    ) {}

    public static function rules(): array
    {
        return [
            'deal_id' => ['required', 'exists:deals,id'],
            'name' => ['required', 'string'],
            'approved' => ['boolean'],
            'act_rooms' => ['boolean'],
            'total' => ['numeric'],
            'discount' => ['numeric'],
            'total_discount' => ['numeric'],
            'comment' => ['nullable', 'string'],
            'rooms' => ['nullable', 'array'],
        ];
    }
}
