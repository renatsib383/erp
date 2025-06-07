<script setup>
import AuthenticatedLayout from '~/layouts/AuthenticatedLayout.vue'
import DdsFull from "~/components/Dds/ddsFull.vue";

const sidebarMenuLoading = ref(false)


definePageMeta({
  permission: 'Dds.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <DdsFull/>
  </AuthenticatedLayout>
</template>
