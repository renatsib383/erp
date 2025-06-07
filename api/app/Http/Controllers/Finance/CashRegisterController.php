<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Finance\CashRegister;
use Illuminate\Http\Request;

class CashRegisterController extends Controller
{
    public function index()
    {
        return CashRegister::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
        ]);

        return CashRegister::create($data);
    }

    public function show(CashRegister $cash)
    {
        return $cash;
    }

    public function update(Request $request, CashRegister $cash)
    {
        $data = $request->validate([
            'name' => ['required'],
        ]);

        $cash->update($data);

        return $cash;
    }

    public function destroy(CashRegister $cash)
    {
        $cash->delete();

        return response()->json();
    }
}
