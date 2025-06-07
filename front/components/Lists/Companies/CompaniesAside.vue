<script setup>
const emit = defineEmits(['change-searchValue', 'set-newcompany'])

const delay = ref()
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
//
// const setNewCompany = () => {
//   emit('set-newcompany')
// }

</script>

<template>
  <div class="aside-deal__toggle h-[calc(100%-20px)] px-[3px] overflow-hidden">

    <div class="flex justify-between items-center pt-1">
      <FormSearch
          v-model="search"
          @change-search="onSearchInput"
          :placeholder="'Поиск по названию'"
      />
    </div>


<!--    <div class="flex justify-center my-2">-->
<!--      <button @click="setNewCompany" class="aside-accent-btn">-->
<!--        Добавить компанию-->
<!--      </button>-->
<!--    </div>-->
  </div>
</template>
