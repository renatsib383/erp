<?php

return [
    'id' => [
        'name' => 'primary key',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
    'uid' => [
        'name' => 'ИД',
        'type' => 'string',
        'search' => true,
        'filter' => true,
    ],
    'address' => [
        'name' => 'Адрес',
        'type' => 'string',
        'search' => true,
        'filter' => false,
    ],
    'budget_sum' => [
        'name' => 'Бюджет заказчика',
        'type' => 'money',
        'step' => 10000,
        'search' => false,
        'filter' => true,
    ],
    'confirmed_smet_sum' => [
        'name' => 'Сумма по смете',
        'type' => 'money',
        'step' => 10000,
        'search' => false,
        'filter' => true,
    ],
    'additional_works_sum' => [
        'name' => 'Сумма доп работ',
        'type' => 'money',
        'step' => 10000,
        'search' => false,
        'filter' => true,
    ],
    'facility_type' => [
        'name' => 'Тип недвижимости',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.facility.type',
        'search' => false,
        'filter' => true,
    ],
    'facility_condition' => [
        'name' => 'Состояние недвижимости',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.facility.condition',
        'search' => false,
        'filter' => true,
    ],
    'renovation_type' => [
        'name' => 'Тип ремонта',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.renovation.type',
        'search' => false,
        'filter' => true,
    ],
    'partner' => [
        'name' => 'Партнерка',
        'type' => 'string',
        'search' => false,
        'filter' => true,
    ],
    'agent' => [
        'name' => 'Агентский договор',
        'type' => 'boolean',
        'search' => false,
        'filter' => true,
    ],
    'created_at' => [
        'name' => 'Добавлено',
        'type' => 'datetime',
        'search' => false,
        'filter' => true,
    ],
    'updated_at' => [
        'name' => 'Обновлено',
        'type' => 'datetime',
        'search' => false,
        'filter' => true,
    ],
    'deleted_at' => [
        'name' => 'Удалено',
        'type' => 'datetime',
        'search' => false,
        'filter' => false,
    ],
    'region' => [
        'name' => 'Регион',
        'type' => 'string',
        'search' => false,
        'filter' => true,
    ],
    'temperature' => [
        'name' => 'Лояльность клиента',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.client.temperature',
        'search' => false,
        'filter' => true,
    ],
    'lead_source' => [
        'name' => 'Откуда узнали о нас',
        'type' => 'string',
        'search' => false,
        'filter' => true,
    ],
    'skidka' => [
        'name' => 'Скидка',
        'type' => 'number',
        'search' => false,
        'filter' => true,
    ],
    'coef' => [
        'name' => 'Коэффициент',
        'type' => 'number',
        'search' => false,
        'filter' => true,
    ],
    'responsible' => [
        'name' => 'Ответственный',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
        'search' => false,
        'filter' => true,
    ],
    'designer' => [
        'name' => 'Дизайнер',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
        'search' => false,
        'filter' => true,
    ],
    'operator' => [
        'name' => 'КЦ1 ответственный за сделку',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
        'search' => false,
        'filter' => true,
    ],
    'zamerman' => [
        'name' => 'Замерщик',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
        'search' => false,
        'filter' => true,
    ],
    'prorab' => [
        'name' => 'Прораб',
        'type' => 'index',
        'source' => 'model',
        'target' => 'User',
        'search' => false,
        'filter' => true,
    ],
    'date_start' => [
        'name' => 'Дата начала работ',
        'type' => 'date',
        'search' => false,
        'filter' => false,
    ],
    'date_end' => [
        'name' => 'Дата окончания работ',
        'type' => 'date',
        'search' => false,
        'filter' => false,
    ],
    'amo_id' => [
        'name' => 'Идентификатор AmoCRM',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
    'amo_sync' => [
        'name' => 'Время синхронизации с AmoCRM',
        'type' => 'datetime',
        'search' => false,
        'filter' => false,
    ],
    'price' => [
        'name' => 'Прайс лист',
        'type' => 'array',
        'search' => false,
        'filter' => false,
    ],
    'company_id' => [
        'name' => 'Компания',
        'type' => 'index',
        'source' => 'config',
        'target' => 'atlon.list.company',
        'pluck' => 'id|name',
        'search' => false,
        'filter' => false,
    ],
    'deferred_discount' => [
        'name' => 'Отложенная скидка',
        'type' => 'boolean',
        'search' => false,
        'filter' => true,
    ],
    'confirm_act' => [
        'name' => 'Подтверждения акта сдачи-приемки',
        'type' => 'boolean',
        'search' => false,
        'filter' => true,
    ],
    'coef_price_master' => [
        'name' => 'Коэффициент для прайса мастера',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
    'hold_master' => [
        'name' => 'Удержка мастера',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
    'forced_percent_master' => [
        'name' => 'Принудительный процент мастера',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
    'increase_master' => [
        'name' => 'Увеличения для мастера (%)',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
    'forced_percent_prorab' => [
        'name' => 'Принудительный процент прораба',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
    'coef_additional_partner' => [
        'name' => 'Добавочный коэффициент партнёра',
        'type' => 'number',
        'search' => false,
        'filter' => false,
    ],
];
