<script setup>
import ptFieldsetDealModal from "@/assets/presets/custom/fieldsetDealModal.js";
import { fetchUsers, createGroupChat, updateGroupChat, fetchGroupInfo } from "@/services/api/imboxServices.js";
import { createMessage  } from '@/services/api/chatWorkServices.js';

const listsStore = useListsStore();

const saving = ref(false);
const errors = ref([]);
const ptFieldsetOptions = { mergeSections: true, mergeProps: true };
const isGroupChanged = ref(false);
const me = useSanctumUser().value;
const loading = ref(false);

const props = defineProps(["room"]);

const group = ref({});
const originalGroup = ref({});
const activeTab = ref(0);
const usersOptions = ref({});
const selectedUser = ref(null);
const allUsers = computed(() => listsStore.usersWithRolesList
  ? listsStore.usersWithRolesList.filter(user => user.id != me.id )
  : []
);

const setGroupData = async () => {
  if (!props.room)  {
    // Новая группа
    group.value.users = [{id: me.id, name: me.name}];
    group.value.owner = me.id;
    return;
  }
  // Открыли существующую группу
  loading.value = true;
  let groupId = props.room.split('__')[1];
  const response = await fetchGroupInfo(groupId);
  if (response.success) {
    originalGroup.value = response.data;
    group.value = {...originalGroup.value};
    group.value.users = [...originalGroup.value.users];
  }  

  loading.value = false;
}

const newGroup = async () => {
  const response = await createGroupChat(group.value.title,group.value.users.map(user => user.id),me.id);
  if (response.success) {
    // Добавляем первое сообщение
      let messageData =  {
              room: `group__${response.data.id}`,
              text: `Создана новая группа`,
              reply_to: 0,
              recipient: null,
              phone: null
      };
      await createMessage(messageData);
  } else {
    errors.value = response.error;
  }  

  return response;
};

const updateGroup = async () => {
  let groupId = props.room.split('__')[1];
  const response = await updateGroupChat(groupId, group.value.title, group.value.users.map(user => user.id));
  if (response.success) {
    isGroupChanged.value = false;
  } else {
    errors.value = response.error;
  }  
  return response;
}

const readyToSave = () => {
  if (group.value.users && group.value.users.length > 1 && group.value.title && group.value.title.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

const availableUsers = computed(() => {
  return allUsers.value.filter(
    (user) =>
      !group.value.users.some((selectedUser) => selectedUser.id == user.id)
  );
});


const addParticipant = () => {
  if (!group.value.users) group.value.users = [];
  group.value.users.push(...selectedUser.value);
  selectedUser.value = null;
};


const removeParticipant = (userId) => {
    group.value.users = group.value.users.filter(user => user.id != userId);
}

const getIsGroupChanged = () => {
    const changed = JSON.stringify(group.value) !== JSON.stringify(originalGroup.value);
    if (changed) {
      isGroupChanged.value = true;
    } else {
      isGroupChanged.value = false;
    }
}

const isOwner = computed(() => {
  if (group.value.owner == me.id) {
    return true;
  } else {
    return false;
  }
})

onMounted(async () => {
  await setGroupData();
})

watch(() => props.room,async (newVal) => {
  await setGroupData();
})

watch(group, (newValue) => {
  if (!isGroupChanged.value) {
    getIsGroupChanged();
  }
},{deep: true})


defineExpose({
  newGroup,
  updateGroup,
  readyToSave,
  isGroupChanged,
  isOwner,
});

</script>

<template>

  <div class="flex flex-col gap-2 mt-2" v-if="loading">
    <Skeleton class="w-full" height="58px"/>
    <div class="mt-[58px] flex flex-col gap-2">
      <Skeleton class="w-full" height="42px" v-for="i in 2"/>
    </div>
  </div>

  <div v-if="!loading">
    <div class="flex flex-col gap-2 mt-2">

      <ifta-label>
        <label class="text-sm text-gray-400">Название группы</label>
        <InputText
          v-model="group.title"
          class="w-full"
          :disabled="!isOwner"
        />
      </ifta-label>
    </div>
    <Fieldset
      legend="Участники"
      pt:root="p-2 pb-2"
      pt:legendlabel="text-surface-500"
    >
      <div class="">
        <div
          v-for="(user, index) in group.users"
          :key="index"
          class="flex flex-col gap-2"
        >
          <div
            class="flex justify-between gap-2 border-[1px] border-slate-300 mb-2 py-1.5 px-4 rounded-md items-center"
          >
            <div>{{ user ? user.name : "null" }}</div>
            <button v-show="user.id != me.id && isOwner" @click="removeParticipant(user.id)">
              <i
                class="pi pi-times-circle text-lg text-surface-400 hover:text-red-400"
              ></i>
            </button>
          </div>
        </div>
        <IftaLabel v-if="isOwner">
            <label>Новый участник</label>
            <FormVSelect
              v-model="selectedUser"
              :options="availableUsers"
              label="name"
              value="id"
              multiple
              placeholder="Выберите участника"
              class="v-select-chatgroup"
            >
            </FormVSelect>
        </IftaLabel>
        <div class="flex justify-center mt-2">
            <button
            v-if="isOwner"
            @click="addParticipant"
            :disabled="!selectedUser || selectedUser.length == 0"
            class="button-modal"
            >
            Добавить участника
            </button>
        </div>            
      </div>
    </Fieldset>
  </div>

</template>


<style>
 .v-select-chatgroup .vs__dropdown-toggle {
    padding-top: 5px;
    padding-bottom: 7px;
 }
</style>