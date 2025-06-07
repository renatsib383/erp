<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import primeTableWithVS from "~/components/test/primeTableWithVS.vue"
import CustomTable from "~/components/test/CustomTable.vue";
import CustomTableWithVS from "~/components/test/CustomTableWithVS.vue";
import {getSalaryList} from "~/services/api/salaryServices.js";

const salaryList = ref([])
const loading = ref(false)

const sortedColumns = ref({})
const columns = [
  { field: 'user.name', header: 'Прораб', sortable: true },
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
  { field: 'advance', header: 'Аванс' },
  { field: 'remainder', header: 'Остаток' },
]

onMounted(async () => {
  const res = await getSalaryList(loading, {}, 0, 250)
  salaryList.value = res.data
})

const type = ref('3');

const openModal = (row) => {
  console.log(row)
}

const onSort = (col) => {
  (sortedColumns.value[col] && sortedColumns.value[col] >= 1) ? sortedColumns.value[col] = -1 : sortedColumns.value[col] = 1
  console.log(sortedColumns.value)
}
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <div class="flex flex-wrap gap-2 px-2 text-sm">
      Table Render:
      <div class="flex items-center gap-2">
        <RadioButton v-model="type" inputId="type1" value="1" />
        <label for="type1" class="cursor-pointer">Prime</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="type" inputId="type3" value="3" />
        <label for="type3" class="cursor-pointer">Custom</label>
      </div>

    </div>

    <div class="p-[10px] pb-0 h-[calc(100%-20px)]">
      <primeTableWithVS
          v-if="type === '1'"
          :value="salaryList"
          :columns="columns"
          @row-click="openModal"
      />

      <CustomTableWithVS
          v-if="type === '3'"
          :value="salaryList"
          :columns="columns"
          :sorted-columns="sortedColumns"
          @row-click="openModal"
          @sort="onSort"
      >
<!--        <template #body-user.name="{ data }" class="w-[60px]">-->
<!--          <p class="w-[80px]">-->
<!--            {{ data.user?.name }}-->
<!--          </p>-->
<!--        </template>-->
      </CustomTableWithVS>
    </div>
  </authenticated-layout>
</template>


