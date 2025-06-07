<?php

namespace App\Data\Communications;

use App\Data\BaseData;

class MessageData extends BaseData
{
    public function __construct(
        public string $room,
        public ?int $reply_to,
        public ?bool $is_viewed,
        public ?int $id,
        public ?int $user_id,
        public ?string $text,
        public ?array $file,
        public ?int $recipient,
        public ?string $audio,
        public ?string $phone,
        public ?string $whatsapp_id,
    ) {}
    public static function rules(): array
    {
        return [
            'room' => ['required','string'],
            'is_viewed' => ['nullable','boolean'],
            'reply_to' => ['nullable','integer'],
            'text' => ['nullable','string'],
            'file' => ['nullable','array'],
            'recipient' => ['nullable','numeric'],
            'audio' => ['nullable','string'],
            'phone' => ['nullable','string'],
            'whatsapp_id' => ['nullable','string'],
        ];
    }
}
