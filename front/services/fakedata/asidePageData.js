export const page = {
    "errors": {},
    "auth": {
      "user": {
        "id": 33,
        "name": "FRONTEND",
        "email": "frontend@atlonfm.com",
        "fio": "Майя",
        "phone": "79999999999",
        "role_id": 22,
        "chief": 2,
        "status": 1,
        "available_stages": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          46,
          47,
          48,
          49,
          50,
          51,
          52,
          53,
          54,
          55,
          56,
          57,
          58,
          59,
          60,
          61,
          62,
          63,
          64,
          65,
          66,
          67,
          68,
          69,
          70,
          71,
          72,
          73,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          82,
          83,
          84,
          85,
          86,
          87,
          88,
          89,
          90,
          91,
          92,
          93,
          94,
          95,
          96,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          123,
          124,
          125,
          126,
          127,
          128,
          129,
          130,
          131,
          132,
          133,
          134,
          135,
          136,
          137,
          138,
          139,
          140,
          141,
          142,
          143,
          144,
          145,
          146,
          147,
          148,
          149,
          150,
          151,
          152,
          153,
          154,
          155,
          156,
          157,
          158,
          159,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          174,
          175,
          176,
          177,
          178,
          179,
          180,
          181,
          182,
          183,
          184,
          185,
          186,
          187,
          188,
          189,
          190,
          191,
          192,
          193,
          194,
          195,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          210,
          211,
          212,
          213,
          214,
          215,
          216,
          217,
          218,
          219,
          220,
          221,
          222,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          255,
          256,
          257,
          258,
          259,
          260,
          261,
          262,
          263,
          264,
          265,
          266,
          267,
          268,
          269,
          270,
          271,
          272,
          273,
          274,
          275,
          276,
          277,
          278,
          279,
          280
        ],
        "deleted_at": null
      }
    },
    "datatable": {
        "id": "dealsIndex",
        "uri": "/deals/data",
        "columns": {
          "deal_id": {
            "label": "Id",
            "sortable": true,
            "searchable": false,
            "style": "width:10%"
          },
          "telephone": {
            "label": "Phone",
            "sortable": true,
            "searchable": false,
            "style": "width:20%"
          },
          "address": {
            "label": "Address",
            "sortable": true,
            "searchable": true
          },
          "stage": {
            "label": "Stage",
            "sortable": true,
            "searchable": true,
            "style": "width:10%"
          },
          "fio": {
            "label": "Full name",
            "sortable": true,
            "searchable": true,
            "style": "width:20%"
          }
        },
        "pagination": {
          "options": [
            25,
            50,
            100
          ],
          "page": 1,
          "rows": 25
        },
        "state": true
      },
      "fields": {
        "id": {
          "name": "primary key",
          "type": "number",
          "search": false,
          "filter": false
        },
        "uid": {
          "name": "ИД",
          "type": "string",
          "search": true,
          "filter": true
        },
        "address": {
          "name": "Адрес",
          "type": "string",
          "search": true,
          "filter": false
        },
        "budget_sum": {
          "name": "Бюджет заказчика",
          "type": "money",
          "step": 10000,
          "search": false,
          "filter": true
        },
        "confirmed_smet_sum": {
          "name": "Сумма по смете",
          "type": "money",
          "step": 10000,
          "search": false,
          "filter": true
        },
        "additional_works_sum": {
          "name": "Сумма доп работ",
          "type": "money",
          "step": 10000,
          "search": false,
          "filter": true
        },
        "facility_type": {
          "name": "Тип недвижимости",
          "type": "index",
          "source": "config",
          "target": "atlon.list.facility.type",
          "search": false,
          "filter": true,
          "list": [
            "Не указано",
            "Новостройка",
            "Вторичка",
            "Частный дом/коттедж",
            "Офис",
            "Магазин",
            "Коммерческое помещение",
            "Доделка",
            "Другое"
          ]
        },
        "facility_condition": {
          "name": "Состояние недвижимости",
          "type": "index",
          "source": "config",
          "target": "atlon.list.facility.condition",
          "search": false,
          "filter": true,
          "list": [
            "Без отделки",
            "Отделка от застройщика",
            "Черновая отделка",
            "Старый ремонт",
            "Бетон",
            "Вайт бокс",
            "Отделка полная",
            "Отделка частичная (только черновые)",
            "Только часть черновых"
          ]
        },
        "renovation_type": {
          "name": "Тип ремонта",
          "type": "index",
          "source": "config",
          "target": "atlon.list.renovation.type",
          "search": false,
          "filter": true,
          "list": [
            "Капитальный",
            "Косметический",
            "Дизайнерский",
            "Евроремонт"
          ]
        },
        "partner": {
          "name": "Партнерка",
          "type": "string",
          "search": false,
          "filter": true
        },
        "agent": {
          "name": "Агентский договор",
          "type": "boolean",
          "search": false,
          "filter": true
        },
        "created_at": {
          "name": "Добавлено",
          "type": "datetime",
          "search": false,
          "filter": true
        },
        "updated_at": {
          "name": "Обновлено",
          "type": "datetime",
          "search": false,
          "filter": true
        },
        "deleted_at": {
          "name": "Удалено",
          "type": "datetime",
          "search": false,
          "filter": false
        },
        "region": {
          "name": "Регион",
          "type": "string",
          "search": false,
          "filter": true
        },
        "temperature": {
          "name": "Лояльность клиента",
          "type": "index",
          "source": "config",
          "target": "atlon.list.client.temperature",
          "search": false,
          "filter": true,
          "list": [
            "Не выбрано",
            "Горячий. Расположен",
            "Лоялен готов говорить",
            "На контакт идет. Малословен",
            "Актуально. Не шел на контакт визитку попросил",
            "Не актуально. Не нужен ремонт",
            "Нет минималки",
            "Продает",
            "Уже нашел",
            "Актуально. Ключей нет",
            "Актуально готовится ДП",
            "Никогда НДЗ",
            "Горячий. Нет ключей",
            "Ключей нет. Не самый контактный",
            "Думает НДЗ"
          ]
        },
        "lead_source": {
          "name": "Откуда узнали о нас",
          "type": "string",
          "search": false,
          "filter": true
        },
        "skidka": {
          "name": "Скидка",
          "type": "number",
          "search": false,
          "filter": true
        },
        "coef": {
          "name": "Коэффициент",
          "type": "number",
          "search": false,
          "filter": true
        },
        "responsible": {
          "name": "Ответственный",
          "type": "index",
          "source": "model",
          "target": "User",
          "search": false,
          "filter": true,
          "list": []
        },
        "designer": {
          "name": "Дизайнер",
          "type": "index",
          "source": "model",
          "target": "User",
          "search": false,
          "filter": true,
          "list": []
        },
        "operator": {
          "name": "КЦ1 ответственный за сделку",
          "type": "index",
          "source": "model",
          "target": "User",
          "search": false,
          "filter": true,
          "list": []
        },
        "zamerman": {
          "name": "Замерщик",
          "type": "index",
          "source": "model",
          "target": "User",
          "search": false,
          "filter": true,
          "list": []
        },
        "prorab": {
          "name": "Прораб",
          "type": "index",
          "source": "model",
          "target": "User",
          "search": false,
          "filter": true,
          "list": []
        },
        "date_start": {
          "name": "Дата начала работ",
          "type": "date",
          "search": false,
          "filter": false
        },
        "date_end": {
          "name": "Дата окончания работ",
          "type": "date",
          "search": false,
          "filter": false
        },
        "amo_id": {
          "name": "Идентификатор AmoCRM",
          "type": "number",
          "search": false,
          "filter": false
        },
        "amo_sync": {
          "name": "Время синхронизации с AmoCRM",
          "type": "datetime",
          "search": false,
          "filter": false
        },
        "price": {
          "name": "Прайс лист",
          "type": "array",
          "search": false,
          "filter": false
        },
        "company_id": {
          "name": "Компания",
          "type": "index",
          "source": "config",
          "target": "atlon.list.company",
          "pluck": "id|name",
          "search": false,
          "filter": false,
          "list": {
            "1": "Атлон ФМ",
            "2": "Атлон Маркет",
            "3": "Атлон Фасилити Менеджмент",
            "4": "Атлон ФМ Центр",
            "5": "Атлон ФМ Север"
          }
        },
        "deferred_discount": {
          "name": "Отложенная скидка",
          "type": "boolean",
          "search": false,
          "filter": true
        },
        "confirm_act": {
          "name": "Подтверждения акта сдачи-приемки",
          "type": "boolean",
          "search": false,
          "filter": true
        },
        "coef_price_master": {
          "name": "Коэффициент для прайса мастера",
          "type": "number",
          "search": false,
          "filter": false
        },
        "hold_master": {
          "name": "Удержка мастера",
          "type": "number",
          "search": false,
          "filter": false
        },
        "forced_percent_master": {
          "name": "Принудительный процент мастера",
          "type": "number",
          "search": false,
          "filter": false
        },
        "increase_master": {
          "name": "Увеличения для мастера (%)",
          "type": "number",
          "search": false,
          "filter": false
        },
        "forced_percent_prorab": {
          "name": "Принудительный процент прораба",
          "type": "number",
          "search": false,
          "filter": false
        },
        "coef_additional_partner": {
          "name": "Добавочный коэффициент партнёра",
          "type": "number",
          "search": false,
          "filter": false
        }
      },
      "act_statuses": [
        "В разработке",
        "Согласование с заказчиком",
        "Оплачен",
        "Подписан и сдан"
      ],
      "partners": [],
      "tags": [],
      "users": [
        {
          "id": 1,
          "name": "НРР",
          "role_id": 22
        },
        {
          "id": 2,
          "name": "ААЮ",
          "role_id": 21
        },
        {
          "id": 3,
          "name": "КАС",
          "role_id": 22
        },
        {
          "id": 4,
          "name": "СВА",
          "role_id": 28
        },
        {
          "id": 14,
          "name": "Оператор 1",
          "role_id": 2
        },
        {
          "id": 15,
          "name": "Оператор 2",
          "role_id": 2
        },
        {
          "id": 17,
          "name": "ФАО",
          "role_id": 3
        },
        {
          "id": 18,
          "name": "ИВА",
          "role_id": 24
        },
        {
          "id": 19,
          "name": "ПАБ",
          "role_id": 4
        },
        {
          "id": 21,
          "name": "ТВГ",
          "role_id": 4
        },
        {
          "id": 22,
          "name": "КМП",
          "role_id": 17
        },
        {
          "id": 23,
          "name": "ПСС",
          "role_id": 4
        },
        {
          "id": 24,
          "name": "КАА",
          "role_id": 4
        },
        {
          "id": 25,
          "name": "РАВ",
          "role_id": 4
        },
        {
          "id": 26,
          "name": "УВВ",
          "role_id": 16
        },
        {
          "id": 27,
          "name": "САД",
          "role_id": 19
        },
        {
          "id": 28,
          "name": "БАО",
          "role_id": 19
        },
        {
          "id": 29,
          "name": "АДН",
          "role_id": 14
        },
        {
          "id": 30,
          "name": "РЕД",
          "role_id": 7
        },
        {
          "id": 31,
          "name": "Партнёр 1",
          "role_id": 9
        },
        {
          "id": 32,
          "name": "Партнёр 2",
          "role_id": 9
        },
        {
          "id": 33,
          "name": "FRONTEND",
          "role_id": 22
        },
        {
          "id": 34,
          "name": "ШАА",
          "role_id": 5
        },
        {
          "id": 35,
          "name": "ЧЕВ",
          "role_id": 15
        },
        {
          "id": 36,
          "name": "РВЯ",
          "role_id": 6
        },
        {
          "id": 42,
          "name": "ЗАКАЗЧИК",
          "role_id": 22
        },
        {
          "id": 62,
          "name": "МВИ",
          "role_id": 2
        },
        {
          "id": 63,
          "name": "ЛТИ",
          "role_id": 2
        },
        {
          "id": 64,
          "name": "НПЕ",
          "role_id": 2
        },
        {
          "id": 65,
          "name": "КСА",
          "role_id": 2
        },
        {
          "id": 66,
          "name": "КЕЮ",
          "role_id": 2
        },
        {
          "id": 67,
          "name": "ФАА",
          "role_id": 2
        },
        {
          "id": 68,
          "name": "ТБИ",
          "role_id": 2
        },
        {
          "id": 69,
          "name": "АРМ",
          "role_id": 2
        },
        {
          "id": 70,
          "name": "ВДВ",
          "role_id": 2
        },
        {
          "id": 71,
          "name": "СНВ",
          "role_id": 2
        },
        {
          "id": 72,
          "name": "КМВ",
          "role_id": 2
        },
        {
          "id": 73,
          "name": "ЧАН",
          "role_id": 2
        },
        {
          "id": 74,
          "name": "ГМС",
          "role_id": 2
        },
        {
          "id": 75,
          "name": "ГИН",
          "role_id": 2
        },
        {
          "id": 76,
          "name": "НАЮ",
          "role_id": 2
        },
        {
          "id": 77,
          "name": "ДРИ",
          "role_id": 2
        },
        {
          "id": 78,
          "name": "БАВ",
          "role_id": 2
        },
        {
          "id": 79,
          "name": "ИММ",
          "role_id": 2
        },
        {
          "id": 80,
          "name": "ЛЮА",
          "role_id": 2
        },
        {
          "id": 81,
          "name": "ХАО",
          "role_id": 2
        },
        {
          "id": 82,
          "name": "ПАГ",
          "role_id": 2
        },
        {
          "id": 83,
          "name": "БВВ",
          "role_id": 2
        },
        {
          "id": 84,
          "name": "БАС",
          "role_id": 2
        },
        {
          "id": 85,
          "name": "МДС",
          "role_id": 2
        },
        {
          "id": 86,
          "name": "ЗПС",
          "role_id": 2
        },
        {
          "id": 87,
          "name": "БАВ2",
          "role_id": 2
        },
        {
          "id": 88,
          "name": "БСА",
          "role_id": 4
        },
        {
          "id": 89,
          "name": "ММН",
          "role_id": 2
        },
        {
          "id": 90,
          "name": "БДМ",
          "role_id": 2
        },
        {
          "id": 91,
          "name": "ТМА",
          "role_id": 2
        },
        {
          "id": 92,
          "name": "КЮА",
          "role_id": 4
        },
        {
          "id": 93,
          "name": "ЧОД",
          "role_id": 2
        },
        {
          "id": 94,
          "name": "АММ",
          "role_id": 7
        },
        {
          "id": 95,
          "name": "ШМА",
          "role_id": 7
        },
        {
          "id": 96,
          "name": "МНА",
          "role_id": 7
        },
        {
          "id": 97,
          "name": "СМГ",
          "role_id": 22
        },
        {
          "id": 99,
          "name": "МНВ",
          "role_id": 11
        },
        {
          "id": 100,
          "name": "ЛТА",
          "role_id": 10
        },
        {
          "id": 101,
          "name": "ССП",
          "role_id": 10
        },
        {
          "id": 102,
          "name": "ПМС",
          "role_id": 17
        },
        {
          "id": 103,
          "name": "БСА2",
          "role_id": 17
        },
        {
          "id": 104,
          "name": "ШЕГ",
          "role_id": 4
        },
        {
          "id": 105,
          "name": "ЯМС",
          "role_id": 4
        },
        {
          "id": 106,
          "name": "ШПС",
          "role_id": 4
        },
        {
          "id": 107,
          "name": "АВВ",
          "role_id": 4
        },
        {
          "id": 108,
          "name": "АИВ",
          "role_id": 4
        },
        {
          "id": 109,
          "name": "ААИ",
          "role_id": 4
        },
        {
          "id": 110,
          "name": "БАВ3",
          "role_id": 4
        },
        {
          "id": 111,
          "name": "БПА",
          "role_id": 4
        },
        {
          "id": 112,
          "name": "БРС",
          "role_id": 4
        },
        {
          "id": 113,
          "name": "БММ",
          "role_id": 4
        },
        {
          "id": 114,
          "name": "БНВ",
          "role_id": 4
        },
        {
          "id": 115,
          "name": "БЛГ",
          "role_id": 4
        },
        {
          "id": 116,
          "name": "ВПС",
          "role_id": 4
        },
        {
          "id": 117,
          "name": "ГНА",
          "role_id": 4
        },
        {
          "id": 118,
          "name": "ГАВ2",
          "role_id": 4
        },
        {
          "id": 119,
          "name": "ГМВ",
          "role_id": 4
        },
        {
          "id": 120,
          "name": "ЖРА",
          "role_id": 4
        },
        {
          "id": 121,
          "name": "ДВМ",
          "role_id": 4
        },
        {
          "id": 122,
          "name": "ЗМЮ",
          "role_id": 4
        },
        {
          "id": 123,
          "name": "КАО",
          "role_id": 4
        },
        {
          "id": 125,
          "name": "КМВ2",
          "role_id": 4
        },
        {
          "id": 126,
          "name": "ЛВС2",
          "role_id": 4
        },
        {
          "id": 127,
          "name": "ЛАА",
          "role_id": 4
        },
        {
          "id": 128,
          "name": "ММВ",
          "role_id": 4
        },
        {
          "id": 129,
          "name": "СЭР",
          "role_id": 4
        },
        {
          "id": 130,
          "name": "СЕВ",
          "role_id": 4
        },
        {
          "id": 131,
          "name": "САВ",
          "role_id": 4
        },
        {
          "id": 132,
          "name": "САП",
          "role_id": 4
        },
        {
          "id": 133,
          "name": "САС",
          "role_id": 4
        },
        {
          "id": 134,
          "name": "ТТО",
          "role_id": 4
        },
        {
          "id": 135,
          "name": "ТЮИ",
          "role_id": 4
        },
        {
          "id": 136,
          "name": "ТЕВ",
          "role_id": 4
        },
        {
          "id": 137,
          "name": "УПА",
          "role_id": 4
        },
        {
          "id": 138,
          "name": "ФЕС",
          "role_id": 4
        },
        {
          "id": 139,
          "name": "ХСС",
          "role_id": 4
        },
        {
          "id": 140,
          "name": "КВН",
          "role_id": 4
        },
        {
          "id": 141,
          "name": "ГИЮ",
          "role_id": 4
        },
        {
          "id": 142,
          "name": "ГВФ",
          "role_id": 4
        },
        {
          "id": 143,
          "name": "ТАА",
          "role_id": 4
        },
        {
          "id": 144,
          "name": "ГАС",
          "role_id": 1
        },
        {
          "id": 145,
          "name": "ДДЕ",
          "role_id": 3
        },
        {
          "id": 146,
          "name": "КИВ",
          "role_id": 3
        },
        {
          "id": 147,
          "name": "ФЯВ",
          "role_id": 3
        },
        {
          "id": 148,
          "name": "ТЯС",
          "role_id": 3
        },
        {
          "id": 149,
          "name": "СЕГ",
          "role_id": 3
        },
        {
          "id": 150,
          "name": "СРИ",
          "role_id": 3
        },
        {
          "id": 151,
          "name": "СЕВ2",
          "role_id": 3
        },
        {
          "id": 152,
          "name": "ПЮА",
          "role_id": 3
        },
        {
          "id": 153,
          "name": "НМЮ",
          "role_id": 3
        },
        {
          "id": 154,
          "name": "ЗРЛ",
          "role_id": 3
        },
        {
          "id": 155,
          "name": "ВСН",
          "role_id": 3
        },
        {
          "id": 156,
          "name": "КМН",
          "role_id": 3
        },
        {
          "id": 157,
          "name": "ФВП",
          "role_id": 3
        },
        {
          "id": 158,
          "name": "КАМ",
          "role_id": 4
        },
        {
          "id": 159,
          "name": "ПСВ2",
          "role_id": 18
        },
        {
          "id": 160,
          "name": "ЦАС",
          "role_id": 27
        },
        {
          "id": 161,
          "name": "СИН",
          "role_id": 27
        },
        {
          "id": 162,
          "name": "ЧВФ",
          "role_id": 4
        },
        {
          "id": 163,
          "name": "ОАВ",
          "role_id": 27
        },
        {
          "id": 164,
          "name": "ФРО",
          "role_id": 27
        },
        {
          "id": 165,
          "name": "БАВ4",
          "role_id": 27
        },
        {
          "id": 166,
          "name": "ИВА2",
          "role_id": 17
        },
        {
          "id": 167,
          "name": "БЯВ",
          "role_id": 4
        },
        {
          "id": 168,
          "name": "КМН2",
          "role_id": 3
        },
        {
          "id": 169,
          "name": "МВА",
          "role_id": 27
        },
        {
          "id": 170,
          "name": "ААВ",
          "role_id": 12
        },
        {
          "id": 171,
          "name": "ХЕВ",
          "role_id": 8
        },
        {
          "id": 172,
          "name": "ЩСК",
          "role_id": 8
        },
        {
          "id": 173,
          "name": "ДВИ",
          "role_id": 4
        },
        {
          "id": 174,
          "name": "СДА",
          "role_id": 8
        },
        {
          "id": 175,
          "name": "ЗАА",
          "role_id": 6
        },
        {
          "id": 176,
          "name": "ДДВ",
          "role_id": 6
        },
        {
          "id": 177,
          "name": "КСА2",
          "role_id": 6
        },
        {
          "id": 178,
          "name": "СНН",
          "role_id": 6
        },
        {
          "id": 179,
          "name": "БОМ",
          "role_id": 6
        },
        {
          "id": 180,
          "name": "КНМ",
          "role_id": 6
        },
        {
          "id": 181,
          "name": "ППС",
          "role_id": 16
        },
        {
          "id": 182,
          "name": "РЕЭ",
          "role_id": 5
        },
        {
          "id": 183,
          "name": "КАС2",
          "role_id": 5
        },
        {
          "id": 184,
          "name": "КДЮ",
          "role_id": 5
        },
        {
          "id": 185,
          "name": "ААА",
          "role_id": 5
        },
        {
          "id": 186,
          "name": "УАП",
          "role_id": 5
        },
        {
          "id": 187,
          "name": "ДПА",
          "role_id": 5
        },
        {
          "id": 188,
          "name": "БАЕ",
          "role_id": 5
        },
        {
          "id": 189,
          "name": "БВ1",
          "role_id": 5
        },
        {
          "id": 190,
          "name": "БОГ",
          "role_id": 5
        },
        {
          "id": 191,
          "name": "ФДД",
          "role_id": 5
        },
        {
          "id": 192,
          "name": "АСИ",
          "role_id": 5
        },
        {
          "id": 193,
          "name": "ГЮМ",
          "role_id": 5
        },
        {
          "id": 194,
          "name": "ПЕВ",
          "role_id": 5
        },
        {
          "id": 195,
          "name": "БМА",
          "role_id": 5
        },
        {
          "id": 196,
          "name": "ГИН2",
          "role_id": 5
        },
        {
          "id": 197,
          "name": "КВА",
          "role_id": 5
        },
        {
          "id": 502,
          "name": "ПАИ",
          "role_id": 4
        },
        {
          "id": 503,
          "name": "SIwL",
          "role_id": 4
        },
        {
          "id": 504,
          "name": "МАВ",
          "role_id": 4
        },
        {
          "id": 505,
          "name": "ВББ",
          "role_id": 22
        },
        {
          "id": 506,
          "name": "ОДС",
          "role_id": 4
        },
        {
          "id": 507,
          "name": "МВС",
          "role_id": 4
        },
        {
          "id": 508,
          "name": "ЛИН",
          "role_id": 4
        },
        {
          "id": 509,
          "name": "ДНВ",
          "role_id": 4
        },
        {
          "id": 510,
          "name": "КИА",
          "role_id": 4
        },
        {
          "id": 511,
          "name": "СР",
          "role_id": 4
        },
        {
          "id": 512,
          "name": "ДНН",
          "role_id": 4
        },
        {
          "id": 513,
          "name": "МКК",
          "role_id": 4
        },
        {
          "id": 514,
          "name": "КДА",
          "role_id": 4
        },
        {
          "id": 515,
          "name": "МПС",
          "role_id": 4
        },
        {
          "id": 516,
          "name": "РКР",
          "role_id": 28
        },
        {
          "id": 517,
          "name": "Наркулов",
          "role_id": 29
        },
        {
          "id": 518,
          "name": "ИВА3",
          "role_id": 4
        },
        {
          "id": 519,
          "name": "СГВ",
          "role_id": 4
        },
        {
          "id": 520,
          "name": "ГАВ2старый",
          "role_id": 4
        },
        {
          "id": 521,
          "name": "Дефолтный",
          "role_id": 4
        },
        {
          "id": 522,
          "name": "Нурсулуу",
          "role_id": 4
        },
        {
          "id": 523,
          "name": "Вахренев",
          "role_id": 4
        },
        {
          "id": 524,
          "name": "Власов",
          "role_id": 4
        },
        {
          "id": 525,
          "name": "Каплинская",
          "role_id": 4
        },
        {
          "id": 526,
          "name": "КСЛ",
          "role_id": 4
        },
        {
          "id": 527,
          "name": "ЛСВ",
          "role_id": 4
        },
        {
          "id": 528,
          "name": "ШИВ",
          "role_id": 4
        },
        {
          "id": 529,
          "name": "АДВ",
          "role_id": 28
        },
        {
          "id": 530,
          "name": "Румянцев ",
          "role_id": 4
        },
        {
          "id": 531,
          "name": "Новохатская",
          "role_id": 4
        },
        {
          "id": 532,
          "name": "ЭЖ 1",
          "role_id": 28
        },
        {
          "id": 533,
          "name": "Велин",
          "role_id": 4
        },
        {
          "id": 534,
          "name": "Шапранова",
          "role_id": 4
        },
        {
          "id": 535,
          "name": "Кожин",
          "role_id": 4
        },
        {
          "id": 536,
          "name": "МЕС",
          "role_id": 4
        },
        {
          "id": 537,
          "name": "ППК",
          "role_id": 4
        },
        {
          "id": 538,
          "name": "СИВ",
          "role_id": 4
        },
        {
          "id": 539,
          "name": "Дубровин",
          "role_id": 4
        },
        {
          "id": 540,
          "name": "АДА",
          "role_id": 4
        },
        {
          "id": 541,
          "name": "ТСВ",
          "role_id": 4
        },
        {
          "id": 542,
          "name": "БЕФ",
          "role_id": 4
        },
        {
          "id": 543,
          "name": "ГИВ",
          "role_id": 4
        },
        {
          "id": 544,
          "name": "НДН",
          "role_id": 4
        },
        {
          "id": 545,
          "name": "КАА2",
          "role_id": 4
        },
        {
          "id": 546,
          "name": "ККК",
          "role_id": 4
        },
        {
          "id": 547,
          "name": "1111",
          "role_id": 4
        },
        {
          "id": 548,
          "name": "Семикоп",
          "role_id": 4
        },
        {
          "id": 549,
          "name": "Мисько",
          "role_id": 4
        },
        {
          "id": 550,
          "name": "ВИВ",
          "role_id": 4
        },
        {
          "id": 551,
          "name": "СРАО",
          "role_id": 4
        },
        {
          "id": 552,
          "name": "РВН",
          "role_id": 4
        },
        {
          "id": 553,
          "name": "СТД",
          "role_id": 4
        },
        {
          "id": 554,
          "name": "ШНИ",
          "role_id": 4
        },
        {
          "id": 555,
          "name": "КВИ",
          "role_id": 4
        },
        {
          "id": 556,
          "name": "ЧЮД",
          "role_id": 17
        },
        {
          "id": 557,
          "name": "ССИ",
          "role_id": 4
        },
        {
          "id": 558,
          "name": "КВС",
          "role_id": 4
        },
        {
          "id": 559,
          "name": "ХВА",
          "role_id": 4
        },
        {
          "id": 560,
          "name": "ПВА",
          "role_id": 4
        },
        {
          "id": 561,
          "name": "НАФ",
          "role_id": 4
        },
        {
          "id": 562,
          "name": "КИВ2",
          "role_id": 4
        },
        {
          "id": 563,
          "name": "ОАА",
          "role_id": 4
        },
        {
          "id": 564,
          "name": "СДВ",
          "role_id": 4
        },
        {
          "id": 565,
          "name": "ЯДС",
          "role_id": 4
        },
        {
          "id": 566,
          "name": "ШСА2",
          "role_id": 4
        },
        {
          "id": 567,
          "name": "ШАС",
          "role_id": 4
        },
        {
          "id": 568,
          "name": "СВА2",
          "role_id": 4
        },
        {
          "id": 630,
          "name": "ПВН",
          "role_id": 4
        },
        {
          "id": 631,
          "name": "МЕС2",
          "role_id": 4
        },
        {
          "id": 632,
          "name": "ФАВ",
          "role_id": 4
        },
        {
          "id": 633,
          "name": "ММИ",
          "role_id": 4
        },
        {
          "id": 634,
          "name": "БДВ",
          "role_id": 4
        },
        {
          "id": 635,
          "name": "КАС3",
          "role_id": 4
        },
        {
          "id": 636,
          "name": "ШАП2",
          "role_id": 4
        },
        {
          "id": 637,
          "name": "ШАП",
          "role_id": 4
        },
        {
          "id": 638,
          "name": "КСЕ",
          "role_id": 4
        },
        {
          "id": 639,
          "name": "СКА",
          "role_id": 4
        },
        {
          "id": 640,
          "name": "ПРГ",
          "role_id": 4
        },
        {
          "id": 646,
          "name": "11111111",
          "role_id": 5
        },
        {
          "id": 649,
          "name": "БДА",
          "role_id": 4
        },
        {
          "id": 650,
          "name": "ВЕА",
          "role_id": 4
        },
        {
          "id": 651,
          "name": "ТВП",
          "role_id": 22
        },
        {
          "id": 652,
          "name": "ССА",
          "role_id": 4
        },
        {
          "id": 653,
          "name": "ПМС2",
          "role_id": 4
        },
        {
          "id": 654,
          "name": "АКА",
          "role_id": 22
        },
        {
          "id": 655,
          "name": "КДП",
          "role_id": 4
        },
        {
          "id": 656,
          "name": "БТР",
          "role_id": 4
        },
        {
          "id": 657,
          "name": "КДВ",
          "role_id": 4
        },
        {
          "id": 658,
          "name": "ТуБ",
          "role_id": 28
        },
        {
          "id": 659,
          "name": "МВЮ",
          "role_id": 28
        },
        {
          "id": 660,
          "name": "ЗАР",
          "role_id": 4
        },
        {
          "id": 661,
          "name": "ХАА",
          "role_id": 4
        },
        {
          "id": 662,
          "name": "МЮВ",
          "role_id": 4
        },
        {
          "id": 663,
          "name": "СЭЕ",
          "role_id": 4
        },
        {
          "id": 664,
          "name": "ТЕСТ",
          "role_id": 4
        },
        {
          "id": 665,
          "name": "ЧАН2",
          "role_id": 4
        },
        {
          "id": 666,
          "name": "ТМА2",
          "role_id": 4
        },
        {
          "id": 668,
          "name": "ШСА",
          "role_id": 4
        },
        {
          "id": 669,
          "name": "ЧЕА",
          "role_id": 4
        },
        {
          "id": 670,
          "name": "ДЭВ",
          "role_id": 4
        },
        {
          "id": 671,
          "name": "АКП",
          "role_id": 4
        },
        {
          "id": 672,
          "name": "ЗИА",
          "role_id": 17
        },
        {
          "id": 673,
          "name": "КНС",
          "role_id": 17
        },
        {
          "id": 674,
          "name": "ШАБ",
          "role_id": 4
        },
        {
          "id": 675,
          "name": "ОВВ",
          "role_id": 4
        },
        {
          "id": 676,
          "name": "ЮИА",
          "role_id": 4
        },
        {
          "id": 677,
          "name": "КИС",
          "role_id": 4
        },
        {
          "id": 678,
          "name": "МАТ",
          "role_id": 4
        },
        {
          "id": 679,
          "name": "admin",
          "role_id": 30
        },
        {
          "id": 680,
          "name": "ПЕН",
          "role_id": 4
        },
        {
          "id": 681,
          "name": "РАА ",
          "role_id": 4
        },
        {
          "id": 682,
          "name": "КВВ",
          "role_id": 4
        },
        {
          "id": 683,
          "name": "РАС",
          "role_id": 28
        },
        {
          "id": 684,
          "name": "СВВ1",
          "role_id": 22
        },
        {
          "id": 685,
          "name": "ЛАВ",
          "role_id": 4
        },
        {
          "id": 686,
          "name": "НМВ",
          "role_id": 4
        },
        {
          "id": 687,
          "name": "ЯДА",
          "role_id": 4
        },
        {
          "id": 688,
          "name": "ХГР",
          "role_id": 4
        },
        {
          "id": 689,
          "name": "НВВ",
          "role_id": 4
        },
        {
          "id": 690,
          "name": "БДВ2",
          "role_id": 4
        },
        {
          "id": 691,
          "name": "НСА",
          "role_id": 4
        },
        {
          "id": 692,
          "name": "КДВ2",
          "role_id": 4
        },
        {
          "id": 693,
          "name": "ЧСВ",
          "role_id": 4
        },
        {
          "id": 694,
          "name": "АДВ2",
          "role_id": 17
        },
        {
          "id": 695,
          "name": "ЛДН",
          "role_id": 4
        },
        {
          "id": 696,
          "name": "БДГ",
          "role_id": 4
        },
        {
          "id": 697,
          "name": "ИМЮ",
          "role_id": 4
        },
        {
          "id": 698,
          "name": "ЛРВ",
          "role_id": 4
        },
        {
          "id": 699,
          "name": "ШГБ",
          "role_id": 4
        },
        {
          "id": 703,
          "name": "ГМС2",
          "role_id": 4
        },
        {
          "id": 704,
          "name": "МЕЮ",
          "role_id": 4
        },
        {
          "id": 705,
          "name": "ШГИ",
          "role_id": 4
        },
        {
          "id": 706,
          "name": "ГАА",
          "role_id": 4
        },
        {
          "id": 707,
          "name": "ААГ",
          "role_id": 4
        },
        {
          "id": 708,
          "name": "ПМВ",
          "role_id": 4
        },
        {
          "id": 710,
          "name": "СИН2",
          "role_id": 4
        },
        {
          "id": 711,
          "name": "ССЭ",
          "role_id": 4
        },
        {
          "id": 712,
          "name": "ПАА",
          "role_id": 4
        },
        {
          "id": 713,
          "name": "ЕЕН",
          "role_id": 4
        },
        {
          "id": 714,
          "name": "КАВ",
          "role_id": 4
        },
        {
          "id": 715,
          "name": "ММС",
          "role_id": 4
        },
        {
          "id": 716,
          "name": "ШРШ",
          "role_id": 4
        },
        {
          "id": 717,
          "name": "КДВ3",
          "role_id": 4
        },
        {
          "id": 718,
          "name": "ТАЮ",
          "role_id": 4
        },
        {
          "id": 719,
          "name": "ФТР",
          "role_id": 4
        },
        {
          "id": 720,
          "name": "ТАВ",
          "role_id": 4
        },
        {
          "id": 721,
          "name": "МЛМ",
          "role_id": 4
        },
        {
          "id": 722,
          "name": "ГДМ",
          "role_id": 28
        },
        {
          "id": 723,
          "name": "ТМВ",
          "role_id": 4
        },
        {
          "id": 724,
          "name": "Мари",
          "role_id": 4
        },
        {
          "id": 725,
          "name": "КАН",
          "role_id": 4
        },
        {
          "id": 726,
          "name": "РДА",
          "role_id": 4
        },
        {
          "id": 727,
          "name": "ЗИА2",
          "role_id": 4
        },
        {
          "id": 728,
          "name": "ТИД",
          "role_id": 4
        },
        {
          "id": 729,
          "name": "БАВ5",
          "role_id": 28
        },
        {
          "id": 730,
          "name": "vbb.atlonfm@gmail.com",
          "role_id": 1
        },
        {
          "id": 731,
          "name": "САВ2",
          "role_id": 4
        },
        {
          "id": 732,
          "name": "ТАГ",
          "role_id": 4
        },
        {
          "id": 733,
          "name": "ЛАО",
          "role_id": 4
        },
        {
          "id": 734,
          "name": "БМБ",
          "role_id": 4
        },
        {
          "id": 735,
          "name": "Ринат 1с",
          "role_id": 22
        },
        {
          "id": 736,
          "name": "ЛСЛ",
          "role_id": 4
        },
        {
          "id": 737,
          "name": "КРА",
          "role_id": 4
        },
        {
          "id": 738,
          "name": "БАВ6",
          "role_id": 4
        },
        {
          "id": 739,
          "name": "KMM",
          "role_id": 4
        },
        {
          "id": 740,
          "name": "БИС",
          "role_id": 4
        },
        {
          "id": 741,
          "name": "КАА4",
          "role_id": 4
        },
        {
          "id": 742,
          "name": "БАВ7",
          "role_id": 4
        },
        {
          "id": 743,
          "name": "САН",
          "role_id": 4
        },
        {
          "id": 746,
          "name": "КВФ",
          "role_id": 4
        },
        {
          "id": 747,
          "name": "user1605@test.ru",
          "role_id": 4
        },
        {
          "id": 748,
          "name": "Dazzv",
          "role_id": 22
        },
        {
          "id": 749,
          "name": "МЕВ",
          "role_id": 4
        },
        {
          "id": 750,
          "name": "ДДЭ",
          "role_id": 4
        },
        {
          "id": 751,
          "name": "РЮВ",
          "role_id": 4
        },
        {
          "id": 752,
          "name": "АМА",
          "role_id": 4
        },
        {
          "id": 753,
          "name": "ЗВЕ",
          "role_id": 4
        },
        {
          "id": 754,
          "name": "НЭА",
          "role_id": 4
        },
        {
          "id": 755,
          "name": "АВА",
          "role_id": 28
        },
        {
          "id": 756,
          "name": "КПВ",
          "role_id": 4
        },
        {
          "id": 757,
          "name": "lesyabanks@gmail.com",
          "role_id": 22
        },
        {
          "id": 758,
          "name": "ШОК",
          "role_id": 4
        },
        {
          "id": 759,
          "name": "МИС",
          "role_id": 4
        },
        {
          "id": 760,
          "name": "АМО",
          "role_id": 2
        },
        {
          "id": 761,
          "name": "АНЮ",
          "role_id": 4
        },
        {
          "id": 764,
          "name": "ГДВ",
          "role_id": 4
        },
        {
          "id": 765,
          "name": "ЯАД",
          "role_id": 4
        },
        {
          "id": 766,
          "name": "БПК",
          "role_id": 4
        },
        {
          "id": 767,
          "name": "БАХ",
          "role_id": 4
        },
        {
          "id": 768,
          "name": "SAB",
          "role_id": 2
        },
        {
          "id": 769,
          "name": "ХРЛ",
          "role_id": 4
        },
        {
          "id": 770,
          "name": "ЕАН",
          "role_id": 4
        },
        {
          "id": 771,
          "name": "ЮЗР",
          "role_id": 17
        },
        {
          "id": 772,
          "name": "РАА2",
          "role_id": 6
        },
        {
          "id": 773,
          "name": "ЛДС",
          "role_id": 4
        },
        {
          "id": 774,
          "name": "TEST",
          "role_id": 1
        },
        {
          "id": 777,
          "name": "Мастер 1",
          "role_id": 1
        },
        {
          "id": 781,
          "name": "111111",
          "role_id": 1
        },
        {
          "id": 782,
          "name": "2222222",
          "role_id": 1
        },
        {
          "id": 783,
          "name": "Ребров Александр Алексеевич РА",
          "role_id": 1
        },
        {
          "id": 784,
          "name": "ФТА",
          "role_id": 22
        },
        {
          "id": 785,
          "name": "ТМН",
          "role_id": 4
        },
        {
          "id": 786,
          "name": "Умид",
          "role_id": 1
        },
        {
          "id": 787,
          "name": "ДВО",
          "role_id": 4
        },
        {
          "id": 788,
          "name": "ТАА2",
          "role_id": 4
        },
        {
          "id": 789,
          "name": "КСТ",
          "role_id": 4
        },
        {
          "id": 790,
          "name": "ВАА",
          "role_id": 4
        },
        {
          "id": 791,
          "name": "ТАЭ",
          "role_id": 2
        },
        {
          "id": 792,
          "name": "ЗИВ",
          "role_id": 22
        },
        {
          "id": 793,
          "name": "Артур",
          "role_id": 1
        },
        {
          "id": 794,
          "name": "ПРВ",
          "role_id": 4
        },
        {
          "id": 795,
          "name": "АРА",
          "role_id": 4
        }
      ],
      "tasks": {
        "statuses": [
          {
            "code": 1,
            "name": "Новая"
          },
          {
            "code": 2,
            "name": "В работе"
          },
          {
            "code": 3,
            "name": "Выполнена"
          },
          {
            "code": 4,
            "name": "Отменена"
          },
          {
            "code": 999,
            "name": "В архиве"
          }
        ],
        "types": [
          {
            "code": 1,
            "name": "Звонок"
          },
          {
            "code": 2,
            "name": "Замер"
          },
          {
            "code": 999,
            "name": "Прочее"
          }
        ]
      },
      "pipelines": {
        "1": {
          "id": 1,
          "name": "Отделка квартир",
          "archive": false,
          "stages": {
            "1": {
              "id": 1,
              "title": "Неразобранное",
              "color": "#e6e8ea"
            },
            "2": {
              "id": 2,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "3": {
              "id": 3,
              "title": "Квалификация (взят в работу)",
              "color": "#fffd7f"
            },
            "4": {
              "id": 4,
              "title": "Отказ от производства (Новый регламент)",
              "color": "#ffc8c8"
            },
            "5": {
              "id": 5,
              "title": "Спам",
              "color": "#99ccff"
            },
            "6": {
              "id": 6,
              "title": "Думают покупать жилье",
              "color": "#99ccff"
            },
            "7": {
              "id": 7,
              "title": "Недозвон",
              "color": "#99ccff"
            },
            "8": {
              "id": 8,
              "title": "отложенные ждут ключи",
              "color": "#c1e0ff"
            },
            "9": {
              "id": 9,
              "title": "Думают связь только Мессенджеры",
              "color": "#99ccff"
            },
            "10": {
              "id": 10,
              "title": "Думает/В работе у оператора",
              "color": "#ffeab2"
            },
            "11": {
              "id": 11,
              "title": "Перезвонить На замер (горячие)",
              "color": "#fffd7f"
            },
            "12": {
              "id": 12,
              "title": "выезд замерщика",
              "color": "#ffce5a"
            },
            "13": {
              "id": 13,
              "title": "Дизайн распределение",
              "color": "#ffc8c8"
            },
            "14": {
              "id": 14,
              "title": "Встреча Дизайн",
              "color": "#99ccff"
            },
            "15": {
              "id": 15,
              "title": "Договор Дизайн",
              "color": "#deff81"
            },
            "16": {
              "id": 16,
              "title": "Удаленный просчет",
              "color": "#99ccff"
            },
            "17": {
              "id": 17,
              "title": "ВЫЕЗД ЗАМЕРЩИКА РАСПРЕДЕЛЕНИЕ",
              "color": "#ffc8c8"
            },
            "18": {
              "id": 18,
              "title": "в новой срм",
              "color": "#ebffb1"
            },
            "19": {
              "id": 19,
              "title": "Распределен",
              "color": "#d6eaff"
            },
            "20": {
              "id": 20,
              "title": "Выезд не состоялся Оператор",
              "color": "#ffc8c8"
            },
            "21": {
              "id": 21,
              "title": "Выезд не состоялся замерщик",
              "color": "#ff8f92"
            },
            "22": {
              "id": 22,
              "title": "Холостой",
              "color": "#ffdc7f"
            },
            "23": {
              "id": 23,
              "title": "Выезд состоялся",
              "color": "#ccc8f9"
            },
            "24": {
              "id": 24,
              "title": "согласовать смету",
              "color": "#fff000"
            },
            "25": {
              "id": 25,
              "title": "Возврат на доработку РОПу",
              "color": "#99ccff"
            },
            "26": {
              "id": 26,
              "title": "Выдано в работу",
              "color": "#99ccff"
            },
            "27": {
              "id": 27,
              "title": "заморозка ОП",
              "color": "#99ccff"
            },
            "28": {
              "id": 28,
              "title": "Запуск Объекта ИВА",
              "color": "#fffd7f"
            },
            "29": {
              "id": 29,
              "title": "Производится ремонт ИВА",
              "color": "#87f2c0"
            },
            "30": {
              "id": 30,
              "title": "Запуск объекта МДА",
              "color": "#fffd7f"
            },
            "31": {
              "id": 31,
              "title": "производится ремонт МДА",
              "color": "#87f2c0"
            },
            "32": {
              "id": 32,
              "title": "Запуск объекта КМП",
              "color": "#fffeb2"
            },
            "33": {
              "id": 33,
              "title": "производится ремонт КМП",
              "color": "#87f2c0"
            },
            "34": {
              "id": 34,
              "title": "Запуск объекта МСП",
              "color": "#fffeb2"
            },
            "35": {
              "id": 35,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ МСП",
              "color": "#87f2c0"
            },
            "36": {
              "id": 36,
              "title": "ЗАПУСК ОБЪЕКТА БСА",
              "color": "#fffeb2"
            },
            "37": {
              "id": 37,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ БСА",
              "color": "#87f2c0"
            },
            "38": {
              "id": 38,
              "title": "ЗАМОРОЗКА",
              "color": "#99ccff"
            },
            "39": {
              "id": 39,
              "title": "закрыто нет документов",
              "color": "#99ccff"
            },
            "40": {
              "id": 40,
              "title": "ЮР. ОТДЕЛ",
              "color": "#99ccff"
            },
            "41": {
              "id": 41,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "42": {
              "id": 42,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "2": {
          "id": 2,
          "name": "Дизайн",
          "archive": false,
          "stages": {
            "43": {
              "id": 43,
              "title": "Неразобранное",
              "color": "#e6e8ea"
            },
            "44": {
              "id": 44,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "45": {
              "id": 45,
              "title": "Новая заявка дизайн",
              "color": "#fffd7f"
            },
            "46": {
              "id": 46,
              "title": "Заявка на дизайн",
              "color": "#eb93ff"
            },
            "47": {
              "id": 47,
              "title": "В работе",
              "color": "#99ccff"
            },
            "48": {
              "id": 48,
              "title": "Договор подписан",
              "color": "#fffeb2"
            },
            "49": {
              "id": 49,
              "title": "1 этап",
              "color": "#99ccff"
            },
            "50": {
              "id": 50,
              "title": "2 этап",
              "color": "#99ccff"
            },
            "51": {
              "id": 51,
              "title": "3 этап",
              "color": "#99ccff"
            },
            "52": {
              "id": 52,
              "title": "Реализовано",
              "color": "#99ccff"
            },
            "53": {
              "id": 53,
              "title": "Старые договора",
              "color": "#f9deff"
            },
            "54": {
              "id": 54,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "55": {
              "id": 55,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "3": {
          "id": 3,
          "name": "Нецелевые",
          "archive": false,
          "stages": {
            "56": {
              "id": 56,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "57": {
              "id": 57,
              "title": "Нецелевые другое",
              "color": "#99ccff"
            },
            "58": {
              "id": 58,
              "title": "Нецелевые по минималке",
              "color": "#99ccff"
            },
            "59": {
              "id": 59,
              "title": "Нецелевые продажа квартиры",
              "color": "#99ccff"
            },
            "60": {
              "id": 60,
              "title": "По работе",
              "color": "#ffff99"
            },
            "61": {
              "id": 61,
              "title": "По работе прозвонили",
              "color": "#ffc8c8"
            },
            "62": {
              "id": 62,
              "title": "Нецелевые недозвон",
              "color": "#c1e0ff"
            },
            "63": {
              "id": 63,
              "title": "Нецелевые по удаленности",
              "color": "#99ccff"
            },
            "64": {
              "id": 64,
              "title": "Холостой выезд замер",
              "color": "#ffce5a"
            },
            "65": {
              "id": 65,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "66": {
              "id": 66,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "4": {
          "id": 4,
          "name": "Холодные",
          "archive": false,
          "stages": {
            "67": {
              "id": 67,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "68": {
              "id": 68,
              "title": "Первичный контакт новое",
              "color": "#99ccff"
            },
            "69": {
              "id": 69,
              "title": "Офис вывести на контакт",
              "color": "#f9deff"
            },
            "70": {
              "id": 70,
              "title": "Недозвон",
              "color": "#d6eaff"
            },
            "71": {
              "id": 71,
              "title": "Не целевой",
              "color": "#99ccff"
            },
            "72": {
              "id": 72,
              "title": "Целевые от офиса!",
              "color": "#deff81"
            },
            "73": {
              "id": 73,
              "title": "НЦ уже делают ремонт",
              "color": "#99ccff"
            },
            "74": {
              "id": 74,
              "title": "Не Целевой по минималке",
              "color": "#99ccff"
            },
            "75": {
              "id": 75,
              "title": "Отказ от производства (Новый регламент)",
              "color": "#ffc8c8"
            },
            "76": {
              "id": 76,
              "title": "Не Целевой никогда НДЗ",
              "color": "#99ccff"
            },
            "77": {
              "id": 77,
              "title": "Не Целевой НДЗ( после думает)",
              "color": "#ccc8f9"
            },
            "78": {
              "id": 78,
              "title": "Думает НДЗ",
              "color": "#ffeab2"
            },
            "79": {
              "id": 79,
              "title": "Думает в рассылку смс",
              "color": "#fffeb2"
            },
            "80": {
              "id": 80,
              "title": "Нет ключей",
              "color": "#f3beff"
            },
            "81": {
              "id": 81,
              "title": "Думает срок не определен",
              "color": "#87f2c0"
            },
            "82": {
              "id": 82,
              "title": "Думает",
              "color": "#fffeb2"
            },
            "83": {
              "id": 83,
              "title": "Перезвонить на замер Горячие",
              "color": "#deff81"
            },
            "84": {
              "id": 84,
              "title": "выезд дизайн (перенести в отделку)",
              "color": "#99ccff"
            },
            "85": {
              "id": 85,
              "title": "Выезд Замерщика (перенести в отделку)",
              "color": "#ffce5a"
            },
            "86": {
              "id": 86,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "87": {
              "id": 87,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "5": {
          "id": 5,
          "name": "Недвижимость Вторичка",
          "archive": false,
          "stages": {
            "88": {
              "id": 88,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "89": {
              "id": 89,
              "title": "Неразобранное",
              "color": "#e6e8ea"
            },
            "90": {
              "id": 90,
              "title": "Взял в работу",
              "color": "#99ccff"
            },
            "91": {
              "id": 91,
              "title": "Недозвон",
              "color": "#d6eaff"
            },
            "92": {
              "id": 92,
              "title": "Переговоры",
              "color": "#ffff99"
            },
            "93": {
              "id": 93,
              "title": "Разместили объявление ( рекламу)",
              "color": "#87f2c0"
            },
            "94": {
              "id": 94,
              "title": "Отказ от сотрудничесва",
              "color": "#99ccff"
            },
            "95": {
              "id": 95,
              "title": "Отказ (Продали сами)",
              "color": "#ff8f92"
            },
            "96": {
              "id": 96,
              "title": "Успешная сделка",
              "color": "#deff81"
            },
            "97": {
              "id": 97,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "98": {
              "id": 98,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "6": {
          "id": 6,
          "name": "Воронка \"Спецновострой\"",
          "archive": false,
          "stages": {
            "99": {
              "id": 99,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "100": {
              "id": 100,
              "title": "КВАЛИФИКАЦИЯ (ВЗЯТ В РАБОТУ)",
              "color": "#fffd7f"
            },
            "101": {
              "id": 101,
              "title": "НЕДОЗВОН",
              "color": "#c1e0ff"
            },
            "102": {
              "id": 102,
              "title": "ОТЛОЖЕННЫЕ ЖДУТ КЛЮЧИ",
              "color": "#99ccff"
            },
            "103": {
              "id": 103,
              "title": "ДУМАЮТ не звонить",
              "color": "#ffdc7f"
            },
            "104": {
              "id": 104,
              "title": "Думают связь только мессенджеры",
              "color": "#fffeb2"
            },
            "105": {
              "id": 105,
              "title": "Рассылка в месенджере отправлена",
              "color": "#99ccff"
            },
            "106": {
              "id": 106,
              "title": "Думают в работе",
              "color": "#ffeab2"
            },
            "107": {
              "id": 107,
              "title": "ПЕРЕЗВОНИТЬ НА ЗАМЕР (ГОРЯЧИЕ)",
              "color": "#fffd7f"
            },
            "108": {
              "id": 108,
              "title": "ВЫЕЗД ЗАМЕРЩИКА",
              "color": "#ffcc66"
            },
            "109": {
              "id": 109,
              "title": "ВЫЕЗД ДИЗАЙН",
              "color": "#99ccff"
            },
            "110": {
              "id": 110,
              "title": "ВЫЕЗД ЗАМЕРЩИКА РАСПРЕДЕЛЕНИЕ",
              "color": "#ffc8c8"
            },
            "111": {
              "id": 111,
              "title": "В НОВОЙ СРМ",
              "color": "#deff81"
            },
            "112": {
              "id": 112,
              "title": "РАСПРЕДЕЛЕН",
              "color": "#99ccff"
            },
            "113": {
              "id": 113,
              "title": "УДАЛЕННЫЙ ПРОСЧЕТ",
              "color": "#99ccff"
            },
            "114": {
              "id": 114,
              "title": "ВЫЕЗД НЕ СОСТОЯЛСЯ ОПЕРАТОР",
              "color": "#ffc8c8"
            },
            "115": {
              "id": 115,
              "title": "ВЫЕЗД НЕ СОСТОЯЛСЯ ЗАМЕРЩИК",
              "color": "#ffc8c8"
            },
            "116": {
              "id": 116,
              "title": "ВЫЕЗД СОСТОЯЛСЯ",
              "color": "#ccc8f9"
            },
            "117": {
              "id": 117,
              "title": "ХОЛОСТОЙ",
              "color": "#ffdc7f"
            },
            "118": {
              "id": 118,
              "title": "СОГЛАСОВАТЬ СМЕТУ",
              "color": "#fffd7f"
            },
            "119": {
              "id": 119,
              "title": "ВОЗВРАТ НА ДОРАБОТКУ РОПУ",
              "color": "#99ccff"
            },
            "120": {
              "id": 120,
              "title": "ВЫДАНО В РАБОТУ",
              "color": "#99ccff"
            },
            "121": {
              "id": 121,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ МДА",
              "color": "#87f2c0"
            },
            "122": {
              "id": 122,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ ИВА",
              "color": "#87f2c0"
            },
            "123": {
              "id": 123,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ КМП",
              "color": "#deff81"
            },
            "124": {
              "id": 124,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ БСА",
              "color": "#87f2c0"
            },
            "125": {
              "id": 125,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ МПС",
              "color": "#deff81"
            },
            "126": {
              "id": 126,
              "title": "ЗАМОРОЗКА",
              "color": "#99ccff"
            },
            "127": {
              "id": 127,
              "title": "ЗАКРЫТО НЕТ ДОКУМЕНТОВ",
              "color": "#99ccff"
            },
            "128": {
              "id": 128,
              "title": "ЮР. ОТДЕЛ",
              "color": "#99ccff"
            },
            "129": {
              "id": 129,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "130": {
              "id": 130,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "7": {
          "id": 7,
          "name": "Комлектация",
          "archive": false,
          "stages": {
            "131": {
              "id": 131,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "132": {
              "id": 132,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "133": {
              "id": 133,
              "title": "Думают",
              "color": "#ffff99"
            },
            "134": {
              "id": 134,
              "title": "Согласование вариантов",
              "color": "#ffcc66"
            },
            "135": {
              "id": 135,
              "title": "В работе",
              "color": "#99ccff"
            },
            "136": {
              "id": 136,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "137": {
              "id": 137,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "8": {
          "id": 8,
          "name": "Холодные базы КЦ1",
          "archive": false,
          "stages": {
            "138": {
              "id": 138,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "139": {
              "id": 139,
              "title": "Новые Надежда",
              "color": "#99ccff"
            },
            "140": {
              "id": 140,
              "title": "Новые Дмитрий",
              "color": "#ffff99"
            },
            "141": {
              "id": 141,
              "title": "Не целевой Микаэль",
              "color": "#99ccff"
            },
            "142": {
              "id": 142,
              "title": "Не ЦЕЛЕВОЙ НАДЕЖДА",
              "color": "#99ccff"
            },
            "143": {
              "id": 143,
              "title": "Не Целевой Дмитрий",
              "color": "#99ccff"
            },
            "144": {
              "id": 144,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "145": {
              "id": 145,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "9": {
          "id": 9,
          "name": "Партнеры АТЛОН",
          "archive": false,
          "stages": {
            "146": {
              "id": 146,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "147": {
              "id": 147,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "148": {
              "id": 148,
              "title": "Переговоры",
              "color": "#ffff99"
            },
            "149": {
              "id": 149,
              "title": "Принимают решение",
              "color": "#ffcc66"
            },
            "150": {
              "id": 150,
              "title": "ева",
              "color": "#99ccff"
            },
            "151": {
              "id": 151,
              "title": "микаэль",
              "color": "#99ccff"
            },
            "152": {
              "id": 152,
              "title": "Дамир",
              "color": "#99ccff"
            },
            "153": {
              "id": 153,
              "title": "Влад",
              "color": "#99ccff"
            },
            "154": {
              "id": 154,
              "title": "мансур",
              "color": "#99ccff"
            },
            "155": {
              "id": 155,
              "title": "Артем",
              "color": "#99ccff"
            },
            "156": {
              "id": 156,
              "title": "Наргиза",
              "color": "#99ccff"
            },
            "157": {
              "id": 157,
              "title": "Рамз",
              "color": "#99ccff"
            },
            "158": {
              "id": 158,
              "title": "Влас",
              "color": "#99ccff"
            },
            "159": {
              "id": 159,
              "title": "Вардан",
              "color": "#99ccff"
            },
            "160": {
              "id": 160,
              "title": "Ростислав",
              "color": "#99ccff"
            },
            "161": {
              "id": 161,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "162": {
              "id": 162,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "10": {
          "id": 10,
          "name": "Судебки Приемки кв",
          "archive": false,
          "stages": {
            "163": {
              "id": 163,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "164": {
              "id": 164,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "165": {
              "id": 165,
              "title": "Переговоры",
              "color": "#ffff99"
            },
            "166": {
              "id": 166,
              "title": "Принимают решение",
              "color": "#deff81"
            },
            "167": {
              "id": 167,
              "title": "Выезд приемщика",
              "color": "#ffce5a"
            },
            "168": {
              "id": 168,
              "title": "Согласовать договор",
              "color": "#99ccff"
            },
            "169": {
              "id": 169,
              "title": "договор подписан",
              "color": "#99ccff"
            },
            "170": {
              "id": 170,
              "title": "ведется работа",
              "color": "#99ccff"
            },
            "171": {
              "id": 171,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "172": {
              "id": 172,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "11": {
          "id": 11,
          "name": "Холодные Санкт-Петербург",
          "archive": false,
          "stages": {
            "173": {
              "id": 173,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "174": {
              "id": 174,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "175": {
              "id": 175,
              "title": "Переговоры",
              "color": "#ffff99"
            },
            "176": {
              "id": 176,
              "title": "Принимают решение",
              "color": "#ffcc66"
            },
            "177": {
              "id": 177,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "178": {
              "id": 178,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "12": {
          "id": 12,
          "name": "Холодные 2ой КЦ",
          "archive": false,
          "stages": {
            "179": {
              "id": 179,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "180": {
              "id": 180,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "181": {
              "id": 181,
              "title": "Недозвон",
              "color": "#d6eaff"
            },
            "182": {
              "id": 182,
              "title": "Не Целевой",
              "color": "#99ccff"
            },
            "183": {
              "id": 183,
              "title": "НЦ по минималке",
              "color": "#99ccff"
            },
            "184": {
              "id": 184,
              "title": "НЦ уже делают ремонт",
              "color": "#99ccff"
            },
            "185": {
              "id": 185,
              "title": "Отказ Производства",
              "color": "#ff8f92"
            },
            "186": {
              "id": 186,
              "title": "НЕт Ключей",
              "color": "#f3beff"
            },
            "187": {
              "id": 187,
              "title": "Думает срок не определен",
              "color": "#87f2c0"
            },
            "188": {
              "id": 188,
              "title": "Думает",
              "color": "#fffd7f"
            },
            "189": {
              "id": 189,
              "title": "ПЕРЕЗВОНИТЬ НА ЗАМЕР ГОРЯЧИЕ",
              "color": "#deff81"
            },
            "190": {
              "id": 190,
              "title": "Выезд дизайн (перенести в отделку)",
              "color": "#99ccff"
            },
            "191": {
              "id": 191,
              "title": "Выезд замерщика (перенести в отделку)",
              "color": "#ffce5a"
            },
            "192": {
              "id": 192,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "193": {
              "id": 193,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "13": {
          "id": 13,
          "name": "Московская Планировка",
          "archive": false,
          "stages": {
            "194": {
              "id": 194,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "195": {
              "id": 195,
              "title": "КВАЛИФИКАЦИЯ (ВЗЯТ В РАБОТУ)",
              "color": "#fffeb2"
            },
            "196": {
              "id": 196,
              "title": "НЕДОЗВОН",
              "color": "#c1e0ff"
            },
            "197": {
              "id": 197,
              "title": "Не целевой",
              "color": "#99ccff"
            },
            "198": {
              "id": 198,
              "title": "Нет ключей",
              "color": "#eb93ff"
            },
            "199": {
              "id": 199,
              "title": "ДУМАЮТ В РАБОТЕ",
              "color": "#fffd7f"
            },
            "200": {
              "id": 200,
              "title": "ПЕРЕЗВОНИТЬ НА ЗАМЕР (ГОРЯЧИЕ)",
              "color": "#deff81"
            },
            "201": {
              "id": 201,
              "title": "ВЫЕЗД ЗАМЕРЩИКА",
              "color": "#ffce5a"
            },
            "202": {
              "id": 202,
              "title": "ДИЗАЙН",
              "color": "#99ccff"
            },
            "203": {
              "id": 203,
              "title": "ВЫЕЗД ЗАМЕРЩИКА РАСПРЕДЕЛЕНИЕ",
              "color": "#ffc8c8"
            },
            "204": {
              "id": 204,
              "title": "В новой СРМ",
              "color": "#ebffb1"
            },
            "205": {
              "id": 205,
              "title": "СОГЛАСОВАТЬ СМЕТУ",
              "color": "#fffeb2"
            },
            "206": {
              "id": 206,
              "title": "ВЫДАНО В РАБОТУ",
              "color": "#99ccff"
            },
            "207": {
              "id": 207,
              "title": "ПРОИЗВОДИТСЯ РЕМОНТ ИВА",
              "color": "#87f2c0"
            },
            "208": {
              "id": 208,
              "title": "Закрыто нет документов",
              "color": "#98cbff"
            },
            "209": {
              "id": 209,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "210": {
              "id": 210,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "14": {
          "id": 14,
          "name": "Аудит новострой",
          "archive": false,
          "stages": {
            "211": {
              "id": 211,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "212": {
              "id": 212,
              "title": "Новые заявки",
              "color": "#99ccff"
            },
            "213": {
              "id": 213,
              "title": "Квалификация",
              "color": "#fffeb2"
            },
            "214": {
              "id": 214,
              "title": "Недозвон",
              "color": "#99ccff"
            },
            "215": {
              "id": 215,
              "title": "Рассылка в месенджере отправлена",
              "color": "#99ccff"
            },
            "216": {
              "id": 216,
              "title": "Думают в работе",
              "color": "#ffff99"
            },
            "217": {
              "id": 217,
              "title": "Горячие перезвонить на замер",
              "color": "#87f2c0"
            },
            "218": {
              "id": 218,
              "title": "Выезд замерщика",
              "color": "#ffce5a"
            },
            "219": {
              "id": 219,
              "title": "Выезд дизайн",
              "color": "#99ccff"
            },
            "220": {
              "id": 220,
              "title": "Выезд замерщика распределение",
              "color": "#ffc8c8"
            },
            "221": {
              "id": 221,
              "title": "В НОВОЙ СРМ",
              "color": "#deff81"
            },
            "222": {
              "id": 222,
              "title": "распределен",
              "color": "#99ccff"
            },
            "223": {
              "id": 223,
              "title": "Согласовать смету",
              "color": "#fffd7f"
            },
            "224": {
              "id": 224,
              "title": "Возврат на доработку РОПу",
              "color": "#99ccff"
            },
            "225": {
              "id": 225,
              "title": "Выдано в работу",
              "color": "#99ccff"
            },
            "226": {
              "id": 226,
              "title": "Производится ремонт",
              "color": "#87f2c0"
            },
            "227": {
              "id": 227,
              "title": "Заморозка",
              "color": "#99ccff"
            },
            "228": {
              "id": 228,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "229": {
              "id": 229,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "15": {
          "id": 15,
          "name": "М2 Партнеры",
          "archive": false,
          "stages": {
            "230": {
              "id": 230,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "231": {
              "id": 231,
              "title": "НОВЫЕ ЗАЯВКИ",
              "color": "#99ccff"
            },
            "232": {
              "id": 232,
              "title": "КВАЛИФИКАЦИЯ",
              "color": "#ffff99"
            },
            "233": {
              "id": 233,
              "title": "Недозвон",
              "color": "#99ccff"
            },
            "234": {
              "id": 234,
              "title": "Не Целевой",
              "color": "#99ccff"
            },
            "235": {
              "id": 235,
              "title": "Дубль",
              "color": "#99ccff"
            },
            "236": {
              "id": 236,
              "title": "нет ключей",
              "color": "#eb93ff"
            },
            "237": {
              "id": 237,
              "title": "Думает в работе у оператора",
              "color": "#fffeb2"
            },
            "238": {
              "id": 238,
              "title": "ГОРЯЧИЕ ПЕРЕЗВОНИТЬ НА ЗАМЕР",
              "color": "#87f2c0"
            },
            "239": {
              "id": 239,
              "title": "ВЫЕЗД ЗАМЕРЩИКА",
              "color": "#ffcc66"
            },
            "240": {
              "id": 240,
              "title": "Распеделение",
              "color": "#99ccff"
            },
            "241": {
              "id": 241,
              "title": "Выдано в работу",
              "color": "#99ccff"
            },
            "242": {
              "id": 242,
              "title": "Производится Ремонт",
              "color": "#87f2c0"
            },
            "243": {
              "id": 243,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "244": {
              "id": 244,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "16": {
          "id": 16,
          "name": "Приемка.Москва",
          "archive": false,
          "stages": {
            "245": {
              "id": 245,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "246": {
              "id": 246,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "247": {
              "id": 247,
              "title": "Нецелевой",
              "color": "#99ccff"
            },
            "248": {
              "id": 248,
              "title": "Недозвон",
              "color": "#d6eaff"
            },
            "249": {
              "id": 249,
              "title": "Думает",
              "color": "#ffff99"
            },
            "250": {
              "id": 250,
              "title": "Думает срок не отпределен",
              "color": "#87f2c0"
            },
            "251": {
              "id": 251,
              "title": "Горячие на замер",
              "color": "#deff81"
            },
            "252": {
              "id": 252,
              "title": "Выезд замерщика",
              "color": "#ffcc66"
            },
            "253": {
              "id": 253,
              "title": "Выезд замерщика распределение",
              "color": "#ffc8c8"
            },
            "254": {
              "id": 254,
              "title": "В НОВОЙ СРМ",
              "color": "#deff81"
            },
            "255": {
              "id": 255,
              "title": "Распределен",
              "color": "#d6eaff"
            },
            "256": {
              "id": 256,
              "title": "Согласовать смету",
              "color": "#fffd7f"
            },
            "257": {
              "id": 257,
              "title": "Выдано в работу",
              "color": "#99ccff"
            },
            "258": {
              "id": 258,
              "title": "Производится ремонт",
              "color": "#87f2c0"
            },
            "259": {
              "id": 259,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "260": {
              "id": 260,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "17": {
          "id": 17,
          "name": "Avito",
          "archive": false,
          "stages": {
            "261": {
              "id": 261,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "262": {
              "id": 262,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "263": {
              "id": 263,
              "title": "Переговоры",
              "color": "#ffff99"
            },
            "264": {
              "id": 264,
              "title": "Принимают решение",
              "color": "#ffcc66"
            },
            "265": {
              "id": 265,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "266": {
              "id": 266,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "18": {
          "id": 18,
          "name": "Комплектация Новая",
          "archive": false,
          "stages": {
            "267": {
              "id": 267,
              "title": "Неразобранное",
              "color": "#c1c1c1"
            },
            "268": {
              "id": 268,
              "title": "Первичный контакт",
              "color": "#99ccff"
            },
            "269": {
              "id": 269,
              "title": "Недозвон",
              "color": "#c1e0ff"
            },
            "270": {
              "id": 270,
              "title": "Не целевой",
              "color": "#98cbff"
            },
            "271": {
              "id": 271,
              "title": "Принимают решение",
              "color": "#fffeb2"
            },
            "272": {
              "id": 272,
              "title": "Передан в комплектацию",
              "color": "#deff81"
            },
            "273": {
              "id": 273,
              "title": "Успешно реализовано",
              "color": "#CCFF66"
            },
            "274": {
              "id": 274,
              "title": "Закрыто и не реализовано",
              "color": "#D5D8DB"
            }
          }
        },
        "19": {
          "id": 19,
          "name": "Замер",
          "archive": false,
          "stages": {
            "275": {
              "id": 275,
              "title": "Распределен перенос из АМО",
              "color": "#22B14B"
            },
            "276": {
              "id": 276,
              "title": "Распределение замеров",
              "color": "#97d4ff"
            },
            "277": {
              "id": 277,
              "title": "Отмена замера",
              "color": "#ffffff"
            },
            "278": {
              "id": 278,
              "title": "Распределенные замеры",
              "color": "#41d2f3"
            },
            "279": {
              "id": 279,
              "title": "Удаленный просчёт",
              "color": "#7cd7f3"
            },
            "280": {
              "id": 280,
              "title": "Выезд состоялся",
              "color": "#c0fd04"
            }
          }
        },
        "20": {
          "id": 20,
          "name": "Производство",
          "archive": false,
          "stages": []
        }
      },
      "companies": [
        {
          "id": 1,
          "sab_id": "39",
          "name": "Атлон ФМ",
          "name_short": "Атлон ФМ",
          "inn": "7726469525",
          "okpo": "",
          "address": "115230, г. Москва, Каширское шоссе, д.3, корпус 2, стр.9 оф.№13А ДК «Сириус Парк»",
          "phone_company": "+7 (495) 777-70-91",
          "email_company": "info@atlonfm.ru",
          "idAddressCity": "7700000000000",
          "ogrn": "1207700389456",
          "kpp": "772401001",
          "oktmo": "",
          "date_state_registration": "20.10.2020",
          "general_manager": "Антипин Александр Юрьевич",
          "web_url": "",
          "address_document": "БЦ Сириус Парк, г.Москва. Каширское ш., 3, строение 9",
          "chief_accountant": "Антипин Александр Юрьевич",
          "bank_name": "АО «Тинькофф Банк»",
          "bank_bik": "044525974",
          "bank_payment_account": "40702810910000717489",
          "bank_correspondent_account": "30101810145250000974",
          "bank_address": "",
          "bank_swift": "",
          "logo": "https://atlonfm.sab-space.ru/source/image/info_system/logo39.jpeg",
          "logo_document": "https://atlonfm.sab-space.ru/source/image/info_system/logo_document39.jpeg"
        },
        {
          "id": 2,
          "sab_id": "42",
          "name": "Атлон Маркет",
          "name_short": "Маркет",
          "inn": "9724100510",
          "okpo": "",
          "address": "129515, город Москва, вн.тер. г. Муниципальный Округ Останкинский, ул. Академика Королева, дом 13, строение 1, помещение 3А/2",
          "phone_company": "+7 (495) 777-70-91",
          "email_company": "",
          "idAddressCity": "7700000000000",
          "ogrn": "1227700613095",
          "kpp": "771701001",
          "oktmo": "",
          "date_state_registration": "",
          "general_manager": "Краснов Михаил Петрович",
          "web_url": "",
          "address_document": "",
          "chief_accountant": "",
          "bank_name": "АО «АЛЬФА-БАНК»",
          "bank_bik": "044525593",
          "bank_payment_account": "40702810802860015755",
          "bank_correspondent_account": "30101810200000000593",
          "bank_address": "",
          "bank_swift": "kiselev",
          "logo": "",
          "logo_document": ""
        },
        {
          "id": 3,
          "sab_id": "40",
          "name": "Атлон Фасилити Менеджмент",
          "name_short": "Фасилити",
          "inn": "9728094770",
          "okpo": "0",
          "address": "117279, город Москва, вн.тер.г. муниципальный округ Коньково, Миклухо-Маклая ул., дом 34, помещ. 26/4",
          "phone_company": "+7 (495) 106-70-90",
          "email_company": "info@atlonfm.ru",
          "idAddressCity": "7700000000000",
          "ogrn": "1237700313377",
          "kpp": "772801001",
          "oktmo": "",
          "date_state_registration": "",
          "general_manager": "Киселёв Дмитрий Сергеевич",
          "web_url": "",
          "address_document": "",
          "chief_accountant": "Мостовских Светлана Варужановна",
          "bank_name": "АО «Альфа-Банк»",
          "bank_bik": "044525593",
          "bank_payment_account": "40702810202860013946",
          "bank_correspondent_account": "30101810200000000593",
          "bank_address": "",
          "bank_swift": "admin",
          "logo": "",
          "logo_document": ""
        },
        {
          "id": 4,
          "sab_id": "41",
          "name": "Атлон ФМ Центр",
          "name_short": "Центр",
          "inn": "9719037060",
          "okpo": "",
          "address": "105077, Г.МОСКВА, ВН.ТЕР.Г. МУНИЦИПАЛЬНЫЙ ОКРУГ ВОСТОЧНОЕ ИЗМАЙЛОВО, Б-Р ИЗМАЙЛОВСКИЙ, Д. 46, ПОМЕЩ. 1/П",
          "phone_company": "+7 (495) 727-77-89",
          "email_company": "info@atlonfm.ru",
          "idAddressCity": "7700000000000",
          "ogrn": "",
          "kpp": "771901001",
          "oktmo": "",
          "date_state_registration": "",
          "general_manager": "Антипин Александр Юрьевич",
          "web_url": "",
          "address_document": "",
          "chief_accountant": "",
          "bank_name": "АО «Альфа–Банк» ",
          "bank_bik": "044525593",
          "bank_payment_account": "40702810002860018918",
          "bank_correspondent_account": "30101810200000000593",
          "bank_address": "",
          "bank_swift": "kiselev",
          "logo": "",
          "logo_document": ""
        },
        {
          "id": 5,
          "sab_id": "43",
          "name": "Атлон ФМ Север",
          "name_short": "Север",
          "inn": "7802931945",
          "okpo": "",
          "address": "194044 г. Санкт-Петербург, вн.тер.г. муниципальный округ Сампсониевское, пр-кт Большой Сампсониевский, д. 4-6, литера А, помещ./офис 12-Н",
          "phone_company": "+7 (929) 112-80-50",
          "email_company": "sever@atlonfm.ru",
          "idAddressCity": "7800000000000",
          "ogrn": "1227800141095",
          "kpp": "780201001",
          "oktmo": "",
          "date_state_registration": "",
          "general_manager": "Сатемирова Наталья Петровна",
          "web_url": "",
          "address_document": "194044 г. Санкт-Петербург, вн.тер.г. муниципальный округ Сампсониевское, пр-кт Большой Сампсониевский, д. 4-6, литера А, помещ./офис 12-Н",
          "chief_accountant": "Сатемирова Наталья Петровна",
          "bank_name": "АО «Альфа–Банк»",
          "bank_bik": "044525593",
          "bank_payment_account": "40702810202860016367",
          "bank_correspondent_account": "30101810200000000593",
          "bank_address": "",
          "bank_swift": "",
          "logo": "https://atlonfm.sab-space.ru/source/image/info_system/logo43.jpeg",
          "logo_document": "https://atlonfm.sab-space.ru/source/image/info_system/logo_document43.jpeg"
        }
      ],
      "roomSettings": {
        "columns": [
          "Внешний угол",
          "Выступ",
          "Колонна"
        ],
        "types": [
          "Общестрой",
          "Спецмонтаж",
          "Электрика",
          "Сантехника",
          "Балкон",
          "Двери",
          "Демонтаж",
          "Кухня",
          "Отопление",
          "Санузел",
          "Студия"
        ]
      },
      "workSettings": {
        "eds": [
          "-",
          "кв.м.",
          "пог.м.",
          "шт",
          "компл",
          "кг",
          "т",
          "м3",
          "ч"
        ],
        "factors": [
          {
            "title": "Количество",
            "room_field": "1"
          },
          {
            "title": "Площадь пола",
            "room_field": "s_floor"
          },
          {
            "title": "Площадь стен",
            "room_field": "s_walls"
          },
          {
            "title": "Периметр пола",
            "room_field": "p_floor"
          },
          {
            "title": "Периметр потолка",
            "room_field": "perimeter"
          },
          {
            "title": "Количество углов",
            "room_field": "@getAllCornersCount"
          },
          {
            "title": "Длина",
            "room_field": "1"
          },
          {
            "title": "Площадь",
            "room_field": "1"
          },
          {
            "title": "Вес",
            "room_field": "1"
          },
          {
            "title": "Объем",
            "room_field": "1"
          },
          {
            "title": "Откосы окна",
            "room_field": "slopes_windows"
          },
          {
            "title": "Откосы двери",
            "room_field": "slopes_doors"
          },
          {
            "title": "Откосы (окна + двери)",
            "room_field": "slopes_doors + slopes_windows"
          },
          {
            "title": "Длина подоконника",
            "room_field": "@getWindowsWidth"
          },
          {
            "title": "Площадь подоконника",
            "room_field": "@getWindowsillsSquare"
          },
          {
            "title": "Площадь колон (стены)",
            "room_field": "@getColumnsWallSquare"
          },
          {
            "title": "Площадь оконных проёмов",
            "room_field": "@getWindowsSquare"
          },
          {
            "title": "Длина внешних углов",
            "room_field": "@getOutsideCornersWidth"
          },
          {
            "title": "Длина внутренних углов",
            "room_field": "@getInsideCornersWidth"
          },
          {
            "title": "Общая длина углов",
            "room_field": "@getAllCornersWidth"
          },
          {
            "title": "Площадь (пол + стена)",
            "room_field": "s_walls + s_floor"
          },
          {
            "title": "Площадь откосов окон",
            "room_field": "@getWindowsSlopeSqaure"
          },
          {
            "title": "Площадь дверных проёмов",
            "room_field": "@getDoorsSquare"
          },
          {
            "title": "Длина дверного порожка",
            "room_field": "@getDoorsWidth"
          },
          {
            "title": "Периметр колонн (пол/потолок)",
            "room_field": "default_val"
          },
          {
            "title": "Количество внешних углов",
            "room_field": "@getOutsideCornersCount"
          },
          {
            "title": "Количество внутренних углов",
            "room_field": "@getInsideCornersCount"
          },
          {
            "title": "Количество дверей",
            "room_field": "@getDoorsCount"
          },
          {
            "title": "Количество окон",
            "room_field": "@getWindowsCount"
          },
          {
            "title": "Общее количество проёмов",
            "room_field": "@getDoorsAndWindowsCount"
          },
          {
            "title": "Высота",
            "room_field": "1"
          },
          {
            "title": "Время",
            "room_field": "1"
          }
        ],
        "type": [
          "не выбран",
          "малярные работы",
          "пол",
          "потолок"
        ],
        "category": [
          {
            "id": 1,
            "name": "Демонтажные работы"
          },
          {
            "id": 2,
            "name": "Черновые отделочные работы"
          },
          {
            "id": 3,
            "name": "Чистовые отделочные работы"
          },
          {
            "id": 4,
            "name": "Сантехнические  работы"
          },
          {
            "id": 5,
            "name": "Подготовительные  работы"
          },
          {
            "id": 6,
            "name": "Электромонтажные  работы"
          }
        ],
        "group": {
          "1": "Двери, окна",
          "2": "Откосы",
          "3": "Полы",
          "4": "Потолки",
          "5": "Прочие",
          "6": "Сантехника",
          "7": "Стены",
          "8": "Электрика",
          "9": "Откосы",
          "10": "Полы",
          "11": "Потолки",
          "12": "Стены",
          "13": "Двери, окна",
          "14": "Откосы",
          "15": "Полы",
          "16": "Потолки",
          "17": "Прочие",
          "18": "Стены",
          "19": "Прочие",
          "20": "Прочие",
          "21": "Прочие"
        }
      }    
}

