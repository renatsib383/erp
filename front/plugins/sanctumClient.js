export default defineNuxtPlugin(() => {
    const client = useSanctumClient();

    const api = {
        get(url, options = {}) {
            return client(url, { ...options, method: 'GET' });
        },
        post(url, data, options = {}) {
            return client(url, { method: 'POST', body: data });
        },
        put(url, data, options = {}) {
            return client(url, { method: 'PUT', body: data });
        },
        patch(url, data, options = {}) {
            return client(url, { method: 'PATCH', body: data });
        },
        delete(url, options = {}) {
            return client(url, { ...options, method: 'DELETE' });
        },
    };

    return {
        provide: {
            api,
        },
    };
});