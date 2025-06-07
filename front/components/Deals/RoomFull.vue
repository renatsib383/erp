<script setup>
import SmetWorks from "~/components/Deals/SmetWorks.vue";
import {createRoom, updateRoom} from "~/services/api/deals-services/roomServices.js";
import {setOtherRoomsNewParams} from "~/utils/rooms-utils.js";
import ptFieldsetDealModal from "assets/presets/custom/fieldsetDealModal.js";
const {$showErrorToast} = useNuxtApp();

const props = defineProps({
  room: {
    type: Object,
    default: () => {}
  },
  selectedWorks: {
    type: Object,
    default: () => {}
  },
  worksList: {
    type: Array,
    default: () => [],
  },
  group: {
    type: Object,
    default: () => {},
  },
  category: {
    type: Array,
    default: () => [],
  },
  worksCollectionData: {
    type: Array,
    default: () => [],
  },
  disableEdit: Boolean,
  roomSettings: {
    type: Array,
    default: () => [],
  },
  factorList: {
    type: Array,
    default: () => [],
  },
  allRoomsList: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits([
  "close-window",
  "new-room",
  "selectedWorksChanged",
  "room-changed",
  "update-rooms"
]);
const store = useMainStore()

const roomOriginal = ref({});
const room = ref({});
roomOriginal.value = JSON.parse(JSON.stringify(props.room));
room.value = JSON.parse(JSON.stringify(roomOriginal.value))
const emptyField = ref({});
const roomTypeOptions = props.roomSettings.types.map((type, index) => {
  return {
    label: type,
    value: index+1,
  };
})
const columnTypes = props.roomSettings.columns.map((type, index) => {
  return {
    label: type,
    value: index,
  };
})

const curRoomWorksForSmet = ref({})

onMounted(() => {
  setRoom()
});

watch(room, (newValue) => {
  const updatedRoom = JSON.parse(JSON.stringify(newValue));
  debouncedSetNewParams(updatedRoom);
}, { deep: true });

watch(() => props.room,  (newValue) => {
  if(newValue){
    const roomChanged = !deepEqual(room.value, newValue)
    if(roomChanged){
      console.log("Room new state from props")
      roomOriginal.value = JSON.parse(JSON.stringify(newValue));
      room.value = JSON.parse(JSON.stringify(roomOriginal.value));
    }
  }
  setTimeout(() => emit("room-changed", false, 'watch(() => props.room'), )
}, {deep: true});

const setRoom = () => {
  setTimeout(() => {
    worksCollectionData.value = props.worksCollectionData ? props.worksCollectionData : [];
    setOfWorks.value = worksCollectionData.value.filter((item) => {
      return item.room_type === props.room.room_type_id - 1
    });

    category.value = props.category
    filteredCategory.value = category.value.length
    ? category.value.filter((category) => {
        if(props.room.room_type_id - 1 > 4){
          return category
        } else{
          return category.room_types ? category.room_types.includes(props.room.room_type_id - 1) : null;
        }
      })
    : []
  }, 0);
  setTimeout(() => emit("room-changed", false, 'setRoom'))
}

const setNewParams = async (updatedRoom) => {
  if (updatedRoom.room_type_id) {
    if((updatedRoom.room_type_id === 3 || updatedRoom.room_type_id === 4) && (!updatedRoom.name.length || updatedRoom.name === 'Электрика' || updatedRoom.name === 'Сантехника') ) {
      updatedRoom.name = roomTypeOptions.find(i => i.value === updatedRoom.room_type_id).label
    }
    if(updatedRoom.room_type_id !== 1) {
      // Для всех типов кроме общестроя ставим кастом
      updatedRoom.room_size.shape = 'custom'
      updatedRoom.room_size.s = 0;
      updatedRoom.room_size.s_walls = 0;
      updatedRoom.room_size.p = 0;
      updatedRoom.room_size.h = 0;
      // И унаследуем параметры комнат с типом общестроя
      props.allRoomsList?.forEach(i => {
        if(i.room_type_id === 1 && i.involved && i.id !== updatedRoom.id){
          updatedRoom.room_size.s += i.s_floor ? Number(i.s_floor) : 0;
          updatedRoom.room_size.s_walls += i.s_walls ? Number(i.s_walls) : 0;
          updatedRoom.room_size.p += i.perimeter ? Number(i.perimeter) : 0;
          updatedRoom.room_size.h += i.height ? Number(i.height) : 0;
        }

      })
    }
  }

  // площадь окон
  let windowsArea = 0;
  if (updatedRoom.windows) {
    updatedRoom.windows.forEach((window) => {
      windowsArea += window.value * (window.height * window.width)
    });}

  // площадь дверей
  let doorsArea = 0;
  if (updatedRoom.doors) {
    updatedRoom.doors.forEach((door) => {
      doorsArea += door.value * (door.height * door.width);
    });}

  // площадь проемов
  const s_holes = doorsArea + windowsArea;
  updatedRoom.s_holes = Math.round(s_holes * 100) / 100;

  // откосы дверей
  let slopesDoors = 0;
  if (updatedRoom.doors) {
    updatedRoom.doors.forEach((door) => {
      slopesDoors += door.value * (2 * (door.height + door.width));
    });
  }
  updatedRoom.slopes_doors = Math.round(slopesDoors * 100) / 100; // Для округления до 2 знаков после точки

  // откосы окон
  let slopesWindows = 0;
  if (updatedRoom.windows) {
    updatedRoom.windows.forEach((window) => {
      slopesWindows += window.value * ((2 * window.height) + (2 * window.width));
    });
  }
  updatedRoom.slopes_windows = Math.round(slopesWindows * 100) / 100;

  // Общая ширина дверей
  let doorsWidth = 0;
  if (updatedRoom.doors) {
    updatedRoom.doors.forEach((door) => {
      doorsWidth += (door.value * door.width);
    });
  }
  updatedRoom.doors_width = Math.round(doorsWidth * 100) / 100

  // Рассчет параметров комнаты на основе её формы
  if (updatedRoom.room_size) {
    updatedRoom.height = Math.round(updatedRoom.room_size.h * 100) / 100;

    if (updatedRoom.room_size.shape === 'rectangle') {
      updatedRoom.perimeter = Math.round((2 * (updatedRoom.room_size.a + updatedRoom.room_size.b) + (updatedRoom.room_size.p_columns || 0)) * 100) / 100;
      const sFloor = Math.round((updatedRoom.room_size.a * updatedRoom.room_size.b - (updatedRoom.room_size.s_columns || 0)) * 100) / 100;
      updatedRoom.s_floor = sFloor > 0 ? sFloor : 0;
      updatedRoom.s_walls = Math.round((updatedRoom.perimeter * updatedRoom.room_size.h) * 100) / 100;
      updatedRoom.room_size.inner_corner = 4 + updatedRoom.room_size.projectionsCornerInner;
      updatedRoom.room_size.outer_corner = updatedRoom.room_size.projectionsCorner || 0;
    }
    else if (updatedRoom.room_size.shape === 'l_shape') {
      updatedRoom.perimeter = Math.round((updatedRoom.room_size.a + updatedRoom.room_size.b + updatedRoom.room_size.c + updatedRoom.room_size.d + (updatedRoom.room_size.c + updatedRoom.room_size.a) + (updatedRoom.room_size.b + updatedRoom.room_size.d) + (updatedRoom.room_size.p_columns || 0)) * 100) / 100;
      const sFloor = Math.round(((updatedRoom.room_size.a + updatedRoom.room_size.c) * (updatedRoom.room_size.b + updatedRoom.room_size.d) - (updatedRoom.room_size.c * updatedRoom.room_size.b) - (updatedRoom.room_size.s_columns || 0)) * 100) / 100;
      updatedRoom.s_floor = sFloor > 0 ? sFloor : 0;
      updatedRoom.s_walls = Math.round((updatedRoom.perimeter * updatedRoom.room_size.h) * 100) / 100;
      updatedRoom.room_size.inner_corner = 5 + updatedRoom.room_size.projectionsCornerInner;
      updatedRoom.room_size.outer_corner = 1 + updatedRoom.room_size.projectionsCorner;
    }
    else if (updatedRoom.room_size.shape === 'trapezoid') {
      updatedRoom.perimeter = Math.round(((updatedRoom.room_size.a * 2) + (updatedRoom.room_size.b * 2) + updatedRoom.room_size.c + updatedRoom.room_size.d + (updatedRoom.room_size.p_columns || 0)) * 100) / 100;
      const sFloor = Math.round(((updatedRoom.room_size.a * updatedRoom.room_size.d) + ((updatedRoom.room_size.c + updatedRoom.room_size.d) / 2 * Math.sqrt(Math.pow(updatedRoom.room_size.b, 2) - Math.pow((updatedRoom.room_size.d - updatedRoom.room_size.c), 2) / 4)) - (updatedRoom.room_size.s_columns || 0)) * 100) / 100;
      updatedRoom.s_floor = sFloor > 0 ? sFloor : 0;
      updatedRoom.s_walls = Math.round((updatedRoom.perimeter * updatedRoom.room_size.h) * 100) / 100;
      updatedRoom.room_size.inner_corner = 6 + updatedRoom.room_size.projectionsCornerInner;
      updatedRoom.room_size.outer_corner = updatedRoom.room_size.projectionsCorner || 0;
    }
    else if (updatedRoom.room_size.shape === 'custom') {
      updatedRoom.perimeter = Math.round((updatedRoom.room_size.p + (updatedRoom.room_size.p_columns || 0)) * 100) / 100;
      const sFloor = Math.round((updatedRoom.room_size.s - (updatedRoom.room_size.s_columns || 0)) * 100) / 100;
      updatedRoom.s_floor = sFloor > 0 ? sFloor : 0;
      updatedRoom.s_walls = Math.round((updatedRoom.room_size.s_walls) * 100) / 100;
      updatedRoom.room_size.inner_corner = 4 + updatedRoom.room_size.projectionsCornerInner;
      updatedRoom.room_size.outer_corner = updatedRoom.room_size.projectionsCorner || 0;
    }
  }

  // Периметр пола
  const pFloor = Math.round((updatedRoom.perimeter - updatedRoom.doors_width) * 100) / 100;
  updatedRoom.p_floor = pFloor > 0 ? pFloor : 0;

  // Обработка колонн
  if (updatedRoom.columns) {
    let s_columns = 0;
    let columnPerimeter = 0;
    let projectionsCorner = 0; // Количество внешних углов у столба
    let projectionsCornerInner = 0; // Количество внутренних углов у стола

    updatedRoom.columns.forEach((item) => {
      const area = item.a * item.b;
      s_columns += area;

      if (item.type === 0) {
        projectionsCorner += 1;
        projectionsCornerInner += 1;
      } else if (item.type === 1) {
        projectionsCorner += 2;
        projectionsCornerInner += 2;
        columnPerimeter += (item.a + item.b);
      } else if (item.type === 2) {
        projectionsCorner += 4;
        columnPerimeter += 2 * (item.a + item.b);
      }
    });

    updatedRoom.room_size = {
      ...updatedRoom.room_size,
      projectionsCorner,
      projectionsCornerInner,
      p_columns: columnPerimeter,
      s_columns,
    };
    updatedRoom.s_walls = Math.round((updatedRoom.perimeter * updatedRoom.room_size.h) * 100) / 100;
  }

  // Сравнение с предыдущим состоянием
  if (JSON.stringify(updatedRoom) !== JSON.stringify(room.value)) {
    room.value = updatedRoom;
  }

  // Обработка типа комнаты и установка соответствующих наборов работ
  if (updatedRoom.room_type_id) {
    setOfWorks.value = worksCollectionData.value.filter(
      (item) => item.room_type === updatedRoom.room_type_id - 1
    );
    filteredCategory.value = category.value.length
        ? category.value.filter((category) => {
          if(updatedRoom.room_type_id > 4){
            return category
          } else{
            return category.room_types ? category.room_types.includes(updatedRoom.room_type_id - 1) : null
          }
        })
        : []
  }

  // Кнопка сохранить
  if(deepEqual(roomOriginal.value, room.value)) {
    emit("room-changed", true, 'setNewParams');
  } else {
    emit("room-changed", false, 'setNewParams');
  }

}

const debouncedSetNewParams = debounce((roomData) => {
  setNewParams(roomData);
}, 1000);

const notEmptyList = (name, elements) => {
  if (
    !Array.isArray(elements) ||
    !elements.length ||
    elements === null ||
    elements === ""
  ) {
    return [];
  }
  return elements;
};

const saveNewRoomState = async () => {
  // Проверяем все ли поля заполнены
  emptyField.value = {};

  if(!room.value.name){
    emptyField.value.name = true;
  }
  if(!room.value.room_type_id){
    emptyField.value.type = true;
  }
  if(!room.value.room_size.shape){
    emptyField.value.shape = true;
  }
  if(!room.value.s_walls || !room.value.height || !room.value.s_floor){
    emptyField.value.sizing = true;
  }

  if (Object.keys(emptyField.value).length === 0) {
    store.showModalLoader()
    // Создаем еще копию room.value для преобразования в json
    const roomToSend = JSON.parse(JSON.stringify(room.value));

    if (roomToSend.id) {
      const response = await updateRoom(roomToSend)
      if(response.success){
        emit("selectedWorksChanged", { selectedWorks: JSON.parse(JSON.stringify(curRoomWorksForSmet.value)) }); // Также сразу обновляю работы существующей комнаты

        for (const [key, value] of Object.entries(response.data)) {
          roomOriginal.value[key] = value
          room.value[key] = value
        }
        // Если только обновленная комната была "Общестрой" и изменились параметры комнаты, тогда обновляем и сохраняем параметры других комнат других типов
        setTimeout(() => {
          emit("room-changed", false, 'saveNewRoomState');
          setTimeout(() => {
            if(roomToSend.room_type_id === 1){
              const roomParameters = [
                "s_floor",
                "s_walls",
                "perimeter",
                "height",
              ];
              const differences = roomParameters.filter(field => Number(roomToSend[field]) !== Number(roomOriginal.value[field]));
              if (differences.length > 0) {
                updateOtherRoomsParams()
              }
            }
          }, 300)
        })
      }
      store.hideModalLoader()

    }
    else if (!roomToSend.id) {
      // Если у него нет id, значит это на создание
      const response = await createRoom(roomToSend)
      if(response.success){
        for (const [key, value] of Object.entries(response.data)) {
          roomOriginal.value[key] = value
          room.value[key] = value
        }

        setTimeout(() => {
          const curRoomWorksForSmet = {
            [response.data.id]: {
              works: roomWithoutIdSelectedWorks.value,
              total: total.value,
            },
          };
          // Здесь я сразу создаю комнату и сохраняю работы для этой комнаты в смете
          emit("update-rooms", response.data, {selectedWorks: curRoomWorksForSmet});
          setTimeout(() => {
            emit("room-changed", false, 'saveNewRoomState');
            // emit("close-window");

            // Если только созданная комната была "Общестрой", тогда обновляем и сохраняем параметры других комнат других типов
            if(response.data?.room_type_id === 1){
              updateOtherRoomsParams()
            }
          }, 0);
        },0)
      }
      store.hideModalLoader()
    }
  }
  else {
    const emptyFileds = Object.keys(emptyField.value)
    showEmptyField(emptyFileds[0])
  }
};

const addNewWindowDoor = (type) => {
  if (type === "window") {
    room.value.windows.push({
      value: 1,
      height: 1.4,
      width: 1.3,
      depth: 0.1,
    });
  }
  else if (type === "door") {
    room.value.doors.push({
      value: 1,
      height: 2,
      width: 0.8,
    });
  }
  else if(type === "column"){
    room.value.columns.push({
      type: 0,
      a: 0.5,
      b: 0.3,
    })
  }

};

const deleteWindow = (window) => {
  room.value.windows = room.value.windows.filter((item) => item !== window);
};
const deleteDoor = (door) => {
  room.value.doors = room.value.doors.filter((item) => item !== door);
};
const deleteColumn = (column) => {
  room.value.columns = room.value.columns.filter((item) => item !== column);
}

const updateOtherRoomsParams = () => {
  props.allRoomsList.forEach((room) => {
    if(room.room_type_id !== 1 && room.involved){
      setOtherRoomsNewParams(room, props.allRoomsList)
    }
  })
  // setTimeout(() => $showSuccessToast("Комнаты с другим типом унаследовали новые параметры"))
}

const worksCollectionData = ref(); // Сухие наборы
const setOfWorks = ref(); // Отфильрованные наборы под тип комнаты
const worksData = ref(props.worksList); // Список работ
const group = ref(props.group);
const category = ref()
const filteredCategory = ref([]);

const total = ref(0);
// Здесь выбранные работы для текущей комнаты, которая еще не успела сохраниться и получить ИД
const roomWithoutIdSelectedWorks = ref({});

const showWorksList = ref(false)

const setTotal = (data) => {
  total.value = data.total;
};

const selectedWorksChanged = (data) => {
  if (room.value && room.value.id) {
    if(JSON.stringify(props.selectedWorks.works) === JSON.stringify(data.selectedWorks)) return;

    curRoomWorksForSmet.value = {
      [room.value.id]: { works: data.selectedWorks, total: data.total, handEdited: data.handEdited},
    }; // Используем квадратные скобки для динамического ключа
    emit("room-changed", true, 'selectedWorksChanged')
  } else if (!room.value.id) {
    roomWithoutIdSelectedWorks.value = data.selectedWorks;
  }
};

// Уведомления
const showEmptyField = (emptyField) => {
  const fields = {
    name: '"Название"',
    type: '"Тип комнаты"',
    shape: '"Форма"',
    sizing: '"Параметры комнаты"'
  }
  $showErrorToast(`Заполните поле ${fields[emptyField]}`)
};

defineExpose({
  saveNewRoomState,
});

</script>

<template>
  <section
    class="grid lg:grid-cols-[0.35fr_0.65fr] gap-2 relative bg-modal-body-bg select-none max-sm:overflow-y-scroll"
  >
    <!-- max-lg:h-[calc(100vh-122px)] -->
    <main
      class="flex flex-col bg-white dark:bg-modal-panel-bg max-sm:p-0 relative h-full home w-full overflow-y-auto overflow-x-hidden"
      :class="{'max-lg:hidden': showWorksList}"
    >
      <Fieldset
          legend="Основная информация"
          :pt="ptFieldsetDealModal"
          :ptOptions="ptFieldsetOptions"
      >
        <!--          <h2 class="font-bold">Основная информация</h2>-->
        <div class="grid lg:grid-cols-2 gap-2">
          <ifta-label>
            <label class="text-sm text-surface-400">Объект</label>
            <InputNumber v-model="room.deal_id" disabled class="w-full"/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">Название комнаты</label>
            <InputText v-model="room.name" :invalid="emptyField.name"  :disabled="disableEdit" />
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">Тип комнаты</label>
            <Dropdown
                v-model="room.room_type_id"
                :options="roomTypeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Выберите тип"
                class="w-full"
                :disabled="disableEdit"
            />
          </ifta-label>
          <div v-if="room.room_size && room.room_type_id === 1" class="flex flex-col gap-2">
            <ifta-label>
              <label class="text-sm text-surface-400">Форма</label>
              <Dropdown
                  v-model="room.room_size.shape"
                  :options="[{ label: 'Прямоугольная', value: 'rectangle' }, { label: 'Г-образное', value: 'l_shape' }, { label: 'Эркер-трапеция', value: 'trapezoid' }, { label: 'Произвольная', value: 'custom' }]"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Выберите форму"
                  class="w-full"
                  :disabled="disableEdit"
              />
            </ifta-label>
          </div>
        </div>

        <div v-if="room.room_type_id === 1 && room.room_size && room.room_size.shape" class="grid grid-cols-2 gap-4 py-4">

          <div class="flex items-center justify-center h-full !fill-surface-200">
            <div class="h-48">
              <img v-show="room.room_size.shape === 'rectangle'" class="h-full" src="/images/room_type/rectangle.svg" alt="rectangle">
              <img v-show="room.room_size.shape === 'trapezoid'" class="h-full scale-110" src="/images/room_type/trapezoid.svg" alt="trapezoid">
              <img v-show="room.room_size.shape === 'l_shape'" class="h-full" src="/images/room_type/l_shape.svg" alt="l_shape">
              <img v-show="room.room_size.shape === 'custom'" class="h-full" src="/images/room_type/custom.svg" alt="custom">
            </div>
          </div>

            <div class="flex flex-col gap-2" :class="{'border-[1px] border-red-400 rounded-lg p-1': emptyField.sizing}" >
              <div class="flex flex-col" v-show="room.room_size.shape !== 'custom'">
                <label class="text-sm px-2 font-semibold">A</label>
                <input v-model="room.room_size.a" @input="room.room_size.a = Math.max(0, room.room_size.a)" type="number" class="w-full custom-input" :disabled="disableEdit"/>
                <!--Отрицательное заменяю на 0-->
              </div>
              <div class="flex flex-col" v-show="room.room_size.shape !== 'custom'">
                <label class="text-sm px-2 font-semibold">B</label>
                <input v-model="room.room_size.b" @input="room.room_size.b = Math.max(0, room.room_size.b)" type="number" class="w-full custom-input" :disabled="disableEdit" />
              </div>
              <div class="flex flex-col" v-show="room.room_size.shape === 'l_shape' || room.room_size.shape === 'trapezoid'" >
                <label class="text-sm px-2 font-semibold">C</label>
                <input v-model="room.room_size.c" @input="room.room_size.c = Math.max(0, room.room_size.c)" type="number" class="w-full custom-input" :disabled="disableEdit" />
              </div>
              <div class="flex flex-col" v-show="room.room_size.shape === 'l_shape' || room.room_size.shape === 'trapezoid'" >
                <label class="text-sm px-2 font-semibold">D</label>
                <input v-model="room.room_size.d"  @input="room.room_size.d = Math.max(0, room.room_size.d)" type="number" class="w-full custom-input" :disabled="disableEdit"/>
              </div>
              <div class="flex flex-col" v-show="room.room_size.shape === 'custom'" >
                <label class="text-sm px-2 font-semibold">S</label>
                <input v-model="room.room_size.s" @input="room.room_size.s = Math.max(0, room.room_size.s)" type="number" class="w-full custom-input" :disabled="disableEdit"/>
              </div>
              <div class="flex flex-col" v-show="room.room_size.shape === 'custom'" >
                <label class="text-sm px-2 font-semibold">P</label>
                <input v-model="room.room_size.p" @input="room.room_size.p = Math.max(0, room.room_size.p)" type="number" class="w-full custom-input" :disabled="disableEdit"/>
              </div>
              <div class="flex flex-col" v-show="room.room_size.shape === 'custom'" >
                <label class="text-sm px-2 font-semibold">S-стен</label>
                <input v-model="room.room_size.s_walls" @input="room.room_size.s_walls = Math.max(0, room.room_size.s_walls)" type="number" class="w-full custom-input" :disabled="disableEdit"/>
              </div>
              <div class="flex flex-col">
                <label class="text-sm px-2 font-semibold">Высота</label>
                <input v-model="room.room_size.h" @input="room.room_size.h = Math.max(0, room.room_size.h)" type="number" class="w-full custom-input" :disabled="disableEdit"/>
              </div>
            </div>
          </div>
      </Fieldset>

      <Fieldset
          v-if="room.room_type_id === 1"
          legend="Двери"
          :pt="ptFieldsetDealModal"
          :ptOptions="ptFieldsetOptions"
      >
        <!-- Название столбцов -->
        <div
            class="grid grid-cols-[1fr_1fr_1fr_0.2fr] gap-2 bg-surface-300 py-2 text-surface-600 font-semibold">
          <div class="flex gap-1 items-center justify-center">
            <span class="pi pi-fw pi-calculator"></span>
            <label>Кол-во</label>
          </div>
          <div class="flex gap-1 items-center justify-center">
            <span class="pi pi-fw pi-inbox"></span>
            <label>Высота</label>
          </div>
          <div class="flex gap-1 items-center justify-center">
            <span class="pi pi-fw pi-inbox"></span>
            <label>Ширина</label>
          </div>
        </div>
        <!-- Существующие строки -->
        <div
            class="grid grid-cols-[1fr_1fr_1fr_0.1fr] gap-1 p-[2px]"
            v-for="item in notEmptyList('doors', room.doors)"
        >
          <input
              v-model="item.value"
              @input="item.value = Math.max(0, item.value)"
              type="number"
              class="w-full small-input"
              :disabled="disableEdit"
          />
          <input
              v-model="item.height"
              @input="item.height = Math.max(0, item.height)"
              type="number"
              class="w-full small-input"
              :disabled="disableEdit"
          />
          <input
              v-model="item.width"
              @input="item.width = Math.max(0, item.width)"
              type="number"
              class="w-full small-input"
              :disabled="disableEdit"
          />
            <button @click="deleteDoor(item)" class="flex items-center justify-center" :disabled="room.doors.length === 1">
              <i class="pi pi-times-circle text-2xl text-surface-300 rounded-sm cursor-pointer" :class="{'hover:!text-red-500':room.doors.length > 1}"/>
            </button>
        </div>

        <div
            class="flex items-center justify-center h-10 pt-[1px]"
        >
          <button
              @click="addNewWindowDoor('door')"
              class="button-modal bg-surface-300 w-full h-full rounded-none"
              :disabled="disableEdit"
          >
            Добавить дверь
          </button>
        </div>
      </Fieldset>

      <Fieldset
          v-if="room.room_type_id === 1"
          legend="Окна"
          :pt="ptFieldsetDealModal"
          :ptOptions="ptFieldsetOptions"
      >
        <!-- Название столбцов -->
        <div
            class="grid grid-cols-[1fr_1fr_1fr_1fr_0.2fr] gap-2 bg-surface-300 py-2 text-surface-600 font-semibold">
          <div class="flex gap-1 items-center justify-center">
            <label>Кол-во</label>
          </div>
          <div class="flex gap-1 items-center justify-center">
            <label>Высота</label>
          </div>
          <div class="flex gap-1 items-center justify-center">
            <label>Ширина</label>
          </div>
          <div class="flex gap-1 items-center justify-center">
            <label>Глубина</label>
          </div>
        </div>
        <!-- Существующие строки -->
        <div
            class="grid grid-cols-[1fr_1fr_1fr_1fr_0.1fr] gap-1 p-[2px]"
            v-for="item in notEmptyList('windows', room.windows)"
        >
          <input
              v-model="item.value"
              @input="item.value = Math.max(0, item.value)"
              type="number"
              class="w-full small-input"
              :disabled="disableEdit"
          />
          <input
              v-model="item.height"
              @input="item.height = Math.max(0, item.height)"
              type="number"
              class="w-full small-input"
              :disabled="disableEdit"
          />
          <input
              v-model="item.width"
              @input="item.width = Math.max(0, item.width)"
              type="number"
              class="w-full small-input"
              :disabled="disableEdit"
          />
          <input
              v-model="item.depth"
              @input="item.depth = Math.max(0, item.depth)"
              type="number"
              class="w-full small-input"
              :disabled="disableEdit"
          />

          <button @click="deleteWindow(item)" class="flex items-center justify-center" :disabled="disableEdit">
            <i class="pi pi-times-circle text-2xl text-surface-300 rounded-sm cursor-pointer hover:text-red-500"/>
          </button>
        </div>

        <div class="flex items-center justify-center h-10 pt-[1px]">
          <button @click="addNewWindowDoor('window')" :disabled="disableEdit"
                  class="button-modal w-full bg-surface-300 h-full rounded-none">
            Добавить окно
          </button>
        </div>
      </Fieldset>

      <Fieldset
          v-if="room.room_type_id === 1 && room.room_type_id !== 3"
          legend="Колонны"
          :pt="ptFieldsetDealModal"
          :ptOptions="ptFieldsetOptions"
      >
        <div class="grid grid-cols-2 gap-1 p-[2px]"
             v-for="column in notEmptyList('columns', room.columns)"
        >
          <div class="flex items-center justify-center">
            <img v-show="column.type === 2" src="/images/column_types/column.svg" alt="Колонна" class="h-36">
            <img v-show="column.type === 1" src="/images/column_types/projection.svg" alt="Выступ" class="h-36">
            <img v-show="column.type === 0" src="/images/column_types/external_corner.svg" alt="Внешний угол" class="h-36">
          </div>
          <div class="flex flex-col gap-1 text-surface-400 font-semibold">
            <ifta-label>
              <label>Тип</label>
              <Dropdown
                  v-model="column.type"
                  :options="columnTypes"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Выберите тип"
                  class="w-full font-normal"
                  :disabled="disableEdit"
              />
            </ifta-label>
            <ifta-label>
              <label class="p-1 pb-3">A</label>
              <input
                  v-model="column.a"
                  @input="column.a = Math.max(0, column.a)"
                  type="number"
                  class="w-full small-input font-normal text-black"
                  step="0.3"
                  :disabled="disableEdit"
              />
            </ifta-label>
            <ifta-label>
              <label class="p-1">B</label>
              <input
                  v-model="column.b"
                  @input="column.b = Math.max(0, column.b)"
                  type="number"
                  class="w-full small-input font-normal text-black"
                  step="0.3"
                  :disabled="disableEdit"
              />
            </ifta-label>
            <button @click="deleteColumn(column)" :disabled="disableEdit" class="bg-surface-300 text-surface-700 flex items-center justify-center py-1 w-full hover:text-red-500 gap-1">
              <i class="pi pi-times-circle"></i>
              <span>Удалить</span>
            </button>
          </div>
        </div>

        <div
            class="flex items-center justify-center h-10 border-surface-300 pt-[1px]"
        >
          <button
              @click="addNewWindowDoor('column')"
              class="button-modal w-full bg-surface-300 h-full rounded-none"
              :disabled="disableEdit"
          >
            Добавить колонну
          </button>
        </div>
      </Fieldset>

      <Fieldset
          legend="Итого"
          :pt="ptFieldsetDealModal"
          :ptOptions="ptFieldsetOptions"
      >
        <div class="grid lg:grid-cols-2 gap-2">
          <ifta-label>
            <label class="text-sm text-surface-400">S пола</label>
            <InputNumber v-model="room.s_floor" class="w-full" readonly/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">S стен</label>
            <InputNumber v-model="room.s_walls" class="w-full" readonly/>
          </ifta-label>
        </div>
        <div v-if="room.room_type_id === 1" class="mt-2 grid lg:grid-cols-2 gap-2">
          <ifta-label>
            <label class="text-sm text-surface-400">P потолка</label>
            <InputNumber v-model="room.perimeter" class="w-full" readonly/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">P пола</label>
            <InputNumber v-model="room.p_floor" class="w-full" readonly/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">Высота</label>
            <InputNumber v-model="room.height" class="w-full" readonly/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">Проёмы</label>
            <InputNumber v-model="room.s_holes" class="w-full" readonly/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">Откосы дверей</label>
            <InputNumber v-model="room.slopes_doors" class="w-full" readonly/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">Откосы окон</label>
            <InputNumber v-model="room.slopes_windows" class="w-full" readonly/>
          </ifta-label>
          <ifta-label>
            <label class="text-sm text-surface-400">Ширины дверей</label>
            <InputNumber v-model="room.doors_width" class="w-full" readonly/>
          </ifta-label>
          <ifta-label v-if="room.room_size">
            <label class="text-sm text-surface-400">Кол. внешних углов</label>
            <InputNumber v-model="room.room_size.outer_corner" class="w-full" readonly/>
          </ifta-label>
          <ifta-label v-if="room.room_size">
            <label class="text-sm text-surface-400">Кол. внутренних углов</label>
            <InputNumber v-model="room.room_size.inner_corner" class="w-full" readonly/>
          </ifta-label>

        </div>

        <div class="flex flex-col gap-1 mt-2">
          <div class="flex gap-1 items-center text-gray-400">
            <label class="text-sm text-surface-400">Общая сумма работ по комнате</label>
          </div>
          <p class="px-2">{{formatNumber(total) || 0}} руб.</p>
        </div>
      </Fieldset>

      <div @click="showWorksList = 'work'" class="w-full p-2 pb-4 text-center bg-slate-400 text-white lg:hidden cursor-pointer">Показать работы</div>
    </main>

    <main
      v-if="worksCollectionData && worksCollectionData.length"
      class="flex flex-col bg-white dark:bg-modal-panel-bg max-sm:p-0 relative overflow-hidden h-full"
      :class="{'max-lg:hidden': showWorksList !== 'work'}"
    >
        <div class="relative h-full overflow-hidden">
          <div @click="showWorksList = false" class="w-full py-2 text-center bg-slate-400 text-white lg:hidden cursor-pointer">Скрыть работы</div>
          <SmetWorks
            @total="setTotal"
            @selectedWorksChanged="selectedWorksChanged"
            :room="room"
            :worksFromSmet="selectedWorks"
            :setOfWorks="setOfWorks"
            :worksData="worksData"
            :group="group"
            :category="filteredCategory"
            :disableEdit="disableEdit"
            :factorList="factorList"
            class="pb-16 h-full"
          />
          <div
            class="sticky bottom-0 right-0 w-full bg-white  dark:bg-surface-600 flex justify-end"
          >
            <h2
              v-if="worksData.length"
              class="m-2 text-lg font-semibold text-slate-600 dark:text-surface-300"
            >
              Итого: {{ formatNumber(total) }}руб.
            </h2>
          </div>
        </div>

    </main>
  </section>
</template>

<style scoped>
.small-input {
  @apply border-surface-300 p-1 text-center focus:border-surface-300 focus:ring-surface-300 dark:bg-surface-950 dark:border-surface-600 dark:text-white;
}

.small-input::-webkit-outer-spin-button,
.small-input::-webkit-inner-spin-button {
  -webkit-appearance: auto !important;
  margin: 0;
}

.small-input::-moz-outer-spin-button,
.small-input::-moz-inner-spin-button {
  -moz-appearance: auto !important;
}

.custom-input {
  @apply border-primary-300 p-[0.45rem] m-0 border-[1px] bg-white dark:bg-surface-950 dark:border-surface-600 dark:text-white;
}
</style>
