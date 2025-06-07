import qs from "qs";

export const fetchCollections = async (params, page,  first, multiSortMeta, search, event ) => {
    const { $api } = useNuxtApp();

    let requestParams = {
        // ...params,
        // first: event?.first || params.first || first,
        // rows: event?.rows || params.rows || 100,
        // sort: event?.multiSortMeta || multiSortMeta,
        filter: {name : search},
    };
    requestParams.filter = Object.fromEntries(Object.entries(requestParams.filter).filter(([_, v]) => v));
    requestParams = Object.fromEntries(Object.entries(requestParams).filter(([_, v]) => v));

    if (Object.keys(page).length > 0) {
        requestParams.page = {};
        for (let key of Object.keys(page)) {
            if (page[key]) {
                requestParams.page[key] = page[key];
            }
        }  
    } 

    const query = qs.stringify(requestParams, {encode: false})
    try {
        const response = await $api.get(`/works/collections?${query}&include=events.user`)
        return {
            success: true,
            collections: response.data,
            total: response.total,
        }; // Возвращаем записи
    } catch (e) {
        console.error("[fetchCollections] Error:", e);
        return { success: false, e };
    }
};

export const fetchCollection = async (id) => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.get(`/works/collections/${id}?include=events`);
        return { success: true, data: await response,};

    } catch (error) {
        console.error("[fetchSetsData] Error:", error);
        return { success: false, error };
    }
};

// Обновление существующего набора
export const updateSet = async (id, payload) => {
    const {$api, $showSuccessToast, $showErrorToast} = useNuxtApp();
    try {
        const response = await $api.put(`works/collections/${id}`, payload);
        $showSuccessToast("Набор обновлён!")
        return { success: true, data: response };
    } catch (error) {
        $showErrorToast(error.response._data.message)
        return { success: false, errors: Object.keys(error.response._data.errors) };
    }
};

// Создание нового набора
export const createSet = async (payload) => {
    const {$api, $showSuccessToast, $showErrorToast} = useNuxtApp();
    try {
        const response = await $api.post("/works/collections", payload);
        $showSuccessToast("Набор добавлен!")
        return { success: true, data: response };
    } catch (error) {
        $showErrorToast(error.response._data.message)
        return { success: false, errors: Object.keys(error.response._data.errors) };
    }
};

export const deleteSet = async (id) => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.delete(`/works/collections/${id}`);
        if (response.status === 200) {
            return { success: true };
        }
    } catch (error) {
        console.error("[deleteSet] Error:", error.response?.data || error);
        return { success: false, error };
    }
};

// Валидация и подготовка данных
export const validateAndPrepareSetData = (sets, selectedWorks) => {
    const { $showErrorToast } = useNuxtApp();

    const works = selectedWorks.reduce((acc, item) => {
        acc[item.id] = item.default_value ? item.default_value : 1;
        return acc;
    }, {});

    // let emptyFields = [];
    // if(!sets.name) emptyFields.push("name");
    // if(sets.room_type === null) emptyFields.push("room_type");
    // if(!selectedWorks.length) emptyFields.push("works");
    // const isEmptyField = !sets.name || sets.room_type === null || !selectedWorks.length;

    return {
        payload: { ...sets, works },
    };
};