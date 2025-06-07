<?php

namespace App\Http\Controllers\Staff;

use App\Data\Staff\PositionData;
use App\Http\Controllers\Controller;
use App\Models\Staff\Position;
use Spatie\QueryBuilder\QueryBuilder;

class PositionController extends Controller
{
    public function index()
    {
        $fields = array_keys(PositionData::empty());
        return QueryBuilder::for(Position::class)
            ->allowedFields($fields)
            ->allowedIncludes(['events.user','companies'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(PositionData $request)
    {
        $position = Position::create($request->toModel());

        return PositionData::from($position);
    }

    public function show(Position $position)
    {
        return PositionData::from($position->load(['events.user']));
    }

    public function update(PositionData $request, Position $position)
    {
        $position->update($request->toModel());

        return PositionData::from($position);
    }

    public function destroy(Position $position)
    {
        $position->delete();

        return response()->json(null, 204);
    }
}
