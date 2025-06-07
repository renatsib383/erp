<?php

namespace App\Events\Deal;

use App\Models\Deals\Deal;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Base  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $deal;

    public function __construct(Deal $deal)
    {
        $this->deal = $deal->loadMissing('stages.pipeline')->toArray();
    }

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('deals'),
            new PresenceChannel('deal.'.$this->deal['id']),
        ];
    }
}
