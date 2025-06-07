<?php

namespace App\Models\Divisions;

use App\Models\BaseModel;
use App\Models\Staff\Position;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;


#[ObservedBy([ModelObserver::class])]
class Company extends BaseModel
{
    protected $fillable = [
        'name',
        'price',
        'company_id',
        'sort',
    ];

    protected $casts = [
        'price' => 'array',
    ];

    public function positions() : BelongsToMany
    {
        return $this->belongsToMany(Position::class)
            ->withPivot('salary');
    }

    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
