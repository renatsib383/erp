<script setup>

const delay = ref()
const emit = defineEmits(['set-new-params', 'set-new-data'])
// const search = ref('')
const route = useRoute()
const today = new Date()
const params = ref({
  period: null,
  filter: {
    prorab: [],
  }
})
const latest = ref(1)
const listsStore = useListsStore()

onBeforeMount(() => {
  if (Object.keys(route.query).length > 0) {
    setFiltersFromURL()
  } else {
  params.value.period = new Date(today.getFullYear(), today.getMonth(), 1)
  setTimeout(() => emitNewParams())
}
})

const prorabList = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }
  return listsStore.usersWithRolesList.filter(user =>
      user.roles.some(role => role.id === 3)
  );
});

const setFiltersFromURL = () => {
  // latest.value = -1;

  // Обработчики общих параметров
  const generalHandlers = {
    start: (value) => {
      if (value) params.value.period = new Date(value);
    },
  };

  // Обработчики фильтров
  const filterHandlers = {
    prorab: (value) => params.value.filter.prorab?.length ? params.value.filter.prorab.push(Number(value)) : params.value.filter.prorab = [Number(value)],
  };

  Object.entries(route.query).forEach(([key, value]) => {
    if (generalHandlers[key]) {
      generalHandlers[key](value);
      return;
    }

    const filterMatch = key.match(/^filter\[(\w+)]/);
    const filterKey = filterMatch ? filterMatch[1] : null;

    if (filterHandlers[filterKey]) {
      filterHandlers[filterKey](value);
    }
  });

  emitNewParams();
};

const emitNewParams = () => {
  emit('set-new-params', {params: params.value})
};

const onAddButtonClick = () => {
  emit('set-new-data')
}

</script>

<template>
  <div class="aside-deal__toggle">
    <div class="flex justify-center my-2">
      <button @click="onAddButtonClick" class="aside-accent-btn">
        <span class="pi pi-plus"/>
        <span>Добавить</span>
      </button>
    </div>
    <div class="my-2">
      <p class="aside__caption-field mb-2">Фильтры</p>
      <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
        <ifta-label>
          <DatePicker
              v-model="params.period"
              @update:modelValue="emitNewParams"
              :manualInput="false"
              :max-date="new Date()"
              view="month"
              showIcon iconDisplay="input"
              dateFormat='MM, yy'
              class="w-full"
              placeholder="За всё время"
              showButtonBar
          />
          <label>Период</label>
        </ifta-label>

        <ifta-label>
          <FormVSelect
              v-model="params.filter.prorab"
              @update:modelValue="emitNewParams"
              :options="prorabList"
              :reduce="option => option.employee?.id"
              label="name"
              multiple
              class="w-full h-full"
              placeholder="Все"
          />
          <label>Прораб</label>
        </ifta-label>
      </div>
    </div>

  </div>
</template>
