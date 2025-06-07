<script setup>
  const listsStore = useListsStore();

  const emit = defineEmits(["open-user-chat"]);
  const me = useSanctumUser().value;
  const users = computed(() => listsStore.usersWithRolesList
    ? listsStore.usersWithRolesList.filter(user => user.id != me.id )
    : []
  );   
  const selectedUser = ref(null);
  const currentUser = useSanctumUser().value;

  const newUserChat = async () => {
    const [user1, user2] =
      selectedUser.value.id < currentUser.id
        ? [selectedUser.value.id, currentUser.id]
        : [currentUser.id, selectedUser.value.id];
    let room = `user__${user1}_${user2}`;
    emit("open-user-chat", room, selectedUser.value.name);
  };

  const cleanSelected = () => {
    selectedUser.value = {};
  };

  const virtualScrollerOptions = {
    itemSize: 38, 
    lazy: true, 
    // onLazyLoad: onLazyLoad,
    // onScroll: onScroll
  }

  defineExpose({
    cleanSelected,
  });

</script>

<template>
  <div class="flex gap-1 w-full -mb-[1px]">
    <IftaLabel class="grow">
      <label class="text-surface-400">Чат с пользователем</label>
      <Select
        v-model="selectedUser"
        @update:modelValue="newUserChat"
        :options="users"
        filter
        optionLabel="name"
        placeholder="Выберите пользователя"
        class="w-full"
        pt:root:class="dark:!border-[rgba(255,255,255,0.25)]"
        pt:label:class="py-[2px]"
        :virtualScrollerOptions="virtualScrollerOptions"
      />
    </IftaLabel>
  </div>
</template>
