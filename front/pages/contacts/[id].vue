<script setup>
import AuthenticatedLayout from '~/layouts/AuthenticatedLayout.vue'
import ContactFull from "~/components/Lists/Contacts/ContactFull.vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'Contact.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <ContactFull/>
  </AuthenticatedLayout>
</template>
