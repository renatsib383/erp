<script setup>
import TableStatistics from "~/components/Deals/TableStatistics.vue";
import ptDialog from "assets/presets/custom/modalPreset.js";
import DataTableDeal from 'assets/presets/custom/DataTableDeal.vue'
import {page} from "~/services/fakedata/dealsPageData.js";
import {useDialog} from "primevue/usedialog";
import {useMainStore} from "~/stores/main.js";
import {fetchTableData}  from '~/services/api/deals-services/dealsServices.js'

const props = defineProps(["asideParams", "datatable"]);
const emit = defineEmits(["set-loading"]);
const store = useMainStore();
const listsStore = useListsStore()

onMounted(() => {
  setIsMobile();
  window.addEventListener("resize", () =>
      requestAnimationFrame(setIsMobile)
  );

  loadTableData();

  facility_type_options.value = page.fields.facility_type.list.map((item, index) => ({
    value: index,
    label: item,
  })) || [];
  facility_condition_options.value = page.fields.facility_condition.list.map((item, index) => ({
    value: index,
    label: item,
  })) || [];
  renovation_type_options.value = page.fields.renovation_type.list.map((item, index) => ({
    value: index,
    label: item,
  })) || [];
  temperature_options.value = page.fields.temperature.list;

  const savedVisibleColumns = localStorage.getItem('savedVisibleColumns2')
  if (savedVisibleColumns) visibleColumns.value = JSON.parse(savedVisibleColumns)
});

const dealsTable = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const first = ref(0);
const dt = ref();
const params = ref({});
const rows = 25 // Количество загружаемых объектов
const lastLoadedCount = ref(rows); // Количество последнего загруженнего массива
// Опции
const facility_type_options = ref([]);
const facility_condition_options = ref([]);
const renovation_type_options = ref([]);
const temperature_options = ref([]);
const users = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }

  return listsStore.usersWithRolesList
});

const visibleColumns = ref(allColumns)
const stages = ref(page.pipelines[props.asideParams.pipeline].stages);
const pipeline = ref(props.asideParams.pipeline);
//screen width
const mobileWidth = 480;
const isMobile = ref(false);

const newColumns = ref([ // Новые колонки связанные с ДДС
  { field: 'deposit', header: 'Депозит' },
  { field: 'revenue_plan', header: 'Выручка по замеру' },
  { field: 'revenue_plan_without_coef', header: 'Выручка по замеру без КФ' },
  { field: 'revenue_fact', header: 'Выручка факт с КФ' },
  { field: 'revenue_fact_without_coef', header: 'Выручка факт без КФ' },
  { field: 'draft_material', header: 'Черновой материал' },
  { field: 'fotr_masters', header: 'ФОТр мастеров' },
  { field: 'fotr_masters_percent', header: 'ФОТр мастеров (%)' },
  { field: 'fotr_prorab', header: 'ФОТр прораб' },
  { field: 'fotr_prorab_percent', header: 'ФОТр прораб (%)' },
  { field: 'retention', header: 'Удержание' },
  { field: 'retention_percent', header: 'Удержание (%)' },
  { field: 'discount', header: 'Скидка' },
  { field: 'discount_percent', header: 'Скидка (%)' },
  { field: 'payment', header: 'Наличные' },
  { field: 'payment_rs', header: 'Расчетный счет' },
]);

const loadData = async () => {
  loading.value = 'deals';
  emit("set-loading", "deals");
  const response = await fetchTableData(params, props, first, rows);
  if(response.success){
    dealsTable.value = response.data.records;
    totalRecords.value = Number(response.data.total);
  }
  loading.value = false;
  emit("set-loading", "");
}

const loadTableData = () => {
  debounce(loadData(), 500)
}

const onPage = (event) => {
  params.value = event;
  loadTableData();
};

const onSort = (event) => {
  params.value = event;
  loadTableData();
};

// watchers
watch(props.asideParams, function (newValue) {
  if(pipeline.value !== newValue.pipeline){
    stages.value = page.pipelines[props.asideParams.pipeline].stages;
    pipeline.value = parseInt(newValue.pipeline);
  }
  // // Изменились параметры в сайдбаре - сортировка
  // if (newValue.sort[0].field !== multiSortMeta.value[0].field || newValue.sort[0].order !== multiSortMeta.value[0].order) {
  //   multiSortMeta.value = newValue.sort;
  //   loadTableData();
  // }
  // Изменились параметры в сайдбаре - поиск, фильтр
  if ((newValue.search && newValue.search !== params.value.search) ||
      (params.value.search && newValue.search.length === 0) ||
      newValue.filter) {
    newValue.search ? params.value.search = newValue.search : null;
    newValue.filter ? params.value.filter = newValue.filter : null;
    loadTableData()
  }

  // Показать колонны
  if (newValue.visibleColumns) {
    visibleColumns.value = newValue.visibleColumns;
  }
});

// методы
const onRowClick = async (event) => {
  let deal = {};
  if (event) {
    deal = event.data;
  }

  if (deal || deal.stages){
    deal.isCollapsed = true
    // history.pushState(null, null,`${window.location.origin}/deals/${deal.id}`)
    const onlyRequiredFields = ["id", "isCollapsed", "type"]; // чтобы не мусорить LS только нужные поля оставляем
    const dealWithOnlyRequiredFields = Object.fromEntries(
        Object.entries(deal).filter(([key]) => onlyRequiredFields.includes(key))
    );

    store.setNewModal({modalData: dealWithOnlyRequiredFields, modalTitle: 'deal'})
  }
}
const addNewDealWithoutPageReload = (deal) => {
  const index = dealsTable.value.findIndex(d => d.id === deal.id);
  if (index !== -1) { // Если такая сделка есть, то обновляем его
    dealsTable.value[index] = deal;
  } else {
    dealsTable.value.unshift(deal);
  }
};

const coloredCards = (item) => {
  if (item && item.date_end) {
    const today = new Date();
    const dateEnd = new Date(item.date_end);

    const differenceInMilliseconds = dateEnd - today;
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    const roundedHours = Math.round(differenceInHours)
    // const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    // console.log('Осталось часов:',roundedHours)
    if (roundedHours < 24) {
      item.remainingTimeColor = '!bg-red-100 dark:!bg-red-400'
    } else if (roundedHours > 24 && roundedHours < 168) {
      item.remainingTimeColor = '!bg-yellow-100 dark:!bg-yellow-400'
    } else if (roundedHours > 168 && roundedHours < 720) {
      item.remainingTimeColor = '!bg-emerald-100 dark:!bg-emerald-400'
    }

    return item.remainingTimeColor
  }
}

const setIsMobile = () => {
  if (document.documentElement.clientWidth <= mobileWidth && !isMobile.value) {
    isMobile.value = true;
  } else if (document.documentElement.clientWidth > mobileWidth && isMobile.value) {
    isMobile.value = false;
  }
}

// Статистика
const dialog = useDialog();
const showStatistic = (deal) => {
  let dealDialogRef;
  dealDialogRef = dialog.open(TableStatistics, {
    props: {
      header: `Статистика по объекту "${deal.uid}"`,
      draggable: false,
      modal: false,
      appendTo: document.querySelector('.main'),
      pt: ptDialog,
    },
    data: {
      deal,
      acts: [1, 2, 3,]
    },
  });
}

const onScroll = async (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
    if (lastLoadedCount.value < 25) return; // Если в последнем запросе было < 25, больше не загружаем

    first.value = dealsTable.value?.length;
    const response = await fetchTableData(params, props, first);

    if (response.success) {
      lastLoadedCount.value = response.data.records.length; // Запоминаем, сколько загрузили
      dealsTable.value.push(...response.data.records);
      totalRecords.value = Number(response.data.total);
    }
  }
};

const debouncedOnScroll = debounce((event) => {
  if (event.target.scrollTop !== event.target.lastScrollTop) {
    onScroll(event);
  }
  event.target.lastScrollTop = event.target.scrollTop;
}, 300);

onMounted(() => {
  const scrollContainer = document.querySelector(".p-datatable-table-container");
  if (scrollContainer) {
    scrollContainer.lastScrollTop = scrollContainer.scrollTop;
    scrollContainer.addEventListener("scroll", debouncedOnScroll);
  }
});

onUnmounted(() => {
  const scrollContainer = document.querySelector(".p-datatable-table-container");
  if (scrollContainer) {
    scrollContainer.removeEventListener("scroll", debouncedOnScroll);
  }
});

defineExpose({
  addNewDealWithoutPageReload,
})
</script>

<template>
  <section class="relative h-full overflow-hidden overflow-x-auto w-full">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>
    <DataTableDeal
        :value="dealsTable" dataKey="id" lazy :paginator="false" :loading="loading" removableSort sortMode="multiple"
        :first="first" :rows="rows" :totalRecords="totalRecords" :multiSortMeta="params.multiSortMeta" :rowClass="coloredCards" :metaKeySelection="false"
        @sort="onSort($event)" @row-click="onRowClick" scrollable
        stateStorage="local" selectionMode="single" ref="dt"
    >
      <Column field="uid" header="Объект" sortable v-if="visibleColumns.uid?.visible">
        <template #body="slotProps">
          <div class="text-center uppercase font-semibold">
            {{ slotProps.data.uid }}
          </div>
        </template>
      </Column>
      <Column field="stage" header="Этапы" v-if="visibleColumns.stage?.visible">
        <template #body="slotProps">
          <div v-for="stage in slotProps.data.stages" class="td-inner block uppercase !text-dark-600 leading-5" :style="`background-color: ${stage.color}`">
            {{stage.name}}
          </div>
        </template>
      </Column>
      <Column field="partner" header="Партнёрка" sortable v-if="visibleColumns.partner?.visible" style="text-align: center" />
      <Column header="Статистика">
        <template #body="slotProps">
          <div class="flex justify-center w-full">
            <button @click.stop="showStatistic(slotProps.data)" class="p-2 m-auto bg-white border-[2px] rounded-lg dark:bg-surface-600">Показать</button>
          </div>
          <!--slotProps.data.budget_sum-->
        </template>
      </Column>
      <Column field="created_at" header="Дата добавления" sortable v-if="visibleColumns.created_at?.visible" >
        <template #body="slotProps">
          <div class="text-center">
            {{ formatDateStr(slotProps.data.created_at) }}
          </div>
        </template>
      </Column>
      <Column field="updated_at" header="Дата обновления" sortable v-if="visibleColumns.updated_at?.visible">
        <template #body="slotProps">
          <div class="text-center">
            {{ formatDateStr(slotProps.data.updated_at) }}
          </div>
        </template>
      </Column>
      <Column field="zamer_date" header="Дата выезда на замер" sortable v-if="visibleColumns.zamer_date?.visible">
        <template #body="slotProps">
          <div class="text-center">
            {{ formatDateStr(slotProps.data.zamer_date) }}
          </div>
        </template>
      </Column>
      <Column field="zamer_time" header="Время приезда на замер" sortable v-if="visibleColumns.zamer_time?.visible">
        <template #body="slotProps">
          <div class="text-center">
            {{ slotProps.data.zamer_time }}
          </div>
        </template>
      </Column>
      <Column field="region" header="Регион" sortable v-if="visibleColumns.region?.visible"></Column>
      <Column field="address" header="Адрес" sortable v-if="visibleColumns.address?.visible" style="padding: 0 4px;"></Column>
      <Column field="facility_type" header="Тип недвижимости" sortable v-if="visibleColumns.facility_type?.visible">
        <template #body="{ data }">
          <div class="text-center">
            {{ facility_type_options[data.facility_type]?.label }}
          </div>
        </template>
      </Column>
      <Column field="facility_condition" header="Состояние недвижимости" sortable
              v-if="visibleColumns.facility_condition?.visible">
        <template #body="{ data }">
          <div class="text-center">
            {{ facility_condition_options[data.facility_condition]?.label }}
          </div>
        </template>
      </Column>
      <Column field="renovation_type" header="Тип ремонта" sortable v-if="visibleColumns.renovation_type?.visible" style="text-align: center" >
        <template #body="{ data }">
          <div class="text-center">
            {{ renovation_type_options[data.renovation_type]?.label }}
          </div>
        </template>
      </Column>
      <Column field="contacts" header="Контакты" sortable v-if="visibleColumns.fio?.visible">
        <template #body="{ data }">
          <div class="flex flex-col">
            <div v-for="contact in data.contacts" class="flex items-center justify-between px-1">
              <span class="capitalize">{{ contact.name }}</span>
              <a
                  :href="contact.phone && `tel:${contact.phone.replace(/\D/g, '')}`"
                  class="flex items-center justify-center shrink-0 w-7 h-7 ml-1 -mr-[2px] rounded-full bg-green-300"
              >
                <i class="pi pi-phone text-sm text-[#004B23] rotate-[270deg]"></i>
              </a>
            </div>
          </div>
        </template>
      </Column>
      <Column field="lead_source" header="Откуда узнали о нас" sortable v-if="visibleColumns.lead_source?.visible" style="text-align: center" />
      <Column field="skidka" header="Скидка" sortable v-if="visibleColumns.skidka?.visible" style="text-align: center">
        <template #body="{data}">
          {{data.skidka + ' %'}}
        </template>
      </Column>
      <Column field="coef" header="Коэффициент" sortable v-if="visibleColumns.coef?.visible" style="text-align: center"/>
      <Column field="temperature" header="Лояльность клиента" sortable v-if="visibleColumns.temperature?.visible">
        <template #body="{data}">
          <div class="text-center">{{temperature_options[data.temperature]}}</div>
        </template>
      </Column>
      <Column field="prorab" header="Прораб" sortable v-if="visibleColumns.prorab?.visible">
        <template #body="{ data }">
          <div class="td-inner">
            <a class="flex items-center justify-center shrink-0 w-7 h-7 mr-[3px] rounded-full bg-[#D9D9D9]">
              <i class="pi pi-user text-sm text-[#004B23]"></i>
            </a>
            <span class="uppercase">{{ data.prorab ? users.find(u => u.id === data.prorab)?.name : null}}</span>
          </div>
        </template>
      </Column>
      <Column field="responsible" header="Ответственный" sortable v-if="visibleColumns.responsible?.visible">
        <template #body="{ data }">
          <div class="text-center">
            {{ data.responsible ? users.find(u => u.id === data.responsible)?.name : null}}
          </div>
        </template>
      </Column>
      <Column field="operator" header="КЦ1 ответственный за сделку" sortable v-if="visibleColumns.operator?.visible">
        <template #body="{ data }">
          <div class="text-center">
            {{ data.operator ? users.find(u => u.id === data.operator)?.name : null}}
          </div>
        </template>
      </Column>
      <Column field="zamerman" header="Замерщик" sortable v-if="visibleColumns.zamerman?.visible">
        <template #body="{ data }">
          <div class="text-center">
            {{ data.zamerman ? users.find(u => u.id === data.zamerman)?.name : null}}
          </div>
        </template>
      </Column>
      <Column field="designer" header="Дизайнер" sortable v-if="visibleColumns.designer?.visible">
        <template #body="{ data }">
          <div class="text-center">
            {{ data.designer ? users.find(u => u.id === data.designer)?.name : null}}
          </div>
        </template>
      </Column>
      <Column field="budget_sum" header="Сумма сделки" sortable disabled v-if="visibleColumns.budget_sum?.visible">
        <template #body="{data}">
          <div class="text-center">
            <span>{{data.budget_sum ? formatNumber(data.budget_sum) + " ₽" : null}}</span>
          </div>
        </template>
      </Column>

      <div v-for="col in newColumns">
        <Column
            :field="col.field"
            :header="col.header"
            v-if="visibleColumns[col.field]?.visible"
        >
          <template #body={data}>
            <p  :class="{'text-red-600'
                : col.field === 'fotr_masters_percent' && data[col.field] > 60
                || col.field === 'retention_percent' && data[col.field] > 5
                || col.field === 'discount_percent' && data[col.field] > 20}"
            >
              {{formatNumber(data[col.field])}}
            </p>
          </template>
        </Column>
      </div>

    </DataTableDeal>
  </section>
</template>

<style scoped>
.td-inner {
    display: flex;
    align-items: center;
    padding: 5px 5px 5px 12px;
    min-height: 40px;
}
</style>