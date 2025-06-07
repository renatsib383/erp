<script setup>
import { useConfirm } from "primevue/useconfirm";
import {
  deleteAccount,
  deleteCompany,
  deleteImage,
  fetchCompany,
  saveCompany,
  uploadFiles
} from "~/services/api/companiesServices.js";
import {useMainStore} from "~/stores/main.js";
import {formatDateTimeStr} from "~/utils/date-functions.js";
import ModalHeader from "~/components/Common/ModalHeader.vue";
import ChangeJournal from "~/components/Common/СhangeJournal.vue";

const dialogRef = inject("dialogRef");
const emit = defineEmits(["save", 'delete']);
const route = useRoute();
const store = useMainStore()

const apiBase = useRuntimeConfig().public.apiBase;

const companyOriginal = ref(dialogRef ? dialogRef.value.data.modalData : null);
const company = ref(JSON.parse(JSON.stringify(companyOriginal.value)));
const isCompanyChanged = ref(false);
const emptyFields = ref(false)
const companyTypes = [
  {label: 'Холдинг', value:0},
  {label: 'Главная', value:1},
]

const buttonText = ref("Сохранить");
if (company.value && !company.value.id) {
  buttonText.value = "Создать";
}

// const setNewData = async () => {
//   const response = await saveCompany(company.value,)
//   if(response.success){
//     emptyFields.value = false
//     if(response.type === 'update'){
//       for (const [key, value] of Object.entries(response.data)) {
//         companyOriginal.value[key] = value;
//       }
//
//       setTimeout(() => isCompanyChanged.value = false)
//     }
//     else if(response.type === 'create'){
//       await emitNewCompany(response.data);
//     }
//     setTimeout(() => dialogRef.value.close());
//   } else if(response.error === 'emptyFields'){
//     emptyFields.value = true;
//   }
// };

const emitNewCompany = async (newData) => {
  emit("save", { company: newData });
};

const getData = async () => {
  const id = route.params.id ? route.params.id : company.value?.id;
  if(!id){
    return
  }

  const response = await fetchCompany(id)
  if(response.success){
    company.value = response.data
  }
  setTimeout(() => isCompanyChanged.value = false)
}


if(!company.value || Object.keys(company.value).length <= 2){
  getData()
}

// Реквизиты
const showAccountDetailsForm = ref(false);
const currentAccount = ref({});

const addNewAccountDetails = () => {
  window.location.hash='AccountDetailsForm'
  currentAccount.value = { bik: "", account: "", company_id: '' };
  showAccountDetailsForm.value = true;
};

const editAccountDetails = (index) => {
  window.location.hash='AccountDetailsForm'
  currentAccount.value = { ...company.value.bank_accounts[index] };
  currentAccount.value.index = index;
  showAccountDetailsForm.value = true;
  triggerRef(company);
};

const saveAccount = () => {
  window.location.hash = '';
  if (currentAccount.value.index !== undefined) {
    company.value.bank_accounts.splice(currentAccount.value.index, 1, { ...currentAccount.value });
    delete currentAccount.value.index;
  } else {
    currentAccount.value.company_id = company.value.id;
    company.value.bank_accounts.push({ ...currentAccount.value });
  }

  // Закрываем форму
  showAccountDetailsForm.value = false;
};

const accountDetailsDeleteConfirm = (event, account) => {
  console.log(event)
  confirm.require({
    target: event.currentTarget,
    message: 'Вы точно хотите удалить эти реквизиты?',
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
    accept: () => deleteAccount(account),
    reject: () => null,
  });
};

// Картинки
const facsimileEditing = ref(false)
const stampEditing = ref(false)
const logoEditing = ref(false)
const confirm = useConfirm();

const onUploadButtonClick = (event, type) => {
  const file = event.files[0];
  if(file.type.includes('image')) uploadFile(event.files[0], type);
}

const uploadFile = async (file, type) => {
  const result = await uploadFiles(file, company.value.id, type);

  if (result.success) {
    const fileData = result.data.file;
    if (type === 'facsimile') {
      company.value.facsimile = fileData;
      facsimileEditing.value = false;
    }
    if (type === 'stamp') {
      company.value.stamp = fileData;
      stampEditing.value = false;
    }
    if (type === 'logo') {
      company.value.logo = fileData;
      logoEditing.value = false;
    }
  } else {
    console.error(result.message);
  }

  setTimeout(() => isCompanyChanged.value = false, 0);
};

const ImageDeleteConfirm = (event, type) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Вы точно хотите удалить это изображение?',
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
    accept: () => deleteCompanyImages(type),
    reject: () => null,
  });
};

const deleteCompanyImages = async (type) => {
  const res = await deleteImage(company.value.id, type)

  if(res.success){
    if (type === "facsimile") facsimileEditing.value = true
    if (type === "stamp") stampEditing.value = true
    if (type === "logo") logoEditing.value = true
  }
}

// watch(company,() => {
//     isCompanyChanged.value = JSON.stringify(company.value) !== JSON.stringify(companyOriginal.value);
// },{ deep: true });

// Меню
const menu = ref();
const items = ref([
  // {
  //   label: 'Удалить',
  //   icon: 'pi pi-trash',
  //   command: (event) => {
  //     if(company.value.id){
  //       showDeleteConfirmPopup(event)
  //     }
  //   },
  // },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

// const showDeleteConfirmPopup = (event) => {
//   confirm.require({
//     target: event.currentTarget,
//     message: `Вы точно хотите удалить ${company.value.name}?`,
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
//       const res = await deleteCompany(company.value.id)
//       if(res.success){
//         dialogRef.value.close();
//         emit('delete', {companyId: company.value.id});
//       }
//     },
//   });
// }

//Табы
const activeTab = ref(0)
const rightActiveTab = ref(0)

// Управление состоянием модалки
const collapsed = ref(false)
if(company.value?.isCollapsed){
  collapsed.value = true;
}
const closeModal = () => {
  const removedModal = {
    modalData: company.value,
    modalTitle: 'company',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: company.value.id, objectName: 'company'});
  dialogRef.value.close();
};

const collapseModal = (value) => {
  emit("collapse", { id: company.value.id ? company.value.id : 'new', value,  objectName: 'company'});
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
        :id="company?.id"
        :title="`Компания ${company?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isCompanyChanged"
        :saveText="buttonText"
        page="companies"
        icon="/images/menu/team.svg"
        backLink="/companies"
        @save="setNewData"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="company && !collapsed" @submit.prevent="setNewData" class="modal-form">
      <section class="bg-modal-panel-bg p-2 pt-0 overflow-hidden h-full">
        <nav class="custom-nav">
          <div class="flex items-center text-nowrap">
            <p @click = 'activeTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : activeTab === 0}">Основное</p>
            <p @click = 'activeTab = 1' class="custom-nav-tab" :class="{'custom-nav-tab_active' : activeTab === 1}">Изображения</p>
            <p @click = 'activeTab = 2' class="lg:hidden custom-nav-tab" :class="{'custom-nav-tab_active' : activeTab === 2}">Банковские реквизиты</p>
          </div>
          <span @click.stop="activeTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : activeTab === 10}" title="История"/>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto" :class="{'!h-[calc(100%-108px)]': !dialogRef}">
          <div v-show="activeTab === 0" class="grid grid-cols-2 gap-2 p-1 max-sm:grid-cols-1">
            <IftaLabel :class="{'ring-[2px] rounded-lg ring-red-400':emptyFields && !company.name}">
              <label class="text-surface-400">Внутреннее название</label>
              <InputText v-model="company.name" class="w-full" disabled/>
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Полное название</label>
              <InputText v-model="company.full_name" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Короткое название</label>
              <InputText v-model="company.short_name"  disabled/>
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Тип компании</label>
              <Select v-model="company.type"
                      :options="companyTypes"
                      placeholder="Выберите тип"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Номер телефона</label>
              <InputMask
                v-model="company.phone"
                mask="+7 (999) 999-99-99"
                class="w-full select-text"
                placeholder="+7 (999) 999-99-99"
                disabled
              />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Электронный адрес</label>
              <InputText v-model="company.email"  disabled/>
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Сайт</label>
              <InputText v-model="company.website" placeholder="www.example.com" disabled/>
            </IftaLabel>
            <IftaLabel :class="{'ring-[2px] rounded-lg ring-red-400':emptyFields && !company.town}">
              <label class="text-surface-400">Город</label>
              <InputText v-model="company.town" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Юридический адрес</label>
              <InputText v-model="company.legal_address" disabled />
            </IftaLabel>
            <IftaLabel :class="{'ring-[2px] rounded-lg ring-red-400':emptyFields && !company.general_director}">
              <label class="text-surface-400" >ФИО генерального директора</label>
              <InputText v-model="company.general_director" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">ФИО главного бухгалтера</label>
              <InputText v-model="company.head_accountant" disabled />
            </IftaLabel>
            <IftaLabel :class="{'ring-[2px] rounded-lg ring-red-400':emptyFields && !company.inn}">
              <label class="text-surface-400" >ИНН</label>
              <InputText v-model="company.inn" type="number" disabled/>
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">КПП</label>
              <InputText v-model="company.kpp" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">ОГРН</label>
              <InputText v-model="company.ogrn" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">ОКТМО</label>
              <InputText v-model="company.oktmo" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">ОКПО</label>
              <InputText v-model="company.okpo" disabled />
            </IftaLabel>
            <IftaLabel>
              <label class="text-surface-400">Дата гос. регистрации</label>
              <InputText v-model="company.registration_date" disabled />
            </IftaLabel>
            <IftaLabel :class="{'ring-[2px] rounded-lg ring-red-400':emptyFields && typeof company.sort !== 'number'}">
              <label class="text-surface-400">Индекс сортировки</label>
              <InputNumber v-model="company.sort" type="number" min="0" max="100" class="w-full" disabled/>
            </IftaLabel>
          </div>

          <div v-show="activeTab === 2" class="lg:hidden">
<!--            <h2 class="text-primary py-2 font-semibold">Банковские реквизиты</h2>-->
            <div v-show="!showAccountDetailsForm" class="mb-2 flex flex-col gap-2">
              <div
                v-for="(item, index) in company.bank_accounts"
                :key="index"
                class="cursor-pointer w-full border rounded border-primary-300 p-2 flex justify-between"
                @click.stop="editAccountDetails(index)"
              >
                <p class="center"><span v-if="item.bank_name">Банк: {{ item.bank_name }}</span> Р/С: {{ item.account }}</p>
              </div>
            </div>

            <!--            <button v-show="!showAccountDetailsForm" class="mx-auto block button-modal" @click.stop.prevent="addNewAccountDetails">Добавить</button>
            <div v-if="showAccountDetailsForm" id="AccountDetailsForm" class="">
              <div class="grid grid-cols-2 gap-2 p-1 max-sm:grid-cols-1">
                <IftaLabel>
                  <label class="text-surface-400">БИК</label>
                  <InputText v-model="currentAccount.bic" />
                </IftaLabel>
                <IftaLabel>
                  <label class="text-surface-400">Расчётный счёт</label>
                  <InputText v-model="currentAccount.account" />
                </IftaLabel>
              </div>
              <div class="flex items-center gap-2 justify-center mt-2" >
                <Button v-if="currentAccount.id" @click="accountDetailsDeleteConfirm($event, currentAccount)" label="Удалить" severity="danger" outlined></Button>
                <Button @click.stop.prevent="saveAccount" severity="success" label="Сохранить"></Button>
              </div>
            </div>-->
          </div>

          <div v-show="activeTab === 1" class="grid grid-cols-2 gap-2 p-1 max-sm:grid-cols-1">
            <div class="border p-2 rounded border-surface-300 w-full">
              <label class="text-surface-500 dark:text-surface-100 font-medium text-xs">Факсимиле (подпись)</label>
              <div v-if="company.id">
                <div v-if="!facsimileEditing && company.facsimile" class="relative flex items-center gap-4 justify-center">
                  <img :src="`${apiBase}/storage/${company.facsimile}`" alt="Подпись" class="mt-2 h-24 object-contain border border-gray-300 rounded-md"/>
                  <!-- <Button @click="ImageDeleteConfirm($event, 'facsimile')" label="Удалить" severity="danger" outlined></Button> -->
                </div>

<!--                <FileUpload v-else name="facsimile-file" customUpload @uploader="onUploadButtonClick($event, 'facsimile')" accept="image/*" :maxFileSize="8000000" :fileLimit="1"  chooseLabel="Добавить" :show-cancel-button="false" class="flex items-center justify-center" pt:header:class="flex flex-wrap [&>.p-button]:grow">-->
<!--                  <template #empty><span class="text-sm text-surface-600">Перетащите сюда файл или нажмите "Добавить"</span></template>-->
<!--                </FileUpload>-->
              </div>
              <div v-else class="text-center">
                <p class="text-sm text-surface-400 dark:text-surface-100 py-2">Добавление картинок доступно после создания компании</p>
              </div>
            </div>
            <div class="border p-2 rounded border-surface-300 w-full">
              <label class="text-surface-500 dark:text-surface-100 font-medium text-xs">Факсимиле (печать)</label>
              <div v-if="company.id">
                <div v-if="!stampEditing && company.stamp" class="relative flex items-center gap-4 justify-center">
                  <img :src="`${apiBase}/storage/${company.stamp}`" alt="Печать" class="mt-2 h-24 object-contain border border-gray-300 rounded-md"/>
                  <!-- <Button @click="ImageDeleteConfirm($event, 'stamp')" label="Удалить" severity="danger" outlined></Button> -->
                </div>

<!--                <FileUpload v-else name="stamp-file" customUpload @uploader="onUploadButtonClick($event, 'stamp')" accept="image/*" :maxFileSize="8000000" :fileLimit="1" chooseLabel="Добавить"  :show-cancel-button="false" class="flex items-center justify-center" pt:header:class="flex flex-wrap [&>.p-button]:grow">-->
<!--                  <template #empty><span class="text-sm text-surface-600">Перетащите сюда файл или нажмите "Добавить"</span></template>-->
<!--                </FileUpload>-->
              </div>
              <div v-else class="text-center">
                <p class="text-sm text-surface-400 dark:text-surface-100 py-2">Добавление картинок доступно после создания компании</p>
              </div>
            </div>
            <div class="border p-2 rounded border-surface-300 w-full">
              <label class="text-surface-500 dark:text-surface-100 font-medium text-xs">Логотип для документов</label>
              <div v-if="company.id">
                <div v-if="!logoEditing && company.logo" class="relative flex items-center gap-4 justify-center">
                  <img :src="`${apiBase}/storage/${company.logo}`" alt="Логотип" class="mt-2 h-24 object-contain border border-gray-300 rounded-md"/>
                  <!-- <Button @click="ImageDeleteConfirm($event, 'logo')" label="Удалить" severity="danger" outlined></Button> -->
                </div>

<!--                <FileUpload v-else name="logo-file" customUpload @uploader="onUploadButtonClick($event, 'logo')" accept="image/*" :maxFileSize="8000000" :fileLimit="1" chooseLabel="Добавить" :show-cancel-button="false" class="flex items-center justify-center" pt:header:class="flex flex-wrap [&>.p-button]:grow">-->
<!--                  <template #empty><span class="text-sm text-surface-600">Перетащите сюда файл или нажмите "Добавить"</span></template>-->
<!--                </FileUpload>-->
              </div>
              <div v-else class="text-center">
                <p class="text-sm text-surface-400 dark:text-surface-100 py-2">Добавление картинок доступно после создания компании</p>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 10" class="w-full">
            <change-journal :events="company.events"/>
          </div>
        </main>
      </section>

      <section class="bg-modal-panel-bg p-2 pt-0 max-lg:hidden">
        <nav class="custom-nav">
          <div class="flex items-center text-nowrap">
            <p @click = 'rightActiveTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : rightActiveTab === 0}">Банковские реквизиты</p>
          </div>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto" :class="{'!h-[calc(100%-108px)]': !dialogRef}">
          <div v-show="rightActiveTab === 0">
<!--            <h2 class="text-primary py-2 font-semibold">Банковские реквизиты</h2>-->
            <div v-show="!showAccountDetailsForm" class="mb-2 flex flex-col gap-2">
              <!-- <div
                  v-for="(item, index) in company.bank_accounts"
                  :key="index"
                  class="cursor-pointer w-full border rounded border-primary-300 p-2 flex justify-between"
                  @click.stop="editAccountDetails(index)"
              > -->
              <div
                  v-for="(item, index) in company.bank_accounts"
                  :key="index"
                  class="mb-4"
              >
                <div class="mb-2"  v-if="item.bank_name"><span class="font-medium">Банк:</span> {{ item.bank_name }}</div>
                <div class="flex flex-col gap-2">
                  <p class="center w-full border rounded border-primary-300 p-2"> Р/С: {{ item.account }}</p>
                  <p class="center w-full border rounded border-primary-300 p-2"> К/С: {{ item.corr_account }}</p>
                  <p class="center w-full border rounded border-primary-300 p-2"> БИК: {{ item.bik }}</p>
                </div>
              </div>
            </div>

<!--            <button v-show="!showAccountDetailsForm" class="mx-auto block button-modal" @click.stop.prevent="addNewAccountDetails">Добавить</button>
            <div v-if="showAccountDetailsForm" id="AccountDetailsForm" class="">
              <div class="grid grid-cols-2 gap-2 p-1 max-sm:grid-cols-1">
                <IftaLabel>
                  <label class="text-surface-400">БИК</label>
                  <InputText v-model="currentAccount.bic" />
                </IftaLabel>
                <IftaLabel>
                  <label class="text-surface-400">Расчётный счёт</label>
                  <InputText v-model="currentAccount.account" />
                </IftaLabel>
              </div>
              <div class="flex items-center gap-2 justify-center mt-2" >
                <Button v-if="currentAccount.id" @click="accountDetailsDeleteConfirm($event, currentAccount)" label="Удалить" severity="danger" outlined></Button>
                <Button @click.stop.prevent="saveAccount" severity="success" label="Сохранить"></Button>
              </div>
            </div>-->
          </div>
        </main>
      </section>
    </form>
  </div>
</template>
