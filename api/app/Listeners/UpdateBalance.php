<?php

namespace App\Listeners;

use App\Events\Payment\Created;
use App\Events\Payment\Updated;
use App\Events\Payment\Deleted;
use App\Models\Deals\Deal;
use App\Models\Finance\CashRegister;
use App\Models\Finance\Payment;

class UpdateBalance
{
    public function handle(Created | Updated | Deleted $event): void
    {
        if($event instanceof Created){
            $this->increaseBalance($event->payment);
        }
        if($event instanceof Updated){
            $this->decreaseBalance($event->payment);
            $this->increaseBalance($event->payment);
        }
        if($event instanceof Deleted){
            $this->decreaseBalance($event->payment);
        }
    }
    private function increaseBalance(Payment $payment): void
    {
        if($payment->status == 3){
            if($payment->cash_register_id > 1){
                $cashRegister = CashRegister::find($payment->cash_register_id);
                if($payment->type == 1){
                    $total = $payment->total;
                    if($payment->deposit_minus > 0){
                        $total -= $payment->deposit_minus;
                    }
                    if($payment->discount_minus > 0){
                        $total -= $payment->discount_minus;
                    }
                    if($payment->partial_payment > 0){
                        $total -= $payment->partial_payment;
                    }

                    $cashRegister->balance += $total;
                    if($payment->item == 5){
                        $deal = Deal::find($payment->deal_id);
                        if($deal){
                            $deal->deposit += $payment->total;
                            $deal->save();
                        }
                    }
                }
                if($payment->type == 2){
                    $cashRegister->balance -= $payment->total;
                    if($payment->item == 30){
                        $deal = Deal::find($payment->deal_id);
                        if($deal){
                            $deal->deposit -= $payment->total;
                            $deal->save();
                        }
                    }
                }
                if($payment->type == 3){
                    $cashRegister->balance -= $payment->total;

                    $cashRegisterRecipient = CashRegister::find($payment->cash_register_recipient_id);
                    $cashRegisterRecipient->balance += $payment->total;
                    $cashRegisterRecipient->saveQuietly();
                }
                $cashRegister->saveQuietly();
            }else{
                if($payment->type == 1){
                    $deal = Deal::find($payment->deal_id);
                    if($deal){
                        $deal->deposit -= $payment->total;
                        $deal->save();
                    }
                }
            }
        }
    }
    private function decreaseBalance(Payment $payment): void
    {
        $oldData = $payment->getOriginal();
        // Откатываем кассу
        if( $oldData['status'] == 3 ){
            if($oldData['cash_register_id'] > 1){
                $cashRegister = CashRegister::find($oldData['cash_register_id']);
                if($oldData['type'] == 1){
                    $total = $oldData['total'];
                    if($oldData['deposit_minus'] > 0){
                        $total -= $oldData['deposit_minus'];
                    }
                    if($oldData['discount_minus'] > 0){
                        $total -= $oldData['discount_minus'];
                    }
                    if($oldData['partial_payment'] > 0){
                        $total -= $oldData['partial_payment'];
                    }

                    $cashRegister->balance -= $total;
                    if($oldData['item'] == 5){
                        $deal = Deal::find($oldData['deal_id']);
                        if($deal){
                            $deal->deposit -= $oldData['total'];
                            $deal->save();
                        }
                    }
                }
                if($oldData['type'] == 2){
                    $cashRegister->balance += $oldData['total'];
                    if($oldData['item'] == 30){
                        $deal = Deal::find($oldData['deal_id']);
                        if($deal){
                            $deal->deposit -= $oldData['total'];
                            $deal->save();
                        }
                    }
                }
                if($oldData['type'] == 3){
                    $cashRegister->balance += $oldData['total'];

                    $cashRegisterRecipient = CashRegister::find($oldData['cash_register_recipient_id']);
                    $cashRegisterRecipient->balance -= $oldData['total'];
                    $cashRegisterRecipient->saveQuietly();
                }
                $cashRegister->saveQuietly();
            }else{
                if($oldData['type'] == 1){
                    $deal = Deal::find($oldData['deal_id']);
                    if($deal){
                        $deal->deposit -= $oldData['total'];
                        $deal->save();
                    }
                }
            }
        }
    }
}
