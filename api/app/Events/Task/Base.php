<?php

namespace App\Events\Task;

use App\Models\Deals\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Base  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $task;

    /**
     * Created a new event instance.
     */
    public function __construct(private readonly Task $model)
    {
        $this->model->load(['performer']);
        $stages = $this->model->deal->stages()->get('id')->pluck('id');
        $this->task = $this->model->toArray();
        $this->task['deal']['stages'] = $stages;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('tasks'),
        ];
    }
}
