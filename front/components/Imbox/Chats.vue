<script setup>
import ptTabViewChatPreset from "@/assets/presets/custom/tabViewChatPreset.js";

const store = useMainStore();
const props = defineProps({
  imboxActive: Object,
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const msgTabActive = ref("chat");
const emit = defineEmits(["last-message"]);

// Переключение на чаты актвной подписки
watch(
  () => props.imboxActive,
  (newVal) => {
    msgTabActive.value = "chat"
    // if (msgTabActive.value == "chat") return;
    // if (newVal.type == "user") {
    //   msgTabActive.value = "user_info";
    // }
    // if (newVal.type == "deal") {
    //   msgTabActive.value = "deal_info";
    // }
    // if (newVal.type == "group") {
    //   msgTabActive.value = "group_info";
    // }
  },
  { immediate: true }
);

const emitLastMessage = (lastMessage) => {
  emit("last-message", lastMessage);
};
</script>

<template>
  <div class="flex text-surface-700">
    <button
      @click="msgTabActive = 'deal_info'"
      v-if="imboxActive.type == 'deal'"
      class="flex items-center justify-center text-center px-2 py-3 font-medium border-b-2 cursor-pointer"
      :class="
        msgTabActive == 'deal_info' ? 'text-surface-500 dark:text-surface-100 border-surface-500 dark:border-surface-100' : 'border-transparent'
      "
    >
      <span>Инфо</span>
    </button>
    <button
      @click="msgTabActive = 'user_info'"
      v-if="imboxActive.type == 'user'"
      class="flex items-center justify-center text-center px-2 py-3 font-medium border-b-2 cursor-pointer"
      :class="
        msgTabActive == 'user_info' ? 'text-surface-500 dark:text-surface-100 border-surface-500 dark:border-surface-100' : 'border-transparent'
      "
    >
      <span>Инфо</span>
    </button>
    <button
      @click="msgTabActive = 'group_info'"
      v-if="imboxActive.type == 'group'"
      class="flex items-center justify-center text-center px-2 py-3 font-medium border-b-2 cursor-pointer"
      :class="
        msgTabActive == 'group_info' ? 'text-surface-500 dark:text-surface-100 border-surface-500 dark:border-surface-100' : 'border-transparent'
      "
    >
      <span>Инфо</span>
    </button>
    <button
      @click="msgTabActive = 'chat'"
      class="flex items-center justify-center text-center px-2 py-3 font-medium border-b-2 cursor-pointer"
      :class="msgTabActive == 'chat' ? 'text-surface-500 dark:text-surface-100 border-surface-500 dark:border-surface-100' : 'border-transparent'"
    >
      <span>Чат</span>
      <!-- <div v-if="unreadChat"
                        class="notifications__amount flex gap-2 ml-2">
                        <div class="notifications__amount-chat flex justify-center items-center w-[25px] h-[25px] text-sm rounded-full bg-green-300">
                            {{ unreadChat  }}
                        </div>
                    </div> -->
    </button>
    <button
      v-if="isMobile"
      class="pi pi-angle-right px-2 py-1 ml-auto self-center text-slate-500 bg-gray-200 rounded-full hover:bg-gray-300"
      @click="store.isImboxMobileChatsOpen = false"
    ></button>
  </div>
  <Tabs
    v-model:value="msgTabActive"
    :pt="ptTabViewChatPreset"
    pt:panelcontainer="bg-white dark:bg-surface-600"
  >
    <TabPanels pt:root="h-full p-0">
      <TabPanel
        value="deal_info"
        pt:root="h-full"
        v-if="['deal'].includes(imboxActive.type)"
      >
        <CommonChatDealInfo :deal_id="imboxActive.deal_id" />
        <!-- v-if="msgTabActive === 0" Закомменчено - пропадает загружаемый файл при переходе с таба-->
        <!-- <CommonFeed                                            
                            :deal_id="imboxActive.deal_id"
                            :key="imboxActive.room"
                            :isActive="msgTabActive == 'feed'"
                            class="overflow-hidden h-full border-b-[1px] border-t-0 border-x-0 box-border bg-white"
                        >
                        </CommonFeed> -->
      </TabPanel>

      <TabPanel value="user_info" v-if="['user'].includes(imboxActive.type)">
        <CommonChatUserInfo :room="imboxActive.room" />
      </TabPanel>

      <TabPanel
        value="group_info"
        v-if="['group'].includes(imboxActive.type)"
        pt:root="h-full"
      >
        <div class="p-2 h-full">
          <CommonChatGroupInfo :room="imboxActive.room" />
        </div>
      </TabPanel>

      <TabPanel class="bg-transparent" value="chat" pt:root="h-full">
        <!-- v-if="msgTabActive === 'chat'" -->
        <CommonChatWork
          :type="imboxActive.type"
          :deal="imboxActive.deal_id"
          :room="imboxActive.room"
          :key="imboxActive.room"
          :isActive="msgTabActive == 'chat'"
          @last-message="emitLastMessage"
          class="overflow-hidden h-full border-b-[1px] border-t-0 border-x-0 box-border bg-white"
        >
        </CommonChatWork>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
