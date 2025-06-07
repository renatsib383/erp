export const getRoomsList = async (dealId) => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.get(`/rooms?filter[deal_id]=${dealId}`,);
        return {
            success: true,
            rooms: await response.data
        };
    } catch (e) {
        console.error("[Rooms] loadData error", e);
        return {success: false, e}
    }
};

export const createRoom = async (newRoom) => {
    const {$api, $showSuccessToast, $showErrorToast} = useNuxtApp();

    try {
        const response = await $api.post("/rooms", newRoom);
        $showSuccessToast('Комната успешно создана!')
        return { success: true, data: response };
    } catch (e) {
        console.log(e);
        $showErrorToast(e.response._data.message)
        return { success: false };
    }
}

export const updateRoom = async (roomToSend) => {
    const {$api, $showSuccessToast, $showErrorToast} = useNuxtApp();

    try {
        const response = await $api.put(`/rooms/${roomToSend.id}`, roomToSend);
        $showSuccessToast('Комната успешно обновлена!')
        return { success: true, data: response };
    } catch (e) {
        console.log(e);
        $showErrorToast(e.response._data.message)
        return { success: false };
    }
}