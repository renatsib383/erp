<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PrimevueDatatables\PrimevueDatatables;

class DataTableController extends Controller
{
    public function handle(Request $request, $model)
    {
        $modelClass = "App\\Models\\" . ucfirst($model);
        
        $items = $modelClass::query();

        if ($request->has('with')) {
            $items->with($request->input('with'));
        }
        
        return PrimevueDatatables::of($items)->make();
    }
}