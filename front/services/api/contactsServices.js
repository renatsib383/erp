import qs from "qs";

export const fetchNumberSuggestions = (query, delay, callback) => {
  const {$api} = useNuxtApp();

  if (delay.value) {
    clearTimeout(delay.value);
  }

  delay.value = setTimeout(async () => {
    try {
      const response = await $api.get(`/contacts?filter[phone]=${query}`);

      let resultArray = [];
      if (!response.data.length && query.length > 10) {
        resultArray = [
          { full_name: "Новый контакт", surname: "Новый", name: "контакт", phone: query },
        ];
      } else {
        resultArray = response.data;
      }

      callback(resultArray);
    } catch (e) {
      console.error(e);
      callback([]);
    }
  }, 300);
};

export const setNewData = async (data) => {
  const store = useMainStore()
  const {$api, $showSuccessToast, $showErrorToast} = useNuxtApp();
  const contact = JSON.parse(JSON.stringify(data));
  // Преобразуем номер телефона, оставляя только цифры
  contact.phone = String(contact.phone).replace(/[^0-9]/g, '');
  contact.full_name = null; // Системное поле в бд, поэтому отправляем пустым

  // Обновление существующего контакта
  if (contact.id) {
    try {
      const response = await $api.put(`/contacts/${contact.id}`, contact);
      $showSuccessToast("Контакт успешно обновлён!")
      return {
        success: true,
        data: response,
        errors: []
      }
    } catch (error) {
      console.error('Error updating contact:', error, error.response._data);
      if (error.response && error.response.status === 403) {
        $showErrorToast('Отказано в доступе')
        return {
          success: false,
          message: 'Отказано в доступе',
          errors: Object.keys(error.response._data.errors)
        }
      }
      $showErrorToast(error.response._data.message)
      return {
        success: false,
        response: error.response,
        message: error.response._data.message,
        errors: Object.keys(error.response._data.errors)
      }
    }
  }

  // Создание нового контакта
  else {
    try {
      const response = await $api.post(`/contacts`, contact);
      $showSuccessToast("Контакт добавлен!")
      return {
        success: true,
        data: response,
        errors: []
      }

    } catch (error) {
      if (error.response && error.response.status === 403) {
        $showErrorToast('Отказано в доступе')
        return {
          success: false,
          message: 'Отказано в доступе',
          errors: Object.keys(error.response._data.errors)
        }
      }
      console.error('Error creating new contact:', error);
      $showErrorToast(error.response._data.message)
      return {
        success: false,
        message: error.response._data.message,
        errors: Object.keys(error.response._data.errors)
      }
    } finally {
      store.hideModalLoader()
    }
  }
};

export const fetchContacts = async (event, page, params, first, multiSortMeta, search) => {
  const { $api, $showErrorToast } = useNuxtApp();
  const router = useRouter();

  params = Object.fromEntries(
    Object.entries({
      // ...params,
      // first: event?.first || params.first || first,
      // rows: event?.rows || 100,
      // sort: event?.multiSortMeta || multiSortMeta,
      search: search ? search : null,
    }).filter(([_, v]) => v) // Оставляем только непустые значения
  );

  if (Object.keys(page).length > 0) {
    params.page = {};
    for (let key of Object.keys(page)) {
      if (page[key]) {
        params.page[key] = page[key];
      }
    }
  }

  try {
    const response = await $api.get(`/contacts?${qs.stringify(params, {encode: false})}&include=deals,events.user`, );
    return {
      success: true,
      data: response.data,
      total: response.total,
    };
  } catch (error) {
    // if (error.response && error.response.status === 403) {
    //   router.push('/403');
    // }
    return { success: false, error };
  }
};

export const fetchContact = async (id) => {
  const { $api } = useNuxtApp();
  try {
    const response = await $api.get(`/contacts/${id}?include=deals,events`)
    // const response = {
    //  data: contacts.data.find(contact => contact.id === Number(id))
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

export const deleteContact = async (id) => {
  const { $api } = useNuxtApp();
  try {
    await $api.delete(`/contacts/${id}`);
    return {
      success: true
    }
  }
  catch(error) {
    console.log('Error when delete contact', error);
    return {
      success: false,
    }
  }

}