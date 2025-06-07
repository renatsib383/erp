<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import DdsTable from "~/components/Dds/ddsTable.vue"
import DdsAside from "~/components/Dds/ddsAside.vue";

const ddsTable = ref(null);
const asideParams = ref({
  params: {period: ''},
  search: '',
  latest: 1
})

const setNewData = () => {
  if(ddsTable.value){
    ddsTable.value.setNewData();
  }
}

const setNewParams = (newParams) => {
  asideParams.value = newParams;
}

definePageMeta({
  permission: 'Dds.view',
});
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px] h-full">
        <DdsAside ref="ddsAside" @set-new-data="setNewData" @set-new-params="setNewParams" />
      </div>
    </template>
    <DdsTable ref="ddsTable" class="p-[10px] pb-0" :asideParams />
  </authenticated-layout>
</template>

<style scoped></style>
