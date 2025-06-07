<script setup>
import DataTableContacts from 'assets/presets/custom/DataTableDeal.vue';
import ContactFull from '~/components/Lists/Contacts/ContactFull.vue';
import ptDialog from 'assets/presets/custom/modalPreset.js';
import { useDialog } from 'primevue/usedialog';
import {useMainStore} from "~/stores/main.js";
import {fetchContacts} from "~/services/api/contactsServices.js";
import {useRoute} from "#vue-router";

const props = defineProps(['datatable', 'asideParams'])
const emit = defineEmits(['set-loading']);
const store = useMainStore()
const dialog = useDialog();
const router = useRouter();

const contacts = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const first = ref(0);
const userTable = ref();
const params = ref({});
const search = ref('')
const multiSortMeta = ref([]);
let dialogRef = null;

const page = ref({
  number: null,
  size: 50
})

onMounted(function () {
  const route = useRoute();
  if (!route.query.search) {
    getContacts();
  }
});

const getContacts = async (event) => {
  loading.value = true;
  emit("set-loading", "contacts");
  page.value.number = event ? event.page + 1 : 1;
  page.value.size = event ? event.rows : page.value.size;

  const result = await fetchContacts(event, page.value, params.value, first.value, multiSortMeta.value, search.value);

  if (result.success) {
    contacts.value = result.data;
    totalRecords.value = result.total;
  } else {
    console.error("Failed to fetch contacts:", result.error);
  }

  loading.value = false;
  emit("set-loading", "");
};

const openModal = async (event,) => {
  store.setNewModal({modalData: event.data, modalTitle: 'contact'})
}

const openPage = (data) => {
  router.push(`/contacts/${data.id}`);
};

const setNewContact = () => {
  const data = {
    id:0,
    surname: '',
    name: "",
    patronymic: "",
    phone: "",
  }
  store.setNewModal({modalData: data, modalTitle: 'contact'})
}

const onSort = (event) => {
  getContacts(event);
}

const onPage = (event) => {
  params.value = event;
  getContacts(event);
}

watch(props.asideParams, (newValue) => {
  search.value = newValue.search;
  getContacts()
}, { deep: true });

const openDeal = (deal) => {
  deal.isCollapsed = false
  const onlyRequiredFields = ["id", "isCollapsed", "type"]; // чтобы не мусорить LS только нужные поля оставляем
  const dealWithOnlyRequiredFields = Object.fromEntries(
      Object.entries(deal).filter(([key]) => onlyRequiredFields.includes(key))
  );

  store.setNewModal({modalData: dealWithOnlyRequiredFields, modalTitle: 'deal'})
  if(dialogRef){
    // dialogRef.value.close();
  }
}


const getNewUpdatedContact = computed(() => store.getNewContactForTable);

const addNewContactWithoutPageReload = (contact) => {
  const index = contacts.value.findIndex(c => c.id === contact.id);
  if (index !== -1) { // Если такой контакт уже есть, то обновляем его
    contacts.value[index] = contact;
  } else { // Если нет добавим в таблицу без перезагрузки
    contacts.value.unshift(contact);
  }
}

watch(getNewUpdatedContact, (newValue) => {
  if (newValue) {
    addNewContactWithoutPageReload(JSON.parse(JSON.stringify(newValue)))
  }
});

defineExpose({ setNewContact });
</script>

<template>
  <div class="contacts-wrapper absolute w-full h-full overflow-hidden">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>      
    <DataTableContacts
      lazy :paginator="contacts.length >= 50" removableSort stripedRows ref="userTable" dataKey="id"
      :value="contacts" :first="first" :rows="50" :rowsPerPageOptions="[50, 100]"
      :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
      sortMode="multiple" :multiSortMeta="multiSortMeta" @row-click="openModal" selectionMode="single"
      :metaKeySelection="false" scrollable
    >
      <Column field="id" header="№" sortable class="w-[80px] p-2">
        <template #body="slotProps">
          <div class="flex items-center gap-2 px-2 py-[3px]">
            <span @click.stop="openPage(slotProps.data)" class="pi pi-external-link text-surface-400 text-[17px]"/> <p>{{slotProps.data.id}}</p>
          </div>
        </template>
      </Column>
      <Column field="surname" header="Фамилия"></Column>
      <Column field="name" header="Имя"></Column>
      <Column field="patronymic" header="Отчество"></Column>
      <Column field="phone" header="Телефон">
        <template #body="slotProps">
          <span v-show="slotProps.data.phone">+</span>{{slotProps.data.phone}}
        </template>
      </Column>
      <Column field="deals" header="Объекты">
        <template #body="slotProps">
          <div class="items-center flex">
            <p v-for="(deal,index) in slotProps.data.deals"
               @click.stop.prevent="openDeal(deal)"
               class="cursor-pointer underline text-blue-500 pr-2"
            >
              {{deal.uid}}
            </p>
          </div>
        </template>
      </Column>
    </DataTableContacts>
  </div>
</template>

<style scoped></style>
