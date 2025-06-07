<script setup>
  import { useImboxStore } from '@/stores/imbox.js';
  const imboxStore = useImboxStore();  
  const listsStore = useListsStore();

  const props = defineProps(["mode", "loading"]);
  const emit = defineEmits(["change-param", "change-filter", "new-group"])

  const store = useMainStore();
  const loadingSearch = ref(false);

  const filterFormData = ref({
        uid: "",
        uidEmpty: false,

        address: "",

        last_message: {
          format: "range",
          startDate: null,
          endDate: null,
          daysPeriod: 0,
        },

        delay: null,
      });

  const tags = ref(null);
  const pageTags = ref([]);

  const need_answer = ref(0);

  const responsible = ref({
        responsible: "",
        responsible_options: [],

        prorab: "",
        prorab_options: [],

        team: "",
        team_options: []
  });

  const sortOrder = ref(0);
  const sortOptions = ref([
        {id: 0, name: 'Сначала новые'},
        {id: 1, name: 'Сначала непрочитанные'}
      ]);

  const pipelineNodes = ref([]);
  const pipes_and_stages = ref([]);
  const stages = ref([]);
  const stage = ref(null);

  const ptSelect = ref({
        label: '!text-sm !text-slate-600 !px-[9px] !py-[6px]',
        dropdown: '!justify-end !mr-[6px]'
      });
  const search = ref('');  

  let delay;

  const dealLists = computed(() => imboxStore.lists);
  const prorab_options = computed(() => listsStore.usersWithRolesList
    ? listsStore.usersWithRolesList.filter(user =>
        user.roles.some(role => role.id === 3)
    )
    : []
  ); 
  const team_options = computed(() => listsStore.usersWithRolesList || []);
  const responsible_options = computed(() => listsStore.usersWithRolesList || []);

  const types = ref([
    {code: 'deal', name: 'Объект'},
    {code: 'user', name: 'Пользователь'},
    {code: 'group', name: 'Группа'}
  ]);
  const selectedType = ref([]);

  const initAside = async () => {

    if (Object.keys(dealLists.value).length === 0) {
      return;
    }
    
    pageTags.value = dealLists.value.tags || [];

    pipelineNodes.value = Object.keys(dealLists.value.pipelines).map(num => {
      let children = Object.keys(dealLists.value.pipelines[num].stages).map(key => ({
        key: `${num}-${dealLists.value.pipelines[num].stages[key].id}`,
        label: dealLists.value.pipelines[num].stages[key].title
      }))
      // если stages - array
      // let children = dealLists.value.pipelines[num].stages.map(stage => ({
      //   key: `${num}-${stage.id}`,
      //   label: stage.title
      // }))
      return {
        key: dealLists.value.pipelines[num].id,
        label: dealLists.value.pipelines[num].name,
        children: children
      }
    })    
  }

  watch(dealLists, (newVal) => {
    if (Object.keys(newVal).length > 0) {
      initAside();
    }
  }, { immediate: true });  

  function onInputSearch(event) {
    if (delay) {
      clearTimeout(delay);
    }
    delay = setTimeout(() => {
      loadingSearch.value = true;
      context.emit("change-param", "search", event.target.value);
    }, 2000);
  }

  const onSearchChanged = () => {
      const oldURL = window.location.href;
      const newUrl = search.value.length ? `${window.location.pathname}?search=${search.value}` : null;
      if (newUrl) {
        history.pushState(oldURL, '', newUrl);
      } else {
        history.pushState(oldURL, '', window.location.pathname);
      }
      emit("change-param", "search", search.value);
    };

  const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
  };
  
  const emitFilterData = () => {
    const data = {
    }; // объект фильтров которого отправим на сервер

    // // ИД
    if (filterFormData.value.uid !== "") {
      filterFormData.value.uidEmpty = false;
      data.uid = filterFormData.value.uid;
    } else if (
      filterFormData.value.uid === "" &&
      !filterFormData.value.uidEmpty
    ) {
    } else if (
      filterFormData.value.uid === "" &&
      filterFormData.value.uidEmpty
    ) {
      data.uid = "empty";
    }

    // Даты
    if (filterFormData.value.last_message.format === "range") {
      data.last_message = {};
      if (filterFormData.value.last_message.startDate)
        data.last_message.startDate = formatDate(
          filterFormData.value.last_message.startDate,
        );
      if (filterFormData.value.last_message.endDate)
        data.last_message.endDate = formatDate(
          filterFormData.value.last_message.endDate,
        );
    } else {
      data.last_message = {};
      if (filterFormData.value.last_message.daysPeriod) {
        data.last_message.lastDays = filterFormData.value.last_message.daysPeriod;
      }
    }

    // Ответственные
    const responsibleFields = { 
      prorab: responsible.value.prorab, 
      responsible: responsible.value.responsible, 
      team: responsible.value.team
    };
    for (const [key, value] of Object.entries(responsibleFields)) {
      if (value) {
        data[key] = value;
      }
    }

    // Тэги
    if (tags.value) {
      data.tags = tags.value;
    }

    // Требует ответа
    if (need_answer.value) {
      data.need_answer = need_answer.value;
    }

    // Этапы
    if (stage.value) {
      data.stage = stage.value;
    }

    // Тип подписки
    if (selectedType.value && selectedType.value.length > 0) {
      data.type = selectedType.value.map(item => item.code);
    }

    setTimeout(() => {
      emit("change-filter", "filter", data);
    }, 0);
  }; 

  const emitWithTimeOut = () => {
      if (delay) {
        // задержка перед запросом
        clearTimeout(delay);
      }
      delay = setTimeout(() => {
        emitFilterData();
      }, 2000);
    };

  const emitNewGroup = () => {
      emit("new-group");
    }   

  onMounted(() => {
      const route = useRoute()
      if (route.query.search) {
        search.value = route.query.search
        emit("change-param", "search", search.value);
      }
  })    

  watch(() => props.loading,(newValue) => {
      if (!newValue) {
        loadingSearch.value = false;
      }
  });


  watch(selectedType,(newVal) => {
    emitFilterData();
  })


  watch(() => sortOrder,(newVal) => {
    emit("change-param", "order", newVal);
  })

  watch(responsible,(newVal) => {
    emitFilterData();
  },{deep: true})  


  watch(tags,(newVal) =>  {
    emitFilterData();
  },{deep: true})

  watch(need_answer,(newVal) =>  {
    emitFilterData();
  })

  watch(pipes_and_stages,(newVal) =>  {
    stage.value = [];
    let pipelines = [];
    let stages = [];
    for (let key of Object.keys(pipes_and_stages.value)) {
      if (pipes_and_stages.value[key]) {
        let parts = key.split('-');
        if (parts[1]) {
          stages.push({
            stage_id: parts[1],
            pipe_id: parts[0]
          });
        } else {
          pipelines.push(parts[0]);
        }
      }
    }

    for (let stageItem of stages) {
      stage.value.push(stageItem.stage_id);
      pipelines = pipelines.filter(pipe => pipe != stageItem.pipe_id);
    }

    for (let pipe of pipelines) {
      let pipeStages = dealLists.value.pipelines[pipe].stages.map(stage => stage.id);
      stage.value.push(...pipeStages);
      }

    emitFilterData();
  },{deep: true})

</script>

<template>
  <section class="flex flex-col relative">
    <div class="px-[3px] select-none">

      <div class="aside__section search-wrapper relative">
        <div class="pt-[3px]">
          <FormSearch
            :searchIsClear="searchIsClear"
            @change-search="onSearchChanged"
            :placeholder="'Поиск по объектам'"
            v-model="search" />
        </div>
      </div>

        <button
            @click.stop.prevent="emitNewGroup"
            class="button-modal button-accent w-full mb-2 disabled:opacity-100 disabled:cursor-default disabled:bg-[var(--p-primary-color)] disabled:text-[var(--p-primary-contrast-color)]"
        >
          Создать группу
        </button> 

        <MultiSelect 
          v-model="selectedType" 
          :options="types" 
          optionLabel="name" 
          placeholder="Все"
          class="w-full" 
          pt:root:class="rounded-none"
          pt:header:class="hidden"
          pt:clearicon:class="self-center"
          pt:option:class="py-[6px]"
          pt:optionlabel:class="text-[14px]"
        /> 

        <div>
          <div class="mt-2">

          <!-- Сортировка -->
          <!-- <div class="aside__section">
            <div  class="min-h-full flex flex-col gap-1 pb-2">
              <div class="flex flex-col gap-1">
                <p class="aside__caption-field">Сортировать</p>
                <div class="flex items-center relative w-full">

                  <Select
                    v-model="sortOrder"
                    :options="sortOptions"
                    optionLabel="name"
                    optionValue="id"
                    class="w-full"/>

                </div>
              </div>

            </div>
          </div> -->

          <p class="aside__caption-field mb-2">Фильтры</p>

          <!-- Прораб -->
          <div  class="pb-2">

            <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
              <div class="flex items-center relative w-full">
                <IftaLabel>
                  <FormVSelect v-model="responsible.prorab"
                              :options="prorab_options"
                              :reduce="option => option.id"
                              label="name"
                              value="id"
                              multiple
                              placeholder="Все"
                              class="w-full"
                  >
                  </FormVSelect>                        
                  <label>Прораб</label>
                </IftaLabel>
              </div>
            </div>

          </div>

          <!-- Ответственный -->
          <div  class="pb-2">
            <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
              <div class="flex items-center relative w-full">
                <IftaLabel>
                  <FormVSelect v-model="responsible.responsible"
                              :options="responsible_options"
                              :reduce="option => option.id"
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
          </div>

          <div  class="pb-2">
            <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
              <div class="flex items-center relative w-full">
                <IftaLabel>
                  <FormVSelect 
                      v-model="responsible.team"
                      :options="team_options"
                      :reduce="option => option.id"
                      multiple
                      label="name"
                      value="id"                                  
                      placeholder="Все"
                      class="w-full"

                  >
                </FormVSelect>                        
                <label class="py-[2px]">Участники</label>
                </IftaLabel>
              </div>
            </div>    
          </div>      

          <!-- Дата последнего сообщения -->
          <div class="min-h-full flex flex-col gap-1 pb-2">
            <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
              <label class="py-[2px]">Дата последнего сообщения</label>
              <div class="flex flex-col gap-1">
                <div class="flex items-center">
                  <RadioButton
                    v-model="filterFormData.last_message.format"
                    inputId="format"
                    value="range"
                  />
                  <label for="format" class="ml-2 cursor-pointer">Диапазон дат</label>
                </div>
                <div class="flex items-center">
                  <RadioButton
                    v-model="filterFormData.last_message.format"
                    inputId="format2"
                    value="fromToday"
                  />
                  <label for="format2" class="ml-2 cursor-pointer">За последние</label>
                </div>
              </div>

              <div v-if="filterFormData.last_message.format === 'range'">
                                
                <div class="flex items-center relative">
                  <FormDatePickerCustom
                    v-model="filterFormData.last_message.startDate"
                    @update:modelValue="emitFilterData"
                    showButtonBar
                    id="created"
                    label="Начальная дата"
                    class="calendar-aside w-full flex-grow"
                    :disabled="filterFormData.withoutTasks"
                  >
                  </FormDatePickerCustom>                  
                  <!-- <IftaLabel>
                    <Datepicker
                        v-model="filterFormData.last_message.startDate"
                        @update:modelValue="emitFilterData"
                        showIcon
                        showButtonBar
                        iconDisplay="input"
                        id="created"
                        dateFormat="dd/mm/yy"
                        class="calendar-aside w-full flex-grow"
                        :disabled="filterFormData.withoutTasks"
                    >
                      <template #date="slotProps">
                        <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                      </template>
                    </Datepicker>
                    <label>Начальная дата:</label>
                  </IftaLabel> -->
                </div>                                                                    

                <div class="flex items-center relative">
                  <FormDatePickerCustom
                    v-model="filterFormData.last_message.endDate"
                    @update:modelValue="emitFilterData"
                    showButtonBar
                    id="created"
                    label="Конечная дата"
                    class="calendar-aside w-full flex-grow"
                    :disabled="filterFormData.withoutTasks"
                  >
                  </FormDatePickerCustom>                     
                  <!-- <IftaLabel>
                    <Datepicker
                        v-model="filterFormData.last_message.endDate"
                        @update:modelValue="emitFilterData"
                        showIcon
                        showButtonBar
                        iconDisplay="input"
                        id="created"
                        dateFormat="dd/mm/yy"
                        class="calendar-aside w-full flex-grow"
                        :disabled="filterFormData.withoutTasks"
                    >
                      <template #date="slotProps">
                        <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                      </template>
                    </Datepicker>
                    <label>Конечная дата:</label>
                  </IftaLabel> -->
                </div>   

              </div>

              <div v-else class="flex items-center relative">
                <InputNumber
                  v-model="filterFormData.last_message.daysPeriod"
                  suffix=" дней"
                  showButtons
                  :min="0"
                  class="input-small w-full"
                  placeholder="дней"
                  :disabled="filterFormData.withoutTasks"
                  @input="emitWithTimeOut"
                />
              </div>
            </div>
          </div>

          <div class="pb-2">
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
          </div>

          <!--Требует ответа-->
          <div class="mb-2">
            <div  class="aside-filter__content flex flex-col gap-1 rounded-md">
              <div class="flex items-center gap-1 p-1 py-2 rounded-md">
                <Checkbox v-model="need_answer" :binary="true" inputId="needAnswer" />
                <label for="needAnswer" class="ml-2 cursor-pointer"> Требует ответа </label>
              </div>
            </div>
          </div>

          <!--Воронки и этапы-->
          <div  class="aside-filter__content flex flex-col gap-1 rounded-md">
            <div class="flex flex-col gap-1 p-1">
              <IftaLabel>
                <TreeSelect
                  v-model="pipes_and_stages"
                  :options="pipelineNodes"
                  emptyMessage="Пусто"
                  selectionMode="checkbox"
                  class="w-full" />
                <label> Воронки и этапы </label>
              </IftaLabel>
            </div>
          </div>

          </div>
        </div>

    </div>
  </section>
</template>

<style scoped>
.table-filter-section {
  @apply max-h-[calc(100vh-305px)];
}


.activatedButton {
  background-color: rgb(15, 187, 129);
  color: white;
}

/* .aside-deal__toggle {
  font-family: "Montserrat", "sans-serif";
} */

.calendar-small {
  @apply !text-xs px-0 py-0 p-0 h-8;
}

.calendar-small input {
  @apply !max-w-8;
}

.input-small {
  @apply p-0 h-8 text-xs;
}

::-webkit-scrollbar {
  scrollbar-width: none;
}

/* .v-select {
  --vs-dropdown-option--active-bg: var(--p-primary-200);
  background: white;
  border-radius: 5px;
  --vs-font-size: 14px;
  --vs-dropdown-option-padding: 8px 8px;
  --vs-dropdown-option--active-color: var(--p-primary-800);
  --vs-dropdown-font-size:16px;
  --vs-dropdown-min-width: 300px;
  padding: 0px;
  margin: 0px;
} */

/* .v-select .aside-deal__toggle {
  background: white;
} */

</style>
