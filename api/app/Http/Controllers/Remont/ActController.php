<?php

namespace App\Http\Controllers\Remont;

use App\Data\Remont\ActData;
use App\Http\Controllers\Controller;
use App\Models\Remont\Act;
use Spatie\QueryBuilder\QueryBuilder;

class ActController extends Controller
{
    public function index()
    {
        $fields = array_keys(ActData::empty());
        return QueryBuilder::for(Act::class)
            ->allowedFields($fields)
//            ->allowedIncludes(['group.category'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(ActData $request)
    {
        $act = Act::create($request->toModel());

        return ActData::from($act);
    }

    public function show(Act $act)
    {
        return ActData::from($act);
    }

    public function update(ActData $request, Act $act)
    {
        $act->update($request->toModel());

        return ActData::from($act);
    }

    public function destroy(Act $act)
    {
        $act->delete();

        return response()->json(null, 204);
    }
}
