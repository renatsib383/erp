<template>
  <div
    id="deal-notifications"
    class="border border-t-0 flex flex-col h-section"
  >
    <ul class="deal-notifications-list overflow-y-scroll">
      <li
        class="relative flex justify-between items-center pt-[6px] pl-[6px] pb-[9px] pr-[36px] text-black bg-[#ECECEC] border border-solid border-[rgba(0,0,0,0.15)] lg:border-0 lg:shadow-[0_0_2px_rgba(0,0,0,0.25)] cursor-pointer"
        :class="subscription.id == modelValue.id && !isMobile ? '!ring-4 !ring-inset !ring-[#fff] !z-[10]' : ''"
        v-for="(subscription, index) in subscriptions"
        :key="subscription.id"
        @click.stop = "clickNotification(subscription.id, subscription.deal_id, index, subscription.room);"
      >
      <div class="max-w-full mr-auto">
        <a
          class="text-xs leading-[16px] text-primary-highlight-text font-bold hover:underline"
          @click.stop="openDeal(subscription.deal_id)">
          Объект {{ subscription.deal_uid }}
        </a>
        <div class="text-[11px] leading-[120%] whitespace-nowrap text-ellipsis overflow-hidden" v-html="getMsgHeading(subscription)"></div>
        <!-- <div class="text-[10px] leading-[12px]"
                v-if="subscription.last_message.key && subscription.last_message.key.includes('task')">
                <span>Поставлена задача {{ subscription.last_message.type + ' ' + subscription.last_message.title }}</span>
        </div> -->
        <div v-if="subscription.last_message && subscription.last_message.text"
         class="text-[10px] whitespace-nowrap text-ellipsis overflow-hidden"
         v-html="getMsgContent(subscription)">
        </div>
      </div>
      <div class="notifications__amount flex mr-2 ml-auto">
        <div
          v-if="subscription.unread > 0"
          class="notifications__amount flex justify-center items-center mr-2 w-[25px] h-[25px] text-sm rounded-full"
          :class="[ subscription.room.split('__')[0] == 'discussion' ? 'bg-blue-300' : 'bg-green-300' ]"
          > 
            {{ subscription.unread }}
        </div>
      </div>
      </li>

      <div
        ref="loadMoreEl"
        class="load-more relative h-[40px] w-full mb-3"
      ></div>
    </ul>
</div>
</template>

<script setup>
  import { ref, watch, onMounted, onUnmounted } from "vue";
  import { useStore } from "vuex";
  import { usePage } from "@inertiajs/vue3";
  import { dateFormat } from '../Common/date-functions.js';

  const store = useStore();

  const props = defineProps(["modelValue","requestParams"]); // modelValue - данные активной подписки
  const emit = defineEmits(['update:modelValue']);
  const page = usePage();

  watch(() => props.requestParams,
    async (newValue) => {
      console.log('[DealNotifications] watch requestParams', newValue);
      getSubscriptions(props.requestParams);
    }, {deep: true})

  const me = page.props.auth.user;

  const subscriptionsLoaded = ref(0);

  const subscriptions = ref({});
  const getSubscriptions = async function(requestParams) {
    try {
        let params = requestParams ? {params: requestParams} : null;
        const response = await axios.get(route("subscriptions.data"),params);
        console.log("[DealNotifications] Subscriptions response", response);
        subscriptions.value = response.data;
        subscriptionsLoaded.value = subscriptions.value.length;

        emit('update:modelValue', {
            id: subscriptions.value.length > 0 ? subscriptions.value[0].id : null,
            deal_id: subscriptions.value.length > 0 ? subscriptions.value[0].deal_id : null,
            index: subscriptions.value.length > 0 ? 0 : null,
            room: subscriptions.value.length > 0 ? subscriptions.value[0].room : null,
        });
    } catch (e) {
        console.error("[DealNotifications] Subscriptions loadData error", e);
    }
  };
  getSubscriptions();

  const isMobile = ref(false);

  const calcIsMobile = () => {
    if (document.documentElement.clientWidth >= 1024) {
      isMobile.value = false;
    } else {
      isMobile.value = true;
    }
  }

  const loadMoreEl = ref(null);

  //Подгрузка новых сообщений при прокрутке
  const lastIntersectingValue = ref(true);

  watch(lastIntersectingValue, (newValue) => {
    if (!newValue || subscriptionsLoaded.value < 20) {
      return;
    }
    let offset = Math.ceil(subscriptionsLoaded.value / 20) * 20;
    axios.get(route("subscriptions.data",
      {
          offset: offset
      }))
      .then((response) => {
        subscriptions.value = [...subscriptions.value, ...response.data];
        subscriptionsLoaded.value = subscriptions.value.length;
        // console.log('[ImBoxNotifications] subscriptionsLoaded', subscriptionsLoaded.value);
    })
  })

  const updateSubscripionList = (update) => {
    console.log('[DealNotifications] UpdateSubscription', update.id, update)
    let updatedIndex = subscriptions.value.findIndex((item) => item.id == update.id);
    let newData = {...update};
    let latestMessage = false;

    if (updatedIndex < 0) {
      subscriptions.value.push(update);
      return;
    }

    // В обновлении есть последнее сообщение, в списке есть последнее сообщение
    if (update.last_message && subscriptions.value[updatedIndex] && subscriptions.value[updatedIndex].last_message) {
      // Сообщение в обновлении за более позднюю дату, чем в списке
      if (update.last_message.updated_at > subscriptions.value[updatedIndex].last_message.updated_at) {
        // newData.last_message = e.subscription.last_message;
        latestMessage = true;
      } else {
        newData.last_message = subscriptions.value[updatedIndex].last_message;
      }
    // В обновлении есть последнее сообщение, но подписки нет в списке или у неё нет последнего сообщения
    } else if (update.last_message) {
      newData.last_message = update.last_message;
    // В обновлении нет последнего сообщения, но подписка есть в списке и у неё есть последнее сообщения
    } else if (subscriptions.value[updatedIndex] && subscriptions.value[updatedIndex].last_message) {
      newData.last_message = subscriptions.value[updatedIndex].last_message;
    }

    newData = Object.assign(subscriptions.value[updatedIndex], newData);
    if (latestMessage) {
      subscriptions.value.splice(updatedIndex, 1);
      subscriptions.value.unshift(newData);
    }

  }

  onMounted(() => {
    Echo.private(`subscriptions.${page.props.auth.user.id}`)
        .listen("UpdateSubscription", (e) => {
          updateSubscripionList(e.subscription);
          emit('updateSubscriptions');
        });

    let observer = new IntersectionObserver (
      (entries, observer) => {
        // console.log('[DealNotifications] observer entries[0].isIntersecting',entries[0].isIntersecting);
        lastIntersectingValue.value = entries[0].isIntersecting;
      },
      {
        threshold: [0.75],
      }
    );
    // console.log('[imboxNotifications] loadMoreEl',loadMoreEl);
    if (loadMoreEl.value) {
        observer.observe(loadMoreEl.value);
    }

    calcIsMobile();
    window.addEventListener('resize', calcIsMobile);
  })

  onUnmounted(() => {
        Echo.leave(`subscriptions.${page.props.auth.user.id}`);
    })

  const getMsgHeading = (subscription) => {
    // console.log('[DealNotifications] getMsgHeading', subscription.deal_id, subscription.last_message);
    if (!subscription.last_message) {
      return '';
    }
    let result = '';
    let my = false;
    //  Автор для сообщения чата
    if (subscription.last_message && subscription.last_message.user_id) {
      my = subscription.last_message.user_id == me.id;
      if (my) {
        result += 'Вы';
        result += ` (${page.props.roles[me.role_id]})`;
      } else {
        let curUser = page.props.users.find(user => user.id == subscription.last_message.user_id);
        result += subscription.last_message && subscription.last_message.user.fio;
        result += curUser && ` (${page.props.roles[curUser.role_id]})`;
      }
    }
    // Дата и время
    let today = new Date(new Date().toDateString());
    let yesterday = new Date(new Date().toDateString()).setDate(today.getDate() - 1);
    let msgDate = new Date(new Date(subscription.last_message.updated_at.split("T")[0]).toDateString());
    let dateStr = '';
    if (msgDate.getTime() == today.getTime()) {
      dateStr = 'сегодня';
    } else if (msgDate.getTime() == yesterday) {
      dateStr = 'вчера';
    } else {
      let options = {
        month: "long",
        day: "numeric",
      };
      if ( msgDate.getFullYear() != today.getFullYear() ) {
        options.year = "numeric"
      }
      dateStr = new Intl.DateTimeFormat("ru-RU", options).format(msgDate);
    }
    result += ` ${dateStr} в ${dateFormat(subscription.last_message.updated_at,true)}`;
    // В ответ на сообщение
    if (subscription.last_message.reply_to) {
      result += ` в ответ на сообщение ${subscription.last_message.reply_to.user.fio} <span class="italic">"${subscription.last_message.reply_to.text}"</span>`;
    }
    return `${result}`;
  }

  const getMsgContent = (subscription) => {
    // console.log('[DealNotifications] getMsgContent', subscription.deal_id, subscription.last_message);
    if (!subscription.last_message) {
      return '';
    }
    let result = '';
    result += ` ${subscription.last_message.text}`;
    return `
                  ${result}
          `;
  }

  const deleteSubscription = (subscriptionId) => {
    // console.log('[DealNotifications] deleteSubscrtion id',subscriptionId);
    let subscriptionIndex = subscriptions.value.findIndex(item => item.id == subscriptionId);
    // console.log('[DealNotifications] deleteSubscrtion index',subscriptionIndex);
    if (subscriptionIndex >= 0) {
      subscriptions.value.splice(subscriptionIndex,1);
    }
  }

  const openDeal = (deal_id) => {
    const deal = {
      id: deal_id,
      noCollapsed: true,
    }
    store.dispatch('setNewDealToStore', deal)
  }

  const clickNotification = (id, deal_id, index, room) => {
    if (document.documentElement.clientWidth >= 1024) {
      emit('update:modelValue', {id: id, deal_id: deal_id, index: index, room: room});
    }
    else {
      openDeal(deal_id);
    }
  }

  defineExpose({subscriptions,deleteSubscription});
</script>
