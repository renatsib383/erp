<script setup>
import { fetchUser } from "~/services/api/usersServices.js";

const props = defineProps(["room"]);
const user = ref({});
let me = {};
const loading = ref(false);

const setUser = async (userId) => {
  const response = await fetchUser(userId);
  if (response.success) {
    user.value = response.data;
  }
  loading.value = false;
};

const setUserData = async (room) => {
  loading.value=true;
  const roomParts = room.split("__");
  const [user1, user2] = roomParts[1].split("_");
  if (Object.keys(me).length == 0) me = useSanctumUser().value;
  if (user1 == me.id) {
    await setUser(user2);
  } else {
    await setUser(user1);
  }
};

onMounted(() => {
    setUserData(props.room);
})

watch(() => props.room,async (newVal) => {
    await setUserData(newVal);
})

</script>

<template>
  <div class="chat-user p-4 pt-6 flex flex-col gap-4" v-if="loading">
    <Skeleton class="w-full" height="58px" v-for="i in 3"/>
  </div>
  <div class="chat-user p-4 pt-6 flex flex-col gap-4" v-if="!loading">
    <ifta-label>
      <label class="text-sm text-gray-400">ФИО</label>
      <InputText v-model="user.name" class="w-full" disabled />
    </ifta-label>
    <ifta-label>
      <label class="text-sm text-gray-400">Email</label>
      <InputText v-model="user.email" class="w-full" disabled />
    </ifta-label>
    <ifta-label>
      <label class="text-sm text-gray-400">Телефон</label>
      <InputText v-model="user.phone" class="w-full" disabled />
    </ifta-label>
  </div>
</template>
