<script setup>
const delay = ref()
const emit = defineEmits(['change-searchValue', 'set-collection'])
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

const setNewCollection = () => {
  emit('set-collection')
}

</script>

<template>
  <div class="aside-deal__toggle h-full overflow-hidden">
    <div class="flex justify-between items-center p-1">
      <FormSearch
          v-model="search"
          @change-search="onSearchInput"
          :placeholder="'Поиск по названию'"
      />
    </div>
    <div class="flex justify-center my-2">
      <button @click="setNewCollection" class="aside-accent-btn">
        <span class="pi pi-plus"/>
        <span> Добавить</span>
      </button>
    </div>
  </div>
</template>
<style></style>
