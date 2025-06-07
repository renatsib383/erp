<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import CashRegTable from "~/components/Statistics/CashRegisters/CashRegTable.vue";
import CashRegAside from "~/components/Statistics/CashRegisters/CashRegAside.vue";

const asideParams = ref({
  params: {period: ''},
  search: '',
  latest: 1
})

const statisticData = ref({})

const setNewParams = (newParams) => {
  asideParams.value = newParams;
}

const SetStatisticData = (data) => {
  statisticData.value = data;
}
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px] h-full">
        <CashRegAside @set-new-params="setNewParams" :statisticData/>
      </div>
    </template>
    <CashRegTable class="p-[10px] pb-0" :asideParams @set-statistic-data="SetStatisticData"/>
  </authenticated-layout>
</template>
