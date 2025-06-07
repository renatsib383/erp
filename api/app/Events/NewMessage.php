<?php

namespace App\Events;

use App\Models\Communications\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Message $message) {
        $this->message->refresh()->load(['user','recipient']);
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('chat.'.$this->message->room),
        ];
    }
}
