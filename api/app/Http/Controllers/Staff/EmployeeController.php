<?php

namespace App\Http\Controllers\Staff;

use App\Data\Staff\EmployeeData;
use App\Http\Controllers\Controller;
use App\Models\Staff\Employee;
use Spatie\QueryBuilder\QueryBuilder;

class EmployeeController extends Controller
{
    public function index()
    {
        $fields = array_keys(EmployeeData::empty());
        return QueryBuilder::for(Employee::class)
            ->allowedFields($fields)
            ->allowedIncludes(['events.user','position','user'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(EmployeeData $request)
    {
        $employee = Employee::create($request->toModel());

        return EmployeeData::from($employee);
    }

    public function show(Employee $employee)
    {
        return EmployeeData::from($employee->load(['events.user']));
    }

    public function update(EmployeeData $request, Employee $employee)
    {
        $employee->update($request->toModel());

        return EmployeeData::from($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json(null, 204);
    }
}
