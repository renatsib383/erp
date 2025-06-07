<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import WorkFull from "~/components/Lists/Works/WorkFull.vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'Work.viewAny',
});
</script>

<template>
  <Head title="Настройка роли" />
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <template #aside></template>

    <WorkFull/>
  </AuthenticatedLayout>
</template>
