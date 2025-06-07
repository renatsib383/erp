<?php

namespace App\Models\Deals;

use App\Models\BaseModel;
use App\Models\Communications\Call;
use App\Models\Contacts\Contact;
use App\Models\Finance\Payment;
use App\Models\Remont\Act;
use App\Models\Remont\Room;
use App\Models\Remont\Smet;
use App\Models\System\ModelEvent;
use App\Models\User;
use App\Observers\ModelObserver;
use GeneaLabs\LaravelPivotEvents\Traits\PivotEventTrait;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Tags\HasTags;

#[ObservedBy([ModelObserver::class])]
class Deal extends BaseModel
{
    use HasFactory, HasTags, SoftDeletes, PivotEventTrait;
    protected $casts = [
        'date_start' => 'date',
        'date_end' => 'date',
        'amo_sync' => 'timestamp',
        'budget_sum' => 'integer',
        'price' => 'array',
        'geo' => 'array',
        'deferred_discount' => 'boolean',
        'confirm_act' => 'boolean',
        'deferred_skidka_paid' => 'boolean',
        'agent' => 'boolean',
    ];

    protected $fillable = [
        'uid',
        'company_id',
        'address',
        'budget_sum',
        'confirmed_smet_sum',
        'additional_works_sum',
        'tags',
        'facility_type',
        'facility_condition',
        'renovation_type',
        'partner',
        'agent',
        'region',
        'temperature',
        'lead_source',
        'skidka',
        'coef',
        'responsible',
        'designer',
        'operator',
        'prorab',
        'zamerman',
        'created_at',
        'updated_at',
        'amo_id',
        'sab_id',
        'amo_sync',
        'price',
        'date_start',
        'date_end',
        'geo',
        'deferred_discount',
        'confirm_act',
        'coef_price_master',
        'hold_master',
        'forced_percent_master',
        'increase_master',
        'forced_percent_prorab',
        'coef_additional_partner',
        'deferred_skidka_paid',
        'prepayment',
    ];

    protected $hidden = [
        'deleted_at',
        'amo_id',
        'amo_sync',
    ];

    public function responsible(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible');
    }

    public function designer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'designer');
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator');
    }

    public function zamerman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'zamerman');
    }

    public function prorab(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prorab');
    }

    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }

    public function tasks(): hasMany
    {
        return $this->hasMany(Task::class);
    }

    public function calls(): hasMany
    {
        return $this->hasMany(Call::class);
    }

    public function notes(): hasMany
    {
        return $this->hasMany(Note::class);
    }

    public function rooms(): hasMany
    {
        return $this->hasMany(Room::class);
    }

    public function acts(): hasMany
    {
        return $this->hasMany(Act::class);
    }

    public function smets(): hasMany
    {
        return $this->hasMany(Smet::class);
    }

    public function payments(): hasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function stages(): BelongsToMany
    {
        return $this->belongsToMany(Stage::class)->select(['id', 'title as name', 'color', 'pipeline_id']);
    }

    public function contacts(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class);
    }

    public function scopeFilterStages(Builder $query, $stages) : void
    {
        if(!is_null($stages) && count($stages)>0){
            $query->whereHas('stages', function ($q) use ($stages) {
                $q->whereIn('stage_id', $stages);
            });
        }
    }

    public function scopeFilter(Builder $query): void
    {
        $filters = request()->collect('filter');

        $fields = config('atlon.list.deal.fields');

        $filters->each(function ($value, $field) use ($query, $fields) {
            if (isset($fields[$field]) && $fields[$field]['filter'] && $value !== null) {
                switch ($fields[$field]['type']) {
                    case 'money':
                        if (isset($value['from'], $value['to'])) {
                            $query->whereBetween($field, [$value['from'], $value['to']]);
                        }
                        if (isset($value['from']) && ! isset($value['to'])) {
                            $query->where($field, '>', $value['from']);
                        }
                        if (! isset($value['from']) && isset($value['to'])) {
                            $query->where($field, '<', $value['to']);
                        }
                        break;
                    case 'boolean':
                        $query->where($field, true);
                        break;
                    case 'string':
                        if ($value === 'empty') {
                            $query->whereNull($field);
                        }
                        if (is_string($value) && $value !== 'empty') {
                            $query->where($field, 'LIKE', "%$value%");
                        }
                        if (is_array($value)) {
                            $query->whereIn($field, array_values($value));
                        }
                        break;
                    case 'datetime':
                        $start = Carbon::create($value[0])->startOfDay();
                        if (isset($value[1])) {
                            $end = Carbon::create($value[1])->endOfDay();
                        } else {
                            $end = Carbon::create($value[0])->endOfDay();
                        }
                        $query->whereBetween($field, [$start, $end]);
                        break;
                    default:
                        if (is_array($value)) {
                            $query->whereIn($field, array_values($value));
                        } else {
                            $query->where($field, $value);
                        }
                        break;
                }
            }
        });

        if ($filters->has('task')) {
            $task = $filters->get('task');

            if (isset($task['withoutTasks'])) {
                $query->doesntHave('tasks');
            }

            $dates = [
                'start' => null,
                'end' => null,
            ];
            if (isset($task['endDate'])) {
                $dates['end'] = Carbon::create($task['endDate'])->endOfDay();
            }
            if (isset($task['startDate'])) {
                $dates['start'] = Carbon::create($task['startDate'])->startOfDay();
            }
            if (isset($task['lastDays'])) {
                $dates['end'] = Carbon::now()->endOfDay();
                $dates['start'] = Carbon::now()->endOfDay()->subDays($task['lastDays']);
            }
            if ($dates['start'] !== null || $dates['end'] !== null) {
                $query->whereHas('tasks', function ($q) use ($dates) {
                    if ($dates['start'] !== null && $dates['end'] !== null) {
                        $q->whereBetween('start', [$dates['start'], $dates['end']]);
                    }
                    if ($dates['start'] === null) {
                        $q->where('start', '<=', $dates['end']);
                    }

                    if ($dates['end'] === null) {
                        $q->where('start', '>=', $dates['start']);
                    }
                });
            }
        }

        if ($filters->has('tags')) {
            $tags = $filters->get('tags');
            $tags = static::convertToTags($tags);
            $query
                ->whereHas('tags', function (Builder $query) use ($tags) {
                    $tagIds = collect($tags)->pluck('id');
                    $query->whereIn('tags.id', $tagIds);
                });
        }

        if ($filters->has('stage')) {
            $stages = $filters->get('stage');
            $query->whereHas('tasks', function ($q) use ($stages) {
                $q->whereIn('id', $stages);
            });
        }

        if ($filters->has('team')) {
            $team = $filters->get('team');

            $query->whereIn('id',function ($query) use ($team) {
                $query->select('id')
                    ->from('deals')
                    ->orWhereIn('responsible', $team)
                    ->orWhereIn('designer', $team)
                    ->orWhereIn('operator', $team)
                    ->orWhereIn('zamerman', $team)
                    ->orWhereIn('prorab', $team);
            });
        }
    }

    public function scopeUser(Builder $query, User $user): void
    {
        $query->whereIn('id',function ($query) use ($user) {
            $query->select('id')
                ->from('deals')
                ->orWhere('responsible', $user->id)
                ->orWhere('designer', $user->id)
                ->orWhere('operator', $user->id)
                ->orWhere('zamerman', $user->id)
                ->orWhere('prorab', $user->id);
        });
    }

    public function scopeSearch(Builder $query): void
    {
        $search = request()->query('search', false);

        if ($search !== false) {
            $query->whereSearch(['uid', 'address'], $search);
            $query->orWhereHas('contacts', function ($query) use ($search) {
                return $query->whereSearch(['name', 'phone'], $search);
            });
        }
    }
    public function toEventText(): string
    {
        return $this->uid;
    }
}
