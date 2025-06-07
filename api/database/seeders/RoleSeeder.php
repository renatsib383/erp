<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    private array $roles = [
        [
            'id' => 1,
            'name' => 'superadmin',
            'description' => 'superadmin'
        ],
        [
            'id' => 2,
            'name' => 'Начальник Участка',
            'description' => 'nu'
        ],
        [
            'id' => 3,
            'name' => 'Прораб',
            'description' => 'prorab'
        ],
        [
            'id' => 4,
            'name' => 'ТехДир',
            'description' => 'techdir'
        ],
    ];
    public function run(): void
    {
        foreach ($this->roles as $role){
            $model = new Role;
            $model->id = $role['id'];
            $model->name = $role['name'];
            $model->guard_name = $role['description'];
            $model->save();
        }
    }
}
