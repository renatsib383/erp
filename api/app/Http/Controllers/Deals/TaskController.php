<?php

namespace App\Http\Controllers\Deals;

use App\Data\Deals\TaskData;
use App\Http\Controllers\Controller;
use App\Models\Deals\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;


class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::with(['performer','deal:id,uid']);

        $start = $request->get('start');
        $end = $request->get('end');
        if (is_null($start) || is_null($end)) {
            return response()->json(['error' => 'start and end required'], 400);
        }
        $start = Carbon::create($start)->startOfDay();
        $end = Carbon::create($end)->endOfDay();

        $tasks->whereBetween('start', [$start, $end]);

        $filters = $request->collect('filter');

        if ($filters->has('stage')) {
            $stage = $filters->get('stage');

            $tasks->whereHas('deal', function ($q) use ($stage) {
                $q->whereHas('stages', function ($q) use ($stage) {
                    $q->whereIn('stage_id', $stage);
                });
            });
        }

        if ($filters->has('overdueOnly')) {
            $overdueOnly = $filters->get('overdueOnly');
            if ($overdueOnly) {
                $tasks->where('end', '<', Carbon::now());
                $tasks->where('completed', false);
            }

        }

        if ($filters->has('author')) {
            $author = $filters->get('author');
            $tasks->whereIn('author', $author);
        }

        if ($filters->has('type')) {
            $type = $filters->get('type');
            $tasks->whereIn('type', $type);
        }

        if ($filters->has('performer')) {
            $performer = $filters->get('performer');
            $tasks->whereIn('performer', $performer);
        }
        if ($filters->has('completed')) {
            $completed = $filters->get('completed');
            $tasks->where('completed', $completed);
        }

        return $tasks->get();
    }

    public function store(TaskData $request)
    {
        $data = $request->toModel();
        $data['author'] = auth()->user()?->id ?? 0;
        $task = Task::create($data);

        return TaskData::from($task);
    }

    public function show(Task $task)
    {
        return TaskData::from($task);
    }

    public function update(TaskData $request, Task $task)
    {
        $task->update($request->toModel());

        return TaskData::from($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(null, 204);
    }
}
