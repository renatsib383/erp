<script setup>
import {getSalaryList} from "~/services/api/salaryServices.js";
import VirtualScrolledTable from "~/components/Custom/virtualScrolledTable.vue";

const props = defineProps({
  asideParams: Object,
})

const salaryList = ref([])
const loading = ref(false)
const route = useRoute();
const delay = ref(0)
const sortedColumns = ref({})

const columns = [
  { field: 'user.name', header: 'Прораб' },
  { field: 'objects_count', header: 'Кол-во объектов в работе' },
  { field: 'delta', header: 'Дельта' },
  { field: 'acts', header: 'Выработка Акты' },
  { field: 'draft_material', header: 'Черновой материал' },
  { field: 'special_installation', header: 'Спецмонтаж' },
  { field: 'design', header: 'Проектирование' },
  { field: 'finishing_material', header: 'Чистовые материалы' },
  { field: 'extras', header: 'Допы' },
  { field: 'official_salary', header: 'Официальная зарплата' },
  { field: 'tax', header: 'Налоги' },
  { field: 'bounty', header: 'Премии' },
  { field: 'fines', header: 'Штрафы' },
  { field: 'total_salary', header: 'Общая зарплата' },
  { field: 'advance', header: 'Выплачено' },
  { field: 'remainder', header: 'Остаток' },
];

onMounted(() => {
  const fetchWithFilters = Object.keys(route.query).some(key => key.includes('filter') || key.includes('search'));
  if (!fetchWithFilters) {
    if(delay.value) clearTimeout(delay.value)
    delay.value = setTimeout(async () => {
      const res = await getSalaryList(loading, props.asideParams)
      salaryList.value = res.data
    }, 300)
  }
})

watch(() => props.asideParams, () => {
  if(delay.value) clearTimeout(delay.value)
  delay.value = setTimeout(async () => {
    const res = await getSalaryList(loading, props.asideParams)
    salaryList.value = res.data
  }, 300)
})

const onScroll = async (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
    const res = await getSalaryList(loading, props.asideParams, salaryList.value.length)
    salaryList.value = [...salaryList.value, ...res.data]
  }
};

const onDebounceScroll = debounce(onScroll, 300);

</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <div
        v-if="loading"
        class="absolute inset-[10px] top-[60px] z-[100]">
      <Skeleton class="w-full mb-[4px] rounded-none" height="44px" v-for="i in 22"/>
    </div>
    <VirtualScrolledTable
        :value="salaryList"
        :columns="columns"
        :sortedColumns="sortedColumns"
        :rowHeight="48"
        @sort="onSort"
        @row-click="openModal"
        @openPage="openPage"
        @scroll="onDebounceScroll"
    />
  </div>
</template>

<style scoped></style>