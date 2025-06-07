<?php

namespace App\Models\Remont;

use App\Events\Act\Created;
use App\Events\Act\Updated;
use App\Models\BaseModel;
use App\Models\Deals\Deal;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Act extends BaseModel
{
    use SoftDeletes;

    protected $dispatchesEvents = [
        'created' => Created::class,
        'updated' => Updated::class,
    ];

    protected $fillable = [
        'sab_id',
        'sab_ver',
        'deal_id',
        'user_id',
        'status',
        'total',
        'additional',
        'works',
        'date_sign',
        'date_paid',
    ];

    protected $casts = [
        'works' => 'array',
        'date_sign' => 'date',
        'date_paid' => 'date',
    ];

    protected $hidden = [
        'sab_id',
    ];

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }
    public function prorab(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prorab');
    }
}
