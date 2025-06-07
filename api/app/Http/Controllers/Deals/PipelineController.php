<?php

namespace App\Http\Controllers\Deals;

use App\Data\Deals\PipelineData;
use App\Http\Controllers\Controller;
use App\Models\Deals\Pipeline;
use Spatie\QueryBuilder\QueryBuilder;

class PipelineController extends Controller
{
    public function index()
    {
        $fields = array_keys(PipelineData::empty());
        return QueryBuilder::for(Pipeline::class)
            ->allowedFields($fields)
            ->allowedIncludes(['stages','deals','events'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(PipelineData $request)
    {
        $pipeline = Pipeline::create($request->toModel());

        return PipelineData::from($pipeline);
    }

    public function show(Pipeline $pipeline)
    {
        return PipelineData::from($pipeline);
    }

    public function update(PipelineData $request, Pipeline $pipeline)
    {
        $pipeline->update($request->toModel());

        return PipelineData::from($pipeline);
    }

    public function destroy(Pipeline $pipeline)
    {
        $pipeline->delete();

        return response()->json(null, 204);
    }
}
