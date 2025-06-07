<?php

namespace App\Http\Controllers;

use App\Models\System\Holiday;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function update(Request $request)
    {
        $year = $request->get('year', Carbon::today()->year);
        $xml = simplexml_load_file("https://xmlcalendar.ru/data/ru/{$year}/calendar.xml");

        $items = 0;

        if($year == $xml['year']){
            foreach ($xml->days->day as $day) {
                $parts = explode('.', $day['d']);

                $type = match ((int)$day['t']) {
                    2 => 'preholidays',
                    3 => 'work',
                    default => 'holidays',
                };
                $data  = [
                    'date' => $year.'-'.$parts[0].'-'.$parts[1],
                    'type' => $type
                ];
                Holiday::updateOrCreate($data);
                $items++;
            }
        }
        return $items;
    }
    public function getCountWorkDays(Request $request)
    {
        $start = $request->get('start',Carbon::today()->firstOfMonth());
        $end   = $request->get('end',Carbon::today()->lastOfMonth());

        $days = $this->holidays($start,$end);

        if(is_string($start)){
            $start = Carbon::parse($start);
        }
        if(is_string($end)){
            $end = Carbon::parse($end);
        }

        $workOnHolidays = isset($days['work']) ? count($days['work']) : 0;

        if(isset($days['preholidays'])){
            foreach ($days['preholidays'] as $preholiday){
                $workOnHolidays += $preholiday->isWeekday() ? 0 : 1;
            }
        }

        $holidays = $days['holidays'];

        $days = $start->diffInDaysFiltered(function (Carbon $date) use ($holidays) {
            return $date->isWeekday() && !in_array($date, $holidays);
        }, $end);

        $days += $end->isWeekday() && !in_array($end, $holidays) ? 1 : 0;

        return $days + $workOnHolidays;
    }
    public function getDays(Request $request)
    {
        $start = $request->get('start',Carbon::today()->firstOfMonth());
        $end   = $request->get('end',Carbon::today()->lastOfMonth());
        $calendar =  $this->holidays($start,$end);
        foreach ($calendar as $type => &$days){
            foreach ($days as &$day){
                $day = $day->format('Y-m-d');
            }
        }
        return $calendar;
    }

    private function holidays($start,$end)
    {
        $data = [];
        $holidays = Holiday::whereBetween('date',[$start,$end])->orderBy('date')->get();
        foreach ($holidays as $holiday){
            if( $holiday->date->isWeekday() || $holiday->type !== 'holidays' ){
                $data[$holiday->type][]=$holiday->date;
            }

        }
        return $data;
    }
}
