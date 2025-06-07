<?php


namespace App\Http\Controllers;

use App\Models\Deals\Pipeline;
use App\Models\Divisions\Company;
use App\Models\User;
use App\Models\Works\WorkCategory;
use App\Models\Works\WorkGroup;
use App\Traits\Fields;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class ListController extends Controller
{
    use Fields;
    public static function index(string $list)
    {
        $obj = new self;
        return $obj->$list();
    }

    private function deal()
    {
        $partners = DB::table('deals')
            ->select('partner')
            ->groupBy('partner')
            ->whereNotNull('partner')
            ->get()->pluck('partner');

        $tags = DB::table('tags')
            ->select('name->ru as name')
            ->whereIn('id', function (Builder $query) {
                $query->from('taggables')->select(['tag_id'])
                    ->where('taggable_type', 'App\Models\Deals\Deal')
                    ->groupBy('tag_id');
            })
            ->get()->pluck('name');

        $user = auth()->user();

        if(!$user->hasRole('superadmin')){
            $pipelinesPermissions = auth()->user()->getPermissionsAttribute()['pipelines'];
            $pipelines = Pipeline::whereIn('id',array_keys($pipelinesPermissions))->get()->keyBy('id');
            $pipelines = $pipelines->map(function ($pipeline) use ($pipelinesPermissions) {
                $stages = array_keys($pipelinesPermissions[$pipeline->id]['stages']);
                $pipeline->load(['stages'=>function ($query) use ($stages) {
                    $query->whereIn('id', $stages);
                }]);
                $pipeline->setRelation('stages', $pipeline->stages->keyBy('id'));
                return $pipeline;
            });
        }else{
            $pipelines = Pipeline::with('stages')->get()->keyBy('id');
            $pipelines = $pipelines->map(function ($pipeline) {
                $pipeline->setRelation('stages', $pipeline->stages->keyBy('id'));
                return $pipeline;
            });
        }


        $workSettings = config('atlon.list.work');

        return [
            'act_statuses' => config('atlon.list.acts.status'),
            'roomSettings' => config('atlon.list.room'),
            'partners' => $partners,
            'companies' => Company::all(['id','name'])->pluck('name','id'),
            'tags' => $tags,
            'users' => User::all(['id', 'name']),
            'tasks' => config('atlon.list.task'),
            'pipelines' => $pipelines,
            'workSettings' => $workSettings,
            'fields' => $this->flatList($this->getFields('atlon.list.deal.fields')),
        ];
    }
    private function work()
    {
        $selects = config('atlon.list.work');
        return [
            'category' => WorkCategory::select(['id', 'name','room_types'])->with('groups')->orderBy('sort')->get(),
            'group' => WorkGroup::select(['id', 'name', 'work_category_id'])->orderBy('sort')->get()->pluck('name', 'id'),
            'factor' => $selects['factors'],
            'ed' => $selects['eds'],
            'type' => $selects['type'],
            'roomTypes' => config('atlon.list.room.types'),
        ];
    }
}
