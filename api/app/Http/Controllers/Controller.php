<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected array $permissions = [];
    public function __construct()
    {
        $model = str_replace('Controller','',class_basename($this));
        if(isset(auth()->user()->permissions['permissions'][$model])){
            $this->permissions = auth()->user()->permissions['permissions'][$model];
        }
    }
}
