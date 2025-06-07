<?php

namespace App\Observers;

use App\Models\System\ModelEvent;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Database\Eloquent\Model;

class ModelObserver
{
    public function created(Model $model): void
    {
        $this->makeEvent('created', $model, $this->makeData($model->getAttributes()));
    }

    public function updated(Model $model): void
    {
        $this->makeEvent('updated', $model, $this->makeData($model->getChanges(), $model->getOriginal()));
    }

    public function deleted(Model $model): void
    {
        $this->makeEvent('deleted', $model);
    }

    public function restored(Model $model): void
    {
        $this->makeEvent('restored', $model);
    }

    public function forceDeleted(Model $model): void
    {
        //
    }

    public function pivotSynced(Model $model, $relationName, $changes): void
    {
        if(count($changes['detached'])>0 || count($changes['attached'])>0){
            $new = $model->$relationName->pluck('id');
            $old = $new->diff($changes['attached'])->merge($changes['detached']);

            $this->makeEvent('updated',$model,[
                $relationName=>[
                'remove' => $changes['detached'],
                'add' => $changes['attached'],
                'old' => $old->all(),
                'new' => $new->all(),
            ]]);
        }

    }

    private function makeData(array $changed, array $original = []): array
    {
        unset($changed['created_at'],$changed['updated_at'],$changed['deleted_at']);

        $eventData = [];
        foreach ($changed as $field => $value) {
            $fieldData = [
                'old' => $original[$field] ?? null,
                'new' => $value,
            ];
            if(is_array($value)){
                if(count($value)>0){
                    $eventData[$field] = $fieldData;
                }
            }else{
                $eventData[$field] = $fieldData;
            }
        }
        return $eventData;
    }

    private function makeEvent(string $type, Model $model, array $data = []): void
    {
        $event = new ModelEvent;
        $event->user_id = auth()->user() ? auth()->user()->id :  0;
        $event->eventable()->associate($model);
        $event->type = $type;
        $event->data = $data;

        $event->text = $this->makeText($model,$type,$data);
        $event->save();
    }

    private function makeText($model,$type,$data): ?string
    {
        $text = null;
        $modelName = strtolower(class_basename($model));
        $fields = config('atlon.models.'.$modelName);
        if(!is_null($fields)){
            $text .= $type==='created' ? '<strong>Создание записи #'.$model->id.'</strong><br>' : '';
            foreach ($data as $field => $values){
                if(isset($fields[$field]) && !isset($fields[$field]['hide']) && $values['old'] !== $values['new']){
                    $text .= $type!=='created' ? 'Изменено поле ' : 'Поле ';
                    $text .='<strong>'.$fields[$field]['label'].'</strong><br>';
                    switch ($fields[$field]['type']){
                        case 'index':
                            if($fields[$field]['source'] === 'values'){
                                $data = $fields[$field]['values'];
                            }
                            if($fields[$field]['source'] === 'config'){
                                if (isset($fields[$field]['pluck'])) {
                                    $pluck = explode('|', $fields[$field]['pluck']);
                                    $data = collect(config($fields[$field]['target']))->pluck($pluck[1], $pluck[0]);
                                } else {
                                    $data = collect(config($fields[$field]['target']))->pluck('title');
                                }
                            }
                            if($fields[$field]['source'] === 'model'){
                                $data = [];
                                $ids = [];
                                if(is_array($values['new'])){
                                    $ids = array_merge($ids,$values['new']);
                                }elseif(!is_null($values['new'])){
                                    $ids[] = $values['new'];
                                }

                                if(is_array($values['old'])){
                                    $ids = array_merge($ids,$values['old']);
                                }elseif(!is_null($values['old'])){
                                    $ids[] = $values['old'];
                                }
                                app("App\\Models\\".$fields[$field]['target'])
                                    ->find($ids)
                                    ->each(function ($item) use (&$data) {
                                        $data[$item->id] = $item->toEventText();
                                    });
                            }
                            if(is_array($values['new']) || is_array($values['old'])){
                                if(count($values['old'])>0){
                                    $text .= '<br>Старое значение:<br>';
                                    foreach ($values['old'] as $old){
                                        $text .= $data[$old];
                                        if( next( $values['old'] ) ) {
                                            $text .= ', ';
                                        }
                                    }
                                }
                                $text .= '<br>Новое значение:<br>';
                                foreach ($values['new'] as $new){
                                    $text .= $data[$new];
                                    if( next( $values['new'] ) ) {
                                        $text .= ', ';
                                    }
                                }
                            }else{
                                $text .= is_null($values['old']) ?
                                    'Новое значение: '.$data[$values['new']] :
                                    'Старое значение: '.$data[$values['old']].', Новое значение: '.$data[$values['new']];
                            }

                            break;
                        case 'file':
                            if(is_null($values['old'])){
                                $text .= 'Добавлен файл';
                                $text .= ' <a href="'.config('app.url').'/storage/'.$values['new'].'">Открыть</a>';
                            }else{
                                if(is_null($values['new'])){
                                    $text .= 'Файл удален';
                                }else{
                                    $text .= 'Файл обновлен';
                                    $text .= ' <a href="'.config('app.url').'/storage/'.$values['new'].'">Открыть</a>';
                                }
                            }
                            break;
                        case 'array':
                            if(is_null($values['old'])){
                                $text .= 'Добавлено';
                            }else{
                                $text .= 'Обновлено';
                            }
                            break;
                        case 'boolean':
                            if(! is_null($values['old'])){
                                $text .= $values['old'] === false ? 'Нет' : 'Да' . ' -> ';
                            }
                            $text .= $values['new'] === false ? 'Нет' : 'Да';
                            break;
                        default :
                            $text .= is_null($values['old']) ?
                                'Новое значение: '.$values['new'] :
                                'Старое значение: '.$values['old'].', Новое значение: '.$values['new'];
                    }
                    $text .='<br>';
                }
            }
        }

        return $text;
    }
}
