<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import {ref} from "vue";

const roletable = ref(null)
const sidebarMenuLoading = ref(false)
const asideParams = ref({
  search: '',
})

const onSetNewRole = () => {
  if(roletable.value){
    roletable.value.setNewRole();
  }
}

const onChangeSearchValue = (value) => {
  asideParams.value.search = value
}

definePageMeta({
  permission: 'Role.viewAny',
});
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px]">
        <RolesAside @change-searchValue="onChangeSearchValue" @set-new-role="onSetNewRole"/>
      </div>
    </template>
    <RolesTable :asideParams="asideParams" ref="roletable" class="p-[10px] pb-0"/>
  </authenticated-layout>

</template>

<style scoped>

</style>

