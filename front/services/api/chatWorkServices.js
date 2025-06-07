export const fetchMessages = async (room) => {
    const {$api} = useNuxtApp();

    try {
      const response = await $api.get(`/messages?include=user,recipient,replyTo.user&filter[room]=${room}`);
      return {
        data: response.data,
        success: true,
      }

  } catch (error) {
      console.log('Ошибка при получении сообщений чата', error);
      return {
        error,
        success: false
      }
  } finally {
  }    

}

export const createMessage = async (messageData) => {
    const {$api} = useNuxtApp();

    try {
      const response = await $api.post(`/messages`,messageData);
      return {
        data: response,
        success: true,
      }

  } catch (error) {
      console.log('Ошибка при отправке сообщения в Чат', error);
      return {
        error,
        success: false
      }
  } finally {
      // loading.value = false;
  }    

      // axios
      // .get(route("deals.feed",this.deal_id))
      // .then(
      //   (response) => {
      //     if (response.data.feed.length !== 0) {
      //       this.messages = response.data.feed;
      //       // this.groupByDate(response.data.feed);
      //       // this.scrollChatBody();
      //        this.isMounted = true;
      //     }
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );

}

export const fetchDeal = async (dealId) => {
    const {$api} = useNuxtApp();

    try {
        const response = await $api.get(`/deals/${dealId}`);
        return {
            success: true,
            deal: response.deal
        }
    } catch (error) {
        console.log('Ошибка при получении данных сделки', error);
        return {
            error,
            success: false
        }
    }    
}

export const fetchFile = async (messageId) => {
    const {$api} = useNuxtApp();
  
    try {
      const response = await $api.get(`/messages/file/${messageId}`);
      console.log('[chatWorkServices.js] fetchFile response', response);
      return {
        data: response,
        success: true,
      }
  
  
    } catch (error) {
        console.log('Ошибка при скачивании файла из Чата', error);
        return {
          error,
          success: false
        }
    } finally {
    }    
  }

  export const uploadFile = async (file,data) => {
    const {$api} = useNuxtApp();

    try {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("deal_id", data.dealId);
      formData.append("room", data.room);
      if (data.selectedPhone) {
        formData.append("phone", data.selectedPhone);
      }
      console.log('[UploadFileForm] uploadFile formData', file, formData);

      let response = await $api.post(data.uploadRoute, formData);
      return true;

  } catch (error) {
    console.log('[UploadFileForm] uploadFile error' ,error);
    return false;
}

}