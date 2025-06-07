export const createUpdatePriceList = (deal, store, smets, autoCreateNewSmet, updatePrices, updateActiveEstimateTotal, isDealChanged) => async (whenDealUpdating) => {
    const { $showSuccessToast, $showErrorToast} = useNuxtApp();
    const {$api} = useNuxtApp();

    store.showModalLoader()
    try {
        const response = await $api.post(`/deals/${deal.value.id}/price`, { skidka: deal.value.skidka});
        deal.value.price = await response.price;
        deal.value.skidka = await response.skidka;
    } catch (e) {
        console.error('Deals price-list create error: ', e);
        $showSuccessToast('Ошибка при сформирование прайслиста')
    } finally {
        setTimeout(() => {
            if (!smets.value.length) {
                autoCreateNewSmet();
            }
            updatePrices();
            updateActiveEstimateTotal();
        }, 0);

        setTimeout(() => {
            store.hideModalLoader()
            isDealChanged.value = false
        });
    }
};