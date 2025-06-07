<?php

namespace App\Listeners;

use App\Events\NewMessage;
use App\Events\UpdateMessage;
use App\Models\Communications\ImGroup;
use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use App\Models\User;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

class ImboxUpdate
{
    /**
     * Handle the event.
     */
    public function handle(NewMessage|UpdateMessage $event): void
    {
        $user = Auth::user();
        $event->message->load(['user', 'replyTo.user']);
        $message = $event->message->toArray();

        if ($message['user']['id'] === 42) {
            $message['user']['name'] = $message['user']['fio'] = Contact::where('phone', $message['phone'])->get()->first()?->name;
        }
        $roomParts = explode('__', $message['room']);
        $data = [
            'room' => $message['room'],
            'type' => $roomParts[0],
            'last_message' => $message,
        ];
        switch ($roomParts[0]){
            case 'deal':
                $deal = Deal::find($roomParts[1]);

                $data['deal']['id'] = $deal?->id;
                $data['deal']['uid'] = $deal?->uid;

                $data['title'] = 'Сделка - '.$deal?->uid;

                $data['users'] = array_filter([
                    $deal?->responsible,
                    $deal?->designer,
                    $deal?->operator,
                    $deal?->zamerman,
                    $deal?->prorab
                ]);
                break;
            case 'group':
                $group = ImGroup::find($roomParts[1]);
                $data['title'] = $group->title;
                $data['users'] = $group->users()->pluck('id');
                break;
            case 'user':
                $users = explode('_', $roomParts[1]);
                if((int)$users[0] !== $user->id){
                    $data['title'] = User::find($users[0])->name;
                }else{
                    $data['title'] = User::find($users[1])->name;
                }
                $data['users'] = [(int)$users[0],(int)$users[1]];
                break;
        }

        Broadcast::broadcast([new PresenceChannel('imbox')], 'App\\Events\\Update', [
            'data' => $data,
            'needReaction' => $event->message->needReaction(),
        ]);

    }
}
