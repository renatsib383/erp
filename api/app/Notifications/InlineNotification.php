<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class InlineNotification extends Notification
{

    public function __construct(private $message)
    {
    }

    public function via(): array
    {
        return ['broadcast', 'database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'message' => $this->message,
            'user_id' => $notifiable->id
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'user_id' => $notifiable->id
        ]);
    }
}
