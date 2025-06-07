<script setup>
import {sendComment} from "~/services/api/ddsServices.js";

const dialogRef = inject('dialogRef');
const emit = defineEmits(['save']);
const store = useMainStore()

const onSendButtonClick = () => {
  sendComment(dds, comment, store, dialogRef, emit);
}
const comment = ref(null)
const dds = dialogRef.value.data.dds
</script>

<template>
  <div class="w-full h-full p-2">
    <ifta-label>
      <label class="text-sm text-gray-400">Комментарий</label>
      <Textarea v-model="comment" rows="12" placeholder="Напишите свой комментарий здесь"></Textarea>
    </ifta-label>
    <div class="flex justify-center py-2">
      <button @click.stop.prevent="onSendButtonClick" class="button-modal">Отправить</button>
    </div>
  </div>
</template>

