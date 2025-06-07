<script setup>
const emit = defineEmits(['change-search']);
const props = defineProps(['placeholder'])
const showClearSearchButton = ref();
const search = defineModel();

watch(search, (newValue) => {
  if (newValue && showClearSearchButton.value) {
    showClearSearchButton.value = false;
  }
  if(!newValue) clearSearch()
});

const onSearch = () => {
  if (search.value) {
    emit('change-search');
    showClearSearchButton.value = true;
  }
};

const clearSearch = () => {
  search.value = "";
  emit('change-search');
  showClearSearchButton.value = false;
};
const onSearchValueChange = () => {
  if (search.value && !showClearSearchButton.value) {
    showClearSearchButton.value = false;
  }
};

</script>

<template>
  <InputGroup>
    <InputText type="text"
               v-model="search"
               :placeholder="placeholder"
               @input="onSearchValueChange"
               class="rounded-none"
    />
    <InputGroupAddon>
      <button v-show="!showClearSearchButton"
              class="w-full h-full py-1 px-2 bg-aside-btn-bg font-medium border-aside-input-border !rounded-none"
              :class="{ '!bg-emerald-400': search }"
              @click="onSearch">
        Поиск
      </button>
      <button v-show="showClearSearchButton"
              class="w-full h-full py-1 px-2 bg-aside-btn-bg font-medium rounded-none"
              :class="{ '!bg-emerald-400': search }"
              @click="clearSearch">
        Очистить
      </button>
    </InputGroupAddon>
  </InputGroup>
</template>
