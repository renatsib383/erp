<?php

namespace App\Models;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[ObservedBy([ModelObserver::class])]
class Role extends BaseModel
{
    protected $fillable = ['name', 'guard_name', 'permissions'];

    protected $casts = [
        'permissions' => 'array',
    ];


    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}




