export const dealData = {
    lists: {
            "fields": {
                "id": {
                    "name": "primary key",
                    "type": "number",
                    "search": false,
                    "filter": false
                },
                "uid": {
                    "name": "\u0418\u0414",
                    "type": "string",
                    "search": true,
                    "filter": true
                },
                "address": {
                    "name": "\u0410\u0434\u0440\u0435\u0441",
                    "type": "string",
                    "search": true,
                    "filter": false
                },
                "budget_sum": {
                    "name": "\u0411\u044e\u0434\u0436\u0435\u0442 \u0437\u0430\u043a\u0430\u0437\u0447\u0438\u043a\u0430",
                    "type": "money",
                    "step": 10000,
                    "search": false,
                    "filter": true
                },
                "confirmed_smet_sum": {
                    "name": "\u0421\u0443\u043c\u043c\u0430 \u043f\u043e \u0441\u043c\u0435\u0442\u0435",
                    "type": "money",
                    "step": 10000,
                    "search": false,
                    "filter": true
                },
                "additional_works_sum": {
                    "name": "\u0421\u0443\u043c\u043c\u0430 \u0434\u043e\u043f \u0440\u0430\u0431\u043e\u0442",
                    "type": "money",
                    "step": 10000,
                    "search": false,
                    "filter": true
                },
                "facility_type": {
                    "name": "\u0422\u0438\u043f \u043d\u0435\u0434\u0432\u0438\u0436\u0438\u043c\u043e\u0441\u0442\u0438",
                    "type": "index",
                    "source": "config",
                    "target": "atlon.list.facility.type",
                    "search": false,
                    "filter": true,
                    "list": [
                        "\u041d\u0435 \u0443\u043a\u0430\u0437\u0430\u043d\u043e",
                        "\u041d\u043e\u0432\u043e\u0441\u0442\u0440\u043e\u0439\u043a\u0430",
                        "\u0412\u0442\u043e\u0440\u0438\u0447\u043a\u0430",
                        "\u0427\u0430\u0441\u0442\u043d\u044b\u0439 \u0434\u043e\u043c\/\u043a\u043e\u0442\u0442\u0435\u0434\u0436",
                        "\u041e\u0444\u0438\u0441",
                        "\u041c\u0430\u0433\u0430\u0437\u0438\u043d",
                        "\u041a\u043e\u043c\u043c\u0435\u0440\u0447\u0435\u0441\u043a\u043e\u0435 \u043f\u043e\u043c\u0435\u0449\u0435\u043d\u0438\u0435",
                        "\u0414\u043e\u0434\u0435\u043b\u043a\u0430",
                        "\u0414\u0440\u0443\u0433\u043e\u0435"
                    ]
                },
                "facility_condition": {
                    "name": "\u0421\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u043d\u0435\u0434\u0432\u0438\u0436\u0438\u043c\u043e\u0441\u0442\u0438",
                    "type": "index",
                    "source": "config",
                    "target": "atlon.list.facility.condition",
                    "search": false,
                    "filter": true,
                    "list": [
                        "\u0411\u0435\u0437 \u043e\u0442\u0434\u0435\u043b\u043a\u0438",
                        "\u041e\u0442\u0434\u0435\u043b\u043a\u0430 \u043e\u0442 \u0437\u0430\u0441\u0442\u0440\u043e\u0439\u0449\u0438\u043a\u0430",
                        "\u0427\u0435\u0440\u043d\u043e\u0432\u0430\u044f \u043e\u0442\u0434\u0435\u043b\u043a\u0430",
                        "\u0421\u0442\u0430\u0440\u044b\u0439 \u0440\u0435\u043c\u043e\u043d\u0442",
                        "\u0411\u0435\u0442\u043e\u043d",
                        "\u0412\u0430\u0439\u0442 \u0431\u043e\u043a\u0441",
                        "\u041e\u0442\u0434\u0435\u043b\u043a\u0430 \u043f\u043e\u043b\u043d\u0430\u044f",
                        "\u041e\u0442\u0434\u0435\u043b\u043a\u0430 \u0447\u0430\u0441\u0442\u0438\u0447\u043d\u0430\u044f (\u0442\u043e\u043b\u044c\u043a\u043e \u0447\u0435\u0440\u043d\u043e\u0432\u044b\u0435)",
                        "\u0422\u043e\u043b\u044c\u043a\u043e \u0447\u0430\u0441\u0442\u044c \u0447\u0435\u0440\u043d\u043e\u0432\u044b\u0445"
                    ]
                },
                "renovation_type": {
                    "name": "\u0422\u0438\u043f \u0440\u0435\u043c\u043e\u043d\u0442\u0430",
                    "type": "index",
                    "source": "config",
                    "target": "atlon.list.renovation.type",
                    "search": false,
                    "filter": true,
                    "list": [
                        "\u041a\u0430\u043f\u0438\u0442\u0430\u043b\u044c\u043d\u044b\u0439",
                        "\u041a\u043e\u0441\u043c\u0435\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439",
                        "\u0414\u0438\u0437\u0430\u0439\u043d\u0435\u0440\u0441\u043a\u0438\u0439",
                        "\u0415\u0432\u0440\u043e\u0440\u0435\u043c\u043e\u043d\u0442"
                    ]
                },
                "partner": {
                    "name": "\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u043a\u0430",
                    "type": "string",
                    "search": false,
                    "filter": true
                },
                "agent": {
                    "name": "\u0410\u0433\u0435\u043d\u0442\u0441\u043a\u0438\u0439 \u0434\u043e\u0433\u043e\u0432\u043e\u0440",
                    "type": "boolean",
                    "search": false,
                    "filter": true
                },
                "created_at": {
                    "name": "\u0414\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u043e",
                    "type": "datetime",
                    "search": false,
                    "filter": true
                },
                "updated_at": {
                    "name": "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e",
                    "type": "datetime",
                    "search": false,
                    "filter": true
                },
                "deleted_at": {
                    "name": "\u0423\u0434\u0430\u043b\u0435\u043d\u043e",
                    "type": "datetime",
                    "search": false,
                    "filter": false
                },
                "region": {
                    "name": "\u0420\u0435\u0433\u0438\u043e\u043d",
                    "type": "string",
                    "search": false,
                    "filter": true
                },
                "temperature": {
                    "name": "\u041b\u043e\u044f\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u043a\u043b\u0438\u0435\u043d\u0442\u0430",
                    "type": "index",
                    "source": "config",
                    "target": "atlon.list.client.temperature",
                    "search": false,
                    "filter": true,
                    "list": [
                        "\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u043e",
                        "\u0413\u043e\u0440\u044f\u0447\u0438\u0439. \u0420\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d",
                        "\u041b\u043e\u044f\u043b\u0435\u043d \u0433\u043e\u0442\u043e\u0432 \u0433\u043e\u0432\u043e\u0440\u0438\u0442\u044c",
                        "\u041d\u0430 \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u0438\u0434\u0435\u0442. \u041c\u0430\u043b\u043e\u0441\u043b\u043e\u0432\u0435\u043d",
                        "\u0410\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u043e. \u041d\u0435 \u0448\u0435\u043b \u043d\u0430 \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u0432\u0438\u0437\u0438\u0442\u043a\u0443 \u043f\u043e\u043f\u0440\u043e\u0441\u0438\u043b",
                        "\u041d\u0435 \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u043e. \u041d\u0435 \u043d\u0443\u0436\u0435\u043d \u0440\u0435\u043c\u043e\u043d\u0442",
                        "\u041d\u0435\u0442 \u043c\u0438\u043d\u0438\u043c\u0430\u043b\u043a\u0438",
                        "\u041f\u0440\u043e\u0434\u0430\u0435\u0442",
                        "\u0423\u0436\u0435 \u043d\u0430\u0448\u0435\u043b",
                        "\u0410\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u043e. \u041a\u043b\u044e\u0447\u0435\u0439 \u043d\u0435\u0442",
                        "\u0410\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u043e \u0433\u043e\u0442\u043e\u0432\u0438\u0442\u0441\u044f \u0414\u041f",
                        "\u041d\u0438\u043a\u043e\u0433\u0434\u0430 \u041d\u0414\u0417",
                        "\u0413\u043e\u0440\u044f\u0447\u0438\u0439. \u041d\u0435\u0442 \u043a\u043b\u044e\u0447\u0435\u0439",
                        "\u041a\u043b\u044e\u0447\u0435\u0439 \u043d\u0435\u0442. \u041d\u0435 \u0441\u0430\u043c\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u043d\u044b\u0439",
                        "\u0414\u0443\u043c\u0430\u0435\u0442 \u041d\u0414\u0417"
                    ]
                },
                "lead_source": {
                    "name": "\u041e\u0442\u043a\u0443\u0434\u0430 \u0443\u0437\u043d\u0430\u043b\u0438 \u043e \u043d\u0430\u0441",
                    "type": "string",
                    "search": false,
                    "filter": true
                },
                "skidka": {
                    "name": "\u0421\u043a\u0438\u0434\u043a\u0430",
                    "type": "number",
                    "search": false,
                    "filter": true
                },
                "coef": {
                    "name": "\u041a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442",
                    "type": "number",
                    "search": false,
                    "filter": true
                },
                "responsible": {
                    "name": "\u041e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439",
                    "type": "index",
                    "source": "model",
                    "target": "User",
                    "search": false,
                    "filter": true,
                    "list": []
                },
                "designer": {
                    "name": "\u0414\u0438\u0437\u0430\u0439\u043d\u0435\u0440",
                    "type": "index",
                    "source": "model",
                    "target": "User",
                    "search": false,
                    "filter": true,
                    "list": []
                },
                "operator": {
                    "name": "\u041a\u04261 \u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0437\u0430 \u0441\u0434\u0435\u043b\u043a\u0443",
                    "type": "index",
                    "source": "model",
                    "target": "User",
                    "search": false,
                    "filter": true,
                    "list": []
                },
                "zamerman": {
                    "name": "\u0417\u0430\u043c\u0435\u0440\u0449\u0438\u043a",
                    "type": "index",
                    "source": "model",
                    "target": "User",
                    "search": false,
                    "filter": true,
                    "list": []
                },
                "prorab": {
                    "name": "\u041f\u0440\u043e\u0440\u0430\u0431",
                    "type": "index",
                    "source": "model",
                    "target": "User",
                    "search": false,
                    "filter": true,
                    "list": []
                },
                "date_start": {
                    "name": "\u0414\u0430\u0442\u0430 \u043d\u0430\u0447\u0430\u043b\u0430 \u0440\u0430\u0431\u043e\u0442",
                    "type": "date",
                    "search": false,
                    "filter": false
                },
                "date_end": {
                    "name": "\u0414\u0430\u0442\u0430 \u043e\u043a\u043e\u043d\u0447\u0430\u043d\u0438\u044f \u0440\u0430\u0431\u043e\u0442",
                    "type": "date",
                    "search": false,
                    "filter": false
                },
                "amo_id": {
                    "name": "\u0418\u0434\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440 AmoCRM",
                    "type": "number",
                    "search": false,
                    "filter": false
                },
                "amo_sync": {
                    "name": "\u0412\u0440\u0435\u043c\u044f \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0430\u0446\u0438\u0438 \u0441 AmoCRM",
                    "type": "datetime",
                    "search": false,
                    "filter": false
                },
                "price": {
                    "name": "\u041f\u0440\u0430\u0439\u0441 \u043b\u0438\u0441\u0442",
                    "type": "array",
                    "search": false,
                    "filter": false
                },
                "company_id": {
                    "name": "\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f",
                    "type": "index",
                    "source": "config",
                    "target": "atlon.list.company",
                    "pluck": "id|name",
                    "search": false,
                    "filter": false,
                    "list": {
                        "1": "\u0410\u0442\u043b\u043e\u043d \u0424\u041c",
                        "2": "\u0410\u0442\u043b\u043e\u043d \u041c\u0430\u0440\u043a\u0435\u0442",
                        "3": "\u0410\u0442\u043b\u043e\u043d \u0424\u0430\u0441\u0438\u043b\u0438\u0442\u0438 \u041c\u0435\u043d\u0435\u0434\u0436\u043c\u0435\u043d\u0442",
                        "4": "\u0410\u0442\u043b\u043e\u043d \u0424\u041c \u0426\u0435\u043d\u0442\u0440",
                        "5": "\u0410\u0442\u043b\u043e\u043d \u0424\u041c \u0421\u0435\u0432\u0435\u0440"
                    }
                },
                "deferred_discount": {
                    "name": "\u041e\u0442\u043b\u043e\u0436\u0435\u043d\u043d\u0430\u044f \u0441\u043a\u0438\u0434\u043a\u0430",
                    "type": "boolean",
                    "search": false,
                    "filter": true
                },
                "confirm_act": {
                    "name": "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f \u0430\u043a\u0442\u0430 \u0441\u0434\u0430\u0447\u0438-\u043f\u0440\u0438\u0435\u043c\u043a\u0438",
                    "type": "boolean",
                    "search": false,
                    "filter": true
                },
                "coef_price_master": {
                    "name": "\u041a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442 \u0434\u043b\u044f \u043f\u0440\u0430\u0439\u0441\u0430 \u043c\u0430\u0441\u0442\u0435\u0440\u0430",
                    "type": "number",
                    "search": false,
                    "filter": false
                },
                "hold_master": {
                    "name": "\u0423\u0434\u0435\u0440\u0436\u043a\u0430 \u043c\u0430\u0441\u0442\u0435\u0440\u0430",
                    "type": "number",
                    "search": false,
                    "filter": false
                },
                "forced_percent_master": {
                    "name": "\u041f\u0440\u0438\u043d\u0443\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442 \u043c\u0430\u0441\u0442\u0435\u0440\u0430",
                    "type": "number",
                    "search": false,
                    "filter": false
                },
                "increase_master": {
                    "name": "\u0423\u0432\u0435\u043b\u0438\u0447\u0435\u043d\u0438\u044f \u0434\u043b\u044f \u043c\u0430\u0441\u0442\u0435\u0440\u0430 (%)",
                    "type": "number",
                    "search": false,
                    "filter": false
                },
                "forced_percent_prorab": {
                    "name": "\u041f\u0440\u0438\u043d\u0443\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u043f\u0440\u043e\u0446\u0435\u043d\u0442 \u043f\u0440\u043e\u0440\u0430\u0431\u0430",
                    "type": "number",
                    "search": false,
                    "filter": false
                },
                "coef_additional_partner": {
                    "name": "\u0414\u043e\u0431\u0430\u0432\u043e\u0447\u043d\u044b\u0439 \u043a\u043e\u044d\u0444\u0444\u0438\u0446\u0438\u0435\u043d\u0442 \u043f\u0430\u0440\u0442\u043d\u0451\u0440\u0430",
                    "type": "number",
                    "search": false,
                    "filter": false
                }
            },
            "act_statuses": [
                "\u0412 \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u043a\u0435",
                "\u0421\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u043d\u0438\u0435 \u0441 \u0437\u0430\u043a\u0430\u0437\u0447\u0438\u043a\u043e\u043c",
                "\u041e\u043f\u043b\u0430\u0447\u0435\u043d",
                "\u041f\u043e\u0434\u043f\u0438\u0441\u0430\u043d \u0438 \u0441\u0434\u0430\u043d"
            ],
            "partners": [
                "222",
                "ffff"
            ],
            "tags": [
                "111",
                "222",
                "test",
                "\u0442\u0435\u0441\u0442"
            ],
            "users": [
                {
                    "id": 1,
                    "name": "\u041d\u0420\u0420",
                    "role_id": 22
                },
                {
                    "id": 2,
                    "name": "\u0410\u0410\u042e",
                    "role_id": 21
                },
                {
                    "id": 3,
                    "name": "\u041a\u0410\u0421",
                    "role_id": 22
                },
                {
                    "id": 4,
                    "name": "\u0421\u0412\u0410",
                    "role_id": 28
                },
                {
                    "id": 14,
                    "name": "\u041e\u043f\u0435\u0440\u0430\u0442\u043e\u0440 1",
                    "role_id": 2
                },
                {
                    "id": 15,
                    "name": "\u041e\u043f\u0435\u0440\u0430\u0442\u043e\u0440 2",
                    "role_id": 2
                },
                {
                    "id": 17,
                    "name": "\u0424\u0410\u041e",
                    "role_id": 3
                },
                {
                    "id": 19,
                    "name": "\u041f\u0410\u0411",
                    "role_id": 4
                },
                {
                    "id": 21,
                    "name": "\u0422\u0412\u0413",
                    "role_id": 4
                },
                {
                    "id": 22,
                    "name": "\u041a\u041c\u041f",
                    "role_id": 17
                },
                {
                    "id": 23,
                    "name": "\u041f\u0421\u0421",
                    "role_id": 4
                },
                {
                    "id": 24,
                    "name": "\u041a\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 25,
                    "name": "\u0420\u0410\u0412",
                    "role_id": 4
                },
                {
                    "id": 26,
                    "name": "\u0423\u0412\u0412",
                    "role_id": 16
                },
                {
                    "id": 27,
                    "name": "\u0421\u0410\u0414",
                    "role_id": 19
                },
                {
                    "id": 28,
                    "name": "\u0411\u0410\u041e",
                    "role_id": 19
                },
                {
                    "id": 29,
                    "name": "\u0410\u0414\u041d",
                    "role_id": 14
                },
                {
                    "id": 30,
                    "name": "\u0420\u0415\u0414",
                    "role_id": 7
                },
                {
                    "id": 31,
                    "name": "\u041f\u0430\u0440\u0442\u043d\u0451\u0440 1",
                    "role_id": 9
                },
                {
                    "id": 32,
                    "name": "\u041f\u0430\u0440\u0442\u043d\u0451\u0440 2",
                    "role_id": 9
                },
                {
                    "id": 33,
                    "name": "FRONTEND",
                    "role_id": 22
                },
                {
                    "id": 34,
                    "name": "\u0428\u0410\u0410",
                    "role_id": 5
                },
                {
                    "id": 35,
                    "name": "\u0427\u0415\u0412",
                    "role_id": 15
                },
                {
                    "id": 36,
                    "name": "\u0420\u0412\u042f",
                    "role_id": 6
                },
                {
                    "id": 42,
                    "name": "\u0417\u0410\u041a\u0410\u0417\u0427\u0418\u041a",
                    "role_id": 22
                },
                {
                    "id": 62,
                    "name": "\u041c\u0412\u0418",
                    "role_id": 2
                },
                {
                    "id": 63,
                    "name": "\u041b\u0422\u0418",
                    "role_id": 2
                },
                {
                    "id": 64,
                    "name": "\u041d\u041f\u0415",
                    "role_id": 2
                },
                {
                    "id": 65,
                    "name": "\u041a\u0421\u0410",
                    "role_id": 2
                },
                {
                    "id": 66,
                    "name": "\u041a\u0415\u042e",
                    "role_id": 2
                },
                {
                    "id": 67,
                    "name": "\u0424\u0410\u0410",
                    "role_id": 2
                },
                {
                    "id": 68,
                    "name": "\u0422\u0411\u0418",
                    "role_id": 2
                },
                {
                    "id": 69,
                    "name": "\u0410\u0420\u041c",
                    "role_id": 2
                },
                {
                    "id": 70,
                    "name": "\u0412\u0414\u0412",
                    "role_id": 2
                },
                {
                    "id": 71,
                    "name": "\u0421\u041d\u0412",
                    "role_id": 2
                },
                {
                    "id": 72,
                    "name": "\u041a\u041c\u0412",
                    "role_id": 2
                },
                {
                    "id": 73,
                    "name": "\u0427\u0410\u041d",
                    "role_id": 2
                },
                {
                    "id": 74,
                    "name": "\u0413\u041c\u0421",
                    "role_id": 2
                },
                {
                    "id": 75,
                    "name": "\u0413\u0418\u041d",
                    "role_id": 2
                },
                {
                    "id": 76,
                    "name": "\u041d\u0410\u042e",
                    "role_id": 2
                },
                {
                    "id": 77,
                    "name": "\u0414\u0420\u0418",
                    "role_id": 2
                },
                {
                    "id": 78,
                    "name": "\u0411\u0410\u0412",
                    "role_id": 2
                },
                {
                    "id": 79,
                    "name": "\u0418\u041c\u041c",
                    "role_id": 2
                },
                {
                    "id": 80,
                    "name": "\u041b\u042e\u0410",
                    "role_id": 2
                },
                {
                    "id": 81,
                    "name": "\u0425\u0410\u041e",
                    "role_id": 2
                },
                {
                    "id": 82,
                    "name": "\u041f\u0410\u0413",
                    "role_id": 2
                },
                {
                    "id": 83,
                    "name": "\u0411\u0412\u0412",
                    "role_id": 2
                },
                {
                    "id": 84,
                    "name": "\u0411\u0410\u0421",
                    "role_id": 2
                },
                {
                    "id": 85,
                    "name": "\u041c\u0414\u0421",
                    "role_id": 2
                },
                {
                    "id": 86,
                    "name": "\u0417\u041f\u0421",
                    "role_id": 2
                },
                {
                    "id": 87,
                    "name": "\u0411\u0410\u04122",
                    "role_id": 2
                },
                {
                    "id": 88,
                    "name": "\u0411\u0421\u0410",
                    "role_id": 4
                },
                {
                    "id": 89,
                    "name": "\u041c\u041c\u041d",
                    "role_id": 2
                },
                {
                    "id": 90,
                    "name": "\u0411\u0414\u041c",
                    "role_id": 2
                },
                {
                    "id": 91,
                    "name": "\u0422\u041c\u0410",
                    "role_id": 2
                },
                {
                    "id": 92,
                    "name": "\u041a\u042e\u0410",
                    "role_id": 4
                },
                {
                    "id": 93,
                    "name": "\u0427\u041e\u0414",
                    "role_id": 2
                },
                {
                    "id": 94,
                    "name": "\u0410\u041c\u041c",
                    "role_id": 7
                },
                {
                    "id": 95,
                    "name": "\u0428\u041c\u0410",
                    "role_id": 7
                },
                {
                    "id": 96,
                    "name": "\u041c\u041d\u0410",
                    "role_id": 7
                },
                {
                    "id": 97,
                    "name": "\u0421\u041c\u0413",
                    "role_id": 22
                },
                {
                    "id": 99,
                    "name": "\u041c\u041d\u0412",
                    "role_id": 11
                },
                {
                    "id": 100,
                    "name": "\u041b\u0422\u0410",
                    "role_id": 10
                },
                {
                    "id": 101,
                    "name": "\u0421\u0421\u041f",
                    "role_id": 10
                },
                {
                    "id": 102,
                    "name": "\u041f\u041c\u0421",
                    "role_id": 17
                },
                {
                    "id": 103,
                    "name": "\u0411\u0421\u04102",
                    "role_id": 17
                },
                {
                    "id": 104,
                    "name": "\u0428\u0415\u0413",
                    "role_id": 4
                },
                {
                    "id": 105,
                    "name": "\u042f\u041c\u0421",
                    "role_id": 4
                },
                {
                    "id": 106,
                    "name": "\u0428\u041f\u0421",
                    "role_id": 4
                },
                {
                    "id": 107,
                    "name": "\u0410\u0412\u0412",
                    "role_id": 4
                },
                {
                    "id": 108,
                    "name": "\u0410\u0418\u0412",
                    "role_id": 4
                },
                {
                    "id": 109,
                    "name": "\u0410\u0410\u0418",
                    "role_id": 4
                },
                {
                    "id": 110,
                    "name": "\u0411\u0410\u04123",
                    "role_id": 4
                },
                {
                    "id": 111,
                    "name": "\u0411\u041f\u0410",
                    "role_id": 4
                },
                {
                    "id": 112,
                    "name": "\u0411\u0420\u0421",
                    "role_id": 4
                },
                {
                    "id": 113,
                    "name": "\u0411\u041c\u041c",
                    "role_id": 4
                },
                {
                    "id": 114,
                    "name": "\u0411\u041d\u0412",
                    "role_id": 4
                },
                {
                    "id": 115,
                    "name": "\u0411\u041b\u0413",
                    "role_id": 4
                },
                {
                    "id": 116,
                    "name": "\u0412\u041f\u0421",
                    "role_id": 4
                },
                {
                    "id": 117,
                    "name": "\u0413\u041d\u0410",
                    "role_id": 4
                },
                {
                    "id": 118,
                    "name": "\u0413\u0410\u04122",
                    "role_id": 4
                },
                {
                    "id": 119,
                    "name": "\u0413\u041c\u0412",
                    "role_id": 4
                },
                {
                    "id": 120,
                    "name": "\u0416\u0420\u0410",
                    "role_id": 4
                },
                {
                    "id": 121,
                    "name": "\u0414\u0412\u041c",
                    "role_id": 4
                },
                {
                    "id": 122,
                    "name": "\u0417\u041c\u042e",
                    "role_id": 4
                },
                {
                    "id": 123,
                    "name": "\u041a\u0410\u041e",
                    "role_id": 4
                },
                {
                    "id": 125,
                    "name": "\u041a\u041c\u04122",
                    "role_id": 4
                },
                {
                    "id": 126,
                    "name": "\u041b\u0412\u04212",
                    "role_id": 4
                },
                {
                    "id": 127,
                    "name": "\u041b\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 128,
                    "name": "\u041c\u041c\u0412",
                    "role_id": 4
                },
                {
                    "id": 129,
                    "name": "\u0421\u042d\u0420",
                    "role_id": 4
                },
                {
                    "id": 130,
                    "name": "\u0421\u0415\u0412",
                    "role_id": 4
                },
                {
                    "id": 131,
                    "name": "\u0421\u0410\u0412",
                    "role_id": 4
                },
                {
                    "id": 132,
                    "name": "\u0421\u0410\u041f",
                    "role_id": 4
                },
                {
                    "id": 133,
                    "name": "\u0421\u0410\u0421",
                    "role_id": 4
                },
                {
                    "id": 134,
                    "name": "\u0422\u0422\u041e",
                    "role_id": 4
                },
                {
                    "id": 135,
                    "name": "\u0422\u042e\u0418",
                    "role_id": 4
                },
                {
                    "id": 136,
                    "name": "\u0422\u0415\u0412",
                    "role_id": 4
                },
                {
                    "id": 137,
                    "name": "\u0423\u041f\u0410",
                    "role_id": 4
                },
                {
                    "id": 138,
                    "name": "\u0424\u0415\u0421",
                    "role_id": 4
                },
                {
                    "id": 139,
                    "name": "\u0425\u0421\u0421",
                    "role_id": 4
                },
                {
                    "id": 140,
                    "name": "\u041a\u0412\u041d",
                    "role_id": 4
                },
                {
                    "id": 141,
                    "name": "\u0413\u0418\u042e",
                    "role_id": 4
                },
                {
                    "id": 142,
                    "name": "\u0413\u0412\u0424",
                    "role_id": 4
                },
                {
                    "id": 143,
                    "name": "\u0422\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 144,
                    "name": "\u0413\u0410\u0421",
                    "role_id": 1
                },
                {
                    "id": 145,
                    "name": "\u0414\u0414\u0415",
                    "role_id": 3
                },
                {
                    "id": 146,
                    "name": "\u041a\u0418\u0412",
                    "role_id": 3
                },
                {
                    "id": 147,
                    "name": "\u0424\u042f\u0412",
                    "role_id": 3
                },
                {
                    "id": 148,
                    "name": "\u0422\u042f\u0421",
                    "role_id": 3
                },
                {
                    "id": 149,
                    "name": "\u0421\u0415\u0413",
                    "role_id": 3
                },
                {
                    "id": 150,
                    "name": "\u0421\u0420\u0418",
                    "role_id": 3
                },
                {
                    "id": 151,
                    "name": "\u0421\u0415\u04122",
                    "role_id": 3
                },
                {
                    "id": 152,
                    "name": "\u041f\u042e\u0410",
                    "role_id": 3
                },
                {
                    "id": 153,
                    "name": "\u041d\u041c\u042e",
                    "role_id": 3
                },
                {
                    "id": 154,
                    "name": "\u0417\u0420\u041b",
                    "role_id": 3
                },
                {
                    "id": 155,
                    "name": "\u0412\u0421\u041d",
                    "role_id": 3
                },
                {
                    "id": 156,
                    "name": "\u041a\u041c\u041d",
                    "role_id": 3
                },
                {
                    "id": 157,
                    "name": "\u0424\u0412\u041f",
                    "role_id": 3
                },
                {
                    "id": 158,
                    "name": "\u041a\u0410\u041c",
                    "role_id": 4
                },
                {
                    "id": 159,
                    "name": "\u041f\u0421\u04122",
                    "role_id": 18
                },
                {
                    "id": 160,
                    "name": "\u0426\u0410\u0421",
                    "role_id": 27
                },
                {
                    "id": 161,
                    "name": "\u0421\u0418\u041d",
                    "role_id": 27
                },
                {
                    "id": 162,
                    "name": "\u0427\u0412\u0424",
                    "role_id": 4
                },
                {
                    "id": 163,
                    "name": "\u041e\u0410\u0412",
                    "role_id": 27
                },
                {
                    "id": 164,
                    "name": "\u0424\u0420\u041e",
                    "role_id": 27
                },
                {
                    "id": 165,
                    "name": "\u0411\u0410\u04124",
                    "role_id": 27
                },
                {
                    "id": 167,
                    "name": "\u0411\u042f\u0412",
                    "role_id": 4
                },
                {
                    "id": 168,
                    "name": "\u041a\u041c\u041d2",
                    "role_id": 3
                },
                {
                    "id": 169,
                    "name": "\u041c\u0412\u0410",
                    "role_id": 27
                },
                {
                    "id": 170,
                    "name": "\u0410\u0410\u0412",
                    "role_id": 12
                },
                {
                    "id": 171,
                    "name": "\u0425\u0415\u0412",
                    "role_id": 8
                },
                {
                    "id": 172,
                    "name": "\u0429\u0421\u041a",
                    "role_id": 8
                },
                {
                    "id": 173,
                    "name": "\u0414\u0412\u0418",
                    "role_id": 4
                },
                {
                    "id": 174,
                    "name": "\u0421\u0414\u0410",
                    "role_id": 8
                },
                {
                    "id": 175,
                    "name": "\u0417\u0410\u0410",
                    "role_id": 6
                },
                {
                    "id": 176,
                    "name": "\u0414\u0414\u0412",
                    "role_id": 6
                },
                {
                    "id": 177,
                    "name": "\u041a\u0421\u04102",
                    "role_id": 6
                },
                {
                    "id": 178,
                    "name": "\u0421\u041d\u041d",
                    "role_id": 6
                },
                {
                    "id": 179,
                    "name": "\u0411\u041e\u041c",
                    "role_id": 6
                },
                {
                    "id": 180,
                    "name": "\u041a\u041d\u041c",
                    "role_id": 6
                },
                {
                    "id": 181,
                    "name": "\u041f\u041f\u0421",
                    "role_id": 16
                },
                {
                    "id": 182,
                    "name": "\u0420\u0415\u042d",
                    "role_id": 5
                },
                {
                    "id": 183,
                    "name": "\u041a\u0410\u04212",
                    "role_id": 5
                },
                {
                    "id": 184,
                    "name": "\u041a\u0414\u042e",
                    "role_id": 5
                },
                {
                    "id": 185,
                    "name": "\u0410\u0410\u0410",
                    "role_id": 5
                },
                {
                    "id": 186,
                    "name": "\u0423\u0410\u041f",
                    "role_id": 5
                },
                {
                    "id": 187,
                    "name": "\u0414\u041f\u0410",
                    "role_id": 5
                },
                {
                    "id": 188,
                    "name": "\u0411\u0410\u0415",
                    "role_id": 5
                },
                {
                    "id": 189,
                    "name": "\u0411\u04121",
                    "role_id": 5
                },
                {
                    "id": 190,
                    "name": "\u0411\u041e\u0413",
                    "role_id": 5
                },
                {
                    "id": 191,
                    "name": "\u0424\u0414\u0414",
                    "role_id": 5
                },
                {
                    "id": 192,
                    "name": "\u0410\u0421\u0418",
                    "role_id": 5
                },
                {
                    "id": 193,
                    "name": "\u0413\u042e\u041c",
                    "role_id": 5
                },
                {
                    "id": 194,
                    "name": "\u041f\u0415\u0412",
                    "role_id": 5
                },
                {
                    "id": 195,
                    "name": "\u0411\u041c\u0410",
                    "role_id": 5
                },
                {
                    "id": 196,
                    "name": "\u0413\u0418\u041d2",
                    "role_id": 5
                },
                {
                    "id": 197,
                    "name": "\u041a\u0412\u0410",
                    "role_id": 5
                },
                {
                    "id": 502,
                    "name": "\u041f\u0410\u0418",
                    "role_id": 4
                },
                {
                    "id": 503,
                    "name": "SIwL",
                    "role_id": 4
                },
                {
                    "id": 504,
                    "name": "\u041c\u0410\u0412",
                    "role_id": 4
                },
                {
                    "id": 505,
                    "name": "\u0412\u0411\u0411",
                    "role_id": 22
                },
                {
                    "id": 506,
                    "name": "\u041e\u0414\u0421",
                    "role_id": 4
                },
                {
                    "id": 507,
                    "name": "\u041c\u0412\u0421",
                    "role_id": 4
                },
                {
                    "id": 508,
                    "name": "\u041b\u0418\u041d",
                    "role_id": 4
                },
                {
                    "id": 509,
                    "name": "\u0414\u041d\u0412",
                    "role_id": 4
                },
                {
                    "id": 510,
                    "name": "\u041a\u0418\u0410",
                    "role_id": 4
                },
                {
                    "id": 511,
                    "name": "\u0421\u0420",
                    "role_id": 4
                },
                {
                    "id": 512,
                    "name": "\u0414\u041d\u041d",
                    "role_id": 4
                },
                {
                    "id": 513,
                    "name": "\u041c\u041a\u041a",
                    "role_id": 4
                },
                {
                    "id": 514,
                    "name": "\u041a\u0414\u0410",
                    "role_id": 4
                },
                {
                    "id": 515,
                    "name": "\u041c\u041f\u0421",
                    "role_id": 4
                },
                {
                    "id": 516,
                    "name": "\u0420\u041a\u0420",
                    "role_id": 28
                },
                {
                    "id": 517,
                    "name": "\u041d\u0430\u0440\u043a\u0443\u043b\u043e\u0432",
                    "role_id": 29
                },
                {
                    "id": 518,
                    "name": "\u0418\u0412\u04103",
                    "role_id": 4
                },
                {
                    "id": 519,
                    "name": "\u0421\u0413\u0412",
                    "role_id": 4
                },
                {
                    "id": 520,
                    "name": "\u0413\u0410\u04122\u0441\u0442\u0430\u0440\u044b\u0439",
                    "role_id": 4
                },
                {
                    "id": 521,
                    "name": "\u0414\u0435\u0444\u043e\u043b\u0442\u043d\u044b\u0439",
                    "role_id": 4
                },
                {
                    "id": 522,
                    "name": "\u041d\u0443\u0440\u0441\u0443\u043b\u0443\u0443",
                    "role_id": 4
                },
                {
                    "id": 523,
                    "name": "\u0412\u0430\u0445\u0440\u0435\u043d\u0435\u0432",
                    "role_id": 4
                },
                {
                    "id": 524,
                    "name": "\u0412\u043b\u0430\u0441\u043e\u0432",
                    "role_id": 4
                },
                {
                    "id": 525,
                    "name": "\u041a\u0430\u043f\u043b\u0438\u043d\u0441\u043a\u0430\u044f",
                    "role_id": 4
                },
                {
                    "id": 526,
                    "name": "\u041a\u0421\u041b",
                    "role_id": 4
                },
                {
                    "id": 527,
                    "name": "\u041b\u0421\u0412",
                    "role_id": 4
                },
                {
                    "id": 528,
                    "name": "\u0428\u0418\u0412",
                    "role_id": 4
                },
                {
                    "id": 529,
                    "name": "\u0410\u0414\u0412",
                    "role_id": 28
                },
                {
                    "id": 530,
                    "name": "\u0420\u0443\u043c\u044f\u043d\u0446\u0435\u0432 ",
                    "role_id": 4
                },
                {
                    "id": 531,
                    "name": "\u041d\u043e\u0432\u043e\u0445\u0430\u0442\u0441\u043a\u0430\u044f",
                    "role_id": 4
                },
                {
                    "id": 532,
                    "name": "\u042d\u0416 1",
                    "role_id": 28
                },
                {
                    "id": 533,
                    "name": "\u0412\u0435\u043b\u0438\u043d",
                    "role_id": 4
                },
                {
                    "id": 534,
                    "name": "\u0428\u0430\u043f\u0440\u0430\u043d\u043e\u0432\u0430",
                    "role_id": 4
                },
                {
                    "id": 535,
                    "name": "\u041a\u043e\u0436\u0438\u043d",
                    "role_id": 4
                },
                {
                    "id": 536,
                    "name": "\u041c\u0415\u0421",
                    "role_id": 4
                },
                {
                    "id": 537,
                    "name": "\u041f\u041f\u041a",
                    "role_id": 4
                },
                {
                    "id": 538,
                    "name": "\u0421\u0418\u0412",
                    "role_id": 4
                },
                {
                    "id": 539,
                    "name": "\u0414\u0443\u0431\u0440\u043e\u0432\u0438\u043d",
                    "role_id": 4
                },
                {
                    "id": 540,
                    "name": "\u0410\u0414\u0410",
                    "role_id": 4
                },
                {
                    "id": 541,
                    "name": "\u0422\u0421\u0412",
                    "role_id": 4
                },
                {
                    "id": 542,
                    "name": "\u0411\u0415\u0424",
                    "role_id": 4
                },
                {
                    "id": 543,
                    "name": "\u0413\u0418\u0412",
                    "role_id": 4
                },
                {
                    "id": 544,
                    "name": "\u041d\u0414\u041d",
                    "role_id": 4
                },
                {
                    "id": 545,
                    "name": "\u041a\u0410\u04102",
                    "role_id": 4
                },
                {
                    "id": 546,
                    "name": "\u041a\u041a\u041a",
                    "role_id": 4
                },
                {
                    "id": 547,
                    "name": "1111",
                    "role_id": 4
                },
                {
                    "id": 548,
                    "name": "\u0421\u0435\u043c\u0438\u043a\u043e\u043f",
                    "role_id": 4
                },
                {
                    "id": 549,
                    "name": "\u041c\u0438\u0441\u044c\u043a\u043e",
                    "role_id": 4
                },
                {
                    "id": 550,
                    "name": "\u0412\u0418\u0412",
                    "role_id": 4
                },
                {
                    "id": 551,
                    "name": "\u0421\u0420\u0410\u041e",
                    "role_id": 4
                },
                {
                    "id": 552,
                    "name": "\u0420\u0412\u041d",
                    "role_id": 4
                },
                {
                    "id": 553,
                    "name": "\u0421\u0422\u0414",
                    "role_id": 4
                },
                {
                    "id": 554,
                    "name": "\u0428\u041d\u0418",
                    "role_id": 4
                },
                {
                    "id": 555,
                    "name": "\u041a\u0412\u0418",
                    "role_id": 4
                },
                {
                    "id": 556,
                    "name": "\u0427\u042e\u0414",
                    "role_id": 17
                },
                {
                    "id": 557,
                    "name": "\u0421\u0421\u0418",
                    "role_id": 4
                },
                {
                    "id": 558,
                    "name": "\u041a\u0412\u0421",
                    "role_id": 4
                },
                {
                    "id": 559,
                    "name": "\u0425\u0412\u0410",
                    "role_id": 4
                },
                {
                    "id": 560,
                    "name": "\u041f\u0412\u0410",
                    "role_id": 4
                },
                {
                    "id": 561,
                    "name": "\u041d\u0410\u0424",
                    "role_id": 4
                },
                {
                    "id": 562,
                    "name": "\u041a\u0418\u04122",
                    "role_id": 4
                },
                {
                    "id": 563,
                    "name": "\u041e\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 564,
                    "name": "\u0421\u0414\u0412",
                    "role_id": 4
                },
                {
                    "id": 565,
                    "name": "\u042f\u0414\u0421",
                    "role_id": 4
                },
                {
                    "id": 566,
                    "name": "\u0428\u0421\u04102",
                    "role_id": 4
                },
                {
                    "id": 567,
                    "name": "\u0428\u0410\u0421",
                    "role_id": 4
                },
                {
                    "id": 568,
                    "name": "\u0421\u0412\u04102",
                    "role_id": 4
                },
                {
                    "id": 630,
                    "name": "\u041f\u0412\u041d",
                    "role_id": 4
                },
                {
                    "id": 631,
                    "name": "\u041c\u0415\u04212",
                    "role_id": 4
                },
                {
                    "id": 632,
                    "name": "\u0424\u0410\u0412",
                    "role_id": 4
                },
                {
                    "id": 633,
                    "name": "\u041c\u041c\u0418",
                    "role_id": 4
                },
                {
                    "id": 634,
                    "name": "\u0411\u0414\u0412",
                    "role_id": 4
                },
                {
                    "id": 635,
                    "name": "\u041a\u0410\u04213",
                    "role_id": 4
                },
                {
                    "id": 636,
                    "name": "\u0428\u0410\u041f2",
                    "role_id": 4
                },
                {
                    "id": 637,
                    "name": "\u0428\u0410\u041f",
                    "role_id": 4
                },
                {
                    "id": 638,
                    "name": "\u041a\u0421\u0415",
                    "role_id": 4
                },
                {
                    "id": 639,
                    "name": "\u0421\u041a\u0410",
                    "role_id": 4
                },
                {
                    "id": 640,
                    "name": "\u041f\u0420\u0413",
                    "role_id": 4
                },
                {
                    "id": 646,
                    "name": "11111111",
                    "role_id": 5
                },
                {
                    "id": 649,
                    "name": "\u0411\u0414\u0410",
                    "role_id": 4
                },
                {
                    "id": 650,
                    "name": "\u0412\u0415\u0410",
                    "role_id": 4
                },
                {
                    "id": 651,
                    "name": "\u0422\u0412\u041f",
                    "role_id": 22
                },
                {
                    "id": 652,
                    "name": "\u0421\u0421\u0410",
                    "role_id": 4
                },
                {
                    "id": 653,
                    "name": "\u041f\u041c\u04212",
                    "role_id": 4
                },
                {
                    "id": 654,
                    "name": "\u0410\u041a\u0410",
                    "role_id": 22
                },
                {
                    "id": 655,
                    "name": "\u041a\u0414\u041f",
                    "role_id": 4
                },
                {
                    "id": 656,
                    "name": "\u0411\u0422\u0420",
                    "role_id": 4
                },
                {
                    "id": 657,
                    "name": "\u041a\u0414\u0412",
                    "role_id": 4
                },
                {
                    "id": 658,
                    "name": "\u0422\u0443\u0411",
                    "role_id": 28
                },
                {
                    "id": 659,
                    "name": "\u041c\u0412\u042e",
                    "role_id": 28
                },
                {
                    "id": 660,
                    "name": "\u0417\u0410\u0420",
                    "role_id": 4
                },
                {
                    "id": 661,
                    "name": "\u0425\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 662,
                    "name": "\u041c\u042e\u0412",
                    "role_id": 4
                },
                {
                    "id": 663,
                    "name": "\u0421\u042d\u0415",
                    "role_id": 4
                },
                {
                    "id": 664,
                    "name": "\u0422\u0415\u0421\u0422",
                    "role_id": 4
                },
                {
                    "id": 665,
                    "name": "\u0427\u0410\u041d2",
                    "role_id": 4
                },
                {
                    "id": 666,
                    "name": "\u0422\u041c\u04102",
                    "role_id": 4
                },
                {
                    "id": 668,
                    "name": "\u0428\u0421\u0410",
                    "role_id": 4
                },
                {
                    "id": 669,
                    "name": "\u0427\u0415\u0410",
                    "role_id": 4
                },
                {
                    "id": 670,
                    "name": "\u0414\u042d\u0412",
                    "role_id": 4
                },
                {
                    "id": 671,
                    "name": "\u0410\u041a\u041f",
                    "role_id": 4
                },
                {
                    "id": 672,
                    "name": "\u0417\u0418\u0410",
                    "role_id": 4
                },
                {
                    "id": 673,
                    "name": "\u041a\u041d\u0421",
                    "role_id": 17
                },
                {
                    "id": 674,
                    "name": "\u0428\u0410\u0411",
                    "role_id": 4
                },
                {
                    "id": 675,
                    "name": "\u041e\u0412\u0412",
                    "role_id": 4
                },
                {
                    "id": 676,
                    "name": "\u042e\u0418\u0410",
                    "role_id": 4
                },
                {
                    "id": 677,
                    "name": "\u041a\u0418\u0421",
                    "role_id": 4
                },
                {
                    "id": 678,
                    "name": "\u041c\u0410\u0422",
                    "role_id": 4
                },
                {
                    "id": 679,
                    "name": "admin",
                    "role_id": 30
                },
                {
                    "id": 680,
                    "name": "\u041f\u0415\u041d",
                    "role_id": 4
                },
                {
                    "id": 681,
                    "name": "\u0420\u0410\u0410 ",
                    "role_id": 4
                },
                {
                    "id": 682,
                    "name": "\u041a\u0412\u0412",
                    "role_id": 4
                },
                {
                    "id": 683,
                    "name": "\u0420\u0410\u0421",
                    "role_id": 28
                },
                {
                    "id": 684,
                    "name": "\u0421\u0412\u04121",
                    "role_id": 22
                },
                {
                    "id": 685,
                    "name": "\u041b\u0410\u0412",
                    "role_id": 4
                },
                {
                    "id": 686,
                    "name": "\u041d\u041c\u0412",
                    "role_id": 4
                },
                {
                    "id": 687,
                    "name": "\u042f\u0414\u0410",
                    "role_id": 4
                },
                {
                    "id": 688,
                    "name": "\u0425\u0413\u0420",
                    "role_id": 4
                },
                {
                    "id": 689,
                    "name": "\u041d\u0412\u0412",
                    "role_id": 4
                },
                {
                    "id": 690,
                    "name": "\u0411\u0414\u04122",
                    "role_id": 4
                },
                {
                    "id": 691,
                    "name": "\u041d\u0421\u0410",
                    "role_id": 4
                },
                {
                    "id": 692,
                    "name": "\u041a\u0414\u04122",
                    "role_id": 4
                },
                {
                    "id": 693,
                    "name": "\u0427\u0421\u0412",
                    "role_id": 4
                },
                {
                    "id": 694,
                    "name": "\u0410\u0414\u04122",
                    "role_id": 17
                },
                {
                    "id": 695,
                    "name": "\u041b\u0414\u041d",
                    "role_id": 4
                },
                {
                    "id": 696,
                    "name": "\u0411\u0414\u0413",
                    "role_id": 4
                },
                {
                    "id": 697,
                    "name": "\u0418\u041c\u042e",
                    "role_id": 4
                },
                {
                    "id": 698,
                    "name": "\u041b\u0420\u0412",
                    "role_id": 4
                },
                {
                    "id": 699,
                    "name": "\u0428\u0413\u0411",
                    "role_id": 4
                },
                {
                    "id": 703,
                    "name": "\u0413\u041c\u04212",
                    "role_id": 4
                },
                {
                    "id": 704,
                    "name": "\u041c\u0415\u042e",
                    "role_id": 4
                },
                {
                    "id": 705,
                    "name": "\u0428\u0413\u0418",
                    "role_id": 4
                },
                {
                    "id": 706,
                    "name": "\u0413\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 707,
                    "name": "\u0410\u0410\u0413",
                    "role_id": 4
                },
                {
                    "id": 708,
                    "name": "\u041f\u041c\u0412",
                    "role_id": 4
                },
                {
                    "id": 710,
                    "name": "\u0421\u0418\u041d2",
                    "role_id": 4
                },
                {
                    "id": 711,
                    "name": "\u0421\u0421\u042d",
                    "role_id": 4
                },
                {
                    "id": 712,
                    "name": "\u041f\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 713,
                    "name": "\u0415\u0415\u041d",
                    "role_id": 4
                },
                {
                    "id": 714,
                    "name": "\u041a\u0410\u0412",
                    "role_id": 4
                },
                {
                    "id": 715,
                    "name": "\u041c\u041c\u0421",
                    "role_id": 4
                },
                {
                    "id": 716,
                    "name": "\u0428\u0420\u0428",
                    "role_id": 4
                },
                {
                    "id": 717,
                    "name": "\u041a\u0414\u04123",
                    "role_id": 4
                },
                {
                    "id": 718,
                    "name": "\u0422\u0410\u042e",
                    "role_id": 4
                },
                {
                    "id": 719,
                    "name": "\u0424\u0422\u0420",
                    "role_id": 4
                },
                {
                    "id": 720,
                    "name": "\u0422\u0410\u0412",
                    "role_id": 4
                },
                {
                    "id": 721,
                    "name": "\u041c\u041b\u041c",
                    "role_id": 4
                },
                {
                    "id": 722,
                    "name": "\u0413\u0414\u041c",
                    "role_id": 28
                },
                {
                    "id": 723,
                    "name": "\u0422\u041c\u0412",
                    "role_id": 4
                },
                {
                    "id": 724,
                    "name": "\u041c\u0430\u0440\u0438",
                    "role_id": 4
                },
                {
                    "id": 725,
                    "name": "\u041a\u0410\u041d",
                    "role_id": 4
                },
                {
                    "id": 726,
                    "name": "\u0420\u0414\u0410",
                    "role_id": 4
                },
                {
                    "id": 727,
                    "name": "\u0417\u0418\u04102",
                    "role_id": 4
                },
                {
                    "id": 728,
                    "name": "\u0422\u0418\u0414",
                    "role_id": 4
                },
                {
                    "id": 729,
                    "name": "\u0411\u0410\u04125",
                    "role_id": 28
                },
                {
                    "id": 730,
                    "name": "vbb.atlonfm@gmail.com",
                    "role_id": 1
                },
                {
                    "id": 731,
                    "name": "\u0421\u0410\u04122",
                    "role_id": 4
                },
                {
                    "id": 732,
                    "name": "\u0422\u0410\u0413",
                    "role_id": 4
                },
                {
                    "id": 733,
                    "name": "\u041b\u0410\u041e",
                    "role_id": 4
                },
                {
                    "id": 734,
                    "name": "\u0411\u041c\u0411",
                    "role_id": 4
                },
                {
                    "id": 735,
                    "name": "\u0420\u0438\u043d\u0430\u0442 1\u0441",
                    "role_id": 22
                },
                {
                    "id": 736,
                    "name": "\u041b\u0421\u041b",
                    "role_id": 4
                },
                {
                    "id": 737,
                    "name": "\u041a\u0420\u0410",
                    "role_id": 4
                },
                {
                    "id": 738,
                    "name": "\u0411\u0410\u04126",
                    "role_id": 4
                },
                {
                    "id": 739,
                    "name": "KMM",
                    "role_id": 4
                },
                {
                    "id": 740,
                    "name": "\u0411\u0418\u0421",
                    "role_id": 4
                },
                {
                    "id": 741,
                    "name": "\u041a\u0410\u04104",
                    "role_id": 4
                },
                {
                    "id": 742,
                    "name": "\u0411\u0410\u04127",
                    "role_id": 4
                },
                {
                    "id": 743,
                    "name": "\u0421\u0410\u041d",
                    "role_id": 4
                },
                {
                    "id": 746,
                    "name": "\u041a\u0412\u0424",
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
                    "name": "\u041c\u0415\u0412",
                    "role_id": 4
                },
                {
                    "id": 750,
                    "name": "\u0414\u0414\u042d",
                    "role_id": 4
                },
                {
                    "id": 751,
                    "name": "\u0420\u042e\u0412",
                    "role_id": 4
                },
                {
                    "id": 752,
                    "name": "\u0410\u041c\u0410",
                    "role_id": 4
                },
                {
                    "id": 753,
                    "name": "\u0417\u0412\u0415",
                    "role_id": 4
                },
                {
                    "id": 754,
                    "name": "\u041d\u042d\u0410",
                    "role_id": 4
                },
                {
                    "id": 755,
                    "name": "\u0410\u0412\u0410",
                    "role_id": 28
                },
                {
                    "id": 756,
                    "name": "\u041a\u041f\u0412",
                    "role_id": 4
                },
                {
                    "id": 757,
                    "name": "lesyabanks@gmail.com",
                    "role_id": 22
                },
                {
                    "id": 758,
                    "name": "\u0428\u041e\u041a",
                    "role_id": 4
                },
                {
                    "id": 759,
                    "name": "\u041c\u0418\u0421",
                    "role_id": 4
                },
                {
                    "id": 760,
                    "name": "\u0410\u041c\u041e",
                    "role_id": 2
                },
                {
                    "id": 761,
                    "name": "\u0410\u041d\u042e",
                    "role_id": 4
                },
                {
                    "id": 764,
                    "name": "\u0413\u0414\u0412",
                    "role_id": 4
                },
                {
                    "id": 765,
                    "name": "\u042f\u0410\u0414",
                    "role_id": 4
                },
                {
                    "id": 766,
                    "name": "\u0411\u041f\u041a",
                    "role_id": 4
                },
                {
                    "id": 767,
                    "name": "\u0411\u0410\u0425",
                    "role_id": 4
                },
                {
                    "id": 768,
                    "name": "SAB",
                    "role_id": 2
                },
                {
                    "id": 769,
                    "name": "\u0425\u0420\u041b",
                    "role_id": 4
                },
                {
                    "id": 770,
                    "name": "\u0415\u0410\u041d",
                    "role_id": 4
                },
                {
                    "id": 771,
                    "name": "\u042e\u0417\u0420",
                    "role_id": 17
                },
                {
                    "id": 772,
                    "name": "\u0420\u0410\u04102",
                    "role_id": 6
                },
                {
                    "id": 773,
                    "name": "\u041b\u0414\u0421",
                    "role_id": 4
                },
                {
                    "id": 774,
                    "name": "TEST",
                    "role_id": 1
                },
                {
                    "id": 777,
                    "name": "\u041c\u0430\u0441\u0442\u0435\u0440 1",
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
                    "name": "\u0420\u0435\u0431\u0440\u043e\u0432 \u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440 \u0410\u043b\u0435\u043a\u0441\u0435\u0435\u0432\u0438\u0447 \u0420\u0410",
                    "role_id": 1
                },
                {
                    "id": 784,
                    "name": "\u0424\u0422\u0410",
                    "role_id": 22
                },
                {
                    "id": 785,
                    "name": "\u0422\u041c\u041d",
                    "role_id": 4
                },
                {
                    "id": 786,
                    "name": "\u0423\u043c\u0438\u0434",
                    "role_id": 1
                },
                {
                    "id": 787,
                    "name": "\u0414\u0412\u041e",
                    "role_id": 4
                },
                {
                    "id": 788,
                    "name": "\u0422\u0410\u04102",
                    "role_id": 4
                },
                {
                    "id": 789,
                    "name": "\u041a\u0421\u0422",
                    "role_id": 4
                },
                {
                    "id": 790,
                    "name": "\u0412\u0410\u0410",
                    "role_id": 4
                },
                {
                    "id": 791,
                    "name": "\u0422\u0410\u042d",
                    "role_id": 2
                },
                {
                    "id": 792,
                    "name": "\u0417\u0418\u0412",
                    "role_id": 22
                },
                {
                    "id": 793,
                    "name": "\u0410\u0440\u0442\u0443\u0440",
                    "role_id": 1
                },
                {
                    "id": 794,
                    "name": "\u041f\u0420\u0412",
                    "role_id": 4
                },
                {
                    "id": 795,
                    "name": "\u0410\u0420\u0410",
                    "role_id": 4
                },
                {
                    "id": 100000,
                    "name": "\u0420\u0435\u043d\u0430\u0442",
                    "role_id": 1000
                },
                {
                    "id": 100001,
                    "name": "\u041a\u043e\u043d\u0442\u0430\u043a\u0442 22",
                    "role_id": 1000
                }
            ],
            "tasks": {
                "statuses": [
                    {
                        "code": 1,
                        "name": "\u041d\u043e\u0432\u0430\u044f"
                    },
                    {
                        "code": 2,
                        "name": "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435"
                    },
                    {
                        "code": 3,
                        "name": "\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0430"
                    },
                    {
                        "code": 4,
                        "name": "\u041e\u0442\u043c\u0435\u043d\u0435\u043d\u0430"
                    },
                    {
                        "code": 999,
                        "name": "\u0412 \u0430\u0440\u0445\u0438\u0432\u0435"
                    }
                ],
                "types": [
                    {
                        "code": 1,
                        "name": "\u0417\u0432\u043e\u043d\u043e\u043a"
                    },
                    {
                        "code": 2,
                        "name": "\u0417\u0430\u043c\u0435\u0440"
                    },
                    {
                        "code": 999,
                        "name": "\u041f\u0440\u043e\u0447\u0435\u0435"
                    }
                ]
            },
            "pipelines": {
                "1": {
                    "id": 1,
                    "name": "\u041e\u0442\u0434\u0435\u043b\u043a\u0430 \u043a\u0432\u0430\u0440\u0442\u0438\u0440",
                    "archive": false,
                    "stages": {
                        "1": {
                            "id": 1,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#e6e8ea"
                        },
                        "2": {
                            "id": 2,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "3": {
                            "id": 3,
                            "title": "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f (\u0432\u0437\u044f\u0442 \u0432 \u0440\u0430\u0431\u043e\u0442\u0443)",
                            "color": "#fffd7f"
                        },
                        "4": {
                            "id": 4,
                            "title": "\u041e\u0442\u043a\u0430\u0437 \u043e\u0442 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0441\u0442\u0432\u0430 (\u041d\u043e\u0432\u044b\u0439 \u0440\u0435\u0433\u043b\u0430\u043c\u0435\u043d\u0442)",
                            "color": "#ffc8c8"
                        },
                        "5": {
                            "id": 5,
                            "title": "\u0421\u043f\u0430\u043c",
                            "color": "#99ccff"
                        },
                        "6": {
                            "id": 6,
                            "title": "\u0414\u0443\u043c\u0430\u044e\u0442 \u043f\u043e\u043a\u0443\u043f\u0430\u0442\u044c \u0436\u0438\u043b\u044c\u0435",
                            "color": "#99ccff"
                        },
                        "7": {
                            "id": 7,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#99ccff"
                        },
                        "8": {
                            "id": 8,
                            "title": "\u043e\u0442\u043b\u043e\u0436\u0435\u043d\u043d\u044b\u0435 \u0436\u0434\u0443\u0442 \u043a\u043b\u044e\u0447\u0438",
                            "color": "#c1e0ff"
                        },
                        "9": {
                            "id": 9,
                            "title": "\u0414\u0443\u043c\u0430\u044e\u0442 \u0441\u0432\u044f\u0437\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u041c\u0435\u0441\u0441\u0435\u043d\u0434\u0436\u0435\u0440\u044b",
                            "color": "#99ccff"
                        },
                        "10": {
                            "id": 10,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442\/\u0412 \u0440\u0430\u0431\u043e\u0442\u0435 \u0443 \u043e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u0430",
                            "color": "#ffeab2"
                        },
                        "11": {
                            "id": 11,
                            "title": "\u041f\u0435\u0440\u0435\u0437\u0432\u043e\u043d\u0438\u0442\u044c \u041d\u0430 \u0437\u0430\u043c\u0435\u0440 (\u0433\u043e\u0440\u044f\u0447\u0438\u0435)",
                            "color": "#fffd7f"
                        },
                        "12": {
                            "id": 12,
                            "title": "\u0432\u044b\u0435\u0437\u0434 \u0437\u0430\u043c\u0435\u0440\u0449\u0438\u043a\u0430",
                            "color": "#ffce5a"
                        },
                        "13": {
                            "id": 13,
                            "title": "\u0414\u0438\u0437\u0430\u0439\u043d \u0440\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                            "color": "#ffc8c8"
                        },
                        "14": {
                            "id": 14,
                            "title": "\u0412\u0441\u0442\u0440\u0435\u0447\u0430 \u0414\u0438\u0437\u0430\u0439\u043d",
                            "color": "#99ccff"
                        },
                        "15": {
                            "id": 15,
                            "title": "\u0414\u043e\u0433\u043e\u0432\u043e\u0440 \u0414\u0438\u0437\u0430\u0439\u043d",
                            "color": "#deff81"
                        },
                        "16": {
                            "id": 16,
                            "title": "\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0441\u0447\u0435\u0442",
                            "color": "#99ccff"
                        },
                        "17": {
                            "id": 17,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0417\u0410\u041c\u0415\u0420\u0429\u0418\u041a\u0410 \u0420\u0410\u0421\u041f\u0420\u0415\u0414\u0415\u041b\u0415\u041d\u0418\u0415",
                            "color": "#ffc8c8"
                        },
                        "18": {
                            "id": 18,
                            "title": "\u0432 \u043d\u043e\u0432\u043e\u0439 \u0441\u0440\u043c",
                            "color": "#ebffb1"
                        },
                        "19": {
                            "id": 19,
                            "title": "\u0420\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d",
                            "color": "#d6eaff"
                        },
                        "20": {
                            "id": 20,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u043d\u0435 \u0441\u043e\u0441\u0442\u043e\u044f\u043b\u0441\u044f \u041e\u043f\u0435\u0440\u0430\u0442\u043e\u0440",
                            "color": "#ffc8c8"
                        },
                        "21": {
                            "id": 21,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u043d\u0435 \u0441\u043e\u0441\u0442\u043e\u044f\u043b\u0441\u044f \u0437\u0430\u043c\u0435\u0440\u0449\u0438\u043a",
                            "color": "#ff8f92"
                        },
                        "22": {
                            "id": 22,
                            "title": "\u0425\u043e\u043b\u043e\u0441\u0442\u043e\u0439",
                            "color": "#ffdc7f"
                        },
                        "23": {
                            "id": 23,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0441\u043e\u0441\u0442\u043e\u044f\u043b\u0441\u044f",
                            "color": "#ccc8f9"
                        },
                        "24": {
                            "id": 24,
                            "title": "\u0441\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u0442\u044c \u0441\u043c\u0435\u0442\u0443",
                            "color": "#fff000"
                        },
                        "25": {
                            "id": 25,
                            "title": "\u0412\u043e\u0437\u0432\u0440\u0430\u0442 \u043d\u0430 \u0434\u043e\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u0420\u041e\u041f\u0443",
                            "color": "#99ccff"
                        },
                        "26": {
                            "id": 26,
                            "title": "\u0412\u044b\u0434\u0430\u043d\u043e \u0432 \u0440\u0430\u0431\u043e\u0442\u0443",
                            "color": "#99ccff"
                        },
                        "27": {
                            "id": 27,
                            "title": "\u0437\u0430\u043c\u043e\u0440\u043e\u0437\u043a\u0430 \u041e\u041f",
                            "color": "#99ccff"
                        },
                        "28": {
                            "id": 28,
                            "title": "\u0417\u0430\u043f\u0443\u0441\u043a \u041e\u0431\u044a\u0435\u043a\u0442\u0430 \u0418\u0412\u0410",
                            "color": "#fffd7f"
                        },
                        "29": {
                            "id": 29,
                            "title": "\u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0440\u0435\u043c\u043e\u043d\u0442 \u0418\u0412\u0410",
                            "color": "#87f2c0"
                        },
                        "30": {
                            "id": 30,
                            "title": "\u0417\u0430\u043f\u0443\u0441\u043a \u043e\u0431\u044a\u0435\u043a\u0442\u0430 \u041c\u0414\u0410",
                            "color": "#fffd7f"
                        },
                        "31": {
                            "id": 31,
                            "title": "\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0440\u0435\u043c\u043e\u043d\u0442 \u041c\u0414\u0410",
                            "color": "#87f2c0"
                        },
                        "32": {
                            "id": 32,
                            "title": "\u0417\u0430\u043f\u0443\u0441\u043a \u043e\u0431\u044a\u0435\u043a\u0442\u0430 \u041a\u041c\u041f",
                            "color": "#fffeb2"
                        },
                        "33": {
                            "id": 33,
                            "title": "\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0440\u0435\u043c\u043e\u043d\u0442 \u041a\u041c\u041f",
                            "color": "#87f2c0"
                        },
                        "34": {
                            "id": 34,
                            "title": "\u0417\u0430\u043f\u0443\u0441\u043a \u043e\u0431\u044a\u0435\u043a\u0442\u0430 \u041c\u0421\u041f",
                            "color": "#fffeb2"
                        },
                        "35": {
                            "id": 35,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u041c\u0421\u041f",
                            "color": "#87f2c0"
                        },
                        "36": {
                            "id": 36,
                            "title": "\u0417\u0410\u041f\u0423\u0421\u041a \u041e\u0411\u042a\u0415\u041a\u0422\u0410 \u0411\u0421\u0410",
                            "color": "#fffeb2"
                        },
                        "37": {
                            "id": 37,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u0411\u0421\u0410",
                            "color": "#87f2c0"
                        },
                        "38": {
                            "id": 38,
                            "title": "\u0417\u0410\u041c\u041e\u0420\u041e\u0417\u041a\u0410",
                            "color": "#99ccff"
                        },
                        "39": {
                            "id": 39,
                            "title": "\u0437\u0430\u043a\u0440\u044b\u0442\u043e \u043d\u0435\u0442 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432",
                            "color": "#99ccff"
                        },
                        "40": {
                            "id": 40,
                            "title": "\u042e\u0420. \u041e\u0422\u0414\u0415\u041b",
                            "color": "#99ccff"
                        },
                        "41": {
                            "id": 41,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "42": {
                            "id": 42,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "2": {
                    "id": 2,
                    "name": "\u0414\u0438\u0437\u0430\u0439\u043d",
                    "archive": false,
                    "stages": {
                        "43": {
                            "id": 43,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#e6e8ea"
                        },
                        "44": {
                            "id": 44,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "45": {
                            "id": 45,
                            "title": "\u041d\u043e\u0432\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430 \u0434\u0438\u0437\u0430\u0439\u043d",
                            "color": "#fffd7f"
                        },
                        "46": {
                            "id": 46,
                            "title": "\u0417\u0430\u044f\u0432\u043a\u0430 \u043d\u0430 \u0434\u0438\u0437\u0430\u0439\u043d",
                            "color": "#eb93ff"
                        },
                        "47": {
                            "id": 47,
                            "title": "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435",
                            "color": "#99ccff"
                        },
                        "48": {
                            "id": 48,
                            "title": "\u0414\u043e\u0433\u043e\u0432\u043e\u0440 \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d",
                            "color": "#fffeb2"
                        },
                        "49": {
                            "id": 49,
                            "title": "1 \u044d\u0442\u0430\u043f",
                            "color": "#99ccff"
                        },
                        "50": {
                            "id": 50,
                            "title": "2 \u044d\u0442\u0430\u043f",
                            "color": "#99ccff"
                        },
                        "51": {
                            "id": 51,
                            "title": "3 \u044d\u0442\u0430\u043f",
                            "color": "#99ccff"
                        },
                        "52": {
                            "id": 52,
                            "title": "\u0420\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#99ccff"
                        },
                        "53": {
                            "id": 53,
                            "title": "\u0421\u0442\u0430\u0440\u044b\u0435 \u0434\u043e\u0433\u043e\u0432\u043e\u0440\u0430",
                            "color": "#f9deff"
                        },
                        "54": {
                            "id": 54,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "55": {
                            "id": 55,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "3": {
                    "id": 3,
                    "name": "\u041d\u0435\u0446\u0435\u043b\u0435\u0432\u044b\u0435",
                    "archive": false,
                    "stages": {
                        "56": {
                            "id": 56,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "57": {
                            "id": 57,
                            "title": "\u041d\u0435\u0446\u0435\u043b\u0435\u0432\u044b\u0435 \u0434\u0440\u0443\u0433\u043e\u0435",
                            "color": "#99ccff"
                        },
                        "58": {
                            "id": 58,
                            "title": "\u041d\u0435\u0446\u0435\u043b\u0435\u0432\u044b\u0435 \u043f\u043e \u043c\u0438\u043d\u0438\u043c\u0430\u043b\u043a\u0435",
                            "color": "#99ccff"
                        },
                        "59": {
                            "id": 59,
                            "title": "\u041d\u0435\u0446\u0435\u043b\u0435\u0432\u044b\u0435 \u043f\u0440\u043e\u0434\u0430\u0436\u0430 \u043a\u0432\u0430\u0440\u0442\u0438\u0440\u044b",
                            "color": "#99ccff"
                        },
                        "60": {
                            "id": 60,
                            "title": "\u041f\u043e \u0440\u0430\u0431\u043e\u0442\u0435",
                            "color": "#ffff99"
                        },
                        "61": {
                            "id": 61,
                            "title": "\u041f\u043e \u0440\u0430\u0431\u043e\u0442\u0435 \u043f\u0440\u043e\u0437\u0432\u043e\u043d\u0438\u043b\u0438",
                            "color": "#ffc8c8"
                        },
                        "62": {
                            "id": 62,
                            "title": "\u041d\u0435\u0446\u0435\u043b\u0435\u0432\u044b\u0435 \u043d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#c1e0ff"
                        },
                        "63": {
                            "id": 63,
                            "title": "\u041d\u0435\u0446\u0435\u043b\u0435\u0432\u044b\u0435 \u043f\u043e \u0443\u0434\u0430\u043b\u0435\u043d\u043d\u043e\u0441\u0442\u0438",
                            "color": "#99ccff"
                        },
                        "64": {
                            "id": 64,
                            "title": "\u0425\u043e\u043b\u043e\u0441\u0442\u043e\u0439 \u0432\u044b\u0435\u0437\u0434 \u0437\u0430\u043c\u0435\u0440",
                            "color": "#ffce5a"
                        },
                        "65": {
                            "id": 65,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "66": {
                            "id": 66,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "4": {
                    "id": 4,
                    "name": "\u0425\u043e\u043b\u043e\u0434\u043d\u044b\u0435",
                    "archive": false,
                    "stages": {
                        "67": {
                            "id": 67,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "68": {
                            "id": 68,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u043d\u043e\u0432\u043e\u0435",
                            "color": "#99ccff"
                        },
                        "69": {
                            "id": 69,
                            "title": "\u041e\u0444\u0438\u0441 \u0432\u044b\u0432\u0435\u0441\u0442\u0438 \u043d\u0430 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#f9deff"
                        },
                        "70": {
                            "id": 70,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#d6eaff"
                        },
                        "71": {
                            "id": 71,
                            "title": "\u041d\u0435 \u0446\u0435\u043b\u0435\u0432\u043e\u0439",
                            "color": "#99ccff"
                        },
                        "72": {
                            "id": 72,
                            "title": "\u0426\u0435\u043b\u0435\u0432\u044b\u0435 \u043e\u0442 \u043e\u0444\u0438\u0441\u0430!",
                            "color": "#deff81"
                        },
                        "73": {
                            "id": 73,
                            "title": "\u041d\u0426 \u0443\u0436\u0435 \u0434\u0435\u043b\u0430\u044e\u0442\u00a0\u0440\u0435\u043c\u043e\u043d\u0442",
                            "color": "#99ccff"
                        },
                        "74": {
                            "id": 74,
                            "title": "\u041d\u0435 \u0426\u0435\u043b\u0435\u0432\u043e\u0439 \u043f\u043e \u043c\u0438\u043d\u0438\u043c\u0430\u043b\u043a\u0435",
                            "color": "#99ccff"
                        },
                        "75": {
                            "id": 75,
                            "title": "\u041e\u0442\u043a\u0430\u0437 \u043e\u0442 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0441\u0442\u0432\u0430 (\u041d\u043e\u0432\u044b\u0439 \u0440\u0435\u0433\u043b\u0430\u043c\u0435\u043d\u0442)",
                            "color": "#ffc8c8"
                        },
                        "76": {
                            "id": 76,
                            "title": "\u041d\u0435 \u0426\u0435\u043b\u0435\u0432\u043e\u0439 \u043d\u0438\u043a\u043e\u0433\u0434\u0430 \u041d\u0414\u0417",
                            "color": "#99ccff"
                        },
                        "77": {
                            "id": 77,
                            "title": "\u041d\u0435 \u0426\u0435\u043b\u0435\u0432\u043e\u0439 \u041d\u0414\u0417( \u043f\u043e\u0441\u043b\u0435 \u0434\u0443\u043c\u0430\u0435\u0442)",
                            "color": "#ccc8f9"
                        },
                        "78": {
                            "id": 78,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442 \u041d\u0414\u0417",
                            "color": "#ffeab2"
                        },
                        "79": {
                            "id": 79,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442 \u0432 \u0440\u0430\u0441\u0441\u044b\u043b\u043a\u0443 \u0441\u043c\u0441",
                            "color": "#fffeb2"
                        },
                        "80": {
                            "id": 80,
                            "title": "\u041d\u0435\u0442 \u043a\u043b\u044e\u0447\u0435\u0439",
                            "color": "#f3beff"
                        },
                        "81": {
                            "id": 81,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442 \u0441\u0440\u043e\u043a \u043d\u0435 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d",
                            "color": "#87f2c0"
                        },
                        "82": {
                            "id": 82,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442",
                            "color": "#fffeb2"
                        },
                        "83": {
                            "id": 83,
                            "title": "\u041f\u0435\u0440\u0435\u0437\u0432\u043e\u043d\u0438\u0442\u044c \u043d\u0430 \u0437\u0430\u043c\u0435\u0440 \u0413\u043e\u0440\u044f\u0447\u0438\u0435",
                            "color": "#deff81"
                        },
                        "84": {
                            "id": 84,
                            "title": "\u0432\u044b\u0435\u0437\u0434 \u0434\u0438\u0437\u0430\u0439\u043d (\u043f\u0435\u0440\u0435\u043d\u0435\u0441\u0442\u0438 \u0432 \u043e\u0442\u0434\u0435\u043b\u043a\u0443)",
                            "color": "#99ccff"
                        },
                        "85": {
                            "id": 85,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0417\u0430\u043c\u0435\u0440\u0449\u0438\u043a\u0430 (\u043f\u0435\u0440\u0435\u043d\u0435\u0441\u0442\u0438 \u0432 \u043e\u0442\u0434\u0435\u043b\u043a\u0443)",
                            "color": "#ffce5a"
                        },
                        "86": {
                            "id": 86,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "87": {
                            "id": 87,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "5": {
                    "id": 5,
                    "name": "\u041d\u0435\u0434\u0432\u0438\u0436\u0438\u043c\u043e\u0441\u0442\u044c \u0412\u0442\u043e\u0440\u0438\u0447\u043a\u0430",
                    "archive": false,
                    "stages": {
                        "88": {
                            "id": 88,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "89": {
                            "id": 89,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#e6e8ea"
                        },
                        "90": {
                            "id": 90,
                            "title": "\u0412\u0437\u044f\u043b \u0432 \u0440\u0430\u0431\u043e\u0442\u0443",
                            "color": "#99ccff"
                        },
                        "91": {
                            "id": 91,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#d6eaff"
                        },
                        "92": {
                            "id": 92,
                            "title": "\u041f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u044b",
                            "color": "#ffff99"
                        },
                        "93": {
                            "id": 93,
                            "title": "\u0420\u0430\u0437\u043c\u0435\u0441\u0442\u0438\u043b\u0438 \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u0435 ( \u0440\u0435\u043a\u043b\u0430\u043c\u0443)",
                            "color": "#87f2c0"
                        },
                        "94": {
                            "id": 94,
                            "title": "\u041e\u0442\u043a\u0430\u0437 \u043e\u0442 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0432\u0430",
                            "color": "#99ccff"
                        },
                        "95": {
                            "id": 95,
                            "title": "\u041e\u0442\u043a\u0430\u0437 (\u041f\u0440\u043e\u0434\u0430\u043b\u0438 \u0441\u0430\u043c\u0438)",
                            "color": "#ff8f92"
                        },
                        "96": {
                            "id": 96,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u0430\u044f \u0441\u0434\u0435\u043b\u043a\u0430",
                            "color": "#deff81"
                        },
                        "97": {
                            "id": 97,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "98": {
                            "id": 98,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "6": {
                    "id": 6,
                    "name": "\u0412\u043e\u0440\u043e\u043d\u043a\u0430 \"\u0421\u043f\u0435\u0446\u043d\u043e\u0432\u043e\u0441\u0442\u0440\u043e\u0439\"",
                    "archive": false,
                    "stages": {
                        "99": {
                            "id": 99,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "100": {
                            "id": 100,
                            "title": "\u041a\u0412\u0410\u041b\u0418\u0424\u0418\u041a\u0410\u0426\u0418\u042f (\u0412\u0417\u042f\u0422 \u0412 \u0420\u0410\u0411\u041e\u0422\u0423)",
                            "color": "#fffd7f"
                        },
                        "101": {
                            "id": 101,
                            "title": "\u041d\u0415\u0414\u041e\u0417\u0412\u041e\u041d",
                            "color": "#c1e0ff"
                        },
                        "102": {
                            "id": 102,
                            "title": "\u041e\u0422\u041b\u041e\u0416\u0415\u041d\u041d\u042b\u0415 \u0416\u0414\u0423\u0422 \u041a\u041b\u042e\u0427\u0418",
                            "color": "#99ccff"
                        },
                        "103": {
                            "id": 103,
                            "title": "\u0414\u0423\u041c\u0410\u042e\u0422 \u043d\u0435 \u0437\u0432\u043e\u043d\u0438\u0442\u044c",
                            "color": "#ffdc7f"
                        },
                        "104": {
                            "id": 104,
                            "title": "\u0414\u0443\u043c\u0430\u044e\u0442 \u0441\u0432\u044f\u0437\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u043c\u0435\u0441\u0441\u0435\u043d\u0434\u0436\u0435\u0440\u044b",
                            "color": "#fffeb2"
                        },
                        "105": {
                            "id": 105,
                            "title": "\u0420\u0430\u0441\u0441\u044b\u043b\u043a\u0430 \u0432 \u043c\u0435\u0441\u0435\u043d\u0434\u0436\u0435\u0440\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430",
                            "color": "#99ccff"
                        },
                        "106": {
                            "id": 106,
                            "title": "\u0414\u0443\u043c\u0430\u044e\u0442 \u0432 \u0440\u0430\u0431\u043e\u0442\u0435",
                            "color": "#ffeab2"
                        },
                        "107": {
                            "id": 107,
                            "title": "\u041f\u0415\u0420\u0415\u0417\u0412\u041e\u041d\u0418\u0422\u042c \u041d\u0410 \u0417\u0410\u041c\u0415\u0420 (\u0413\u041e\u0420\u042f\u0427\u0418\u0415)",
                            "color": "#fffd7f"
                        },
                        "108": {
                            "id": 108,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0417\u0410\u041c\u0415\u0420\u0429\u0418\u041a\u0410",
                            "color": "#ffcc66"
                        },
                        "109": {
                            "id": 109,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0414\u0418\u0417\u0410\u0419\u041d",
                            "color": "#99ccff"
                        },
                        "110": {
                            "id": 110,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0417\u0410\u041c\u0415\u0420\u0429\u0418\u041a\u0410 \u0420\u0410\u0421\u041f\u0420\u0415\u0414\u0415\u041b\u0415\u041d\u0418\u0415",
                            "color": "#ffc8c8"
                        },
                        "111": {
                            "id": 111,
                            "title": "\u0412 \u041d\u041e\u0412\u041e\u0419 \u0421\u0420\u041c",
                            "color": "#deff81"
                        },
                        "112": {
                            "id": 112,
                            "title": "\u0420\u0410\u0421\u041f\u0420\u0415\u0414\u0415\u041b\u0415\u041d",
                            "color": "#99ccff"
                        },
                        "113": {
                            "id": 113,
                            "title": "\u0423\u0414\u0410\u041b\u0415\u041d\u041d\u042b\u0419 \u041f\u0420\u041e\u0421\u0427\u0415\u0422",
                            "color": "#99ccff"
                        },
                        "114": {
                            "id": 114,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u041d\u0415 \u0421\u041e\u0421\u0422\u041e\u042f\u041b\u0421\u042f \u041e\u041f\u0415\u0420\u0410\u0422\u041e\u0420",
                            "color": "#ffc8c8"
                        },
                        "115": {
                            "id": 115,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u041d\u0415 \u0421\u041e\u0421\u0422\u041e\u042f\u041b\u0421\u042f \u0417\u0410\u041c\u0415\u0420\u0429\u0418\u041a",
                            "color": "#ffc8c8"
                        },
                        "116": {
                            "id": 116,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0421\u041e\u0421\u0422\u041e\u042f\u041b\u0421\u042f",
                            "color": "#ccc8f9"
                        },
                        "117": {
                            "id": 117,
                            "title": "\u0425\u041e\u041b\u041e\u0421\u0422\u041e\u0419",
                            "color": "#ffdc7f"
                        },
                        "118": {
                            "id": 118,
                            "title": "\u0421\u041e\u0413\u041b\u0410\u0421\u041e\u0412\u0410\u0422\u042c \u0421\u041c\u0415\u0422\u0423",
                            "color": "#fffd7f"
                        },
                        "119": {
                            "id": 119,
                            "title": "\u0412\u041e\u0417\u0412\u0420\u0410\u0422 \u041d\u0410 \u0414\u041e\u0420\u0410\u0411\u041e\u0422\u041a\u0423 \u0420\u041e\u041f\u0423",
                            "color": "#99ccff"
                        },
                        "120": {
                            "id": 120,
                            "title": "\u0412\u042b\u0414\u0410\u041d\u041e \u0412 \u0420\u0410\u0411\u041e\u0422\u0423",
                            "color": "#99ccff"
                        },
                        "121": {
                            "id": 121,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u041c\u0414\u0410",
                            "color": "#87f2c0"
                        },
                        "122": {
                            "id": 122,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u0418\u0412\u0410",
                            "color": "#87f2c0"
                        },
                        "123": {
                            "id": 123,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u041a\u041c\u041f",
                            "color": "#deff81"
                        },
                        "124": {
                            "id": 124,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u0411\u0421\u0410",
                            "color": "#87f2c0"
                        },
                        "125": {
                            "id": 125,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u041c\u041f\u0421",
                            "color": "#deff81"
                        },
                        "126": {
                            "id": 126,
                            "title": "\u0417\u0410\u041c\u041e\u0420\u041e\u0417\u041a\u0410",
                            "color": "#99ccff"
                        },
                        "127": {
                            "id": 127,
                            "title": "\u0417\u0410\u041a\u0420\u042b\u0422\u041e \u041d\u0415\u0422 \u0414\u041e\u041a\u0423\u041c\u0415\u041d\u0422\u041e\u0412",
                            "color": "#99ccff"
                        },
                        "128": {
                            "id": 128,
                            "title": "\u042e\u0420. \u041e\u0422\u0414\u0415\u041b",
                            "color": "#99ccff"
                        },
                        "129": {
                            "id": 129,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "130": {
                            "id": 130,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "7": {
                    "id": 7,
                    "name": "\u041a\u043e\u043c\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u044f",
                    "archive": false,
                    "stages": {
                        "131": {
                            "id": 131,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "132": {
                            "id": 132,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "133": {
                            "id": 133,
                            "title": "\u0414\u0443\u043c\u0430\u044e\u0442",
                            "color": "#ffff99"
                        },
                        "134": {
                            "id": 134,
                            "title": "\u0421\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u043d\u0438\u0435 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u043e\u0432",
                            "color": "#ffcc66"
                        },
                        "135": {
                            "id": 135,
                            "title": "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435",
                            "color": "#99ccff"
                        },
                        "136": {
                            "id": 136,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "137": {
                            "id": 137,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "8": {
                    "id": 8,
                    "name": "\u0425\u043e\u043b\u043e\u0434\u043d\u044b\u0435 \u0431\u0430\u0437\u044b \u041a\u04261",
                    "archive": false,
                    "stages": {
                        "138": {
                            "id": 138,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "139": {
                            "id": 139,
                            "title": "\u041d\u043e\u0432\u044b\u0435 \u041d\u0430\u0434\u0435\u0436\u0434\u0430",
                            "color": "#99ccff"
                        },
                        "140": {
                            "id": 140,
                            "title": "\u041d\u043e\u0432\u044b\u0435 \u0414\u043c\u0438\u0442\u0440\u0438\u0439",
                            "color": "#ffff99"
                        },
                        "141": {
                            "id": 141,
                            "title": "\u041d\u0435 \u0446\u0435\u043b\u0435\u0432\u043e\u0439 \u041c\u0438\u043a\u0430\u044d\u043b\u044c",
                            "color": "#99ccff"
                        },
                        "142": {
                            "id": 142,
                            "title": "\u041d\u0435 \u0426\u0415\u041b\u0415\u0412\u041e\u0419 \u041d\u0410\u0414\u0415\u0416\u0414\u0410",
                            "color": "#99ccff"
                        },
                        "143": {
                            "id": 143,
                            "title": "\u041d\u0435 \u0426\u0435\u043b\u0435\u0432\u043e\u0439 \u0414\u043c\u0438\u0442\u0440\u0438\u0439",
                            "color": "#99ccff"
                        },
                        "144": {
                            "id": 144,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "145": {
                            "id": 145,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "9": {
                    "id": 9,
                    "name": "\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u044b \u0410\u0422\u041b\u041e\u041d",
                    "archive": false,
                    "stages": {
                        "146": {
                            "id": 146,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "147": {
                            "id": 147,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "148": {
                            "id": 148,
                            "title": "\u041f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u044b",
                            "color": "#ffff99"
                        },
                        "149": {
                            "id": 149,
                            "title": "\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u044e\u0442 \u0440\u0435\u0448\u0435\u043d\u0438\u0435",
                            "color": "#ffcc66"
                        },
                        "150": {
                            "id": 150,
                            "title": "\u0435\u0432\u0430",
                            "color": "#99ccff"
                        },
                        "151": {
                            "id": 151,
                            "title": "\u043c\u0438\u043a\u0430\u044d\u043b\u044c",
                            "color": "#99ccff"
                        },
                        "152": {
                            "id": 152,
                            "title": "\u0414\u0430\u043c\u0438\u0440",
                            "color": "#99ccff"
                        },
                        "153": {
                            "id": 153,
                            "title": "\u0412\u043b\u0430\u0434",
                            "color": "#99ccff"
                        },
                        "154": {
                            "id": 154,
                            "title": "\u043c\u0430\u043d\u0441\u0443\u0440",
                            "color": "#99ccff"
                        },
                        "155": {
                            "id": 155,
                            "title": "\u0410\u0440\u0442\u0435\u043c",
                            "color": "#99ccff"
                        },
                        "156": {
                            "id": 156,
                            "title": "\u041d\u0430\u0440\u0433\u0438\u0437\u0430",
                            "color": "#99ccff"
                        },
                        "157": {
                            "id": 157,
                            "title": "\u0420\u0430\u043c\u0437",
                            "color": "#99ccff"
                        },
                        "158": {
                            "id": 158,
                            "title": "\u0412\u043b\u0430\u0441",
                            "color": "#99ccff"
                        },
                        "159": {
                            "id": 159,
                            "title": "\u0412\u0430\u0440\u0434\u0430\u043d",
                            "color": "#99ccff"
                        },
                        "160": {
                            "id": 160,
                            "title": "\u0420\u043e\u0441\u0442\u0438\u0441\u043b\u0430\u0432",
                            "color": "#99ccff"
                        },
                        "161": {
                            "id": 161,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "162": {
                            "id": 162,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "10": {
                    "id": 10,
                    "name": "\u0421\u0443\u0434\u0435\u0431\u043a\u0438 \u041f\u0440\u0438\u0435\u043c\u043a\u0438 \u043a\u0432",
                    "archive": false,
                    "stages": {
                        "163": {
                            "id": 163,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "164": {
                            "id": 164,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "165": {
                            "id": 165,
                            "title": "\u041f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u044b",
                            "color": "#ffff99"
                        },
                        "166": {
                            "id": 166,
                            "title": "\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u044e\u0442 \u0440\u0435\u0448\u0435\u043d\u0438\u0435",
                            "color": "#deff81"
                        },
                        "167": {
                            "id": 167,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u043f\u0440\u0438\u0435\u043c\u0449\u0438\u043a\u0430",
                            "color": "#ffce5a"
                        },
                        "168": {
                            "id": 168,
                            "title": "\u0421\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u0442\u044c \u0434\u043e\u0433\u043e\u0432\u043e\u0440",
                            "color": "#99ccff"
                        },
                        "169": {
                            "id": 169,
                            "title": "\u0434\u043e\u0433\u043e\u0432\u043e\u0440 \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d",
                            "color": "#99ccff"
                        },
                        "170": {
                            "id": 170,
                            "title": "\u0432\u0435\u0434\u0435\u0442\u0441\u044f \u0440\u0430\u0431\u043e\u0442\u0430",
                            "color": "#99ccff"
                        },
                        "171": {
                            "id": 171,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "172": {
                            "id": 172,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "11": {
                    "id": 11,
                    "name": "\u0425\u043e\u043b\u043e\u0434\u043d\u044b\u0435 \u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433",
                    "archive": false,
                    "stages": {
                        "173": {
                            "id": 173,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "174": {
                            "id": 174,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "175": {
                            "id": 175,
                            "title": "\u041f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u044b",
                            "color": "#ffff99"
                        },
                        "176": {
                            "id": 176,
                            "title": "\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u044e\u0442 \u0440\u0435\u0448\u0435\u043d\u0438\u0435",
                            "color": "#ffcc66"
                        },
                        "177": {
                            "id": 177,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "178": {
                            "id": 178,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "12": {
                    "id": 12,
                    "name": "\u0425\u043e\u043b\u043e\u0434\u043d\u044b\u0435 2\u043e\u0439 \u041a\u0426",
                    "archive": false,
                    "stages": {
                        "179": {
                            "id": 179,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "180": {
                            "id": 180,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "181": {
                            "id": 181,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#d6eaff"
                        },
                        "182": {
                            "id": 182,
                            "title": "\u041d\u0435 \u0426\u0435\u043b\u0435\u0432\u043e\u0439",
                            "color": "#99ccff"
                        },
                        "183": {
                            "id": 183,
                            "title": "\u041d\u0426 \u043f\u043e \u043c\u0438\u043d\u0438\u043c\u0430\u043b\u043a\u0435",
                            "color": "#99ccff"
                        },
                        "184": {
                            "id": 184,
                            "title": "\u041d\u0426 \u0443\u0436\u0435 \u0434\u0435\u043b\u0430\u044e\u0442\u00a0\u0440\u0435\u043c\u043e\u043d\u0442",
                            "color": "#99ccff"
                        },
                        "185": {
                            "id": 185,
                            "title": "\u041d\u0415\u0442 \u041a\u043b\u044e\u0447\u0435\u0439",
                            "color": "#f3beff"
                        },
                        "186": {
                            "id": 186,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442 \u0441\u0440\u043e\u043a \u043d\u0435 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d",
                            "color": "#87f2c0"
                        },
                        "187": {
                            "id": 187,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442",
                            "color": "#fffd7f"
                        },
                        "188": {
                            "id": 188,
                            "title": "\u041f\u0415\u0420\u0415\u0417\u0412\u041e\u041d\u0418\u0422\u042c \u041d\u0410 \u0417\u0410\u041c\u0415\u0420 \u0413\u041e\u0420\u042f\u0427\u0418\u0415",
                            "color": "#deff81"
                        },
                        "189": {
                            "id": 189,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0434\u0438\u0437\u0430\u0439\u043d (\u043f\u0435\u0440\u0435\u043d\u0435\u0441\u0442\u0438 \u0432 \u043e\u0442\u0434\u0435\u043b\u043a\u0443)",
                            "color": "#99ccff"
                        },
                        "190": {
                            "id": 190,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0437\u0430\u043c\u0435\u0440\u0449\u0438\u043a\u0430 (\u043f\u0435\u0440\u0435\u043d\u0435\u0441\u0442\u0438 \u0432 \u043e\u0442\u0434\u0435\u043b\u043a\u0443)",
                            "color": "#ffce5a"
                        },
                        "191": {
                            "id": 191,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "192": {
                            "id": 192,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "13": {
                    "id": 13,
                    "name": "\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u041f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u043a\u0430",
                    "archive": false,
                    "stages": {
                        "193": {
                            "id": 193,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "194": {
                            "id": 194,
                            "title": "\u041a\u0412\u0410\u041b\u0418\u0424\u0418\u041a\u0410\u0426\u0418\u042f (\u0412\u0417\u042f\u0422 \u0412 \u0420\u0410\u0411\u041e\u0422\u0423)",
                            "color": "#fffeb2"
                        },
                        "195": {
                            "id": 195,
                            "title": "\u041d\u0415\u0414\u041e\u0417\u0412\u041e\u041d",
                            "color": "#c1e0ff"
                        },
                        "196": {
                            "id": 196,
                            "title": "\u041d\u0435 \u0446\u0435\u043b\u0435\u0432\u043e\u0439",
                            "color": "#99ccff"
                        },
                        "197": {
                            "id": 197,
                            "title": "\u041d\u0435\u0442 \u043a\u043b\u044e\u0447\u0435\u0439",
                            "color": "#eb93ff"
                        },
                        "198": {
                            "id": 198,
                            "title": "\u0414\u0423\u041c\u0410\u042e\u0422 \u0412 \u0420\u0410\u0411\u041e\u0422\u0415",
                            "color": "#fffd7f"
                        },
                        "199": {
                            "id": 199,
                            "title": "\u041f\u0415\u0420\u0415\u0417\u0412\u041e\u041d\u0418\u0422\u042c \u041d\u0410 \u0417\u0410\u041c\u0415\u0420 (\u0413\u041e\u0420\u042f\u0427\u0418\u0415)",
                            "color": "#deff81"
                        },
                        "200": {
                            "id": 200,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0417\u0410\u041c\u0415\u0420\u0429\u0418\u041a\u0410",
                            "color": "#ffce5a"
                        },
                        "201": {
                            "id": 201,
                            "title": "\u0414\u0418\u0417\u0410\u0419\u041d",
                            "color": "#99ccff"
                        },
                        "202": {
                            "id": 202,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0417\u0410\u041c\u0415\u0420\u0429\u0418\u041a\u0410 \u0420\u0410\u0421\u041f\u0420\u0415\u0414\u0415\u041b\u0415\u041d\u0418\u0415",
                            "color": "#ffc8c8"
                        },
                        "203": {
                            "id": 203,
                            "title": "\u0412 \u043d\u043e\u0432\u043e\u0439 \u0421\u0420\u041c",
                            "color": "#ebffb1"
                        },
                        "204": {
                            "id": 204,
                            "title": "\u0421\u041e\u0413\u041b\u0410\u0421\u041e\u0412\u0410\u0422\u042c \u0421\u041c\u0415\u0422\u0423",
                            "color": "#fffeb2"
                        },
                        "205": {
                            "id": 205,
                            "title": "\u0412\u042b\u0414\u0410\u041d\u041e \u0412 \u0420\u0410\u0411\u041e\u0422\u0423",
                            "color": "#99ccff"
                        },
                        "206": {
                            "id": 206,
                            "title": "\u041f\u0420\u041e\u0418\u0417\u0412\u041e\u0414\u0418\u0422\u0421\u042f \u0420\u0415\u041c\u041e\u041d\u0422 \u0418\u0412\u0410",
                            "color": "#87f2c0"
                        },
                        "207": {
                            "id": 207,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u043d\u0435\u0442 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432",
                            "color": "#98cbff"
                        },
                        "208": {
                            "id": 208,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "209": {
                            "id": 209,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "14": {
                    "id": 14,
                    "name": "\u0410\u0443\u0434\u0438\u0442 \u043d\u043e\u0432\u043e\u0441\u0442\u0440\u043e\u0439",
                    "archive": false,
                    "stages": {
                        "210": {
                            "id": 210,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "211": {
                            "id": 211,
                            "title": "\u041d\u043e\u0432\u044b\u0435 \u0437\u0430\u044f\u0432\u043a\u0438",
                            "color": "#99ccff"
                        },
                        "212": {
                            "id": 212,
                            "title": "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f",
                            "color": "#fffeb2"
                        },
                        "213": {
                            "id": 213,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#99ccff"
                        },
                        "214": {
                            "id": 214,
                            "title": "\u0420\u0430\u0441\u0441\u044b\u043b\u043a\u0430 \u0432 \u043c\u0435\u0441\u0435\u043d\u0434\u0436\u0435\u0440\u0435 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430",
                            "color": "#99ccff"
                        },
                        "215": {
                            "id": 215,
                            "title": "\u0414\u0443\u043c\u0430\u044e\u0442 \u0432 \u0440\u0430\u0431\u043e\u0442\u0435",
                            "color": "#ffff99"
                        },
                        "216": {
                            "id": 216,
                            "title": "\u0413\u043e\u0440\u044f\u0447\u0438\u0435 \u043f\u0435\u0440\u0435\u0437\u0432\u043e\u043d\u0438\u0442\u044c \u043d\u0430 \u0437\u0430\u043c\u0435\u0440",
                            "color": "#87f2c0"
                        },
                        "217": {
                            "id": 217,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0437\u0430\u043c\u0435\u0440\u0449\u0438\u043a\u0430",
                            "color": "#ffce5a"
                        },
                        "218": {
                            "id": 218,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0434\u0438\u0437\u0430\u0439\u043d",
                            "color": "#99ccff"
                        },
                        "219": {
                            "id": 219,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0437\u0430\u043c\u0435\u0440\u0449\u0438\u043a\u0430 \u0440\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                            "color": "#ffc8c8"
                        },
                        "220": {
                            "id": 220,
                            "title": "\u0412 \u041d\u041e\u0412\u041e\u0419 \u0421\u0420\u041c",
                            "color": "#deff81"
                        },
                        "221": {
                            "id": 221,
                            "title": "\u0440\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d",
                            "color": "#99ccff"
                        },
                        "222": {
                            "id": 222,
                            "title": "\u0421\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u0442\u044c \u0441\u043c\u0435\u0442\u0443",
                            "color": "#fffd7f"
                        },
                        "223": {
                            "id": 223,
                            "title": "\u0412\u043e\u0437\u0432\u0440\u0430\u0442 \u043d\u0430 \u0434\u043e\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u0420\u041e\u041f\u0443",
                            "color": "#99ccff"
                        },
                        "224": {
                            "id": 224,
                            "title": "\u0412\u044b\u0434\u0430\u043d\u043e \u0432 \u0440\u0430\u0431\u043e\u0442\u0443",
                            "color": "#99ccff"
                        },
                        "225": {
                            "id": 225,
                            "title": "\u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0440\u0435\u043c\u043e\u043d\u0442",
                            "color": "#87f2c0"
                        },
                        "226": {
                            "id": 226,
                            "title": "\u0417\u0430\u043c\u043e\u0440\u043e\u0437\u043a\u0430",
                            "color": "#99ccff"
                        },
                        "227": {
                            "id": 227,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "228": {
                            "id": 228,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "15": {
                    "id": 15,
                    "name": "\u041c2 \u041f\u0430\u0440\u0442\u043d\u0435\u0440\u044b",
                    "archive": false,
                    "stages": {
                        "229": {
                            "id": 229,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "230": {
                            "id": 230,
                            "title": "\u041d\u041e\u0412\u042b\u0415 \u0417\u0410\u042f\u0412\u041a\u0418",
                            "color": "#99ccff"
                        },
                        "231": {
                            "id": 231,
                            "title": "\u041a\u0412\u0410\u041b\u0418\u0424\u0418\u041a\u0410\u0426\u0418\u042f",
                            "color": "#ffff99"
                        },
                        "232": {
                            "id": 232,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#99ccff"
                        },
                        "233": {
                            "id": 233,
                            "title": "\u041d\u0435 \u0426\u0435\u043b\u0435\u0432\u043e\u0439",
                            "color": "#99ccff"
                        },
                        "234": {
                            "id": 234,
                            "title": "\u0414\u0443\u0431\u043b\u044c",
                            "color": "#99ccff"
                        },
                        "235": {
                            "id": 235,
                            "title": "\u043d\u0435\u0442 \u043a\u043b\u044e\u0447\u0435\u0439",
                            "color": "#eb93ff"
                        },
                        "236": {
                            "id": 236,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442 \u0432 \u0440\u0430\u0431\u043e\u0442\u0435 \u0443 \u043e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u0430",
                            "color": "#fffeb2"
                        },
                        "237": {
                            "id": 237,
                            "title": "\u0413\u041e\u0420\u042f\u0427\u0418\u0415 \u041f\u0415\u0420\u0415\u0417\u0412\u041e\u041d\u0418\u0422\u042c \u041d\u0410 \u0417\u0410\u041c\u0415\u0420",
                            "color": "#87f2c0"
                        },
                        "238": {
                            "id": 238,
                            "title": "\u0412\u042b\u0415\u0417\u0414 \u0417\u0410\u041c\u0415\u0420\u0429\u0418\u041a\u0410",
                            "color": "#ffcc66"
                        },
                        "239": {
                            "id": 239,
                            "title": "\u0420\u0430\u0441\u043f\u0435\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                            "color": "#99ccff"
                        },
                        "240": {
                            "id": 240,
                            "title": "\u0412\u044b\u0434\u0430\u043d\u043e \u0432 \u0440\u0430\u0431\u043e\u0442\u0443",
                            "color": "#99ccff"
                        },
                        "241": {
                            "id": 241,
                            "title": "\u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0420\u0435\u043c\u043e\u043d\u0442",
                            "color": "#87f2c0"
                        },
                        "242": {
                            "id": 242,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "243": {
                            "id": 243,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "16": {
                    "id": 16,
                    "name": "\u041f\u0440\u0438\u0435\u043c\u043a\u0430.\u041c\u043e\u0441\u043a\u0432\u0430",
                    "archive": false,
                    "stages": {
                        "244": {
                            "id": 244,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "245": {
                            "id": 245,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "246": {
                            "id": 246,
                            "title": "\u041d\u0435\u0446\u0435\u043b\u0435\u0432\u043e\u0439",
                            "color": "#99ccff"
                        },
                        "247": {
                            "id": 247,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#d6eaff"
                        },
                        "248": {
                            "id": 248,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442",
                            "color": "#ffff99"
                        },
                        "249": {
                            "id": 249,
                            "title": "\u0414\u0443\u043c\u0430\u0435\u0442 \u0441\u0440\u043e\u043a \u043d\u0435 \u043e\u0442\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d",
                            "color": "#87f2c0"
                        },
                        "250": {
                            "id": 250,
                            "title": "\u0413\u043e\u0440\u044f\u0447\u0438\u0435 \u043d\u0430 \u0437\u0430\u043c\u0435\u0440",
                            "color": "#deff81"
                        },
                        "251": {
                            "id": 251,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0437\u0430\u043c\u0435\u0440\u0449\u0438\u043a\u0430",
                            "color": "#ffcc66"
                        },
                        "252": {
                            "id": 252,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0437\u0430\u043c\u0435\u0440\u0449\u0438\u043a\u0430 \u0440\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
                            "color": "#ffc8c8"
                        },
                        "253": {
                            "id": 253,
                            "title": "\u0412 \u041d\u041e\u0412\u041e\u0419 \u0421\u0420\u041c",
                            "color": "#deff81"
                        },
                        "254": {
                            "id": 254,
                            "title": "\u0420\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d",
                            "color": "#d6eaff"
                        },
                        "255": {
                            "id": 255,
                            "title": "\u0421\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u0442\u044c \u0441\u043c\u0435\u0442\u0443",
                            "color": "#fffd7f"
                        },
                        "256": {
                            "id": 256,
                            "title": "\u0412\u044b\u0434\u0430\u043d\u043e \u0432 \u0440\u0430\u0431\u043e\u0442\u0443",
                            "color": "#99ccff"
                        },
                        "257": {
                            "id": 257,
                            "title": "\u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0440\u0435\u043c\u043e\u043d\u0442",
                            "color": "#87f2c0"
                        },
                        "258": {
                            "id": 258,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "259": {
                            "id": 259,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "17": {
                    "id": 17,
                    "name": "Avito",
                    "archive": false,
                    "stages": {
                        "260": {
                            "id": 260,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "261": {
                            "id": 261,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "262": {
                            "id": 262,
                            "title": "\u041f\u0435\u0440\u0435\u0433\u043e\u0432\u043e\u0440\u044b",
                            "color": "#ffff99"
                        },
                        "263": {
                            "id": 263,
                            "title": "\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u044e\u0442 \u0440\u0435\u0448\u0435\u043d\u0438\u0435",
                            "color": "#ffcc66"
                        },
                        "264": {
                            "id": 264,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "265": {
                            "id": 265,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "18": {
                    "id": 18,
                    "name": "\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u044f \u041d\u043e\u0432\u0430\u044f",
                    "archive": false,
                    "stages": {
                        "266": {
                            "id": 266,
                            "title": "\u041d\u0435\u0440\u0430\u0437\u043e\u0431\u0440\u0430\u043d\u043d\u043e\u0435",
                            "color": "#c1c1c1"
                        },
                        "267": {
                            "id": 267,
                            "title": "\u041f\u0435\u0440\u0432\u0438\u0447\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442",
                            "color": "#99ccff"
                        },
                        "268": {
                            "id": 268,
                            "title": "\u041d\u0435\u0434\u043e\u0437\u0432\u043e\u043d",
                            "color": "#c1e0ff"
                        },
                        "269": {
                            "id": 269,
                            "title": "\u041d\u0435 \u0446\u0435\u043b\u0435\u0432\u043e\u0439",
                            "color": "#98cbff"
                        },
                        "270": {
                            "id": 270,
                            "title": "\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u044e\u0442 \u0440\u0435\u0448\u0435\u043d\u0438\u0435",
                            "color": "#fffeb2"
                        },
                        "271": {
                            "id": 271,
                            "title": "\u041f\u0435\u0440\u0435\u0434\u0430\u043d\u00a0\u0432\u00a0\u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0442\u0430\u0446\u0438\u044e",
                            "color": "#deff81"
                        },
                        "272": {
                            "id": 272,
                            "title": "\u0423\u0441\u043f\u0435\u0448\u043d\u043e \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#CCFF66"
                        },
                        "273": {
                            "id": 273,
                            "title": "\u0417\u0430\u043a\u0440\u044b\u0442\u043e \u0438 \u043d\u0435 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043e",
                            "color": "#D5D8DB"
                        }
                    }
                },
                "19": {
                    "id": 19,
                    "name": "\u0417\u0430\u043c\u0435\u0440",
                    "archive": false,
                    "stages": {
                        "274": {
                            "id": 274,
                            "title": "\u0420\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d \u043f\u0435\u0440\u0435\u043d\u043e\u0441 \u0438\u0437 \u0410\u041c\u041e",
                            "color": "#22B14B"
                        },
                        "275": {
                            "id": 275,
                            "title": "\u0420\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u0437\u0430\u043c\u0435\u0440\u043e\u0432",
                            "color": "#97d4ff"
                        },
                        "276": {
                            "id": 276,
                            "title": "\u041e\u0442\u043c\u0435\u043d\u0430 \u0437\u0430\u043c\u0435\u0440\u0430",
                            "color": "#ffffff"
                        },
                        "277": {
                            "id": 277,
                            "title": "\u0420\u0430\u0441\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0435 \u0437\u0430\u043c\u0435\u0440\u044b",
                            "color": "#41d2f3"
                        },
                        "278": {
                            "id": 278,
                            "title": "\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u043e\u0441\u0447\u0451\u0442",
                            "color": "#7cd7f3"
                        },
                        "279": {
                            "id": 279,
                            "title": "\u0412\u044b\u0435\u0437\u0434 \u0441\u043e\u0441\u0442\u043e\u044f\u043b\u0441\u044f",
                            "color": "#c0fd04"
                        },
                        "280": {
                            "id": 280,
                            "title": "\u0425\u043e\u043b\u043e\u0441\u0442\u043e\u0439 \u0432\u044b\u0435\u0437\u0434",
                            "color": "#ffffff"
                        }
                    }
                },
                "20": {
                    "id": 20,
                    "name": "\u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0441\u0442\u0432\u043e",
                    "archive": false,
                    "stages": []
                }
            },
            "companies": [
                {
                    "id": 1,
                    "sab_id": "39",
                    "name": "\u0410\u0442\u043b\u043e\u043d \u0424\u041c",
                    "name_short": "\u0410\u0442\u043b\u043e\u043d \u0424\u041c",
                    "inn": "7726469525",
                    "okpo": "",
                    "address": "115230, \u0433. \u041c\u043e\u0441\u043a\u0432\u0430, \u041a\u0430\u0448\u0438\u0440\u0441\u043a\u043e\u0435 \u0448\u043e\u0441\u0441\u0435, \u0434.3, \u043a\u043e\u0440\u043f\u0443\u0441 2, \u0441\u0442\u0440.9 \u043e\u0444.\u211613\u0410 \u0414\u041a \u00ab\u0421\u0438\u0440\u0438\u0443\u0441 \u041f\u0430\u0440\u043a\u00bb",
                    "phone_company": "+7 (495) 777-70-91",
                    "email_company": "info@atlonfm.ru",
                    "idAddressCity": "7700000000000",
                    "ogrn": "1207700389456",
                    "kpp": "772401001",
                    "oktmo": "",
                    "date_state_registration": "20.10.2020",
                    "general_manager": "\u0410\u043d\u0442\u0438\u043f\u0438\u043d \u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440 \u042e\u0440\u044c\u0435\u0432\u0438\u0447",
                    "web_url": "",
                    "address_document": "\u0411\u0426 \u0421\u0438\u0440\u0438\u0443\u0441 \u041f\u0430\u0440\u043a, \u0433.\u041c\u043e\u0441\u043a\u0432\u0430. \u041a\u0430\u0448\u0438\u0440\u0441\u043a\u043e\u0435 \u0448., 3, \u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435 9",
                    "chief_accountant": "\u0410\u043d\u0442\u0438\u043f\u0438\u043d \u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440 \u042e\u0440\u044c\u0435\u0432\u0438\u0447",
                    "bank_name": "\u0410\u041e \u00ab\u0422\u0438\u043d\u044c\u043a\u043e\u0444\u0444 \u0411\u0430\u043d\u043a\u00bb",
                    "bank_bik": "044525974",
                    "bank_payment_account": "40702810910000717489",
                    "bank_correspondent_account": "30101810145250000974",
                    "bank_address": "",
                    "bank_swift": "",
                    "logo": "https:\/\/atlonfm.sab-space.ru\/source\/image\/info_system\/logo39.jpeg",
                    "logo_document": "https:\/\/atlonfm.sab-space.ru\/source\/image\/info_system\/logo_document39.jpeg"
                },
                {
                    "id": 2,
                    "sab_id": "42",
                    "name": "\u0410\u0442\u043b\u043e\u043d \u041c\u0430\u0440\u043a\u0435\u0442",
                    "name_short": "\u041c\u0430\u0440\u043a\u0435\u0442",
                    "inn": "9724100510",
                    "okpo": "",
                    "address": "129515, \u0433\u043e\u0440\u043e\u0434 \u041c\u043e\u0441\u043a\u0432\u0430, \u0432\u043d.\u0442\u0435\u0440. \u0433. \u041c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u041e\u043a\u0440\u0443\u0433 \u041e\u0441\u0442\u0430\u043d\u043a\u0438\u043d\u0441\u043a\u0438\u0439, \u0443\u043b. \u0410\u043a\u0430\u0434\u0435\u043c\u0438\u043a\u0430 \u041a\u043e\u0440\u043e\u043b\u0435\u0432\u0430, \u0434\u043e\u043c 13, \u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435 1, \u043f\u043e\u043c\u0435\u0449\u0435\u043d\u0438\u0435 3\u0410\/2",
                    "phone_company": "+7 (495) 777-70-91",
                    "email_company": "",
                    "idAddressCity": "7700000000000",
                    "ogrn": "1227700613095",
                    "kpp": "771701001",
                    "oktmo": "",
                    "date_state_registration": "",
                    "general_manager": "\u041a\u0440\u0430\u0441\u043d\u043e\u0432 \u041c\u0438\u0445\u0430\u0438\u043b \u041f\u0435\u0442\u0440\u043e\u0432\u0438\u0447",
                    "web_url": "",
                    "address_document": "",
                    "chief_accountant": "",
                    "bank_name": "\u0410\u041e \u00ab\u0410\u041b\u042c\u0424\u0410-\u0411\u0410\u041d\u041a\u00bb",
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
                    "name": "\u0410\u0442\u043b\u043e\u043d \u0424\u0430\u0441\u0438\u043b\u0438\u0442\u0438 \u041c\u0435\u043d\u0435\u0434\u0436\u043c\u0435\u043d\u0442",
                    "name_short": "\u0424\u0430\u0441\u0438\u043b\u0438\u0442\u0438",
                    "inn": "9728094770",
                    "okpo": "0",
                    "address": "117279, \u0433\u043e\u0440\u043e\u0434 \u041c\u043e\u0441\u043a\u0432\u0430, \u0432\u043d.\u0442\u0435\u0440.\u0433. \u043c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433 \u041a\u043e\u043d\u044c\u043a\u043e\u0432\u043e, \u041c\u0438\u043a\u043b\u0443\u0445\u043e-\u041c\u0430\u043a\u043b\u0430\u044f \u0443\u043b., \u0434\u043e\u043c 34, \u043f\u043e\u043c\u0435\u0449. 26\/4",
                    "phone_company": "+7 (495) 106-70-90",
                    "email_company": "info@atlonfm.ru",
                    "idAddressCity": "7700000000000",
                    "ogrn": "1237700313377",
                    "kpp": "772801001",
                    "oktmo": "",
                    "date_state_registration": "",
                    "general_manager": "\u041a\u0438\u0441\u0435\u043b\u0451\u0432 \u0414\u043c\u0438\u0442\u0440\u0438\u0439 \u0421\u0435\u0440\u0433\u0435\u0435\u0432\u0438\u0447",
                    "web_url": "",
                    "address_document": "",
                    "chief_accountant": "\u041c\u043e\u0441\u0442\u043e\u0432\u0441\u043a\u0438\u0445 \u0421\u0432\u0435\u0442\u043b\u0430\u043d\u0430 \u0412\u0430\u0440\u0443\u0436\u0430\u043d\u043e\u0432\u043d\u0430",
                    "bank_name": "\u0410\u041e \u00ab\u0410\u043b\u044c\u0444\u0430-\u0411\u0430\u043d\u043a\u00bb",
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
                    "name": "\u0410\u0442\u043b\u043e\u043d \u0424\u041c \u0426\u0435\u043d\u0442\u0440",
                    "name_short": "\u0426\u0435\u043d\u0442\u0440",
                    "inn": "9719037060",
                    "okpo": "",
                    "address": "105077, \u0413.\u041c\u041e\u0421\u041a\u0412\u0410, \u0412\u041d.\u0422\u0415\u0420.\u0413. \u041c\u0423\u041d\u0418\u0426\u0418\u041f\u0410\u041b\u042c\u041d\u042b\u0419 \u041e\u041a\u0420\u0423\u0413 \u0412\u041e\u0421\u0422\u041e\u0427\u041d\u041e\u0415 \u0418\u0417\u041c\u0410\u0419\u041b\u041e\u0412\u041e, \u0411-\u0420 \u0418\u0417\u041c\u0410\u0419\u041b\u041e\u0412\u0421\u041a\u0418\u0419, \u0414. 46, \u041f\u041e\u041c\u0415\u0429. 1\/\u041f",
                    "phone_company": "+7 (495) 727-77-89",
                    "email_company": "info@atlonfm.ru",
                    "idAddressCity": "7700000000000",
                    "ogrn": "",
                    "kpp": "771901001",
                    "oktmo": "",
                    "date_state_registration": "",
                    "general_manager": "\u0410\u043d\u0442\u0438\u043f\u0438\u043d \u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440 \u042e\u0440\u044c\u0435\u0432\u0438\u0447",
                    "web_url": "",
                    "address_document": "",
                    "chief_accountant": "",
                    "bank_name": "\u0410\u041e \u00ab\u0410\u043b\u044c\u0444\u0430\u2013\u0411\u0430\u043d\u043a\u00bb ",
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
                    "name": "\u0410\u0442\u043b\u043e\u043d \u0424\u041c \u0421\u0435\u0432\u0435\u0440",
                    "name_short": "\u0421\u0435\u0432\u0435\u0440",
                    "inn": "7802931945",
                    "okpo": "",
                    "address": "194044 \u0433. \u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433, \u0432\u043d.\u0442\u0435\u0440.\u0433. \u043c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433 \u0421\u0430\u043c\u043f\u0441\u043e\u043d\u0438\u0435\u0432\u0441\u043a\u043e\u0435, \u043f\u0440-\u043a\u0442 \u0411\u043e\u043b\u044c\u0448\u043e\u0439 \u0421\u0430\u043c\u043f\u0441\u043e\u043d\u0438\u0435\u0432\u0441\u043a\u0438\u0439, \u0434. 4-6, \u043b\u0438\u0442\u0435\u0440\u0430 \u0410, \u043f\u043e\u043c\u0435\u0449.\/\u043e\u0444\u0438\u0441 12-\u041d",
                    "phone_company": "+7 (929) 112-80-50",
                    "email_company": "sever@atlonfm.ru",
                    "idAddressCity": "7800000000000",
                    "ogrn": "1227800141095",
                    "kpp": "780201001",
                    "oktmo": "",
                    "date_state_registration": "",
                    "general_manager": "\u0421\u0430\u0442\u0435\u043c\u0438\u0440\u043e\u0432\u0430 \u041d\u0430\u0442\u0430\u043b\u044c\u044f \u041f\u0435\u0442\u0440\u043e\u0432\u043d\u0430",
                    "web_url": "",
                    "address_document": "194044 \u0433. \u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433, \u0432\u043d.\u0442\u0435\u0440.\u0433. \u043c\u0443\u043d\u0438\u0446\u0438\u043f\u0430\u043b\u044c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433 \u0421\u0430\u043c\u043f\u0441\u043e\u043d\u0438\u0435\u0432\u0441\u043a\u043e\u0435, \u043f\u0440-\u043a\u0442 \u0411\u043e\u043b\u044c\u0448\u043e\u0439 \u0421\u0430\u043c\u043f\u0441\u043e\u043d\u0438\u0435\u0432\u0441\u043a\u0438\u0439, \u0434. 4-6, \u043b\u0438\u0442\u0435\u0440\u0430 \u0410, \u043f\u043e\u043c\u0435\u0449.\/\u043e\u0444\u0438\u0441 12-\u041d",
                    "chief_accountant": "\u0421\u0430\u0442\u0435\u043c\u0438\u0440\u043e\u0432\u0430 \u041d\u0430\u0442\u0430\u043b\u044c\u044f \u041f\u0435\u0442\u0440\u043e\u0432\u043d\u0430",
                    "bank_name": "\u0410\u041e \u00ab\u0410\u043b\u044c\u0444\u0430\u2013\u0411\u0430\u043d\u043a\u00bb",
                    "bank_bik": "044525593",
                    "bank_payment_account": "40702810202860016367",
                    "bank_correspondent_account": "30101810200000000593",
                    "bank_address": "",
                    "bank_swift": "",
                    "logo": "https:\/\/atlonfm.sab-space.ru\/source\/image\/info_system\/logo43.jpeg",
                    "logo_document": "https:\/\/atlonfm.sab-space.ru\/source\/image\/info_system\/logo_document43.jpeg"
                }
            ],
            "roomSettings": {
                "columns": [
                    "\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u0443\u0433\u043e\u043b",
                    "\u0412\u044b\u0441\u0442\u0443\u043f",
                    "\u041a\u043e\u043b\u043e\u043d\u043d\u0430"
                ],
                "types": [
                    "\u041e\u0431\u0449\u0435\u0441\u0442\u0440\u043e\u0439",
                    "\u0421\u043f\u0435\u0446\u043c\u043e\u043d\u0442\u0430\u0436",
                    "\u042d\u043b\u0435\u043a\u0442\u0440\u0438\u043a\u0430",
                    "\u0421\u0430\u043d\u0442\u0435\u0445\u043d\u0438\u043a\u0430",
                    "\u0411\u0430\u043b\u043a\u043e\u043d",
                    "\u0414\u0432\u0435\u0440\u0438",
                    "\u0414\u0435\u043c\u043e\u043d\u0442\u0430\u0436",
                    "\u041a\u0443\u0445\u043d\u044f",
                    "\u041e\u0442\u043e\u043f\u043b\u0435\u043d\u0438\u0435",
                    "\u0421\u0430\u043d\u0443\u0437\u0435\u043b",
                    "\u0421\u0442\u0443\u0434\u0438\u044f"
                ]
            },
            "workSettings": {
                "eds": [
                    "-",
                    "\u043a\u0432.\u043c.",
                    "\u043f\u043e\u0433.\u043c.",
                    "\u0448\u0442",
                    "\u043a\u043e\u043c\u043f\u043b",
                    "\u043a\u0433",
                    "\u0442",
                    "\u043c3",
                    "\u0447"
                ],
                "factors": [
                    {
                        "title": "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e",
                        "room_field": "1"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c \u043f\u043e\u043b\u0430",
                        "room_field": "s_floor"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c \u0441\u0442\u0435\u043d",
                        "room_field": "s_walls"
                    },
                    {
                        "title": "\u041f\u0435\u0440\u0438\u043c\u0435\u0442\u0440 \u043f\u043e\u043b\u0430",
                        "room_field": "p_floor"
                    },
                    {
                        "title": "\u041f\u0435\u0440\u0438\u043c\u0435\u0442\u0440 \u043f\u043e\u0442\u043e\u043b\u043a\u0430",
                        "room_field": "perimeter"
                    },
                    {
                        "title": "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0443\u0433\u043b\u043e\u0432",
                        "room_field": "@getAllCornersCount"
                    },
                    {
                        "title": "\u0414\u043b\u0438\u043d\u0430",
                        "room_field": "1"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c",
                        "room_field": "1"
                    },
                    {
                        "title": "\u0412\u0435\u0441",
                        "room_field": "1"
                    },
                    {
                        "title": "\u041e\u0431\u044a\u0435\u043c",
                        "room_field": "1"
                    },
                    {
                        "title": "\u041e\u0442\u043a\u043e\u0441\u044b \u043e\u043a\u043d\u0430",
                        "room_field": "slopes_windows"
                    },
                    {
                        "title": "\u041e\u0442\u043a\u043e\u0441\u044b \u0434\u0432\u0435\u0440\u0438",
                        "room_field": "slopes_doors"
                    },
                    {
                        "title": "\u041e\u0442\u043a\u043e\u0441\u044b (\u043e\u043a\u043d\u0430 + \u0434\u0432\u0435\u0440\u0438)",
                        "room_field": "slopes_doors + slopes_windows"
                    },
                    {
                        "title": "\u0414\u043b\u0438\u043d\u0430 \u043f\u043e\u0434\u043e\u043a\u043e\u043d\u043d\u0438\u043a\u0430",
                        "room_field": "@getWindowsWidth"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c \u043f\u043e\u0434\u043e\u043a\u043e\u043d\u043d\u0438\u043a\u0430",
                        "room_field": "@getWindowsillsSquare"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c \u043a\u043e\u043b\u043e\u043d (\u0441\u0442\u0435\u043d\u044b)",
                        "room_field": "@getColumnsWallSquare"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c \u043e\u043a\u043e\u043d\u043d\u044b\u0445 \u043f\u0440\u043e\u0451\u043c\u043e\u0432",
                        "room_field": "@getWindowsSquare"
                    },
                    {
                        "title": "\u0414\u043b\u0438\u043d\u0430 \u0432\u043d\u0435\u0448\u043d\u0438\u0445 \u0443\u0433\u043b\u043e\u0432",
                        "room_field": "@getOutsideCornersWidth"
                    },
                    {
                        "title": "\u0414\u043b\u0438\u043d\u0430 \u0432\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0445 \u0443\u0433\u043b\u043e\u0432",
                        "room_field": "@getInsideCornersWidth"
                    },
                    {
                        "title": "\u041e\u0431\u0449\u0430\u044f \u0434\u043b\u0438\u043d\u0430 \u0443\u0433\u043b\u043e\u0432",
                        "room_field": "@getAllCornersWidth"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c (\u043f\u043e\u043b + \u0441\u0442\u0435\u043d\u0430)",
                        "room_field": "s_walls + s_floor"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c \u043e\u0442\u043a\u043e\u0441\u043e\u0432 \u043e\u043a\u043e\u043d",
                        "room_field": "@getWindowsSlopeSqaure"
                    },
                    {
                        "title": "\u041f\u043b\u043e\u0449\u0430\u0434\u044c \u0434\u0432\u0435\u0440\u043d\u044b\u0445 \u043f\u0440\u043e\u0451\u043c\u043e\u0432",
                        "room_field": "@getDoorsSquare"
                    },
                    {
                        "title": "\u0414\u043b\u0438\u043d\u0430 \u0434\u0432\u0435\u0440\u043d\u043e\u0433\u043e \u043f\u043e\u0440\u043e\u0436\u043a\u0430",
                        "room_field": "@getDoorsWidth"
                    },
                    {
                        "title": "\u041f\u0435\u0440\u0438\u043c\u0435\u0442\u0440 \u043a\u043e\u043b\u043e\u043d\u043d (\u043f\u043e\u043b\/\u043f\u043e\u0442\u043e\u043b\u043e\u043a)",
                        "room_field": "default_val"
                    },
                    {
                        "title": "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0432\u043d\u0435\u0448\u043d\u0438\u0445 \u0443\u0433\u043b\u043e\u0432",
                        "room_field": "@getOutsideCornersCount"
                    },
                    {
                        "title": "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0432\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0445 \u0443\u0433\u043b\u043e\u0432",
                        "room_field": "@getInsideCornersCount"
                    },
                    {
                        "title": "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0434\u0432\u0435\u0440\u0435\u0439",
                        "room_field": "@getDoorsCount"
                    },
                    {
                        "title": "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043e\u043a\u043e\u043d",
                        "room_field": "@getWindowsCount"
                    },
                    {
                        "title": "\u041e\u0431\u0449\u0435\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043f\u0440\u043e\u0451\u043c\u043e\u0432",
                        "room_field": "@getDoorsAndWindowsCount"
                    },
                    {
                        "title": "\u0412\u044b\u0441\u043e\u0442\u0430",
                        "room_field": "1"
                    },
                    {
                        "title": "\u0412\u0440\u0435\u043c\u044f",
                        "room_field": "1"
                    }
                ],
                "type": [
                    "\u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d",
                    "\u043c\u0430\u043b\u044f\u0440\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
                    "\u043f\u043e\u043b",
                    "\u043f\u043e\u0442\u043e\u043b\u043e\u043a"
                ],
                "category": [
                    {
                        "id": 1,
                        "name": "\u0414\u0435\u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
                        "room_types": [
                            0
                        ]
                    },
                    {
                        "id": 2,
                        "name": "\u0427\u0435\u0440\u043d\u043e\u0432\u044b\u0435 \u043e\u0442\u0434\u0435\u043b\u043e\u0447\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
                        "room_types": [
                            0
                        ]
                    },
                    {
                        "id": 3,
                        "name": "\u0427\u0438\u0441\u0442\u043e\u0432\u044b\u0435 \u043e\u0442\u0434\u0435\u043b\u043e\u0447\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
                        "room_types": [
                            0
                        ]
                    },
                    {
                        "id": 4,
                        "name": "\u0421\u0430\u043d\u0442\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0435  \u0440\u0430\u0431\u043e\u0442\u044b",
                        "room_types": [
                            3
                        ]
                    },
                    {
                        "id": 5,
                        "name": "\u0412\u044b\u0432\u043e\u0437 \u043c\u0443\u0441\u043e\u0440\u0430",
                        "room_types": [
                            1
                        ]
                    },
                    {
                        "id": 6,
                        "name": "\u0420\u0430\u0431\u043e\u0442\u044b \u043f\u043e \u043a\u043e\u043d\u0434\u0438\u0446\u0438\u043e\u043d\u0435\u0440\u0430\u043c",
                        "room_types": [
                            1
                        ]
                    },
                    {
                        "id": 7,
                        "name": "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435  \u0440\u0430\u0431\u043e\u0442\u044b",
                        "room_types": [
                            0
                        ]
                    },
                    {
                        "id": 8,
                        "name": "\u0421\u0432\u0430\u0440\u043e\u0447\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
                        "room_types": [
                            3
                        ]
                    },
                    {
                        "id": 9,
                        "name": "\u0420\u0435\u0441\u0442\u0430\u0432\u0440\u0430\u0446\u0438\u044f",
                        "room_types": [
                            1
                        ]
                    },
                    {
                        "id": 10,
                        "name": "\u041d\u0430\u0442\u044f\u0436\u043d\u043e\u0439 \u043f\u043e\u0442\u043e\u043b\u043e\u043a",
                        "room_types": [
                            1
                        ]
                    },
                    {
                        "id": 11,
                        "name": "\u0428\u043b\u0438\u0444\u043e\u0432\u043a\u0430  \u043f\u0430\u0440\u043a\u0435\u0442\u0430",
                        "room_types": [
                            1
                        ]
                    },
                    {
                        "id": 12,
                        "name": "\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435  \u0440\u0430\u0431\u043e\u0442\u044b",
                        "room_types": [
                            2
                        ]
                    },
                    {
                        "id": 13,
                        "name": "\u0422\u0435\u0441\u0442",
                        "room_types": [
                            0
                        ]
                    },
                    {
                        "id": 14,
                        "name": "\u0422\u0435\u0441\u0442",
                        "room_types": [
                            0
                        ]
                    }
                ],
                "group": {
                    "1": "\u0414\u0432\u0435\u0440\u0438, \u043e\u043a\u043d\u0430",
                    "2": "\u041e\u0442\u043a\u043e\u0441\u044b",
                    "3": "\u041f\u043e\u043b\u044b",
                    "4": "\u041f\u043e\u0442\u043e\u043b\u043a\u0438",
                    "5": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "6": "\u0421\u0430\u043d\u0442\u0435\u0445\u043d\u0438\u043a\u0430",
                    "7": "\u0421\u0442\u0435\u043d\u044b",
                    "8": "\u042d\u043b\u0435\u043a\u0442\u0440\u0438\u043a\u0430",
                    "9": "\u041e\u0442\u043a\u043e\u0441\u044b",
                    "10": "\u041f\u043e\u043b\u044b",
                    "11": "\u041f\u043e\u0442\u043e\u043b\u043a\u0438",
                    "12": "\u0421\u0442\u0435\u043d\u044b",
                    "13": "\u0414\u0432\u0435\u0440\u0438, \u043e\u043a\u043d\u0430",
                    "14": "\u041e\u0442\u043a\u043e\u0441\u044b",
                    "15": "\u041f\u043e\u043b\u044b",
                    "16": "\u041f\u043e\u0442\u043e\u043b\u043a\u0438",
                    "17": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "18": "\u0421\u0442\u0435\u043d\u044b",
                    "19": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "20": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "21": "\u0414\u0435\u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
                    "22": "\u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b",
                    "23": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "24": "\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0441 \u0434\u043b\u044f \u0437\u0430\u043c\u0435\u043d\u044b \u0440\u0430\u0434\u0438\u0430\u0442\u043e\u0440\u0430(\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442)",
                    "25": "\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0441 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u0432\u0430\u0440\u043a\u0438 \u0413\u0412\u0421(\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442)",
                    "26": "\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0441 \u0434\u043b\u044f \u043f\u0435\u0440\u0435\u0432\u0430\u0440\u043a\u0438 \u0425\u0412\u0421(\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442)",
                    "27": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "28": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "29": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "30": "\u041f\u0440\u043e\u0447\u0438\u0435",
                    "31": "222"
                }
            }
        }
}
