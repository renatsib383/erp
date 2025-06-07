<?php

namespace App\Data\Deals;

use App\Data\BaseData;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Date;

class DealData extends BaseData
{
    public function __construct(
        public string $uid,
        public ?int $id,
        public ?int $company_id = 1,
        public ?string $address,
        public ?int $budget_sum = 0,
        public ?float $confirmed_smet_sum = 0,
        public ?int $additional_works_sum = 0,
        public ?array $tags,
        public ?array $stages,
        public ?array $contacts,
        public ?int $facility_type = 0,
        public ?int $facility_condition = 0,
        public ?int $renovation_type = 0,
        public ?string $partner,
        public ?bool $agent = false,
        public ?string $region,
        public ?int $temperature,
        public ?string $lead_source,
        public ?float $skidka = 0,
        public ?float $prepayment = 0,
        public ?float $coef = 1,
        public ?int $responsible,
        public ?int $designer,
        public ?int $operator,
        public ?int $prorab,
        public ?int $zamerman,
        #[Date]
        public ?string $created_at,
        #[Date]
        public ?string $updated_at,
        public ?array $price,
        #[Date]
        public ?string $date_start,
        #[Date]
        public ?string $date_end,
        public ?array $geo,
        public ?bool $deferred_discount = false,
        public ?bool $confirm_act = false,
        public ?float $coef_price_master,
        public ?float $hold_master,
        public ?float $forced_percent_master,
        public ?float $increase_master,
        public ?float $forced_percent_prorab,
        public ?float $coef_additional_partner,
        public ?bool $deferred_skidka_paid = false,
    ) {}

    public static function rules(): array
    {
        return [
            'uid' => ['required', 'string', 'max:255', Rule::unique('deals')->ignore(request()->route('deal'))],
            'company_id' => ['nullable', 'integer'],
            'address' => ['nullable', 'string', 'max:255'],
            'budget_sum' => ['nullable', 'integer'],
            'confirmed_smet_sum' => ['nullable', 'numeric'],
            'additional_works_sum' => ['nullable', 'integer'],
            'tags' => ['nullable', 'array'],
            'contacts' => ['nullable', 'array'],
            'facility_type' => ['nullable', 'integer'],
            'facility_condition' => ['nullable', 'integer'],
            'renovation_type' => ['nullable', 'integer'],
            'partner' => ['nullable', 'string', 'max:255'],
            'agent' => ['nullable', 'boolean'],
            'region' => ['nullable', 'string', 'max:255'],
            'temperature' => ['nullable', 'integer'],
            'lead_source' => ['nullable', 'string', 'max:255'],
            'skidka' => ['nullable', 'numeric'],
            'coef' => ['nullable', 'numeric'],
            'responsible' => ['nullable', 'integer'],
            'designer' => ['nullable', 'integer'],
            'operator' => ['nullable', 'integer'],
            'prorab' => ['nullable', 'integer'],
            'zamerman' => ['nullable', 'integer'],
            'price' => ['nullable', 'array'],
            'stages' => ['nullable', 'array'],
            'date_start' => ['nullable', 'date'],
            'date_end' => ['nullable', 'date'],
            'geo' => ['nullable', 'array'],
            'deferred_discount' => ['nullable', 'boolean'],
            'confirm_act' => ['nullable', 'boolean'],
            'coef_price_master' => ['nullable', 'numeric'],
            'hold_master' => ['nullable', 'numeric'],
            'forced_percent_master' => ['nullable', 'numeric'],
            'increase_master' => ['nullable', 'numeric'],
            'forced_percent_prorab' => ['nullable', 'numeric'],
            'coef_additional_partner' => ['nullable', 'numeric'],
            'prepayment' => ['nullable', 'numeric'],
            'deferred_skidka_paid' => ['nullable', 'boolean'],
        ];
    }
}
