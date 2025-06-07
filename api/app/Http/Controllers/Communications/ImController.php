<?php

namespace App\Http\Controllers\Communications;

use App\Http\Controllers\Controller;
use App\Models\Communications\ImGroup;
use App\Models\Communications\Message;
use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use App\Models\Deals\Pipeline;
use App\Models\User;
use App\Traits\Fields;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ImController extends Controller
{
    use Fields;

    public function lists()
    {
        $tags = DB::table('tags')
            ->select('name->ru as name')
            ->whereIn('id', function (Builder $query) {
                $query->from('taggables')->select(['tag_id'])
                    ->where('taggable_type', 'App\Models\Deals\Deal')
                    ->groupBy('tag_id');
            })
            ->get()->pluck('name');
        $pipelines = Pipeline::with(['stages'])->get()->keyBy('id');

        return [
            'fields' => $this->flatList($this->getFields('atlon.list.deal.fields')),
            'tasks' => config('atlon.list.task'),
            'users' => User::all(['id', 'name']),
            'participants' => Message::select(['user_id'])->groupBy('user_id')->get(),
            'tags' => $tags,
            'pipelines' => $pipelines,
        ];
    }

    public function messages(Request $request)
    {
        $user = Auth::user();

        $filters = $request->collect('filter');

        $types = $filters->get('type',[]);

        if( count($types)===0 || in_array('deal',$types)){
            $dealRooms = Deal::select('id')
                ->filterStages($request->get('stages'))
                ->filter()
                ->search()
                ->user($user)
                ->get()
                ->map(fn ($item) => 'deal__'.$item->id)->toArray();
        }else{
            $dealRooms = [];
        }

        if( count($types)===0 || in_array('group',$types)) {
            $groupRooms = ImGroup::select('id')
                ->whereRelation('users', 'id', $user->id)
                ->get()
                ->map(fn($item) => 'group__'.$item->id)->toArray();
        }else{
            $groupRooms = [];
        }

        if( count($types)===0 || in_array('user',$types)){
            $userRooms = Message::select('room')
                ->whereLike('room','user__'.$user->id.'_%')
                ->orWhereLike('room','user__%_'.$user->id)
                ->groupBy('room')
                ->get()->pluck('room')->toArray();
        }else{
            $userRooms = [];
        }

        $rooms = array_merge($groupRooms, $dealRooms, $userRooms);

        $lastMessages = Message::lastMessagesIds($rooms);


        $offset = $request->get('offset', 0);
        $order = $request->get('order', 0);


        $messages = Message::whereIn('id', $lastMessages);

        if ($filters->has('need_answer')) {
            $messages->where('user_id', 42);
            $messages->where('is_viewed', 0);
        }

        if ($filters->has('last_message')) {
            $last_message = $filters->get('last_message');
            $dates = [
                'start' => null,
                'end' => null,
            ];
            if (isset($last_message['endDate'])) {
                $dates['end'] = Carbon::create($last_message['endDate'])->endOfDay();
            }
            if (isset($last_message['startDate'])) {
                $dates['start'] = Carbon::create($last_message['startDate'])->startOfDay();
            }
            if (isset($last_message['lastDays'])) {
                $dates['end'] = Carbon::now()->endOfDay();
                $dates['start'] = Carbon::now()->endOfDay()->subDays($last_message['lastDays']);
            }
            if ($dates['start'] !== null || $dates['end'] !== null) {
                if ($dates['start'] !== null && $dates['end'] !== null) {
                    $messages->whereBetween('created_at', [$dates['start'], $dates['end']]);
                }
                if ($dates['start'] === null) {
                    $messages->where('created_at', '<=', $dates['end']);
                }

                if ($dates['end'] === null) {
                    $messages->where('created_at', '>=', $dates['start']);
                }
            }
        }
        if ($order) {
            $query = clone $messages;

            $messages = $messages
                ->where('user_id', 42)
                ->where('is_viewed', 0)
                ->latest()
                ->skip($offset)
                ->take(50)
                ->with(['user', 'replyTo', 'replyTo.user'])
                ->get()->toArray();

            if (count($messages) < 50) {
                $take = 50 - count($messages);
                $mes = $query
                    ->whereNot('user_id', 42)
                    ->orWhereNot('is_viewed', 0)
                    ->latest()
                    ->skip($offset)
                    ->take($take)
                    ->with(['user', 'replyTo', 'replyTo.user'])->get();

                $messages = array_merge($messages, $mes->toArray());
            }
        } else {
            $messages = $messages
                ->latest()
                ->skip($offset)
                ->take(20)
                ->with(['user', 'replyTo', 'replyTo.user'])
                ->get()->toArray();
        }

        $list = [];

        foreach ($messages as $message) {
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

            $list[] = $data;
        }

        $needReaction = Message::needReaction($lastMessages);

        return response()->json(['list' => $list, 'needReaction' => $needReaction]);

    }
}
