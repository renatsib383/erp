<?php

return [
    'id' => [
        'name' => 'primary key',
        'type' => 'number',
    ],
    'uid' => [
        'name' => 'ИД',
        'type' => 'string',
    ],
    'address' => [
        'name' => 'Адрес',
        'type' => 'string',
    ],
    'budget_sum' => [
        'name' => 'Бюджет заказчика',
        'type' => 'money',
    ],
    'confirmed_smet_sum' => [
        'name' => 'Сумма по смете',
        'type' => 'money',
    ],
    'additional_works_sum' => [
        'name' => 'Сумма доп работ',
        'type' => 'money',
    ],
    'facility_type' => [
        'name' => 'Тип недвижимости',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.facility.type',
    ],
    'facility_condition' => [
        'name' => 'Состояние недвижимости',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.facility.condition',
    ],
    'renovation_type' => [
        'name' => 'Тип ремонта',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.renovation.type',
    ],
    'partner' => [
        'name' => 'Партнерка',
        'type' => 'string',
    ],
    'agent' => [
        'name' => 'Агентский договор',
        'type' => 'boolean',
    ],
    'created_at' => [
        'name' => 'Добавлено',
        'type' => 'datetime',
    ],
    'updated_at' => [
        'name' => 'Обновлено',
        'type' => 'datetime',
    ],
    'deleted_at' => [
        'name' => 'Удалено',
        'type' => 'datetime',
    ],
    'region' => [
        'name' => 'Регион',
        'type' => 'string',
    ],
    'temperature' => [
        'name' => 'Лояльность клиента',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.client.temperature',
    ],
    'lead_source' => [
        'name' => 'Откуда узнали о нас',
        'type' => 'string',
    ],
    'skidka' => [
        'name' => 'Скидка',
        'type' => 'number',
    ],
    'coef' => [
        'name' => 'Коэффициент',
        'type' => 'number',
    ],
    'responsible' => [
        'name' => 'Ответственный',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
    ],
    'designer' => [
        'name' => 'Дизайнер',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
    ],
    'operator' => [
        'name' => 'КЦ1 ответственный за сделку',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
    ],
    'zamerman' => [
        'name' => 'Замерщик',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
    ],
    'prorab' => [
        'name' => 'Прораб',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
    ],
    'date_start' => [
        'name' => 'Дата начала работ',
        'type' => 'date',
    ],
    'date_end' => [
        'name' => 'Дата окончания работ',
        'type' => 'date',
    ],
    'amo_id' => [
        'name' => 'Идентификатор AmoCRM',
        'type' => 'number',
    ],
    'amo_sync' => [
        'name' => 'Время синхронизации с AmoCRM',
        'type' => 'datetime',
    ],
    'price' => [
        'name' => 'Прайс лист',
        'type' => 'array',
    ],
    'company_id' => [
        'name' => 'Компания',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.company',
        'pluck' => 'id|name',
    ],
    'deferred_discount' => [
        'name' => 'Отложенная скидка',
        'type' => 'boolean',
    ],
    'confirm_act' => [
        'name' => 'Подтверждения акта сдачи-приемки',
        'type' => 'boolean',
    ],
    'coef_price_master' => [
        'name' => 'Коэффициент для прайса мастера',
        'type' => 'number',
    ],
    'hold_master' => [
        'name' => 'Удержка мастера',
        'type' => 'number',
    ],
    'forced_percent_master' => [
        'name' => 'Принудительный процент мастера',
        'type' => 'number',
    ],
    'increase_master' => [
        'name' => 'Увеличения для мастера (%)',
        'type' => 'number',
    ],
    'forced_percent_prorab' => [
        'name' => 'Принудительный процент прораба',
        'type' => 'number',
    ],
    'coef_additional_partner' => [
        'name' => 'Добавочный коэффициент партнёра',
        'type' => 'number',
    ],
    'stages' => [
        'name' => 'Этапы',
        'type' => 'index',
        'source' => 'model',
        'target' => 'Deals\Stage',
    ],
];
