<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Communications\Call;
use App\Models\Communications\Message;
use App\Models\System\ModelEvent;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if($user->hasRole('Начальник Участка') || $user->hasRole('Прораб')){
            return [];
        }

        $offset = $request->query('offset',0);
        $limit = $request->query('limit',20);

        ///where('role_id',22)->
        $users = User::limit($limit)->offset($offset)->get()->keyBy('id');
        $usersIds = $users->pluck('id');
        $usersMails = $users->pluck('email');
        $userByMail = $users->pluck('id','email');

        $start = $request->get('start',Carbon::today());
        $end = $request->get('end',Carbon::today());

        $dates = CarbonPeriod::create($start, $end);

        $employers = [];

        foreach ($users as $user){
            $employers[$user->id] = [
                'id'   => $user->id,
                'name' => $user->name,
                'values' => [],
            ];
        }

        foreach ($dates as $date){
            $date = $date->format('Y-m-d');
            $messages = Message::select(['user_id','created_at'])
                ->wherein('user_id',$usersIds)
                ->whereDate('created_at',$date)->get();
            $events = ModelEvent::select(['user_id','created_at'])
                ->wherein('user_id',$usersIds)
                ->whereDate('created_at',$date)->get();
            $calls = Call::select(['uis_login','created_at'])
                ->wherein('uis_login',$usersMails)
                ->whereDate('created_at',$date)->get();

            foreach ($messages as $message){
                $interval = $this->getInterval($message->created_at);
                $employers[$message->user_id]['values'][$date][$interval] = true;
            }

            foreach ($events as $event){
                $interval = $this->getInterval($event->created_at);
                $employers[$event->user_id]['values'][$date][$interval] = true;
            }

            foreach ($calls as $call){
                $interval = $this->getInterval($call->created_at);
                $employers[$userByMail[$call->uis_login]]['values'][$date][$interval] = true;
            }

            foreach ($employers as &$employer){
                if(isset($employer['values'][$date])){
                    $employer['values'][$date] = array_values(array_filter(array_keys($employer['values'][$date]),fn($value) => $value>0));
                }else{
                    $employer['values'][$date] = [];
                }
            }
        }
        return array_values($employers);
    }
    private function getInterval(Carbon $dateTime){
        $hourC = (int)(($dateTime->hour-11)*12); /// 11 поправка часовой пояс UTC+3 и начало рабочего дня 8 утра
        $minuteC = (int)($dateTime->minute/5) + 1;
        return $hourC + $minuteC;
    }
}
