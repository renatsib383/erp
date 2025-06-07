<script setup>
import ContactsTable from '~/components/Lists/Contacts/ContactsTable.vue';
import AsideContacts from "~/components/Lists/Contacts/AsideContacts.vue";
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";

const contactTable = ref(null);
const asideParams = ref({
  search: '',
})

const onChangeSearchValue = (value) => {
  asideParams.value.search = value
}

const onSetNewContact = () => {
  if(contactTable.value){
    contactTable.value.setNewContact();
  }
}

definePageMeta({
  permission: 'Contact.view',
});
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading">
    <template #aside>
      <div class="w-[316px]">
        <AsideContacts @change-searchValue="onChangeSearchValue" @set-new-contact="onSetNewContact"/>
      </div>
    </template>
    <ContactsTable :asideParams="asideParams" ref="contactTable" class="p-[10px] pb-0"/>
  </authenticated-layout>
</template>
