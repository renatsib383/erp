<?php

namespace App\Data\Remont;

use App\Data\BaseData;
use Spatie\LaravelData\Attributes\Validation\Date;

class ActData extends BaseData
{
    public function __construct(
        public int $deal_id,
        public ?int $id,
        public ?int $user_id,
        public ?int $status = 0,
        public ?int $total = 0,
        public ?int $additional = 0,
        public ?array $works,
        #[Date]
        public ?string $date_sign,
        #[Date]
        public ?string $date_paid,
    ) {}

    public static function rules(): array
    {
        return [
            'deal_id' => ['required', 'exists:deals,id'],
            'user_id' => 'numeric',
            'status' => 'numeric',
            'total' => 'numeric',
            'additional' => ['nullable', 'numeric'],
            'works' => ['nullable', 'array'],
            'date_sign' => ['nullable', 'date'],
            'date_paid' => ['nullable', 'date'],
        ];
    }
}
