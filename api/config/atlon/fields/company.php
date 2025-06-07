<?php

return [
    'id' => [
        'name' => 'primary key',
        'type' => 'number',
    ],
    'type' => [
        'name' => 'Тип компании',
        'type' => 'index',
        'source' => 'values',
        'values' => [
            0 => 'Холдинг',
            1 => 'Главная'
        ]
    ],
    'name' => [
        'name' => 'Наименование организации внутреннее',
        'type' => 'string',
    ],
    'full_name' => [
        'name' => 'Наименование организации для документов',
        'type' => 'string',
    ],
    'short_name' => [
        'name' => 'Краткое наименование организации для документов',
        'type' => 'string',
    ],
    'phone' => [
        'name' => 'Телефон',
        'type' => 'string',
    ],
    'email' => [
        'name' => 'Эл. почта',
        'type' => 'string',
    ],
    'website' => [
        'name' => 'Сайт',
        'type' => 'string',
    ],
    'town' => [
        'name' => 'Город',
        'type' => 'string',
    ],
    'legal_address' => [
        'name' => 'Юр. адрес',
        'type' => 'string',
    ],
    'general_director' => [
        'name' => 'ФИО генерального директора',
        'type' => 'string',
    ],
    'head_accountant' => [
        'name' => 'ФИО главного бухгалтера',
        'type' => 'string',
    ],
    'inn' => [
        'name' => 'ИНН',
        'type' => 'string',
    ],
    'kpp' => [
        'name' => 'КПП',
        'type' => 'string',
    ],
    'ogrn' => [
        'name' => 'ОГРН',
        'type' => 'string',
    ],
    'oktmo' => [
        'name' => 'ОКТМО',
        'type' => 'string',
    ],
    'registration_date' => [
        'name' => 'Дата гос. регистрации',
        'type' => 'date',
    ],
    'facsimile' => [
        'name' => 'Факсимиле',
        'type' => 'file',
    ],
    'stamp' => [
        'name' => 'Печать',
        'type' => 'file',
    ],
    'logo' => [
        'name' => 'Логотип',
        'type' => 'file',
    ],
    'sort' => [
        'name' => 'Порядок сортировки',
        'type' => 'number',
    ],
];
