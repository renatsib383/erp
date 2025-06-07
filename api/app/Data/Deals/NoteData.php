<?php

namespace App\Data\Deals;


use App\Data\BaseData;

class NoteData extends BaseData
{
    public function __construct(
        public int $deal_id,
        public ?int $id,
        public ?int $user_id,
        public ?string $text,
        public ?array $file,
        public ?int $recipient,
    ) {}
    public static function rules(): array
    {
        return [
            'deal_id' => ['required','numeric'],
            'text' => ['nullable','string'],
            'file' => ['nullable','array'],
            'recipient' => ['nullable','numeric'],
        ];
    }
}
