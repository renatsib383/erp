<script setup>
// import { FormDatePickerCustom } from '#build/components';
import { useTasksStore } from '~/stores/tasks.js'
// import { createTask } from '@/services/api/tasksServices.js';

const store = useMainStore();
const tasksStore = useTasksStore();

const dialogRef = inject('dialogRef');
const isChanged = ref(false)
const saving = ref(false);


// Приходят от API
const errors = ref({});
// для хранения значений из инпутов v-model
const newEventData = reactive({});

Object.assign(newEventData, dialogRef.value.data);
if (typeof newEventData.start == 'string') {
    newEventData.start = parseISOStrict(newEventData.start);
    newEventData.end = newEventData.end === null ? null : parseISOStrict(newEventData.end);
}
if(newEventData.all_day) {
  newEventData.start = newEventData.start && new Date(newEventData.start.setHours(9,0,0));
  newEventData.end = newEventData.end && new Date(newEventData.end.setHours(20,0,0));
}
newEventData.author = newEventData.author?.id;

//!!!

// Получить id текущего пользовтаеля
  const currentUser = useSanctumUser();
  const me = currentUser.value;

const durationTime = ref(null);
// if(newEventData.calledFrom === 'deal'){
//   durationTime.value = newEventData.duration;
// } else {
//   durationTime.value = newEventData.customData.duration
// }
durationTime.value = newEventData.duration;

// watch(() => ({...newEventData}),(newVal,oldVal) => {
//     if (newVal.allDay && !oldVal.allDay) {
//         newEventData.start = newEventData.start && new Date(newEventData.start.setHours(9,0,0));
//         newEventData.end = newEventData.end && new Date(newEventData.end.setHours(21,0,0));
//     }
// });

// newEvent - для передачи в API, с коррекцией даты из локальной в UTC
let newEvent = {};
// function getDate(date) {
//     return new Date(
//       new Date(Date.parse(date)).toLocaleString("en-US", { timeZone: "UTC" })
//     );
// }

const selectedType = ref({
  "code": 1,
  "name": "\u0417\u0432\u043e\u043d\u043e\u043a"
});
const types = ref(dialogRef.value.data.types);
const taskDurationList = [{label: 'Весь день',value: 1440}, {label:'15 минут',value: 15}, {label:'30 минут',value:30}, {label:'1 час',value:60}, {label:'2 часа',value:120}]
if (newEventData.mode === 'update') {
    selectedType.value = types.value.find(item => item.code === newEventData.type);
}

const users = ref(dialogRef.value.data.users.map((item) => {
    return {code: item.id, name: item.name}
}));

const selectedUser = ref(users.value.find(item => item.code === newEventData.performer));

const btnText = ref('Создать');
if (dialogRef.value.data.mode === 'update') {
    btnText.value = 'Сохранить';
}



async function addEvent() {
  // const response = await createTask(newEvent);
  const response = await tasksStore.createTask(newEvent);  
  if (response && response.success) {
    dialogRef && dialogRef.value.close();
    newEvent = {};
  }
  else {
    console.log('Errors when create task',errors);
    errors.value = response && response.errors;
  }

    // await $api.post('/tasks', newEvent)
    //     .then(
    //         (response) => {
    //             dialogRef && dialogRef.value.close();
    //             newEvent = {};
    //         },
    //         (error) => {
    //             console.log('errors',errors);
    //             errors.value = error.response.data.errors;
    //         }
    //     );
}

async function onTaskSaveButtonClick(finishAnyway) {
    saving.value = true; 
    // newEventData.performer = selectedUser.value ?  users.value.find(userP => userP.id === selectedUser.value.code).id : null;
    newEventData.performer = selectedUser.value ?  selectedUser.value.code : null;
    newEventData.type = selectedType.value ? selectedType.value.code : null;
    newEventData.duration = durationTime.value;
    newEventData.end = new Date(newEventData.start.getTime() + newEventData.duration * 60 * 1000);
    // !!!
    // if (newEventData.calledFrom !== 'deal') {
    //   newEventData.customData.duration = durationTime.value
    // }

    if (newEventData.description && newEventData.description.length > 0 || finishAnyway && finishAnyway.length) {
      newEventData.status = 3;
      newEventData.completed = true;
    } else {
      newEventData.status = 1;
    }
    if (!newEventData.description) newEventData.description = '';

    Object.assign(newEvent,newEventData);

    if (dialogRef.value.data.mode === 'update') {
        errors.value = await dialogRef.value.options.onSubmit(newEvent);
        saving.value = false;
    }
    else {
        await addEvent();
        saving.value = false;
    }
}

const openDeal = () => {
  const deal = {
    id: newEventData.deal_id,
    noCollapsed: true
  }
  store.setNewModal({modalData: deal, modalTitle: 'deal'})
  dialogRef && dialogRef.value.close();
}


const closeTaskModal = () => {
  dialogRef && dialogRef.value.close();
}

const eventHeader = () => {
  const eventType = newEventData.type
    ? types.value.find(item => item.code === newEventData.type)?.name
    : newEventData.mode === 'create' ? 'Новая задача' : 'Изменить задачу';
  return eventType;
}

const activeTab = ref(0)

watch(newEventData, () => {
  isChanged.value = true
}, {deep: true})

watch(() => newEventData.start, () => {
  if (durationTime.value == 1440 && !(newEventData.start.getHours() == 9 && newEventData.start.getMinutes() == 0)) {
    newEventData.start = new Date(newEventData.start.setHours(9,0,0));
  }
}, {deep: true})

watch(selectedUser, () => {
  isChanged.value = true
}, {deep: true})

watch(selectedType, () => {
  isChanged.value = true
}, {deep: true})

watch(durationTime, () => {
  if (durationTime.value == 1440) {
    newEventData.start = new Date(newEventData.start.setHours(9,0,0));
  }
  isChanged.value = true
}, {deep: true})

</script>

<template>
    <section class="h-full">
      <header class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-4 text-white text-lg">
        <div class="flex items-center gap-1">
          <p>{{eventHeader()}} <span v-if="newEventData.deal_id && newEventData.type">по объекту <button @click.stop.prevent="openDeal" class="text-blue-500 underline">{{newEventData.deal_id}}</button></span></p>
        </div>
        <div class="flex items-center gap-2 text-base">
          <Button
              v-if="newEventData.mode === 'update' && newEventData.status !== 3"
              :label="'Завершить задачу'"
              class="bg-emerald-500 hover:!bg-emerald-700 text-white border-0 rounded-none mr-2"
              :disabled="newEventData.performer && me.id !== newEventData.performer || saving"
              @click.stop.prevent="onTaskSaveButtonClick('finishAnyway')"
          />          
          <Button
              v-show="newEventData.mode == 'create' ? true : (isChanged ? true : false)"
              @click.stop.prevent="onTaskSaveButtonClick"
              :title="btnText"
              :disabled="saving"
              class="bg-emerald-500 hover:!bg-emerald-700 h-[var(--modal-header-height)] text-white border-0 flex items-center justify-center py-1 px-2 rounded-none"
          >
            <p>{{btnText}}</p>
          </Button>
          <button
              v-if="dialogRef"
              @click.prevent="closeTaskModal"
              class="custom-collapse-button"
          >
            <span class="pi pi-times"></span>
          </button>
          <NuxtLink v-else to="/tasks"><button title="Вернуться к списку" class="custom-collapse-button"><span class="pi pi-list text-xl"/></button></NuxtLink>
        </div>
      </header>
      <div class="content h-[calc(100%-var(--modal-header-height))] px-4 pb-4 text-surface-700 text-sm bg-white dark:bg-surface-800">
        <nav class="custom-nav">
          <div class="flex items-center">
            <p @click = 'activeTab = 0' class="custom-nav-tab -mb-[6px]" :class="{'custom-nav-tab_active' : activeTab === 0}">Основное</p>
          </div>
          <span @click.stop="activeTab = 2" class="custom-nav-history" :class="{'custom-nav-tab_active' : activeTab === 2}" title="Журнал изменений"/>
        </nav>

        <main v-show="activeTab === 0">
          <div class="grid md:grid-cols-2 gap-2 pt-2">
            <div class="flex flex-col gap-2">
              <IftaLabel>
                <Select
                    v-model="selectedType"
                    :options="types"
                    optionLabel="name"
                    placeholder="Выберите тип"
                    :invalid="errors && errors.type"
                    :disabled="newEventData.status === 3"
                    class="w-full"
                />
                <label>Тип</label>
              </IftaLabel>
            </div>
            <div class="flex flex-col gap-2">
              <IftaLabel>
                <Select
                    v-model="selectedUser"
                    :options = users
                    optionLabel="name"
                    placeholder="Выберите исполнителя"
                    class="w-full"
                    :invalid="errors && errors.user"
                    :disabled="newEventData.status === 3">
                </Select>
                <label>Исполнитель</label>
              </IftaLabel>



            </div>
            <div class="flex flex-col gap-2">
              <FormDatePickerCustom
                v-model="newEventData.start"
                showTime
                hourFormat="24"
                :stepMinute=30
                :disabled="newEventData.status === 3"
                :label="'Дата начала'"
                :noMax="true"
              >
              </FormDatePickerCustom>
              <!-- <IftaLabel>
                <DatePicker
                    v-model="newEventData.start"
                    showTime
                    hourFormat="24"
                    :stepMinute=30
                    class="CustomTaskFullCalendar w-full"
                    :disabled="newEventData.status === 3"
                >
                  <template #date="slotProps">
                    <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                  </template>
                </DatePicker>
                <label>Дата начала</label>
              </IftaLabel> -->
            </div>
            <div class="flex flex-col gap-2">
              <IftaLabel>
                <Select
                    v-model="durationTime"
                    :options="taskDurationList"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Выберите продолжительность"
                    :invalid="errors && errors.type"
                    :disabled="newEventData.status === 3"
                    class="w-full"
                />
                <label>Продолжительность</label>
              </IftaLabel>
            </div>
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <IftaLabel>
              <InputText
                  v-model="newEventData.title"
                  :invalid="errors && errors.title"
                  :disabled="newEventData.status === 3"
                  class="w-full"
              />
              <label>Комментарий</label>
            </IftaLabel>
          </div>

          <div v-show="newEventData.mode === 'update'" class="flex flex-col gap-2 mt-2">
            <IftaLabel>
              <Textarea
                  v-model="newEventData.description"
                  :pt="{ root: 'w-full' }"
                  :ptOptions="{ mergeProps: true }"
                  :disabled="newEventData.status === 3 || newEventData.performer && me.id !== newEventData.performer"
                  rows="2"
                  cols="30" />
                <label>Результат</label>  
            </IftaLabel>
          </div>

        </main>
      </div>
    </section>
</template>

<style scoped>
.CustomTaskFullCalendar input{
  width:100%;
 }

 .fc .fc-toolbar.fc-header-toolbar {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
 }
</style>
