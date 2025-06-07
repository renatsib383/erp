<?php

namespace App\Data;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Email;

class UserData extends BaseData
{
    public function __construct(
        public string $name,
        public int $status,
        public ?int $id,
        public ?int $role_id,
        public ?string $fio,
        public ?int $chief,
        public ?string $telephone,
        #[Email]
        public ?string $email,
        public ?string $password,
    ) {}
    public static function rules(): array
    {
        return [
            'email' => ['max:255', Rule::unique('users')->ignore(request()->route('user'))],
            'name'  => ['max:30', Rule::unique('users')->ignore(request()->route('user'))],
        ];
    }
}
