<script setup>
import DropdownAside from "assets/presets/custom/DropdownAside.vue";
import InputTextAside from "assets/presets/custom/InputTextAside.vue";
import { useMainStore } from '@/stores/main.js'
import {useListsStore} from "~/stores/lists.js";
import {filterForm} from "~/utils/deal-aside.js";

const store = useMainStore();
const listsStore = useListsStore();

const props = defineProps(["mode", "asideParams", "loading"]);
const emit = defineEmits(["change-mode", "change-param"]);

const dateFormat = 'dd.mm.yy';

const searchParams = ref(null);

const pipeline_options = Object.values(listsStore.pipelines);
const pipelineNodes = Object.keys(listsStore.pipelines).map(num => {
  let children = Object.keys(listsStore.pipelines[num].stages).map(key => ({
    key: `${num}-${listsStore.pipelines[num].stages[key].id}`,
    label: listsStore.pipelines[num].stages[key].title,
  }))
  return {
    key: listsStore.pipelines[num].id,
    label: listsStore.pipelines[num].name,
    children: children
  }
})
const visibleColumns = ref(allColumns)
const search = ref('');
const searchDelay = ref(null);
const delay = ref(null)
const filterFormData = ref(JSON.parse(JSON.stringify(filterForm)));
const tablePipAndStages = ref({})

const facility_type_options = listsStore.fields ? listsStore.fields.facility_type.list.map((item, index) => ({
    value: index,
    label: item,
  })) : [];

const facility_condition_options = listsStore.fields ? listsStore.fields.facility_condition.list.map((item, index) => ({
  value: index,
  label: item,
})) : [];

const performer_options = listsStore.users || [];

const partner = ref([]);
const pagePartners = ref([]);
const tags = ref([]);
const pageTags = ref([]);

pagePartners.value = listsStore.partners || []; 
pageTags.value = listsStore.tags || [];

const customer = ref({
  lead_source: '',
  skidka: '',
  coef: '',
  temperature: [],
});

const temperatureArr = listsStore.fields ? listsStore.fields.temperature.list : [];
const temperature_options = temperatureArr.map((item, index) => ({
    value: index,
    label: item,
  })) || [];

const responsibles = ref({
  responsible: [],
  operator: [],
  zamerman: [],
  designer: [],
  prorab: [],
});

const responsible_options = computed(() => listsStore.usersWithRolesList || []);
const prorab_options = computed(() => listsStore.usersWithRolesList
    ? listsStore.usersWithRolesList.filter(user =>
        user.roles.some(role => role.id === 3)
    )
    : []
);
// const operator_options = listsStore.users || [];
// const zamerman_options = listsStore.users ? listsStore.users.filter((user) => user.role_id === 3) : [];
// const designer_options = listsStore.users ? listsStore.users.filter((user) => user.role_id === 5) : [];

const filterDataToSend = ref({});
const filtersState = ref({
  // dealsLoaded: true,
  isActiveFiltersCounted: false,
  isFiltersChanged: false,
  isFiltersCleaning: false,
});
const selectedMode = ref(props.mode);
const modes = ref([
  { name: "Канбан", value: "kanban" },
  { name: "Таблица", value: "table" },
]);
const asideParams = ref({ ...props.asideParams });
// Поиск
const loadingSearch = ref(false);
// Сортировка
const fieldLegend = {
  created_at: "Дате создания",
  updated_at: "Дате изменения",
};
const selectedField = ref({
  name: fieldLegend[asideParams.value.sort[0].field],
  code: asideParams.value.sort[0].field,
});
const fields = ref([
  { name: fieldLegend["created_at"], code: "created_at" },
  { name: fieldLegend["updated_at"], code: "updated_at" },
]);
// Порядок сортировки
const selectedOrder = ref(asideParams.value.sort[0].order);
const orders = ref([
  { icon: "pi pi-sort-amount-down", code: -1 },
  { icon: "pi pi-sort-amount-up", code: 1 },
]);

onMounted(async () => {
  getSearchParams();

  setFiltersFromURL(searchParams.value);

  const savedVisibleColumns = localStorage.getItem("savedVisibleColumns2");
  if (savedVisibleColumns){
    visibleColumns.value = JSON.parse(savedVisibleColumns);
  }
});

// Methods
// Проверяем наличие параметров в url
const getSearchParams = () => {
  if (window.location.search.includes("?")) {
    searchParams.value = new URLSearchParams(window.location.search);
  } else {
    searchParams.value = null;
  }
}

const openNewDealInModal = () => {
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
    contacts: [],
    type : "emptyDeal",
    isCollapsed : false,
  };

  if (newDeal) {
    store.setNewModal({modalData: newDeal, modalTitle: 'deal'})
    // store.setNewDealToStore(newDeal);
    // history.pushState(null, null, `${window.location.origin}/deals/${newDeal.id}`);
  }
};

const enforceMinMax = () => {
  if (filterFormData.value.budget_sum.from < 0) {
    filterFormData.value.budget_sum.from = 1;
  }
  if (filterFormData.value.budget_sum.to < 0) {
    filterFormData.value.budget_sum.to = 1;
  }

  setTimeout(() => {
    setFilterData();
  }, 0);
};

const onInputSearchEmptyButton = () => {
  filterFormData.value.uidEmpty = !filterFormData.value.uidEmpty;

  setTimeout(() => {
    if (filterFormData.value.uidEmpty) {
      filterFormData.value.uid = "";
    }
    setFilterData();
  }, 0);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const onSearchChanged = () => {
  emitFilterData();
}


const setFilterData = () => {
  filtersState.value.isFiltersChanged = true;
  setFilterDataToSend();
};

const setFilterValuesFromURL = (searchParams) => {

  const data = {
    deal_stage_id: [],
    partner: [],
    tags: [],
    facility_type: [],
    facility_condition: [],
    budget_sum: {},
    created_at: [],
    updated_at: [],
    task_performer: [],
    zamer_date: [],
    zamer_time: [],
    responsible: [],
    operator: [],
    zamerman: [],
    designer: [],
    prorab: [],
    temperature: [],
  };

  if (!searchParams) {
    return {data, search: ''}
  }

  searchParams.forEach((value, key) => {
    if (key.startsWith('filter[')) {
      const regex = /filter\[(.+?)](?:\[(.+?)])?/;
      const matches = key.match(regex);

      const paramName = matches[1];
      const subKey = matches[2];

      switch (paramName) {
        case 'uid':
          value === 'empty' ? filterFormData.value.uidEmpty = true : filterFormData.value.uid = value;
          data.uid = value;
          break;
        case 'deal_stage_id':
          const thisStage = filteredStages.value.find(stage => stage.value === Number(value));
          if(thisStage) filterFormData.value.stages.selectedStages.push(thisStage);
          data.deal_stage_id.push(value)

          pipelineNodes.forEach(pip => {
            pip.children.forEach(child => {
              const stage = child.key.split('-')[1];
              if (Number(stage) === Number(value)) {
                tablePipAndStages.value = {
                  ...tablePipAndStages.value,
                  [child.key]: {  // Используем квадратные скобки для динамического ключа
                    "checked": true,
                    "partialChecked": false
                  }
                };
              }
            });
          });
          // const allPipelines = JSON.parse(JSON.stringify(pipeline_options));
          //
          // const pipelineNodes = Object.keys(listsStore.pipelines).map(num => {
          //   let children = Object.keys(listsStore.pipelines[num].stages).map(key => ({
          //     key: `${num}-${listsStore.pipelines[num].stages[key].id}`,
          //     label: listsStore.pipelines[num].stages[key].title,
          //   }))
          //   return {
          //     key: listsStore.pipelines[num].id,
          //     label: listsStore.pipelines[num].name,
          //     children: children
          //   }
          // })
          break;
        case 'partner':
          partner.value.push(value)
          data.partner.push(value);
          break;
        case 'tags':
          tags.value.push(value)
          data.tags.push(value);
          break;

        case 'facility_type':
          const facility_type_options = listsStore.fields.facility_type.list.map((item, index) => {
            return { value: index, label: item };
          })
          const item = facility_type_options.find(option => option.value === Number(value));
          filterFormData.value.facility_type.push(item)
          data.facility_type.push(value)
          break;
        case 'facility_condition':
          const facility_condition_options = listsStore.fields.facility_condition.list.map((item, index) => {
            return { value: index, label: item };
          });
          const condition = facility_condition_options.find(option => option.value === Number(value));
          filterFormData.value.facility_condition.push(condition)
          data.facility_condition.push(value)
          break;

        case 'created_at':
        case 'updated_at':
        case 'zamer_date':
          const formattedDate = new Date(value)
          filterFormData.value[paramName].push(formattedDate)
          data[paramName].push(formattedDate)
          break;

        case 'region':
          filterFormData.value.region = value;
          data.region = value;
          break

        case 'lead_source':
        case 'skidka':
        case 'coef':
          customer.value[paramName] = value
          data[paramName] = value
          break
        case 'temperature':
          const temperatureArr = listsStore.fields ? listsStore.fields.temperature.list : []
          const temperature_options =
            temperatureArr.map((item, index) => {
              return {
                value: index,
                label: item,
              };
            }) || [];
          const temperature = temperature_options.find(item => item.value == Number(value));
          customer.value.temperature = customer.value.temperature || [];
          customer.value.temperature.push(temperature)
          data[paramName].push(value)
          break

        case 'responsible':
        case 'operator':
        case 'zamerman':
        case 'designer':
        case 'prorab':
          const users = listsStore.users || [];
          const selectedOption = users.find(user => user.id === Number(value));
          if (selectedOption) {
            responsibles.value[paramName] = responsibles.value[paramName] || [];
            responsibles.value[paramName].push(selectedOption);
            data[paramName].push(value)
          }
          break

        case 'task_performer':
          const usersPerformer = listsStore.users || [];
          const selectedOptionPerformer = usersPerformer.find(user => user.id === Number(value));
          if (selectedOptionPerformer) {
            filterFormData.value.task.performer.push(selectedOptionPerformer);
            data[paramName].push(value)
          }
          break


        default: // Общий случай для остальных параметров
          if (subKey) {
            if (Number.isInteger(Number(subKey))) {// subKey - это число (например, для массивов)
              if (!filterFormData.value[paramName]) filterFormData.value[paramName] = [];
              filterFormData.value[paramName].push(value);
              if (!data[paramName]) data[paramName] = [];
              data[paramName].push(value);
            }
            else { // subKey - это строка (например, from или to)
              filterFormData.value[paramName] ? filterFormData.value[paramName][subKey] = value : null;
              if (!data[paramName]) data[paramName] = {};
              data[paramName][subKey] = value;
              if (paramName === 'task' && subKey === 'lastDays') {
                filterFormData.value.task.format = 'fromToday'
              }
              if (paramName === 'task' && subKey === 'withoutTasks') {
                const buttonState = Boolean(value)
                filterFormData.value.withoutTasks = buttonState
              }
            }
          }
          else { // Обычные параметры без вложенности
            filterFormData.value[paramName] ? Array.isArray(filterFormData.value[paramName]) ? filterFormData.value[paramName].push(value) : filterFormData.value[paramName] = value : null;
            data[paramName] ? Array.isArray(data[paramName]) ? data[paramName].push(value) : data[paramName] = value : null;
          }
      }
    }

    if (key.startsWith('search')) {
      search.value = value;
      // emit("change-param", "search", value);
      // search.value = value;
    }
  });

  filterDataToSend.value = data;

  return {data, search: search.value};

}

const setFiltersFromURL = (searchParams) => {

  if (!searchParams) {
    return;
  }

  let {data, search} = setFilterValuesFromURL(searchParams);

  if (data) {
    emit("change-filter", "filter", data);
    // filterDataToSend.value = data;
  }

  if (search) {
    emit("change-filter", "search", search);
  }

};

const setFilterDataToSend = () => {
  let data = {};

  if (filterFormData.value.uid !== "") {
    filterFormData.value.uidEmpty = false;
    data.uid = filterFormData.value.uid;
  } else if (filterFormData.value.uid === "" && !filterFormData.value.uidEmpty) {
  } else if (filterFormData.value.uid === "" && filterFormData.value.uidEmpty) {
    data.uid = "empty";
  }

  let stagesArr = [];
  const stagesFromPage = Object.values(listsStore.pipelines[asideParams.value.pipeline].stages).map((item) => ({
    value: item.id,
    label: item.title,
    color: item.color,
  })) || [];

  if (filterFormData.value.stages.stagesExceptFor) {
    stagesArr = stagesFromPage.filter((item) => {
      return !filterFormData.value.stages.selectedStages.some(i => i.value === item.value);
    });
    data.deal_stage_id = stagesArr.map((item) => item.value);
  } else {
    data.deal_stage_id = filterFormData.value.stages.selectedStages.map((item) => item.value);
  }

  const { from, to } = filterFormData.value.budget_sum;
  if (from !== "" || to !== "") {
    data.budget_sum = {};
    if (from !== "") data.budget_sum.from = from;
    if (to !== "") data.budget_sum.to = to;
  }

  if (partner.value) {
    data.partner = partner.value;
  }
  if (tags.value) {
    data.tags = tags.value;
  }

  const { created_at, updated_at, zamer_date, zamer_time } = filterFormData.value;
  if (created_at) {
    data.created_at = {};
    created_at.forEach((item, index) => {
      if (item) data.created_at[index] = formatDate(item);
    });
  }
  if (updated_at) {
    data.updated_at = {};
    updated_at.forEach((item, index) => {
      if (item) data.updated_at[index] = formatDate(item);
    });
  }
  if (zamer_date) {
    data.zamer_date = {};
    zamer_date.forEach((item, index) => {
      if (item) data.zamer_date[index] = formatDate(item);
    });
  }
  if (zamer_time && zamer_time.length) data.zamer_time = String(zamer_time).slice(16, 21);

  data.task = {};
  if (filterFormData.value.withoutTasks === true) {
    data.task = { withoutTasks: true };
  } 
  if (filterFormData.value.task.startDate)
    data.task.startDate = formatDate(filterFormData.value.task.startDate);
  if (filterFormData.value.task.endDate)
    data.task.endDate = formatDate(filterFormData.value.task.endDate);
  if (filterFormData.value.task.lastDays)
    data.task.lastDays = filterFormData.value.task.lastDays;

  if (filterFormData.value.task.performer) {
    if (filterFormData.value.task.performer.length > 0) {
      data.task_performer = filterFormData.value.task.performer.map((item) => item.id);
    }
  }

  const { facility_type, facility_condition, region } = filterFormData.value;
  if (facility_type !== null) data.facility_type = facility_type.map(item => item.value);
  if (facility_condition !== null) data.facility_condition = facility_condition.map(item => item.value);
  if (region) data.region = region;

  const { lead_source, skidka, coef, temperature } = customer.value;
  const customerFields = { lead_source, skidka, coef, temperature };

  Object.entries(customerFields).forEach(([key, value]) => {
    if (value && typeof value !== 'object') {
      data[key] = value;
    } else if (value && typeof value === 'object') {
      data[key] = value.map(item => item.value);
    }
  });

  const { responsible, operator, zamerman, designer, prorab } = responsibles.value;
  const responsiblesFields = { responsible, operator, zamerman, designer, prorab };

  Object.entries(responsiblesFields).forEach(([key, value]) => {
    if (value) {
      data[key] = value.map(item => item.id);
    }
  });

  filterDataToSend.value = data;
};

const setFiltersToUrl = (data, search) => {
  let queryString = '';

  if (data && Object.keys(data).length > 0) {
    Object.keys(data).forEach(filterKey => {
      const filterValue = data[filterKey];

      if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
        Object.keys(filterValue).forEach(subKey => {
          queryString += `filter[${filterKey}][${subKey}]=${filterValue[subKey]}&`;
        });
      } else if (Array.isArray(filterValue)) {
        filterValue.forEach((val, index) => {
          queryString += `filter[${filterKey}][${index}]=${val}&`;
        });
      } else {
        queryString += `filter[${filterKey}]=${filterValue}&`;
      }
    });
  }

  if (search) queryString += `search=${search}&`;

  queryString = queryString.endsWith('&') ? queryString.slice(0, -1) : queryString;

  const oldURL = window.location.href;
  const newUrl = queryString.length ? `${window.location.pathname}?${queryString}` : null;
  if (newUrl) {
    history.pushState(oldURL, '', newUrl);
  } else {
    history.pushState(oldURL, '', window.location.pathname);
  }
};



const emitFilterData = () => {
  // isFiltersChanged.value = false;
  emit("change-filter", "filter", filterDataToSend.value);
  emit("change-param", "search", search.value);
  setFiltersToUrl(filterDataToSend.value, search.value);
  getSearchParams();
};

const updateVisibleColumns = () => {
  if (delay.value) {
    clearTimeout(delay.value);
  }
  delay.value = setTimeout(() => {
    emit("update-visible-columns", visibleColumns.value);
    localStorage.setItem("savedVisibleColumns2", JSON.stringify(visibleColumns.value));
  }, 1000);
};

const cleanFilters = () => {
  filtersState.value.isFiltersCleaning = true;
  filterFormData.value = JSON.parse(JSON.stringify(filterForm));
  tags.value = [];
  partner.value = [];
  customer.value = [];
  responsibles.value = [];
  tablePipAndStages.value = {};
  search.value = ''
  setFilterDataToSend();
  emitFilterData();
};

const cancelFilters = () => {
  filterFormData.value = JSON.parse(JSON.stringify(filterForm));
  tags.value = [];
  partner.value = [];
  customer.value = [];
  responsibles.value = [];
  tablePipAndStages.value = {}
  setFilterDataToSend();
  setFilterValuesFromURL(searchParams.value);
  setTimeout(() => {
    filtersState.value.isFiltersChanged = false;
  }, 0);
}

// computeds
const filteredStages = computed(() => {
  const stagesFromPage = Object.values(listsStore.pipelines[asideParams.value.pipeline].stages).map((item) => ({
    value: item.id,
    label: item.title,
    color: item.color,
  })) || [];

  return stagesFromPage.filter((stage) => {
    return !filterFormData.value.stages.selectedStages.some(selectedStage => selectedStage.value === stage.value);
  });
});

const activeMainFilterCount = computed(() => {
  let count = 0;
  if (filterFormData.value.uid || filterFormData.value.uidEmpty) count++;
  // if (filterFormData.value.stages.selectedStages.length > 0 || filterFormData.value.stages.stagesExceptFor) count++;
  if (partner.value && partner.value.length > 0) count++;
  if (tags.value && tags.value.length > 0) count++;
  if (filterFormData.value.budget_sum.from || filterFormData.value.budget_sum.to || filterFormData.value.budget_sum.exceptFor) count++;
  if (filterFormData.value.created_at && filterFormData.value.created_at.length) count++;
  if (filterFormData.value.updated_at && filterFormData.value.updated_at.length) count++;
  if (filterFormData.value.facility_type && filterFormData.value.facility_type.length) count++;
  if (filterFormData.value.facility_condition && filterFormData.value.facility_condition.length) count++;
  if (filterFormData.value.region) count++;
  if (filterFormData.value.zamer_date && filterFormData.value.zamer_date.length) count++;
  if (filterFormData.value.zamer_time && filterFormData.value.zamer_time.length) count++;

  return count;
});

const activeTaskFilterCount = computed(() => {
  let count = 0;
  if (filterFormData.value.task.startDate) count++;
  if (filterFormData.value.task.endDate) count++;
  if (filterFormData.value.task.lastDays) count++;
  if (filterFormData.value.withoutTasks) {
    count = 1;
  }
  if (filterFormData.value.task.performer && filterFormData.value.task.performer.length) {
    count++;
  }

  return count;
});

const activeCustomerFilterCount = computed(() => {
  let count = 0;
  if (customer.value.lead_source) count++;
  if (customer.value.skidka) count++;
  if (customer.value.coef) count++;
  if (customer.value.temperature && customer.value.temperature.length) count++;
  return count;
});

const activeResponsiblesFilterCount = computed(() => {
  let count = 0;
  if (responsibles.value.prorab && responsibles.value.prorab.length) count++;
  if (responsibles.value.responsible && responsibles.value.responsible.length) count++;
  if (responsibles.value.operator && responsibles.value.operator.length) count++;
  if (responsibles.value.zamerman && responsibles.value.zamerman.length) count++;
  if (responsibles.value.designer && responsibles.value.designer.length) count++;

  return count;
});

const ActiveFiltersCount = computed(() => {
  return activeMainFilterCount.value + activeTaskFilterCount.value + activeCustomerFilterCount.value + activeResponsiblesFilterCount.value;
});

const onPipelineChange = (event) => {
  emit("change-param", "pipeline", event.value)
}
// Watchers
// watch(() => props.asideParams, (newValue) => {
//   if ((asideParams.value.sort[0]?.field !== newValue.sort[0]?.field) || (asideParams.value.sort[0]?.order !== newValue.sort[0]?.order)) {
//     selectedField.value = {
//       name: fieldLegend[newValue.sort[0].field],
//       code: newValue.sort[0].field,
//     };
//     selectedOrder.value = newValue.sort[0].order;
//     asideParams.value = { ...newValue };
//   }
// });

watch(() => props.loading, (newValue) => {
  if (!newValue) {
    //  Если поменялось на "" то всё загрузилось
    loadingSearch.value = false;
    filtersState.value.isFiltersChanged = false;
    // filtersState.value.dealsLoaded = true;
    filtersState.value.isFiltersCleaning = false;
  }
});

watch(selectedMode, (newValue) => {
  cancelFilters();
  emit("change-mode", newValue);
});

watch(selectedField, (newValue) => {
  emit("change-param", "sort", [
    {
      field: newValue.code,
      order: selectedOrder.value,
    },
  ]);
});
watch(selectedOrder, (newValue) => {
  emit("change-param", "sort", [
    {
      field: selectedField.value.code,
      order: newValue,
    },
  ]);
});

// Для v-select
watch(() => filterFormData.value.stages?.selectedStages, () => {
  setFilterData();
}, { deep: true });
watch(() => partner.value, () => {
  setFilterData();
});
watch(() => tags.value, () => {
  setFilterData();
});
watch(() => filterFormData.value.facility_type, () => {
  setFilterData();
});
watch(() => filterFormData.value.facility_condition, () => {
  setFilterData();
});
watch(() => customer.value.temperature, () => {
  setFilterData();
});
watch(() => responsibles.value.responsible, () => {
  setFilterData();
});
watch(() => responsibles.value.operator, () => {
  setFilterData();
});
watch(() => responsibles.value.zamerman, () => {
  setFilterData();
});
watch(() => responsibles.value.designer, () => {
  setFilterData();
});
watch(() => responsibles.value.prorab, () => {
  setFilterData();
});
watch(() => filterFormData.value.task.performer, () => {
  setFilterData();
});
//
watch(() => ActiveFiltersCount.value, (newVal, oldVal) => {
  //!!! if (newVal > oldVal) {
  // if (newVal != oldVal) {
  //   filtersState.value.dealsLoaded = false;
  // }
  filtersState.value.isActiveFiltersCounted = true;
  //!!!
  // if (newVal <= 0) { 
  //   cleanFilters()
  // }
});
watch(tablePipAndStages, (newValue) => {
  const allPipelines = JSON.parse(JSON.stringify(pipeline_options));

  // Находим этапы и воронки для таблицы
  let stages = [];
  const pipelinesId = Object.keys(newValue)
      .filter(key => !key.includes('-'))
      .map(Number)

  const stagesId = Object.keys(newValue)
        .filter(key => key.includes('-')) // Берем только ключи с дефисом
        .map(key => Number(key.split('-')[1])); // Берем число после дефиса

  Object.values(allPipelines).forEach(pipeline => {
    if(pipelinesId.includes(Number(pipeline.id))){
      Object.values(pipeline.stages).forEach(s => {
        if( stagesId.includes(Number(s.id)) ) {
          stages.push({value: s.id, label: s.title, color: s.color});
        }
      });
    }
  })

  filterFormData.value.stages.selectedStages = stages
})



</script>

<template>
  <section class="flex flex-col relative">
    <div class="aside-deal__toggle px-[3px]">
      <div class="aside__section">
        <button @click="openNewDealInModal" class="aside-accent-btn">
          <span class="pi pi-plus"/>
          <span>Создать объект</span>
        </button>
      </div>

      <div class="aside__section search-wrapper relative">
        <div>
          <FormSearch
            v-model="search"
            @change-search="onSearchChanged"
            :searchIsClear="searchIsClear"
            :placeholder="'ИД, адрес, ФИО, телефон'"
          />
        </div>
      </div>

      <div class="aside__section">
        <div class="w-full flex py-1 px-2 bg-slate-200 dark:bg-slate-600 rounded-md">
          <div v-for="mode in modes"
               :key="mode.value"
               class="flex items-center basis-0 grow first:mr-2">
            <input v-model="selectedMode"
                   :id="mode.value"
                   type="radio"
                   name="mode"
                   :value="mode.value"
                   class="peer hidden" />
            <label :for="mode.value"
                   class="relative inline-flex items-center align-bottom w-full justify-center py-aside-input-py px-aside-input-px rounded-md text-sm font-bold leading-none text-slate-600 peer-checked:text-slate-700 dark:text-white/80 peer-checked:dark:text-white peer-checked:bg-white peer-checked:dark:bg-surface-900 focus:outline-none focus:outline-offset-0 focus:z-10 transition duration-200 cursor-pointer select-none overflow-hidden">
              {{ mode.name }}
            </label>
          </div>
        </div>


        <p v-if="false"
           class="font-semibold mb-1">Вид отображения</p>
        <div v-if="false"
             class="flex items-center relative mt-1">
          <DropdownAside v-model="selectedMode"
                         :id="mode.value"
                         :options="modes"
                         optionValue="value"
                         optionLabel="name"
                         class="w-full py-aside-input-py px-aside-input-px" />
        </div>
      </div>

      <div class="aside__section">
        <div class="flex items-center relative">
          <IftaLabel v-if="selectedMode === 'kanban'">
            <Select
                    v-model="asideParams.pipeline"
                    id="pipeline"
                    :options="pipeline_options"
                    @change="onPipelineChange($event)"
                    optionValue="id"
                    optionLabel="name"
                    class="w-full"
                    placeholder="Все"
            >
            </Select>
            <label>Воронка</label>
          </IftaLabel>
          <IftaLabel v-else >
            <TreeSelect
                v-model="tablePipAndStages"
                :options="pipelineNodes"
                :expanded-keys="{[pipelineNodes[0]?.key] : true}"
                emptyMessage="Пусто"
                selectionMode="checkbox"
                placeholder="Все"
                class="w-full"
            />
            <label> Воронки и этапы </label>
          </IftaLabel>
        </div>
      </div>

      <div v-if="selectedMode !== 'table'"
           class="aside__section">
        <div>
          <IftaLabel>
            <Select v-model="selectedField"
                    :options="fields"
                    optionLabel="name"
                    class="w-full" />
            <label>Сортировать по</label>
          </IftaLabel>
        </div>
        <div class="flex mt-[5px] px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-md">
          <div v-for="order in orders"
               :key="order.code"
               class="flex items-center basis-0 grow first:mr-2">
            <input v-model="selectedOrder"
                   :id="'order' + order.code"
                   type="radio"
                   name="order"
                   :value="order.code"
                   class="peer hidden"
                   />
            <label :for="'order' + order.code"
                   class="relative inline-flex items-center align-bottom w-full justify-center min-h-[24px] rounded-md font-bold leading-none peer-checked:text-slate-700 peer-checked:dark:text-white peer-checked:bg-white peer-checked:dark:bg-surface-900 focus:outline-none focus:outline-offset-0 focus:z-10 transition duration-200 cursor-pointer select-none overflow-hidden">
              <i :class="order.icon"></i>
            </label>
          </div>
        </div>
      </div>

      <section class="aside__section aside-filter select-none">
        <p class="aside__caption-field">
          Фильтры
          <span class="text-red-400"
                v-show="ActiveFiltersCount">
            ({{ ActiveFiltersCount }})
          </span>
        </p>
        <div>
          <div class="mt-2 min-h-full"
               :class="{ 'table-filter-section': selectedMode === 'table' }">

          <!--<FormFieldSet
                :name="'Общие параметры'"
                :activeCount = "activeMainFilterCount"
              >

                <div class="min-h-full flex flex-col gap-1">
                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <InputGroup>
                        <InputGroupAddon class="border border-solid border-aside-input-border border-r-0 shrink-0">
                          <button @click="onInputSearchEmptyButton"
                                  :class="{ activatedButton: filterFormData.uidEmpty }"
                                  class="w-full h-full min-w-[51px] px-[2px] py-[6.7px] bg-aside-btn-bg">
                            Пусто
                          </button>
                        </InputGroupAddon>
                        <IftaLabel>
                          <InputText type="text"
                                    placeholder=""
                                    @input="setFilterData"
                                    v-model="filterFormData.uid"
                                    size="small"
                                    class="!rounded-none"
                          />
                          <label>ИД объекта</label>
                        </IftaLabel>
                      </InputGroup>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <FormVSelect v-model="filterFormData.stages.selectedStages"
                                  :options="filteredStages"
                                  class="v-select-stage"
                                  label="label"
                                  value="value"
                                  multiple
                                  placeholder="Все"
                                  type="stages">
                        </FormVSelect>
                        <label class="py-[2px]">Этап</label>
                      </IftaLabel>

                    </div>
                    <div class="flex items-center">
                      <Checkbox v-model="filterFormData.stages.stagesExceptFor"
                                :binary="true"
                                @change="setFilterData"
                                inputId="stagesExceptFor" />
                      <label for="stagesExceptFor"
                            class="ml-2">Кроме</label>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <IftaLabel>
                      <FormVSelect v-model="partner"
                                  :options="pagePartners"
                                  multiple
                                  placeholder="Все"
                      >
                        </FormVSelect>

                      <label>Партнёрка</label>
                    </IftaLabel>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <IftaLabel>
                      <FormVSelect v-model="tags"
                                  :options="pageTags"
                                  label="label"
                                  value="value"
                                  multiple
                                  placeholder="Все"
                      >
                        </FormVSelect>
                      <label class="py-[2px]">Тэги</label>
                    </IftaLabel>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <FormVSelect v-model="filterFormData.facility_type"
                                  :options="facility_type_options"
                                  label="label"
                                  value="value"
                                  multiple
                                  placeholder="Все"
                      >
                        </FormVSelect>
                        <label>Тип недвижимости</label>
                      </IftaLabel>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <FormVSelect v-model="filterFormData.facility_condition"
                            :options="facility_condition_options"
                            label="label"
                            value="value"
                            multiple
                            placeholder="Все"
                      >
                        </FormVSelect>
                        <label>Состояние недвижимости</label>
                      </IftaLabel>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <label class="py-[2px]">Бюджет заказчика</label>
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <InputTextAside type="number"
                                        @input="enforceMinMax"
                                        min="1"
                                        v-model="filterFormData.budget_sum.from"
                                        size="small"
                                        class="ml-1" />
                        <label>C:</label>
                      </IftaLabel>

                      <IftaLabel>
                        <InputTextAside type="number"
                                        @input="enforceMinMax"
                                        min="1"
                                        v-model="filterFormData.budget_sum.to"
                                        size="small"
                                        class="ml-1" />
                        <label>До:</label>
                      </IftaLabel>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <Datepicker
                            v-model="filterFormData.created_at"
                            @date-select="setFilterData"
                            @clearClick="setFilterData"
                            selectionMode="range"
                            :manualInput="false"
                            showButtonBar
                            showIcon
                            iconDisplay="input"
                            id="created"
                            :dateFormat="dateFormat"
                            class="calendar-aside w-full flex-grow"
                        >
                          <template #date="slotProps">
                            <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                          </template>
                        </Datepicker>
                        <label>Дата создания:</label>
                      </IftaLabel>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <Datepicker
                            v-model="filterFormData.updated_at"
                            @date-select="setFilterData"
                            @clear-click="setFilterData"
                            selectionMode="range"
                            :manualInput="false"
                            showButtonBar
                            showIcon
                            iconDisplay="input"
                            id="created"
                            :dateFormat="dateFormat"
                            class="calendar-aside w-full flex-grow"
                        >
                          <template #date="slotProps">
                            <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                          </template>
                        </Datepicker>
                        <label for="integeronly">Дата обновления:</label>
                      </IftaLabel>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <Datepicker
                            v-model="filterFormData.zamer_date"
                            @date-select="setFilterData"
                            @clearClick="setFilterData"
                            selectionMode="range"
                            :manualInput="false"
                            showButtonBar
                            showIcon
                            iconDisplay="input"
                            id="created"
                            :dateFormat="dateFormat"
                            class="calendar-aside w-full flex-grow"
                        >
                          <template #date="slotProps">
                            <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                          </template>
                        </Datepicker>
                        <label>Дата выезда на замер:</label>
                      </IftaLabel>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative">
                      <IftaLabel>
                        <DatePicker
                            v-model="filterFormData.zamer_time"
                            @date-select="setFilterData"
                            @clear-click="setFilterData"
                            showButtonBar
                            selectionMode="range"
                            iconDisplay="input"
                            id="created"
                            :dateFormat="dateFormat"
                            class="calendar-aside w-full flex-grow"
                            time-only />
                        <label>Время приезда на замер:</label>
                      </IftaLabel>
                    </div>
                  </div>

                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <IftaLabel>
                      <InputTextAside type="text"
                                      placeholder=""
                                      @input="setFilterData"
                                      v-model="filterFormData.region"
                                      size="small" />
                      <label>Регион</label>
                    </IftaLabel>
                  </div>
                </div>

              </FormFieldset>

            <FormFieldSet
                :name="'Задачи'"
                :activeCount = "activeTaskFilterCount"
              >                      

              <div class="min-h-full flex flex-col gap-1 p-1 pb-2">

                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                  <label class="py-[2px]">Дата</label>
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center">
                      <RadioButton v-model="filterFormData.task.format"
                                   inputId="format"
                                   value="range" 
                                   :disabled="filterFormData.withoutTasks"/>
                      <label for="format"
                             class="ml-2 cursor-pointer">Начальная дата</label>
                    </div>
                    <div class="flex items-center">
                      <RadioButton v-model="filterFormData.task.format"
                                   inputId="format2"
                                   value="fromToday"
                                   :disabled="filterFormData.withoutTasks" />
                      <label for="format2"
                             class="ml-2 cursor-pointer">За последние</label>
                    </div>
                  </div>
                  <div v-if="filterFormData.task.format === 'range'">
                    <div class="flex items-center relative">
                      <FormDatePickerCustom
                          v-model="filterFormData.task.startDate"
                          @update:modelValue="setFilterData"
                          show-button-bar
                          :disabled="filterFormData.withoutTasks"
                          id="created"
                          :label="'Дата начала работ'"
                        >
                        </FormDatePickerCustom>                           

                    </div>
                  </div>
                  <div v-else
                       class="flex items-center relative">
                      <InputNumber v-model="filterFormData.task.lastDays"
                                   suffix=" дней"
                                   showButtons
                                   :min="0"
                                   class="p-0 h-8 text-xs w-full"
                                   placeholder="дней"
                                   @input="setFilterData()"
                                   @value-change="setFilterData()"
                                   :disabled="filterFormData.withoutTasks" />
                  </div>
                  <div class="flex items-center relative w-full">
                    <IftaLabel>
                      <FormVSelect v-model="filterFormData.task.performer"
                                  :options="performer_options"
                                  label="name"
                                  multiple
                                  placeholder="Все"
                                  :disabled="filterFormData.withoutTasks"
                      >
                        </FormVSelect>                         
                        <label>Исполнитель</label>
                    </IftaLabel>
                  </div>
                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center">
                      <Checkbox v-model="filterFormData.withoutTasks"
                                inputId="agent"
                                :binary="true"
                                @change="setFilterData" />
                      <label for="agent"
                            class="ml-2 cursor-pointer">Только сделки без задач</label>
                    </div>
                  </div>
                </div> 

              </div>
            </FormFieldSet>



            <FormFieldSet
                :name="'Заказчик'"
                :activeCount = "activeCustomerFilterCount"
              >                             

              <div class="min-h-full flex flex-col gap-1 pb-2">
                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                  <IftaLabel>
                    <InputText type="text"
                               placeholder=""
                               @input="setFilterData"
                               v-model="customer.lead_source"
                               class="w-full" />
                    <label>Откуда узнали о нас</label>
                  </IftaLabel>
                </div>
                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                  <div class="flex items-center relative">
                    <IftaLabel>
                      <InputText type="text"
                                 placeholder=""
                                 @input="setFilterData"
                                 v-model="customer.skidka"
                                 class="w-full" />
                      <label>Скидка</label>
                    </IftaLabel>
                  </div>

                  <div class="flex items-center relative">
                    <IftaLabel>
                      <InputText type="text"
                                 placeholder=""
                                 @input="setFilterData"
                                 v-model="customer.coef" />
                      <label>Коэффициент</label>
                    </IftaLabel>
                  </div>

                  <IftaLabel>
                    <FormVSelect v-model="customer.temperature"
                                  :options="temperature_options"
                                  label="label"
                                  value="value"                                  
                                  multiple
                                  placeholder="Все"
                      >
                    </FormVSelect>                        
                    <label>Лояльность клиента</label>
                  </IftaLabel>
                </div>
              </div>

            </FormFieldSet>
          -->

            <FormFieldSet
                :name="'Ответственные'"
                :collapsed="false"
                :activeCount = "activeResponsiblesFilterCount"
              >                          

              <div class="min-h-full flex flex-col gap-1 p-1 pb-2">
                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                  <div class="flex items-center relative w-full">
                    <IftaLabel>
                      <FormVSelect
                          v-model="responsibles.prorab"
                          :options="prorab_options"
                          label="name"
                          value="id"
                          multiple
                          placeholder="Все"
                      >
                    </FormVSelect>                        
                      <label>Прораб</label>
                    </IftaLabel>
                  </div>
                </div>

                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                  <div class="flex items-center relative w-full">
                    <IftaLabel>
                      <FormVSelect v-model="responsibles.responsible"
                                  :options="responsible_options"
                                  label="name"
                                  value="id"                                  
                                  multiple
                                  placeholder="Все"
                      >
                    </FormVSelect>                        
                      <label>Ответственный</label>
                    </IftaLabel>
                  </div>
                </div>
                
<!--                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">-->
<!--                  <div class="flex items-center relative w-full">-->
<!--                    <IftaLabel>-->
<!--                      <FormVSelect v-model="responsibles.operator"-->
<!--                                  :options="operator_options"-->
<!--                                  label="name"-->
<!--                                  value="id"                                  -->
<!--                                  multiple-->
<!--                                  placeholder="Все"-->
<!--                      >-->
<!--                      </FormVSelect>                        -->
<!--                      -->
<!--                      <label>КЦ1 ответственный за сделку</label>-->
<!--                    </IftaLabel>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">-->
<!--                  <div class="flex items-center relative w-full">-->
<!--                    <IftaLabel>-->
<!--                      <FormVSelect v-model="responsibles.zamerman"-->
<!--                                  :options="zamerman_options"-->
<!--                                  label="name"-->
<!--                                  value="id"                                  -->
<!--                                  multiple-->
<!--                                  placeholder="Все"-->
<!--                      >-->
<!--                      </FormVSelect>                       -->
<!--                      <label>Замерщик</label>-->
<!--                    </IftaLabel>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">-->
<!--                  <div class="flex items-center relative w-full">-->
<!--                    <IftaLabel>-->
<!--                      <FormVSelect v-model="responsibles.designer"-->
<!--                                  :options="designer_options"-->
<!--                                  label="name"-->
<!--                                  value="id"                                  -->
<!--                                  multiple-->
<!--                                  placeholder="Все"-->
<!--                      >-->
<!--                      </FormVSelect>                        -->
<!--                      <label>Дизайнер</label>-->
<!--                    </IftaLabel>-->
<!--                  </div>-->
<!--                </div>-->
              </div>
            </FormFieldSet>

            <FormFieldSet
                v-if="selectedMode === 'table'"
                :name="'Показать/скрыть колонки'"
              >
                <div
                    class="max-h-[calc(100vh-325px)] min-h-full flex flex-col gap-1 p-1 border-aside-input-border pb-2 font-medium select-none">
                  <section id="visible-columns">
                    <div class="grid grid-cols-2">
                      <div
                          v-for="column of visibleColumns"
                          :key="column.key"
                          class="flex items-center my-1 font-[420]"
                      >
                        <Checkbox
                            v-model="column.visible"
                            :inputId="column.key"
                            name="column"
                            :binary="true"
                            @change="updateVisibleColumns"
                            class="scale-75" />
                        <label :for="column.key">{{ column.name }}</label>
                      </div>
                    </div>
                  </section>
                </div>

              </FormFieldSet>

          </div>
        </div>
      </section>
    </div>
    <div class="sticky mx-[3px] z-10 bottom-0">
      <div class="flex flex-col gap-2">
        <button v-show="filtersState.isFiltersChanged && !filtersState.isFiltersCleaning"
                @click.stop="emitFilterData"
                class="py-2 px-8 bg-emerald-400 text-white font-medium rounded-lg">
          <span>Применить фильтры</span>
        </button>

        <button v-show="filtersState.isFiltersChanged && !filtersState.isFiltersCleaning"
                @click.stop="cancelFilters"
                class="py-2 px-8 bg-emerald-400 text-white font-medium rounded-lg">
          <span>Отмена</span>
        </button>

        <button v-show="ActiveFiltersCount && searchParams || searchParams && tablePipAndStages"
                @click.stop="cleanFilters"
                class="py-2 px-8 bg-emerald-400 text-white font-medium rounded-lg">
          <span>Сбросить всё</span>
        </button>
      </div>
    </div>

  </section>
</template>

<style scoped>

.p-select-list-container {
  font-size: 14px;
}
/* .table-filter-section {
  @apply max-h-[calc(100vh-305px)];
} */

.activatedButton {
  background-color: rgb(15, 187, 129);
  color: white;
}

</style>
