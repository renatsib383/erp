<?php

namespace App\Http\Controllers\Remont;

use App\Data\Remont\SmetData;
use App\Http\Controllers\Controller;
use App\Models\Remont\Smet;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class SmetController extends Controller
{
    public function index()
    {
        $data = SmetData::empty();
        $fields = array_keys($data);

        unset($data['deal_id']);
        $filters = array_keys($data);
        $filters[] = AllowedFilter::exact('deal_id');


        return QueryBuilder::for(Smet::class)
            ->allowedFields($fields)
//            ->allowedIncludes(['group.category'])
            ->allowedFilters($filters)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(SmetData $request)
    {
        $smet = Smet::create($request->toModel());

        return SmetData::from($smet);
    }

    public function show(Smet $smet)
    {
        return SmetData::from($smet);
    }

    public function update(SmetData $request, Smet $smet)
    {
        $smet->update($request->toModel());
        if($smet->approved){
            $this->dealUpdate($smet);
        }
        return SmetData::from($smet);
    }

    public function destroy(Smet $smet)
    {
        $smet->delete();

        return response()->json(null, 204);
    }
    private function dealUpdate(Smet $smet)
    {
        $deal = $smet->deal;
        $deal->confirmed_smet_sum = $smet->total;
        $deal->save();
    }
}
