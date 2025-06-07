<script setup>
import DataTableUser from "assets/presets/custom/DataTableDeal.vue";
import ptDialog from 'assets/presets/custom/modalPreset.js';
import { useDialog } from 'primevue/usedialog';
import {useMainStore} from "~/stores/main.js";
import UserFull from './UserFull.vue';
import { page as usersLists } from '~/services/fakedata/usersPageData.js';
import {fetchUsers} from "~/services/api/usersServices.js";
import {useRoute} from "#vue-router";

const props = defineProps(['datatable', 'asideParams'])
const store = useMainStore()
const listsStore = useListsStore()
const router = useRouter();
const dialog = useDialog();
const emit = defineEmits(['set-loading']);

const users = ref([]);
const loading = ref(false);
const sidebarMenuLoading = ref('');
const totalRecords = ref(0);
const first = ref(0);
const userTable = ref();
const params = ref({});
const search = ref('')
const delay = ref(null)
const multiSortMeta = ref([]);
const page = ref({
  number: null,
  size: 50
})

// Берем опции для списка
const roles = usersLists.lists.roles;
const chiefList = computed(() => {
  return listsStore?.usersWithRolesList ? listsStore.usersWithRolesList : []
})

onMounted(async () => {
  const route = useRoute();
  if (!route.query.search) {
    await getUsers();
    // await getUsersList()
  }
});

const getUsers = async (event) => {
  loading.value = true;
  emit("set-loading", "users");
  page.value.number = event ? event.page + 1 : 1;
  page.value.size = event ? event.rows : page.value.size;

  const result = await fetchUsers(
      event,
      page.value,
      first.value,
      multiSortMeta.value,
      search.value,
      props.asideParams,
  );

  if (result.success) {
    users.value = result.data.users;
    totalRecords.value = result.data.totalRecords;
  } else {
    console.error(result.message);
  }

  setTimeout(() => {
    loading.value = false;
    emit("set-loading", "");
  })
};

let taskDialogRef = null;

const openModal = async (event) => {
  store.setNewModal({modalData: event.data, modalTitle: 'user',})
}

const openPage = (data) => {
  router.push(`users/${data.id}`);
}

const setNewUser = () => {
  const data = {
    id: 0,
    name: "",
    telephone: "",
    email: "",
    fio: "",
    status: 1,
    chief: "",
    roles: [],
    password: '',
  }
  store.setNewModal({modalData: data, modalTitle: 'user',})
}

const onSort = (event) => {
  getUsers(event);
}

const onPage = (event) => {
  params.value = event;
  getUsers(event);
}

const getNewUpdatedDataFromStore = computed(() => store.getNewDDSForTable);

const addNewUpdatedDataWithoutPageReload = (user) => {
  const index = users.value.findIndex(u => u.id === user.id);
  if (index !== -1) { // Если такой уже есть, то обновляем его
    users.value[index] = user;
  } else { // Если нет добавим в таблицу
    users.value.unshift(user);
  }
}

watch(getNewUpdatedDataFromStore, (newValue) => {
  if (newValue) {
    addNewUpdatedDataWithoutPageReload(JSON.parse(JSON.stringify(newValue)))
  }
});

watch(props.asideParams, (newValue) => {
  search.value = newValue.search;
  setTimeout(() => {
    getUsers()
  })
}, { deep: true });

defineExpose({ setNewUser });

</script>

<template>
  <div class="users-wrapper relative h-full overflow-hidden">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>    
    <DataTableUser lazy :paginator="users.length >= 50" removableSort stripedRows ref="userTable" dataKey="id" tableStyle="min-width: 50rem"
      :value="users" :first="first" :rows="50" :rowsPerPageOptions="[50, 100]"
      :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
      sortMode="multiple" v-model:multiSortMeta="multiSortMeta" @row-click="openModal" selectionMode="single"
      :metaKeySelection="false"
      scrollable
    >
<!--      scrollHeight="flex" :virtualScrollerOptions="{ itemSize: 52 }"-->
      <template #empty> Ничего не найдено </template>
      <Column field="id" header="№" class="w-[50px]">
        <template #body="{index, data}">
          <div class="flex items-center justify-center text-center gap-2 px-2 py-[7px]">
            <span @click.stop="openPage(data)" class="pi pi-external-link text-surface-400 text-[17px]"/>
            <p>{{index}}</p>
          </div>
        </template>
      </Column>
      <Column field="fio" header="ФИО">
        <template #body="{data}">
          {{data.profile?.fio}}
        </template>
      </Column>
      <Column field="telephone" header="Телефон" >
        <template #body="{data}">
          {{data.profile?.phone}}
        </template>
      </Column>
      <Column field="email" header="Почта" class="!text-start"/>
      <Column field="name" header="Имя пользователя"/>
      <Column field="status" header="Статус">
        <template #body="slotProps">
          <div class="flex items-center justify-center">
            <div class="w-5 h-5 bg-emerald-500 rounded-full" :class="{ '!bg-slate-300': !slotProps.data.status, '!bg-red-500': slotProps.data.status == 3, }">
            </div>
          </div>
        </template>
      </Column>
      <Column field="chief" header="Руководитель" class="text-center">
        <template #body="{data}">
          {{data.profile?.chief ? chiefList.find(u => u.id === data.profile.chief)?.name : null}}
        </template>
      </Column>
      <Column field="role_id" header="Роли">
        <template #body="{data}">
          <p class="">
            <span
                v-for="role in data.roles "
                :id="role.id"
                class="pl-1 whitespace-nowrap"
            >
              {{role.name}}
            </span>
          </p>
        </template>

      </Column>
<!--      <Column field="department" header="Отдел"/>-->
<!--      <Column field="affiliate" header="Филиал"/>-->
    </DataTableUser>

  </div>
</template>

<style scoped></style>
