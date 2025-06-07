<script setup>
import { ref } from 'vue';

const delay = ref()
const emit = defineEmits(['change-searchValue', 'set-newuser'])
const search = ref('')
const route = useRoute()

onMounted(async () => {
  if (route.query.search) {
    search.value = route.query.search
    emit('change-searchValue', search.value)
  }
});

const onSearchInput = () => {
  if (delay.value) {
    clearTimeout(delay.value)
  }
  delay.value = setTimeout(() => {
    const oldURL = window.location.href;
    const newUrl = search.value.length ? `${window.location.pathname}?search=${search.value}` : null;
    if (newUrl) {
      history.pushState(oldURL, '', newUrl);
    } else {
      history.pushState(oldURL, '', window.location.pathname);
    }
    emit('change-searchValue', search.value)
  }, 100);
}

const setNewPosition = () => {
  emit('set-new-position')
}
</script>

<template>
  <div class="aside-deal__toggle h-[calc(100%-20px)] overflow-hidden">
    
    <div class="flex justify-between items-center p-1">
      <FormSearch
          v-model="search"
          @change-search="onSearchInput"
          :placeholder="'Поиск по названию'"
      />
    </div>


    <div class="flex justify-center my-2">
<!--      <button @click="setNewPosition" class="py-2 mb-1 mx-1 px-8 border-slate-400 border-dashed border-2 text-slate-600 font-medium text-[15px] rounded-lg w-full">-->
<!--        Добавить должность-->
<!--      </button>-->
    </div>
  </div>
</template>
