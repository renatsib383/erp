<?php

namespace App\Models\Staff;

use App\Models\BaseModel;
use App\Models\Divisions\Company;
use App\Models\System\ModelEvent;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphOne;

#[ObservedBy([ModelObserver::class])]
class Employee extends BaseModel
{
    protected $fillable = [
        'sab_id',
        'fio',
        'phone',
        'email',
        'chief',
        'position_id',
        'company_id',
        'gender',
        'short_name',
        'address',
        'work_phone',
        'inn',
        'snils',
        'salary',
        'tax',
        'passport',
        'documents',
        'photo',
        'birthday',
        'hired',
        'fired',
        'sort',
    ];

    protected $casts = [

        'birthday' => 'date',
        'hired' => 'date',
        'fired' => 'date',
        'passport' => 'array',
        'documents' => 'array',
    ];

    public function chief(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'chief');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function toEventText(): string
    {
        return $this->fio;
    }

    public function user(): MorphOne
    {
        return $this->morphOne(User::class, 'profile');
    }

    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }
}
