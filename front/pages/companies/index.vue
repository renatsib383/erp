<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import CompaniesTable from "~/components/Lists/Companies/CompaniesTable.vue";
import CompaniesAside from "~/components/Lists/Companies/CompaniesAside.vue";

const companiestable = ref(null)
const sidebarMenuLoading = ref('');
const asideParams = ref({
  search: '',
  filter: {}
})

const onSetLoading = (value) => {
  sidebarMenuLoading.value = value;
};

const onChangeSearchValue = (value) => {
  asideParams.value.search = value
}

const onSetNewCompany = () => {
  companiestable.value.setNewCompany()
}

definePageMeta({
  permission: 'Company.view',
});

</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px]">
        <CompaniesAside @change-searchValue="onChangeSearchValue" @set-newcompany="onSetNewCompany" @change-params="onParamsChange" ref="asidecompany"/>
      </div>
    </template>

    <CompaniesTable :asideParams="asideParams" @set-loading="onSetLoading" ref="companiestable" class="p-[10px] pb-0"/>
  </AuthenticatedLayout>
</template>

<style scoped>

</style>
