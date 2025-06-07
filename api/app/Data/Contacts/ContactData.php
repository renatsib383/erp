<?php

namespace App\Data\Contacts;

use App\Data\BaseData;
use App\Models\Contacts\Contact;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class ContactData extends BaseData
{
    public function __construct(
        public string $phone,
        public ?int $id,
        public ?string $name,
        public ?string $surname,
        public ?string $patronymic,
        public ?string $full_name,
        public mixed $events,
        public mixed $deals,
    ) {}
    public static function rules(ValidationContext $context): array
    {
        return [
            'phone' => ['required', 'string', 'max:255', Rule::unique(Contact::class)->ignore(request()->route('contact'))],
//            'surname' => ['string', 'max:255'],
            'name' => ['string', 'max:255'],
//            'patronymic' => ['string', 'max:255'],
        ];
    }
}
