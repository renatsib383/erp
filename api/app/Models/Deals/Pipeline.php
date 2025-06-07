<?php

namespace App\Models\Deals;

use App\Models\BaseModel;

use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ModelObserver::class])]
class Pipeline extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'amo_id',
        'sab_id',
        'archive',
    ];

    protected $casts = [
        'archive' => 'boolean',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'amo_id',
        'sab_id',
    ];

    public function deals(): HasMany
    {
        return $this->HasMany(Deal::class);
    }

    public function stages(): HasMany
    {
        return $this->HasMany(Stage::class);
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
