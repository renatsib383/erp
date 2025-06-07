<?php

namespace App\Models\Communications;

use App\Events\NewCall;
use App\Models\BaseModel;
use App\Models\Deals\Deal;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Call extends BaseModel
{
    protected $fillable = [
        'type',
        'deal_id',
        'client_phone',
        'user_phone',
        'uis_login',
        'scenario',
        'employee',
        'record'
    ];
    protected $dispatchesEvents = [
        'created' => NewCall::class,
    ];

    protected $casts = [
        'employee' => 'array',
        'record' => 'array',
    ];

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uis_login', 'email')->select(['id', 'name', 'email']);
    }
}
