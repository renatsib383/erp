import qs from "qs";
import {formatDateTimeStr} from "~/utils/date-functions.js";

const setDealDates = (deal) => {
    let date_start = null;
    let date_end = null;
    if (deal.date_start) {
        date_start = String(deal.date_start).split('GMT')[0];
    }
    if (deal.date_end) {
        date_end = String(deal.date_end).split('GMT')[0];
    }
    return {
        ...deal,
        date_start,
        date_end
    }
}

export const createDeal = async (deal) => {
    const {$api} = useNuxtApp();
    const dealData = setDealDates(deal)

    try {
        const response = await $api.post('/deals', dealData);
        const newDeal = await response.deal;
        newDeal.noCollapsed = true;

        return {
            success: true,
            deal: newDeal
        }
    } catch (e) {
        console.error(e,);
        return {success: false, msg: e.response._data.message};
    }
};

export const updateDeal = async (deal, errorMessages, chatContacts, isDealChanged, dealChanged) => {
    const { $showSuccessToast, $showErrorToast, $api} = useNuxtApp();
    const dealData = setDealDates(deal)

    try {
        const response = await $api.put(`/deals/${deal.id}`, dealData);

        if(response.deal){
            $showSuccessToast('Объект успешно обновлён!');
            if(errorMessages, chatContacts, isDealChanged, dealChanged){
                chatContacts.value = response.deal.contacts;
                errorMessages.value = {};
                isDealChanged.value = false;
                dealChanged.value = true;
                setTimeout(() => {
                    dealChanged.value = false;}, 2000);
            }
            return {
                success: true,
                deal: response.deal
            }
        }
    } catch (e) {
        console.log('[dealServices.js] updateDeal',e.response);
        if (e.response && e.response._data.errors) {
            errorMessages.value ? errorMessages.value = e.response._data.errors : null;
        }
        if(e.response._data.message) $showErrorToast(e.response._data.message)
        return {
            success: false,
            e
        }
    }
};

export const updateDealFrom = (deal, updateStatusMessage, originalDeal) => async (from) => {
    const {$showSuccessToast, $showErrorToast, $showInfoToast, $api} = useNuxtApp();
    updateStatusMessage.value.msg = 'Загрузка...';
    $showInfoToast("Загрузка...")

    try {
        let response;
        if (from === 'SAB') {
            response = await $api.get(`/sab/${deal.value.id}`);
        } else if (from === 'AMO') {
            response = await $api.get(`/amo/${deal.value.id}`);
        }
        if(response.id){
            for (const [key, value] of Object.entries(await response)) {
                originalDeal.value[key] = value;
            }
            $showSuccessToast('Данные объекта обновлены!')
        }


    } catch (e) {
        console.error(e);
        $showErrorToast(e.response._data.message)
    }
};

export const fetchDeal = async (path) => {
    const {$api} = useNuxtApp();
    const store = useMainStore()
    try {
        const response = await $api.get(`/deals/${path}`);

        const data = {
            deal: response.deal,
            lists : response.lists,
        }
        if(!response.deal){
            return null
        }
        return data
    } catch (error) {
        if(error.response && error.response.status === 404){
            const removedModal = {
                modalData : {id: path},
                modalTitle: 'deal',
                date: formatDateTimeStr(new Date()),
            }
            store.removeModalFromList(removedModal)
        }
        console.log(error);
        return null
    }

}

export const fetchKanbanData = async(props, emit, stagesArr, dealsLimit, loading, offset=0 ) => {
    const {$api} = useNuxtApp();

    loading.value = "deals";
    emit("set-loading", "deals");

    if (props.asideParams.filter?.partner) {
        JSON.stringify(props.asideParams.filter.partner);
    }

    const query = {
        stages: stagesArr.value,
        limit: dealsLimit,
        pipeline: props.asideParams.pipeline,
        filter: props.asideParams.filter,
        search:  props.asideParams.search ? props.asideParams.search : null,
        offset,
    };

    const url = `/deals/kanban?${qs.stringify(query, { encode: false })}`;

    try {
        return await $api.get(url)
    } catch (error) {
        console.log("[Kanban] loadData error", error);
        return error
    } finally {
        loading.value = "";
        emit("set-loading", "");
    }
};

export const fetchTableData = async (params, props, first, rows) => {
    const {$api} = useNuxtApp();

    const sortByCreatedDate = [{
        field: "created_at",
        order: -1,
    }];
    const rawParams = {
        first: first.value || 0,
        rows: rows || 25,
        search:  props.asideParams.search ? props.asideParams.search : null,
        filter: props.asideParams.filter,
        sort:  params.value.multiSortMeta ? params.value.multiSortMeta : sortByCreatedDate,
    };

    const fullParams = Object.fromEntries(Object.entries(rawParams).filter(([_, v]) => v || v === 0));

    const url = `/deals/table?${qs.stringify(fullParams, { encode: false })}`;

    try {
        const response = await $api.get(url)
        return {
            success: true,
            data: {
                records: response.records,
                total: response.total
            },
        }
    } catch (error) {
        return { success: false, error}
    }

};

export const getListsData = async () => {
    const {$api} = useNuxtApp();
    try {
        // return dealData.lists
        return await $api.get(`/lists/deal`)
    } catch (error) {
        console.log(error)
        return null
    }
}