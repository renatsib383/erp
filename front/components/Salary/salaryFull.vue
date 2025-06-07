<script setup>
import ModalHeader from "~/components/Common/ModalHeader.vue";
import {useMainStore} from "~/stores/main.js";
import {useListsStore} from "~/stores/lists.js";

const dialogRef = inject('dialogRef');
const store = useMainStore();
const listsStore = useListsStore();
const emit = defineEmits(["save"]);
const route = useRoute()

const salaryOriginal = ref(dialogRef && dialogRef.value ? JSON.parse(JSON.stringify(dialogRef.value.data.modalData)) : {});
const salary = ref(salaryOriginal.value ? JSON.parse(JSON.stringify(salaryOriginal.value)) : null);
const errors = ref(null);
const collapsed = ref(false)
const isChanged = ref(false);
const buttonText = ref("Сохранить");

onMounted(() => {
  console.log(salary.value)
  // if(!ddsLists.value) listsStore.fetchDdsLists()
})

const prorabList = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }
  return listsStore.usersWithRolesList.filter(user =>
      user.roles.some(role => role.id === 3)
  );
});

if (salary.value && !salary.value.id) {
  buttonText.value = "Создать";
}
if (salary.value && !salary.value.user) {
  salary.value.user = {
    id: null,
    name: null
  }
}
if(salary.value?.isCollapsed){
  collapsed.value = true;
}
if(!salary.value || Object.keys(salary.value).length <= 2){
  // getData(route, salary, salaryOriginal, isChanged, buttonText, $api);
}

const saveNewState = () => {
  console.log('saveNewState');
}

watch(salary, (newValue) => {
  isChanged.value = deepEqual(salaryOriginal.value, newValue);
}, { deep: true });

// Вкладки
const leftActiveTab = ref(0)
const rightActiveTab = ref(0)

// Управление состоянием модалки
const closeModal = () => {
  const removedModal = {
    modalData : salary.value,
    modalTitle: 'salary',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: salary.value.id, objectName: 'salary'});
  dialogRef?.value.close();
};

const collapseModal = (value) => {
emit("collapse", { id: salary.value.id, value,  objectName: 'salary'});

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
</script>

<template>
  <div class="h-full">
    <modal-header
        :id="salary?.id"
        :title="`ЗП ${salary?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isChanged"
        :saveText="buttonText"
        page="salary"
        icon="/images/menu/salary.svg"
        backLink="/salary"
        @save="saveNewState"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="salary && !collapsed" @submit.prevent="saveNewState" class="modal-form">
      <section class="p-2 pt-0 overflow-hidden h-full bg-modal-panel-bg">
        <nav class="custom-nav">
          <div class="flex items-center">
            <p @click = 'leftActiveTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 0}">Основное</p>
          </div>
          <span @click.stop="leftActiveTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : leftActiveTab === 10}" title="Журнал изменений"></span>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto">
          <div v-show="leftActiveTab === 0">

            <div class="rounded-md grid md:grid-cols-2 gap-2">
              <ifta-label>
                <label class="text-sm text-gray-400">Прораб</label>
                <Select
                    class="w-full h-full"
                    v-model="salary.user.id"
                    :options="prorabList"
                    optionLabel="name"
                    optionValue="id"
                />
              </ifta-label>

              <ifta-label>
                <label class="text-sm text-gray-400">Кол-во объектов в работе</label>
                <InputNumber v-model="salary.objects_count" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Дельта</label>
                <InputNumber v-model="salary.delta" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Выработка Акты</label>
                <InputNumber v-model="salary.acts" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Черновой материал</label>
                <InputNumber v-model="salary.draft_material" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Спецмонтаж</label>
                <InputNumber v-model="salary.special_installation" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Проектирование</label>
                <InputNumber v-model="salary.design" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Чистовые материалы</label>
                <InputNumber v-model="salary.finishing_material" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Допы</label>
                <InputNumber v-model="salary.extras" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Официальная зарплата</label>
                <InputNumber v-model="salary.official_salary" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Налоги</label>
                <InputNumber v-model="salary.tax" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Премии</label>
                <InputNumber v-model="salary.bounty" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Штрафы</label>
                <InputNumber v-model="salary.fines" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Общая зарплата</label>
                <InputNumber v-model="salary.total_salary" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Аванс</label>
                <InputNumber v-model="salary.advance" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Остаток</label>
                <InputNumber v-model="salary.remainder" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>

            </div>
          </div>

          <div v-show="leftActiveTab === 10">
            <change-journal :events="salary.events"/>
          </div>
        </main>
      </section>

      <section class="max-lg:hidden p-2 pt-0 overflow-hidden h-full bg-modal-panel-bg">
        <nav class="custom-nav">
          <div class="flex items-center">

          </div>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto">

        </main>
      </section>
    </form>
  </div>
</template>