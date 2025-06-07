<?php

namespace Database\Seeders;

use App\Services\Sab;
use Illuminate\Database\Seeder;

class WorkSeeder extends Seeder
{
    public function run(): void
    {
        (new Sab)->getWorks();
    }
}
