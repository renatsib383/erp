<?php

namespace App\Http\Controllers\Deals;

use App\Data\Deals\StageData;
use App\Http\Controllers\Controller;
use App\Models\Deals\Stage;
use Spatie\QueryBuilder\QueryBuilder;

class StageController extends Controller
{
    public function index()
    {
        $fields = array_keys(StageData::empty());
        return QueryBuilder::for(Stage::class)
            ->allowedFields($fields)
            ->allowedIncludes(['pipeline','deals','events'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }
    public function store(StageData $request)
    {
        $stage = Stage::create($request->toModel());

        return StageData::from($stage);
    }

    public function show(Stage $stage)
    {
        return StageData::from($stage);
    }

    public function update(StageData $request, Stage $stage)
    {
        $stage->update($request->toModel());

        return StageData::from($stage);
    }

    public function destroy(Stage $stage)
    {
        $stage->delete();

        return response()->json(null, 204);
    }
}
