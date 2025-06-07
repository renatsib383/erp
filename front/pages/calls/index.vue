<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";

const callsTable = ref(null)
const asideCalls = ref(null)
const asideParams = ref({
  search: '',
  filter: {
    created_at: null,
    employee: [],
    deal_id:null,
    client_phone: null,
    type: null,
    // valueAfter: null,
    // valueBefore: null,
  },
})

defineProps({
  datatable: {
    type: Object,
    required: true,
  }
});

const onChangeParams = (value) => {
  asideParams.value.filter = value.filter
  asideParams.value.search = value.search
}

definePageMeta({
  permission: 'Call.view', // Требуемое разрешение для доступа к этой страницв
});

</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px] h-full">
        <CallsAside ref="asideCalls" @change-params="onChangeParams"/>
      </div>
    </template>
    <CallsTable ref="callsTable" :datatable="datatable" :asideParams="asideParams" class="p-[10px] pb-0"/>
  </authenticated-layout>
</template>

<style scoped></style>
