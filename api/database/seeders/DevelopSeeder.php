<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DevelopSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SabImportSeeder::class,
            DealSeeder::class,
            PaymentSeeder::class,
            DeductionSeeder::class
        ]);
    }
}
