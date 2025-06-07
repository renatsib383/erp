<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import PositionFull from "~/components/Lists/Positions/PositionFull.vue";

const sidebarMenuLoading = ref(false)

definePageMeta({
  permission: 'Position.viewAny',
});
</script>

<template>
  <AuthenticatedLayout :loading="sidebarMenuLoading" :isAsideAvailable = "false">
    <template #aside></template>
    <section class="section h-[calc(100%-20px)] bg-surface-200 shadow m-[10px] !p-0">
      <PositionFull/>
    </section>
  </AuthenticatedLayout>
</template>
