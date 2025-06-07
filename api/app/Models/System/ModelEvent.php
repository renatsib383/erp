<?php

namespace App\Models\System;

use App\Models\Deals\Deal;
use App\Models\Deals\Task;
use App\Models\User;
use App\Notifications\newEvent;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ModelEvent extends Model
{
    use BroadcastsEvents,SoftDeletes;

    private array $modelRouteMap = [
        'Role' => ['name'=> 'Роль','url'=>'/roles/'],
        'User' => ['name'=> 'Пользователь','url'=>'/users/'],
        'Contact' => ['name'=> 'Контакт','url'=>'/contacts/'],
        'Deal' => ['name'=> 'Сделка','url'=>'/deals/'],
        'Pipeline' => ['name'=> 'Воронка'],
        'Stage' => ['name'=> 'Этап'],
        'Task' => ['name'=> 'Задача'],
        'Company' => ['name'=> 'Компания','url'=>'/companies/'],
        'RoomType' => ['name'=> 'Тип комнаты'],
        'Employee' => ['name'=> 'Сотрудник'],
        'Position' => ['name'=> 'Должность','url'=>'/positions/'],
        'Work' => ['name'=> 'Работа','url'=>'works'],
        'WorkCategory' => ['name'=> 'Категория работ'],
        'WorkCollection' => ['name'=> 'Набор работ','url'=>'/works-collections/'],
        'WorkGroup' => ['name'=> 'Группа работ'],
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function eventable(): MorphTo
    {
        return $this->morphTo()->withTrashed();
    }

    public function broadcastOn(string $event): array
    {
        $model = $this->eventable;
        if ($model instanceof Deal) {
            $dealId = $model->id;
        } else {
            $dealId = $model->getAttribute('deal_id');
        }
        if ($dealId && $dealId !== '' && $event === 'created') {
            return [new PresenceChannel('feed.'.$dealId)];
        }

        return [];
    }

    /**
     * The model event's broadcast name.
     * */
    public function broadcastAs(string $event): ?string
    {
        $model = $this->eventable;
        if ($model instanceof Deal) {
            $name = 'DealEvent';
        } elseif ($model instanceof Task) {
            $name = 'TaskEvent';
        } else {
            return null;
        }

        return match ($event) {
            'created' => $name.'Created',
            default => null,
        };
    }

    public function broadcastWith(): array
    {
        $source = $this->eventable;
        if ($source instanceof Task) {
            $source->load(['author', 'performer', 'events']);
        }

        return ['model' => $this, 'source' => $source];
    }
    protected static function booted(): void
    {
        static::created(function (ModelEvent $event) {
            if($event->user_id !== 0){
                $body = $event->text;
                $parts =  explode('\\', $event->eventable_type);
                $modelName = array_pop($parts);
                //if($modelName === '' || !isset($event->modelRouteMap[$modelName]['name'])){
                if($modelName === '' || !in_array($modelName,['Deal','Task','Contact'])){
                    return;
                }
                $title = match ($event->type){
                    'created' => 'Добавлено ',
                    'updated' => 'Обновлено ',
                    'deleted' => 'Удалено ',
                };
                $title .= $event->modelRouteMap[$modelName]['name'];
                $link =  isset($event->modelRouteMap[$modelName]['url']) ? $event->modelRouteMap[$modelName]['url'].$event->eventable_id : null;
                if($modelName === 'Task'){
                    $deal_id = $event->eventable->deal_id;
                    $link = $event->modelRouteMap['Deal']['url'].$deal_id;
                }
                $users = User::all();
                foreach ($users as $user){
                    $user->notify(new newEvent(
                        title: $title,
                        body:$body,
                        link: $link
                    ));
                }
            }
        });
    }
}
