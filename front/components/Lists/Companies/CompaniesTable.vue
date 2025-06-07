<script setup>
import CompanyFull from "~/components/Lists/Companies/CompanyFull.vue";
import ptDialog from "assets/presets/custom/modalPreset.js";
import DataTable from "assets/presets/custom/DataTableDeal.vue";
import {useDialog} from "primevue/usedialog";
import {fetchCompanies} from "~/services/api/companiesServices.js";
import {useRoute} from "#vue-router";
import {useMainStore} from "~/stores/main.js";

const props = defineProps(['datatable', 'asideParams'])
const emit = defineEmits(['set-loading']);
const dialog = useDialog();
const router = useRouter();
const store = useMainStore()

const companies = ref([]);
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


onMounted(async () => {
  const route = useRoute();
  if (!route.query.search) {
    await getCompanies();
  }
})

watch(() => props.asideParams, (newValue) => {
  search.value = newValue.search;
  setTimeout(() => {
    getCompanies()
  })
}, { deep: true });

const getCompanies = async (event) => {
  loading.value = true;
  emit("set-loading", 'companies');
  page.value.number = event ? event.page + 1 : 1;
  page.value.size = event ? event.rows : page.value.size;

  const response = await fetchCompanies(event, page.value, params.value, first.value, multiSortMeta.value, search.value)
  if(response.success){
    companies.value = response.companies
    totalRecords.value = response.total
  }
  setTimeout(() => {
    loading.value = false;
    emit("set-loading", '');
  })
};

let taskDialogRef = null;

const openModal = (event) => {
  store.setNewModal({modalData: event.data, modalTitle: 'company'})
}

const openPage = async (data) => {
  router.push(`/companies/${data.id}`);
}

// const setNewCompany = (onMount=false) => {
//   taskDialogRef = dialog.open(CompanyFull, {
//     props: {
//       header: `Создание компании`,
//       draggable: false,
//       modal: true,
//       pt: {
//          ...ptDialog,
//              mask: {
//          ...ptDialog?.mask, // Сохранение текущих настроек
//                class: `${ptDialog?.mask?.class || ''} company-new-dialog ${onMount ? 'translate-y-[calc(100%-var(--header-height)] custom-collapsed-modals' : null}`.trim() // Добавление кастомного класса // Второй класс нужен чтобы при перезагрузках открылась свернутым
//          }
//       },
//       appendTo: document.querySelector('.dialogs-container'),
//       showHeader: false,
//     },
//     data: {
//       companyData: {
//         name:null,
//         type:0,
//         full_name:null,
//         short_name:null,
//         phone:null,
//         email:null,
//         website:null,
//         town:null,
//         legal_address:null,
//         general_director:null,
//         head_accountant:null,
//         inn:null,
//         kpp:null,
//         ogrn:null,
//         oktmo:null,
//         okpo:null,
//         registration_date:null,
//         facsimile:null,
//         stamp: null,
//         logo:null,
//         sort:0,
//         banks: []
//       },
//     },
//     emits: {
//       onSave: (newData) => {
//         companies.value.push(newData.company)
//       },
//     }
//   });
// }

const companyTypes = {
  0 : 'Холдинг',
  1 : 'Главная'
}

// defineExpose({ setNewCompany });

</script>

<template>
  <section class="card absolute w-full h-full">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>    
    <DataTable
      lazy :paginator="companies.length >= 50" removableSort stripedRows ref="userTable" dataKey="id" tableStyle="min-width: 50rem"
      :value="companies" :first="first" :rows="50" :rowsPerPageOptions="[50, 100]"
      :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
      sortMode="multiple" v-model:multiSortMeta="multiSortMeta" @row-click="openModal" selectionMode="single"
      :metaKeySelection="false" scrollable
    >
      <Column field="id" header="№" sortable class="w-[80px] px-2 py-[11px]">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span @click.stop="openPage(slotProps.data)" class="pi pi-external-link text-surface-400 text-[17px]"/> <p>{{slotProps.data.id}}</p>
          </div>
        </template>
      </Column>
      <Column field="name" header="Название компании" class="font-semibold"></Column>
      <Column field="town" header="Город"></Column>
      <Column field="general_director" header="Генеральный директор"></Column>
    </DataTable>
    <DataTable :value="companies">
      <template #empty>
        <p class="mx-auto text-center">Пока нет компаний</p>
      </template>
      <template #list="slotProps">
        <div class="flex flex-col">
          <div v-for="(company, index) in slotProps.items" :key="company.id" @click="onClickCompany(company)" class="cursor-pointer hover:bg-surface-100">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4 border-b border-surface-200 dark:border-surface-700'" >
              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-col  items-start gap-2">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ companyTypes[company.type]}}</span>
                    <div class="text-lg font-medium py-2">{{ company.name }}</div>
                    <span class="text-sm">{{ company.inn }}</span>
                  </div>
                </div>

                <div class="flex flex-col items-end gap-2">
                  <span class="text-md">{{ company.town }}</span>
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <span class="text-md font-semibold">{{ company.general_director }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
  </section>
</template>
