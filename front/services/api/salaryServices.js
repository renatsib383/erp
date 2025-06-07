import qs from "qs";

export const getSalaryList = async(loading, asideParams, offset = 0, limit = 50) => {
  const {$api} = useNuxtApp()
  loading.value = true

  const period = asideParams?.params?.period;

  let preparedParams = {
    start : period ? period : null,
    end : period ? new Date(period.getFullYear(), period.getMonth() + 1, 0) : null,

    filter : asideParams?.params?.filter,
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
    const list = await $api.get(`/salary?limit=${limit}&offset=${offset}&${searchParams}`);
    return {
      status: 'success',
      data: list,
    }
  } catch (e) {
    console.log(e)
    return { status: false }
  } finally {
    loading.value = false;
  }
}