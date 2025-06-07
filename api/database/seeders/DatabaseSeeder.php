<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PositionSeeder::class,
            CashRegisterSeeder::class,
            PipelineSeeder::class,
            //DealSeeder::class,
        ]);


        $hash = Hash::make('qwe123qwe123');
        $now = now();
        User::factory()->create([
            'id' => 1,
            'name' => 'КАС',
            'email' => 'askiselev@list.ru',
            'email_verified_at' => $now,
            'password' => $hash,
            'remember_token' => Str::random(10),
        ])->roles()->attach(1);
        User::factory()->create([
            'id' => 2,
            'name' => 'Renat',
            'email' => 'renatsib383@gmail.com',
            'email_verified_at' => $now,
            'password' => $hash,
            'remember_token' => Str::random(10),
        ])->roles()->attach(1);
        User::factory()->create([
            'id' => 3,
            'name' => 'F-A-M-E',
            'email' => 'timofeev@easyways.ru',
            'email_verified_at' => $now,
            'password' => $hash,
            'remember_token' => Str::random(10),
        ])->roles()->attach(1);

        User::factory()->create([
            'id' => 5,
            'name' => 'Dazzv',
            'email' => 'davlat.azizov.4712@gmail.com',
            'email_verified_at' => $now,
            'password' => $hash,
            'remember_token' => Str::random(10),
        ])->roles()->attach(1);
        User::factory()->create([
            'id' => 4,
            'name' => 'Maya',
            'email' => 'maya.soloveva2015@yandex.ru',
            'email_verified_at' => $now,
            'password' => $hash,
            'remember_token' => Str::random(10),
        ])->roles()->attach(1);
        User::factory()->create([
            'id' => 42,
            'name' => 'WhatsApp',
            'email' => 'whats@app.com',
            'email_verified_at' => $now,
            'password' => $hash,
            'remember_token' => Str::random(10),
        ])->roles()->attach(1);
    }
}
