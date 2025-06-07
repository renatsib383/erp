<?php

namespace App\Http\Controllers\Remont;

use App\Data\Remont\RoomTypeData;
use App\Http\Controllers\Controller;
use App\Models\Remont\RoomType;
use Spatie\QueryBuilder\QueryBuilder;

class RoomTypeController extends Controller
{
    public function index()
    {
        $fields = array_keys(RoomTypeData::empty());
        return QueryBuilder::for(RoomType::class)
            ->allowedFields($fields)
            ->allowedIncludes(['events.user','rooms'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(RoomTypeData $request)
    {
        $roomType = RoomType::create($request->toModel());

        return RoomTypeData::from($roomType);
    }

    public function show(RoomType $roomType)
    {
        return RoomTypeData::from($roomType->load(['events.user']));
    }

    public function update(RoomTypeData $request, RoomType $roomType)
    {
        $roomType->update($request->toModel());

        return RoomTypeData::from($roomType);
    }

    public function destroy(RoomType $roomType)
    {
        $roomType->delete();

        return response()->json(null, 204);
    }
}
