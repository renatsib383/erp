<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import CollectionsTable from "~/components/Lists/Works/CollectionsTable.vue";
import CollectionAside from "~/components/Lists/Works/CollectionsAside.vue";

const asideParams = ref({search: '',})
const table = ref(null)

defineProps({
  datatable: {
    type: Object,
    required: true,
  }
});

const onChangeSearchValue = (value) => {
  asideParams.value.search = value
}

const onSetNewCollectioin = () => {
   table.value.setNewWorkCollection()
}


const sidebarMenuLoading = ref('');
const onSetLoading = (value) => {
  sidebarMenuLoading.value = value;
};

definePageMeta({
  permission: 'WorkCollection.view',
});
</script>

<template>
  <Head title="Наборы работ" />
  <AuthenticatedLayout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px]">
        <CollectionAside @change-searchValue="onChangeSearchValue" @set-collection="onSetNewCollectioin"/>
      </div>
    </template>
    <CollectionsTable :datatable="datatable" :asideParams="asideParams" @set-loading="onSetLoading" ref="table" class="p-[10px] pb-0"/>
  </AuthenticatedLayout>
</template>

<style scoped></style>
