<script setup>
import { getActivityData } from '~/services/api/activityPanelServices.js'

const timeLabels = ref(["8:00", "", "10:00", "", "12:00", "", "14:00", "", "16:00", "", "18:00"]); // Метки времени
const daysLabels = ref([])
const numDays = ref(1); // Количество дней
const panelType = ref('day');
const employers = ref([])

const showCalendar = ref(false);
const selectedDate = ref([]);
const today = new Date();
const periodSet = ref();
const dateActiveTimePopover = ref(null)
const dateActiveTimeInfo = ref(null)

const menuItems = ref([
  { label: "Сотрудники", items: [] },
  {
    label: selectedDate.value,
    icon: "pi pi-calendar",
    command: () => {
      showCalendar.value = true;
    },
  },
]);

onMounted(() => {
  menuItems.value[1].label = formatDateStr(today);
  selectedDate.value.push(today);
  setTimeout(() => {
    loadActivityData()
  },0)
});

const loadActivityData = async () => {
  try {
    const data = await getActivityData(selectedDate.value, employers.value.length);
    const newData = await fillMissingValues(data, panelType.value)
    if (employers.value.length) {
      // employers.value.push(...newData);
      employers.value = [...employers.value, ...newData];
    } else {
      employers.value = newData;
    }

  } catch (e) {
    console.log('Failed to load activity data', e);
  }
};

const onScroll = (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
    loadActivityData()
  }
};

const debouncedOnScroll = debounce(onScroll, 300);

const dateSelected = () => {
  employers.value = []
  loadActivityData()
  let period = ''
  selectedDate.value.forEach((date,index) => {
    if(date){ // Отображение тире между датами
      const formattedDate = formatDateStr(date)
      period += index === 1 ? '-' + formattedDate : formattedDate
    }
  });
  menuItems.value[1].label = period;

  periodSet.value = selectedDate.value[0] && selectedDate.value[1];
  if (periodSet.value) {
    numDays.value = daysBetween(selectedDate.value[0], selectedDate.value[1]);
  }

  setTimeout(() => {
    if (periodSet.value) { //За период
      showCalendar.value = false
      panelType.value = 'range'
    } else {
      showCalendar.value = true
      panelType.value = 'day'
    }
  },0)

};

const closeCalendar = () => {
  showCalendar.value = false;
}

const daysBetween = (start, end) => {
  const oneDay = 24 * 60 * 60 * 1000;
  // Находим и сами дни
  getDaysLabels(start, oneDay, end)
  return Math.floor((new Date(end) - new Date(start)) / oneDay) + 2;
};

const getDaysLabels = (start, oneDay, end) => {
  daysLabels.value = [];

  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  for (let date = startDate; date <= endDate; date = new Date(date.getTime() + oneDay)) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    daysLabels.value.push(`${day}.${month}`);
  }
}

const shouldShow = (index) => { // Количество шагов, чтобы не было пропусков
  if (daysLabels.value.length >= 25) {
    return index % 4 === 0 || index === daysLabels.value.length - 1;
  }
  return (daysLabels.value.length > 10 ? index % 3 === 0 : index % 2 === 0) || index === daysLabels.value.length - 1;
}

const showDayActiveTime = (event, index, date) => {
  const popovers = dateActiveTimePopover.value; // Получаем массив поповеров
  if (popovers && popovers[index]) {
    popovers[index].toggle(event); // Открываем поповер для конкретного элемента
    if (date.length > 1) {
      dateActiveTimeInfo.value = `Процент активного времени: ${date[0]}%` + '\n' + `Процент пассивного времени: ${date[1]}%`;
    } else {
      dateActiveTimeInfo.value = 'Процент активного времени: 0%' + '\n' + `Процент пассивного времени: ${date[0]}%`;
    }
  }
}
</script>

<template>
  <section class="absolute h-full w-full p-2 overflow-hidden" @click="closeCalendar">
    <div class="h-full">
      <header v-if="employers.length" class="flex justify-between items-center relative">
        <h2 class="font-semibold text-lg leading-5 uppercase w-full">Панель активности</h2>
        <Menubar :model="menuItems" class="border-none w-full justify-end px-2 py-0 !bg-transparent" @click.stop=""/>
        <DatePicker
            v-if="showCalendar"
            v-model="selectedDate" inline
            selectionMode="range"
            @date-select="dateSelected"
            class="!absolute top-10 right-0 z-[100]"
            :maxDate="new Date()"
            :minDate="new Date('01.01.2025')"
        >
          <template #date="slotProps">
            <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
          </template>
        </DatePicker>
      </header>

      <VirtualScroller
          :items="employers"
          :itemSize="84"
          class="h-[calc(100%-52px)] w-full"
          @scroll="debouncedOnScroll"
      >
<!--          showLoader :delay="250"-->
        <template v-slot:item="{ item: employee, index }">
          <div
              class="employee pt-6 min-w-full"
              :class="{ '!pt-2': index === 0 }"
              :key="employee.id"
          >
            <div class="flex justify-between items-center">
              <h4 class="font-semibold text-primary-500">{{ employee.name }}</h4>
              <span v-show="panelType === 'day'" class="text-sm text-primary-500">{{ employee.activityTime }}</span>
              <span v-show="panelType === 'range'" class="text-sm text-primary-500">{{ employee.activityPercent }}</span>
            </div>

            <div v-if="panelType === 'day'" class="custom-activaty-panel w-full">
              <div
                  v-for="(item, index) in Object.values(employee.values)[0]"
                  :key="index"
                  class="inline-block relative h-2 min-w-[0.763%] bg-[#059669]"
                  :class="{ '!bg-[#ef4444]': item === 0, '!bg-[#FFC618]': item === -1 }"
              />

              <!-- Линия на всю ширину -->
              <hr class="w-full bg-gray-400 h-[2px]"/>

              <!-- Вертикальные полоски -->
              <div class="w-full flex relative">
                <div
                    v-for="(label, index) in timeLabels"
                    :key="index"
                    class="w-full min-w-[25px]"
                >
                  <div class="block h-[10px] w-[1px] bg-gray-400"></div>
                  <div
                      class="text-xs transform absolute -translate-x-1/2 text-gray-500"
                      :class="{ 'translate-x-0': index === 0 }"
                  >
                    {{ label }}
                  </div>
                </div>
                <span class="h-[10px] w-[1px] absolute right-0 -top-[18px] bg-primary-400 mt-[17px]"></span>
                <!-- крайняя вертикальная полоска -->
              </div>
            </div>

            <div v-if="panelType === 'range'" class="custom-activaty-panel w-full">
              <div class="flex">
                <div v-for="date in employee.values" class="h-2 w-full">
                  <div
                      v-for="(item, index) in date"
                      :key="index"
                      class="inline-block relative h-2 transition duration-300 bg-[#ef4444] cursor-pointer"
                      :class="{ '!bg-[#029769]': date.length > 1 && index === 0 }"
                      :style="{ width: `${item}%` }"
                      @click="(e) => showDayActiveTime(e, index, date)"
                  />

                  <Popover ref="dateActiveTimePopover">
                    <div class="whitespace-pre-line">{{ dateActiveTimeInfo }}</div>
                  </Popover>
                </div>
              </div>

              <div class="mt-4">
                <hr class="w-full bg-primary-400 h-[2px]"/>

                <!-- Вертикальные полоски -->
                <div class="w-full flex relative">
                  <div
                      v-for="(label, index) in daysLabels"
                      :key="index"
                      class="w-full"
                  >
                    <div class="block h-[10px] w-[1px] bg-gray-400"></div>
                    <div
                        v-show="shouldShow(index)"
                        class="text-xs text-center text-gray-500"
                        :class="{ 'translate-x-0': index === 0 }"
                    >
                      {{ label }}
                    </div>
                  </div>
                  <span class="h-[10px] w-[1px] absolute right-0 -top-[18px] bg-primary-400 mt-[17px]"></span>
                </div>
              </div>
            </div>
          </div>
        </template>

<!--        <template v-slot:loader="{ options }">-->
<!--          <div :class="['flex items-center', { 'bg-surface-100 dark:bg-surface-700': options.odd }]" style="height: 80px">-->
<!--            <Skeleton :width="options.even ? '95%' : '85%'" height="3rem" />-->
<!--          </div>-->
<!--        </template>-->
      </VirtualScroller>
    </div>
  </section>
</template>

