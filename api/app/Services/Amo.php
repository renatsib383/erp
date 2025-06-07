<?php

namespace App\Services;

use AmoCRM\Client\AmoCRMApiClient;
use AmoCRM\Client\LongLivedAccessToken;
use AmoCRM\Exceptions\AmoCRMApiErrorResponseException;
use AmoCRM\Exceptions\AmoCRMApiException;
use AmoCRM\Filters\ContactsFilter;
use AmoCRM\Filters\EventsFilter;
use AmoCRM\Filters\LeadsFilter;
use AmoCRM\Filters\NotesFilter;
use AmoCRM\Filters\TasksFilter;
use AmoCRM\Helpers\EntityTypesInterface;
use AmoCRM\Models\Factories\NoteFactory;
use AmoCRM\Models\LeadModel;
use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use App\Models\Deals\Note;
use App\Models\Deals\Pipeline;
use App\Models\Deals\Stage;
use App\Models\Deals\Task;
use App\Models\System\ModelEvent;
use App\Traits\Fields;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class Amo
{
    use Fields;

    // Инициализация массива данных сделки
    private array $dealData = [
        'uid' => null, // lead#name
        'pipeline_id' => null,
        'stage_id' => null, // lead#statusId
        //        'fio' => null, // contact#name
        //        'telephone' => null, // contact#name
        'tags' => [], // lead#tags
    ];

    private array $eventTypes = [
        //'lead_added',
        'lead_status_changed',
        //'entity_tag_added',
        //'entity_tag_deleted',
        'custom_field_value_changed',
        'name_field_changed',
        //'sale_field_changed',
    ];

    // Инициализация карты полей
    private array $fieldsMap = [
        906757 => 'region',
        896235 => 'address',

        //        898619 => 'budget_sum', /// В амо текстовая строка,
        180717 => 'facility_type',
        907331 => 'facility_condition',
        898121 => 'renovation_type',

        899103 => 'partner',

        905319 => 'temperature',
        180709 => 'lead_source',
        898101 => 'skidka',
        898103 => 'coef',
        //903349 => 'zamer_date',
        //903347 => 'zamer_time', // В амо текстовая строка,
        //363555 => 'zamerman',
        //893831 => 'designer',
        //913947 => 'operator',
        //896555 => 'responsible'
    ];

    private string $_accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ4MDNiN2Q5MGUyOGZkN2Q3ZjM0NGQ4YzRlYjJhNjE0N2Y1MzAzNDg4MDc5NTk3YWE1M2Y3MjU4YzMyMjQ3MzU1YzhhZWM5YjVlYzE5ZWM5In0.eyJhdWQiOiI0ZmI2YTkwYy0yZmM4LTRjODEtOWM5Yi1iYWJkM2E0ODI0ZGQiLCJqdGkiOiJkODAzYjdkOTBlMjhmZDdkN2YzNDRkOGM0ZWIyYTYxNDdmNTMwMzQ4ODA3OTU5N2FhNTNmNzI1OGMzMjI0NzM1NWM4YWVjOWI1ZWMxOWVjOSIsImlhdCI6MTczMDM4MTMxNCwibmJmIjoxNzMwMzgxMzE0LCJleHAiOjE3NjE4Njg4MDAsInN1YiI6IjY0MTEzMzciLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MjkwODY4MTAsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbImNybSIsImZpbGVzIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyIsInB1c2hfbm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiJmNDAzMTNjYS0yYzRmLTQ1OWYtYTY3Mi05M2U2MWU0ZGRlNWYiLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.CUr3VD9__mg5na-WRic6Kd6bAh6l-IJOTKpk9e_A2YdQ7fwqjc3gJTkT4GsfmScwK0qGTwsDcCqDXee37KpVDk4CLMqHrY4T8P5EMIfyeCKSQuGhkNFOYmmAhbz6O_N-z9nTmTUx7EQiHa6KL8m0nVcOAwKA6Ce4zJVUXMotJnN4elYjVZ4zB4luwn0t4YSYeetQa1TBjPoyd4ipuKmIuBMzHb5R5EvYbi3pNmi3ksHBTACNgelR39YL_wVk49uSnmoe837IlcquaZ9WCD-ISxo6ydqHUdHR0n6rXqe3luPWoe4YIs3n8VixtpM12JHOdq2ghqzf-gdMJ1ADid9a-w'; // Токен доступа

    private string $_baseDomain = 'alexandrrepairment.amocrm.ru'; // Базовый домен

    private AmoCRMApiClient $apiClient;

    private Collection $stages;

    private Collection $pipeline;

    private array $fields;

    public function __construct()
    {
        $this->stages = Stage::select(['id', 'amo_id'])->whereNotNull('amo_id')->get()->pluck('id', 'amo_id');
        $this->pipeline = Pipeline::select(['id', 'amo_id'])->whereNotNull('amo_id')->get()->pluck('id', 'amo_id');
        $this->fields = $this->getFields('atlon.list.deal.fields'); // Получение настроек полей

        $this->apiClient = new AmoCRMApiClient; // Создание объекта клиента API
        $this->apiClient->setAccountBaseDomain($this->_baseDomain); // Установка базового домена
        try {
            $accessToken = new LongLivedAccessToken($this->_accessToken); // Создание объекта токена доступа
            $this->apiClient->setAccessToken($accessToken); // Установка токена доступа
        } catch (AmoCRMApiException $e) { // Обработка исключений API
            $this->printError($e); // Вывод ошибки
        }
    }

    private function printError(AmoCRMApiException $e): void // Функция для вывода ошибок
    {
        $errorTitle = $e->getTitle(); // Получение заголовка ошибки
        $code = $e->getCode(); // Получение кода ошибки
        $debugInfo = var_export($e->getLastRequestInfo(), true); // Получение информации о последнем запросе

        $validationErrors = null; // Инициализация переменной для ошибок валидации
        if ($e instanceof AmoCRMApiErrorResponseException) { // Проверка, является ли ошибка ошибкой ответа API
            $validationErrors = var_export($e->getValidationErrors(), true); // Получение ошибок валидации
        }

        $error = <<<EOF
            Error: $errorTitle
            Code: $code
            Debug: $debugInfo
            EOF; // Формирование строки с ошибкой

        if ($validationErrors !== null) { // Если есть ошибки валидации, добавляем их к строке ошибки
            $error .= PHP_EOL.'Validation-Errors: '.$validationErrors.PHP_EOL;
        }

        echo '<pre>'.$error.'</pre>'; // Вывод ошибки в формате pre
    }

    public function getLeadData(Deal $deal): Deal|string
    {
        $lead = null;

        if (is_null($deal->amo_id)) {
            $phone = preg_replace('/[^0-9]/', '', $deal->contacts()->first()->phone);
            $leads = false;
            $pipelines = array_flip($this->pipeline->toArray());
            $filter = new LeadsFilter;

            $stages = $deal->stages()->with('pipeline')->get();
            $amoPipelines = [];
            foreach ($stages as $stage) {
                if (isset($pipelines[$stage->pipeline->id])) {
                    $amoPipelines[] = $pipelines[$stage->pipeline->id];
                }
            }
            $filter->setPipelineIds($amoPipelines);
            if ($deal->uid !== null) {
                try {
                    $filter->setQuery($deal->uid);
                    $leads = $this->apiClient->leads()->get($filter, [LeadModel::CONTACTS]);
                } catch (AmoCRMApiException $e) {
                    if ($e->getCode() !== 204) {
                        $this->printError($e);
                    }
                }
            }
            if ($leads === false) {
                try {
                    $filter->setQuery(substr($phone, -10)); // Установка фильтра по номеру телефона
                    $leads = $this->apiClient->leads()->get($filter, [LeadModel::CONTACTS]);
                } catch (AmoCRMApiException $e) { // Обработка исключений API
                    if ($e->getCode() !== 204) {
                        $this->printError($e);
                    }
                }
            }

            if ($leads) {
                $lead = $leads->last();
            } else {
                return "Lead with uid: $deal->uid or phone: $phone not found in Amo";
            }
        } else {
            try {
                $lead = $this->apiClient->leads()->getOne($deal->amo_id, [LeadModel::CONTACTS]); // Получение сделки по ID
            } catch (AmoCRMApiException $e) { // Обработка исключений API
                $this->printError($e); // Вывод ошибки
            }
        }

        return $this->updateDeal($deal, $lead) ? $deal->load(['tags', 'stages.pipeline', 'contacts']) : 'Error';
    }

    private function updateDeal(Deal $deal, LeadModel $lead): bool
    {
        $this->getContacts($deal, $lead);

        $notInMap = []; // Инициализация массива для полей, не найденных в карте

        $this->dealData['amo_id'] = $lead->getId();

        $this->dealData['uid'] = $lead->getName(); // Установка имени сделки

        $dealStages = $deal->stages()->get();
        $detachIds = [];
        $stagesIds = $this->stages->values()->toArray();
        foreach ($dealStages as $dealStage) {
            if (in_array($dealStage->id, (array) $stagesIds)) {
                $detachIds[] = $dealStage->id;
            }

        }
        $deal->stages()->detach($detachIds);
        $deal->stages()->attach([$this->stages->get($lead->getStatusId())]);

        $this->dealData['created_at'] = $lead->getCreatedAt();
        $this->dealData['updated_at'] = $lead->getUpdatedAt();

        $tags = $lead->getTags();
        if (! is_null($tags)) {
            foreach ($lead->getTags() as $tag) { // Перебор тегов сделки
                $this->dealData['tags'][] = $tag->getName(); // Добавление тегов в данные сделки
            }
        }

        //dd($contacts,$lead);
        $fields = $lead->getCustomFieldsValues();
        if (! is_null($fields)) {
            foreach ($fields as $field) { // Перебор пользовательских полей сделки
                if (isset($this->fieldsMap[$field->getFieldId()])) { // Если поле есть в карте полей
                    $fieldName = $this->fieldsMap[$field->getFieldId()]; // Получение имени поля
                    if ($this->fields[$fieldName]['type'] === 'index') { // Если тип поля - индекс
                        if ($this->fields[$fieldName]['source'] === 'config') { // Если источник поля - конфигурация
                            $list = collect($this->fields[$fieldName]['list']); // Создание коллекции из списка полей
                            if ($list->firstWhere('amo') !== null) { // Если поле найдено в списке
                                $list = $list->pluck('amo')->flip(); // Перестановка ключей и значений в списке
                                $this->dealData[$fieldName] = $list->get(
                                    $field->getValues()->last()->getEnumId(),
                                ); // Установка значения поля
                            } else {
                                $notInMap[] = [
                                    'id' => $field->getFieldId(),
                                    'name' => $field->getFieldName(),
                                    $field->getValues()->last()->getValue(),
                                ]; // Добавление поля в массив не найденных
                            }
                        }
                    } else {
                        $this->dealData[$fieldName] = $field->getValues()->last()->getValue(
                        ); // Установка значения поля
                    }
                } else {
                    $notInMap[] = [
                        'id' => $field->getFieldId(),
                        'name' => $field->getFieldName(),
                        $field->getValues()->last()->getValue(),
                    ]; // Добавление поля в массив не найденных
                }
            }
        }

        try {
            $deal->updateQuietly($this->dealData); // Обновление существующей сделки
        } catch (UniqueConstraintViolationException $e) {
            return false;
        }

        $this->getTasks($deal);
        $this->getNotes($deal);
        $this->getEvents($deal);

        $deal->updateQuietly(['amo_sync' => Carbon::now('UTC')]);

        return true;
    }

    private function getContacts(Deal $deal, LeadModel $lead): void
    {

        $filter = new ContactsFilter;
        $filter->setIds($lead->getContacts()->pluck('id'));

        $contacts = null;
        try {
            $contacts = $this->apiClient->contacts()->get($filter); // Получение задач по фильтру
        } catch (AmoCRMApiException $e) { // Обработка исключений API
            if ($e->getCode() !== 204) {
                $this->printError($e);
            }
        }

        if ($contacts !== null) {
            $deal_contacts = $deal->contacts()->get();
            foreach ($contacts as $contact) {
                $name = $contact->getName();
                $phone = $contact->getCustomFieldsValues()->getBy('fieldCode', 'PHONE')->getValues()->first()->getValue();
                $phone = '7'.substr($phone, -10);
                $dbc = Contact::firstOrCreate(['phone' => $phone], ['name' => $name]);
                if (! $deal_contacts->contains($dbc)) {
                    $deal->contacts()->attach($dbc);
                }
            }
        }
    }

    private function getTasks(Deal $deal): void
    {
        $tasks = null;
        $tasksFilter = new TasksFilter; // Создание фильтра для задач
        if ($deal->amo_sync !== null) {
            $tasksFilter->setUpdatedAt($deal->amo_sync);
        }
        $tasksFilter // Установка фильтра по типу сущности и ID сделки
            ->setEntityType(EntityTypesInterface::LEADS)->setEntityIds($deal->amo_id);
        try {
            $tasks = $this->apiClient->tasks()->get($tasksFilter); // Получение задач по фильтру

        } catch (AmoCRMApiException $e) { // Обработка исключений API
            if ($e->getCode() !== 204) {
                $this->printError($e);
            }
        }
        if ($tasks !== null) {
            foreach ($tasks as $item) {
                $title = $item->getText();

                if ($title !== null) {
                    $task = new Task;

                    $task->type = match ($item->getTaskTypeId()) {
                        1 => 1,
                        2 => 2,
                        default => 999,
                    };

                    if ($item->getIsCompleted()) {
                        $task->status = 3;
                    } else {
                        $task->status = 1;
                    }
                    $task->author = 760;
                    $task->start = $item->getCreatedAt();
                    $task->end = $item->getCompleteTill();
                    $task->title = $title;
                    $task->deal_id = $deal->id;
                    $task->description = $item->getResult();
                    $task->created_at = $item->getCreatedAt();
                    $task->updated_at = $item->getUpdatedAt();

                    try {
                        $task->save();
                    } catch (QueryException $exception) {
                    }
                }
            }
        }
    }

    private function getNotes(Deal $deal): void
    {
        $notes = null;
        try {
            $notesFilter = new NotesFilter;
            $notesFilter->setNoteTypes([NoteFactory::NOTE_TYPE_CODE_COMMON]);
            if ($deal->amo_sync !== null) {
                $notesFilter->setUpdatedAt($deal->amo_sync);
            }
            $notes = $this->apiClient->notes(EntityTypesInterface::LEADS)->getByParentId(
                $deal->amo_id,
                $notesFilter,
            ); // Получение заметок по ID сделки
        } catch (AmoCRMApiException $e) { // Обработка исключений API
            if ($e->getCode() !== 204) {
                $this->printError($e);
            }
        }
        //dd($notes);
        if ($notes !== null) {
            foreach ($notes as $note) {
                $message = new Note;
                $message->deal_id = $deal->id;
                $message->text = $note->getText();
                $message->created_at = $note->getCreatedAt();
                $message->updated_at = $note->getUpdatedAt();
                $message->user()->associate(auth()->user());
                $message->save();
            }
        }
    }

    private function getEvents(Deal $deal): void
    {
        $events = null;
        // События
        $eventsFilter = new EventsFilter; // Создание фильтра для событий

        if ($deal->amo_sync !== null) {
            $eventsFilter->setCreatedAt($deal->amo_sync);
        }

        $eventsFilter
            ->setTypes($this->eventTypes)->setEntity([EntityTypesInterface::LEADS])->setEntityIds([$deal->amo_id],
            ); // Установка фильтра по типу сущности и ID сделки
        try {
            $events = $this->apiClient->events()->get($eventsFilter); // Получение событий по фильтру
            //$events = $this->apiClient->events()->nextPage($events); // Получение следующей страницы событий
        } catch (AmoCRMApiException $e) { // Обработка исключений API
            if ($e->getCode() !== 204) {
                $this->printError($e);
            }
        }
        //dd($events->toArray());
        if ($events !== null) {
            foreach ($events as $item) {
                $data = null;
                $before = $item->getValueBefore();
                $after = $item->getValueAfter();
                switch ($item->getType()) {
                    case 'name_field_changed':
                        $old = isset($before[0]) ? $before[0]['name_field_value']['name'] : null;
                        $new = isset($after[0]) ? $after[0]['name_field_value']['name'] : null;
                        $data = ['uid' => ['old' => $old, 'new' => $new]];
                        break;
                    case 'lead_status_changed':
                        $old = $this->stages->get($before[0]['lead_status']['id']);
                        $new = $this->stages->get($after[0]['lead_status']['id']);
                        $data = ['deal_stage_id' => ['old' => $old, 'new' => $new]];
                        break;
                    default:
                        $old = isset($before[0]) ? $before[0]['custom_field_value'] : null;
                        $new = isset($after[0]) ? $after[0]['custom_field_value'] : null;
                        if ($new !== null) {
                            $field_id = $new['field_id'];
                            if (isset($this->fieldsMap[$field_id])) { // Если поле есть в карте полей
                                $fieldName = $this->fieldsMap[$field_id]; // Получение имени поля
                                if ($this->fields[$fieldName]['type'] === 'index') { // Если тип поля - индекс
                                    if ($this->fields[$fieldName]['source'] === 'config') { // Если источник поля - конфигурация
                                        $list = collect(
                                            $this->fields[$fieldName]['list'],
                                        ); // Создание коллекции из списка полей
                                        if ($list->firstWhere('amo') !== null) { // Если поле найдено в списке
                                            $list = $list->pluck('amo')->flip(
                                            ); // Перестановка ключей и значений в списке
                                            if ($old !== null) {
                                                $old = $list->get($old['enum_id']);
                                            }
                                            $new = $list->get($new['enum_id']);
                                        }
                                    }
                                } else {
                                    $old = $old !== null ? $old['text'] : null;
                                    $new = $new['text'];
                                }
                                $data = [$fieldName => ['old' => $old, 'new' => $new]];
                            }
                        }
                        break;
                }
                if (! is_null($data)) {
                    $event = new ModelEvent;
                    $event->eventable_id = $deal->id;
                    $event->eventable_type = get_class($deal);
                    $event->type = 'updated';
                    $event->user_id = 760;
                    $event->data = $data;
                    $event->created_at = $item->getCreatedAt();
                    $event->updated_at = $item->getCreatedAt();
                    try {
                        $event->save();
                    } catch (QueryException $exception) {
                    }
                }
            }
        }
    }

    public function getPipelines(): void
    {
        try {
            $pipelinesCollection = $this->apiClient->pipelines()->get();
            foreach ($pipelinesCollection as $pipeline) {
                $data = [
                    'name' => $pipeline->name,
                    'amo_id' => $pipeline->id,
                    'archive' => $pipeline->is_archive,
                ];
                $dealPipeline = Pipeline::firstOrCreate($data);

                foreach ($pipeline->getStatuses() as $status) {
                    $data = [
                        'title' => $status->name,
                        'color' => $status->color,
                        'pipeline_id' => $dealPipeline->id,
                        'amo_id' => $status->id,
                    ];
                    Stage::firstOrCreate($data);
                }
            }
        } catch (AmoCRMApiException $e) {
            $this->printError($e);
        }
    }
}
