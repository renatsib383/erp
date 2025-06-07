<script setup>

const delay = ref()
const emit = defineEmits(['change-searchValue', 'set-newuser'])
const search = ref('')
const route = useRoute()
const today = new Date()
const params = ref({
  period: null,
  filter: {
    type: null,
    item: null, // операция
    deal_uid: null,
    cash_register_id : null,
    status: null,
    prorab: [],
  }
})
const latest = ref(1)
const listsStore = useListsStore()

onBeforeMount(() => {
  if (Object.keys(route.query).length > 0) {
    setFiltersFromURL()
  }
  // else {
  //   params.value.period = new Date(today.getFullYear(), today.getMonth(), 1)
  //   setTimeout(() => emitNewParams())
  // }
})

const selectedTypeItems = computed (() => {
  if (!params.value?.filter.type) {
    return [];
  }
  const selectedType = typeOptions.value.find(type => type.id === params.value.filter.type);
  return selectedType ? selectedType.items : [];
})

const ddsStatistics = computed(() => listsStore.getDdsStatistics)

// Вычисляем типы операций с суммами
const allOperationTypes = computed(() => {
  const ddsList = listsStore.getDdsLists
  const operationTypes = ddsList ? ddsList.type : [];
  const operations = ddsStatistics.value?.operations || {};

  return operationTypes.map(operationType => ({
    ...operationType,
    sum: operationType.items.reduce((total, item) => {
      const value = operations[item.id] || 0;
      return total + value;
    }, 0),
  }));
});

const cashRegistersData = computed(() => {
  const ddsList = listsStore.getDdsLists
  const cashRegisters = ddsList ? ddsList.cashRegister : [];
  const cashRegisterStats = ddsStatistics.value?.cashRegisters || {};

  return cashRegisters
      .map(cashRegister => ({
        id: cashRegister.id,
        title: cashRegister.title,
        value: cashRegisterStats[cashRegister.id] || 0,
      }))
      .filter(cashRegister => cashRegister.value); // Игнорируем null значения, и нулевые
});

const typeOptions = computed(() => {
  if (!listsStore.ddsLists || !listsStore.ddsLists.type) {
    return [];
  }
  return [{ id: null, title: 'Не выбрано' }, ...listsStore.ddsLists.type];   // Создаем новый массив, добавляя опцию Все
});

const cashRegisterOptions = computed(() => {
  if (!listsStore.ddsLists || !listsStore.ddsLists.cashRegister) {
    return [];
  }
  return [{ id: null, title: 'Все' }, ...listsStore.ddsLists.cashRegister];   // Создаем новый массив, добавляя опцию Все
});

const usersOptions = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }
  return listsStore.usersWithRolesList.filter(user =>
      user.roles.some(role => role.id === 3)
  );
});

const allCashesSum = computed(() => {
  let sum = 0;
  if (ddsStatistics.value && ddsStatistics.value.cashRegisters) {
    Object.values(ddsStatistics.value.cashRegisters).forEach(value => {
      sum += Number(value);
    }, 0);
  }
  return sum ? formatNumber(sum) : 0;
})

const setFiltersFromURL = () => {
  latest.value = -1; // Чтобы изначально получить последние записи

  // Обработчики общих параметров
  const generalHandlers = {
    start: (value) => {
      if (value) params.value.period = new Date(value);
    },
    latest: (value) => {
      if (value) latest.value = Number(value);
    },
    search: (value) => {
      if (value) search.value = value;
    }
  };

  // Обработка фильтров
  const filterHandlers = {
    type: (value) => params.value.filter.type = Number(value),
    item: (value) => {
      if (params.value.filter.type) params.value.filter.item = value;
    },
    deal_uid: (value) => params.value.filter.deal_uid = value,
    cash_register_id: (value) => params.value.filter.cash_register_id = Number(value),
    status: (value) => params.value.filter.status?.length ? params.value.filter.status.push(Number(value)) : params.value.filter.status = [Number(value)],
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

  emitNewParams();
};

const emitNewParams = () => {
  if (!params.value?.filter?.type){
    params.value.filter.item = null
  }
  emit('set-new-params', {params: params.value, search: search.value, latest: latest.value})
};

const emitWithTimeout = () => {
  if(delay.value) clearTimeout(delay.value)

  delay.value = setTimeout(() => emitNewParams(), 1500)
}

const onSearchInput = () => {
  if (delay.value) {
    clearTimeout(delay.value)
  }
  delay.value = setTimeout(() => {
    emitNewParams()
  }, 300);
}

const onAddButtonClick = () => {
  emit('set-new-data')
}

const formatNumber = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

</script>

<template>
  <div class="aside-deal__toggle">
    <!--<div class="flex justify-between items-center pt-1">
      <FormSearch
          v-model="search"
          @change-search="onSearchInput"
          :placeholder="'Поиск'"
      />
    </div>-->

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
            <label class="text-sm text-gray-400">Тип операции</label>
            <Select
                v-model="params.filter.type"
                @update:modelValue="emitNewParams"
                :options="typeOptions"
                class="w-full h-full"
                optionLabel="title"
                optionValue="id"
                placeholder="Не выбрано"
                show-clear
            />
        </ifta-label>
        <ifta-label>
            <label class="text-sm text-gray-400">Операция</label>
            <Select
                v-model="params.filter.item"
                @update:modelValue="emitNewParams"
                :options="selectedTypeItems"
                class="w-full h-full"
                optionLabel="title"
                optionValue="id"
                :placeholder="!params.filter?.type ? 'Сначала укажите тип операции' : 'Выберите из списка'"
                :disabled="!params.filter?.type"
                show-clear
            />
        </ifta-label>

        <ifta-label>
          <InputText
            v-model="params.filter.deal_uid"
            @update:modelValue="emitWithTimeout"
          />
          <label>ИД объекта</label>
        </ifta-label>
        <ifta-label>
          <label class="text-sm text-gray-400">Касса</label>
          <Select
              v-model="params.filter.cash_register_id"
              @update:modelValue="emitNewParams"
              :options="cashRegisterOptions"
              class="w-full h-full"
              optionLabel="title"
              optionValue="id"
              placeholder="Все"
              show-clear
          />
        </ifta-label>

        <ifta-label>
          <label class="text-sm text-gray-400">Статус</label>
          <FormVSelect
              v-model="params.filter.status"
              @update:modelValue="emitNewParams"
              :options="[{code: 0, label: 'Подготовка'}, {code: 1, label: 'В обработке'}, {code: 2, label: 'Согласован'}, {code: 3, label: 'Принят'}, {code: 4, label: 'Не принят'}]"
              :reduce="option => option.code"
              multiple
              class="w-full h-full"
              placeholder="Не выбран"
          />
        </ifta-label>

        <ifta-label>
          <FormVSelect
              v-model="params.filter.prorab"
              @update:modelValue="emitNewParams"
              :options="usersOptions"
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

    <Fieldset legend="Операции" :toggleable="true" pt:root="p-1 pb-2">
      <div class="flex flex-col gap-2 justify-center items-center">
        <div v-for="operationType in allOperationTypes" :key="operationType.id" class="w-full text-center">

          <div class="grid grid-cols-2 gap-1">
            <p class="font-semibold text-end uppercase" :class="{'translate-x-[50px]': operationType.title === 'Перемещение'}">{{ operationType.title === 'Перемещение' ? 'Перемещения' : operationType.title }}</p>
            <p v-show="operationType.title !== 'Перемещение'" class="text-start">{{ `: ${formatNumber(operationType.sum)}` }}</p>
          </div>

          <div
              v-for="item in operationType.items"
              :key="item.id"
          >
            <p v-show="ddsStatistics?.operations[item.id]" class="grid grid-cols-2 gap-1">
              <span class="font-[500] text-end">{{ item.title }}</span>
              <span class="text-start">{{ ddsStatistics?.operations[item.id] ? `: ${formatNumber(ddsStatistics.operations[item.id])}` : ': 0' }}</span>
            </p>
          </div>
        </div>
      </div>
    </Fieldset>


    <Fieldset :legend="`Баланс ${allCashesSum}`" :toggleable="true" :collapsed="true" pt:root="p-1 pb-2 mt-4">
      <div v-if="cashRegistersData?.length" class="flex flex-col gap-2 justify-center items-center">
        <div
            v-for="cashRegister in cashRegistersData"
            :key="cashRegister.id"
            class="grid grid-cols-2 gap-1 w-full text-center"
        >
          <p class="font-[500] text-end">{{ cashRegister.title }}</p>
          <p class="text-start">{{ `: ${formatNumber(cashRegister.value)}` }}</p>
        </div>
      </div>
    </Fieldset>

  </div>
</template>
