<script setup>
const emit = defineEmits(['set-new-params'])
const props = defineProps({
  statisticData: {
    type: Object,
  }
})

// const search = ref('')
const route = useRoute()
const today = new Date()
const params = ref({
  period: null,
  filter: {
    nu: [],
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

const NUList = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }
  return listsStore.usersWithRolesList.filter(user =>
      user.roles.some(role => role.id === 2)
  );
});

const setFiltersFromURL = () => {
  latest.value = -1
  Object.entries(route.query).forEach(([key, value]) => {
    if(key === 'start' && value){
      params.value.period = new Date(value)
    }
    if(key === 'latest' && value){
      latest.value = Number(value)
    }
  });
  emitNewParams()
}

const emitNewParams = () => {
  emit('set-new-params', {params: params.value})
};

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
              v-model="params.filter.nu"
              @update:modelValue="emitNewParams"
              :options="NUList"
              :reduce="option => option.employee?.id"
              label="name"
              multiple
              class="w-full h-full"
              placeholder="Все"
          />
          <label>Начальник участка</label>
        </ifta-label>
      </div>
    </div>

    <Fieldset
        v-for="(affiliate, key, ) in props.statisticData"
        :legend="`${key === 'msk' ? 'Москва' : 'Санкт-Петербург'}: ${affiliate?.total}`"
        :toggleable="true" pt:root="p-1 pb-2"
    >
      <div class="flex flex-col gap-2 justify-center items-center">
        <div
            v-for="employee in affiliate.items"
            class="w-full text-center"
        >
            <p class="grid grid-cols-2 gap-1">
              <span class="font-[700] text-end">{{ employee.name }}</span>
              <span class="text-start">: {{employee.total}}</span>
            </p>
            <p class="grid grid-cols-2 gap-1">
              <span class="font-[500] text-end">Остаток Карта + НАЛ</span>
              <span class="text-start">: {{employee.cashRegister}}</span>
            </p>
            <p class="grid grid-cols-2 gap-1">
              <span class="font-[500] text-end">На руках у прорабов</span>
              <span class="text-start">: {{employee.prorabsCashRegister}}</span>
            </p>

          <p class="font-[500] my-1 text-slate-500">Соотношение PC и Наличные</p>
          <div class="grid grid-cols-2 mb-1 text-slate-500">
            <p class="border">
              Акты с КФ
              <span class="grid grid-cols-2 border-t">
                <span class="border-r">PC</span>
                <span>Наличные</span>
              </span>
              <span class="grid grid-cols-2 border-t">
                <span class="border-r">{{employee.payments.ratio.acts_kf.account}}%</span>
                <span>{{ employee.payments.ratio.acts_kf.cash }}%</span>
              </span>
            </p>

            <p class="border border-l-0">
              Черновые
              <span class="grid grid-cols-2 border-t">
                <span class="border-r">PC</span>
                <span>Наличные</span>
              </span>
              <span class="grid grid-cols-2 border-t">
                <span class="border-r">{{employee.payments.ratio.acts_kf.account}}%</span>
                <span>{{ employee.payments.ratio.acts_kf.cash }}%</span>
              </span>
            </p>
          </div>
<!--            <p class="grid grid-cols-2 gap-1">-->
<!--              <span class="font-[500] text-end">Общее</span>-->
<!--              <span class="text-start">: {{employee.total}}</span>-->
<!--            </p>-->
        </div>
      </div>
    </Fieldset>

  </div>
</template>
