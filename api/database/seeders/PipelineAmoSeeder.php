<?php

namespace Database\Seeders;

use App\Services\Amo;
use Illuminate\Database\Seeder;

class PipelineAmoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amo = new Amo;
        $amo->getPipelines();
    }
}
