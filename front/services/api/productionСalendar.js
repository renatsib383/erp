export const fetchHolidays = async() => {
    const {$api} = useNuxtApp()
    const currentYear = new Date().getFullYear()
    return await $api.get(`/holidays/get-days?start=${currentYear}-01-01&end=${currentYear}-12-31`);
}