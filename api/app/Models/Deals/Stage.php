<?php

namespace App\Models\Deals;

use App\Models\BaseModel;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ModelObserver::class])]
class Stage extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'color',
        'amo_id',
        'pipeline_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
        'amo_id',
        'sab_id',
        'pipeline_id',
    ];

    public function toEventText(): string
    {
        return '<div class="grid grid-cols-2">
                  <span class="border-[1px] p-1">'.$this->pipeline->name.'</span>
                  <span class="p-1 border-[1px] dark:text-surface-700" style="background-color: '.$this->color.'">'.$this->title.'</span>
              </div>';
    }

    public function deals(): BelongsToMany
    {
        return $this->belongsToMany(Deal::class);
    }

    public function pipeline(): BelongsTo
    {
        return $this->belongsTo(Pipeline::class, 'pipeline_id')->select(['id', 'name']);
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
