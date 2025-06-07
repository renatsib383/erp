<?php

namespace App\Events\Smet;

use App\Models\Remont\Smet;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Base  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Smet $smet
    )
    {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('deal.'.$this->smet->deal_id),
        ];
    }
}
