<script setup>
import TaskFull from "@/components/Tasks/Full.vue";
import ruLocale from '@fullcalendar/core/locales/ru';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import MyFullCalendar from '@fullcalendar/vue3';
// import { useDialog } from 'primevue/usedialog';
import { useTasksStore } from '~/stores/tasks.js'
import { TASK_OPTIONS, isOverdue } from '~/utils/task-utils.js';

// import DynamicDialog from 'primevue/dynamicdialog';

import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";

// import ptDialog from "@/assets/presets/custom/modalPreset.js";
import ptDialogTask from "@/assets/presets/custom/TaskFullPreset.js";
import ProgressSpinner from "primevue/progressspinner";

import { getListsData } from '~/services/api/deals-services/dealsServices.js';
import { fetchTasks, updateTask } from "~/services/api/tasksServices.js";
import {fetchUsers} from "~/services/api/imboxServices.js";

let types = [];
const tasksStore = useTasksStore();
const tasksaside = ref(null);
const loading = ref('tasks');
const dialog = useDialog();
const fullCalendar = ref({});
const sectionRef = ref(null) // Для слежения размера секции
const newEvent = ref({});
const asideParams = ref(null)
const currentPeriod = ref(null)
const delay = ref(null);

const events = ref(null);
const activeTask = ref(null);
const selectedSlot = ref(null);

const fieldsVaidate = ref({});
let taskDialogRef = null;

    
function createTaskCardView(info){
  // let typeLabel;
  let completed = null;
  if(info.event._def.extendedProps?.completed){
    completed = true;
  }
  // if(info.event._def.extendedProps?.type){
  //   typeLabel = types.find(i => i.code === Number(info.event._def.extendedProps.type))
  // }
  // Добавляем класс 'completed-task' если задача завершена
  const isDuration15 = info.event._def.extendedProps.customData.duration == 15;
  let taskContentClass = '';
  let iconContentClass = '';
  if (completed) taskContentClass += 'completed_task';
  if (isDuration15) {
    taskContentClass += ' text-[10px] leading-[10px]';
    iconContentClass += ' text-[10px] leading-[10px]'
  }

  // return info.event._def.extendedProps.overdue
  //   ? 
  return {
      html: `<div 
                class="h-full overflow-hidden" 
                title="${info.event._def.extendedProps.deal.uid}">
              <div class="flex items-start gap-1 max-h-full">
                <div class="${TASK_OPTIONS.icons[info.event._def.extendedProps.type]} ml-[2px] ${iconContentClass}"></div>
                <p class="${taskContentClass}">${info.event._def.extendedProps.deal.uid}</p>
                <span class="pi pi-check ml-auto mr-[2px] ${iconContentClass} ${completed ? '' : 'hidden'}"></span>
              </div>
            </div>`
    }
    // : {
    //   html: `<div class="flex items-center gap-1">
    //           <div class="${TASK_OPTIONS.icons[info.event._def.extendedProps.type]} ml-[2px]"></div>
    //           <p class="${taskClass}"> ${info.event._def.extendedProps.deal.uid}</p>
    //           ${completed ? '<span class="pi pi-check ml-auto mr-[2px]"></span>' : ''}
    //         </div>`
    // };
}

const calendarOptions = ref({
    timeZone: 'UTC',
    // plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin], 
    plugins: [timeGridPlugin, dayGridPlugin, listPlugin],
    editable: false,
    droppable: false,
    initialView: window.innerWidth < 765 ? 'timeGridDay':'timeGridWeek',
    locale: ruLocale,
    headerToolbar: {start: 'title', center: window.innerWidth < 765 ? '':'timeGridWeek,timeGridDay,listWeek', end: 'prev,next' },
    height: '100%',
    buttonText: {
        list: 'Список'
    },
    slotMinTime: '08:00',
    slotMaxTime: '21:00',
    eventClick: handleEventClick,
    datesSet: function( dateInfo ){
      currentPeriod.value = dateInfo
      fetchEvents()
    },
    events: events.value,
    eventContent: function(info) {
      return createTaskCardView(info)
    },
    eventDidMount: function(info) {
      if (info.event.extendedProps) {
        info.el.style.opacity = info.event.extendedProps.completed ? '0.75' : '1';
      }
    },
    eventDrop: function (info) {
        updateEventDnd(info);
    },
    eventResize: function (info) {
        updateEventDnd(info);
    },
    windowResize: function() {
        const calendarApi = fullCalendar.value?.getApi();
        if (window.innerWidth < 768) {
            calendarApi.changeView('timeGridDay'); // Меняем вид на один день для мобильных устройств
            calendarApi.setOption('headerToolbar', { // Убираем лишние кнопки
                start: 'title',
                center: '',
                end: 'prev,next'
            });
        } else {
            calendarApi.changeView('timeGridWeek'); // Возвращаем вид на сетку для больших экранов
            calendarApi.setOption('headerToolbar', {
                start: 'title',
                center: 'timeGridWeek,timeGridDay,listWeek',
                end: 'prev,next'
            });
        }
    },

});

function fetchEvents() {
  if(currentPeriod.value && currentPeriod.value.startStr){
    loading.value='tasks';

    delay.value = setTimeout(async () => {
      try {
        const coloredTasks = await fetchTasks( currentPeriod.value, asideParams.value);
        const calendarApi = fullCalendar.value.getApi();
        calendarApi.removeAllEvents(); // Удаляем старые события
        calendarApi.addEventSource(coloredTasks); // Добавляем новые события

        loading.value = '';
      } catch {
        loading.value = '';
      }
    }, );

  }
}

const onParamsChange = (value) => {
  asideParams.value = value;
  fetchEvents();
};

async function updateEvent() {
  let taskToUpdate = newEvent.value;
  // taskToUpdate.performer = taskToUpdate.performer ? typeof taskToUpdate.performer === 'object' ? newEvent.value.performer.id : newEvent.value.performer : null
  // taskToUpdate.duration = newEvent.value.customData.duration
  // taskToUpdate.allDay = taskToUpdate.duration === 1440
  // taskToUpdate.end = new Date(taskToUpdate.start.getTime() + taskToUpdate.duration * 60 * 1000);

  // taskToUpdate = Object.fromEntries(
  //   Object.entries(taskToUpdate).filter(([key]) => key !== 'customData')
  // );

  const response = await updateTask(taskToUpdate);
  if (response && response.success) {
    fetchEvents();
    newEvent.value = {};
    taskDialogRef && taskDialogRef.close();
  }
  else {
    taskDialogRef && taskDialogRef.options.onError(response.errors);
  }
  // await axios.put(`/tasks/${taskToUpdate.id}`, taskToUpdate)
  //   .then(
  //     () => {
  //       fetchEvents();
  //       newEvent.value = {};
  //       taskDialogRef && taskDialogRef.close();
  //     },
  //     (error) => {
  //       console.log(error);
  //       taskDialogRef && taskDialogRef.options.onError(error.response.data.errors);
  //     });
}

// function onSubmit(eventData) {
//     getEventFromDialog(eventData);
// }

function handleEventClick(info) {
    // Выводим диалоговое окно с информацией о событии
    activeTask.value = info.event;
    if (activeTask.value._def.title === 'null') activeTask.value._def.title = '';
    // info берет из календаря дату, которая уже в timezone пользователя, но считает, что зона там нулевая
    // и ещё раз добавляет ей разницу во времени, поэтому делаем обратную операцию
    let dateStart = changeTimeZone(info.event._instance.range.start, 'UTC');
    let dateEnd = changeTimeZone(info.event._instance.range.end, 'UTC');
    taskDialogRef = dialog.open(TaskFull, {
        props: {
            draggable: false,
            showHeader: false,
            modal: true,
            pt: ptDialogTask,
            appendTo: document.querySelector('main')
        },
        data: {
            ...activeTask.value.extendedProps,
            id: activeTask.value._def.publicId,
            title: activeTask.value.title,
            allDay: activeTask.value.allDay,
            performer: activeTask.value._def?.extendedProps?.performer ? activeTask.value._def.extendedProps.performer.id : null,
            duration: activeTask.value._def?.extendedProps?.customData?.duration,
            start: dateStart,
            end: dateEnd,
            users: usersList.value.data,
            types: types,
            mode: 'update',
            errors: ref({}),
            timeZone: calendarOptions.value.timeZone
        },
        errors: ref({}),
        onSubmit: async (eventData) => {
            // getEventFromDialog(eventData);
            // await updateEvent();
            let response = await tasksStore.updateTask(eventData);
            if (response && response.success) {
              fetchEvents();
              newEvent.value = {};
              taskDialogRef && taskDialogRef.close();
            }
            else {
              taskDialogRef && taskDialogRef.options.onError(response.errors);
            }            
            return taskDialogRef.data.errors.value;
        },
        onError: (errors) => {
            taskDialogRef.data.errors.value = errors;
        },
        onClose: (opt) => {
            if (opt.type !== 'dialog-close') {
            } else {
                newEvent.value = {};
            }
        },
    });
}

// function handleDateClick(slot) {
//     // Открытие диалогового окна для добавления новой задачи в выбранное время
//     selectedSlot.value = slot;
//     let dateStart = changeTimeZone(selectedSlot.value.date, 'UTC');
//     taskDialogRef = dialog.open(TaskFull, {
//         props: {
//             showHeader: false,
//             draggable: true,
//             modal: true,
//             appendTo: '.main',
//             pt: ptDialog,
//             appendTo: document.querySelector('main')
//         },
//         data: {
//             users: props.users,
//             start: dateStart,
//             performer: props.auth.user.id ,
//             allDay: false,
//             types: types,
//             mode: 'create',
//             errors: ref({}),
//             timeZone: calendarOptions.value.timeZone
//         },
//
//         onClose: (opt) => {
//             if (opt.type != 'dialog-close') {
//                 fetchEvents();
//             }
//             else {
//                 newEvent.value = {};
//             }
//         }
//     });
// };

// function getEventFromDialog(eventData) {
//     Object.assign(newEvent.value, eventData);
//     newEvent.value.created_by = newEvent.value.created_by ? newEvent.value.created_by : currentUser.value.id;
//     newEvent.value.allDay = newEvent.value.duration === 1440;
// }

function updateEventDnd(info) {
    activeTask.value = info.event;
    // info берет из календаря дату, которая уже в timezone пользователя, но считает, что зона там нулевая
    // и ещё раз добавляет ей разницу во времени, поэтому делаем обратную операцию - не нужно при timeZone='UTC'
    // let dateStart = changeTimeZone(info.event._instance.range.start,'UTC');
    // let dateEnd = changeTimeZone(info.event._instance.range.end,'UTC');
    newEvent.value = {
        ...activeTask.value.extendedProps,
        id: activeTask.value._def.publicId,
        title: activeTask.value.title,
        // start: info.event.allDay ? new Intl.DateTimeFormat('default').format(info.event._instance.range.start) : info.event._instance.range.start,
        start: info.event._instance.range.start,
        end: info.event.allDay ? null : info.event._instance.range.end,
        allDay: info.event.allDay
    }
    updateEvent();
}

function changeTimeZone(date, timeZone) {
    return new Date(date.toLocaleString('en-US', { timeZone }));
}

const handleResize = debounce(() => {
  const calendarApi = fullCalendar.value?.getApi();
  calendarApi?.updateSize(); // Обновляем размер FullCalendar
}, 10);

const usersList = ref([])
const resizeObserver = ref(null)

onMounted(async () => {
  loading.value = '';
  if (sectionRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      handleResize(); // Вызываем обновление размера при изменении секции
    });

    resizeObserver.value.observe(sectionRef.value); // Наблюдаем за секцией
  }
  const responseLists = await getListsData();
      if (responseLists) {
        types = responseLists.tasks.types;
  }   
  setTimeout(async () => {
    usersList.value = await fetchUsers();
  })

  Echo.join('tasks')
  .listen("Task.Created", (e) => {
    addTaskToCalendar(e.task);
  })
  .listen("Task.Updated", (e) => {
    const calendarApi = fullCalendar.value?.getApi();
    let events = calendarApi.getEvents();
    let index = events.find(event => {
      return event._def.publicId == e.task.id
    });

    if (!index) {
      let check = checkFilters(e.task);
      if (check) {
        addTaskToCalendar(e.task);
      }
    } else {
      let check = checkFilters(e.task);
      if (check) {
        updateTaskInCalendar(e.task);
      }
      else {
        fetchEvents();
      }
    }
  })


});

// Удаляем наблюдатель
onUnmounted(() => {
  if (sectionRef.value) {
    if(resizeObserver.value) resizeObserver.value.unobserve(sectionRef.value);
  }
  Echo.leave('tasks'); // Отключаемся от канала

});


const addTaskToCalendar = (task) => {
  const calendarApi = fullCalendar.value?.getApi();
  const check = checkFilters(task);
  let newTask = {...task};
  if (check) {
    newTask.borderColor = 'transparent';
    newTask.backgroundColor = TASK_OPTIONS.colors[newTask.type];
    newTask.extendedProps = { customData: {duration: newTask.duration}};
    if (isOverdue({
        start: newTask.start,
        end: newTask.end,
        duration: newTask.duration * 60,
    })) {
      newTask.borderColor = '#ff0000';
    }      
    if (newTask.all_day) {
      newTask.allDay = true;
    }      
    calendarApi.addEvent(newTask);
  }
}

const updateTaskInCalendar = (task) => {

  const newTask = { ...task };

  const calendarApi = fullCalendar.value?.getApi();

  // let events = calendarApi.getEvents();
  // // console.log('[task index] test All events', events);
  // let index = events.find(event => {
  //   return event._def.publicId == task.id
  // });

  // if (!index) {
  //   const check = checkFilters(task,{});
  //   console.log('[task index] updateFromSocket check',check);
  //   if (check) {
  //     calendarApi.addEvent(newTask);
  //   }
  //   return;
  // }

  let event = calendarApi.getEventById(newTask.id);
  if (!event) return;

  event.setProp('title', newTask.title);
  event.setExtendedProp('type', newTask.type);
  event.setProp('backgroundColor', TASK_OPTIONS.colors[newTask.type]);
  event.setExtendedProp('status', newTask.status);
  event.setExtendedProp('completed', newTask.completed);
  event.setExtendedProp('status', newTask.status);
  event.setExtendedProp('performer', newTask.performer);
  event.setExtendedProp('author', newTask.author);

  // type, status, completed, performed  - объект или id, start, end, duration, all_day, title

  newTask.start = parseISOStrict(newTask.start);

  if (newTask.all_day) {
    newTask.start = new Date(newTask.start.setHours(9, 0, 0));
    newTask.duration = 24 * 60;
    event.setExtendedProp('all_day', true);
  }
  event.setExtendedProp('customData', { duration: newTask.duration });

  newTask.end = new Date(new Date(newTask.start).getTime() + newTask.duration * 60 * 1000);

  event.setDates(createDateAsUTC(newTask.start), createDateAsUTC(newTask.end), { allDay: newTask.all_day });


  if (isOverdue({
    start: newTask.start,
    end: newTask.end,
    duration: newTask.duration * 60,
  })) {
    event.setProp('borderColor', '#ff0000');
  }
  else {
    event.setProp('borderColor', 'transparent');
  }
}

const checkFilters = (task) => {

  if (!asideParams.value) {
    return;
  }

  if (asideParams.value && asideParams.value.type && asideParams.value.type.length > 0) {
    let result = asideParams.value.type.some(item => item.code == task.type);
    if (!result) {
      return false;
    }
  }

  if (asideParams.value.performer && asideParams.value.performer.length > 0) {
    let result = asideParams.value.performer.some(item => item.code == task.performer.id);
    if (!result) {
      return false;
    }
  }  

  if (asideParams.value.author && asideParams.value.author.length > 0) {
    let result = asideParams.value.author.some(item => item.code == task.author);
    if (!result) {
      return false;
    }
  }    

  if (asideParams.value.completed && !task.completed) {
    return false;
  }

  if (asideParams.value.overdueOnly) {
    if (!isOverdue({
      start: task.start,
      end: task.end,
      duration: task.duration * 60,
    })) {
      return false;
    }
  }

  if (asideParams.value.stages && asideParams.value.stages.length > 0) {
    let result = asideParams.value.stages.some(stage => task.deal.stages.includes(stage));
    if (!result) {
      return false;
    }
  }    

  return true;
}

definePageMeta({
  permission: 'Task.view',
});

</script>

<template>

<authenticated-layout :loading="loading" :component="deal">
    <template #aside>
      <div class="w-[316px] h-full">
        <TasksAside @change-params="onParamsChange" ref="tasksaside" />
      </div>
    </template>
    <section ref="sectionRef" class="section h-full p-[10px] pb-0">
        <MyFullCalendar :options="calendarOptions" ref="fullCalendar">
        </MyFullCalendar>
      <div v-show="loading" class="absolute top-1/2 right-1/2 -translate-y-1/2">
        <ProgressSpinner/>
      </div>
    </section>
</authenticated-layout>
</template>


<style>
  :root {
    --fc-event-text-color: var(--p-primary-950);
  }

  .fc-event {
    padding: 1px;
    cursor: pointer;
  }

  .fc-timegrid-event .fc-event-main {
    padding: 0;
  }  
</style>