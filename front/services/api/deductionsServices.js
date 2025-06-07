import qs from "qs";

export const getDeductionsList = async (loading, deductionsList, asideParams) => {
    const {$api} = useNuxtApp()
    const period = asideParams?.params?.period;

    let preparedParams = {
        // search: asideParams?.search || null,
        start : period ? period : null,
        end : period ? new Date(period.getFullYear(), period.getMonth() + 1, 0) : null,
        latest : asideParams?.latest >= 1 ? asideParams.latest : '',

        filter : asideParams.params.filter,
    };

    preparedParams.filter ? preparedParams.filter = Object.fromEntries(Object.entries(preparedParams.filter).filter(([_, v]) => v || v === 0)) : null;
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
        loading.value = true;
        const res = await $api.get(`/deductions?${searchParams}`);

        deductionsList.value = res;
    } catch (e) {
        console.log(e);
    } finally {
        loading.value = false;
    }
}

export const createSaveDeduction = async (deduction, deductionOriginal, store, isChanged, $api, dialogRef, $showErrorToast) => {
    store.showModalLoader();

    let response = null;
    try {
        if (deduction.value.id) {
            response = await $api.put(`/deductions/${deduction.value.id}`, deduction.value);

            for (const [key, value] of Object.entries(response)) {
                deduction.value[key] = value;
                deductionOriginal.value[key] = value;
            }
            setTimeout(() => store.addNewDeductionToTable(response));
        }
        else {
            response = await $api.post('/deductions', deduction.value);
            dialogRef?.value.close();
            store.setNewModal({ modalData: response, modalTitle: 'deduction' });
            store.addNewDeductionToTable(response);
        }
        setTimeout(() => (isChanged.value = false));
    } catch (e) {
        console.log(e);
        $showErrorToast(e.response._data.message)
    } finally {
        store.hideModalLoader();
    }
};

export const getDeductionData = async (route, deduction, deductionOriginal, isChanged, buttonText, $api) => {
    let id = route.params.id ? route.params.id : deduction.value?.id;
    if (!id) return;

    try {
        const response = await $api.get(`/deductions/${id}`);
        buttonText.value = "Сохранить";
        if(!response.deal){
            response.deal = {
                id: null,
                uid: null,
            }
        }
        deduction.value = {...response};
        deductionOriginal.value = {...response};

        setTimeout(() => (isChanged.value = false), 0);
    } catch (e) {
        console.log(e);
    }
};