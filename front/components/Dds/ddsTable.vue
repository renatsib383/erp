<script setup>
import {getDDSList} from "~/services/api/ddsServices.js";
import {useListsStore} from "~/stores/lists.js";
import VirtualScrolledTable from "~/components/Custom/virtualScrolledTable.vue";
import {getDDSDuplicates} from "~/utils/dds-utils.js";

const props = defineProps({
  asideParams: Object,
})

const store = useMainStore()
const listsStore = useListsStore();
const ddsList = ref([])
const totalRecords = ref(0)
const loading = ref(false)
const route = useRoute();
const delay = ref(0)
const multiSortMeta = ref()
const sortedColumns = ref({'date_transaction':1})

const statusList = [{id: 0, name: 'Подготовка'}, {id: 1, name: 'В обработке'}, {id: 2, name: 'Согласован'}, {id: 3, name: 'Принят'}, {id: 4, name: 'Не принят'},]
const columns = [
  { field: 'type', header: 'Тип операции' },
  { field: 'item', header: 'Операция' },
  { field: 'date_transaction', header: 'Дата операции', sortable: true },
  { field: 'deal.uid', header: 'ИД объекта' },
  { field: 'cash_register_id', header: 'Касса' },
  { field: 'total', header: 'Поступления' },
  { field: 'status', header: 'Статус' },
  { field: 'user', header: 'Создатель' }
]

const ddsLists = computed(() => listsStore.ddsLists)
const typeTitle = computed(() => (data) => {
  return ddsLists.value?.type?.find(type => type.id === data.type)?.title ?? null;
});
// Computed для заголовка операции
const itemTitle = computed(() => (data) => {
  const type = ddsLists.value?.type?.find(type => type.id === data.type);
  return type?.items?.find(item => item.id === data.item)?.title ?? null;
});

onMounted(() => {
  const fetchWithFilters = Object.keys(route.query).some(key => key.includes('filter') || key.includes('search'));
  if (!fetchWithFilters) {
    if(delay.value) clearTimeout(delay.value)
    delay.value = setTimeout(() => getDDSList(loading, ddsList, props.asideParams), 300)
  }

  setTimeout(() => {
    if(!ddsLists.value) listsStore.fetchDdsLists()
  })

  multiSortMeta.value = [
    {
      field: "date_transaction",
      order: props.asideParams.latest
    }
  ]
})

const setNewData = () => {
  const data = {
    id:0,
    total: null,
    files: null,
    status: 0,
    type: 1,
    item: null,
    date_transaction: null,
    deal_id: null,
    cash_register_id: null,
    deal: {
      id: null,
      uid: null,
    },
    isCollapsed : false,
    final_act: false,
    partial_payment: null,
    deposit_minus: null,
    discount_minus: null,

    partialPaymentActive: null,
    depositMinusActive: null,
    discountMinusActive: null,
  }

  store.setNewModal({modalData: data, modalTitle: 'dds'})
}

const openModal = async (data) => {
  store.setNewModal({modalData: {id:data.id}, modalTitle: 'dds'})
}

const openPage = (data) => {
  navigateTo(`/dds/${data.id}`);
};

const onSort = (col) => {
  (sortedColumns.value[col] && sortedColumns.value[col] >= 1) ? sortedColumns.value[col] = -1 : sortedColumns.value[col] = 1

  props.asideParams.latest = sortedColumns.value['date_transaction']
  if(delay.value) clearTimeout(delay.value)
  delay.value = setTimeout(() => getDDSList(loading, ddsList, props.asideParams), 300)
}

const openDeal = (deal) => {
  store.setNewModal({modalData: {id: deal.id}, modalTitle: 'deal'})
}

const getNewUpdatedDataFromStore = computed(() => store.getNewDDSForTable);

const addNewUpdatedDataWithoutPageReload = (dds) => {
  const list = JSON.parse(JSON.stringify(ddsList.value))
  const index = list.findIndex(d => d.id === dds.id);
  if (index !== -1) { // Если такой уже есть, то обновляем его
    list[index] = dds;
  } else { // Если нет добавим в таблицу
    list.unshift(dds);
  }
  ddsList.value = getDDSDuplicates(list)
}

const rowStyle = (data) => {
  if (data.isDuplicate){
    return { background: '#f87171' };
  }
};

watch(getNewUpdatedDataFromStore, (newValue) => {
  if (newValue) {
    addNewUpdatedDataWithoutPageReload(JSON.parse(JSON.stringify(newValue)))
  }
});

watch(() => props.asideParams, () => {
  if(delay.value) clearTimeout(delay.value)
  delay.value = setTimeout(() => getDDSList(loading, ddsList, props.asideParams), 300)
})

defineExpose({
  setNewData
})
</script>

<template>
  <div class="contacts-wrapper absolute w-full h-full overflow-hidden select-none">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[44px] z-[100]">
        <Skeleton class="w-full mb-1 rounded-none" height="44px" v-for="i in 25"/>
    </div>    
    <VirtualScrolledTable
        :value="ddsList"
        :columns="columns"
        :sortedColumns="sortedColumns"
        :rowHeight="48"
        @sort="onSort"
        @row-click="openModal"
        @openPage="openPage"
    >
      <template #body-type="{ data }">{{ typeTitle(data) }}</template>

      <template #body-item="{ data }">
        <p class="w-[160px] mx-auto text-center">{{ itemTitle(data) }}</p>
      </template>

      <template #body-date_transaction="{ data }">
        {{ formatDateStr(data.date_transaction) }}
      </template>

      <template #body-deal.uid="{ data }">
        <span
            @click.stop.prevent="openDeal(data.deal)"
            class="cursor-pointer underline text-blue-500 min-w-[120px]"
            title="Открыть объект"
        >
          {{ data.deal?.uid }}
        </span>
      </template>

      <template #body-cash_register_id="{ data }">
        <div class="leading-none w-[115px] mx-auto" v-if="data.type === 3">
          <p class="whitespace-nowrap">{{ ddsLists?.cashRegister.find(c => c.id === data.cash_register_id)?.title }} => </p>
          <p class="whitespace-nowrap">{{ ddsLists?.cashRegister.find(c => c.id === data.cash_register_recipient_id)?.title }}</p>
        </div>
        <p class="whitespace-nowrap w-[115px] mx-auto" v-else>{{ ddsLists?.cashRegister.find(c => c.id === data.cash_register_id)?.title }}</p>
      </template>

      <template #body-total="{ data }">
        <p
            v-if="data.total"
            class="whitespace-nowrap"
            :class="{
              'line-through text-gray-400' : data.status === 4,
              'text-gray-500' : data.status === 0 || data.status === 1,
              'text-emerald-600' : (data.status === 2 || data.status === 3) && data.type === 1,
              'text-red-600' : (data.status === 2 || data.status === 3) && data.type === 2,
            }"
        >
          <span v-if="data.type === 1">+ {{ formatNumber(data.total) }}</span>
          <span v-if="data.type === 2">- {{ formatNumber(data.total) }}</span>
          <span v-if="data.type === 3">{{ formatNumber(data.total) }}</span>
        </p>
      </template>

      <template #body-status="{ data }">
        <div v-show="data.status !== null">
          <p
              class="text-white p-1 w-[95px] mx-auto"
              :class="{
          'bg-gray-400': data.status === 0 || data.status === 1,
          'bg-blue-500': data.status === 2,
          'bg-emerald-500': data.status === 3,
          'bg-red-500': data.status === 4,
        }"
          >
            {{ statusList.find(o => o.id === data.status)?.name }}
          </p>
        </div>
      </template>

      <template #body-user="{ data }">
        <p>{{ data.user?.name }}</p>
      </template>
    </VirtualScrolledTable>
  </div>
</template>

<style scoped></style>