import { setTaskColor } from '~/utils/task-utils.js';
import qs from 'qs';

export const fetchTasks = async (currentPeriod, asideParams) => {

    // Чтобы запрос был как в канбане ?stages[1] = 1 и т.п.
    let stagesArr = [];
    if (asideParams.stages) {
        asideParams.stages.forEach((stage, index) => {
            stagesArr[index] = stage;
        })
    }    

    if (currentPeriod) {
        // Оставляю только заполненные поля
        const filter = Object.fromEntries(
            Object.entries({
                type: asideParams.type ? asideParams.type.map(item => item.code) : null,
                performer: asideParams.performer ? asideParams.performer.map(item => item.id) : null,
                author: asideParams.author ? asideParams.author.map(item => item.id) : null,
                completed: asideParams.completed ? 1 : null,
                overdueOnly: asideParams.overdueOnly ? 1 : null,
                stage: stagesArr || null,
            }).filter(([_, value]) => value !== null)
        );

        const endDate = new Date(currentPeriod.endStr);
        endDate.setDate(endDate.getDate() - 1); // Отнимаем 1 день

        const params = {
            start: currentPeriod.startStr,
            end: endDate.toISOString(),
            filter,
        };        

        // Настроим searchParams и запишем в URL
        let searchParams = qs.stringify(params, {encode: false});
        const oldURL = window.location.href;
        const newUrl = searchParams ? `${window.location.pathname}?${searchParams}` : null;
        if (newUrl) {
            history.pushState(oldURL, '', newUrl);
        } else {
            history.pushState(oldURL, '', window.location.pathname);
        }
    
        const {$api} = useNuxtApp()

        try {
            const response = await $api.get(`/tasks?${searchParams}`);
            return setTaskColor(response); // Возвращаем обработанные задачи
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    return [];
}

export const fetchTaskLists = async () => {
    const {$api} = useNuxtApp()

    const lists = {
        users: [],
        pipelines: {},
        tasks: {
            statuses: [],
            types: []
        }
    }

    try {
        const response = await $api.get('/lists/deal');
        return {
            success: true,
            lists: response
        }
    }
    catch(error) {
        console.log('[asideDealServices] error when fetch users',error);
        return {
            success: false,
            lists: lists,
            error
        }
    }    

}


export const createTask = async (task) => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.post(`/tasks`, task);
        return {
            success: true,
            data: response,
        }
    }
    catch(error) {
        console.log('[taskServices] createTask error',error);
        return {
            success: false,
            errors: error.response && error.response._data.errors,
        }        
    }

}


export const updateTask = async (task) => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.put(`/tasks/${task.id}`, task);
        return {
            success: true,
            data: response,
        }
    }
    catch(error) {
        return {
            success: false,
            errors: error.response && error.response._data.errors,
        }        
    }

}
