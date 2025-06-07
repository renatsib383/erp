<script setup>
import ModalHeader from "~/components/Common/ModalHeader.vue";
import ChangeJournal from "~/components/Common/СhangeJournal.vue";
import {useMainStore} from "~/stores/main.js";
import {useConfirm} from "primevue/useconfirm";
import {fetchContact, setNewData, deleteContact} from "~/services/api/contactsServices.js";
import {formatDateTimeStr} from "~/utils/date-functions.js";

const dialogRef = inject('dialogRef');
const store = useMainStore();
const emit = defineEmits(["save"]);
const route = useRoute()

const contactOriginal = ref(dialogRef ? dialogRef.value.data.modalData : {});
const contact = ref(contactOriginal.value ? JSON.parse(JSON.stringify(contactOriginal.value)) : null);
const errors = ref([]);
const collapsed = ref(false)

const buttonText = ref("Сохранить");
if (contact.value && !contact.value.id) {
  buttonText.value = "Создать";
}
if(contact.value?.isCollapsed){
  collapsed.value = true;
}

const isChanged = ref(false);

watch(contact,() => {
  isChanged.value = true;
}, { deep: true });

const getData = async () => {
  let id = route.params.id ? route.params.id : contact.value?.id;
  if(!id){
    return
  }

  const response = await fetchContact(id);
  if(response.success){
    buttonText.value = "Сохранить";
    contact.value = response.data
  }
  setTimeout(() => isChanged.value = false, 100)
}

if(!contact.value || Object.keys(contact.value).length <= 2){
  getData()
}

const saveContact = async () => {
  errors.value = [];
  store.showModalLoader()
  const response = await setNewData(contact.value);
  if (response.success) {
    if (contact.value.id) {
        // Обновляем оригинальные данные контакта
        Object.entries(response.data).forEach(([key, value]) => {
            // contactOriginal[key] = value;
            contact.value[key] = value;
        });
        setTimeout(() => {
          store.addNewContactToTable(response.data)
          isChanged.value = false;
        })
    } else {
      // Создание нового контакта
      isChanged.value = false;
      emitNewContact(response.data);
      dialogRef.value.close()
    }
  }
  else {
    errors.value = response.errors;
  }
  store.hideModalLoader()
};

const emitNewContact = (newContact) => {
  emit("save", { contact: newContact });
  store.addNewContactToTable(newContact)
  store.setNewModal({modalData: newContact, modalTitle: 'contact'})
};

const openDeal = (deal) => {
  deal.isCollapsed = false
  const onlyRequiredFields = ["id", "isCollapsed", "type"]; // чтобы не мусорить LS только нужные поля оставляем
  const dealWithOnlyRequiredFields = Object.fromEntries(
      Object.entries(deal).filter(([key]) => onlyRequiredFields.includes(key))
  );

  collapseModal(true)
  store.setNewModal({modalData: dealWithOnlyRequiredFields, modalTitle: 'deal'})
  if(dialogRef){
    // dialogRef.value.close();
  }

}

const newDealFromContact = () => {
  const newDeal = {
    uid: "",
    telephone: "",
    address: null,
    geo: null,
    fio: null,
    skidka: 0,
    id: 0,
    tags: [],
    stages: [
      {
        id: 1,
        name: "Неразобранное",
        color: "#e6e8ea",
        pivot: {stage_id: 1 },
        pipeline: { id: 1, name: "Отделка квартир" },
      },
    ],
    contacts: [
      {
        id: contact.value?.id,
        surname: contact.value.surname,
        name: contact.value.name,
        patronymic: contact.value.patronymic,
        full_name: contact.value.full_name,
        phone: String(contact.value.phone).replace(/[^0-9]/g, '') }
    ],
    type : "emptyDeal",
    isCollapsed : false,
  };

  store.setNewModal({modalData: newDeal, modalTitle: 'deal'})
  // history.pushState(null, null, `#new`);
  dialogRef.value.close();
}

const deleteDealFromContact = async (dealId) => {
  const {$api} = useNuxtApp()
  try {
    await $api.post(`/contacts/${contact.value.id}/delete/${dealId}`)
    contact.value.deals = contact.value.deals?.filter(deal => deal.id !== dealId)
    setTimeout(() => {
      isChanged.value = false;
      store.addNewContactToTable(contact.value)
    }, 0)
  }
  catch (e) {
    console.log('Error deleting deal from contact', e)
  }
}

// Меню
const menu = ref();
const items = ref([
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: (event) => {
      if(contact.value.id){
        showDeleteConfirmPopup(event)
      }
    },
  },
]);
const confirm = useConfirm();

const toggle = (event) => {
  menu.value.toggle(event);
};

const showDeleteConfirmPopup = (event) => {
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
      const response = await deleteContact(contact.value.id);
      if (response.success) {
        dialogRef.value.close();
        emit('delete', {contactId: contact.value.id});
      }
    },
  });
}

// Вкладки
const leftActiveTab = ref(0)
const rightActiveTab = ref(0)

// Управление состоянием модалки
const closeModal = () => {
  const removedModal = {
    modalData : contact.value,
    modalTitle: 'contact',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: contact.value.id, objectName: 'contact'});
  dialogRef?.value.close();
};

const collapseModal = (value) => {
  if(!dialogRef) return
  emit("collapse", { id: contact.value.id, value,  objectName: 'contact'});
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
        :id="contact?.id"
        :title="`Контакт ${contact?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isChanged"
        :saveText="buttonText"
        page="contacts"
        icon="/images/menu/contact.svg"
        backLink="/contacts"
        @save="saveContact"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="contact && !collapsed" @submit.prevent="saveContact" class="modal-form">
      <section class="p-2 pt-0 overflow-hidden h-full bg-white dark:bg-modal-panel-bg">
        <nav class="custom-nav">
          <div class="flex items-center">
            <p @click = 'leftActiveTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 0}">Основное</p>
          </div>
          <span @click.stop="leftActiveTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : leftActiveTab === 10}" title="История"/>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto">
          <div v-show="leftActiveTab === 0" >
            <div class="rounded-md grid md:grid-cols-2 gap-2">
              <ifta-label>
                <label class="text-sm text-gray-400">Фамилия</label>
                <InputText v-model="contact.surname" class="w-full" :invalid="errors.includes('surname')"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Имя</label>
                <InputText v-model="contact.name" class="w-full" :invalid="errors.includes('name')"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Отчество</label>
                <InputText v-model="contact.patronymic" class="w-full" :invalid="errors.includes('patronymic')"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Телефон</label>
                <InputMask v-model="contact.phone" mask="+7 (999) 999-99-99" class="w-full" :invalid="errors.includes('phone')"/>
              </ifta-label>
              <ifta-label>
                <Calendar v-model="contact.created_at" showIcon show-button-bar iconDisplay="input" dateFormat="dd/mm/yy" class="w-full" disabled/>
                <label class="text-sm text-gray-400">Дата создания</label>
              </ifta-label>
              <ifta-label>
                <Calendar v-model="contact.updated_at" showIcon iconDisplay="input" dateFormat="dd/mm/yy" class="w-full" disabled/>
                <label class="text-sm text-gray-400">Дата обновления</label>
              </ifta-label>
            </div>
            <div class="mt-2 flex flex-col gap-2">
              <div class="flex gap-1 items-center">
                <span class="pi pi-money-bill mr-1"></span>
                <label class="text-sm">Объекты</label>
              </div>
              <div class="min-h-9 ">
                <div
                    v-for="(deal) in contact.deals"
                    @click="openDeal(deal)"
                    class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-2 text-lg text-white mb-[1px] cursor-pointer"
                >
                    <div class="flex items-center gap-1 py-[8px]">
                      <img loading="lazy" src="/images/menu/deals.svg" alt="deal-logo" width="28px" height="28px">
                      <h2 class="font-normal pr-2">
                        <span>Объект {{deal.uid}}</span>
                      </h2>
                    </div>
                    <div class="flex items-center gap-2 text-base">
                      <button
                          class="button-modal p-1.5"
                          @click.stop.prevent="deleteDealFromContact(deal.id)"
                      >
                        Открепить
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <span v-show="leftActiveTab === 0 && contact.id" @click="newDealFromContact" class="p-2 mt-2 cursor-pointer button-modal flex items-center justify-center w-40">Создать сделку</span>
          <div v-show="leftActiveTab === 10">
            <change-journal :events="contact.events"/>
          </div>
        </main>
      </section>

      <section class="max-lg:hidden bg-white dark:bg-modal-panel-bg p-2 pt-0">
      </section>
    </form>
  </div>
</template>

