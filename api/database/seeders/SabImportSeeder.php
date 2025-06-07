<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SabImportSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            //WorkSeeder::class,
            //WorkCollectionSeeder::class,
        ]);
    }
}
