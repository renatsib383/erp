import qs from 'qs';


export const fetchUser = async ( userId, include = 'events' ) => {
    const { $api } = useNuxtApp();

    try {
        const response = await $api.get(`/users/${userId}?include=roles`);
        return {
            success: true,
            data: response,
            type: "fetch",
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return {
            success: false,
            message: "Error fetching users",
            error,
        };
    }
};


export const fetchUsers = async (event, page, first, multiSortMeta, search, asideParams ) => {
    const { $api } = useNuxtApp();
    console.log(asideParams.filter.chief)
    const params = {
        filter: Object.fromEntries(
            Object.entries({
                name: search,
                chief: asideParams.filter.chief,
            }).filter(([_, v]) => v) // Оставляем только непустые значения
        ),
    };

    if (Object.keys(page).length > 0) {
        params.page = {};
        for (let key of Object.keys(page)) {
            if (page[key]) {
                params.page[key] = page[key];
            }
        }  
    }      

    let searchParams = qs.stringify(params, {encode: false});

    try {
        const response = await $api.get(`/users?include=roles,events&fields[roles]=id,name&latest=1&${searchParams}`);
        return {
            success: true,
            data: {
                users: response.data,
                totalRecords: response.total,
            },
            type: "fetch",
        };
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return {
            success: false,
            message: "Error fetching users",
            error,
        };
    }
};

export const saveUserData = async (user) => {
    const { $api } = useNuxtApp();
    user.telephone = String(user.telephone).replace(/[^0-9]/g, '')

    try {
        if (user.id) { // Обновление пользователя
            const response = await $api.put(`/users/${user.id}`, user);
            return {
                success: true,
                data: response,
                type: "update",
            };
        } else { // Создание нового пользователя
            // const { name, email, password } = user;
            //
            // const isFormValid =
            //     name.length > 0 &&
            //     email.length > 0
            //
            // if (!isFormValid) {
            //     return {
            //         success: false,
            //         message: "Заполните необходимые поля",
            //         type: "validation_error",
            //     };
            // }

            const response = await $api.post(`/users`, user);
            return {
                success: true,
                data: response,
                type: "create",
            };
        }
    } catch (error) {
        console.error("Error saving user data:", error);
        return {
            success: false,
            message: error.response?._data?.message || "Неизвестная ошибка",
            type: "error",
        };
    }
};

export const deleteUser = async (id) => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.delete(`/users/${id}`);
        if (response.status === 200) {
            return { success: true, };
        }
    } catch (error) {
        console.error("Error on delete company", error);
    }
}

const params = {
    include: 'roles',
    fields: {
        users: ['id', 'name'],
        roles: ['id', 'name'],
    },
    filter: {
        roles: [3]
    }
}

export const fetchUsersWithRolesAndNewFilters = async (params) => {
    const { $api, $showErrorToast } = useNuxtApp();

    let rawParams = {
        include: params.include,
        'fields[users]': params.fields?.users?.join(','), // e.g., "id,name"
        'fields[roles]': params.fields?.roles?.join(','), // e.g., "id,name"
        filter: params.filter,
    };

    rawParams = Object.fromEntries(Object.entries(rawParams).filter(([_, v]) => v));

    try {
        const response = await $api.get(`/users?${qs.stringify(rawParams, {encode: false})}`);
        return response.data;
    } catch (e) {
        console.log(e)
        $showErrorToast(e.response?._data?.message);
    }

}