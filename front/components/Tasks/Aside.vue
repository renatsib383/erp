<script setup>
import { fetchTaskLists } from '@/services/api/tasksServices.js';
const listsStore = useListsStore();

const lists = ref({
  users: [],
  tasks: {types: []},
  types: [],
  pipelines: []
});

const emit = defineEmits(['change-searchValue', 'set-newuser'])
const route = useRoute()

const delay = ref()
const pipeline = ref(null);
// const stages = ref(null);
const pipeline_options = ref([])
const users = computed(() => listsStore.usersWithRolesList || []);
const types = ref([])
const stages_options = ref([]);
const isFiltersSet = computed(() => {
  if (listsStore.usersWithRolesList ) {
    return true;
  } else {
    return false;
  }
});

const currentUserData = useSanctumUser();
const currentUser = {
  name: currentUserData.value.name,
  id: currentUserData.value.id,
  roles: currentUserData.value.roles
}

const params = ref({
  type: [],
  author: [],
  performer: [],
  completed: false,
  overdueOnly: false,
  stages: [],
});


const emitChangeParams = (newValue) => {
  // if (pipeline.value && params.value.stages.length == 0) {
  //   params.value.stages = Object.values(lists.value.pipelines[pipeline.value].stages).map((stage) => stage.id);
  // }
  let queryParams = newValue;

  emit('change-params', queryParams);
}

const changePipeline = () => {
  params.value.stages = [];
  if (pipeline.value){
    stages_options.value = Object.values(lists.value.pipelines[pipeline.value]?.stages);
  }
}

const setFiltersFromURL = () => {
  if (route.query) {
    Object.entries(route.query).forEach(([key, value]) => {
      const match = key.match(/^filter\[(\w+)]/); // Ищем filter[type], filter[performer] и т. д.
      if(!key.includes('stage')){
        if (match) {
          const filterKey = match[1];

          if(filterKey === 'type'){
            const type = types.value.find(item => Number(item.code) === Number(value));
            if(type) params.value[filterKey].push(type);
          }
          if(filterKey === 'performer'){
            const performer = users.value.find(item => Number(item.id) === Number(value));
            if(performer) params.value[filterKey].push(performer);
          }
          if(filterKey === 'author'){
            const author = users.value.find(item => Number(item.id) === Number(value));
            if(author) params.value[filterKey].push(author);
          }
          if(filterKey === 'completed'){
            params.value.completed = value == 1;
          }
          if(filterKey === 'overdueOnly'){
            params.value.overdueOnly = value == 1;
          }
        }
      }
      else{
        if (match) {
          const filterKey = match[1];
          if(filterKey === 'stage'){
            const pip = pipeline_options.value.find(pip => Object.keys(pip.stages).includes(value))
            if(!pipeline.value){
              pipeline.value = pip.id
              if (pipeline.value){
                stages_options.value = Object.values(lists.value.pipelines[pipeline.value]?.stages);
              }
            }
            const stage = Object.values(pip.stages).find(stage => Number(stage.id) === Number(value))
            if(stage)params.value.stages.push(stage.id)
          }
        }
      }
    });

    if(!Object.keys(route.query).some((key) => key.includes("filter"))) {
      params.value.performer.push(currentUser) // По умолчанию указываем текущего пользователя если нету фильтров
    }
  }
}
watch(() => ({...params.value}), (newValue, oldValue) => {
  if (newValue.completed && oldValue.overdueOnly) {
    params.value.overdueOnly = false;
  }
  if (newValue.overdueOnly && oldValue.completed) {
    params.value.completed = false;
  }
  debounce(emitChangeParams(newValue), 300);
}, { deep: true })

watch(users,(newValue) => {
  setFiltersFromURL();
}, {deep: true})

onMounted(async() => {
  const response = await fetchTaskLists();
  lists.value = await response.lists;

  types.value = lists.value.tasks.types.map(item => {
    return { label: item.name, code: item.code }
  })
  pipeline_options.value = Object.values(lists.value.pipelines);  
})

</script>

<template>
  <section class="">
    <p class="aside__caption-field mb-2">Фильтры</p>

    <div class="pb-2">
      <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
        <div class="flex items-center relative w-full">
          <IftaLabel>
            <FormVSelect v-model="params.type"
                         :options="types"                         
                         taggable
                         push-tags
                         multiple
                         placeholder="Все"
                         class="w-full"
                         :disabled="!isFiltersSet">
            </FormVSelect>
            <label>Тип задачи</label>
          </IftaLabel>
        </div>
      </div>
    </div>

    <div class="pb-2">
      <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
        <div class="flex items-center relative w-full">
          <IftaLabel>
            <FormVSelect v-model="params.performer"
                          :options="users"
                          label="name"
                          value="id"                            
                          taggable
                          push-tags
                          multiple
                          class="v-select"
                          placeholder="Все"
                          :disabled="!isFiltersSet">
            </FormVSelect>
            <label>Исполнитель</label>
          </IftaLabel>
        </div>
      </div>
    </div>

    <div class="pb-2">
      <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
        <div class="flex items-center relative w-full">
          <IftaLabel>
            <FormVSelect v-model="params.author"
                         :options="users"
                          label="name"
                          value="id"                            
                          multiple
                          placeholder="Все"
                          :disabled="!isFiltersSet">
            </FormVSelect>
            <label>Кем поставлена</label>
          </IftaLabel>
        </div>
      </div>
    </div>


    <div class="mt-1">
      <div class="max-h-full flex flex-col gap-1 pb-2">

        <div class="mb-2">
          <div class="aside-filter__content flex flex-col gap-1 rounded-md">
            <div class="flex items-center gap-1 p-1 pb-0">
              <Checkbox v-model="params.completed"
                        :binary="true"
                        @change="some"
                        class="scale-90"
                        inputId="closedOnly"
                        :disabled="!isFiltersSet"/>
              <label for="closedOnly"
                     class="ml-2 cursor-pointer"> Только выполненные </label>
            </div>
            <div class="flex items-center gap-1 p-1 rounded-md">
              <Checkbox v-model="params.overdueOnly"
                        :binary="true"
                        class="scale-90"
                        inputId="overdueOnly"
                        :disabled="!isFiltersSet" />
              <label for="overdueOnly"
                     class="ml-2 cursor-pointer"> Только просроченные </label>
            </div>
          </div>
        </div>

        <div class="pb-2">
          <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">


            <IftaLabel>
              <Select v-model="pipeline"
                      :options="pipeline_options"
                      @change="changePipeline"
                      optionValue="id"
                      optionLabel="name"
                      placeholder="Все"
                      class="w-full">
              </Select>
              <label>Воронка</label>
            </IftaLabel>

          </div>
        </div>

        <div class="pb-2">
          <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
            <IftaLabel>
              <FormVSelect v-model="params.stages"
                           :options="stages_options"
                           :reduce="option => option.id"
                           value="id"
                           label="title"
                           placeholder="Все"
                           multiple
                           :disabled="!pipeline">
              </FormVSelect>
              <label>Этапы</label>
            </IftaLabel>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

