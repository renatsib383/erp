<script setup>
import ptDialog from "assets/presets/custom/modalPreset.js";
import {useDialog} from "primevue/usedialog";
import PositionFull from "~/components/Lists/Positions/PositionFull.vue";
import DataTable from "assets/presets/custom/DataTableDeal.vue";
import {fetchPositions} from "~/services/api/positionsServices.js";
import {useRoute} from "#vue-router";

const router = useRouter();
const props = defineProps(['asideParams'])
const emit = defineEmits(['set-loading']);
const dialog = useDialog();
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

const positions = ref([]);
const loading = ref(false);


watch(props.asideParams, (newValue) => {
  search.value = newValue.search;
  getPositions()
}, { deep: true });

onMounted(async () => {
  const route = useRoute();
  if (!route.query.search) {
    await getPositions();
  }
});

const getPositions = async (event) => {
  loading.value = true;
  emit("set-loading", 'roles');
  page.value.number = event ? event.page + 1 : 1;
  page.value.size = event ? event.rows : page.value.size;

  const response = await fetchPositions(event, page.value, params, search, multiSortMeta, first)
  if(response.success){
    positions.value = response.data.positions
    totalRecords.value = response.data.total
  }

  setTimeout(() =>{
    loading.value = false;
    emit("set-loading", '');
  })
};

const openModal = async (position) => {
  taskDialogRef = dialog.open(PositionFull, {
    props: {
      header: `Изменение должности ${position.id}`,
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('main'),
      showHeader: false,
    },
    data: {
      positionData: position
    },
    emits: {
      onDelete: (newData) => {
        positions.value = positions.value.filter((item) => item.id !== newData.positionId)
      },
    }
  });

}

const openPage = async (event) => {
  router.push(`/positions/${event.data.id}`);
}

const setNewPosition = () => {
  taskDialogRef = dialog.open(PositionFull, {
    props: {
      header: `Новая должность`,
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('main'),
      showHeader: false,
    },
    data: {
      positionData: {
        name: "",
        company: [],
        sort: 0,
      },
    },
    emits: {
      onSave: (newData) => {
        positions.value.push(newData.position)
      },
    }
  });
}

defineExpose({ setNewPosition });
</script>

<template>
  <section class="relatvie overflow-y-auto h-full">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>    
    <DataTable
      lazy :paginator="positions >= 50" removableSort stripedRows ref="userTable" dataKey="id" tableStyle="min-width: 50rem"
      :value="positions" :first="first" :rows="50" :rowsPerPageOptions="[50, 100]"
      :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
      sortMode="multiple" v-model:multiSortMeta="multiSortMeta" @row-click="openPage" selectionMode="single"
      :metaKeySelection="false"
    >
      <Column field="id" header="№" sortable>
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span @click.stop="openModal(slotProps.data)" class="pi pi-external-link text-surface-400 text-[17px]"/> <p>{{slotProps.data.id}}</p>
          </div>
        </template>
      </Column>
      <Column field="name" header="Наименование"></Column>
      <Column field="position" header="Компания"></Column>
    </DataTable>
  </section>
</template>
