<?php

namespace App\Http\Controllers\Communications;

use App\Http\Controllers\Controller;
use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use App\Models\Communications\Message;
use App\Models\Deals\Pipeline;

use App\Models\User;
use App\Traits\Fields;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ImboxController extends Controller
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
        $offset = $request->get('offset', 0);
        $order = $request->get('order', 0);
        $filters = $request->collect('filter');

        $need_answer = $filters->has('need_answer');

        $filters->forget('need_answer');

        $rooms = null;

        if ($request->has('search') || $request->has('stages') || $filters->count() > 0) {
            $rooms = Deal::select('id')
                ->filterStages($request->get('stages'))
                ->filter()
                ->search()
                ->get()
                ->map(fn ($item) => 'deal__'.$item->id);
        }
        $lastMessages = Message::lastMessagesIds($rooms);

        $messages = Message::whereIn('id', $lastMessages);

        if ($need_answer) {
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
                ->take(50)
                ->with(['user', 'replyTo', 'replyTo.user'])
                ->get()->toArray();
        }

        foreach ($messages as &$message) {
            $roomParts = explode('__', $message['room']);
            $deal_id = $roomParts[1];

            $deal = Deal::find($deal_id);
            $message['deal_id'] = $deal?->id;
            $message['uid'] = $deal?->uid;
            if ($message['user']['id'] === 42) {
                $message['user']['name'] = $message['user']['fio'] = Contact::where('phone', $message['phone'])->get()->first()?->name;
            }
        }

        $needReaction = Message::needReaction($lastMessages);

        return response()->json(['messages' => $messages, 'needReaction' => $needReaction]);
    }
}
