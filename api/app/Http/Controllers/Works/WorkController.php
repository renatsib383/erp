<?php

namespace App\Http\Controllers\Works;

use App\Data\Works\WorkData;
use App\Http\Controllers\Controller;
use App\Models\Works\Work;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class WorkController extends Controller
{
    public function index()
    {
        $fields = array_keys(WorkData::empty());
        return QueryBuilder::for(Work::class)
            ->allowedFields($fields)
            ->allowedIncludes(['group.category','events.user'])
            ->allowedFilters(['name',AllowedFilter::exact('work_group_id')])
            ->allowedSorts($fields)
            ->jsonPaginate(5000);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(WorkData $request)
    {
        $work = Work::create($request->toModel());
        return WorkData::from($work);
    }

    /**
     * Display the specified resource.
     */
    public function show(Work $work)
    {
        return WorkData::from($work->load(['events.user']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WorkData $request, Work $work)
    {
        $work->update($request->toModel());
        return WorkData::from($work);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Work $work)
    {
        $work->delete();

        return response()->json(null, 204);
    }
}
