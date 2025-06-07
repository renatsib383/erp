<?php

if (! function_exists('tg')) {
    function tg($data): string
    {
        $token = '1704916813:AAFfzDVUImWe5RGykBcQ_D476_znPZ5CLsY';
        $chat_id = '-4009814113';
        $url = "https://api.telegram.org/bot$token/sendMessage";
        
        

        if (is_array($data)) {
            $data = json_encode($data, JSON_UNESCAPED_UNICODE + JSON_PRETTY_PRINT + JSON_UNESCAPED_SLASHES + JSON_NUMERIC_CHECK);
            $data = '<pre>'."\n".$data."\n".'</pre>';
        }

        $response = Http::post($url, [
            'chat_id' => $chat_id,
            'text' => $data,
            'parse_mode' => 'html',
        ]);

        return $response->body();
    }
}
