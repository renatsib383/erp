<?php

namespace App\Events\Payment;

use App\Models\Finance\Payment;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class Base
{
    use Dispatchable, SerializesModels;
    public User $user;
    public function __construct(
        public Payment $payment,
    )
    {
        $this->user = Auth::user() ?? $this->payment->user;// User::find();
    }
}
