<?php

namespace App\Http\Controllers\Deals;

use App\Data\Deals\DealData;
use App\Events\Deal\Created;
use App\Events\Deal\Updated;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ListController;
use App\Models\Communications\Call;
use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use App\Models\Deals\Note;
use App\Models\Deals\Stage;
use App\Models\Deals\Task;
use App\Models\Remont\Room;
use App\Models\Remont\Smet;
use App\Models\System\ModelEvent;
use App\Models\Works\Work;
use App\Services\PrimevueDatatables\PrimevueDatatables;
use App\Traits\Fields;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Broadcast;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DealController extends Controller
{
    use Fields;

    private array $fields;

    public function store(DealData $request)
    {
        $data = $request->toModel();

        $deal = Deal::create($data);

        $this->syncRelations($data, $deal);

        Created::dispatch($deal);

        return $this->show($deal);
    }

    /**
     * @param  array  $data
     * @param  Deal  $deal
     */
    private function syncRelations(array $data, Deal $deal): void
    {
        if (isset($data['contacts'])) {
            $deal_contacts = [];
            foreach ($data['contacts'] as $contact) {
                $deal_contacts[] = Contact::firstOrCreate(
                    ['phone' => $contact['phone']],
                    [
                        'name' => $contact['name'],
                        'surname' => $contact['surname'],
                        'patronymic' => $contact['patronymic'],
                    ],
                )->id;
            }
            $deal->contacts()->sync($deal_contacts);
        }

        $resultStages = $deal->stages()->sync($data['stages']);

        if (count($resultStages['attached']) > 0 || count($resultStages['detached']) > 0) {
            Broadcast::broadcast([new PresenceChannel('deals')], 'App\\Events\\Deal\\Moved', [
                'deal_id' => $deal->id,
                'add' => Stage::with('pipeline')->whereIn('id', $resultStages['attached'])->get(),
                'remove' => Stage::with('pipeline')->whereIn('id', $resultStages['detached'])->get(),
            ]);
        }
    }

    public function show(Deal $deal)
    {
        return [
            'deal' => $deal->loadMissing(['stages.pipeline', 'contacts', 'tasks', 'smets', 'acts', 'rooms', 'tags']),
            'lists' => (new ListController())->index('deal'),
        ];
    }

    public function index(Request $request)
    {
        //dd($stages->toArray());
        $fields = DealData::empty();

        $filters = $fields;
        unset($filters['stages']);
        $filters = array_keys($filters);
        $filters[] = AllowedFilter::scope('stages');
        return QueryBuilder::for(Deal::class)->allowedFields(array_keys($fields))->allowedIncludes([
                'stages',
                'contacts',
                'calls',
                'tasks',
                'events',
                'smets',
                'acts',
                'rooms',
                'notes',
                'responsible',
                'operator',
                'designer',
                'zamerman',
                'prorab',
            ])->allowedFilters($filters)->allowedSorts(array_keys($fields))->jsonPaginate();
    }

    public function update(DealData $request, Deal $deal)
    {
        $data = $request->toModel();
        $deal->update($data);

        $this->syncRelations($data, $deal);

        $deal->loadSum([
            'acts' => function ($query) {
                $query->where('status', '>=', 2);
            },
            'smets' => function ($query) {
                $query->where('approved', 1);
            },
        ], 'total'
        )->load(['tags', 'stages.pipeline', 'contacts']);

        Updated::dispatch($deal);

        return $this->show($deal);
    }

    public function destroy(Deal $deal)
    {
        $deal->delete();

        return response()->json(null, 204);
    }

    public function feed(Deal $deal)
    {
        $dealNotes = $deal->notes()->with([
            'user' => function ($q) {
                $q->select('id', 'name');
            },
        ])->get();

        $dealEvents = $deal->events()->with([
            'user' => function ($q) {
                $q->select('id', 'name');
            },
        ])->get();

        $dealTasks = $deal->tasks()->with([
            'author' => function ($q) {
                $q->select('id', 'name');
            },
            'performer' => function ($q) {
                $q->select('id', 'name');
            },
            'events',
        ])->get();

        $dealCalls = $deal->calls()->get();

        $feed = $dealEvents
            ->concat($dealNotes)->concat($dealTasks)->concat($dealCalls)->map(function ($item) {
                if ($item instanceof ModelEvent) {
                    $type = 'event';
                }
                if ($item instanceof Note) {
                    $type = 'note';
                }
                if ($item instanceof Task) {
                    $type = 'task';
                }
                if ($item instanceof Call) {
                    $type = 'call';
                }
                if (isset($type)) {
                    $result = $item->toArray();
                    $result['entry_type'] = $type;
                    return $result;
                }
                return null;
            })->sortBy('created_at')->values();
        //dd($feed->toArray(),$dealNotes->toArray(),$dealEvents->toArray(),$dealTasks->toArray(),$dealCalls->toArray());

        return response()->json(['feed' => $feed]);
    }

    public function makePrice(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'skidka' => 'required|numeric',
        ]);
        $deal->skidka = $validated['skidka'];

        $coef = $deal->coef - ((float)$deal->skidka / 100);

        $works = Work::all(['id', 'price'])->pluck('price', 'id')->toArray();
        foreach ($works as &$work) {
            $work = (int)round($work * $coef);
        }

        $deal->price = ['created_at' => Carbon::now(), 'list' => $works];

        $deal->save();
        Updated::dispatch($deal);
        $deal->load('tags');

        return response()->json($deal);
    }

    public function smetCopy(Deal $deal, Smet $smet)
    {
        $newSmetRooms = $smet->rooms;

        $rooms = [];
        $roomsMap = [];
        foreach ($smet->rooms['list'] as $roomId) {
            $newRoom = Room::find($roomId)->replicate()->fill([
                'deal_id' => $deal->id,
                'sab_id' => null,
            ]);
            $newRoom->save();
            $rooms[] = $newRoom;
            $roomsMap[$roomId] = $newRoom->id;
        }
        $list = [];
        $works = [];
        foreach ($roomsMap as $oldRoomId => $newRoomId) {
            $list[] = $newRoomId;
            if (isset($smet->rooms['works'][$oldRoomId])) {
                $works[$newRoomId] = $smet->rooms['works'][$oldRoomId];
            }
        }
        $newSmetRooms['list'] = $list;
        $newSmetRooms['works'] = $works;
        $newSmet = $smet->replicate()->fill([
            'deal_id' => $deal->id,
            'sab_ver' => null,
            'rooms' => $newSmetRooms,
        ]);
        $newSmet->save();

        return response()->json(['smet' => $newSmet, 'rooms' => $rooms]);
    }

    public function dataKanban()
    {
        $stages = request()->collect('stages');

        $global = [
            'all-fields' => request()->query('all-fields', false),
            'field' => request()->query('field', 'id'),
            'order' => request()->query('order', '-1'),
            'offset' => request()->query('offset', 0),
            'limit' => request()->query('limit', 25),
        ];

        if ($stages->isEmpty()) {
            $stage = request()->query('stage', 1);
            $stages[$stage] = [];
        }

        $list = [];

        $stages_stat = [];

        $filters = request()->collect('filter');

        if ($filters->has('deal_stage_id')) {
            $stages = $stages->only($filters->get('deal_stage_id'));
            $filters->forget('deal_stage_id');
        }

        $stages = Stage::select('id')->withCount('deals as count')->withSum(
                'deals as smet',
                'confirmed_smet_sum',
            )->withSum('deals as additional', 'additional_works_sum')->whereIn('id', $stages)->get()->keyBy('id');

        $stages->each(function ($stage, $key) use ($global, &$list, &$stages_stat) {
            $stages_stat[$key] = [
                'stage' => $key,
                'count' => $stage->count,
                'sum' => $stage->smet + $stage->additional,
            ];
            $items = Deal::filter()->search()->with(['tags', 'stages.pipeline', 'contacts'])->withSum([
                'acts' => function ($query) {
                    $query->where('status', 2);
                },
                'smets' => function ($query) {
                    $query->where('approved', 1);
                },
            ], 'total');

            $direction = $stage['order'] ?? $global['order'];
            $direction = $direction == 1 ? 'asc' : 'desc';
            $items
                ->whereHas('stages', function ($query) use ($key) {
                    $query->where('id', $key);
                })->orderBy($stage['field'] ?? $global['field'], $direction)->offset(
                    $stage['offset'] ?? $global['offset'],
                )->limit($stage['limit'] ?? $global['limit']);

            $list[$key] = $items->get();
        });

        return response()->json(['stages' => $list, 'stat' => $stages_stat]);
    }

    public function dataTable()
    {
        $filters = request()->collect('filter');

        if ($filters->has('deal_stage_id')) {
            $stages = $filters->get('deal_stage_id');
            $filters->forget('deal_stage_id');
        }


        $query = Deal::query()->search()->filter()->with(['tags', 'stages.pipeline', 'contacts']);

        if(isset($stages)){
            $query->whereHas('stages', function ($q) use ($stages) {
                $q->whereIn('id', $stages);
            });
        }
        $user = auth()->user();

        if(!$user->hasRole('superadmin')){
            $pipelinesPermissions = $user->getPermissionsAttribute()['pipelines'];

            $stages = [];
            foreach ($pipelinesPermissions as $pipeline){
                $stages = array_merge($stages,array_keys($pipeline['stages']));
            }

            $query->whereHas('stages', function ($query) use ($stages) {
                $query->whereIn('id', $stages);
            });
        }


        $query->withSum([
            'payments as revenue_fact'=>function (Builder $query){
                $query->where('item',1);
                $query->where('status',3);
            },
            'payments as draft_material'=>function (Builder $query){
                $query->where('item',3);
                $query->where('status',3);
            },
            'payments as fotr_masters'=>function (Builder $query){
                $query->where('item',20);
                $query->where('status',3);
            },
            'payments as fotr_prorab'=>function (Builder $query){
                $query->where('item',27);
                $query->where('status',3);
            },
            'payments as retention'=>function (Builder $query){
                $query->where('item',22);
                $query->where('status',3);
            },
            'payments as discount'=>function (Builder $query){
                $query->where('item',21);
                $query->where('status',3);
            },
            'payments as payment'=>function (Builder $query){
                $query->where('type',1);
                $query->whereNotIn('cash_register_id',[1,2]);
                $query->where('status',3);
            },
            'payments as payment_rs'=>function (Builder $query){
                $query->where('type',1);
                $query->where('cash_register_id',2);
                $query->where('status',3);
            },
        ],'total');

        $list = PrimevueDatatables::of($query)->make();
        foreach ($list['records'] as $index => &$record){
            $deal = $record->toArray();
            $deal['revenue_plan'] = $deal['confirmed_smet_sum'];
            if($deal['coef']==1){
                $deal['revenue_plan_without_coef'] = $deal['revenue_plan'];
                $deal['revenue_fact_without_coef'] = $deal['revenue_fact'];
            }else{
                $deal['revenue_plan_without_coef'] = round($deal['revenue_plan']/$deal['coef'],2);
                $deal['revenue_fact_without_coef'] = round($deal['revenue_fact']/$deal['coef'],2);
            }
            if($deal['revenue_fact']>0){
                $deal['fotr_masters_percent'] = round(($deal['fotr_masters']/$deal['revenue_fact']) * 100, 0);
                $deal['fotr_prorab_percent'] = round(($deal['fotr_prorab']/$deal['revenue_fact']) * 100, 0);
                $deal['discount_percent'] = round(($deal['discount']/$deal['revenue_fact']) * 100, 0);
                $deal['retention_percent'] = round(($deal['retention']/$deal['revenue_fact']) * 100, 0);
            }
            $record = $deal;
        }
        return response()->json($list);
    }
}
