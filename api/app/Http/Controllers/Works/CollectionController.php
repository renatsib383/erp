<?php

namespace App\Http\Controllers\Works;

use App\Data\Works\CollectionData;
use App\Http\Controllers\Controller;
use App\Models\Works\WorkCollection;
use Spatie\QueryBuilder\QueryBuilder;

class CollectionController extends Controller
{
    public function index()
    {
        $fields = array_keys(CollectionData::empty());
        return QueryBuilder::for(WorkCollection::class)
            ->allowedFields($fields)
            ->allowedIncludes(['events.user'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(CollectionData $request)
    {
        $workCollection = WorkCollection::create($request->toModel());
        return CollectionData::from($workCollection);
    }

    public function show(WorkCollection $collection)
    {
        return CollectionData::from($collection->load(['events.user']));
    }

    public function update(CollectionData $request, WorkCollection $collection)
    {
        $collection->update($request->toModel());
        return CollectionData::from($collection);
    }

    public function destroy(WorkCollection $collection)
    {
        $collection->delete();

        return response()->json(null, 204);
    }
}
