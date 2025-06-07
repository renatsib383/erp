<?php

namespace App\Events\Room;

use App\Models\Remont\Room;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Base  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Room $room
    )
    {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('deal.'.$this->room->deal_id),
        ];
    }
}
