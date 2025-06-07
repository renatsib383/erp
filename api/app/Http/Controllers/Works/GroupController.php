<?php

namespace App\Http\Controllers\Works;

use App\Data\Works\GroupData;
use App\Http\Controllers\Controller;
use App\Models\Works\WorkGroup;
use Spatie\QueryBuilder\QueryBuilder;

class GroupController extends Controller
{
    public function index()
    {
        $fields = array_keys(GroupData::empty());
        return QueryBuilder::for(WorkGroup::class)
            ->allowedFields($fields)
            ->allowedIncludes(['category','works','events'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(GroupData $request)
    {
        $group = WorkGroup::create($request->toModel());
        return GroupData::from($group);
    }

    public function show(WorkGroup $group)
    {
        return GroupData::from($group);
    }

    public function update(GroupData $request, WorkGroup $group)
    {
        $group->update($request->toModel());
        return GroupData::from($group);
    }

    public function destroy(WorkGroup $group)
    {
        $group->delete();

        return response()->json(null, 204);
    }
}
