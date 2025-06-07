<script setup>
import {smetWorksFactorFunctions} from "~/utils/smet-utils.js";
import ptFieldsetDealModal from "assets/presets/custom/fieldsetDealModal.js";

const props = defineProps({
  worksFromSmet: Object,
  setOfWorks: {
    type: Array,
    default: () => [],
  },
  worksData: {
    type: Array,
    default: () => [],
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
  disableEdit: {
    type: Boolean,
    default: false,
  },
  factorList: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["save", "total", "selectedWorksChanged"]);

const setsOriginal = ref({});
const worksData = ref([]);
const category = ref(props.category);
const group = ref([]);
const selectedWorks = ref([]);
const worksByFactor = ref([]);
const handEditedWorks = ref([]) // Работы количество которых были изменены вручную

const search = ref("");
const sets = ref({});
const isChanged = ref(false);
const buttonText = ref("Сохранить");
if (!sets.value.id) buttonText.value = "Создать";
const selectedCategories = ref([]);
const showOnlySelected = ref(false);
const isEmptyField = ref(false)
let factorList = null;
const collapsedGroups = ref([])
const allGroupsUnCollapse = ref(false)

watch(selectedWorks,() => {
    let sum = 0;
    selectedWorks.value.forEach((item) => {
      sum += item.default_value * item.price;
    });
    emit("total", { total: sum });
  },  { deep: true });

watch(() => props.category,  (newValue) => {
    category.value = newValue.map(cat => ({
      ...cat,
      activated: false,
    }));
    selectedCategories.value = [];
    initializeSelectedWorks('fromWatch');
  },  { deep: true });

watch(
    () => props.room,
    () => { debouncedUpdateWorks() }
);

watch(() => props.worksFromSmet,  (newValue) => {
  setWorks('fromWatch')
})

onMounted(() => {
  setWorks()
});

const setWorks = (fromWatch) => {
  setsOriginal.value = JSON.parse(JSON.stringify(props.worksFromSmet));
  if(props?.worksFromSmet?.handEdited) handEditedWorks.value = JSON.parse(JSON.stringify(props.worksFromSmet.handEdited));
  sets.value = {...setsOriginal.value}
  worksData.value = props.worksData;
  // category.value = props.category;
  group.value = props.group;
  factorList = props.factorList.reduce((acc, item, index) => {
    acc[index] = item; // Добавляем ключ и значение в объект
    return acc;
  }, {});

  if(props.room.id){
    showOnlySelected.value = true;
  }
  initializeSelectedWorks(fromWatch);
}
// Выделение выбранных работ
const initializeSelectedWorks = (fromWatch) => {
  let worksFromServer = sets.value.works || {};

  const workIds = Object.keys(worksFromServer).map(Number);

  if (workIds.length) {
    // Выбираем работы
    selectedWorks.value = worksData.value.filter((work) =>
        workIds.includes(work.id)
    );

    // Устанавливаем количество работ, которые из сметы
    selectedWorks.value.forEach((work) => {
      if (worksFromServer[work.id] !== undefined) {
        work.default_value = worksFromServer[work.id] ? worksFromServer[work.id] : 0;
      }
    });

    // Находим категории работ из сервера
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

    allGroupsUnCollapse.value = true;
  }
  else {
    // Если нет выбранных работ, включаю все категории
    selectedCategories.value = category.value.map((cat) => {
      cat.activated = true;
      return cat.value;
    });

    if (!fromWatch) {
      collapseGroups();
    }
  }

  setTimeout(() => {
    isChanged.value = false;
  }, 0);
};

const debouncedUpdateWorks = debounce(() => {
  if (!props.fromAct && props.room) {
    try {
      worksData.value.forEach((work) => {
        if (!handEditedWorks.value.includes(Number(work.id)) && work.factor > 0) {
          let value = setRoomFactorValue(factorList[work.factor].room_field);
          work.default_value = value || 1;
        }
      });
      emitSelectedWorks();
    } catch (error) {
      console.error('Ошибка при обновлении данных работ:', error);
    }
  }
}, 1000);

// Активация/деактивация категории и обновление списка выбранных категорий и работ
const activateCategory = (item) => {
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
  if(!props.disableEdit){
    const keys = Object.keys(set.works).map(Number);

    if (set.selected) {
      selectedWorks.value = selectedWorks.value.filter((work) => {
        if (!keys.includes(work.id)) {
          return work;
        }
      });
      set.selected = false;
    }
    else {
      worksData.value.forEach((work) => {
        if (keys.includes(work.id)) {
          const existingWork = selectedWorks.value.find(w => w.id === work.id);

          if (!existingWork) { // Если есть такая работа, то заканчиваем цикл, если нет добавляем

            if (work.factor > 0) {
              let value = setRoomFactorValue(factorList[work.factor].room_field);
              work.default_value = value || 1;
            } else {
              work.default_value = 1;
            }
            selectedWorks.value.push(work);

            // Находим категорию и активируем её
            const cat = category.value.find(c => c.groups.some(g => g.id === work.work_group_id));
            if (cat && !selectedCategories.value.includes(cat.value)) {
              selectedCategories.value.push(cat.value);
              cat.activated = true;
            }
          }
        }
      });

      set.selected = true;
    }

    emitSelectedWorks()

  }

};

const filteredWorks = computed(() => {
  const query = search.value.toLowerCase();

  const filterByCategoryAndSearch = (works) => {
    return works.filter((work) => {
      const categoryItem = category.value.find((c) =>
          c.groups.some((g) => g.id === work.work_group_id)
      );

      return (
          categoryItem && selectedCategories.value.includes(categoryItem.value) &&
          work.name.toLowerCase().includes(query)
      );
    }) || [];
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
    const groupName = groupItem ? groupItem.name : "Неизвестно";

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
      // Если чекбокс отмечен, разворачиваем все группы
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

    setTimeout(() => {
      // Слежу за работами у которых указан фактор и обновляю количество
        if (!selectedWorks.value.includes(work) && props.room) {
          if(work.factor > 0){
            let value = setRoomFactorValue(factorList[work.factor].room_field);
            work.default_value = value || 0;
          } else{
            work.default_value = 1
          }
        }
    }, 0)

  }
  else {
    if(work.factor > 0){
      let value = setRoomFactorValue(factorList[work.factor].room_field);
      work.default_value = value || 1
    } else {
      work.default_value = 1
    }

    selectedWorks.value.push(work);
  }
  isChanged.value = true;
  emitSelectedWorks();
};

const emitSelectedWorks = () => {
  let sum = 0;
  selectedWorks.value.forEach((item) => {
    sum += item.default_value * item.price;
  });
  // Передаем выбранные работы в родительский компонент
  emit("selectedWorksChanged", {
    selectedWorks: selectedWorks.value.reduce((acc, item) => {
      acc[item.id] = item.default_value;
      return acc;
    }, {}) || {},
    total: sum,
    handEdited: handEditedWorks.value,
  });
};

const changeScopeOfWork = (work) => {
  if(work.default_value < 0 || !work.default_value ) work.default_value = 0;
  isChanged.value = true;

  const thisWork = selectedWorks.value.find((item) => {
    if(item.id === work.id) return item;
  });

  if(thisWork && thisWork.default_value <= 0){
    toggleWork(work)
  }
  if(thisWork){
    if(!handEditedWorks.value.includes(work.id))  handEditedWorks.value.push(Number(work.id));
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
  props.setOfWorks.forEach((set) => {
    set.selected = false;
  })
  
  const sum = 0;
  emit("total", {total: sum});
  handEditedWorks.value = []
});

</script>

<template>
  <div class="overflow-y-auto h-[85vh] transition-all">
    <Fieldset
        :pt="ptFieldsetDealModal"
        :ptOptions="ptFieldsetOptions"
        legend="Наборы работ"
        class="text-center"
    >
      <div class="grid grid-cols-3 gap-2 text-start">
        <div v-for="set in setOfWorks" :key="set.id">
        <p
          @click.stop.prevent="activateWorkCollection(set)"
          class="p-2 border-2 cursor-pointer dark:border-surface-800 font-[500]"
          :class="{ 'bg-slate-600 dark:bg-surface-950 text-white': set.selected }"
        >
          {{ set.name }}
        </p>
      </div>
      </div>
    </Fieldset>

    <Fieldset
          legend="Категории"
          :pt="ptFieldsetDealModal"
          :ptOptions="ptFieldsetOptions"
          class="text-center"
      >
        <div
        class="grid md:grid-cols-3 gap-2 px-1"
        :class="{
            'border-[1px] !border-red-500':
              isEmptyField && !selectedCategories.length,
          }"
      >
        <button
          v-for="(item, index) in (category)"
          :key="index"
          class="text-left select-none flex items-center justify-between"
          @click.stop="activateCategory(item);"
          :disabled="disableEdit"
        >
          <FormCheckbox
            :label="item.label"
            :checked="item.activated"
            :disabled="disableEdit ? true : false"
            class="w-full"
          />
          <!-- <label>{{ item.label }}</label>
          <input :checked="item.activated" :disabled="disableEdit" type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"> -->
        </button>
      </div>
      </Fieldset>

    <div class="p-2 pb-0">
      <div class="flex max-sm:flex-col max-sm:items-start items-center m-1 mt-2 text-surface-800 font-semibold gap-2">
        <div class="flex items-center gap-2">
          <input id="showOnlySelected" v-model="showOnlySelected" type="checkbox" class="shrink-0 disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
          <label for="showOnlySelected" class="cursor-pointer dark:text-surface-300">Показать только выбранные работы</label>
        </div>
        <div class="flex items-center gap-2">
          <input id="allGroupsUnCollapse" :checked="allGroupsUnCollapse" @click="collapseGroups" type="checkbox" class="shrink-0 disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
          <label for="allGroupsUnCollapse" class="cursor-pointer dark:text-surface-300">Развернуть группы</label>
        </div>
      </div>
      <div class="pt-2">
        <input
            type="text"
            v-model="search"
            placeholder="Поиск по названиям работ"
            class="w-full p-2 border dark:bg-surface-950 dark:border-surface-600"
        />
      </div>
    </div>

    <Fieldset
        v-if="groupedWorksByCategory.length"
        legend="Список работ"
        :pt="ptFieldsetDealModal"
        :ptOptions="ptFieldsetOptions"
        class="text-center"
    >
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
        <h3 class="font-semibold px-1 py-2 border-slate-600 bg-slate-600 text-center text-white text-[1.06rem]">
          {{ category.name }}
        </h3>

        <div
          v-for="(works, groupName) in category.groups"
          :key="groupName"
          class="border-[1px] dark:border-surface-600 mb-1"
        >
          <div
            class="font-semibold px-2 py-2 bg-slate-400 border-slate-400 text-white cursor-pointer flex items-center"
            @click.stop="toggleGroup(categoryIndex, groupName)"
          >
            <p class="flex-1 text-center">{{ groupName }}</p>
            <span v-if="!collapsedGroups[categoryIndex]?.includes(groupName)" class="pi pi-angle-up ml-2 text-lg"></span>
            <span v-else class="pi pi-angle-down ml-2 text-lg"></span>
          </div>

          <div v-if="!collapsedGroups[categoryIndex]?.includes(groupName)" class="px-1 py-2">
            <div
              v-for="work in works"
              :key="work.id"
              class="p-2 border-[1px] border-surface-300 dark:border-surface-700 mb-2 grid grid-cols-[1fr_1fr_1fr_0.1fr] lg:grid-cols-[1fr_0.3fr_0.4fr_0.3fr_0.1fr] justify-between items-center text-start gap-1"
              :class="{'bg-gray-200  dark:bg-surface-600': selectedWorks.includes(work)}"
              @click.stop="toggleWork(work)"
            >
              <div class="flex flex-col gap-1 col-span-full lg:col-span-1">
                <p class="font-[500]">{{ work.name }}</p>
                <p v-if="work.factor >= 0 && room" class="text-slate-400 text-xs">
                  {{factorList[work.factor] ? setRoomFactorValue([factorList[work.factor].room_field]) : null }} ({{ factorList[work.factor] ? factorList[work.factor].title : null }})
                </p>
              </div>
              <span class="col-span-1">{{ work.price }}р.</span>
              <input
                type="number"
                class="w-16 small-input text-center col-span-1  dark:bg-surface-950"
                v-model="work.default_value"
                @input="changeScopeOfWork(work)"
                :disabled="disableEdit"
                min="0"
              />
              <span>{{ Number(work.price * work.default_value).toFixed(2) }}р.</span>
              <div v-if="!disableEdit">
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
    </Fieldset>
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

.small-input::-moz-outer-spin-button,
.small-input::-moz-inner-spin-button {
  -moz-appearance: auto !important;
}
</style>
