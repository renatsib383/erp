<script setup>
import AuthenticatedLayout from '~/layouts/AuthenticatedLayout.vue'
import DealModal from "~/components/Deals/DealModal.vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'Deal.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <DealModal/>
  </AuthenticatedLayout>
</template>
