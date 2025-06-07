<?php

namespace App\Policies;

use App\Models\User;

class CrudPolicy
{
    public function before(User $user): bool
    {
        return $user->hasRole('superadmin');
    }
    public function __call($name, $arguments): bool
    {
        $user = $arguments[0];
        $model = class_basename($arguments[1]);
        return isset($user->permissions['permissions'][$model][$name]);
    }
}
