import qs from "qs";

export const fetchPositions = async (event, page, params, search, multiSortMeta, first, ) => {
    const { $api } = useNuxtApp();
    let rawParams = {
        search: search.value || null
    };

    rawParams = Object.fromEntries(Object.entries(rawParams).filter(([_, v]) => v));

    if (Object.keys(page).length > 0) {
        rawParams.page = {};
        for (let key of Object.keys(page)) {
            if (page[key]) {
                rawParams.page[key] = page[key];
            }
        }  
    }  

    let searchParams = qs.stringify(rawParams, {encode: false});
    
    try {
        const response = await $api.get(`/staff/positions?${searchParams}`, );
        return {
            success: true,
            data: {
                positions: response.data.records,
                total: response.total,
            },
        }
    } catch (e) {
        console.error(e);
        return { success: false, e };
    }
};

export const fetchPosition = async (id) => {
    const { $api } = useNuxtApp();

    try {
        const response = await $api.get(`staff/positions/${id}`);
        return {
            success: true,
            data:  response.data,
        }
    } catch (e) {
        console.error(e);
        return { success: false, e };
    }

}