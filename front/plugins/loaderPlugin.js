export default defineNuxtPlugin((nuxtApp) => {
  const modalLoadingIndicator = ref(false);

  const showModalLoader = () => {
    modalLoadingIndicator.value = true;
  };

  const hideModalLoader = () => {
    modalLoadingIndicator.value = false;
  };

  return {
    provide: {
      modalLoader: {
        modalLoadingIndicator,
        showModalLoader,
        hideModalLoader
      }
    }
  };
});