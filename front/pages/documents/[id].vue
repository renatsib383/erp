<script setup>
import AuthenticatedLayout from '~/layouts/AuthenticatedLayout.vue'
import PDFWrapper from "~/components/Common/PDFWrapper.vue";

const sidebarMenuLoading = ref(false)
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <PDFWrapper/>
  </AuthenticatedLayout>
</template>
