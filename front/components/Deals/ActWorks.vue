<script setup>
import {smetWorksFactorFunctions} from "~/utils/smet-utils.js";

const props = defineProps({
  worksFromSmet: Object,
  approvedSmetaWorks: Object,
  remainsOfWorksForSelectedRoom: Object,
  setOfWorks: Object,
  disabled: Boolean,
  worksData: {
    type: Array,
    default: () => [],
  },
  factorList: {
    type: Object,
    default: () => {},
  },
  category: {
    type: Array,
    default: () => [],
  },
  group: {
    type: Array,
    default: () => [],
  },
  room: {
    type: Object,
    default: () => {},
  },
  fromAct: {
    type: Boolean,
    default: false,
  },
});

const setsOriginal = ref({});
const worksData = ref([]);
const category = ref([]);
const group = ref([]);
const selectedWorks = ref([]);
const worksByFactor = ref([]);
const approvedSmetaWorks = ref(null);
// const remainsOfWorksForSelectedRoom = ref(null);

const search = ref("");
const sets = ref({});
const isChanged = ref(false);
const buttonText = ref("Сохранить");
if (!sets.value.id) buttonText.value = "Создать";
const selectedCategories = ref([]);
const showOnlySelected = ref(false);
const isEmptyField = ref(false)
let factorList = props.factorList.reduce((acc, item, index) => {
  acc[index] = item; // Добавляем ключ и значение в объект
  return acc;
}, {});

const collapsedGroups = ref([])
const allGroupsUnCollapse = ref(false)

const delay = ref(null);

watch(selectedWorks,() => {
    let sum = 0;
    selectedWorks.value.forEach((item) => {
      sum += item.default_value * item.price;
    });
    emit("total", { total: sum });
  },
  { deep: true },
);

onMounted(() => {
  setsOriginal.value = props.worksFromSmet;
  sets.value = {...setsOriginal.value}
  worksData.value = props.worksData;
  category.value = props.category;
  group.value = props.group;
  factorList = props.factorList.reduce((acc, item, index) => {
    acc[index] = item; // Добавляем ключ и значение в объект
    return acc;
  }, {});
  // remainsOfWorksForSelectedRoom.value = props.remainsOfWorksForSelectedRoom
  // Это только для сравнения количества работ в смете и акте
  if (props.approvedSmetaWorks && props.approvedSmetaWorks.works) approvedSmetaWorks.value = props.approvedSmetaWorks.works;

  showOnlySelected.value = true;
  initializeSelectedWorks();
  collapseGroups()

});

const emit = defineEmits(["save", "total", "selectedWorksChanged"]);

// // Сортировка категорий по алфавиту
// const sortCategories = (categories) => {
//   return categories.sort((a, b) => a.label.localeCompare(b.label));
// };

// Выделение выбранных работ
const initializeSelectedWorks = () => {
  if (sets.value.works) {
    Object.entries(sets.value.works).forEach(([key, value]) => {
      if (Number(value) < 1) {
        delete sets.value.works[key];
      }
    });
  }

  let worksFromServer = sets.value.works || {};
  const workIds = Object.keys(worksFromServer).map(Number);

  if (workIds.length) {
    // Выбираем работы
    // selectedWorks.value = worksData.value
    //     .filter((work) => workIds.includes(work.id))
    //     .map((work) => ({
    //       ...work,
    //       default_value: worksFromServer[work.id] || 0,
    //     }))
    //     .filter((work) => work.default_value > 0); // Отключаем работы с default_value < 1
    selectedWorks.value = worksData.value.filter((work) =>
        workIds.includes(work.id)
    );

    // Устанавливаем количество работ, которые из сметы
    selectedWorks.value.forEach((work) => {
      if (worksFromServer[work.id] !== undefined) {
        work.default_value = worksFromServer[work.id] ? worksFromServer[work.id] : 0;
      }
    });

    // Отключаем работы с default_value < 1
    selectedWorks.value.filter((work) => work.default_value > 0);

    // Находим категории работ из сервера/готовых наборов
    const idCategoriesFromServer = [];
    selectedWorks.value.forEach((work) => {
      const categoryItem = category.value.find((c) =>
          c.groups.some((g) => g.id === work.work_group_id)
      );
      if (categoryItem && !idCategoriesFromServer.includes(categoryItem.value)) {
        idCategoriesFromServer.push(categoryItem.value);
      }
    });

    selectedCategories.value = idCategoriesFromServer;
    category.value.forEach((cat) => {
      cat.activated = selectedCategories.value.includes(cat.value);
    });
  }

  setTimeout(() => {
    isChanged.value = false;
  }, 0);
};


// Активация/деактивация категории и обновление списка выбранных категорий и работ
const activateCategory = (item) => {
  if(props.disabled){
    return
  }
  const index = category.value.indexOf(item);
  if (index >= 0) {
    category.value[index].activated = !category.value[index].activated;
    if (category.value[index].activated) {
      selectedCategories.value.push(item.value);
      showOnlySelected.value = false;
    } else {
      selectedCategories.value = selectedCategories.value.filter((category) => category !== item.value);
      // selectedWorks.value = selectedWorks.value.filter((work) => work.category !== item.value)
    }
  }
};

const activateWorkCollection = (set) => {
  const keys = Object.keys(set.works).map(Number);

  if (set.selected) {
    selectedWorks.value = selectedWorks.value.filter((work) => {
      if(!keys.includes(work.id)) {
        return work;
      }
    });
    set.selected = false;
  }
  else {
    worksData.value.forEach((work) => {
      if(keys.includes(work.id)) {
        selectedWorks.value.push(work);
        if(!selectedCategories.value.includes(work.category)){
          selectedCategories.value.push(work.category);
          const cat = category.value.find(item => item.value === work.category)
          cat.activated = true;
        }
      }
    });
    set.selected = true;
  }
  emitSelectedWorks()
};

const filteredWorks = computed(() => {
  const query = search.value.toLowerCase();

  const filterByCategoryAndSearch = (works) => {
    return works.filter((work) => {
      const categoryItem = category.value.find((c) =>
          c.groups.some((g) => g.id === work.work_group_id)
      );

      return (
          categoryItem &&
          selectedCategories.value.includes(categoryItem.value) &&
          work.name.toLowerCase().includes(query)
      );
    });
  };

  return showOnlySelected.value
      ? filterByCategoryAndSearch(selectedWorks.value || [])
      : filterByCategoryAndSearch(worksData.value);
});

const groupedWorksByCategory = computed(() => {
  const categories = [];
  const categoryMap = {};

  filteredWorks.value.forEach((work) => {
    const categoryItem = category.value.find((c) =>
        c.groups.some((g) => g.id === work.work_group_id)
    );

    const categoryName = categoryItem ? categoryItem.label : "Неизвестно";

    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = { name: categoryName, groups: {} };
      categories.push(categoryMap[categoryName]);
    }

    const groupItem = categoryItem?.groups.find((g) => g.id === work.work_group_id);
    const groupName = groupItem?.name || "Неизвестно";

    if (!categoryMap[categoryName].groups[groupName]) {
      categoryMap[categoryName].groups[groupName] = [];
    }

    categoryMap[categoryName].groups[groupName].push(work);
  });

  return categories;
});


const toggleGroup = (categoryIndex, groupName) => {
  // Если массив для категории еще не существует, создаем его
  if (!collapsedGroups.value[categoryIndex]) {
    collapsedGroups.value[categoryIndex] = [];
  }
  // Проверяем, есть ли группа в списке свернутых и добавляем/удаляем ее
  const groupIndex = collapsedGroups.value[categoryIndex].indexOf(groupName);
  if (groupIndex === -1) {
    collapsedGroups.value[categoryIndex].push(groupName);
  } else {
    collapsedGroups.value[categoryIndex].splice(groupIndex, 1);
  }
};

// Метод для сворачивания/разворачивания всех групп
const collapseGroups = () => {
  allGroupsUnCollapse.value = !allGroupsUnCollapse.value
  setTimeout(() => {
    groupedWorksByCategory.value.forEach((category, categoryIndex) => {
      // Если чекбокс отмечен, сворачиваем все группы
      if (allGroupsUnCollapse.value) {
        collapsedGroups.value[categoryIndex] = [];
      } else {
        // Если чекбокс не отмечен, сворачиваем все группы
        collapsedGroups.value[categoryIndex] = Object.keys(category.groups).map(key => key);
      }
    }, 0);

  })
};

// Добавление/удаление работы из списка выбранных работ
const toggleWork = (work) => {
  if (selectedWorks.value.includes(work)) {
    selectedWorks.value = selectedWorks.value.filter((item) => item !== work);

    // setTimeout(() =>{
    //   // Слежу за работами у которых указан фактор и обновляю значени количество
    //   worksByFactor.value.forEach((work) => {
    //     if(!selectedWorks.value.includes(work) && props.room){
    //       work.default_value = Number(props.room[factorList[work.factor].value]) ? Number(props.room[factorList[work.factor].value]) : 0;
    //     }
    //   });
    // },0)

  }
  else {
    if(work.default_value < 1){
      work.default_value = 1
    }
    selectedWorks.value.push(work);
  }
  isChanged.value = true;
  emitSelectedWorks();
};

const emitSelectedWorks = () => {
  if (delay.value) clearTimeout(delay.value);
  delay.value = setTimeout(() => {
    // Передаем выбранные работы в родительский компонент
    emit("selectedWorksChanged", {
      selectedWorks:
        selectedWorks.value.reduce((acc, item) => {
          acc[item.id] = item.default_value;
          return acc;
        }, {}) || {},
    });
  }, 0);
};

const changeScopeOfWork = (work) => {
  if(work.default_value < 0 || !work.default_value ) work.default_value = 0;
  isChanged.value = true;

  const thisWork = selectedWorks.value.find(
    (item) => item.id === work.id,
  );

  if(thisWork && thisWork.default_value <= 0){
    toggleWork(work)
  }

  if(thisWork){
    thisWork.default_value = work.default_value;
    emitSelectedWorks();
  }
};

const setRoomFactorValue = (factor) => {
  const expression = Array.isArray(factor) ? factor[0] : factor; // Если factor является массивом, преобразуем его в строку

  if (expression.charAt(0) === '@') { // Проверка на функцию
    const functionName = expression.slice(1);
    const functionValue = smetWorksFactorFunctions[functionName] ? smetWorksFactorFunctions[functionName](props.room) : null
    return functionValue ? Math.round(functionValue * 100) / 100 : 0;
  } else {
    // Вычисляем выражение
    const parsedExpression  = expression.replace(/[a-zA-Z_][\w]*/g, match => `props.room.${match}`);
    const result = new Function('props', `return ${parsedExpression };`)(props);
    return result ? Math.round(result * 100) / 100 : 0;
  }
};

onUnmounted(() => {
  category.value.forEach((cat) => {
    if (selectedCategories.value.includes(cat.value)) {
      cat.activated = false;
    }
  });
  // const sum = 0;
  // emit("total", { total: sum });
});

</script>

<template>
  <div class="overflow-y-auto h-full transition-all">
<!--      <div class="grid grid-cols-3 gap-2">-->
<!--        <div v-for="set in setOfWorks" :key="set.id">-->
<!--          <h2-->
<!--            @click="activateWorkCollection(set)"-->
<!--            class="p-2 border-2 rounded-lg cursor-pointer"-->
<!--            :class="{ 'bg-slate-600 text-white': set.selected }"-->
<!--          >-->
<!--            {{ set.name }}-->
<!--          </h2>-->
<!--        </div>-->
<!--      </div>-->

      <div>
        <h2 class="font-[650] mt-2 mb-1 text-center text-surface-700">Категории</h2>
        <div
          class="grid md:grid-cols-3 gap-2 px-1 py-2"
          :class="{'border-[1px] !border-red-500': isEmptyField && !selectedCategories.length}"
        >
          <div
            v-for="(item, index) in category"
            :key="index"
            class="dark:border-surface-600 cursor-pointer select-none flex items-center justify-between"
            @click="activateCategory(item)"
          >
            <FormCheckbox
              :label="item.label"
              :checked="item.activated"
              :disabled="disabled"
              class="w-full"
            />          
            <!-- <p class="text-sm">{{ item.label }}</p>
            <input :checked="item.activated" type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"> -->
          </div>
        </div>
      </div>

      <div class="flex max-sm:flex-col max-sm:items-start items-center m-1 mt-2 text-surface-800 font-semibold gap-2">
        <div class="flex items-center gap-2">
          <input id="showOnlySelected" v-model="showOnlySelected" type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
          <label for="showOnlySelected" class="cursor-pointer dark:text-surface-300">Показать только выбранные работы</label>
        </div>
        <div class="flex items-center gap-2">
          <input id="collapseGroups" :checked="allGroupsUnCollapse" @click="collapseGroups" type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
          <label for="collapseGroups" class="cursor-pointer dark:text-surface-300">Развернуть группы</label>
        </div>
      </div>

      <div class="p-1">
        <input
          type="text"
          v-model="search"
          placeholder="Поиск по названиям работ"
          class="w-full p-2 mb-4 dark:bg-surface-950 dark:border-surface-600"
        />
      </div>

      <div v-if="groupedWorksByCategory.length" class="relative">
        <h2 class="font-[650] mb-1 text-center text-surface-700">
          Список работ
        </h2>
        <h2
          v-show="isEmptyField && !selectedWorks.length"
          class="font-[650] mt-2 mb-1 text-center text-red-600"
        >
          Добавьте не менее одной работы
        </h2>
        <div
          v-for="(category, categoryIndex) in groupedWorksByCategory"
          :key="categoryIndex"
          class="mb-6"
        >
          <h3 class="font-semibold px-1 py-2 border-slate-600 bg-slate-600 text-center text-white text-[1.06rem]">{{ category.name }}</h3>

          <div
            v-for="(works, groupName) in category.groups"
            :key="groupName"
            class="border-[1px] mb-1 dark:border-surface-600"
          >
            <div
              class="font-semibold px-2 py-2 bg-slate-400 border-slate-400 text-white cursor-pointer flex items-center"
              @click="toggleGroup(categoryIndex, groupName)"
            >
              <p class="flex-1 text-center">{{ groupName }}</p>
              <span v-if="!collapsedGroups[categoryIndex]?.includes(groupName)" class="pi pi-angle-up ml-2 text-lg"></span>
              <span v-else class="pi pi-angle-down ml-2 text-lg"></span>
            </div>

            <div v-if="!collapsedGroups[categoryIndex]?.includes(groupName)" class="px-1 py-2">
              <div
                v-for="(work, index) in works"
                :key="index"
                class="p-2 border-2 mb-2 grid grid-cols-[1fr_1fr_1fr_0.1fr] lg:grid-cols-[1fr_0.3fr_0.4fr_0.3fr_0.1fr] justify-between items-center gap-1"
                :class="{
                  'bg-gray-200 dark:bg-surface-600': selectedWorks.find(w => w.id === work.id),
                  '!bg-emerald-200 dark:!bg-emerald-400 border-emerald-200':
                    approvedSmetaWorks &&
                    !approvedSmetaWorks[work.id] &&
                    selectedWorks.find(w => w.id === work.id),
                }"
              >
                <div class="flex flex-col gap-1 col-span-full lg:col-span-1">
                  <h4>{{ work.name }}</h4>

                  <div class="flex items-center gap-2">
                    <p v-if="work.factor >= 0 && room && !remainsOfWorksForSelectedRoom" class="text-slate-400 text-xs">
                      {{factorList[work.factor] ? setRoomFactorValue([factorList[work.factor].room_field]) : null }} ({{ factorList[work.factor] ? factorList[work.factor].title : null }})
                    </p>

                    <p v-if="work.factor > 0 && room && remainsOfWorksForSelectedRoom && remainsOfWorksForSelectedRoom[room.id].works[work.id] > 0" class="text-slate-600 text-xs">
                      {{ (Number(remainsOfWorksForSelectedRoom[room.id].works[work.id]))}} (остатки)
                    </p>

                    <span v-if="!remainsOfWorksForSelectedRoom">
                      <span v-if="(work.default_value - approvedSmetaWorks[work.id]) > 0" class="text-emerald-500 text-sm"                  >
                        (+{{(work.default_value - approvedSmetaWorks[work.id]).toFixed(2)}})
                      </span>
                      <span v-if="(work.default_value - approvedSmetaWorks[work.id]) < 0" class="text-red-500 text-sm"                  >
                        ({{(work.default_value - approvedSmetaWorks[work.id]).toFixed(2)}})
                      </span>
                    </span>

                    <span v-if="remainsOfWorksForSelectedRoom">
                      <span v-if="(work.default_value - remainsOfWorksForSelectedRoom[room.id].works[work.id]) > 0" class="text-emerald-500 text-sm"                  >
                        (+{{(work.default_value - remainsOfWorksForSelectedRoom[room.id].works[work.id]).toFixed(2)}})
                      </span>
                       <span v-if="(work.default_value - remainsOfWorksForSelectedRoom[room.id].works[work.id]) < 0" class="text-red-500 text-sm"                  >
                        ({{(work.default_value - remainsOfWorksForSelectedRoom[room.id].works[work.id]).toFixed(2)}})
                      </span>
                    </span>
                  </div>
                </div>
                <span class="col-span-1">{{ work.price }}р.</span>
                <input
                  type="number"
                  class="w-16 small-input text-center col-span-1 dark:bg-surface-950"
                  v-model="work.default_value"
                  @input="changeScopeOfWork(work)"
                  :disabled="disabled"
                  min="0"
                  max="999"
                />
                <span>{{ (work.price * work.default_value).toFixed(2) }}р.</span>
                <div v-if="!disabled">
                  <span
                    v-show="selectedWorks.includes(work)"
                    class="pi pi-minus-circle pi-fw text-xl text-red-400 cursor-pointer"
                    @click.stop="toggleWork(work)"
                  ></span>
                  <span
                    v-show="!selectedWorks.includes(work)"
                    @click.stop="toggleWork(work)"
                    class="pi pi-plus-circle pi-fw text-xl text-emerald-400 cursor-pointer"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.small-input {
  @apply border-surface-300 p-1 text-center focus:border-surface-300 focus:ring-surface-300;
}

.small-input::-webkit-outer-spin-button,
.small-input::-webkit-inner-spin-button {
  -webkit-appearance: auto !important;
  margin: 0;
}

</style>
