<?php

namespace App\Data\Finance;

use App\Data\BaseData;
use Spatie\LaravelData\Attributes\Validation\Date;

class PaymentData extends BaseData
{
    public function __construct(
        public ?int $id,

        public ?int $user_id,
        public ?int $deal_id,
        public ?int $cash_register_id,
        public ?int $cash_register_recipient_id,
        public ?int $type,
        public ?int $status,
        public ?int $total,
        public ?bool $final_act,
        public ?float $partial_payment,
        public ?float $deposit_minus,
        public ?float $discount_minus,
        public ?array $files,
        #[Date]
        public ?string $date_transaction,
        public ?string $comment,
        public ?string $item,
        public ?int $prorab,
    ) {}

    public static function rules(): array
    {
        return [
            'final_act' => ['nullable','boolean'],
            'partial_payment' => ['nullable', 'numeric'],
            'deposit_minus' => ['nullable', 'numeric'],
            'discount_minus' => ['nullable', 'numeric'],
            'date_transaction' => ['nullable', 'date'],
            'type' => ['nullable', 'integer'],
            'comment' => ['nullable','string'],
            'user_id' => ['nullable', 'integer'],
            'deal_id' => ['nullable', 'integer'],
            'cash_register_id' => ['nullable', 'integer'],
            'cash_register_recipient_id' => ['nullable', 'integer'],
            'total' => ['nullable', 'numeric'],
            'item' => ['nullable', 'string'],
            'files' => ['nullable', 'array'],
            'status' => ['nullable','integer'],
            'prorab' => ['nullable','integer'],
        ];
    }
}
