const saveDealNewState = async () => {
    deal.value.tags = tagsArr.value;
    deal.value.telephone = String(deal.value.telephone).replace(/[^0-9]/g, '') // Сохраняем телефон без формата
    addedPipelines.value = addedPipelines.value.filter(pip => pip && pip.stage)
    deal.value.stages = addedPipelines.value.map(pip => pip.stage);
    deal.value.contacts = addedContacts.value.map(contact => {
        return {
            surname: contact.surname,
            name: contact.name,
            patronymic: contact.patronymic,
            phone: String(contact.phone).replace(/[^0-9]/g, '')
        };
    })
    console.log(deal.value)

    if (deal.value.zamer_time && deal.value.zamer_time !== originalDeal.value.zamer_time) {
        if (String(deal.value.zamer_time).length > 8) {
            deal.value.zamer_time = String(deal.value.zamer_time).slice(16, 21) + ":00";
        }
    }
    // Проверка на наличие контакта
    if (!deal.value.contacts.length) {
        errorMessages.value.contacts = true
        if (home.value) {
            home.value.scrollTop = 1200
        }
    } else {
        errorMessages.value.contacts = false
    }
    if (deal.value.type && deal.value.type === 'emptyDeal' && !errorMessages.value.contacts) {
        try {
            const response = await $api.post('/deals', deal.value);
            if (response.status === 201) {
                setTimeout(() => {
                    const deal = response.data;
                    deal.noCollapsed = true
                    // history.pushState(null, null, `${window.location.origin}/deals/${deal.id}`)
                    store.setNewDealToStore(deal)
                }, 0)
            }
        } catch (e) {
            console.error(e)
            if (e.response.data.message === "Телефон уже существует") {
                errorMessages.value.duplicatePhone = e.response.data.message
                errorMessages.value.uid = false
            } else if (e.response.data.message === "Сделка с таким uid уже существует") {
                errorMessages.value.uid = "Сделка с таким uid существует"
                errorMessages.value.duplicatePhone = false
                home.value.scrollTop = 0;
            }
        }
    }
    else if (!deal.value.type && !errorMessages.value.telephone) {
        if (deal.value.skidka !== originalDeal.value.skidka) { // Обновляем прайслист если скидка была изменена
            await createUpdatePriceList('onDealUpdating')
        }

        try {
            const response = await $api.put(`/deals/${deal.id}`, deal.value);
            if (response.status === 200) {
                chatContacts.value = response.data.contacts;
                // Обновление данных сделки
                // Object.entries(response.data).forEach(([key, value]) => {
                //    originalDeal.value[key] = value;
                // });
                chatContacts.value = response.data.contacts;

                errorMessages.value = {};
                isDealChanged.value = false;
                dealChanged.value = true;

                setTimeout(() => {
                    dealChanged.value = false;
                }, 2000)
            }
        } catch (e) {
            if (e.response && e.response.data.errors) errorMessages.value = e.response.data.errors;
            console.log(e);
        }
    }
};