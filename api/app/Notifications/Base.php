<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class Base extends Notification
{
    use Queueable;

    public Carbon $date;
    /**
     * Create a new notification instance.
     */
    public function __construct(public string $title, public ?string $body ='', public ?string $link = null)
    {
        $this->date = now();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = [];

        $channels[] = 'database';
        $channels[] = 'broadcast';
        $channels[] = WebPushChannel::class;

        return $channels;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'body' => $this->body,
            'link' => $this->link,
            'date' => $this->date
        ];
    }
    public function toWebPush($notifiable, $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title($this->title)
            //->icon('/approved-icon.png')
            ->body($this->body)
            //->action('View account', 'view_account')
            //->options(['TTL' => 1000]);
            ->data([
                'id' => $notification->id,
                'link' => $this->link,
                'date' => $this->date
            ])
            ->tag('atlon-notification');
    }
}
