<?php

namespace App\Http\Controllers\Deals;

use App\Data\Deals\NoteData;
use App\Http\Controllers\Controller;
use App\Jobs\MessageImageOptimize;
use App\Models\Deals\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\QueryBuilder;

class NoteController extends Controller
{
    public function index()
    {
        $fields = array_keys(NoteData::empty());
        return QueryBuilder::for(Note::class)
            ->allowedFields($fields)
            ->allowedIncludes(['user'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(NoteData $request)
    {
        $data = $request->toModel();
        $data['user_id'] = auth()->user()?->id ?? 0;
        $note = Note::create($data);

        return NoteData::from($note);
    }

    public function show(Note $note)
    {
        return NoteData::from($note);
    }

    public function update(NoteData $request, Note $note)
    {
        $data = $request->toModel();
        $data['user_id'] = auth()->user()?->id ?? 0;
        $note->update($data);

        return NoteData::from($note);
    }

    public function destroy(Note $note)
    {
        $note->delete();

        return response()->json(null, 204);
    }
    public function upload(Request $request)
    {
        if ($request->file('file')->isValid() && $request->has('deal_id')) {

            $uploadedFile = $request->file('file');
            $deal_id = $request->input('deal_id');

            $file = [
                'name' => $uploadedFile->getClientOriginalName(),
                'ext' => $uploadedFile->extension(),
                'size' => $uploadedFile->getSize(),
                'url' => $uploadedFile->store($deal_id, 'feed'),
                'mime' => $uploadedFile->getMimeType(),
                'dimensions' => $uploadedFile->dimensions(),
            ];

            $note = new Note;
            $note->deal_id = $deal_id;
            $note->file = $file;
            $note->recipient = $request->input('recipient');
            $note->user()->associate(auth()->user());
            $note->save();

            if(str_contains($file['mime'],'image')){
                MessageImageOptimize::dispatch($note);
            }

            return response()->json(['file' => $file]);
        }

        return response('deal_id and file is required', 400);
    }

    public function getFile(Note $note)
    {
        $file = $note->file;

        return Storage::disk('feed')->download($file['url'], $file['name']);
    }
}
