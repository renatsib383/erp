<script setup>
const props = defineProps(["room"]);
const chatGroupRef = ref(null);

const isChanged = computed(() => {
  if (chatGroupRef.value && chatGroupRef.value.isGroupChanged) {
    return true;
  } else {
    return false;
  }
});

const saveChanges = async () => {
  let response = chatGroupRef.value && await chatGroupRef.value.updateGroup();
};

const isOwner = computed(() => {
  return chatGroupRef.value && chatGroupRef.value.isOwner;
})

</script>

<template>
  <div class="flex justify-end">
    <button
      v-if="isOwner"
      class="button-modal button-accent"
      @click="saveChanges"
      :disabled="!isChanged"
    >
      Сохранить изменения
    </button>
  </div>
  <div class="h-full overflow-y-auto">
    <CommonChatGroupFull :room="props.room" ref="chatGroupRef" class="test" />
  </div>
</template>
