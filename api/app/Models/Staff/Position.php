<?php

namespace App\Models\Staff;

use App\Models\BaseModel;
use App\Models\Divisions\Company;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ModelObserver::class])]
class Position extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'sort',
    ];

    public function companies() : BelongsToMany
    {
        return $this->belongsToMany(Company::class)
            ->withPivot('salary');
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
