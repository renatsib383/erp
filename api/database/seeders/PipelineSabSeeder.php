<?php

namespace Database\Seeders;

use App\Services\Sab;
use Illuminate\Database\Seeder;

class PipelineSabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amo = new Sab();
        $amo->getPipelines();
    }
}
