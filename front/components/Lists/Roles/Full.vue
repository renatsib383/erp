<script setup>
import {defineEmits, inject, ref, watch} from "vue";
// import Select from "primevue/select";
// import IftaLabel from "primevue/iftalabel";
import {useConfirm} from "primevue/useconfirm";
import { fetchRole, setNewData } from "~/services/api/rolesServices.js";
const { $api } = useNuxtApp();

import { page } from '~/services/fakedata/rolesPageData.js';


const dialogRef = inject("dialogRef");
const emit = defineEmits(["save", 'delete']);
const confirm = useConfirm();

const roleOriginal = ref(dialogRef ? dialogRef.value.data.roleData : null);
const role = ref(roleOriginal.value ? JSON.parse(JSON.stringify(roleOriginal.value)) : null);
const isRoleChanged = ref(false);
const buttonText = ref("Сохранить");
if (role.value && !role.value.id) {
  buttonText.value = "Создать";
}

watch(role, ()=> {
  isRoleChanged.value = true;
}, {deep: true})

const emitNewRole = (newRole) => {
  emit("save", { role: newRole });
};


const saveRole = async () => {
  try { 
    await setNewData(role, roleOriginal, isRoleChanged, dialogRef, emitNewRole);
  }
  catch (e) {
    console.log(e);
  }
}

const getRoleData = async () => {
  const path = window.location.pathname.split('/');
  const id = path[path.length-1];

    const res = await fetchRole(id);
    if(res.success) {
      role.value = res.data;
    }
  setTimeout(() => isRoleChanged.value = false)
}

if(!role.value){
  getRoleData()
}

const showDeleteRoleConfirmPopup = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Вы точно хотите удалить?',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Отмена',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Удалить',
      severity: 'danger'
    },
    accept: async () => {
      await $api.delete(route('role.destroy', role.value.id));
      emit('delete', {roleId: role.value.id});
      dialogRef ? dialogRef.value.close() : null;
    },
    reject: () => null,
  });
}

// Меню
const menu = ref();
const items = ref([
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: (event) => {
      if(role.value.id){
        showDeleteRoleConfirmPopup(event)
      }
    },
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
// Вкладки
const leftActiveTab = ref(0)
const rightActiveTab = ref(0)

const closeModal = () => {
  dialogRef.value.close();
}

// Разрешения
const permissionObjects = ref([
  {
    name: 'Сделки',
    pipelines: page.pipelines,
  },
  {
    name: 'Компании',
  },
  {
    name: 'Работы',
  },
  {
    name: 'Пользователи',
  },
])

</script>

<template>
    <section class="section bg-surface-200 dark:bg-surface-900 shadow !p-0">

      <header class="modal-header flex items-center justify-between px-4 py-[8px] bg-slate-500 text-white font-bold text-xl">
        <div class="flex items-center gap-1">
          <img loading="lazy" src="/images/menu/users.svg" alt="deal-logo" width="29px" height="36px">
          <h2 class="font-semibold text-primary-100">Роль {{role ? role.id : null}}</h2>
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
          <div v-if="isRoleChanged" class="mt-2 flex justify-center items-center absolute top-1 right-24 max-sm:right-20 z-10" >
            <Button @click="setNewData" class="absolute -top-3 h-[46px] right-[5px]  px-3 !bg-emerald-500 hover:bg-emerald-700 text-white border-0 text-base flex items-center justify-center p-1" >
              <i class="pi pi-check-circle mr-1"></i>
              <p>{{ buttonText }}</p>
            </Button>
          </div>
          <button
              v-if="dialogRef"
              @click.prevent="closeModal"
              class="custom-collapse-button"
          >
            <span class="pi pi-times"></span>
          </button>
          <NuxtLink v-else to="/roles"><button title="Вернуться к списку" class="custom-collapse-button"><span class="pi pi-list text-xl"/></button></NuxtLink>
        </div>
      </header>  
  
      <form v-if="role" @submit.prevent="saveRole" class="modal-form">
        <section class="bg-modal-panel-bg p-2 pt-0 overflow-hidden h-full">
          <nav class="custom-nav">
            <div class="flex items-center text-nowrap">
              <p @click='leftActiveTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 0}">Основное</p>
              <p @click='leftActiveTab = 1' class="lg:hidden custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 1}">Разрешения</p>
              <p @click='leftActiveTab = 2' class="lg:hidden custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 2}">Настройка уведомлений</p>
            </div>
            <span @click.stop="leftActiveTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : leftActiveTab === 10}" title="История"/>
          </nav>
          <main class="mt-2 h-[calc(100%-60px)] overflow-auto" :class="{'!h-[calc(100%-108px)]': !dialogRef}">
            <div v-show="leftActiveTab === 0" class="grid grid-cols-2 gap-2 p-1 max-sm:grid-cols-1 text-surface-400">
              <IftaLabel>
                <label >Name</label>
                <InputText v-model="role.name" class="w-full" />
              </IftaLabel>
              <IftaLabel>
                <label >Название</label>
                <InputText v-model="role.description" class="w-full" />
              </IftaLabel>
              <IftaLabel>
                <label >Должность по умолчанию</label>
                <Select
                  v-model="role.position"
                  id="company"
                  :options="[]"
                  optionValue="id"
                  optionLabel="name"
                  class="w-full"
                />
              </IftaLabel>
              <IftaLabel>
                <label >Индекс сортировки</label>
                <InputNumber v-model="role.sort" class="w-full" />
              </IftaLabel>
            </div>
            <div v-show="leftActiveTab === 1" class="lg:hidden flex items-center gap-2 pr-2 justify-end">
                <label for="allPermissions">Все разрешения</label>
                <input id="allPermissions" @click.stop type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
            </div>
            <Accordion v-show="leftActiveTab === 1" value="0" class="lg:hidden">
                <AccordionPanel v-for="(object,index) in permissionObjects" :key="index" :value="index" class="!p-0">
                  <AccordionHeader>
                    <div class="flex justify-between w-full pr-2">
                      <span class="whitespace-nowrap">{{object.name}}</span>
                      <input @click.stop type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                    </div>
                  </AccordionHeader>
                  <AccordionContent>
                    <div class="flex items-center">
                      <div class="grid gap-2 max-sm:grid-cols-2 grid-cols-4 items-center">
                        <label class="text-sm text-surface-400">Полный доступ</label>
                        <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                        <label class="text-sm text-surface-400">Добавление</label>
                        <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                        <label class="text-sm text-surface-400">Изменение</label>
                        <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                        <label class="text-sm text-surface-400">Удаление</label>
                        <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                        <label class="text-sm text-surface-400">Просмотр журнала изменений</label>
                        <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                      </div>
                    </div>

                    <Accordion value="2" v-if="object.pipelines">
                      <h3 class="mt-4 font-semibold text-slate-500 text-center">Разрешения для воронок и этапов</h3>
                      <AccordionPanel v-for="pipeline in object.pipelines" :key="pipeline.id" :value="pipeline.id">
                        <AccordionHeader>
                          <div class="flex justify-between w-full pr-2">
                            <span class="whitespace-nowrap">{{ pipeline.name }}</span>
                            <input @click.stop type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                          </div>
                        </AccordionHeader>
                        <AccordionContent>
                          <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2">
                              <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                              <label class="text-sm text-surface-400">Общее разрешение для воронки</label>
                            </div>
                            <div class="flex items-center gap-2">
                              <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                              <label class="text-sm text-surface-400">Общее разрешение для воронки</label>
                            </div>
                          </div>
                          <h2 class="mt-4 font-semibold text-slate-500 text-center">Этапы воронки "{{pipeline.name}}"</h2>
                          <div v-for="stage in pipeline.stages" :key="stage.id">
                            <div class="p-2 flex items-center" :style="{ backgroundColor: stage.color }">
                              <Checkbox/>
                              <label class="ml-2" :for="stage.id">{{ stage.title }}</label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionPanel>
                    </Accordion>

                  </AccordionContent>
                </AccordionPanel>
              </Accordion>

            <div v-show="leftActiveTab === 10" >
              <Timeline :value="[1,2]" align="alternate" class="w-full">
                <template #content="slotProps">
                  <p>Обновлен</p>
                  <p>Изменено: 123</p>
                  <p>12.12.2024</p>
                </template>
              </Timeline>
            </div>
          </main>
        </section>

        <section class="bg-modal-panel-bg p-2 pt-0 max-lg:hidden overflow-hidden h-full">
          <nav class="relative flex items-center gap-2 border-b-2 text-surface-700 dark:text-surface-400 justify-between">
            <div class="flex items-center">
              <p @click='rightActiveTab = 0' class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : rightActiveTab === 0}">Разрешения</p>
              <p @click='rightActiveTab = 1' class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : rightActiveTab === 1}">Настройка уведомлений</p>
            </div>
          </nav>
          <main class="mt-2 h-[calc(100%-60px)] overflow-auto" :class="{'h-[calc(100%-108px)]': !dialogRef}">
            <div v-show="rightActiveTab === 0" class="flex items-center gap-2 mr-2 justify-end mb-2">
              <label for="allPermissions">Все разрешения</label>
              <input id="allPermissions" @click.stop type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
            </div>
            <Accordion v-show="rightActiveTab === 0" value="0">
              <AccordionPanel v-for="(object,index) in permissionObjects" :key="index" :value="index" class="!p-0">
                <AccordionHeader>
                  <div class="flex justify-between w-full pr-2">
                    <span class="whitespace-nowrap">{{object.name}}</span>
                    <input @click.stop type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                  </div>
                </AccordionHeader>
                <AccordionContent>
                  <div class="flex items-center">
                    <div class="grid gap-2 max-sm:grid-cols-2 grid-cols-4 items-center">
                      <label class="text-sm text-surface-400">Полный доступ</label>
                      <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                      <label class="text-sm text-surface-400">Добавление</label>
                      <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                      <label class="text-sm text-surface-400">Изменение</label>
                      <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                      <label class="text-sm text-surface-400">Удаление</label>
                      <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">

                      <label class="text-sm text-surface-400">Просмотр журнала изменений</label>
                      <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                    </div>
                  </div>

                  <Accordion value="2" v-if="object.pipelines">
                    <h3 class="mt-4 font-semibold text-slate-500 text-center">Разрешения для воронок и этапов</h3>
                    <AccordionPanel v-for="pipeline in object.pipelines" :key="pipeline.id" :value="pipeline.id">
                      <AccordionHeader>
                        <div class="flex justify-between w-full pr-2">
                          <span class="whitespace-nowrap">{{ pipeline.name }}</span>
                          <input @click.stop type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                        </div>
                      </AccordionHeader>
                      <AccordionContent>
                        <div class="flex flex-col gap-1">
                          <div class="flex items-center gap-2">
                            <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                            <label class="text-sm text-surface-400">Общее разрешение для воронки</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <input  type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
                            <label class="text-sm text-surface-400">Общее разрешение для воронки</label>
                          </div>
                        </div>
                        <h2 class="mt-4 font-semibold text-slate-500 text-center">Этапы воронки "{{pipeline.name}}"</h2>
                        <div v-for="stage in pipeline.stages" :key="stage.id">
                          <div class="p-2 flex items-center" :style="{ backgroundColor: stage.color }">
                            <Checkbox/>
                            <label class="ml-2" :for="stage.id">{{ stage.title }}</label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionPanel>
                  </Accordion>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
            <div v-show="rightActiveTab === 1"></div>
          </main>
        </section>

        <div v-if="isRoleChanged" class="mt-2 flex justify-center items-center absolute top-1 right-24 max-sm:right-20 z-10">
          <Button type="submit" class="absolute -top-3 h-[46px] right-[5px]  px-3 !bg-emerald-500 hover:bg-emerald-700 text-white border-0 text-base flex items-center justify-center p-1">
            <i class="pi pi-check-circle mr-1"></i>
            <p>{{ buttonText }}</p>
          </Button>
        </div>
        <!-- <div class="mt-2 flex justify-center items-center absolute top-0 right-[65px] max-sm:right-11 ">
          <Button type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu" class="!p-[6px] !bg-none hover:bg-surface-100 hover:border-surface-100 hover:text-slate-500  !rounded-full" ><span class="pi pi-ellipsis-h text-xl cursor-pointer"></span></Button>
          <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
        </div> -->
        <ConfirmPopup></ConfirmPopup>
      </form>
  </section>
</template>

