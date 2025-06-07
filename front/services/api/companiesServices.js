import {companiesList} from "~/services/fakedata/companiesData.js";
import qs from "qs";

export const fetchCompanies = async (event, page, params, first, multiSortMeta, search) => {
    const { $api } = useNuxtApp();

    let rawParams = {
        search: search ? search : null,
    };
    
    rawParams = Object.fromEntries(Object.entries(rawParams).filter(([_, v]) => v));

    if (Object.keys(page).length > 0) {
        rawParams.page = {};
        for (let key of Object.keys(page)) {
            if (page[key]) {
                rawParams.page[key] = page[key];
            }
        }  
    }      

    let searchParams = qs.stringify(rawParams, {encode: false});

    try {
        const response = await $api.get(`/companies?${searchParams}&include=events.user`)
        return {
            success: true,
            companies: response.data,
            total: response.total,
        }

    } catch (e) {
        console.error(e);
        return { success: false, e };
    }
};

export const fetchCompany = async (id) => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.get(`/companies/${id}?include=events`)
        // const response = {
        //     data: companiesList.data.records.find(c => c.id === Number(id))
        // }
        return {
            success: true,
            data: response,
        };
    } catch (e) {
        console.log(e)
        return { success: false, e };
    }
}

export const deleteAccount = async(account) => {
    const { $api } = useNuxtApp();
    try {
        await $api.delete(`/companies/account/${account.id}`);
    } catch (e) {
        console.log(e)
    }
}

export const saveCompany = async (company, companyOriginal) => {
    const { $api } = useNuxtApp();

    if (!company.name || !company.inn || !company.town || !company.general_director || typeof company.sort !== 'number') {
        return { success: false, error: 'emptyFields' };
    }

    try {
        if (company.id) { // Обновление
            const response = await $api.put(`/companies/${company.id}`, company);
            if (response.status === 200) {
                return { success: true, data: response.data, type: 'update' };
            }
        } else { // Создание
            const response = await $api.post("companies", company);
            if (response.status === 200) {
                return { success: true, data: response.data, type: 'create' };
            }
        }
    } catch (error) {
        console.error(error);
        return { success: false, error };
    }
};

export const deleteCompany = async (id) => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.delete(`/companies/${id}`);
        if (response.status === 200) {
            return { success: true, };
        }
    } catch (error) {
        console.error("Error on delete company", error);
    }
}

export const uploadFiles = async (file, companyId, type) => {
    const { $api } = useNuxtApp();

    if (!file) return { success: false, message: "File is required" };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", companyId);
    formData.append("field_name", type);

    try {
        const response = await $api.post(`/companies/${companyId}/upload`, formData);
        return {
            success: true,
            data: response.data,
            type: 'update',
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            message: "Error uploading file",
            error,
        };
    }
};

export const deleteImage = async (companyId, type) => {
    const { $api } = useNuxtApp();
    try {
        const response = await $api.delete(`/companies/${companyId}/${type}`);
        return {
            success: true,
            data: response.data || null,
        };
    } catch (error) {
        console.error("Error deleting company image:", error);
        return {
            success: false,
            error,
        };
    }
};

