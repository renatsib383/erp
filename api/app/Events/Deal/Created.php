<?php

namespace App\Events\Deal;

use Illuminate\Broadcasting\PresenceChannel;

class Created extends Base
{
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('deals'),
        ];
    }
}
