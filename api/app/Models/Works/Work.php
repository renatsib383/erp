<?php

namespace App\Models\Works;

use App\Models\BaseModel;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ModelObserver::class])]
class Work extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'id',
        'name',
        'price',
        'default_value',
        'work_group_id',
        'factor',
        'ed',
        'description',
        'sab_id',
        'type',
        'sort',
    ];

    protected $hidden = [
        'sab_id',
        'deleted_at',
    ];

    public function products(): hasMany
    {
        return $this->hasMany(WorkProduct::class);
    }
    public function group(): belongsTo
    {
        return $this->belongsTo(WorkGroup::class,'work_group_id');
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
