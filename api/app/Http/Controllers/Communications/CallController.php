<?php

namespace App\Http\Controllers\Communications;

use App\Data\Communications\CallData;
use App\Http\Controllers\Controller;
use App\Models\Communications\Call;
use Spatie\QueryBuilder\QueryBuilder;

class CallController extends Controller
{
    public function index()
    {
        $fields = array_keys(CallData::empty());
        return QueryBuilder::for(Call::class)
            ->allowedFields($fields)
            ->allowedIncludes(['deal','user'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }
}
