export const getActivityData = async (selectedDate, offset, limit=20) => {
    const startDate = formatDateForServer(selectedDate[0]);
    const endDate = formatDateForServer(selectedDate[1]);
    const {$api} = useNuxtApp();

    const params = new URLSearchParams();
    startDate ? params.append('start', startDate) : null;
    endDate ? params.append('end', endDate) : params.append('end', startDate);
    params.append('offset', offset);
    params.append('limit', limit);

    try {
        return await $api.get(`/activity?${params.toString()}`);
    } catch (e) {
        console.error('Error fetching activity data:', e);
        throw e; // Пробрасываем ошибку для обработки на уровне вызова
    }
};