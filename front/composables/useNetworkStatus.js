export const useNetworkStatus = () => {
    const isOffline = ref(false);
  
    const updateNetworkStatus = () => {
      isOffline.value = !navigator.onLine;
    };
  
    onMounted(() => {
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);
      updateNetworkStatus(); // Проверяем при загрузке
    });
  
    onUnmounted(() => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    });
  
    return { isOffline };
  };