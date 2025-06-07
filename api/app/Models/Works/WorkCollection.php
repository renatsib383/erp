<?php

namespace App\Models\Works;

use App\Models\BaseModel;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[ObservedBy([ModelObserver::class])]
class WorkCollection extends BaseModel
{
    protected $fillable = [
        'sab_id',
        'name',
        'room_type',
        'works',
        'sort',
    ];

    protected $casts = [
        'works' => 'array',
    ];

    protected $hidden = [
        'sab_id',
    ];
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
