<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import salaryTable from "~/components/Salary/salaryTable.vue"
import salaryAside from "~/components/Salary/salaryAside.vue"

const asideParams = ref({
  params: {period: ''},
  search: '',
  latest: 1
})

const setNewParams = (newParams) => {
  asideParams.value = newParams;
}

definePageMeta({
  permission: 'Salary.view',
});
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px] h-full">
        <salaryAside @set-new-params="setNewParams" />
      </div>
    </template>
    <salaryTable class="p-[10px] pb-0" :asideParams />
  </authenticated-layout>
</template>

<style scoped></style>
