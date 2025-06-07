<script setup>
// import DataTable from '~/assets/presets/custom/DataTableDeal.vue';
import {getDeductionsList} from "~/services/api/deductionsServices.js";
import VirtualScrolledTable from "~/components/Custom/virtualScrolledTable.vue";

const props = defineProps({
  asideParams: Object,
})

const store = useMainStore()
const listsStore = useListsStore()
const deductionsList = ref([])
const loading = ref(false)
const route = useRoute();
const delay = ref(0)

const columns = [
  { field: 'employee_id', header: 'Прораб' },
  { field: 'official_salary', header: 'Официальная зарплата' },
  { field: 'tax', header: 'Налоги' },
  { field: 'bounty', header: 'Премии' },
  { field: 'fines', header: 'Штрафы' },
];

onMounted(() => {
  const fetchWithFilters = Object.keys(route.query).some(key => key.includes('filter') || key.includes('search'));
  if (!fetchWithFilters) {
    if(delay.value) clearTimeout(delay.value)
    delay.value = setTimeout(() => getDeductionsList(loading, deductionsList, props.asideParams), 300)
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

const setNewData = () => {
  const data = {
    id:0,
    employee_id: null,
    official_salary: null,
    tax: null,
    bounty: null,
    fines: null,
    isCollapsed : false,
    date: null
  }
  store.setNewModal({modalData: data, modalTitle: 'deduction'})
}

const openModal = async (event) => {
  store.setNewModal({modalData: event.data, modalTitle: 'deduction'})
}

const openPage = (data) => {
  navigateTo(`/deductions/${data.id}`);
};

const getNewUpdatedDataFromStore = computed(() => store.getNewDeductionForTable);

const addNewUpdatedDataWithoutPageReload = (deduction) => {
  console.log(deduction)
  const list = JSON.parse(JSON.stringify(deductionsList.value))
  const index = list.findIndex(d => d.id === deduction.id);
  if (index !== -1) { // Если такой уже есть, то обновляем его
    list[index] = deduction;
  } else { // Если нет добавим в таблицу
    list.unshift(deduction);
  }
  deductionsList.value = list
}

watch(getNewUpdatedDataFromStore, (newValue) => {
  if (newValue) {
    addNewUpdatedDataWithoutPageReload(JSON.parse(JSON.stringify(newValue)))
  }
});

watch(() => props.asideParams, () => {
  if(delay.value) clearTimeout(delay.value)
  delay.value = setTimeout(() => getDeductionsList(loading, deductionsList, props.asideParams), 300)
})

defineExpose({
  setNewData
})
</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[40px] z-[100]">
        <Skeleton class="w-full mb-[4px] rounded-none" height="46px" v-for="i in 25"/>
    </div>    

    <VirtualScrolledTable
        :value="deductionsList"
        :columns="columns"
        :rowHeight="48"
        @row-click="openModal"
        @openPage="openPage"
    >
       <template #body-employee_id="{data}">
         {{data.employee_id ? prorabList.find(user => user?.employee.id === data.employee_id)?.name : ''}}
       </template>
    </VirtualScrolledTable>

  </div>
</template>

<style scoped></style>