<?php

namespace App\Http\Controllers\Communications;

use App\Http\Controllers\Controller;
use App\Models\Contacts\Contact;
use App\Models\Communications\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WhatsappController extends Controller
{
    public function webhook(Request $request)
    {
        $data = $request->all();

        //tg($data);
        if ($data['incoming'] == 'true') {
            $contact = Contact::where('phone', $data['client_id'])->get()->first();
            if ($contact) {
                $deal = $contact->deals()->get()->last();
                if ($deal) {
                    $message = new Message;
                    $message->room = 'deal__'.$deal->id;
                    $message->text = $data['text'];
                    $message->phone = $data['client_id'];
                    $message->whatsapp_id = $data['external_id'];

                    if (isset($data['quoted_message'])) {
                        $reply = Message::where('whatsapp_id', $data['quoted_message']['external_id'])->get()->first();
                        $message->recipient = $reply->user_id ?? null;
                        $message->reply_to = $reply->id ?? 0;
                    }

                    //теперь ок
                    if (isset($data['src'])) {
                        $url = $data['src'];

                        $file = Http::get($url);
                        $disk = Storage::disk('chat');

                        $url_parts = explode('/', $url);
                        $filename = end($url_parts);
                        $filename_parts = explode('.', $filename);
                        $ext = end($filename_parts);

                        $path = $message->room.'/'.Str::random(40).'.'.$ext;

                        if ($disk->put($path, $file->body())) {
                            if (! is_null($data['caption'])) {
                                $filename = $data['caption'];
                            }
                            $file = [
                                'name' => $filename,
                                'ext' => $ext,
                                'size' => $disk->size($path),
                                'url' => $path,
                                'mime' => $disk->mimeType($path),
                                'dimensions' => @getimagesize($disk->path($path)),
                            ];
                            $message->file = $file;
                        }
                    }

                    $message->user()->associate(User::find(42));
                    $message->save();
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
