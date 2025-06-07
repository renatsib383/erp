import {roles} from "~/services/fakedata/rolesList.js";
import qs from "qs";


export const fetchRoles = async (event, page, first, multiSortMeta, search, asideParams ) => {
    const { $api } = useNuxtApp();
    let params = {
        // sort: event?.multiSortMeta || multiSortMeta,
        search: search || null
    };

    params = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
    
    if (Object.keys(page).length > 0) {
      params.page = {};
      for (let key of Object.keys(page)) {
          if (page[key]) {
              params.page[key] = page[key];
          }
      }  
    }  

    const query = qs.stringify(params, {encode: false});

    try {
        const response = await $api.get(`/roles?${ query }`);
        // const response = roles;
        return {
            success: true,
            data: {
                roles: response.data,
                total: response.total,
            },
            type: "fetch",
        };
    } catch (error) {
        console.error("Error fetching roles:", error);
        return {
            success: false,
            message: "Error fetching roles",
            error,
        };
    }
};

export const setNewData = async (role, roleOriginal, isRoleChanged, dialogRef, emitNewRole) => {
    const { $api } = useNuxtApp();

    try {
        // Обновление существующей роли
        if(role.value.id){
          const res = await $api(`role.update/${role.value.id}`, role.value)
          if(res.status === 200) {
            for (const [key, value] of Object.entries(res.data)) {
              roleOriginal.value[key] = value;
            }
            dialogRef.value.close();
          }
        } else {
          // Добавление новой роли
          const res = await $api.post("role.store", role.value);
          if (res.status === 201) {
            isRoleChanged.value = false;
            emitNewRole(res.data);
            dialogRef.value.close();
          }
        }
      } catch (e) {
        console.log(e)
      }
};

export const fetchRole = async (id) => {
    const { $api } = useNuxtApp();
    try {
        // const response = await $api.get(`/roles/${id}`)
        const response = {
            data: roles.data.find(role => role.id === Number(id))
        }
        return {
            success: true,
            data: response.data,
        };
    } catch (e) {
        console.log(e)
        return { success: false, e };
    }
}