<script setup>
import ptMultiselectNotifications from "@/assets/presets/custom/multiselectNotificationsPreset.js";
import {useMainStore} from "~/stores/main.js";
import {useNotificationStore} from "~/stores/notifications.js";
import { storeToRefs } from 'pinia'
import {markAllNotesAsRead, markNoteAsRead} from "~/services/api/notificationsServices.js";

const emit = defineEmits(['close'])
const store = useMainStore();
const notificationStore = useNotificationStore()
const isArchiveShowed = ref(false)
const loading = ref(false);

const { notifications, viewedNotificationsArchive } = storeToRefs(notificationStore) // реактивно следит за изменениями

// Группы - мультиселект
const groups = ref([
  {name: 'Все', id: 1},
  // {name: 'Сделки', id: 2},
  // {name: 'Компания', id: 3},
]);
const selectedGroups = ref([1]);

watch(selectedGroups, function (newValue) {

});

//  Данные
const fetchNotifications = async () => {
  if (selectedGroups.length == 0) {
    return;
  }
  const params = {
    search: searchRef.value
  }
  loading.value = true;
  await notificationStore.fetchNotifications(params);
  loading.value = false;
}

const onScroll = (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
    fetchNotifications()
  }
};

const debouncedOnScroll = debounce(onScroll, 300);

const searchRef = ref(null);
const searchDeals = () => {
  // fetchNotifications();
}

const getMsgDate = (notificationDate) => {
  let result = '';
  // Дата и время
  let today = new Date(new Date().toDateString());
  let yesterday = new Date(new Date().toDateString()).setDate(today.getDate() - 1);
  let msgDate = new Date(new Date(notificationDate.split("T")[0]).toDateString());
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
  result += ` ${dateStr} в ${dateFormat(notificationDate,true)}`;
  return `${result}`;
}

const readNotification = async(notification) => {
  if(!notification.read_at){
    notification.read_at = true

    notificationStore.deleteShowedNotification(notification.id)
    await markNoteAsRead(notification.id)
  }

}

const readAll = async () => {
  if(notificationStore.unreadNotificationsQuantity){ // Если есть не прочитанные
    notifications.value.forEach(note => note.read_at = true)
    await markAllNotesAsRead()
  }
}

const getSingularTitle = (link) => {
  return link.split('/')[1].replace(/ies$/, 'y').replace(/s$/, '');
};

const openModal = (notification) => {
  if(!notification.data.link){
    return
  }
  let title = getSingularTitle(notification.data.link) // Получаем название в ед.числе
  if(title === 'works-collection'){
    title = 'collection'
  }
  const id = notification.data.link.split('/').pop(); // Получаем ID
  // Зарываем сайдбар
  emit('close')
  // Открываем модалку
  store.setNewModal({modalData: {id}, modalTitle: title})
  readNotification(notification)
}

const showArchive = () => {
  isArchiveShowed.value = !isArchiveShowed.value
}

</script>

<template>
  <section class="h-full">
    <div class="flex items-center gap-[7px] mb-2">
      <Multiselect
          v-model="selectedGroups"
          :showSelectAll="false"
          showSelectAll="false"
          select-all-label="Dct"
          :showHeader="false"
          :options="groups"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите раздел"
          :pt="ptMultiselectNotifications"
          class="custom-ms"
      />
      <span
          @click.stop="emit('close')"
          class="!flex shrink-0 items-center justify-center right-2 top-2 w-[28px] h-[28px] rounded-full bg-surface-600 pi pi-times text-sm text-surface-300 hover:text-surface-100 cursor-pointer" />
    </div>
    <div class="flex items-center gap-[7px] mb-2">
      <div class="relative w-full">
        <input
            type="text"
            v-model="search"
            placeholder="Поиск по объектам"
            ref="searchRef"
            class="min-h-[32px] w-full py-1 pl-3 pr-[5px] text-sm text-surface-800 border-[1px] border-select-border-color bg-surface-0 dark:bg-body-bg"
        />
        <button class="group flex shrink-0 items-center justify-center w-[32px] h-[32px] absolute right-0 top-0 pi pi-search text-sm bg-surface-600 text-surface-300 hover:text-surface-100 cursor-pointer"
                @click="searchDeals"
        >
        </button>
      </div>
      <button
          class="group flex shrink-0 items-center justify-center w-[28px] h-[28px] text-sm text-surface-0 bg-[#5EC36A] rounded-full"
          @click="readAll"
          title="Прочитать все"
      >
        <svg width="16"
             height="8"
             class="text-surface-100 group-hover:text-surface-0">
          <use xlink:href="/images/sprite.svg#double-check" />
        </svg>
      </button>
    </div>
    <button @click="showArchive" v-if="!isArchiveShowed" class="flex justify-start items-center gap-2 w-full p-1 text-surface-600 dark:text-white hover:bg-white hover:dark:bg-[#4B5A71] mb-1 rounded">
      <span class="pi pi-inbox pi-fw w-6 h-6 rounded-full"/>
      <p class="">В архиве</p>
    </button>
    <button @click="showArchive" v-else class="flex justify-start items-center gap-2 w-full p-1 text-surface-600 dark:text-white hover:bg-white hover:dark:bg-[#4B5A71] mb-1 rounded">
      <span class="pi pi-arrow-left pi-fw w-6 h-6 rounded-full"/>
      <p class="">Назад</p>
    </button>

    <div
        v-if="loading"
        class="loading-overlay absolute inset-[10px] top-[126px] z-[100] bg-body-bg">
      <Skeleton class="w-full mb-[4px]" height="82px" v-for="i in 10"/>
    </div>

    <VirtualScroller
        v-if="!isArchiveShowed"
        :items="notifications"
        :itemSize="83"
        @scroll="debouncedOnScroll"
        class="h-[calc(100%-116px)] w-full gap-1"
    >
      <template v-slot:item="{ item: notification }">
        <NotificationCard
              :key="notification.id"
              @click="openModal(notification)"
              :isUnread="!notification.read_at"
              @read="readNotification(notification)"
          >
            <template #header> {{ notification.data.title }} </template>
            <template #text>
              <span v-html="notification.data.body"></span>
            </template>
            <template #bottom> {{ getMsgDate(notification.data.date) }} </template>
          </NotificationCard>
      </template>
    </VirtualScroller>
    <VirtualScroller
        v-else
        :items="viewedNotificationsArchive"
        :itemSize="83"
        @scroll="debouncedOnScroll"
        class="h-[calc(100%-116px)] w-full gap-1"
    >
      <template v-slot:item="{ item: notification }">
        <NotificationCard
            :key="notification.id"
            @click="openModal(notification)"
        >
          <template #header> {{ notification.data.title }} </template>
          <template #text>
            <span v-html="notification.data.body"></span>
          </template>
          <template #bottom> {{ getMsgDate(notification.data.date) }} </template>
        </NotificationCard>
      </template>
    </VirtualScroller>
  </section>
</template>
