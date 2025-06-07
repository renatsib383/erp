<script setup>
import {useConfirm} from "primevue/useconfirm";
import { createSet, deleteSet, fetchCollection,updateSet, validateAndPrepareSetData} from "~/services/api/worksCollectionsServices.js";
import {  fetchWorksData } from "~/services/api/worksServices.js"
import {useMainStore} from "~/stores/main.js";
import {formatDateTimeStr} from "~/utils/date-functions.js";
import ModalHeader from "~/components/Common/ModalHeader.vue";
import ChangeJournal from "~/components/Common/СhangeJournal.vue";
import ptFieldsetDealModal from "assets/presets/custom/fieldsetDealModal.js";

const dialogRef = inject("dialogRef");
const route = useRoute()
const store = useMainStore();
const setsOriginal = ref(dialogRef ? dialogRef.value?.data?.modalData : {});
const worksData = ref([]);
const category = ref([]);
const group = ref([]);
const selectedWorks = ref([]);
const worksByFactor = ref([]);

const roomTypeOptions = ref([])

const search = ref("");
const sets = ref(setsOriginal.value ? JSON.parse(JSON.stringify(setsOriginal.value)) : null);
const isChanged = ref(false);
const selectedCategories = ref([]);
const showOnlySelected = ref(false);
const errors = ref([]);
const collapsedGroups = ref([])
const allGroupsCollapsed = ref(false)

onMounted(async() => {
  if(sets.value){
    await getWorksData();
    await initializeSelectedWorks();
  }
  showOnlySelected.value = true
});

onUnmounted(() => {
  // category.value.forEach((cat) => {
  //   if (selectedCategories.value.includes(cat.value)) {
  //     cat.activated = false;
  //   }
  // });
  // const sum = 0;
});

const emit = defineEmits(["save",]);

// Загрузка данных для отдельной страницы набора
const getWorksData = async () => {
  const response = await fetchWorksData();

  if (response.success) {
    worksData.value = response.data.works;
    group.value = response.data.group;
    category.value = response.data.category;
    roomTypeOptions.value = response.data.roomTypes.map((roomType, index) => {
      return {value: index, label: roomType}
    });
  }
};

const getSetsData = async () => {
  const id = route.params.id ? route.params.id : dialogRef.value.data.modalData.id;
  if(!id){
    return
  }

  const response = await fetchCollection(id);
  if (response.success) {
    sets.value = response.data;
  }

  setTimeout(async() => {
    await getWorksData();
    await initializeSelectedWorks();
  })
};

if(!sets.value || Object.keys(sets.value).length <= 2){
  getSetsData()
}

// Выделение выбранных работ
const initializeSelectedWorks = async () => {
  const worksFromServer = sets.value.works || {};
  const workIds = Object.keys(worksFromServer).map(Number);

  if (workIds.length) {
    // Выбираем работы
    selectedWorks.value = worksData.value.filter((work) => workIds.includes(work.id));

    // Фильтруем только те работы, у которых количество больше 0
    selectedWorks.value.forEach((work) => {
      work.default_value = worksFromServer[work.id] || 0;
    });

    selectedWorks.value = selectedWorks.value.filter((work) => work.default_value > 0);

    // Определяем категории, к которым относятся выбранные работы
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
  const index = category.value.indexOf(item);
  if (index >= 0) {
    category.value[index].activated = !category.value[index].activated;
    if (category.value[index].activated) {
      selectedCategories.value.push(item.value);
      showOnlySelected.value = false;
    } else {
      selectedCategories.value = selectedCategories.value.filter((category) => category !== item.value);
      selectedWorks.value = selectedWorks.value.filter((work) => work.category !== item.value)
      isChanged.value = true;
    }
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
          categoryItem &&
          selectedCategories.value.includes(categoryItem.value) &&
          work.name.toLowerCase().includes(query)
      );
    });
  };

  return filterByCategoryAndSearch(showOnlySelected.value ? selectedWorks.value || [] : worksData.value);
});

const groupedWorksByCategory = computed(() => {
  const categories = [];
  const categoryMap = {};

  filteredWorks.value.forEach((work) => {
    const categoryItem = category.value.find((c) =>
        c.groups.some((g) => g.id === work.work_group_id)
    );

    const categoryName = categoryItem?.label || "Неизвестно";

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

  // Сортировка категорий по алфавиту
  // categories.sort((a, b) => a.name.localeCompare(b.name));

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
  setTimeout(() => {
    groupedWorksByCategory.value.forEach((category, categoryIndex) => {
      // Если чекбокс отмечен, сворачиваем все группы
      if (allGroupsCollapsed.value) {
        collapsedGroups.value[categoryIndex] = Object.keys(category.groups).map(key => key);
      } else {
        // Если чекбокс не отмечен, разворачиваем все группы
        collapsedGroups.value[categoryIndex] = [];
      }
    }, 0);

  })
};

// Добавление/удаление работы из списка выбранных работ
const toggleWork = (work) => {
  if (selectedWorks.value.includes(work)) {
    selectedWorks.value = selectedWorks.value.filter((item) => item !== work);
  } else {
    selectedWorks.value.push(work);
  }
  isChanged.value = true;
};

// Сохранение новых наборов
const setNewData = async () => {
  // Валидация и подготовка данных
  const { payload } = validateAndPrepareSetData(sets.value, selectedWorks.value);

  // if (emptyFields) {
  //   errors.value = emptyFields;
  //   return;
  // }
  errors.value = [];
  store.showModalLoader()

  let response;
  if (sets.value.id) { // Обновление набора
    response = await updateSet(sets.value.id, payload);
    // Успешное сохранение
    if(response.success){
      const updatedData = response.data;
      for (const [key, value] of Object.entries(updatedData)) {
        sets.value[key] = value;
        // if(dialogRef){
        //   sets.value[key] = value;
        // }
      }
      isChanged.value = false;
      setTimeout(() => store.addNewWorkCollectionToTable(updatedData))
    }
    else {
      errors.value = response.errors
    }
    store.hideModalLoader()
  }
  else { // Создание нового набора
    response = await createSet(payload);
    if(response.success) {
      emitNewCollection(response.data);
      dialogRef.value.close()
    }
    store.hideModalLoader()
  }

  // setTimeout(() => {
    // if (updatedData.id) {
    //   dialogRef?.value.close();
    // }
  // else {
  //   await emitNewCollection(updatedData);
  //   await dialogRef.value.close();
  // }
  // }, 500)
};

const emitNewCollection = (newCollection) => {
  emit("save", { contact: newCollection });
  store.addNewWorkCollectionToTable(newCollection)
  store.setNewModal({modalData: newCollection, modalTitle: 'collection'})
};

const roomTypeOptionsChanged = () => {
  isChanged.value = true
  const categories = dialogRef.value.data.category
  category.value = categories.filter((category) => {
    if(sets.value.room_type > 3){
      return category
    } else{
      return category.room_types.includes(sets.value.room_type)
    }
  })
}

// Вкладки
const leftActiveTab = ref(0)
const rightActiveTab = ref(0)

// Меню
const menu = ref();
const menuItems = ref([
  // {
  //   label: 'Удалить',
  //   icon: 'pi pi-trash',
  //   command: (event) => {
  //     if(sets.value.id){
  //       showDeleteConfirmPopup(event)
  //     }
  //   },
  // },
]);
const confirm = useConfirm()

const toggle = (event) => {
  menu.value.toggle(event);
};

const showDeleteConfirmPopup = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: `Вы точно хотите удалить "${sets.value.name}"?`,
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Отмена',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Удалить',
      severity: 'danger'
    },
    accept : async () => {
      const response = await deleteSet(sets.value.id);
      if (response.success) {
        dialogRef.value.close();
        emit("delete", { setsId: sets.value.id });
      }
    }
  });
}

// Управление состоянием модалки
const collapsed = ref(false)
if(dialogRef?.value?.data?.modalData?.isCollapsed){
  collapsed.value = true;
}

const closeModal = () => {
  const removedModal = {
    modalData: {
      id: sets.value.id
    },
    modalTitle: 'collection',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: sets.value.id, objectName: 'collection'});
  dialogRef.value.close();
};

const collapseModal = (value) => {
  emit("collapse", { id: sets.value.id ? sets.value.id : 0, value,  objectName: 'collection'});
  if(value){ // Задержка перед скрытием содержимого модалки
    setTimeout(() =>{
      collapsed.value = value;
    }, 100)
  } else {
    collapsed.value = value;
  }
};

const unCollapseModal = (event) => {
  const target = event.target.closest("button");  // Проверяем, клик был ли сделан по кнопке
  if (!target) {
    collapseModal(false);
  }
};

// getNewWorkCollectionForTable

</script>

<template>
  <div class="h-full">
    <modal-header
        :id="sets?.id"
        :title="`Набор ${sets?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isChanged"
        saveText="Сохранить"
        page="works-collections"
        icon="/images/menu/work.svg"
        backLink="/works-collections"
        @save="setNewData"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="sets && !collapsed" @submit.prevent="setNewData" class="modal-form">
      <section class="bg-modal-panel-bg p-2 pt-0 overflow-hidden h-full">
        <nav class="">
          <div class="flex items-center">
            <p @click = 'leftActiveTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 0}">Основное</p>
            <p @click = 'leftActiveTab = 1' class="lg:hidden custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 1}">Список работ</p>
          </div>
          <span @click.stop="leftActiveTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : leftActiveTab === 10}" title="История"/>
        </nav>

        <main class="pt-2 h-[calc(100%-50px)] overflow-auto">
          <div v-show="leftActiveTab === 0" class="grid md:grid-cols-1 gap-2">
            <ifta-label>
              <label for="name" class="text-sm">Наименование</label>
              <InputText
                  v-model="sets.name"
                  @input="isChanged = true"
                  rows="3"
                  cols="20"
                  :invalid="errors.includes('name')"
              />
            </ifta-label>
            <ifta-label>
              <label for="room_type" class="text-sm">Тип комнаты</label>
              <Select
                  v-model="sets.room_type"
                  @change="roomTypeOptionsChanged"
                  :options="roomTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Выберите"
                  class="w-full"
                  :invalid="errors.includes('room_type')"
              />
            </ifta-label>
            <ifta-label>
              <label for="type" class="text-sm">Тип набора</label>
              <Select
                  v-model="sets.type"
                  :options="[{label: 'Общий', value: 'general'}, {label: 'Личный', value: 'private'}]"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Выберите тип"
                  class="w-full"
                  :invalid="errors.includes('type')"
              />
            </ifta-label>
          </div>
          <section v-show="leftActiveTab === 1" class="lg:hidden   overflow-auto" >
            <Fieldset
                legend="Категории"
                :pt="ptFieldsetDealModal"
                :ptOptions="ptFieldsetOptions"
                class="text-center"
            >
              <div
                  class="rounded-md grid md:grid-cols-3 gap-2 px-1"
                  :class="{'border-[1px] !border-red-500':isEmptyField && !selectedCategories.length,}"
              >
                <button
                    v-for="(item, index) in category"
                    :key="index"
                    class="!text-black dark:border-surface-600 cursor-pointer select-none flex items-center justify-between"
                    @click="activateCategory(item)"
                >
                  <FormCheckbox
                      :label="item.label"
                      :checked="item.activated"
                      class="w-full"
                  />
                  <!-- <p class="text-sm">{{ item.label }}</p>
                  <input :checked="item.activated" type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"> -->
                </button>
              </div>
            </Fieldset>

            <div class="flex items-center m-1 mt-2 text-surface-800 dark:text-surface-100 font-semibold">
              <input
                  type="checkbox"
                  id="showOnly"
                  v-model="showOnlySelected"
                  :class="{ 'bg-slate-400': showOnlySelected }"
                  class="mr-2 shrink-0 disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"
              />
              <label for="showOnly" class="mr-4 cursor-pointer dark:text-surface-300">Показать только выбранные работы</label>
              <input
                  type="checkbox"
                  id="collapseGroups"
                  v-model="allGroupsCollapsed"
                  @click=" collapseGroups"
                  class="mr-1 shrink-0 disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"
              />
              <label for="collapseGroups" class="cursor-pointer dark:text-surface-300">Свернуть группы</label>
            </div>

            <div class="p-1">
              <InputText
                  type="text"
                  v-model="search"
                  placeholder="Поиск по названиям работ"
                  class="w-full p-2 mb-4 border rounded-md"
              />
            </div>

            <div class="relative">
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
                <h3
                    class="font-semibold px-1 py-2 border-slate-600 bg-slate-600 text-center text-white text-[1.06rem]"
                >
                  {{ category.name }}
                </h3>

                <div
                    v-for="(works, groupName) in category.groups"
                    :key="groupName"
                    class="border-[1px] rounded-md mb-1 dark:border-surface-500"
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
                        class="p-2 border-2 rounded-lg mb-2 flex justify-between items-center gap-1"
                        :class="{
                    'bg-surface-400': selectedWorks.includes(work)}"
                    >
                      <div class="flex items-center gap-1">
                        <h4>{{ work.name }}</h4>
                      </div>
                      <div>
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
          </section>
          <div v-show="leftActiveTab === 10">
            <change-journal :events="sets.events"/>
          </div>
        </main>
      </section>

      <section class="bg-modal-panel-bg px-2 max-lg:hidden overflow-hidden h-full">
        <main class="pt-2 h-full overflow-auto" >
          <div>
            <h2 class="font-[650] mt-2 mb-1 text-center text-surface-700 dark:text-surface-100">
              Категории
            </h2>
            <div
                class="rounded-md grid md:grid-cols-3 gap-2 px-1 py-2"
                :class="{
              'border-[1px] !border-red-500':
                isEmptyField && !selectedCategories.length,
            }"
            >
              <div
                  v-for="(item, index) in category"
                  :key="index"
                  class="cursor-pointer dark:border-surface-500 select-none flex items-center justify-between"
                  @click="activateCategory(item)"
              >
                <FormCheckbox
                  :label="item.label"
                  :checked="item.activated"
                  class="w-full"
                />              
                <!-- <p class="text-sm">{{ item.label }}</p>
                <input :checked="item.activated" type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"> -->
              </div>
            </div>
          </div>

          <div class="flex items-center m-1 mt-2 text-surface-800 dark:text-surface-100 font-semibold">
            <input
                type="checkbox"
                id="showOnly"
                v-model="showOnlySelected"
                :class="{ 'bg-slate-400': showOnlySelected }"
                class="mr-2 shrink-0 disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"
            />
            <label for="showOnly" class="mr-4 cursor-pointer">Показать только выбранные работы</label>
            <input
                type="checkbox"
                id="collapseGroups"
                v-model="allGroupsCollapsed"
                @click=" collapseGroups"
                class="mr-1 shrink-0 disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600"
            />
            <label for="collapseGroups" class="cursor-pointer">Свернуть группы</label>
          </div>

          <div class="p-1">
            <InputText
                type="text"
                v-model="search"
                placeholder="Поиск по названиям работ"
                class="w-full p-2 mb-4 border rounded-md"
            />
          </div>

          <div class="relative">
            <h2 class="font-[650] mb-1 text-center text-surface-700 dark:text-surface-100">
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
              <h3
                  class="font-semibold px-1 py-2 border-slate-600 bg-slate-600 text-center text-white text-[1.06rem]"
              >
                {{ category.name }}
              </h3>

              <div
                  v-for="(works, groupName) in category.groups"
                  :key="groupName"
                  class="border-[1px] rounded-md mb-1 dark:border-surface-500"
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
                      class="p-2 border-2 rounded-lg mb-2 flex justify-between items-center gap-1"
                      :class="{
                    'bg-surface-400': selectedWorks.includes(work)}"
                  >
                    <div class="flex items-center gap-1">
                      <h4>{{ work.name }}</h4>
                    </div>
                    <div>
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
        </main>
      </section>

    </form>
 </div>
</template>

