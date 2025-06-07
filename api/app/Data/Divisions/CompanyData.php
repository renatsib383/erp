<?php
namespace App\Data\Divisions;
use App\Data\BaseData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\Validation\Date;

class CompanyData extends BaseData
{
    public function __construct(
        public string $name,
        public int $type,
        public ?string $full_name,
        public ?string $short_name,
        public ?string $phone,
        public ?string $email,
        public ?string $website,
        public ?string $city,
        public ?string $legal_address,
        public ?string $director,
        public ?string $glavbuh,
        public ?string $inn,
        public ?string $kpp,
        public ?string $ogrn,
        public ?string $oktmo,
        public ?string $okpo,
        #[Date]
        public ?string $registration_date,
        public ?array $bank_accounts,
        public ?string $facsimile,
        public ?string $stamp,
        public ?string $logo,
        public ?int $sort,
        public ?int $id,
        public mixed $events,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['string', 'max:255'],
            'type' => ['integer'],
            'full_name' => ['nullable', 'string', 'max:255'],
            'short_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'website' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'legal_address' => ['nullable', 'string', 'max:255'],
            'director' => ['nullable', 'string', 'max:255'],
            'glavbuh' => ['nullable', 'string', 'max:255'],
            'inn' => ['nullable', 'string', 'max:255'],
            'kpp' => ['nullable', 'string', 'max:255'],
            'ogrn' => ['nullable', 'string', 'max:255'],
            'oktmo' => ['nullable', 'string', 'max:255'],
            'okpo' => ['nullable', 'string', 'max:255'],
            'registration_date' => ['nullable', 'date'],
            'bank_accounts' => ['array'],
            'facsimile' => ['nullable', 'string', 'max:255'],
            'stamp' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'integer'],
        ];
    }
}
