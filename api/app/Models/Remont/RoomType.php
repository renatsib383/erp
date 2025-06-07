<?php

namespace App\Models\Remont;

use App\Models\BaseModel;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ModelObserver::class])]
class RoomType extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'sort',
    ];
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
