<script setup>

const delay = ref()
const emit = defineEmits(['set-new-params'])
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
  latest.value = -1

  // Общие обработчики
  const generalHandlers = {
    start: (value) => {
      if (value) params.value.period = new Date(value);
    },
    latest: (value) => {
      if (value) latest.value = Number(value);
    },
  };

  // функции обработчики по ключу фильтра
  const filterHandlers = {
    prorab: (value) => params.value.filter.prorab?.length ? params.value.filter.prorab.push(Number(value)) : params.value.filter.prorab = [Number(value)],
  };

  Object.entries(route.query).forEach(([key, value]) => {
    if (generalHandlers[key]) {
      generalHandlers[key](value);
      return;
    }

    const filters = key.match(/^filter\[(\w+)]/);
    const filterKey = filters ? filters[1] : null;

    if (filterHandlers[filterKey]) {
      filterHandlers[filterKey](value);
    }
  });

  emitNewParams()
}

const emitNewParams = () => {
  emit('set-new-params', {params: params.value})
};

// computed(() => prorabList.value.find(p => p.id === Number(value)) )

</script>

<template>
  <div class="aside-deal__toggle">

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

    <Fieldset legend="ЧЮД" :toggleable="true" pt:root="p-1 pb-2 mt-4">
      <div class="grid grid-cols-2 gap-1 rounded-md my-2">
<!--        <p-->
<!--            v-if="ddsStatistics?.operations"-->
<!--            v-for="(value, key) in ddsStatistics.operations"-->
<!--            :key="key"-->
<!--            class="w-full"-->
<!--        >-->
<!--          <span class="font-[500]">{{allOperationsTypesList.find(o => o.id === key)?.title}}</span> {{key ? `: ${value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : null}` : null}}-->
<!--        </p>-->
          <span class="font-[500]">Общая З/П ЧЮД:</span> 0
          <span class="font-[500]">Аванс:</span> 0
          <span class="font-[500]">З/П:</span> 0
          <span class="font-[500]">Штраф:</span> 0
          <span class="font-[500]">Премия:</span> 0
          <span class="font-[500]">% рук.:</span> 0
    </div>
    </Fieldset>

  </div>
</template>
