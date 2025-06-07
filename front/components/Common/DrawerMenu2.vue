<template>
  <Drawer 
    :position="position"
    v-model:visible="isVisible" 
    class="drawer-menu mb-[60px] md:mb-0 !border-0 !transition-all !duration-200 md:ml-[60px]"
    :class="drawerClasses"
  >
  <template #container>
    <slot></slot>
  </template>
  </Drawer>
</template>

<script setup>

    const isVisible = defineModel('isVisible');

    watch(isVisible,(newValue) => {
      if (newValue) {
        getPosition();
      }
    })

    const store = useMainStore();

    const drawerClasses = computed({
      get() {
        return {
          "md:!ml-[var(--sidebar-width-expanded)]": store.isSidebarExpanded,
        }
      },
    });    

    const position = ref(null);

    onMounted(() => {
        getPosition();
    })

    const getPosition = () => {
      if (document.documentElement && document.documentElement.clientWidth < 768) {
            position.value = 'bottom';
        } else {
            position.value = 'left';
        }
    }
    
</script>

<style>

</style>