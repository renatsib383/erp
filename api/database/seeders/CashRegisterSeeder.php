<?php

namespace Database\Seeders;

use App\Models\Finance\CashRegister;
use Illuminate\Database\Seeder;

class CashRegisterSeeder extends Seeder
{
    public function run(): void
    {
        CashRegister::create(['id' => 1, 'name' => 'Депозит', 'reportable' => false, 'cash_flow' => true]);
        CashRegister::create(['id' => 2, 'name' => 'Р/С', 'reportable' => false, 'cash_flow' => false]);
        CashRegister::create(['id' => 3, 'name' => 'Инкассация', 'reportable' => false, 'cash_flow' => true]);
        CashRegister::create(['id' => 4, 'name' => 'К Оплате', 'reportable' => false, 'cash_flow' => true]);
        CashRegister::create(['id' => 5, 'name' => 'Дирекция/Компания', 'reportable' => false, 'cash_flow' => true]);
    }
}
