<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import CompanyFull from "~/components/Lists/Companies/CompanyFull.vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'Company.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <CompanyFull/>
  </AuthenticatedLayout>
</template>
