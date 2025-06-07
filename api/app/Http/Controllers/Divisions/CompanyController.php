<?php

namespace App\Http\Controllers\Divisions;

use App\Data\Divisions\CompanyData;
use App\Http\Controllers\Controller;
use App\Models\Divisions\Company;
use Spatie\QueryBuilder\QueryBuilder;

class CompanyController extends Controller
{
    public function index()
    {
        $fields = array_keys(CompanyData::empty());
        return QueryBuilder::for(Company::class)
            ->allowedFields($fields)
            ->allowedIncludes(['events.user'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(CompanyData $request)
    {
        $company = Company::create($request->toModel());
        return CompanyData::from($company);
    }

    public function show(Company $company)
    {
        return CompanyData::from($company->load(['events.user']));
    }

    public function update(CompanyData $request, Company $company)
    {
        $company->update($request->toModel());
        return CompanyData::from($company);
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return response()->json(null, 204);
    }
}
