<?php

namespace App\Http\Controllers\Finance;

use App\Data\Finance\PaymentData;
use App\Http\Controllers\Controller;
use App\Models\Deals\Deal;
use App\Models\Finance\CashRegister;
use App\Models\Finance\Payment;
use App\Models\Staff\Employee;
use App\Models\System\ModelEvent;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    private array $relation2load = ['deal:id,uid,coef','user:id,name'];
    public function index(Request $request)
    {
        $latest = $request->get('latest', false);

        if($latest){
            $order = 'desc';
        }else{
            $order = 'asc';
        }
        $list = Payment::with($this->relation2load)
            ->role()
            ->filter()
            ->orderBy('date_transaction',$order);
        $start = $request->get('start');
        $end = $request->get('end');

        if(!is_null($start) && !is_null($end)){
            $list->whereBetween('date_transaction',[$start,$end]);
        }

        $list = $list->get();
        $operations = [];
        foreach ($list as $operation){
            if($operation->status == 2){
                if(!isset($operations[$operation->item])){
                    $operations[$operation->item] = 0;
                }
                $operations[$operation->item] += $operation->total;
            }
        }

        return [
            'operations'=>$operations,
            'cashRegisters'=> CashRegister::where('balance','<>', 0)
                ->get(['id','balance'])
                ->pluck('balance','id'),
            'list'=>$list,
        ];
    }

    public function list()
    {
        $typeList = [];
        $types = config('atlon.models.payment.type.values');
        $items = collect(config('atlon.models.payment.item.values'))
            ->chunkWhile(function (string $value, int $key) {
            return $key%20 > 0;
        });
        foreach($types as $id => $title){
            $typeList[$id] = [
                'title' => $title,
                'items' => $items->get($id-1)->toArray(),
            ];
        }

        return [
            'type' => $typeList,
            'cashRegister' => CashRegister::all(['id','name'])->pluck('name','id'),
            'users' => Employee::where('position_id',3)
                ->get(['id','short_name'])
                ->pluck('short_name','id'),
        ];
    }

    public function store(PaymentData $request)
    {
        $data = $request->toModel();
        $data['user_id'] = Auth::user()->id;
        if(isset($data['deal_id'])){
            $deal = Deal::find($data['deal_id']);
            if($deal && $deal->prorab && $deal->prorab->profile){
                $data['prorab'] = $deal->prorab->profile->id;
                $data['nu'] = $deal->prorab->profile->chief;
            }
            if(!is_null($deal) && isset($data['final_act'])){
                $this->finalAct($deal);
            }
        }

        $payment =  Payment::create($data);
        return $this->show($payment);
    }
    private function finalAct(Deal $deal)
    {
        if(is_null($deal->date_end)){
            $deal->date_end = now();
            $deal->stages()->sync([14]);
            $deal->save();
        }
    }
    public function show(Payment $payment)
    {
        return $payment->load(['events.user', ...$this->relation2load]);
    }

    public function comment(Payment $payment, Request $request)
    {
        $event = new ModelEvent;
        $event->user_id = auth()->user() ? auth()->user()->id :  0;
        $event->eventable()->associate($payment);
        $event->type = 'comment';
        $event->data = [];
        $event->text = $request->comment;
        $event->save();

        return response()->json(['success'=>true]);
    }

    public function update(PaymentData $request, Payment $payment)
    {
        $data = $request->toModel();
        unset($data['date_transaction']);
        $payment->update($data);

        $deal = $payment->deal;

        if(!is_null($deal) && isset($data['final_act'])){
            $this->finalAct($deal);
        }

        return $this->show($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json();
    }

    public function upload(Payment $payment, Request $request)
    {
        if ($request->file('file')->isValid()) {

            $uploadedFile = $request->file('file');

            $file = [
                'name' => $uploadedFile->getClientOriginalName(),
                'ext' => $uploadedFile->extension(),
                'size' => $uploadedFile->getSize(),
                'url' => $uploadedFile->store('payments','public'),
                'mime' => $uploadedFile->getMimeType(),
                'dimensions' => $uploadedFile->dimensions(),
            ];
            $files = $payment->files;
            $files[] = $file;
            $payment->files = $files;
            $payment->save();

            return response()->json(['file' => $file]);
        }

        return response('room and file is required', 400);
    }
}
