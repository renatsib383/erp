<?php
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('private-chat-channel', function (User $user) {
    return $user;
});

Broadcast::channel('chat.{roomId}', function (User $user, string $roomId) {
    return ['id' => $user->id, 'info' => $user];
});

Broadcast::channel('feed.{dealId}', function (User $user, string $dealId) {
    return ['id' => $user->id, 'info' => $user];
});

Broadcast::channel('deal.{dealId}', function (User $user, string $dealId) {
    return ['id' => $user->id, 'info' => $user];
});

Broadcast::channel('deals', function (User $user) {
    return ['id' => $user->id, 'info' => $user];
});

Broadcast::channel('tasks', function (User $user) {
    return ['id' => $user->id, 'info' => $user];
});

Broadcast::channel('imbox', function (User $user) {
    return ['id' => $user->id, 'info' => $user];
});
