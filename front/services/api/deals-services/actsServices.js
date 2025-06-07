export const getActs = (deal, actsList, store, approvedSmeta, connectAllRooms, isAfterAutoCreateSmet) => async () => {
    const {$api} = useNuxtApp();
    actsList.value = [];
    store.showModalLoader()
    try {
        if(isAfterAutoCreateSmet){
            const response = await $api.get(`/acts?filter[deal_id]=${deal.value.id}`);
            actsList.value = await response.data.list;
        } else {
            actsList.value = JSON.parse(JSON.stringify(deal.value.acts));
        }
    } catch (e) {
        console.error("Acts loadData error", e);
    } finally {
        store.hideModalLoader()
        if (approvedSmeta.value.rooms.all) {
            await connectAllRooms();
        }
    }
};
