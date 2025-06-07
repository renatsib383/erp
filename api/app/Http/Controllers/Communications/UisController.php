<?php

namespace App\Http\Controllers\Communications;

use App\Http\Controllers\Controller;
use App\Models\Communications\Call;
use App\Models\Contacts\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UisController extends Controller
{
    public function call(Request $request): void
    {

        $params = $request->toArray();

        // if ($params['call_record_file_info']['call_record_duration'] < 10) {
        //     return;
        // }

        Auth::loginUsingId(760);

        $phone = $params['contact_info']['contact_phone_number'];
/*
        //tg($params);
        $dealId = null;
        $contact = Contact::where('phone', $phone)->get()->first(); // Поиск сделки в базе данных
        if ($contact) {
            $deal = $contact->deals()->get()->last();
            if ($deal) {
                $dealId = $deal->id;
            }
        }*/

        $call = new Call;
        $call->uis_login = $params['employee_info']['employee_email'];
        $call->type = $params['direction'];
        $call->deal_id = null;
        $call->client_phone = $phone;
        $call->user_phone = $params['virtual_phone_number'];
        $call->employee = $params['employee_info'];
        $call->scenario = $params['scenario_name'];
        $call->record = $params['call_record_file_info'];
        $call->created_at = $call->updated_at = $params['notification_time'];
        $call->save();


        //tg($params);

        // $amo = new Amo();
        // $amo->getLeadData($deal);
    }

    public function lost(Request $request): void
    {
        tg($request->toArray());
    }
}
