import qs from 'qs';

export const fetchUsers = async () => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.get("/users")
        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        console.log("[imboxServices] fetchUsers error", error);
        return { success: false, error}
    }

};

export const fetchMessages = async (params) => {
    const {$api} = useNuxtApp();

    if (!params) params = {};

    let queryParams = {...params};
    if (params.filter) {
        queryParams.filter = {...params.filter}; // Избавляемся от proxy в filter
    }

    if (typeof params.search != 'undefined' && params.search.length == 0) {
        delete queryParams.search;
    }

    // Чтобы запрос был как в канбане ?stages[1] = 1 и т.п.
    let stagesArr = [];
    if (params.filter?.stage) {
        queryParams.filter.stage = {}; 
        for (let stage of params.filter.stage) {
            stagesArr[stage] = stage;
        }
        queryParams.stages = stagesArr;
    }

    let searchParams = qs.stringify(queryParams);

    try {
        const response = await $api.get(`/im/messages?${searchParams}`)
        return {
            success: true,
            data: response,
        }
    } catch (error) {
        console.log("[imboxServices] fetchMessages error", error);
        return { success: false, error}
    }

};

export const fetchLists = async () => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.get("/imbox/lists")
        return {
            success: true,
            data: response,
        }
    } catch (error) {
        return { success: false, error}
    }

};

export const setImboxMessageViewed = async(messageId) => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.post(`/messages/viewed/${messageId}`)
        return {
            success: true,
            data: response,
        }
    } catch (error) {
        return { 
            success: false, 
            error: error.response
        }
    }    
}

export const createGroupChat = async (title,users,ownerId) => {
    const {$api} = useNuxtApp();

    let groupData = {
        title: title,
        users: users,
        owner: ownerId
    }

    try {
        const response = await $api.post(`/im_groups`,groupData);
        return {
            success: true,
            data: response,
        }
    } catch (error) {
        return { 
            success: false, 
            error: error.response
        }
    }     

}

export const updateGroupChat = async (groupId,title,users) => {
    const {$api} = useNuxtApp();

    let groupData = {
        title: title,
        users: users
    }

    try {
        const response = await $api.put(`/im_groups/${groupId}`,groupData);
        return {
            success: true,
            data: response,
        }
    } catch (error) {
        console.log('[imboxServices.js] updateGroupChat error', error, error.response);
        return { 
            success: false, 
            error: error.response._data
        }
    }     

}

export const fetchGroupInfo = async (groupId) => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.get(`/im_groups/${groupId}`);
        return {
            success: true,
            // data: response,
            data: response
        }
    } catch (error) {
        return { 
            success: false, 
            error: error.response
        }
    }  
}

// export const fetchChatMessages = async (room) => {
//     const {$api} = useNuxtApp();

//     try {
//       const response = await $api.get(`/messages?include=user&filter[room]=${room}`);
//       return {
//         data: response.data,
//         success: true,
//       }

//   } catch (error) {
//       console.log(`Ошибка при получении сообщений чата ${room}`, error);
//       return {
//         error,
//         success: false
//       }
//   } finally {
//   }    

// }