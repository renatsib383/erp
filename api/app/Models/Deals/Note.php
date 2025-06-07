<?php

namespace App\Models\Deals;

use App\Models\BaseModel;
use App\Models\User;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Note extends BaseModel
{
    use BroadcastsEvents,SoftDeletes;

    protected $fillable = [
        'deal_id',
        'sab_id',
        'text',
        'file',
        'user_id',
        'recipient'
    ];

    protected $casts = [
        'file' => 'array',
    ];

    protected $hidden = [
        'sab_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient');
    }

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class, 'deal_id');
    }

    public function broadcastOn(string $event): array
    {
        $this->load('user');
        return match ($event) {
            'created', 'updated', 'deleted' => [new PresenceChannel('feed.'.$this->deal_id)],
            default => [],
        };
    }

}
