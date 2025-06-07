<?php

namespace App\Http\Controllers\Finance;

use App\Data\Finance\DeductionData;
use App\Http\Controllers\Controller;
use App\Models\Finance\Deduction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DeductionController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->get('start', Carbon::now()->startOfMonth());
        $end = $request->get('end', Carbon::now()->endOfMonth());

        return Deduction::whereBetween('date',[$start,$end])
            ->with('employee:id,short_name as name')
            ->filter()
            ->get();
    }

    public function store(DeductionData $request)
    {
        return Deduction::create($request->toModel());
    }

    public function show(Deduction $deduction)
    {
        return $deduction->load('employee:id,short_name as name');
    }

    public function update(DeductionData $request, Deduction $deduction)
    {
        $deduction->update($request->toModel());

        return $deduction;
    }

    public function destroy(Deduction $deduction)
    {
        $deduction->delete();

        return response()->json();
    }
}
