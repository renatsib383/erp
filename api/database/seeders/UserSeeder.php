<?php

namespace Database\Seeders;

use App\Models\Staff\Employee;
use App\Models\User;
use App\Services\Sab;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        if(!User::where('email', 'zaikin@atlonfm.ru')->first()){
            $ziv = Employee::create([
                'short_name' => 'ЗИВ',
                'birthday' => '28.12.1990',
                'fio' => 'Заикин Иван Витальевич',
                'email' => 'zaikin@atlonfm.ru',
                'phone' => '+79996670123',
                'work_phone' => '+79774701234',
                'position_id' => 4,
                'sab_id' => 604
            ]);

            $userDB = new User;
            $userDB->name = $ziv->short_name;
            $userDB->email = $ziv->email;
            $userDB->email_verified_at = now();
            $userDB->password = Hash::make('79774701234');
            $userDB->remember_token = Str::random(10);
            $userDB->profile()->associate($ziv);
            $userDB->save();
        }


        (new Sab)->getSabUsers();
    }
}
