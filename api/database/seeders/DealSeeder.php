<?php

namespace Database\Seeders;

use App\Models\Deals\Deal;
use Illuminate\Database\Seeder;

class DealSeeder extends Seeder
{
    public function run(): void
    {
        Deal::factory(10)->create();
    }
}
