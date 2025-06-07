<script setup>
import { useMainStore } from '~/stores/main.js'
// import DataView from "primevue/dataview";
import ptDialog from "assets/presets/custom/modalPreset.js";
import {useDialog} from "primevue/usedialog";
import DataTable from "assets/presets/custom/DataTableDeal.vue";
import {fetchRoles} from "~/services/api/rolesServices.js";
import RoleFull from './Full.vue';
import {useRoute} from "#vue-router";

const props = defineProps(['asideParams'])
const emit = defineEmits(['set-loading']);
const store = useMainStore();
const dialog = useDialog();
const router = useRouter();

const roles = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const first = ref(0);
const params = ref({});
const search = ref('')
const multiSortMeta = ref([]);
const page = ref({
  number: null,
  size: 50
})

let taskDialogRef = null;

watch(props.asideParams, (newValue) => {
  search.value = newValue.search;
  getRoles()
}, { deep: true });

onMounted(async () => {
  const route = useRoute();
  if (!route.query.search) {
    await getRoles();
  }
});

const getRoles = async (event) => {
  loading.value = true;
  emit("set-loading", 'roles');
  page.value.number = event ? event.page + 1 : 1;
  page.value.size = event ? event.rows : page.value.size;

  const result = await fetchRoles(
      event,
      page.value,
      first.value,
      multiSortMeta.value,
      search.value,
      props.asideParams
  );

  if (result.success) {
    roles.value = result.data.roles;
    totalRecords.value = result.data.total;
  } else {
    console.error(result.message);
  }

  setTimeout(() => {
    loading.value = false;
    emit("set-loading", "");
  })

};

const openModal = async (role) => {
  taskDialogRef = dialog.open(RoleFull, {
    props: {
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('main'),
      showHeader: false,
      header: `Изменение роли ${role.id}`,
    },
    data: {
      roleData: role
    },
    emits: {
      onDelete: (newData) => {
        roles.value = roles.value.filter((item) => item.id !== newData.roleId)
      },
    }
  });

}

const openPage = async (event) => {
  router.push(`/roles/${event.data.id}`);
}
const setNewRole = () => {
  taskDialogRef = dialog.open(RoleFull, {
    props: {
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('main'),
      showHeader: false,
      header: `Новая роль`,
    },
    data: {
      roleData: {
        name: null,
        description: null,
        spec: null,
        position: null,
        sort: 0,
      },
    },
    emits: {
      onSave: (newData) => {
        roles.value.push(newData.role)
      },
    }
  });
}

defineExpose({ setNewRole });
</script>

<template>
  <section class="card relative overflow-y-auto h-full">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>    
    <DataTable
      lazy :paginator="roles.length >= 50" removableSort stripedRows ref="userTable" dataKey="id" tableStyle="min-width: 50rem"
      :value="roles" :first="first" :rows="50" :rowsPerPageOptions="[50, 100]"
      :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
      sortMode="multiple" v-model:multiSortMeta="multiSortMeta" @row-click="openPage" selectionMode="single"
      :metaKeySelection="false"
    >
      <Column field="id" header="№" sortable>
        <template #body="slotProps">
          <div class="flex items-center gap-2 p-2">
            <span @click.stop="openModal(slotProps.data)" class="pi pi-external-link text-surface-400 text-[17px]"/> <p>{{slotProps.data.id}}</p>
          </div>
        </template>
      </Column>
      <Column field="description" header="Название" class="font-semibold"></Column>
      <Column field="name" header="Поле"></Column>
      <Column field="position" header="Должность"></Column>
    </DataTable>
  </section>
</template>
