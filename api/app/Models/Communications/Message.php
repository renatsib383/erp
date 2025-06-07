<?php

namespace App\Models\Communications;

use App\Events\NewMessage;
use App\Events\UpdateMessage;
use App\Models\BaseModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

class Message extends BaseModel
{
    protected $attributes = [
        'reply_to' => 0,
        'is_viewed' => false,
    ];

    protected $fillable = [
        'room',
        'text',
        'file',
        'user_id',
        'recipient',
        'reply_to',
        'audio',
        'phone',
        'is_viewed',
        'whatsapp_id',
    ];
    protected $dispatchesEvents = [
        'created' => NewMessage::class,
        'updated' => UpdateMessage::class,
    ];

    protected $casts = [
        'file' => 'array',
        'is_viewed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')
            ->select('id', 'name');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient')
            ->select('id', 'name');
    }

    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(static::class, 'reply_to');
    }

    public static function needReaction(Collection $lastMessages = new Collection): int
    {
        if ($lastMessages->isEmpty()) {
            $lastMessages = self::lastMessagesIds();
        }

        return self::whereIn('id', $lastMessages)
            ->where('user_id', '=', 42)
            ->where('is_viewed', 0)
            ->count();
    }

    public static function lastMessagesIds($roomsList = []): Collection
    {
        $messages = self::selectRaw('room, max(id) as id')
            ->groupBy('room')
            ->whereIn('room', $roomsList);

        return $messages->get()->pluck('id');
    }
}
