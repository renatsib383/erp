<?php

namespace App\Http\Controllers\Works;

use App\Data\Works\CategoryData;
use App\Http\Controllers\Controller;
use App\Models\Works\WorkCategory;
use Spatie\QueryBuilder\QueryBuilder;

class CategoryController extends Controller
{
    public function index()
    {
        $fields = array_keys(CategoryData::empty());
        return QueryBuilder::for(WorkCategory::class)
            ->allowedFields($fields)
            ->allowedIncludes(['groups.works','events'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(CategoryData $request)
    {
        $category = WorkCategory::create($request->toModel());
        return CategoryData::from($category);
    }

    public function show(WorkCategory $category)
    {
        return CategoryData::from($category);
    }

    public function update(CategoryData $request, WorkCategory $category)
    {
        $category->update($request->toModel());
        return CategoryData::from($category);
    }

    public function destroy(WorkCategory $category)
    {
        $category->delete();

        return response()->json(null, 204);
    }
}
