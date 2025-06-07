<?php

namespace App\Models\Remont;

use App\Events\Smet\Created;
use App\Events\Smet\Updated;
use App\Models\BaseModel;
use App\Models\Deals\Deal;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Smet extends BaseModel
{
    use SoftDeletes;

    protected $dispatchesEvents = [
        'created' => Created::class,
        'updated' => Updated::class,
    ];

    protected $fillable = [
        'approved',
        'act_rooms',
        'deal_id',
        'sab_ver',
        'name',
        'total',
        'discount',
        'total_discount',
        'comment',
        'rooms',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'discount' => 'decimal:2',
        'total_discount' => 'decimal:2',
        'approved' => 'boolean',
        'act_rooms' => 'boolean',
        'rooms' => 'array',
    ];

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }
}
