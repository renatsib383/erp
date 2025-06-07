<?php

namespace App\Data\Staff;


use App\Data\BaseData;

class EmployeeData extends BaseData
{
    public function __construct(
        public string $fio,
        public string $phone,
        public string $email,
        public ?string $short_name,
        public ?int $id,
        public ?int $chief,
        public ?int $position_id,
        public mixed $events,
    ) {}

    public static function rules(): array
    {
        return [
            'fio' => ['required','string'],
            'phone' => ['required','string'],
            'email' => ['required','string'],
            'chief' => ['nullable','integer'],
            'position_id' => ['nullable','integer'],
        ];
    }
}
