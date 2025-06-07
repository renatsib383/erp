<?php

namespace Database\Seeders;

use App\Models\Finance\Deduction;
use Illuminate\Database\Seeder;

class DeductionSeeder extends Seeder
{
    public function run(): void
    {
        Deduction::factory(10)->create();
    }
}
