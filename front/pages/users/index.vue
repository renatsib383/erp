<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import UsersTable from '~/components/Lists/Users/UsersTable.vue';
import AsideUser from '~/components/Lists/Users/AsideUser.vue';

const asideuser = ref(null);
const userstable = ref(null);

const users = ref();
const asideParams = ref({
  search: '',
  filter: {
    department: null,
    affiliate: null,
    chief:null
  }

})

defineProps({
  datatable: {
    type: Object,
    required: true,
  }
});

const onChangeSearchValue = (value) => {
  asideParams.value.search = value
}
const onSetNewUser = () => {
  if (userstable.value) {
    userstable.value.setNewUser()
  }
}

const sidebarMenuLoading = ref('');

const onSetLoading = (value) => {
  sidebarMenuLoading.value = value;
};

const onParamsChange = (value) => {
  asideParams.value.filter = value
}

// const rowClickHandler = (event) => {
//   console.log(event);
//   navigateTo(`/users/${event.data.id}`);
// }
definePageMeta({
  permission: 'User.view',
});
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px]">
        <AsideUser @change-searchValue="onChangeSearchValue" @set-new-user="onSetNewUser" @change-params="onParamsChange" ref="asideuser" />
      </div>
    </template>
    <section class="section absolute w-full h-full">
      <UsersTable :asideParams="asideParams" @set-loading="onSetLoading" ref="userstable" class="p-[10px] pb-0"/>
    </section>
  </authenticated-layout>
</template>


