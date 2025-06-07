import qs from "qs";
import {useListsStore} from "~/stores/lists.js";
import {getDDSDuplicates} from "~/utils/dds-utils.js";

export const getData = async (route, dds, ddsOriginal, isChanged, buttonText, $api) => {
  let id = route.params.id ? route.params.id : dds.value?.id;
  if (!id) return;

  try {
    const response = await $api.get(`/dds/${id}`);
    buttonText.value = "Сохранить";
    if(!response.deal){
      response.deal = {
        id: null,
        uid: null,
      }
    }
    dds.value = {...response};
    ddsOriginal.value = {...response};

    setTimeout(() => (isChanged.value = false), 0);
  } catch (e) {
    console.log(e);
  }
};

export const save = async (dds, ddsOriginal, errors, store, isChanged, $api, dialogRef, $showErrorToast) => {
  errors.value = null;
  store.showModalLoader();

  let response = null;
  try {
    if (dds.value.id) {
      response = await $api.put(`/dds/${dds.value.id}`, dds.value);

      for (const [key, value] of Object.entries(response)) {
        dds.value[key] = value;
        ddsOriginal.value[key] = value;
      }
      setTimeout(() => store.addNewDDSToTable(response));
    } else {
      response = await $api.post('/dds', dds.value);
      dialogRef?.value.close();
      store.setNewModal({ modalData: response, modalTitle: 'dds' });
      store.addNewDDSToTable(response);
    }
    setTimeout(() => (isChanged.value = false));
  } catch (e) {
    console.log(e);
    $showErrorToast(e.response._data.message)
  } finally {
    store.hideModalLoader();
  }
};

export const uploadFile = async (file, dds, isChanged, $api) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("dds_id", dds.value.id);

  try {
    const response = await $api.post(`/dds/${dds.value.id}/upload`, formData);
    if (!dds.value.files?.length) {
      dds.value.files = [];
    }
    dds.value.files.push(response.file);
  } catch (error) {
    console.error("Error uploading file:", error);
  }

  setTimeout(() => (isChanged.value = false), 0);
};

export const getDDSList = async (loading, ddsList, asideParams) => {
  const {$api} = useNuxtApp()
  const period = asideParams?.params?.period;

  let preparedParams = {
    search: asideParams?.search || null,
    start : period ? period : null,
    end : period ? new Date(period.getFullYear(), period.getMonth() + 1, 0) : null,
    latest : asideParams?.latest >= 1 ? asideParams.latest : '',

    filter : asideParams.params.filter,
  };

  preparedParams.filter ? preparedParams.filter = Object.fromEntries(Object.entries(preparedParams.filter).filter(([_, v]) => v || v === 0)) : null;
  preparedParams = Object.fromEntries(Object.entries(preparedParams).filter(([_, v]) => v));
  let searchParams = qs.stringify(preparedParams, {encode: false});

  const oldURL = window.location.href; // Сохраняем фильтры в URL
  const newUrl = searchParams ? `${window.location.pathname}?${searchParams}` : null;
  if (newUrl) {
    history.pushState(oldURL, '', newUrl);
  } else {
    history.pushState(oldURL, '', window.location.pathname);
  }

  try {
    loading.value = true;
    const res = await $api.get(`/dds?${searchParams}`);

    // Поиск дубликатов
    ddsList.value = await getDDSDuplicates(res.list)

    useListsStore().setDdsStatistics(res.cashRegisters, res.operations)
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

export const sendComment = async (dds, comment, store, dialogRef, emit) => {
  const {$api, $showErrorToast, $showSuccessToast} = useNuxtApp()

  try {
    store.showModalLoader();
    await $api.post(`/dds/${dds.id}/comment`, { comment: comment.value });
    $showSuccessToast('Комментарий добавлен!');
    emit("save", { comment: comment.value });
    setTimeout(() => dialogRef.value.close());
  } catch (e) {
    console.log(e);
    $showErrorToast(e.response._data.message);
  } finally {
    store.hideModalLoader();
  }
};

export const getDDSLists = async () => {
  const {$api} = useNuxtApp()

  try {
    const response = await $api.get('/dds/list');

    const type = response?.type;
    const cashRegister = response?.cashRegister
    const users = response?.users

    // Преобразуем данные
    const typeArray = Object.keys(type).map(key => ({
      id: Number(key),
      title: type[key]?.title || '',
      items: type[key]?.items
        ? Object.keys(type[key].items).map(itemKey => ({
          id: itemKey,
          title: type[key].items[itemKey] || '',
        }))
        : [],
    }));

    const cashRegisterArray = Object.keys(cashRegister).map(key => ({
      id: Number(key),
      title: cashRegister[key] || '',
    }));

    const usersArray = Object.keys(users).map(key => ({
      code: Number(key),
      label: users[key] || '',
    }));

    return {
      ...response, // Сохраняем остальные поля response
      type: typeArray ? typeArray : [],
      cashRegister : cashRegisterArray ? cashRegisterArray : [],
      users : usersArray ? usersArray : [],
    }
  }
  catch (e) {
    console.log(e);
    return null;
  }
};

export const fetchDealSuggestions = async($api, query) => {
  try {
    const response = await $api.get(`/deals/table?first=0&rows=10&sort[0][field]=created_at&sort[0][order]=-1&search=${query}`);
    return response.records
  } catch (e) {
    console.error(e);
    return []
  }

};