<?php

namespace Database\Seeders;

use App\Models\Finance\Payment;
use App\Models\Finance\CashRegister;

use App\Models\Staff\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $employees = Employee::whereIn('position_id',[2,3])
            ->where('short_name','<>','')
            ->whereNotNull('chief')->with('user')
            ->take(10)
            ->get(['id','short_name','chief']);

        $employeesCount = $employees->count();

        for ($i = 0; $i < 100; $i++) {
            $type = fake()->numberBetween(1, 2);

            $item = match ($type) {
                1 => fake()->numberBetween(1, 7),
                2 => fake()->numberBetween(20, 29),
                3 => fake()->numberBetween(40, 44),
            };
            $employee = $employees->get(fake()->numberBetween(0, $employeesCount-1));

            $cashRegister = CashRegister::firstOrCreate([
                'name' => 'Касса ' . $employee->short_name,
                'employee_id' => $employee->id
            ]);

            $cashRegisterRecipient = null;
            if($type === 3){
                $userRecipientName = $employees->get(fake()->numberBetween(0, $employeesCount-1))->short_name;
                $cashRegisterRecipient = CashRegister::firstOrCreate([
                    'name' => 'Касса ' . $userRecipientName,
                ])->id;
            }

            Payment::create([
                'type' => $type,
                'total' => fake()->numberBetween(1000, 100000),
                'item' => $item,
                'comment' => fake()->realText(50),
                'date_transaction' => fake()->dateTimeBetween('-1 month', 'now'),
                'deal_id' => fake()->numberBetween(1, 10),
                'cash_register_id' => $cashRegister->id,
                'user_id' => $employee->user->id,
                'prorab' => $employee->id,
                'nu' => $employee->chief,
                'cash_register_recipient_id' => $cashRegisterRecipient,
                'status' => fake()->numberBetween(0, 4),
            ]);

        }
    }
}
