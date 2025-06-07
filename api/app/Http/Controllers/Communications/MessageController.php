<?php

namespace App\Http\Controllers\Communications;

use App\Data\Communications\MessageData;
use App\Http\Controllers\Controller;
use App\Jobs\MessageImageOptimize;
use App\Models\Communications\Message;
//use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class MessageController extends Controller
{
    public function index()
    {
        $data = MessageData::empty();
        $fields = array_keys($data);

        unset($data['room']);
        $filters = array_keys($data);
        $filters[] = AllowedFilter::exact('room');

        $data =  QueryBuilder::for(Message::class)
            ->allowedFields($fields)
            ->allowedIncludes(['user','recipient','replyTo.user'])
            ->allowedFilters($filters)
            ->allowedSorts($fields);

        return ['data' => $data->get()];
        //return $data->jsonPaginate();
    }


    public function store(MessageData $request)
    {
        $data = $request->toModel();
        $data['user_id'] = auth()->user()?->id ?? 0;

        $message = Message::create($data);
        $this->clientChat($message);

        return $this->show($message);
    }

    public function show(Message $message)
    {
        return MessageData::from($message);
    }

    public function update(MessageData $request, Message $message)
    {
        $message->update($request->toModel());

        return MessageData::from($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json(null, 204);
    }

    public function upload(Request $request)
    {
        if ($request->file('file')->isValid() && $request->has('room')) {

            $uploadedFile = $request->file('file');
            $room = $request->input('room');
            $phone = $request->input('phone');

            $file = [
                'name' => $uploadedFile->getClientOriginalName(),
                'ext' => $uploadedFile->extension(),
                'size' => $uploadedFile->getSize(),
                'url' => $uploadedFile->store($room, 'chat'),
                'mime' => $uploadedFile->getMimeType(),
                'dimensions' => $uploadedFile->dimensions(),
            ];

            $message = new Message;
            $message->room = $room;
            $message->file = $file;
            $message->phone = $phone;
            $message->recipient = $request->input('recipient');
            $message->reply_to = $request->input('reply_to', 0);
            $message->user()->associate(auth()->user());
            $message->save();

            if(str_contains($file['mime'],'image')){
                MessageImageOptimize::dispatch($message);
            }

            $this->clientChat($message);

            return response()->json(['file' => $file]);
        }

        return response('room and file is required', 400);
    }

    public function getFile(Message $message)
    {
        $file = $message->file;

        return Storage::disk('chat')->download($file['url'], $file['name']);
    }

    private function clientChat(Message $message): void
    {
        if(!is_null($message->phone)){
            $user = User::find($message->user_id);

            $wa_message = sprintf("👤*%s*\n %s", $user->name, $message->text);

            /*$role = Role::find($user->role_id);
            $wa_message = sprintf("👤*%s (%s)*\n %s", $user->fio, $role->description, $message->text);*/
            //tg($wa_message);

            $data = [
                'domain' => 'whatsapp',
                'source' => '79130133674',
                'client' => $message->phone,
                'text' => $wa_message,
            ];

            /// Цитирование
            if ($message->reply_to !== 0) {
                $data['message_id'] = Message::find($message->reply_to)->whatsapp_id;
            }

            $http = Http::withQueryParameters(['key' => 'e4f0c6469bbf7edc450e90887d694c4a']);

            //Отправка файлов
            if (! is_null($message->file)) {
                $http->attach(
                    'attachment',
                    Storage::disk('chat')->get($message->file['url']),
                    $message->file['name'],
                    [
                        'Content-Type' => $message->file['mime'],
                    ]
                );
            }
            $response = $http->post(
                'https://app.i2crm.ru/api_v1/target/feedback',
                $data
            );

            $res = $response->json();

            $message->whatsapp_id = $res['data']['external_ids'][0];
            $message->save();
        }
    }

    public function markViewed(Message $message)
    {
        $message->is_viewed = true;
        $message->save();

        return $message->load(['replyTo.user', 'user']);
    }

}
