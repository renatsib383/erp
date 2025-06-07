<?php

namespace App\Data\Finance;

use App\Data\BaseData;
use Spatie\LaravelData\Attributes\Validation\Date;

class DeductionData extends BaseData
{
    public function __construct(
        public int $employee_id,
        public ?int $id,
        #[Date]
        public ?string $date,
        public ?int $official_salary,
        public ?int $tax,
        public ?int $bounty,
        public ?int $fines,
    )
    {}

    public static function rules(): array
    {
        return [
            'employee_id' => ['required', 'integer'],
            'date' => ['nullable', 'date'],
            'official_salary' => ['nullable', 'numeric'],
            'tax' => ['nullable', 'numeric'],
            'bounty' => ['nullable', 'numeric'],
            'fines' => ['nullable', 'numeric'],
        ];
    }
}
