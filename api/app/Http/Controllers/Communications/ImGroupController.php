<?php

namespace App\Http\Controllers\Communications;

use App\Http\Controllers\Controller;
use App\Models\Communications\ImGroup;
use Illuminate\Http\Request;

class ImGroupController extends Controller
{
    public function index()
    {
        return ImGroup::all()->load('users');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required'],
            'users' => ['required','array'],
        ]);
        $data['owner'] = auth()->user()->id;

        $imGroup = ImGroup::create($data);

        $imGroup->users()->sync($data['users']);

        return $this->show($imGroup);
    }

    public function show(ImGroup $imGroup)
    {
        return $imGroup->load('users');
    }

    public function update(Request $request, ImGroup $imGroup)
    {
        $data = $request->validate([
            'title' => ['required'],
            'users' => ['required','array'],
        ]);

        $imGroup->update($data);

        $imGroup->users()->sync($data['users']);

        return $this->show($imGroup);
    }

    public function destroy(ImGroup $imGroup)
    {
        $imGroup->delete();

        return response()->json();
    }
}
