<?php

namespace App\Models\Works;

use App\Models\BaseModel;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ModelObserver::class])]
class WorkCategory extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'sab_id',
        'name',
        'room_types',
        'sort',

    ];
    protected $casts = [
        'room_types' => 'array',
    ];
    protected $hidden = [
        'sab_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function groups(): hasMany
    {
        return $this->hasMany(WorkGroup::class)->orderBy('sort');
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
