<script setup>

const props = defineProps({
  id: Number,
  title: String,
  icon: String,
  collapsed: Boolean,
  dialogRef: Boolean,
  isChanged: Boolean,
  saveText: String,
  backLink: String,
  page: String,
});
const emit = defineEmits(["uncollapse", "collapse", "save", "close"]);

const currentPage = ref(window.location.href)

onMounted(() => {
  if(!props.collapsed){
    setUrl()
  }
})

const setUrl = () => {
  const newUrl = props.id ? `/${props.page}/${props.id}` : null;
  if (newUrl) {
    window.history.pushState(currentPage.value, '', newUrl)
  }
}

const clearURL = () => {
  const oldUrl = window.location.href;
  window.history.pushState(oldUrl, '', currentPage.value)
}

const onUncollapse = (event) => {
  emit("uncollapse", event);
  setUrl()
}

const onCollapse = (value) => {
  emit("collapse", value);
  if(value) clearURL()
}

const onSave = () => emit("save");

const onClose = () => {
  emit("close");
  clearURL();
}

</script>

<template>
  <header
      @click="onUncollapse"
      class="bg-modal-header modal-header flex items-center justify-between px-4 text-lg text-white h-[40px]"
      :class="{'hover:bg-modal-header-hover cursor-pointer': collapsed}"
  >
    <div class="flex items-center gap-1">
      <img loading="lazy" :src="icon" alt="modal-logo" width="28px" height="28px">
      <h2 class="font-normal">{{ title }}</h2>
    </div>
    <div class="flex items-center gap-2 text-base relative">
      <button
          v-show="isChanged && !collapsed"
          @click="onSave"
          class="bg-emerald-400 hover:bg-emerald-700 h-[40px] text-white border-0 flex items-center justify-center py-1 px-2"
      >
<!--        <i class="pi pi-check-circle pr-1"></i>-->
        <p>{{ saveText }}</p>
      </button>
      <button
          title="Свернуть"
          v-show="!collapsed && dialogRef"
          @click.stop="onCollapse(true)"
          class="custom-collapse-button"
      >
        <span class="pi pi-minus"/>
      </button>
      <button
          v-show="!collapsed && id"
          class="custom-collapse-button"
          title="Скопировать ссылку на объект"
          @click="copyLinkToModal(id, page)"
      >
        <span class="pi pi-copy custom-collapse-button cursor-pointer"/>
      </button>
      <button
          v-show="!collapsed && id && id > 0 && dialogRef"
          class="custom-collapse-button"
          title="Открыть в новой вкладке"
          @click="openModalOnPage(id, page)"
      >
        <span class="pi pi-external-link custom-collapse-button cursor-pointer"/>
      </button>
      <button
          title="Закрыть"
          v-if="dialogRef"
          @click.prevent.stop="onClose"
          class="custom-collapse-button text-white bg-transparent transition duration-200 ease-in-out hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800/80 focus:outline-none focus:ring focus:ring-inset focus:ring-primary-400/50 w-8 h-8 p-1"
      >
        <span class="pi pi-times"/>
      </button>
      <NuxtLink v-else :to="backLink">
        <button title="Вернуться" class="custom-collapse-button text-white bg-transparent hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800/80 border-0 flex items-center justify-center rounded-full w-8 h-8 p-1">
          <span class="pi pi-list text-xl"/>
        </button>
      </NuxtLink>
    </div>
  </header>
</template>