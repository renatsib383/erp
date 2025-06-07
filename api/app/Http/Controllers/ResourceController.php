<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;

abstract class ResourceController extends Controller
{
    use AuthorizesRequests;
    public function __construct()
    {
        $model = str_replace('Controller','',class_basename($this));
        $this->authorizeResource($model);
    }
}
