<script setup>
import { ref } from 'vue';

const delay = ref()
const emit = defineEmits(['change-searchValue', 'set-newuser'])
const search = ref('')
const route = useRoute()

onMounted(async () => {
  if (route.query.search) {
    search.value = route.query.search
    onSearchInput()
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

const setNewContact = () => {
  emit('set-new-contact')
}
</script>

<template>
  <div class="aside-deal__toggle">

    <div class="flex justify-between items-center pt-1">
        <span class="relative  w-full">
          <FormSearch
              v-model="search"
              @change-search="onSearchInput"
              :placeholder="'Поиск по ФИО и по телефону'"
          />
        </span>
      </div>

    <div class="flex justify-center my-2">
      <button @click="setNewContact" class="aside-accent-btn">
        <span class="pi pi-plus"/>
        <span>Добавить</span>
      </button>
    </div>
  </div>
</template>
