<script setup>
import throttle from "lodash.throttle";
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import ChatGroupModal from "~/components/Common/ChatGroupModal.vue";
// import ptDialog from "@/assets/presets/custom/TaskFullPreset.js";
import ptDialog from '~/assets/presets/custom/modalPreset.js';

import { useImboxStore } from '@/stores/imbox.js';
const imboxStore = useImboxStore();

const store = useMainStore();
const route = useRoute();

const imboxActive = ref({});
const contacts = ref([]);
const imboxNotificationsRef = ref(null);
const chatGroupRef = ref(null);
const lastMessage = ref({});

// const isUnreadOpenTabChat = ref(false); // Пришло сообщение на открытую вкладку
// const isUnreadOpenTabDiscussion = ref(false); // Пришло сообщение на открытую вкладку

// Параметры запроса
const asideParams = ref({});

const onChangeAsideParam = (name, value) => {
  asideParams.value[name] = value;
};

const me = ref({});

const dialog = useDialog();

// Диалог добавления группы
const openDialog = (data) => {
  let groupdialogRef = dialog.open(ChatGroupModal, {
    props: {
      showHeader: false,
      draggable: false,
      modal: true,
      appendTo: ".main",
      pt: ptDialog,
    },
    data: data,
    onSubmit: async (eventData) => {
      imboxActive.value = {
        room: `group__${eventData.id}`,
        type: 'group'
      }
      // imboxNotificationsRef.value.test_group(eventData.title, eventData.users);
    },
    onError: (errors) => {},
  });
};

const createChatGroup = () => {
  openDialog({});
};

const isMobile = ref(false);
const setIsMobile = () => {
  if (document.documentElement.clientWidth < 1024) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
    store.isImboxMobileChatsOpen = false;
  }
}
const onResize = throttle(() => {
  setIsMobile();
});

watch(imboxActive, (newVal) => {
  if (isMobile.value) {
    newVal.action == 'click' ? store.isImboxMobileChatsOpen = true : store.isImboxMobileChatsOpen = false;
  } else {
    if (store.isImboxMobileChatsOpen) {
      store.isImboxMobileChatsOpen = false;
    }
  }
})

onMounted( async () => {
  onResize();
  window.addEventListener("resize", onResize); 
  if (Object.keys(imboxStore.lists).length === 0) {
    await imboxStore.getLists()
  }
})

onUnmounted(() => {
  window.removeEventListener("resize", onResize); 
})

const setLastMessage = (last_message) => {
  lastMessage.value = last_message;
}

</script>

<template>    

  <authenticated-layout :loading="loading" page="imbox">
    <section class="imbox absolute h-full w-full p-[10px] pb-0">
      <div class="flex h-full lg:gap-[12px]">
        <div class="w-full panel-left">
          <ImboxNotifications
            :requestParams="asideParams"
            class="w-full h-full"
            v-model="imboxActive"
            ref="imboxNotificationsRef"
            :last-message = "lastMessage"
          />
        </div>

        <div
          class="w-0 lg:flex-1 h-full text-surface-500 dark:text-surface-100 overflow-hidden border-l border-dark-200"
        >
          <div id="dashboard-chats" class="h-full" v-if="imboxActive.room">
            <ImboxChats
                v-if="!isMobile"
                :imboxActive="imboxActive"
                @last-message="setLastMessage"
            />
          </div>
        </div>
      </div>
    </section>

    <template #aside>
      <div class="w-[316px] h-full">
        <ImboxAside
          :loading="loading"
          @change-filter="onChangeAsideParam"
          @change-param="onChangeAsideParam"
          @new-group="createChatGroup"
          ref="AsideImbox"
        />
      </div>
    </template>

    <template #chats>
      <div class="w-full h-full">
            <ImboxChats
                v-if="isMobile"
                isMobile="true"
                :imboxActive="imboxActive"
                @last-message="setLastMessage"
            />
      </div>
    </template>
  </authenticated-layout>
</template>
