export const fetchNotifications = async (offset = 0, limit = 50) => {
    try {
        const { $api } = useNuxtApp();
        const response = await $api.get(`/notifications/list?limit=${limit}&offset=${offset}`);
        const read = [];
        const unread = [];

        for (const notification of response) {
            if (notification.read_at) {
                read.push(notification);
            } else {
                unread.push(notification);
            }
        }

        return {read, unread};
    } catch (error) {
        console.error("Ошибка загрузки уведомлений:", error);
        return [];
    }
}

export const markNoteAsRead = async (id) => {
    try {
        const { $api } = useNuxtApp();
        await $api.post(`/notifications/read/${id}`);
    }
    catch (e) {
        console.error("Ошибка при отметке уведомления:", e);
    }
}

export const markAllNotesAsRead = async () => {
    try {
        const { $api } = useNuxtApp();
        await $api.post(`/notifications/read-all`);
    }
    catch (e) {
        console.error("Ошибка при отметке уведомлений:", e);
    }
}