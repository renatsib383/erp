<?php

namespace Database\Seeders;

use App\Models\Staff\Position;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    private array $positions = [
        [
            'id' => 1,
            'name' => 'Разработчик',

        ],
        [
            'id' => 2,
            'name' => 'Начальник Участка',

        ],
        [
            'id' => 3,
            'name' => 'Прораб',

        ],
        [
            'id' => 4,
            'name' => 'Руководитель производства',
        ],
    ];
    public function run(): void
    {
        foreach ($this->positions as $position){
            $model = new Position;
            $model->id = $position['id'];
            $model->name = $position['name'];
            $model->save();
        }
    }
}
