<script setup>
import {fetchPosition} from "~/services/api/positionsServices.js";

const dialogRef = inject('dialogRef');

const positionOriginal = ref(dialogRef ? dialogRef.value.data.positionData : null);
const position = ref(positionOriginal.value ? JSON.parse(JSON.stringify(positionOriginal.value)) : null);

const emit = defineEmits(["save"]);

const buttonText = ref("Сохранить");
if (position.value && !position.value.id) {
  buttonText.value = "Создать";
}

const isPositionChanged = ref(false);

// watch(position,() => {
//   isPositionChanged.value = true;
// }, { deep: true });

const getPositionData = async () => {
  const id = route.params.id;
  const response = await fetchPosition(id)
  if(response.success){
    position.value = await response.data;
  }

  setTimeout(() => isPositionChanged.value = false)
}
if(!position.value){
  getPositionData()
}

// const setNewData = async () => {
//   if (position.value.id) {
//     try {
//       const response = await $api.put(`/positions/${position.value.id}`, position.value);
//       if (response.status === 200) {
//         for (const [key, value] of Object.entries(response.data)) {
//          positionOriginal.value[key] = value;
//         }
//         isPositionChanged.value = false;
//         dialogRef.value.close();
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   } else {
//     try {
//       const response = await $api.post("/positions", position.value);
//       if (response.status === 200) {
//         isPositionChanged.value = false;
//         emitNewPosition(response.data);
//         dialogRef.value.close();
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }
// };

// const emitNewPosition = (newPosition) => {
//   emit("save", { position: newPosition });
// };

const closeModal = () => {
  dialogRef.value.close();
}

// const showDeletePositionConfirmPopup = (event) => {
//   confirm.require({
//     target: event.currentTarget,
//     message: 'Вы точно хотите удалить?',
//     icon: 'pi pi-info-circle',
//     rejectProps: {
//       label: 'Отмена',
//       severity: 'secondary',
//       outlined: true
//     },
//     acceptProps: {
//       label: 'Удалить',
//       severity: 'danger'
//     },
//     accept: async () => {
//       await $api.delete(`/positions/${position.value.id}`);
//       dialogRef.value.close();
//       emit('delete', {positionId: position.value.id});
//     },
//     reject: () => null,
//   });
// }

// Меню
const menu = ref();
const items = ref([
  // {
  //   label: 'Удалить',
  //   icon: 'pi pi-trash',
  //   command: (event) => {
  //     if(position.value.id){
  //       showDeletePositionConfirmPopup(event)
  //     }
  //   },
  // },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

// Вкладки
const activeTab = ref(0) // Активная вкладка (по умолчанию "Основное")

</script>

<template>
  <header class="modal-header flex items-center justify-between px-4 py-[8px] bg-slate-500 text-white font-bold text-xl">
    <div class="flex items-center gap-1">
      <img loading="lazy" src="/images/menu/users.svg" alt="deal-logo" width="29px" height="36px">
      <h2 class="font-semibold text-primary-100">Должность {{position ? position.id : null}}</h2>
    </div>
    <div class="flex items-center gap-2 text-base">
      <!-- <button
          v-show="false"
          @click="collapseModal(true)"
          class="custom-collapse-button"
      >
        <span class="pi pi-minus"></span>
      </button> -->
      <div class="flex justify-center items-center">
        <Button type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu" class="custom-collapse-button" ><span class="pi pi-ellipsis-h text-xl cursor-pointer"></span></Button>
        <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
      </div>
      <div v-if="isPositionChanged" class="mt-2 flex justify-center items-center absolute top-1 right-24 max-sm:right-20 z-10" >
        <Button @click="setNewData" class="custom-collapse-button" >
          <i class="pi pi-check-circle mr-1"></i>
          <p>{{ buttonText }}</p>
        </Button>
      </div>
      <button
          v-if="dialogRef"
          @click.prevent="closeModal"
          class="custom-collapse-button text-white bg-transparent transition duration-200 ease-in-out hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800/80 focus:outline-none focus:outline-offset-0 border-0', flex items-center justify-center rounded-full focus:ring focus:ring-inset focus:ring-primary-400/50 w-8 h-8 p-1"
      >
        <span class="pi pi-times"></span>
      </button>
      <NuxtLink v-else to="/companies"><button title="Вернуться к списку" class="custom-collapse-button text-white bg-transparent transition duration-200 ease-in-out hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800/80  border-0', flex items-center justify-center rounded-full w-8 h-8 p-1"><span class="pi pi-list text-xl"/></button></NuxtLink>
    </div>
  </header>
  <form v-if="position" @submit.prevent="setNewData" class="grid grid-cols-[.35fr_.65fr] max-lg:grid-cols-1 h-[calc(100%-var(--modal-header-height))] gap-2 pt-1 overflow-hidden">
    <section class="bg-white p-2 pt-0 overflow-hidden h-full">
      <nav class="custom-nav">
        <div class="flex items-center">
          <p @click = 'activeTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : activeTab === 0}">Основное</p>
        </div>
        <span @click.stop="activeTab = 2" class="custom-nav-history" :class="{'custom-nav-tab_active' : activeTab === 2}" title="История"/>
      </nav>
      <main class="mt-2 h-[calc(100%-50px)] overflow-auto" :class="{'!h-[calc(100%-108px)]': !dialogRef}">
        <div v-show="activeTab === 0" class="rounded-md grid md:grid-cols-2 gap-2">
          <ifta-label>
            <label class="text-sm text-gray-400">Наименование</label>
            <InputText v-model="position.name"/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-gray-400">Компании</label>
            <Select
              class="custom-v-select w-full"
              v-model="position.company"
              :options="[]"
              optionValue="id"
              optionLabel="name"
            />
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-gray-400">Сортировка</label>
            <InputNumber v-model="position.sort" class="w-full"/>
          </ifta-label>
        </div>
      </main>
    </section>

    <section class="bg-white p-2 pt-0 max-lg:hidden" >

    </section>

  </form>
</template>


<style></style>
