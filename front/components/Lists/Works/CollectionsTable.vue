<script setup>
import DataTableCollection from 'assets/presets/custom/DataTableDeal.vue'
import WorkFull from "~/components/Lists/Works/WorkFull.vue";
import ptDialog from "assets/presets/custom/modalPreset.js";
import {useDialog} from "primevue/usedialog";
import CollectionsFull from "~/components/Lists/Works/CollectionsFull.vue";
import {fetchCollections} from "~/services/api/worksCollectionsServices.js";
import {fetchWorksData} from "~/services/api/worksServices.js"
import {useRoute} from "#vue-router";
import {useMainStore} from "~/stores/main.js";

const emit = defineEmits(['set-loading',]);
const props = defineProps(['asideParams'])
const store = useMainStore()
const dialog = useDialog()
const router = useRouter();

const loading = ref(false);
const first = ref(0);
const collectionTable = ref();
const params = ref({});
const search = ref("");
const multiSortMeta = ref([]);
const totalRecords = ref(0)

const setOfWorks = ref([]);
const worksData = ref([]);
const group = ref([]);
const category = ref([]);
const roomTypes = ref([]);

const page = ref({
  number: null,
  size: 50
})

onMounted(async () => {
  const route = useRoute();
  if (!route.query.search) {
    await getWorksCollection();
  }
  await getWorksData();
});

watch(props, (newValue) => {
  search.value = newValue.asideParams?.search
  getWorksCollection()
}, {deep: true})

const getWorksCollection = async (event) => {
  loading.value = true;
  emit("set-loading", "works");
  page.value.number = event ? event.page + 1 : 1;
  page.value.size = event ? event.rows : page.value.size;

  const response = await fetchCollections(
    params.value,
    page.value,    
    first.value,
    multiSortMeta.value,
    search.value,
    event
  );
  if (response.success) {
    setOfWorks.value = response.collections;
    totalRecords.value = response.total;
  }

  setTimeout(() => {
    loading.value = false;
    emit("set-loading", "");
  })
};

const getWorksData = async () => {
  loading.value = true;
  emit("set-loading", "works");

  const response = await fetchWorksData();

  if (response.success) {
    worksData.value = response.data.works;
    group.value = response.data.group;
    category.value = response.data.category;
    roomTypes.value = response.data.roomTypes
  }

  setTimeout(() => {
    loading.value = false;
    emit("set-loading", "");
  })
};

const onSort = (event) => {
  getWorksCollection(event);
};

const openModal = (event) => {
  store.setNewModal({modalData: event.data, modalTitle: 'collection'})
}

const openPage = (data) => {
  router.push(`/works-collections/${data.id}`);
}

const setNewWorkCollection = (isCollapsed = false) => {
  const data = {
    id: 0,
    name: null,
    room_type: 1,
    type: 'general',
    works: null,
    isCollapsed : isCollapsed,
    sort: 0,
  }

  store.setNewModal({modalData: data, modalTitle: 'collection'})
}

const getNewUpdatedCollection = computed(() => store.getNewWorkCollectionForTable);

const addNewCollectionWithoutPageReload = (collection) => {
  const index = setOfWorks.value.findIndex(c => c.id === collection.id);
  if (index !== -1) { // Если такой уже есть, то обновляем его
    setOfWorks.value[index] = collection;
  } else { // Если нет добавим в таблицу без перезагрузки
    setOfWorks.value.unshift(collection);
  }
}

watch(getNewUpdatedCollection, (newValue) => {
  if (newValue) {
    addNewCollectionWithoutPageReload(JSON.parse(JSON.stringify(newValue)))
  }
});

defineExpose({ setNewWorkCollection,});

</script>

<template>
  <div class="absolute h-full w-full !overflow-hidden">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>    
    <DataTableCollection
      ref="collectionTable" lazy :paginator="setOfWorks.length >= 50" removableSort stripedRows dataKey="id" tableStyle="min-width: 50rem" :value="setOfWorks"
      :first="first" :rows="50" :rowsPerPageOptions="[50, 100]" :totalRecords="totalRecords"
      :loading="loading" @page="onPage($event)" @sort="onSort($event)" stateStorage="local" sortMode="multiple"
      v-model:multiSortMeta="multiSortMeta" @row-click="openModal" selectionMode="single" :metaKeySelection="false"
      scrollable
    >
      <Column field="id" header="№" sortable>
        <template #body="slotProps">
          <div class="flex items-center gap-2 p-2">
            <span @click.stop="openPage(slotProps.data)" class="pi pi-external-link text-surface-400 text-[17px]"/> <p>{{slotProps.data.id}}</p>
          </div>
        </template>
      </Column>
      <Column field="name" header="Наименование" class="text-start" />
      <Column field="room_type" header="Тип комнаты">
        <template #body="slotProps">
          {{ roomTypes[slotProps.data.room_type] }}
        </template>
      </Column>
      <Column field="room_type" header="Тип набора">
        <template #body="slotProps">
          {{ slotProps.data.type}}
        </template>
      </Column>

    </DataTableCollection>
  </div>
</template>
