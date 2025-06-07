<?php

namespace App\Models\Divisions;

use App\Models\BaseModel;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\MorphMany;
#[ObservedBy([ModelObserver::class])]
class LegalEntity extends BaseModel
{
    protected $fillable = [
        'type',
        'full_name',
        'short_name',
        'phone',
        'email',
        'website',
        'city',
        'legal_address',
        'director',
        'glavbuh',
        'inn',
        'kpp',
        'ogrn',
        'oktmo',
        'okpo',
        'registration_date',
        'bank_accounts',
        'facsimile',
        'stamp',
        'logo',
        'sort',
    ];

    protected $casts = [
        'bank_accounts' => 'array',
    ];

    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
