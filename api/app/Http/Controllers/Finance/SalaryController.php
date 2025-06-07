<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Deals\Deal;
use App\Models\Finance\Deduction;
use App\Models\Finance\Payment;
use App\Models\Remont\Act;
use App\Models\Staff\Employee;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class SalaryController extends Controller
{
    public function index(Request $request)
    {
        $list = [];

        $filters = request()->collect('filter');
        $offset = request()->get('offset', 0);
        $limit = request()->get('limit', 50);

        $start = $request->get('start', Carbon::now()->startOfMonth());
        $end = $request->get('end', Carbon::now()->endOfMonth());

        $period = CarbonPeriod::create($start, '1 month' ,$end);
        $prorabs = Employee::select(['id', 'short_name'])->with('user');

        if ($filters->has('prorab')) {
            $prorabs->whereIn('id', Arr::wrap($filters->get('prorab')));
        } else {
            $prorabs->where('position_id', 3)->take($limit)->skip($offset);
        }

        $prorabs = $prorabs->get();
        $prorabUserKeys = $prorabs->pluck('user.id');

        $prorabIds = $prorabs->modelKeys();

        $payments = Payment::where('status', 3)
            ->with('deal:id,coef')
            ->whereIn('prorab', $prorabIds)
            ->whereIn('item', [
                1, // acts
                2, // special_installation
                3, // draft_material
                4, // finishing_material
                6, // design
                27, //advance
            ])
            ->whereBetween('date_transaction', [$start, $end])
            ->get();
        $paymentsTotal = [];
        foreach ($payments as $payment) {
            if($payment->item == 1 && is_null($payment->deal)){
                $total = $payment->total / $payment->deal->coef;
            }else{
                $total = $payment->total;
            }
            if (isset($paymentsTotal[$payment->prorab][$payment->item])) {
                $paymentsTotal[$payment->prorab][$payment->item] += $total;
            } else {
                $paymentsTotal[$payment->prorab][$payment->item] = $total;
            }
        }

        $deductions = [];

        foreach (Deduction::whereIn('employee_id', $prorabIds)->whereBetween('date',[$start,$end])->get() as $deduction){
            $deductions[$deduction->employee_id]['official_salary'] =
                isset($deductions[$deduction->employee_id]['official_salary']) ?
                    $deductions[$deduction->employee_id]['official_salary'] + $deduction->official_salary :
                    $deduction->official_salary;

            $deductions[$deduction->employee_id]['tax'] =
                isset($deductions[$deduction->employee_id]['tax']) ?
                $deductions[$deduction->employee_id]['tax'] + $deduction->tax :
                $deduction->tax;

            $deductions[$deduction->employee_id]['fines'] =
                isset($deductions[$deduction->employee_id]['fines']) ?
                    $deductions[$deduction->employee_id]['fines'] + $deduction->fines :
                    $deduction->fines;

            $deductions[$deduction->employee_id]['bounty'] =
                isset($deductions[$deduction->employee_id]['bounty']) ?
                    $deductions[$deduction->employee_id]['bounty'] + $deduction->bounty :
                    $deduction->bounty;
        }

        $deals = Deal::select(['id', 'uid', 'prorab', 'coef', 'date_end', 'confirmed_smet_sum as revenue_plan'])
            ->whereIn('prorab', $prorabUserKeys)
            ->with(['stages:id','prorab:id,profile_id as employee_id'])
            ->withSum([
                'payments as revenue_fact' => function (Builder $query) {
                    $query->where('status',  3);
                    $query->where('item',  1);
                }], 'total')
            ->get()->toArray();

        $prorabDeals = [];
        foreach ($deals as $deal) {
            $stages = array_map(fn($item) => $item['id'], $deal['stages']);
            if (in_array(8, $stages) || in_array(10, $stages)) {
                if(isset($prorabDeals[$deal['prorab']['employee_id']]['objects_count'])){
                    $prorabDeals[$deal['prorab']['employee_id']]['objects_count']++;
                }else{
                    $prorabDeals[$deal['prorab']['employee_id']]['objects_count'] = 1;
                }
            }
            $delta = round($deal['revenue_plan'] / $deal['coef']) - round(
                    $deal['revenue_fact'] / $deal['coef'],
            );
            if(isset($prorabDeals[$deal['prorab']['employee_id']]['delta'])){
                $prorabDeals[$deal['prorab']['employee_id']]['delta'] += $delta;
            }else{
                $prorabDeals[$deal['prorab']['employee_id']]['delta'] = $delta;
            }
        }

        $acts = Act::whereIn('prorab', $prorabUserKeys)
            ->where('status', '>', 1)
            ->with(['prorab:id,profile_id as employee_id','deal:id,coef'])
            ->whereBetween('created_at', [$start, $end])
            ->select(['prorab','deal_id','total'])->get()->toArray();
        $prorabActs = [];
        foreach ($acts as $act) {
            if(isset($prorabActs[$act['prorab']['employee_id']])){
                $prorabActs[$act['prorab']['employee_id']] += round($act['total'] / $act['deal']['coef'] * 0.10);
            }else{
                $prorabActs[$act['prorab']['employee_id']] = round($act['total'] / $act['deal']['coef'] * 0.10);
            }
        }

        foreach ($prorabs as $prorab) {
            $extras = 0;
            foreach ($period as $month){
                $extras += match ((int)$month->format('m')) {
                    1,4,7,10 => $this->getExtras($prorab, $month),
                    default => 0
                };
            }

            $total = $paymentsTotal[$prorab->id] ?? [];
            $data = [
                'user' => [
                    'id' => $prorab->id,
                    'name' => $prorab->short_name,
                ],
                'objects_count' => $prorabDeals[$prorab->id]['objects_count'] ?? 0,
                'delta' => $prorabDeals[$prorab->id]['delta'] ?? 0,

                'acts' => isset($total[1]) ? round($total[1] * 0.10) : 0,

                'draft_material' => isset($total[3]) ? round($total[3] * 0.05) : 0,
                'special_installation' => isset($total[2]) ? round($total[2] * 0.05) : 0,
                'finishing_material' => isset($total[4]) ? round($total[4] * 0.01) : 0,
                'design' => isset($total[6]) ? round($total[6] * 0.10) : 0,
                'advance' => $total[27] ?? 0,

                'extras' => $extras,

                'official_salary' => $deductions[$prorab->id]['official_salary'] ?? 0,
                'tax'  => $deductions[$prorab->id]['tax'] ?? 0,
                'bounty' => $deductions[$prorab->id]['bounty'] ?? 0,
                'fines' => $deductions[$prorab->id]['fines'] ?? 0,

                'total_salary' => 0,
                'remainder' => 0,
            ];
           /* $deals = Deal::select(['id', 'coef', 'date_end', 'confirmed_smet_sum as revenue_plan'])
                ->where('prorab', $prorab->user->id)
                ->with(['stages:id'])
                ->withSum([
                    'payments as revenue_fact' => function (Builder $query) use ($start, $end, $prorab) {
                        $query->where('item', [1]);
                        $query->where('status', 3);
                        $query->where('prorab', $prorab->id);
                        $query->whereBetween('date_transaction', [$start, $end]);
                    },
                ], 'total')
                ->get()->toArray();

            foreach ($deals as $deal) {
                $stages = array_map(fn($item) => $item['id'], $deal['stages']);
                if (in_array(8, $stages) || in_array(10, $stages)) {
                    $data['objects_count']++;
                    $data['delta'] += round($deal['revenue_plan'] / $deal['coef']) - round(
                            $deal['revenue_fact'] / $deal['coef'],
                    );
                }


                $data['acts'] += round($deal['revenue_fact'] / $deal['coef'] * 0.10);


                $date_end = Carbon::parse($deal['date_end']);
                if ($date_end >= Carbon::parse($start) && $date_end <= Carbon::parse($end)) {
                    $data['extras'] += round(
                        (($deal['revenue_fact'] / $deal['coef']) - ($deal['revenue_plan'] / $deal['coef'])) * 0.10,
                    );
                }
            }*/
            $data['total_salary'] +=
                $data['acts'] +
                $data['draft_material'] +
                $data['special_installation'] +
                $data['design'] +
                $data['finishing_material'] +
                $data['extras'] +
                $data['bounty'] -
                $data['official_salary'] -
                $data['tax'] -
                $data['fines'];
            $data['remainder'] += $data['total_salary'] - $data['advance'];
            $list[] = $data;
        }
        return $list;
    }
    private function getExtras($prorab,$month)
    {
        $extras = 0;
        $deals = Deal::select(['id', 'coef', 'confirmed_smet_sum as revenue_plan'])
            ->where('prorab', $prorab->user->id)
            ->whereBetween('date_end',[$month->copy()->subMonth(3),$month->copy()->subSecond()])
            ->withSum([
                'acts as revenue_fact' => function (Builder $query){
                    $query->where('status', '>', 1);
                },
            ], 'total')
            ->get()
            ->toArray();
        foreach ($deals as $deal){
            $extras += round(
                (($deal['revenue_fact'] / $deal['coef']) - ($deal['revenue_plan'] / $deal['coef'])) * 0.10,
            );
            //dump($deal,$extras);
        }
        return $extras;
        /*
         *
         $date_end = Carbon::parse($deal['date_end']);
                if ($date_end >= Carbon::parse($start) && $date_end <= Carbon::parse($end)) {
                    $data['extras'] += round(
                        (($deal['revenue_fact'] / $deal['coef']) - ($deal['revenue_plan'] / $deal['coef'])) * 0.10,
                    );
                }
         *  */
    }
}
