<?php

namespace App\Models\Finance;

use App\Events\Payment\Created;
use App\Events\Payment\Deleted;
use App\Events\Payment\Updated;
use App\Models\Deals\Deal;
use App\Models\Staff\Employee;
use App\Models\System\ModelEvent;
use App\Models\User;
use App\Observers\ModelObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

#[ObservedBy([ModelObserver::class])]
class Payment extends Model
{
    use SoftDeletes;

    protected $dispatchesEvents = [
        'created' => Created::class,
        'updated' => Updated::class,
        'deleted' => Deleted::class,
    ];

    protected $fillable = [
        'type',
        'total',
        'item',
        'comment',
        'date_transaction',
        'deal_id',
        'cash_register_id',
        'cash_register_recipient_id',
        'user_id',
        'files',
        'status',
        'prorab',
        'final_act',
        'partial_payment',
        'deposit_minus',
        'discount_minus',
    ];

    protected function casts(): array
    {
        return [
            'date_transaction' => 'datetime',
            'files' => 'array',
            'final_act' => 'bool',
        ];
    }
    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }
    public function cashRegister(): BelongsTo
    {
        return $this->belongsTo(CashRegister::class);
    }
    public function cashRegisterRecipient(): BelongsTo
    {
        return $this->belongsTo(CashRegister::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function events(): morphMany
    {
        return $this->morphMany(ModelEvent::class, 'eventable');
    }

    public function scopeFilter(Builder $query): void
    {
        $filters = request()->collect('filter');
        if ($filters->has('deal_uid')) {
            $deal_uid = $filters->get('deal_uid');
            $deals = Deal::where('uid','LIKE',"%$deal_uid%")->get('id')->pluck('id');
            $query->whereIn('deal_id',$deals);
        }
        if ($filters->has('type')) {
            $query->whereIn('type',Arr::wrap($filters->get('type')));
        }
        if ($filters->has('item')) {
            $query->whereIn('item',Arr::wrap($filters->get('item')));
        }
        if ($filters->has('user_id')) {
            $query->whereIn('user_id',Arr::wrap($filters->get('user_id')));
        }
        if ($filters->has('cash_register_id')) {
            $query->whereIn('cash_register_id',Arr::wrap($filters->get('cash_register_id')));
        }
        if ($filters->has('prorab')) {
            $query->whereIn('prorab',Arr::wrap($filters->get('prorab')));
        }
        if ($filters->has('status')) {
            $query->whereIn('status',Arr::wrap($filters->get('status')));
        }
    }

    public function scopeRole(Builder $builder): void
    {
        $user = Auth::user();
        if(is_null($user) || $user->hasRole('superadmin')){
            return;
        }
        if($user->hasRole('Начальник Участка')){
            $ids = [$user->id];
            $users = Employee::select('id')->where('chief',$user->profile_id)->with('user')->get()->pluck('user.id');
            $ids = $users->merge($ids);
            $builder->whereIn('payments.user_id', $ids);
            return;
        }
        if($user->hasRole('Прораб')){
            $builder->where('payments.user_id', '=', $user->id);
        }
    }
}
