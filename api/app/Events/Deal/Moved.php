<?php

namespace App\Events\Deal;

use App\Models\Deals\Deal;
use App\Models\Deals\Stage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Moved implements ShouldBroadcast, ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Deal $deal,
        public array $attached,
        public array $detached
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('deals'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'App\\Events\\Deal\\Moved';
    }

    public function broadcastWith(): array
    {
        return [
            'deal_id' => $this->deal->id,
            'add' => Stage::with('pipeline')->whereIn('id', $this->attached)->get(),
            'remove' => Stage::with('pipeline')->whereIn('id', $this->detached)->get(),
        ];
    }
} 