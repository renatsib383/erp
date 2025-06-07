<script setup>
const props = defineProps(['events'])
const listsStore = useListsStore()

const usersOptions = computed(() => {
  return listsStore?.usersWithRolesList ? listsStore.usersWithRolesList : []
})

const groupedEvents = computed(() => {
  return props.events
      ? props.events.reduce((acc, event) => {
        const dateKey = formatDateStr(event.created_at);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      }, {})
      : {};
});

</script>

<template>
  <div v-for="(data, index) in groupedEvents" :key="index">
    <div class="chat__day px-3">
      <div class="chat__date sticky top-[10px] flex items-center mb-[10px] z-[10]">
        <div class="chat__date-title min-w-[100px] mx-auto  px-2  text-[#66727e] bg-white">
          {{ index }}
        </div>
      </div>

      <div
          v-for="event in groupedEvents[index]"
          :key="event.id"
          class="chat-feed__entity chat-feed__entity--event flex mb-2 justify-center"
      >
        <div class="mr-1 text-[13px] leading-[120%] text-center text-[#92a3b4] [&_i]:text-[#66727e] [&_i]:not-italic">
          <span class="mr-1"> {{ dateFormat(event.created_at,true) }}</span>
          <span v-if="event.user" class="text-[#66727e] mr-1">{{ event.user ? event.user.name : 'User'}}</span>
          <span v-else class="text-[#66727e] mr-1">{{ usersOptions.find(u => u.id === event.user_id)?.name}}</span>
          <span v-html="event.text"></span>
        </div>
      </div>

    </div>
  </div>
</template>