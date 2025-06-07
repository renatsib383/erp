<script setup>
import AuthenticatedLayout from '~/layouts/AuthenticatedLayout.vue'
import UserFull from "~/components/Lists/Users/UserFull.vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'User.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <UserFull/>
  </AuthenticatedLayout>
</template>



