<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\CashRegister;
use App\Models\Finance\Payment;
use App\Models\Staff\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class StatisticController extends Controller
{
    private array $spbChiefs = [
        1, // ЗИВ //ТехДир
        182, // ГАС
        179, //ТИН
        152, //ППА
    ];
    public function index(Request $request)
    {
        $start = $request->get('start', Carbon::now()->startOfMonth());
        $end = $request->get('end', Carbon::now()->endOfMonth());

        $result = [
            'msk' => [
                'items' => [],
                'total' => 0
            ],
            'spb' => [
                'items' => [],
                'total' => 0
            ]
        ];
        $chiefs = Employee::whereIn('position_id',[2,4])->get(['id','short_name as name']);
        foreach ($chiefs as $chief){
            $prorabIds = Employee::where('chief',$chief->id)->get('id')->pluck('id');
            $data = [
                'id' => $chief->id,
                'name' => $chief->name,
                'payments' => [
                    'items' => [
                        'acts_with_kf' => 0,
                        'acts_without_kf' => 0,
                        'draft_material' => 0,
                        'fotr' => 0,
                    ],
                    'ratio' => [
                        'acts_kf' => [
                            'account' => 0,
                            'cash' => 0
                        ],
                        'draft_material' => [
                            'account' => 0,
                            'cash' => 0
                        ]
                    ],
                ]
            ];
            $data['cashRegister'] = CashRegister::where('employee_id',$chief->id)->sum('balance');
            $data['prorabsCashRegister'] = CashRegister::whereIn('employee_id',$prorabIds)->sum('balance');
            $data['total'] = $data['cashRegister'] + $data['prorabsCashRegister'];

            $payments = Payment::where('status',3)
                ->where('nu',$chief->id)
                ->whereIn('item',[1,3,20])
                ->whereBetween('date_transaction', [$start, $end])
                ->with('deal:id,uid,coef');

            foreach ($payments->get() as $payment){
                switch ($payment->item){
                    case 1:
                        $data['payments']['items']['acts_with_kf'] += round($payment->total);
                        $data['payments']['items']['acts_without_kf'] += round($payment->total / $payment->deal->coef);

                        if($payment->cash_register_id == 2){
                            $data['payments']['ratio']['acts_kf']['account'] += round($payment->total);
                        }else{
                            $data['payments']['ratio']['acts_kf']['cash'] += round($payment->total);
                        }

                        break;
                    case 3:
                        $data['payments']['items']['draft_material'] += round($payment->total);
                        if($payment->cash_register_id == 2){
                            $data['payments']['ratio']['draft_material']['account'] += round($payment->total);
                        }else{
                            $data['payments']['ratio']['draft_material']['cash'] += round($payment->total);
                        }
                        break;
                    case 20:
                        $data['payments']['items']['fotr'] += round($payment->total);
                        break;
                    default: break;
                }
            }

            $city = 'msk';
            if(in_array($chief->id,$this->spbChiefs)){
                $city = 'spb';
            }
            if($data['payments']['ratio']['acts_kf']['account'] > 0 || $data['payments']['ratio']['acts_kf']['cash'] > 0){
                if($data['payments']['ratio']['acts_kf']['account']>0){
                    $ratio = round(($data['payments']['ratio']['acts_kf']['cash']  / $data['payments']['ratio']['acts_kf']['account']) * 100 , 2);
                    $data['payments']['ratio']['acts_kf']['account'] = $ratio;
                    $data['payments']['ratio']['acts_kf']['cash'] = 100 - $ratio;
                }else{
                    $data['payments']['ratio']['acts_kf']['cash'] = 100;
                    $data['payments']['ratio']['acts_kf']['account'] = 0;
                }
            }

            if($data['payments']['ratio']['draft_material']['account'] > 0 || $data['payments']['ratio']['draft_material']['cash'] > 0) {
                if ($data['payments']['ratio']['draft_material']['account'] > 0) {
                    $ratio = round(
                        ($data['payments']['ratio']['draft_material']['cash'] / $data['payments']['ratio']['draft_material']['account']) * 100,
                        2
                    );
                    $data['payments']['ratio']['draft_material']['account'] = $ratio;
                    $data['payments']['ratio']['draft_material']['cash'] = 100 - $ratio;
                } else {
                    $data['payments']['ratio']['draft_material']['cash'] = 100;
                    $data['payments']['ratio']['draft_material']['account'] = 0;
                }
            }
            $result[$city]['items'][] = $data;
            $result[$city]['total'] += $data['total'];

        }
        //dump($result);
        //$cashRegisters = ;
        return $result;
    }
}
