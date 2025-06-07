<script setup>
import ModalHeader from "~/components/Common/ModalHeader.vue";
import {useMainStore} from "~/stores/main.js";
import {useListsStore} from "~/stores/lists.js";
import {createSaveDeduction, getDeductionData} from "~/services/api/deductionsServices.js";

const dialogRef = inject('dialogRef');
const store = useMainStore();
const listsStore = useListsStore();
const emit = defineEmits([]);
const {$api, $showErrorToast} = useNuxtApp()
const route = useRoute()

const deductionOriginal = ref(dialogRef && dialogRef.value ? JSON.parse(JSON.stringify(dialogRef.value.data.modalData)) : {});
const deduction = ref(deductionOriginal.value ? JSON.parse(JSON.stringify(deductionOriginal.value)) : null);
const collapsed = ref(false)
const isChanged = ref(false);
const buttonText = ref("Сохранить");

const prorabList = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }
  return listsStore.usersWithRolesList.filter(user =>
      user.roles.some(role => role.id === 3)
  );
});

if (deduction.value && !deduction.value.id) {
  buttonText.value = "Создать";
}

if(deduction.value?.isCollapsed){
  collapsed.value = true;
}
if(!deduction.value || Object.keys(deduction.value).length <= 2){
  getDeductionData(route, deduction, deductionOriginal, isChanged, buttonText, $api);
}

const onSaveButtonClick = () => {
  createSaveDeduction(deduction, deductionOriginal, store, isChanged, $api, dialogRef, $showErrorToast);
};

watch(deduction, (newValue) => {
  isChanged.value = deepEqual(deductionOriginal.value, newValue);
}, { deep: true });

// Вкладки
const leftActiveTab = ref(0)
const rightActiveTab = ref(0)

// Управление состоянием модалки
const closeModal = () => {
  const removedModal = {
    modalData : deduction.value,
    modalTitle: 'deduction',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: deduction.value.id, objectName: 'deduction'});
  dialogRef?.value.close();
};

const collapseModal = (value) => {
emit("collapse", { id: deduction.value.id, value,  objectName: 'deduction'});

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
        :id="deduction?.id"
        :title="`Вычет ${deduction?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isChanged"
        :saveText="buttonText"
        page="deductions"
        icon="/images/menu/deductions.svg"
        backLink="/deductions"
        @save="onSaveButtonClick"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="deduction && !collapsed" @submit.prevent="onSaveButtonClick" class="modal-form">
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
                    v-model="deduction.employee_id"
                    :options="prorabList"
                    optionLabel="name"
                    optionValue="employee.id"
                />
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Официальная зарплата</label>
                <InputNumber v-model="deduction.official_salary" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Налоги</label>
                <InputNumber v-model="deduction.tax" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Премии</label>
                <InputNumber v-model="deduction.bounty" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Штрафы</label>
                <InputNumber v-model="deduction.fines" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label>
                <label>Дата</label>
                <DatePicker
                    v-model="deduction.date"
                    class="w-full"
                    :show-button-bar="true"
                    :maxDate="new Date()"
                    id="date_changed"
                    date-format="dd.mm.yy"
                    :disabled="deductionOriginal.date"
                >
                  <template #date="slotProps">
                    <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                  </template>
                </DatePicker>
              </ifta-label>
            </div>
          </div>

          <div v-show="leftActiveTab === 10">
            <change-journal :events="deduction.events"/>
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