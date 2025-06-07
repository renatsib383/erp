<script setup>
import { useDialog } from 'primevue/usedialog';
import DataTableWork from 'assets/presets/custom/DataTableDeal.vue'
import {fetchWorks} from "~/services/api/worksServices.js";
import {useRoute} from "#vue-router";
import {useMainStore} from "~/stores/main.js";

const router = useRouter();
const route = useRoute();
const store = useMainStore()
const emit = defineEmits(['set-loading',]);
const props = defineProps(['datatable', 'asideParams', 'cachedLists'])

const works = ref([]);
const rawWorksData = ref([])
const dialog = useDialog();

const search = ref('');
const activeTab = ref('works')
const totalRecords = ref(0);
const loading = ref(false);
const first = ref(0);
const params = ref({});
const filter = ref({});
const multiSortMeta = ref([]);
const page = ref({
  number: null,
  size: 50
})

let categoryList = [];
let groupList = [];
let edList = [];
let factorList = [];

onMounted(async () => {
  const fetchWithFilters = Object.keys(route.query).some(key => key.includes('filter'));
  if (!fetchWithFilters) {
    await getWorks();
  }

  // await getWorksCollection();
  // await getWorksData();
});

watch(props.asideParams, (newValue) => {
  search.value = newValue.search;
  filter.value = newValue.filter;
  debounce(getWorks(), 300)
}, { deep: true });

const getWorks = async (event) => {
  loading.value = true;
	emit("set-loading", 'works');
  page.value.number = event ? event.page + 1 : 1;
  page.value.size = event ? event.rows : page.value.size;

  const result = await fetchWorks(event, page.value, filter.value, first, multiSortMeta, search.value, props.cachedLists)
  if (result.success && !props.cachedLists) {
    props.cachedLists = {
      group: result.data.group,
      category: result.data.category,
      factor: result.data.factor,
      ed: result.data.ed,
    };
  }
  if(props.cachedLists){
    categoryList = props.cachedLists.category;
      groupList = props.cachedLists.group;
      edList = props.cachedLists.ed;
      factorList = props.cachedLists.factor;
  }

  works.value = result.data.works;
  totalRecords.value = result.data.total;

  setTimeout(() => {
		loading.value = false;
		emit("set-loading", '');
  })
};

const onSort = (event) => {
  getWorks(event);
};

const onPage = (event) => {
  getWorks(event);
};

const openModal = (event) => {
  store.setNewModal({modalData: event.data, modalTitle: 'work'})
}

const openPage = async (data) => {
  router.push(`works/${data.id}`);
}

const getCategoryLabel = (work_group_id) => {
  const category = categoryList.find((c) => c.groups.some((g) => g.id === work_group_id))
  if(category) return category.label
  return null
}

// const setNewWork = async () => {
// 	taskDialogRef = dialog.open(WorkFull, {
// 		props: {
// 			header: `Добавление новой работы`,
// 			draggable: false,
// 			modal: true,
// 			pt: ptDialog,
//       appendTo: document.querySelector('main'),
//       showHeader: false
// 		},
// 		data: {
// 			Data: {
// 				"name": null,
// 				"price": null,
// 				"category": null,
// 				"group": null,
// 				"factor": null,
// 				"ed": null,
// 				"description": null,
//         "products": [],
// 				default_value: 0,
// 			},
// 		},
// 		emits: {
// 			onSave: (newData) => {
//         works.value.push(newData.work)
// 			},
// 		}
// 	});
// }

 /*

// Категории и группы
const categories = ref([])

const getCategories = async () => {
  try {
    const response = await axios.get(route('works.category.index'))
    if(response.status === 200) {
      categories.value = response.data.list
    }
  } catch (e){

  }
}

const onCategoryClick = (event) => {
  taskDialogRef = dialog.open(CategoryFull, {
    props: {
      header: `Редактирование категории №: ${event.data.id}`,
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('main')
    },
    data: {
      category: event.data,
      roomTypes: roomTypes
    },
  });
}

const setNewCategory = () => {
  taskDialogRef = dialog.open(CategoryFull, {
    props: {
      header: `Создание категории`,
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('main')
    },
    data: {
      category: {
        id: null,
        name: '',
        room_types: [],
        sort: 0,
        groups: []
      },
      roomTypes: roomTypes
    },
    emits: {
      onSave: (newData) => {
        categories.value.push(newData.newCategory)
      },
    },
  });
}

 */

// setNewWorkCollection, setNewCategory
// defineExpose({ setNewWork,});

</script>

<template>
  <section class="h-full w-full absolute overflow-hidden">
      <div 
        v-if="loading"
        class="loading-overlay absolute inset-[10px] top-[56px]">
          <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
      </div>    
      <DataTableWork
        lazy :paginator="works.length >= 50" removableSort stripedRows ref="table" dataKey="id" tableStyle="min-width: 50rem"
        :value="works" :first="first" :rows="50" :rowsPerPageOptions="[50, 100]"
        :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
        sortMode="multiple" v-model:multiSortMeta="multiSortMeta" @row-click="openModal" selectionMode="single"
        :metaKeySelection="false" scrollable
      >
        <Column field="id" header="№" sortable class="w-[80px] p-2">
          <template #body="slotProps">
            <div class="flex items-center gap-2 p-2">
              <span @click.stop="openPage(slotProps.data)" class="pi pi-external-link text-surface-400 text-[17px]"/> <p>{{slotProps.data.id}}</p>
            </div>
          </template>
        </Column>
        <Column field="name" header="Название работы" key="key" style="min-width: 40%"/>
        <Column field="price" header="Цена" />
        <Column field="category" header="Категория">
          <template #body="slotProps">
            {{getCategoryLabel(slotProps.data.work_group_id)}}
          </template>
        </Column>
        <Column field="group" header="Группа" key="group">
          <template #body="slotProps">
            {{ slotProps.data.work_group_id ? groupList[slotProps.data.work_group_id] : null}}
          </template>
        </Column>
        <Column field="factor" header="Фактор">
          <template #body="slotProps">
            {{ factorList[slotProps.data.factor]?.title }}
          </template>
        </Column>
        <Column field="ed" header="Ед. изм.">
          <template #body="slotProps">
            {{ edList[slotProps.data.ed] || null }}
          </template>
        </Column>
        <Column field="description" header="Описание"/>
        </DataTableWork>
    <!--
    <div v-show="activeTab === 'categories'"  class="relative !overflow-hidden h-[calc(100%-40px)]">
      <DataTableWork stripedRows dataKey="id" tableStyle="min-width: 50rem" :value="categories"
        stateStorage="local" selectionMode="single" :metaKeySelection="false"  @row-click="onCategoryClick"
      >
        <Column field="id" header="№" class="w-14"></Column>
        <Column field="name" header="Наименование"> </Column>
        <Column field="room_types" header="Тип комнаты">
          <template #body="slotProps">
            <span v-for="(room_type, index) in slotProps.data.room_types" class="mr-1">{{roomTypes[room_type]}}<span v-show="slotProps.data.room_types.length > 1 && index !== slotProps.data.room_types[slotProps.data.room_types.length - 1] ">,</span></span>
          </template>
        </Column>
      </DataTableWork>
    </div>
    -->
  </section>
</template>

<style scoped></style>
