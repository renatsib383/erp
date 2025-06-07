<script setup>
import AuthenticatedLayout from '~/layouts/AuthenticatedLayout.vue'
import salaryFull from '~/components/Salary/salaryFull.vue'

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'Salary.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <salaryFull/>
  </AuthenticatedLayout>
</template>
