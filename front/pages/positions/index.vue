<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import PositionsTable from "~/components/Lists/Positions/PositionsTable.vue";
import PositionsAside from "~/components/Lists/Positions/PositionsAside.vue";

const sidebarMenuLoading = ref(false)

const positionstable = ref(null);
const asideParams = ref({
  search: '',
})

const onChangeSearchValue = (value) => {
  asideParams.value.search = value
}

const onSetNewPosition = () => {
  if(positionstable.value){
    positionstable.value.setNewPosition();
  }
}

definePageMeta({
  permission: 'Position.view',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px]">
        <PositionsAside @change-searchValue="onChangeSearchValue" @set-new-position="onSetNewPosition" />
      </div>
    </template>

    <PositionsTable :asideParams="asideParams" ref="positionstable" class="p-[10px] pb-0"/>
  </AuthenticatedLayout>

</template>

<style scoped>

</style>
