<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Notifications\InlineNotification;

class SendNotification extends Command
{
    protected $signature = 'notification:send {user_id?} {message?} {--all}';
    protected $description = 'Отправка уведомления пользователю через WebSocket';

    public function handle(): int
    {
        $message = $this->argument('message') ?? $this->ask('Введите сообщение:');

        if ($this->option('all')) {
            $this->sendToAllUsers($message);
            return 0;
        }

        return $this->sendToSingleUser($message);
    }

    private function sendToAllUsers(string $message): void
    {
        User::chunk(100, function ($users) use ($message) {
            foreach ($users as $user) {
                $user->notify(new InlineNotification($message));
            }
        });

        $this->info("Уведомление отправлено всем пользователям!");
    }

    private function sendToSingleUser(string $message): int
    {
        $userId = $this->argument('user_id') ?? $this->ask('Введите ID пользователя:');
        $user = User::find($userId);

        if (!$user) {
            $this->error('Пользователь не найден!');
            return 1;
        }

        $user->notify(new InlineNotification($message));
        $this->info("Уведомление отправлено пользователю {$user->name}!");
        return 0;
    }
}
