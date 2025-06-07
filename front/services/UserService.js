const api = 'https://api.atloncrm.ru';

export const UserService = {
    async getUsersData() {
        try {
            const data = await $fetch(`${api}/api/users`, {
                method: "GET",
              });
              if (data) {
                return data;
              }
            } catch (e) {
              console.log(e);
            }
    },
    async getUserById(id) {
        return await $fetch(`${api}/api/users/${id}`, {
            method: "GET",
        });
    }
};

