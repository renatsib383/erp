<script setup>
import {getCashRegList} from "~/services/api/cashRegServices.js";

const props = defineProps({
  asideParams: Object,
})
const emit = defineEmits()

const cashRegList = ref([])
const totalRecords = ref(0)
const loading = ref(false)
const route = useRoute();
const delay = ref(0)
const multiSortMeta = ref()

const columnsWithNumbers = [
  { field: 'acts_with_kf', header: 'Акты с КФ' },
  { field: 'acts_without_kf', header: 'Акты без КФ' },
  { field: 'draft_material', header: 'Черновые' },
  { field: 'fotr', header: 'ФОТР' },
]

onMounted(() => {
  const fetchWithFilters = Object.keys(route.query).some(key => key.includes('filter') || key.includes('search'));
  if (!fetchWithFilters) {
    if(delay.value) clearTimeout(delay.value)
    delay.value = setTimeout(async () => {
      const res = await getCashRegList(loading, props.asideParams)
      if(res.success){
        cashRegList.value = [...res.data.msk.items, ...res.data.spb.items]
        emit('set-statistic-data', res.data)
        console.log(cashRegList.value)
      }
    }, 300)
  }
})


watch(() => props.asideParams, () => {
  if(delay.value) clearTimeout(delay.value)
  delay.value = setTimeout(async () => {
    const res = await getCashRegList(loading, props.asideParams)
    if(res.success){
      cashRegList.value = [...res.data.msk.items, ...res.data.spb.items]
      emit('set-statistic-data', res.data)
    }
  }, 300)
})
</script>



<template>
  <div class="w-full h-full overflow-hidden">
    <div
        v-if="loading"
        class="loading-overlay absolute inset-[10px] top-[56px]">
      <Skeleton class="w-full mb-1 rounded-none" height="46px" v-for="i in 25"/>
    </div>
    <DataTable
        lazy :paginator="false" removableSort stripedRows ref="userTable" dataKey="id"
        :value="cashRegList" :first="first" :rows="50" :rowsPerPageOptions="[50, 100]"
        :totalRecords="totalRecords" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
        sortMode="multiple" @row-click="openModal" selectionMode="single"
        :metaKeySelection="false" scrollable :multiSortMeta="multiSortMeta"
        scrollHeight="flex" :virtualScrollerOptions="{ itemSize: 51 }"
    >
      <Column field="id" header="№" class="w-[80px] p-2">
        <template #body={index}>
          <div class="flex items-center gap-2 px-2 py-[3px]">
           <p>{{index + 1}}</p>
          </div>
        </template>
      </Column>
      <Column field="name" header="НУ"/>

      <div v-for="col in columnsWithNumbers">
        <Column
            :field="col.field"
            :header="col.header"
        >
          <template #body={data}>{{formatNumber(data.payments.items[col.field])}}</template>
        </Column>
      </div>
    </DataTable>
  </div>
</template>