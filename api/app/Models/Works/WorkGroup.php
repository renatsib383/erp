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
class WorkGroup extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'sab_id',
        'work_category_id',
        'name',
        'sort',
    ];

    protected $hidden = [
        'sab_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    public function category(): belongsTo
    {
        return $this->belongsTo(WorkCategory::class,'work_category_id');
    }
    public function works(): hasMany
    {
        return $this->hasMany(Work::class);
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
