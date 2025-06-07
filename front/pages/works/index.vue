<script setup>
import AsideWork from "~/components/Lists/Works/AsideWork.vue";
import WorksTable from "~/components/Lists/Works/WorksTable.vue";
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import {fetchWorksDataLists} from "~/services/api/worksServices.js";

const asidework = ref(null);
const workstable = ref(null);
const cachedLists = ref({})

const asideParams = ref({
    search: '',
    filter : {
      group: null,
    }
})

defineProps({
    datatable: {
        type: Object,
        required: true,
    }
});

const getWorksDataList = async () => {
  cachedLists.value = await fetchWorksDataLists()
}; getWorksDataList()

const onChangeSearchValue = (value) => {
    asideParams.value.search = value
}
const onSetNewWork = () => {
  workstable.value.setNewWork()
}
const onParamsChange = (value) => {
  asideParams.value.filter.group = value.group
}

// const onSetNewCollectioin = () => {
//    workstable.value.setNewWorkCollection()
// }
//
// const onSetNewCategory = () => {
//   workstable.value.setNewCategory()
// }

const sidebarMenuLoading = ref('');
const onSetLoading = (value) => {
    sidebarMenuLoading.value = value;
};

// const onTabChanged = (newTab) => {
//   asidework.value.showAddButtonFor = newTab
// }

definePageMeta({
  permission: 'Work.view',
});
</script>

<template>
    <AuthenticatedLayout :loading="sidebarMenuLoading">
        <template #aside>
            <div class="w-[316px]">
                <AsideWork :cachedLists="cachedLists" @change-searchValue="onChangeSearchValue" @set-newwork="onSetNewWork" @change-params="onParamsChange" ref="asidework" />
            </div>
        </template>
        <WorksTable ref="workstable" :datatable="datatable" :asideParams="asideParams" :cachedLists="cachedLists" @set-loading="onSetLoading" class="p-[10px] pb-0"/>
    </AuthenticatedLayout>
</template>

<style scoped></style>
