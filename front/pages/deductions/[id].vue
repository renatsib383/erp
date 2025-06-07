<script setup>
import AuthenticatedLayout from '~/layouts/AuthenticatedLayout.vue'
import DeductionFull from "~/components/Deductions/deductionFull.vue";

const sidebarMenuLoading = ref(false)


// definePageMeta({
//   permission: 'Deduction.viewAny',
// });
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <DeductionFull/>
  </AuthenticatedLayout>
</template>
