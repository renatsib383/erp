<?php

namespace App\Data\Communications;

use Spatie\LaravelData\Data;

class CallData extends Data
{
    public function __construct(
        public int $id,
        public string $type,
        public int $deal_id,
        public string $client_phone,
        public string $user_phone,
        public ?string $uis_login,
        public ?string $scenario,
        public ?array $employee,
        public ?array $record
    ) {}
}
