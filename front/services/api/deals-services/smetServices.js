export const updateSmet = async (estimate) => {
    const {$api, $showSuccessToast, $showErrorToast} = useNuxtApp();
    try {
        const response = await $api.put(`/smets/${estimate.id}`, estimate);
        $showSuccessToast('Данные сметы успешно обновлены!')
        return {
            success: true,
            updatedSmet: await response, // Возвращаем обновленные данные
        }
    } catch (e) {
        $showErrorToast(e.response._data.message)
        return { errors: Object.keys(e.response._data.errors) };
    }
};

export const getSmetsList = async (dealId) => {
    const {$api} = useNuxtApp();
    const queryString = `filter[deal_id]=${dealId}`
    try {
        const response = await $api.get(`/smets?filter[deal_id]=${dealId}`);
        return await response.data;
    } catch (e) {
        console.error('[Smets] load error', e);
        return e
    }
};

export const createSmet = async (smet) => {
    const {$api, $showSuccessToast, $showErrorToast} = useNuxtApp();
    try {
        const response = await $api.post('/smets', smet)
        $showSuccessToast('Добавлена новая смета!')
        return {
            success: true,
            data: response
        };
    } catch (e) {
        $showErrorToast(e.response._data.message)
        console.error('Error creating new smet', e);
        return { errors: Object.keys(e.response._data.errors) };
    }
}

export const createAutoSmet = async (dealId) => {
    const {$api} = useNuxtApp();

    const newSmeta = {
        deal_id: dealId,
        name: "Предварительная смета",
        comment: "Смета была создана автоматически на этапе 'Выезд замерщика'",
        rooms: {
            list: [],
            works: {},
        },
        approved: false,
        total: 0,
    };

    try {
        await $api.post('/smets', newSmeta);
    } catch (e) {
        console.error('[Smets] createAutoSmet error', e);
    }
};

export const addCopiedSmetToNewDeal = async (dealId, smetId) => {
    const {$api, $showSuccessToast} = useNuxtApp();
    try {
        const response = await $api.get(`/deals/${dealId}/copy/smet/${smetId}`, { deal: dealId, smet: smetId });
        $showSuccessToast('Смета успешно скопирована!')
        return response
    } catch (e) {
        console.error(['[Smets] copySmet error', e]);
        return null
    }
};