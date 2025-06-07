<?php

namespace App\Models\Finance;

use App\Models\Deals\Deal;
use App\Models\Staff\Employee;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;

class Deduction extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'employee_id',
        'date',
        'official_salary',
        'tax',
        'bounty',
        'fines',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
        ];
    }
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function scopeFilter(Builder $query): void
    {
        $filters = request()->collect('filter');
        if ($filters->has('prorab')) {
            $query->whereIn('employee_id',Arr::wrap($filters->get('prorab')));
        }
    }
}
