<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import CollectionsFull from "~/components/Lists/Works/CollectionsFull.vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'WorkCollection.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <CollectionsFull/>
  </AuthenticatedLayout>
</template>
