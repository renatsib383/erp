<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GitlabWebhookController extends Controller
{

    public function handle(Request $request)
    {
        $payload =  $request->all();
        $message = $this->formatPushMessage($payload);
        $this->sendToTelegram($message);
        return response()->json(['message' => '1Webhook processed']);
    }

    private function formatPushMessage($payload)
    {
        $project = $payload['project']['name'];
        $branch = str_replace('refs/heads/', '', $payload['ref']);
        $commit = $payload['commits'][0];
        $author = $payload['user_name'];
        $message = "✅ {$author} *{$project}* (ветка: *{$branch}*)\n";
        $message .= "{$commit['message']}";

        return $message;
    }


    private function sendToTelegram($message)
    {
        $botToken = '7741061384:AAH0ruM4p9FI3t_hXeAiTWUZy0gqY2G1hBg';
        $chatId = '-1002170808385';
        
        Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'Markdown'
        ]);
    }
}
