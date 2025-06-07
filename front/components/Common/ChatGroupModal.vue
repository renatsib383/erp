<script setup>
import ptFieldsetDealModal from "@/assets/presets/custom/fieldsetDealModal.js";
// import ChatGroupFull from "@/components/Common/ChatGroupFull.vue";
import { fetchUsers } from "@/services/api/imboxServices.js";

const dialogRef = inject("dialogRef");
const saving = ref(false);
const errors = ref([]);
const ptFieldsetOptions = { mergeSections: true, mergeProps: true };

const group = ref({});
const chatGroupRef = ref(null);
const activeTab = ref(0);
const usersOptions = ref({});
const selectedUser = ref(null);
const allUsers = ref([]);
const participantsUsers = ref([]);

const readyToSave = computed(() => {
  if (chatGroupRef.value && chatGroupRef.value.readyToSave()) {
    return true;
  } else {
    return false;
  }
});

const newGroup = async () => {
  if (chatGroupRef.value) {
    let response = await chatGroupRef.value.newGroup();
    if (response && response.success) {
      await dialogRef.value.options.onSubmit(response.data);
      closeTaskModal();
    }
  }
};

const closeTaskModal = () => {
  dialogRef && dialogRef.value.close();
};


</script>

<template>
  <section class="h-full">
    <header
      class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-4 text-white text-lg"
    >
      <div class="flex items-center gap-1">
        <p>Новая группа</p>
      </div>
      <div class="flex items-center gap-2 text-base">
        <Button
          @click.stop.prevent="newGroup"
          title="Создать"
          :disabled="saving || !readyToSave"
          class="bg-emerald-400 hover:enabled:!bg-emerald-700 h-[var(--modal-header-height)] text-white border-0 flex items-center justify-center p-1 px-2"
        >
          <p>Создать</p>
        </Button>
        <button
          v-if="dialogRef"
          @click.prevent="closeTaskModal"
          class="custom-collapse-button"
        >
          <span class="pi pi-times"></span>
        </button>
      </div>
    </header>
    <div
      class="content h-[calc(100%-var(--modal-header-height))] px-4 pb-4 text-surface-700 text-sm bg-white dark:bg-surface-800"
    >
      <nav
        class="relative flex items-center gap-2 border-b-2 text-surface-700 dark:text-surface-400 dark:border-surface-500 justify-between max-lg:overflow-x-auto w-full"
      >
        <div class="flex items-center text-nowrap">
          <p
            @click="activeTab = 0"
            class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer"
            :class="{
              'border-b-2 lg:-mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100':
                activeTab === 0,
            }"
          >
            Основное
          </p>
        </div>
        <span
          @click.stop="activeTab = 2"
          class="text-lg pi pi-history text-surface-400 dark:text-surface-200 border-surface-500 cursor-pointer p-2 mr-3"
          :class="{ '!text-surface-500': activeTab === 2 }"
          title="История"
        />
      </nav>

      <main
        v-show="activeTab === 0"
        class="overflow-y-auto h-[calc(100%-46px)]"
      >
        <CommonChatGroupFull 
          ref="chatGroupRef" 
        />
      </main>
    </div>
  </section>
</template>
