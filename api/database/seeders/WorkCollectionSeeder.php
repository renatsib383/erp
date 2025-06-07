<?php

namespace Database\Seeders;

use App\Services\Sab;
use Illuminate\Database\Seeder;

class WorkCollectionSeeder extends Seeder
{
    public function run(): void
    {
        (new Sab)->getWorkCollections();
    }
}
