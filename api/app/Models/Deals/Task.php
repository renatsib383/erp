<?php

namespace App\Models\Deals;

use App\Events\Task\Created;
use App\Events\Task\Updated;
use App\Models\BaseModel;
use App\Models\System\ModelEvent;
use App\Models\User;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[ObservedBy([ModelObserver::class])]
class Task extends BaseModel
{
    protected $dispatchesEvents = [
        'created' => Created::class,
        'updated' => Updated::class,
    ];


    protected $fillable = [
        'all_day',
        'start',
        'end',
        'title',
        'description',
        'author',
        'performer',
        'type',
        'status',
        'deal_id',
        'duration',
        'completed',
    ];

    protected $casts = [
        'start' => 'datetime',
        'end' => 'datetime',
        'all_day' => 'boolean',
        'completed' => 'boolean',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author');
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performer');
    }

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }

    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
