import qs from 'qs';

export const fetchCallsData = async (asideParams, event) => {
    const {$api} = useNuxtApp();

    let preparedParams = {
        search: asideParams.search || null,
        filter: asideParams.filter,
    };

    preparedParams.filter = Object.fromEntries(Object.entries(preparedParams.filter).filter(([_, v]) => v));
    preparedParams = Object.fromEntries(Object.entries(preparedParams).filter(([_, v]) => v));
    let searchParams = qs.stringify(preparedParams, {encode: false});

    const oldURL = window.location.href; // Сохраняем фильтры в URL
    const newUrl = searchParams ? `${window.location.pathname}?${searchParams}` : null;
    if (newUrl) {
      history.pushState(oldURL, '', newUrl);
    } else {
      history.pushState(oldURL, '', window.location.pathname);
    }

    try {
        const response = await $api.get(`/calls?${searchParams}`);
        return {
            success: true,
            data: response.data,
            total: response.data.length,
        };
    } catch (e) {
        console.error("[callsService] fetchCallsData error", e);
        return { success: false, e };
    }
};


export const fetchEmployees = async () => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.get("/staff/employees", {});
        return {
            success: true,
            data: response.data,
        };
    } catch (e) {
        console.error("[callsService] fetchEmployees error", e);
        return { success: false, e };
    }
}