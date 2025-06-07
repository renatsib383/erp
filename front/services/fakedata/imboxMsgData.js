export const ImboxService = {
    getImboxData() {
        return {
            data: {
                "messages": [
                    {
                        "id": 99,
                        "room": "deal__4",
                        "reply_to": null,
                        "file": {
                            "name": "Шляхов А. - Химия на пальцах в иллюстрациях (Большая энциклопедия вундеркинда) - 2019.pdf",
                            "ext": "pdf",
                            "size": 95291215,
                            "url": "deal__4/1nLKLL5ufSbcAsJC135z9ucf6D86aBCxx4i6sxI6.pdf",
                            "mime": "application/pdf",
                            "dimensions": false
                        },
                        "text": 'test',
                        "audio": null,
                        "user_id": 33,
                        "recipient": null,
                        "phone": null,
                        "is_viewed": false,
                        "whatsapp_id": null,
                        "created_at": "2024-12-22T14:45:24.000000Z",
                        "updated_at": "2024-12-22T14:45:24.000000Z",
                        "deleted_at": null,
                        "user": {
                            "id": 33,
                            "name": "FRONTEND",
                            "fio": "Майя"
                        },
                        "deal_id": 4,
                        "uid": "TEST 0022"
                    },
                    // {
                    //     "id": 95,
                    //     "room": "deal__6",
                    //     "reply_to": null,
                    //     "file": null,
                    //     "text": "1",
                    //     "audio": null,
                    //     "user_id": 3,
                    //     "recipient": null,
                    //     "phone": null,
                    //     "is_viewed": false,
                    //     "whatsapp_id": null,
                    //     "created_at": "2024-12-19T06:36:17.000000Z",
                    //     "updated_at": "2024-12-19T06:36:17.000000Z",
                    //     "deleted_at": null,
                    //     "user": {
                    //         "id": 3,
                    //         "name": "КАС",
                    //         "fio": "Киселев Андрей Сергеевич"
                    //     },
                    //     "deal_id": 6,
                    //     "uid": null
                    // },
                    // {
                    //     "id": 94,
                    //     "room": "deal__2",
                    //     "reply_to": null,
                    //     "file": {
                    //         "name": "SampleVideo_360x240_1mb.mp4",
                    //         "ext": "mp4",
                    //         "size": 1053651,
                    //         "url": "deal__2/6CjbKpH1GJTEPgd6uwbcRGxWl7OFeRI5RHVqjLgP.mp4",
                    //         "mime": "video/mp4",
                    //         "dimensions": false
                    //     },
                    //     "text": null,
                    //     "audio": null,
                    //     "user_id": 33,
                    //     "recipient": null,
                    //     "phone": null,
                    //     "is_viewed": false,
                    //     "whatsapp_id": null,
                    //     "created_at": "2024-12-18T16:24:18.000000Z",
                    //     "updated_at": "2024-12-18T16:24:18.000000Z",
                    //     "deleted_at": null,
                    //     "user": {
                    //         "id": 33,
                    //         "name": "FRONTEND",
                    //         "fio": "Майя"
                    //     },
                    //     "deal_id": 2,
                    //     "uid": "TEST"
                    // },
                    // {
                    //     "id": 91,
                    //     "room": "deal__1",
                    //     "reply_to": null,
                    //     "file": {
                    //         "name": "Снимок экрана 2024-01-26 093027.jpg",
                    //         "ext": "jpg",
                    //         "size": 357208,
                    //         "url": "deal__1/i0w2KS3DKLCbbuUOuDFODjf2bq3QKLaC4A4c0yGW.jpg",
                    //         "mime": "image/jpeg",
                    //         "dimensions": {
                    //             "0": 2202,
                    //             "1": 1266,
                    //             "2": 2,
                    //             "3": "width=\"2202\" height=\"1266\"",
                    //             "bits": 8,
                    //             "channels": 3,
                    //             "mime": "image/jpeg"
                    //         },
                    //         "thumb": "deal__1/t-i0w2KS3DKLCbbuUOuDFODjf2bq3QKLaC4A4c0yGW.jpg"
                    //     },
                    //     "text": null,
                    //     "audio": null,
                    //     "user_id": 3,
                    //     "recipient": null,
                    //     "phone": null,
                    //     "is_viewed": false,
                    //     "whatsapp_id": null,
                    //     "created_at": "2024-12-17T09:25:47.000000Z",
                    //     "updated_at": "2024-12-17T09:25:48.000000Z",
                    //     "deleted_at": null,
                    //     "user": {
                    //         "id": 3,
                    //         "name": "КАС",
                    //         "fio": "Киселев Андрей Сергеевич"
                    //     },
                    //     "deal_id": 1,
                    //     "uid": "7777777"
                    // },
                    // {
                    //     "id": 69,
                    //     "room": "deal__3",
                    //     "reply_to": null,
                    //     "file": null,
                    //     "text": "3",
                    //     "audio": null,
                    //     "user_id": 748,
                    //     "recipient": 42,
                    //     "phone": "79966249344",
                    //     "is_viewed": false,
                    //     "whatsapp_id": null,
                    //     "created_at": "2024-12-05T11:29:20.000000Z",
                    //     "updated_at": "2024-12-05T11:29:20.000000Z",
                    //     "deleted_at": null,
                    //     "user": {
                    //         "id": 748,
                    //         "name": "Dazzv",
                    //         "fio": "Давлат Азизов"
                    //     },
                    //     "deal_id": 3,
                    //     "uid": "Dazzv test 2"
                    // }
                ],
                needReaction: 1,
            },
        }
    },

    msgNum: 50,

    dataLong: {
        data: {
            messages: []
        }
    },

    getImboxDataLong() {

        if (this.dataLong.data.messages.length > 0) return this.dataLong;

        const data = this.getImboxData();
        for (var i=0; i<this.msgNum; i++) {
            let portion = data.data.messages.map(item => {
                let id = item.id + 1000*i
                let res = {
                    ...item,
                    id: id,
                    uid: `TEST_${i}`
                }
                return res;
            });
            this.dataLong.data.messages = [...this.dataLong.data.messages, ...portion];
        }
        // console.log('[ImboxNotifications] getImboxDataLong', this.dataLong);
        return this.dataLong;
    },

    getImbox() {
        return Promise.resolve(this.getImboxData());
    },

    getImboxPortion(start,finish) {
        // console.log('[ImboxNotifications] getImboxPortion', start, finish);
        let result = {
            data: {
                messages: []
            }
        };
        let full = this.getImboxDataLong();
        result.data.messages = [...full.data.messages];
        // console.log('[ImboxNotifications] getImboxPortion full', full.data.messages);
        result.data.messages = result.data.messages.slice(start,finish);
        result.data.needReaction = 1;
        // console.log('[ImboxNotifications] getImboxPortion result', result);
        return Promise.resolve(result);
    },    
};

