<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import {ref} from "vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'Role.viewAny',
});
</script>

<template>
  <authenticated-layout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <RolesFull/>
  </authenticated-layout>
</template>