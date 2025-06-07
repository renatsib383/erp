<script setup>
import {useConfirm} from "primevue/useconfirm";
import {deleteUser, saveUserData, fetchUser} from "~/services/api/usersServices.js";
import {useMainStore} from "~/stores/main.js";
import {formatDateTimeStr} from "~/utils/date-functions.js";
import ModalHeader from "~/components/Common/ModalHeader.vue";
import ChangeJournal from "~/components/Common/СhangeJournal.vue";
const {$showErrorToast, $showSuccessToast } = useNuxtApp()

const dialogRef = inject("dialogRef");
const route = useRoute();
const store = useMainStore()
const listsStore = useListsStore()

const userOriginal = ref(dialogRef && dialogRef.value ? JSON.parse(JSON.stringify(dialogRef.value.data.modalData)) : {});
const user = ref(userOriginal.value ? JSON.parse(JSON.stringify(userOriginal.value)) : null);

const getData = async () => {
  const id = route.params.id ? route.params.id : user.value?.id;

  const response = await fetchUser(id);
  if(response.success) {
    userOriginal.value = response.data ? JSON.parse(JSON.stringify(response.data)) : {};
    user.value = userOriginal.value ? JSON.parse(JSON.stringify(userOriginal.value)) : null
  }
  user.value.chief = user.value.profile?.chief || null
  userOriginal.value.chief = user.value.profile?.chief || null
  setTimeout(() => isUserChanged.value = false)
}

if (Object.keys(user.value).length <= 2) {
  await getData();
}

//для нового пользователя
// user.value.available_stages = user.value.available_stages ? user.value.available_stages : [];
user.value.chief = user.value.profile?.chief || null
user.value.fio = user.value.profile?.fio || null
user.value.telephone = user.value.profile?.phone || null
userOriginal.value.chief = user.value.profile?.chief || null
userOriginal.value.fio = user.value.profile?.fio || null
userOriginal.value.telephone = user.value.profile?.phone || null

const errors = ref({});
const incompleteRecords = ref(false);
const emit = defineEmits(["save"]);

const buttonText = ref("Сохранить");
if (!user.value.id) {
  buttonText.value = "Создать";
}

const isUserChanged = ref(false);

const chiefOptions = computed(() => {
  return listsStore?.usersWithRolesList ? listsStore.usersWithRolesList : []
})

const setNewData = async () => {
  const result = await saveUserData({...user.value});

  if (result.success) {
    if (result.type === "update") {
      for (const [key, value] of Object.entries(user.value)) {
        user.value[key] = value;
        userOriginal.value[key] = value;
      }
      $showSuccessToast('Данные пользователя обновлены!')
    }
    if (result.type === "create") {
      store.setNewModal({ modalData: result.data, modalTitle: 'user' });
      $showSuccessToast('Пользователь добавлен!')
      dialogRef?.value?.close();
    }


    setTimeout(() => {
      store.addNewUserToTable(result.data);
      isUserChanged.value = false;
    })
  }
  else {
    if (result.type === "error") {
      $showErrorToast(result.message)
    }
  }
};

const loginAsUser = async (userId) => {
  //!!! try {
  //   const response = await axios.post(route('loginAsUser'), { userId });
  //   if (response.status === 200) {
  //     window.location.reload();
  //   }
  // } catch (error) {
  //   console.error("Ошибка авторизации:", error);
  // }
};

//
watch(user,(newValue) => {
  const isAllowed = checkPermission('User', 'update')
  if (!isAllowed) return

  isUserChanged.value = deepEqual(userOriginal.value, user.value, ["updated_at"]);
},{ deep: true });

// Меню
const menu = ref();
const items = ref([
  // {
  //   label: 'Удалить',
  //   icon: 'pi pi-trash',
  //   command: (event) => {
  //     if(user.value.id){
  //       showDeleteConfirmPopup(event)
  //     }
  //   },
  // },
]);
const confirm = useConfirm()

const toggle = (event) => {
  menu.value.toggle(event);
};

// const showDeleteConfirmPopup = (event) => {
//   confirm.require({
//     target: event.currentTarget,
//     message: `Вы точно хотите удалить ${user.value.name}?`,
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
//     accept: async() => {
//       const res = await deleteUser(user.value.id)
//       if(res.success){
//         dialogRef.value.close();
//         emit('delete', {userId: user.value.id});
//       }
//     },
//   });
// }

//Табы
const activeTab = ref(0)

// Управление состоянием модалки
const collapsed = ref(false)
if(user.value?.isCollapsed){
  collapsed.value = true;
}
const closeModal = () => {
  const removedModal = {
    modalData: user.value,
    modalTitle: 'user',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: user.value.id, objectName: 'user'});
  dialogRef.value.close();
};

const collapseModal = (value) => {
  emit("collapse", { id: user.value.id, value,  objectName: 'user'});
  if(value){ // Задержка перед скрытием содержимого модалки
    setTimeout(() =>{
      collapsed.value = value;
    }, 100)
  } else {
    collapsed.value = value;
  }
};

const unCollapseModal = (event) => {
  const target = event.target.closest("button");  // Проверяем, клик был ли сделан по кнопке
  if (!target) {
    collapseModal(false);
  }
};

</script>

<template>
  <div class="h-full">
    <modal-header
        :id="user?.id"
        :title="`Пользователь ${user?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isUserChanged"
        :saveText="buttonText"
        page="users"
        icon="/images/menu/users.svg"
        backLink="/users"
        @save="setNewData"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="user && !collapsed" @submit.prevent="setNewData" class="modal-form">
      <section class="bg-modal-panel-bg p-2 pt-0 overflow-hidden h-full">
        <nav class="custom-nav">
          <div class="flex items-center text-nowrap">
            <p @click = 'activeTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : activeTab === 0}">Основное</p>
          </div>
          <span @click.stop="activeTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : activeTab === 10}" title="История"/>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto">
          <div v-show="activeTab === 0" class="grid grid-cols-2 max-sm:grid-cols-1 gap-2 p-1">
            <IftaLabel>
              <label class="text-sm text-surface-400">ФИО</label>
              <InputText v-model="user.fio" :disabled="user.id"/>
            </IftaLabel>
            <iftaLabel>
              <label  class="text-sm text-surface-400">Телефон</label>
<!--              <InputText v-model="user.telephone" />-->
              <InputMask
                  v-model="user.telephone"
                  mask="+7 (999) 999-99-99"
                  class="w-full rounded-none"
                  placeholder="+7 (___) ___-__-__"
                  :disabled="user.id"
              />
            </iftaLabel>
            <iftaLabel>
              <label class="text-sm text-surface-400">Почта</label>
              <InputText v-model="user.email" class="w-full" type="email" :disabled="user.id"/>
            </iftaLabel>
            <iftaLabel :class="{'ring-[1px] ring-red-400':user.name === '' && incompleteRecords}">
              <label class="text-sm text-surface-400">Имя пользователя</label>
              <InputText v-model="user.name" :disabled="user.id"/>
            </iftaLabel>
            <iftaLabel :class="{'ring-[1px] ring-red-400':user.password === '' && incompleteRecords}">
              <label  class="text-sm text-surface-400">Пароль</label>
              <InputText
                type="password"
                v-model="user.password"
                name="pass"
                autocomplete="new-password"
                class="w-full"
                :disabled="user.id"
              />
            </iftaLabel>
            <ifta-label>
<!--                  @update:modelValue="emitNewParams"-->
              <FormVSelect
                  v-model="user.roles"
                  :options="[]"
                  :reduce="option => option.id"
                  multiple
                  label="name"
                  class="w-full h-full"
                  placeholder="Не указано"
                  :disabled="user.id"
              />
              <label>Роли</label>
            </ifta-label>
            <iftaLabel>
              <label>Руководитель</label>
              <Select
                v-model="user.chief"
                :options="chiefOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="Выберите"
                class="w-full"
              />
            </iftaLabel>
            <iftaLabel>
              <label>Статус</label>
              <Select
                v-model="user.status"
                :options="[
                  { value: 0, label: 'Выключен' },
                  { value: 1, label: 'Включен' },
                  { value: 3, label: 'Заблокирован' }
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Выберите"
                class="w-full"
              />
            </iftaLabel>

<!--            <iftaLabel>-->
<!--              <label>Отдел</label>-->
<!--              <Select-->
<!--                v-model="user.department"-->
<!--                optionLabel="label"-->
<!--                optionValue="value"-->
<!--                placeholder="Выберите"-->
<!--                class="w-full"-->
<!--              />-->
<!--            </iftaLabel>-->
<!--            <iftaLabel>-->
<!--              <label>Филиал</label>-->
<!--              <Select-->
<!--                v-model="user.affiliate"-->
<!--                optionLabel="label"-->
<!--                optionValue="value"-->
<!--                placeholder="Выберите"-->
<!--                class="w-full"-->
<!--              />-->
<!--            </iftaLabel>-->
<!--            <FormDatePickerCustom-->
<!--                v-model="user.admission_date"-->
<!--                id="created"-->
<!--                :label="'Дата приема'"-->
<!--              >-->
<!--            </FormDatePickerCustom>-->
<!--            <FormDatePickerCustom-->
<!--                v-model="user.dismissal_date"-->
<!--                id="created"-->
<!--                :label="'Дата увольнения'"-->
<!--              >-->
<!--            </FormDatePickerCustom>-->
<!--            <FormDatePickerCustom-->
<!--                v-model="user.enddate_probationary_period"-->
<!--                id="created"-->
<!--                :label="'Дата окончания испытуемого срока'"-->
<!--              >-->
<!--            </FormDatePickerCustom>              -->
<!--           -->
<!--            <iftaLabel>-->
<!--              <label>Оклад</label>-->
<!--              <InputText v-model="user.salary" type="number"/>-->
<!--            </iftaLabel>-->
<!--            <ifta-label>-->
<!--              <label>Дополнительные роли</label>-->
<!--              <FormVSelect-->
<!--                v-model="user.additional_roles"-->
<!--                :options="roleOptions"-->
<!--                :reduce="role => role.value"-->
<!--                label="label"-->
<!--                taggable-->
<!--                multiple-->
<!--              />-->

<!--            </ifta-label>-->
          </div>
<!--          v-show="activeTab === 0"-->
          <Button v-if="false" @click="loginAsUser(user.id)" class="button-modal">
            Авторизоваться
          </Button>
          <div v-show="activeTab === 10">
            <change-journal :events="user.events"/>
          </div>
      </main>
      </section>

      <section class="max-lg:hidden bg-modal-panel-bg p-2 pt-0">

      </section>

      <!-- <div class="mt-2 flex justify-center items-center absolute top-0 right-[65px] max-sm:right-11 ">
        <Button type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu" class="!p-[6px] !bg-none hover:bg-surface-100 hover:border-surface-100 hover:text-slate-500  !rounded-full" ><span class="pi pi-ellipsis-h text-xl cursor-pointer"></span></Button>
        <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
      </div> -->
      <ConfirmPopup></ConfirmPopup>
    </form>
  </div>
</template>


<style>
</style>
