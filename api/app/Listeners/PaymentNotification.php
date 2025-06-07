<?php

namespace App\Listeners;

use App\Events\Payment\Updated;
use App\Events\Payment\Created;
use App\Models\Staff\Employee;
use App\Notifications\newEvent;

class PaymentNotification
{
    public function handle(Created | Updated $event): void
    {
        $recipient = null;
        $payment = $event->payment;
        $user = $event->user;
        if( $user->hasRole('Прораб')){
            $profile = Employee::find($user->profile_id);
            if(!is_null($profile->chief)){
                $recipient = Employee::find($profile->chief)->user;
            }

        }else{
            if( $payment->user_id === $user->id ){
                return;
            }
            $recipient = $payment->user;
        }
        if(!is_null($recipient)){
            if($event instanceof Created){
                $title = 'Добавлен новый';
            }else{
                $title = 'Изменен';
            }

            if(!is_null($payment->deal)){
                $body = 'ИД объекта '.$payment->deal->uid;
            }else{
                $body = '';
            }

            $recipient->notify(new newEvent(
                title: $title.' ДДС №'.$payment->id,
                body:  $body,
                link:  '/dds/'.$payment->id
            ));
        }
    }
}
