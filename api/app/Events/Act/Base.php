<?php

namespace App\Events\Act;

use App\Models\Remont\Act;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Base  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Act $act
    )
    {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('deal.'.$this->act->deal_id),
        ];
    }
}
