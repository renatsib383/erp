<script setup>
import ActWorks from "~/components/Deals/ActWorks.vue";

const store = useMainStore()
const props = defineProps({
  rawAct: Object,
  actsList: Array,
  approvedSmeta: Object,
  rooms: Array,
  worksList: {
    type: Array,
    default: () => [],
  },
  group: {
    type: Object,
    default: () => {},
  },
  category: {
    type: Object,
    default: () => {},
  },
  factorList: {
    type: Array,
    default: () => [],
  },
  actStatusList: Array
});
const { $api, $showSuccessToast, $showErrorToast} = useNuxtApp();
const emit = defineEmits(["room-changed"]);

const originalAct = ref(props.rawAct);
if (!props.rawAct.id){
  originalAct.value.works = props.approvedSmeta.rooms.works;
}
const act = ref(JSON.parse(JSON.stringify(originalAct.value)));
if (!act.value.additional) act.value.additional = 0;

const act_statuses = props.actStatusList.map((status, index) => ({
  label: status,
  value: index,
}));

const selectedRoom = ref(null);
const remainsOfWorksForSelectedRoom = ref(null) // по остаткам работ
const showWithNewWorks = ref(true);


const isFinishedAct = ref(null);
const actStatus = ref(null)
const emptyFields = ref({})

// Список работ
const worksData = ref(props.worksList);
const group = ref(props.group);
const category = ref(props.category);
const factorList = ref(props.factorList);

onMounted(async () => {
  await setStatusAndWorks()
  setTimeout(() => {
    if(act.value.id){
      emitActChanged(false)
    }
  })
});

watch(() => props.rawAct,(newValue) => {
  const newActState = JSON.parse(JSON.stringify(newValue));
  if(newActState) Object.assign(act.value, newActState)

  setStatusAndWorks()
  setTimeout(() => emitActChanged(false))
}, {deep: true})

const setStatusAndWorks = async() => {
  isFinishedAct.value = act.value.status >= 2;
  actStatus.value = act.value.status ? act.value.status : 0;

  if(props.rooms && props.rooms[0]){
    selectedRoom.value = props.rooms[0]
    for (const room of props.rooms) {
      if(props.rooms.indexOf(room) === 0){
        selectRoom(room);
      } else{
        await initializeRemains(room);
      }
    }
  }
}

const worksFromSmet = ref({
  name: null,
  room_type: null,
  works: null,
});
// Для передачи и дальнейшем сравнение доп работ.
const approvedSmetaWorks = ref({
  name: null,
  room_type: null,
  works: null,
});

const filteredRooms = computed(() => {
  const rooms = props.rooms.filter((room) =>
    props.approvedSmeta.rooms.list.includes(Number(room.id)),
  );
  return rooms;
});

const selectRoom = (room) => {
  worksFromSmet.value.works = {}
  approvedSmetaWorks.value.works = props.approvedSmeta.rooms.works[room.id].works;

  initializeRemains(room)

  setTimeout(() => {
    selectedRoom.value = room;
    if(act.value.works[room.id]) worksFromSmet.value.works = act.value.works[room.id].works;

    showWithNewWorks.value = false;
    setTimeout(() => {
      showWithNewWorks.value = true;
    }, 0);
  })
};

// Если часть работ было уже выполнено, обработаем остатки :)
const initializeRemains = async (room) => {
  const result = {};
  const totalActsWorks = {};

  if (props.actsList.length) {
    // Проходим по актам до текущего акта (включая его, если это новый акт)
    const isNewAct = !act.value.id;
    const actsToProcess = isNewAct
      ? props.actsList
      : props.actsList.filter(item => item.id < act.value.id);

    actsToProcess.forEach(act => {
      if(act.works && act.works[room.id] && act.works[room.id].works){
        Object.keys(act.works[room.id].works).forEach(workKey => {
          if (!totalActsWorks[workKey]) {
            totalActsWorks[workKey] = 0;
          }
          totalActsWorks[workKey] += Number(act.works[room.id].works[workKey]);
        });
      }
    });

    // Минусуем из суммы работ в смете общую сумму всех выполненных работ в актах
    if(props.approvedSmeta.rooms && props.approvedSmeta.rooms.works && props.approvedSmeta.rooms.works[room.id] && props.approvedSmeta.rooms.works[room.id].works){
      Object.keys(props.approvedSmeta.rooms.works[room.id].works).forEach(workId => {
        const approvedValue = props.approvedSmeta.rooms.works[room.id].works[workId]; // Значение из сметы
        const totalCompletedValue = totalActsWorks[workId] || 0; // Значение из актов
        const difference = approvedValue - totalCompletedValue;
        result[workId] = Number(difference.toFixed(2));
      });
    }
  }

  if(Object.keys(result).length){
    // Обновляю сумму остатков
    const resultWorksKeys = Object.keys(result).map(key => Number(key));
    let sum = 0;

    worksData.value.forEach((work) => {
      if (resultWorksKeys.includes(work.id)) {
        const workScope = result[work.id];
        sum += work.price * workScope;
      }
    });

    // console.log(result)

    if(!act.value.id){
      act.value.works[room.id].works = result
      act.value.works[room.id].total = sum
    }

    remainsOfWorksForSelectedRoom.value = {
      ...remainsOfWorksForSelectedRoom.value,
      [room.id]: { works: result, total: sum }
    };
  }
    updateActTotal()
}

const selectedWorksChanged = (event) => {
  if (selectedRoom.value) {
    act.value.works[selectedRoom.value.id].works = event.selectedWorks;
    emitActChanged(true);
  }
};

const setTotal = (event) => {
  if (event.total && selectedRoom.value) {
    if (act.value.works[selectedRoom.value.id].total !== event.total) {
      act.value.works[selectedRoom.value.id].total = event.total;
      updateActTotal();
    }
  }
};
// Сумма по акту
const updateActTotal = () => {
  // if(act.value.status < 2){
    let newTotal = 0;
    Object.values(act.value.works).forEach((value) => {
      newTotal += Number(value.total); // Суммируем цены работ
    });
    act.value.total = newTotal && newTotal > 0 ? Math.round(newTotal * 100) / 100 : 0;
    act.value.additional = act.value.total - approvedSmetaSum();
    emitActChanged(true);
  // }
};

// Сумма по смете
const approvedSmetaSum = () => {
  let smetaTotal = 0;
  Object.values(props.approvedSmeta.rooms.works).forEach((value) => {
    smetaTotal += value.total; // Суммируем цены работ
  });
  return smetaTotal;
};

const emitActChanged = (value) => {
  if (isFinishedAct.value){
    emit("act-changed", false);
    return
  }
  emit("act-changed", value);
};

const saveNewActState = async () => {
  if(isFinishedAct.value) return
  act.value.status = actStatus.value
  statusChanged()
  if(Object.keys(emptyFields.value).length){
    return
  }
  store.showModalLoader()
  if (act.value.id) {
    try {
      const response = await $api.put(`acts/${act.value.id}`, act.value);
      // for (const [key, value] of Object.entries(response)) {
      //   act.value[key] = value;
      // }
      setTimeout(() => {
        $showSuccessToast('Акт успешно обновлен!')
        emit("act-changed", false);
        // emit("close-window");
      }, 0);
    } catch (e) {
      console.log(e);
    } finally {
      store.hideModalLoader()
    }
  }
  else if (!act.value.id) {
    try {
      const user = useSanctumUser();
      act.value.user_id = await user.value.id;
      const response = await $api.post("/acts", act.value);

      for (const [key, value] of Object.entries(await response)) {
        act.value[key] = value;
      }
      setTimeout(() => {
        $showSuccessToast('Акт успешно создан!')
        emit("act-changed", false);
        // emit("close-window");
      });

    } catch (e) {
      console.log(e);
    } finally {
      store.hideModalLoader()
    }
  }
};

const statusChanged = () => {
  if(actStatus.value === 2){
    if(act.value.date_paid){
      delete emptyFields.value.date_paid
      delete emptyFields.value.date_sign
    } else {
      emptyFields.value.date_paid = true
      $showErrorToast('Укажите дату оплаты')
    }
  }
  if(actStatus.value === 3){
    if(act.value.date_paid){
      delete emptyFields.value.date_paid
    } else {
      emptyFields.value.date_paid = true
      $showErrorToast('Укажите дату оплаты')
    }
    if(act.value.date_sign){
      delete emptyFields.value.date_sign
    } else {
      emptyFields.value.date_sign = true
      $showErrorToast('Укажите дату подписания')
    }
  }
  emitActChanged(true)
}

const showWorksList = ref(false)

defineExpose({
  saveNewActState,
});
</script>

<template>
  <section class="grid lg:grid-cols-[0.35fr_0.65fr] gap-2 relative bg-gray-200 dark:bg-surface-600 p-0 select-none max-sm:overflow-y-scroll">

    <div class="flex flex-col bg-white dark:bg-surface-800 max-sm:p-0 h-full home w-full overflow-y-auto overflow-x-hidden relative" :class="{'max-lg:hidden': showWorksList}">
      <div class="home h-full w-full overflow-y-auto overflow-x-hidden p-1">
        <div class="border-[1px] dark:border-surface-600 py-4 px-1">
          <h2 class="font-bold">Основная информация</h2>
          <div class="mt-2 grid lg:grid-cols-2 gap-4">
            <ifta-label>
              <label class="text-surface-400">Объект</label>
              <InputNumber v-model="act.deal_id" disabled class="w-full"/>
            </ifta-label>
            <ifta-label>
              <label class="text-surface-400">Сумма</label>
              <InputNumber
                v-model="act.total"
                @input="emitActChanged(true)"
                :disabled="isFinishedAct"
                class="w-full"
                readonly
              />
            </ifta-label>
            <FormDatePickerCustom
              v-model="act.date_paid"
              @update:modelValue="emitActChanged(true)"
              :disabled="isFinishedAct"
              show-button-bar
              id="changed"
              :label="'Дата оплаты'"
              :invalid="emptyFields.date_paid"
            >
            </FormDatePickerCustom>
            <FormDatePickerCustom
              v-model="act.date_sign"
              @update:modelValue="emitActChanged(true)"
              :disabled="isFinishedAct"
              show-button-bar
              id="changed"
              :label="'Дата подписания'"
              :invalid="emptyFields.date_sign"
            >
            </FormDatePickerCustom>
            <ifta-label>
              <label class="text-surface-400">Статус</label>
              <Dropdown
                @change="statusChanged"
                placeholder="Выберите статус"
                class="w-full h-full"
                v-model="actStatus"
                :options="act_statuses"
                optionLabel="label"
                optionValue="value"
                :disabled="isFinishedAct"
              />
            </ifta-label>
          </div>
        </div>

        <div class="border-[1px] dark:border-surface-600 py-4 px-1 mt-4">
          <h2 class="font-bold">Комнаты</h2>
          <div class="mt-2">
            <div
              v-for="room in filteredRooms"
              :key="room.id"
              class="p-2 mt-2 border-[1px] cursor-pointer hover:bg-slate-200 dark:hover:bg-surface-600 flex justify-between"
              :class="{'bg-slate-200 dark:bg-surface-600': selectedRoom === room}"
              @click="selectRoom(room)"
            >
              <h4>{{room.name}}</h4>
              <div v-if="!remainsOfWorksForSelectedRoom" class="flex items-center gap-1">
                <span>
                  <span v-if="act.works[room.id].total - props.approvedSmeta.rooms.works[room.id].total > 0" class="text-emerald-500">
                    (+{{(act.works[room.id].total - props.approvedSmeta.rooms.works[room.id].total).toFixed(2)}})
                  </span>
                  <span v-if="act.works[room.id].total - props.approvedSmeta.rooms.works[room.id].total < 0" class="text-red-500">
                    ({{(act.works[room.id].total - props.approvedSmeta.rooms.works[room.id].total).toFixed(2)}})
                  </span>
                </span>
                <p>{{ act.works[room.id].total.toFixed(2) }} руб.</p>
              </div>

              <div v-if="remainsOfWorksForSelectedRoom && remainsOfWorksForSelectedRoom[room.id] && remainsOfWorksForSelectedRoom[room.id].total" class="flex items-center gap-1">
                <span>
                  <span v-if="(act.works[room.id].total - remainsOfWorksForSelectedRoom[room.id].total) > 0" class="text-emerald-500">
                    (+{{(act.works[room.id].total - remainsOfWorksForSelectedRoom[room.id].total).toFixed(2)}})
                  </span>
                  <span v-if="(act.works[room.id].total - remainsOfWorksForSelectedRoom[room.id].total) < 0" class="text-red-500">
                    ({{(act.works[room.id].total - remainsOfWorksForSelectedRoom[room.id].total).toFixed(2)}})
                  </span>
                </span>
                <p>{{ act.works[room.id].total.toFixed(2) }} руб.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @click="showWorksList = 'work'" class="w-full p-2 pb-4 text-center bg-slate-400 text-white lg:hidden cursor-pointer">Показать работы</div>
    </div>

    <div class="flex flex-col bg-white dark:bg-surface-800 max-sm:p-0 relative overflow-hidden h-full" :class="{'max-lg:hidden': showWorksList !== 'work'}">
      <div v-if="showWithNewWorks && worksData.length" class="relative h-full overflow-hidden">
        <div @click="showWorksList = false" class="w-full py-2 text-center bg-slate-400 text-white lg:hidden cursor-pointer">Скрыть работы</div>
        <ActWorks
          class="px-1 py-2 h-full max-lg:pb-8"
          @total="setTotal"
          @selectedWorksChanged="selectedWorksChanged"
          :remainsOfWorksForSelectedRoom="remainsOfWorksForSelectedRoom"
          :fromAct="true"
          :room="selectedRoom"
          :worksFromSmet="worksFromSmet"
          :approvedSmetaWorks="approvedSmetaWorks"
          :worksData="worksData"
          :factorList="factorList"
          :group="group"
          :category="category"
          :disabled="isFinishedAct"
        />
      </div>
    </div>

  </section>
</template>

