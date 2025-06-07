
export const fetchDealLists = async () => {
    const {$api} = useNuxtApp();
    try {

        const response = await $api.get(`/lists/deal`);

        // const response = testDeal;

        // const fields = dealData.lists.fields;
        console.log('[feedServices] fetchDealLists response',response );
        return {
            // deal: response.deal,
            lists : response,
            success: true
        }
    } catch (error) {
        return {
          success: false,
          error
        }
    } finally {
        // loading.value = false;
    }

}


export const fetchMessages = async (dealId) => {
    const {$api} = useNuxtApp();

    try {
      const response = await $api.get(`/deals/${dealId}/feed`, {});
      // const response = feedMessages;
      // console.log('')
      return {
        data: response,
        success: true,
      }
      //fakeData
      // return {
      //     data: {
      //     }
      // };

  } catch (error) {
      console.log('Ошибка при отправке сообщения в Ленту', error);
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

export const createMessage = async (dealId, message, recipient) => {
  const {$api} = useNuxtApp();

  console.log('[feedServices.js] createMessage', dealId, message, recipient)

  try {
    const response = await $api.post(`/deal/notes`, {
      deal_id: dealId,
      text: message,
      recipient: recipient
    });
    return {
      data: response,
      success: true,
    }
  } catch (error) {
        return {
          error,
          success: false
        }
  } finally {
  }    

}

export const fetchFile = async (messageId) => {
  const {$api} = useNuxtApp();

  try {
    const response = await $api.get(`/deal/notes/file/${messageId}`);
    console.log('[feedServices.js] fetchFile response', response);
    return {
      data: response,
      success: true,
    }


  } catch (error) {
      console.log('Ошибка при скачивании файла из Ленты', error);
      return {
        error,
        success: false
      }
  } finally {
  }    


}

