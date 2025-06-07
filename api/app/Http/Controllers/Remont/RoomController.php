<?php

namespace App\Http\Controllers\Remont;

use App\Data\Remont\RoomData;
use App\Http\Controllers\Controller;
use App\Models\Remont\Room;
use Spatie\QueryBuilder\QueryBuilder;

class RoomController extends Controller
{
    public function index()
    {
        $fields = array_keys(RoomData::empty());
        return QueryBuilder::for(Room::class)
            ->allowedFields($fields)
//            ->allowedIncludes(['group.category'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(RoomData $request)
    {
        $room = Room::create($request->toModel());

        return RoomData::from($room);
    }

    public function show(Room $room)
    {
        return RoomData::from($room);
    }

    public function update(RoomData $request, Room $room)
    {
        $room->update($request->toModel());

        return RoomData::from($room);
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json(null, 204);
    }
}
