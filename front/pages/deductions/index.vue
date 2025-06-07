<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import DeductionsTable from "~/components/Deductions/deductionsTable.vue";
import DeductionsAside from "~/components/Deductions/deductionsAside.vue";

const deductionsTable = ref(null)
const asideParams = ref({
  params: {period: ''},
  latest: 1
})

const setNewParams = (newParams) => {
  asideParams.value = newParams;
}

const setNewData = () => {
  if(deductionsTable.value){
    deductionsTable.value.setNewData();
  }
}

// definePageMeta({
//   permission: 'Deductions.view',
// });
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px] h-full">
        <DeductionsAside @set-new-params="setNewParams" @set-new-data="setNewData"/>
      </div>
    </template>
    <DeductionsTable ref="deductionsTable" class="p-[10px] pb-0" :asideParams />
  </authenticated-layout>
</template>

<style scoped></style>
