<?php

namespace App\Models\Contacts;

use App\Models\BaseModel;
use App\Models\Deals\Deal;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ModelObserver::class])]
class Contact extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'surname',
        'name',
        'patronymic',
        'phone',
        'additional',
        'type',
    ];

    protected $casts = [
        'additional' => 'array',
    ];

    protected $hidden = [
        'deleted_at'
    ];

    protected $appends = [
        'full_name'
    ];

    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }

    public function deals(): BelongsToMany
    {
        return $this->belongsToMany(Deal::class);
    }
    public function getFullNameAttribute(): string
    {
        return trim(implode(' ', array_filter([
            $this->surname,
            $this->name,
            $this->patronymic
        ])));
    }

    public function scopeSearch(Builder $query): void
    {
        $search = request()->query('search', false);

        if ($search !== false) {
            $query->whereSearch($this->fillable, $search);
        }
    }
    public function toEventText(): string
    {
        return $this->getFullNameAttribute();
    }
}
