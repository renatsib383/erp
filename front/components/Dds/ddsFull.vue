<script setup>
import ChangeJournal from "~/components/Common/СhangeJournal.vue";
import ModalHeader from "~/components/Common/ModalHeader.vue";
import DocumentsScans from "~/components/Dds/documentsScans.vue";
import comment from './comment.vue'
import ptDialog from "~/assets/presets/custom/baseDialogPreset.js";
import {useMainStore} from "~/stores/main.js";
import {useListsStore} from "~/stores/lists.js";
import {useDialog} from "primevue/usedialog";
import {fetchDealSuggestions, getData, save, uploadFile} from "~/services/api/ddsServices.js";
const { $api, $showErrorToast} = useNuxtApp();

const user = useSanctumUser();
const dialog = useDialog();
const dialogRef = inject('dialogRef');
const store = useMainStore();
const listsStore = useListsStore();
const emit = defineEmits(["save"]);
const route = useRoute()

const ddsOriginal = ref(dialogRef && dialogRef.value ? JSON.parse(JSON.stringify(dialogRef.value.data.modalData)) : {});
const dds = ref(ddsOriginal.value ? JSON.parse(JSON.stringify(ddsOriginal.value)) : null);
const errors = ref(null);
const collapsed = ref(false)
const isChanged = ref(false);
const buttonText = ref("Сохранить");
const ddsLists = computed(() => listsStore.ddsLists)

onBeforeMount(() => {
  if (dds.value && !dds.value.id) {
    buttonText.value = "Создать";
  }
  if(dds.value?.isCollapsed){
    collapsed.value = true;
  }
  if(!dds.value || Object.keys(dds.value).length <= 2){
    getData(route, dds, ddsOriginal, isChanged, buttonText, $api).then(() => {
      if(!dds.value.final_act) dds.value.final_act = false
      if(!dds.value.partial_payment) dds.value.partial_payment = 0
      if(!dds.value.deposit_minus) dds.value.deposit_minus = 0
      if(!dds.value.discount_minus) dds.value.discount_minus = 0

      dds.value.partialPaymentActive = !!dds.value.partial_payment
      dds.value.depositMinusActive = !!dds.value.deposit_minus
      dds.value.discountMinusActive = !!dds.value.discount_minus
    })
  }
  if (dds.value && !dds.value.deal){
    dds.value.deal = {
      id: null,
      uid: null,
      coef: null
    };
  }
  if (dds.value && !dds.value.date_transaction){
    dds.value.date_transaction = new Date()
  }
})

onMounted(() => {
  if(!ddsLists.value) listsStore.fetchDdsLists()
})

const prorabList = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }
  return listsStore.usersWithRolesList.filter(user =>
      user.roles.some(role => role.id === 3)
  );
});

const selectedTypeItems = computed (() => {
  if (!ddsLists.value?.type) {
    return [];
  }
  const selectedType = ddsLists.value.type.find(type => type.id === dds.value.type);
  return selectedType ? selectedType.items : [];
})

const callSave = () => {
  save(dds, ddsOriginal, errors, store, isChanged, $api, dialogRef, $showErrorToast);
};

const showCommentModal = () => {
  let dialogref = dialog.open( comment , {
    props: {
      draggable: false,
      modal: false,
      pt: ptDialog,
      appendTo: document.querySelector('.main'),
      header: 'Добавить комментарий'
    },
    data: {
      dds: dds.value
    },
    emits: {
      onSave: (newData) => addNewCommentToEvents(newData.comment),
    }
  })
}

const addNewCommentToEvents = (comment) => {
  const lastEventId = dds.value.events[dds.value.events.length - 1]?.id || 0
  const willBeChanged = JSON.parse(JSON.stringify(isChanged.value))
  const event = {
    id: lastEventId + 1,
    eventable_id: 4,
    type: "comment",
    data: [],
    text: comment,
    user_id: user.id,
    user: user,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null
  }
  dds.value.events.push(event)
  // leftActiveTab.value = 10 // Откроем журнал
  if(!willBeChanged){
    setTimeout(() => isChanged.value = false)
  }
}

const onUploadButtonClick = (event) => {
  const file = event.files[0];
  if(file.type.includes('image') || file.type.includes('pdf')){
    uploadFile(event.files[0], dds, isChanged, $api);
  }
}

// Автокомплит
const selectedDealIndex = ref(-1);
const dealSuggestions = ref([])
const dealSuggestionsDelay = ref(null)
const dealIsSetting = ref(false)

const getDealSuggestions = () => {
  const query = dds.value.deal.uid
  if (query.length > 2) {
    if (dealSuggestionsDelay.value) {
      clearTimeout(dealSuggestionsDelay.value);
    }

    dealSuggestionsDelay.value = setTimeout(async () => {
      dealSuggestions.value = await fetchDealSuggestions($api, query);
      dealIsSetting.value = true
    }, 300);
  }
}

const setDealSuggestion = (suggestion) => {
  dds.value.deal_id = suggestion.id
  dds.value.deal.uid =  suggestion.uid;
  dds.value.deal.coef =  suggestion.coef;
  dealSuggestions.value = []
  dealIsSetting.value = false
}

const moveDownSuggestion = () => {
  if (selectedDealIndex.value < dealSuggestions.value.length - 1) {
    selectedDealIndex.value++;
    dds.value.deal_id = dealSuggestions.value[selectedDealIndex.value].id;
    dds.value.deal.uid = dealSuggestions.value[selectedDealIndex.value].uid;
    dds.value.deal.coef = dealSuggestions.value[selectedDealIndex.value].coef;
  }
};

const moveUpSuggestion = () => {
  if (selectedDealIndex.value > 0) {
    selectedDealIndex.value--;
    dds.value.deal_id = dealSuggestions.value[selectedDealIndex.value].id;
    dds.value.deal.uid = dealSuggestions.value[selectedDealIndex.value].uid;
    dds.value.deal.coef = dealSuggestions.value[selectedDealIndex.value].coef;
  }
};

const sumWithoutCF = computed(() => {
  return Math.ceil(dds.value?.total / dds.value.deal.coef) || 0;
});

watch(dds, (newValue) => {
  if (dds.value && !dds.value.deal){
    dds.value.deal = {
      id: null,
      uid: null,
      coef: null
    };
  }
  isChanged.value = deepEqual(ddsOriginal.value, newValue, [], ['date_transaction']);

}, { deep: true });

// Вкладки
const leftActiveTab = ref(0)
const rightActiveTab = ref(0)

// Управление состоянием модалки
const closeModal = () => {
  const removedModal = {
    modalData : dds.value,
    modalTitle: 'dds',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: dds.value.id, objectName: 'dds'});
  dialogRef?.value.close();
};

const collapseModal = (value) => {
  emit("collapse", { id: dds.value.id, value,  objectName: 'dds'});
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
        :id="dds?.id"
        :title="`ДДС ${dds?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isChanged"
        :saveText="buttonText"
        page="dds"
        icon="/images/menu/dds.svg"
        backLink="/dds"
        @save="callSave"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="dds && !collapsed" @submit.prevent="callSave" class="modal-form">
      <section class="p-2 pt-0 overflow-hidden h-full bg-modal-panel-bg">
        <nav class="custom-nav">
          <div class="flex items-center">
            <p @click = 'leftActiveTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 0}">Основное</p>
            <p @click = 'leftActiveTab = 1' class="lg:hidden custom-nav-tab" :class="{'custom-nav-tab_active' : leftActiveTab === 1}">Сканы документов</p>
          </div>
          <span @click.stop="leftActiveTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : leftActiveTab === 10}" title="Журнал изменений"></span>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto">
          <div v-show="leftActiveTab === 0">

            <div class="rounded-md grid md:grid-cols-2 gap-2">
              <ifta-label
                  v-if="dds.type === 1 || (dds.type === 2 && dds.item !== '27')"
                  class="relative"
              >
                <label class="text-sm text-gray-400">ИД объекта</label>
                <InputText
                    v-model="dds.deal.uid"
                    @input="getDealSuggestions"
                    @keydown.down.prevent="moveDownSuggestion"
                    @keydown.up.prevent="moveUpSuggestion"
                    @keydown.enter.prevent.stop="setDealSuggestion(dealSuggestions[selectedDealIndex])"
                    type="text"
                    class="w-full rounded-none h-full"
                    placeholder="Начните ввод и выберите из списка"
                />
                <ul
                    v-show="dealSuggestions.length"
                    class="absolute top-15px bg-white border-surface-300 dark:border-surface-600 dark:bg-surface-800 z-10 py-2 w-full gap-1 flex flex-col border-[1px] border-t-0 rounded-b-lg max-h-[300px] overflow-y-auto px-1"
                >
                  <li
                      v-for="(suggestion, index) in dealSuggestions"
                      :key="index"
                      class="cursor-pointer hover:bg-primary-400 hover:text-white text-sm p-1"
                      :class="{ 'bg-primary-400 text-white': index === selectedDealIndex }"
                      @click="setDealSuggestion(suggestion)"
                  >
                    Объект {{suggestion.uid}}
                  </li>
                </ul>
                <ul
                    v-show="dealSuggestions.length === 0 && dealIsSetting"
                    class="absolute top-15px bg-white border-surface-300 dark:border-surface-600 dark:bg-surface-800 z-10 py-2 w-full gap-1 flex flex-col border-[1px] border-t-0 rounded-b-lg max-h-[300px] overflow-y-auto px-1"
                >
                  Такого объекта не существует
                </ul>
              </ifta-label>
              <ifta-label
                  v-if="dds.type === 3"
                  class="relative"
              >
                <label class="text-sm text-gray-400">Касса получатель</label>
                <Select
                    class="w-full h-full"
                    v-model="dds.cash_register_recipient_id"
                    :options="ddsLists ? ddsLists.cashRegister : []"
                    optionLabel="title"
                    optionValue="id"
                />
              </ifta-label>
              <ifta-label v-if="dds.type === 2 && dds.item === '27'">
                <label class="text-sm text-gray-400">Прораб</label>
                <Select
                    class="w-full h-full"
                    v-model="dds.prorab"
                    :options="prorabList"
                    optionLabel="name"
                    optionValue="employee.id"
                />
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Тип</label>
                <Select
                    class="w-full h-full"
                    v-model="dds.type"
                    :options="ddsLists ? ddsLists.type : []"
                    optionLabel="title"
                    optionValue="id"
                />
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Операция</label>
                <Select
                    class="w-full h-full"
                    v-model="dds.item"
                    :options="selectedTypeItems"
                    optionLabel="title"
                    optionValue="id"
                    :placeholder="!dds.type ? 'Сначала укажите тип' : 'Выберите из списка'"
                />
              </ifta-label>
              <ifta-label>
                <label>Дата</label>
                <DatePicker
                    v-model="dds.date_transaction"
                    class="w-full"
                    :show-button-bar="true"
                    :maxDate="new Date()"
                    id="date_changed"
                    date-format="dd.mm.yy"
                    :disabled="ddsOriginal.date_transaction"
                >
                  <template #date="slotProps">
                    <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                  </template>
                </DatePicker>
              </ifta-label>

<!--              <ifta-label>-->
<!--                <label class="text-sm text-gray-400">Коэффициент</label>-->
<!--                <InputNumber v-model="dds.temp_deal_coef" min="0" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>-->
<!--              </ifta-label>-->
<!--              <ifta-label>-->
<!--                <label class="text-sm text-gray-400">Скидка</label>-->
<!--                <InputNumber v-model="dds.temp_deal_skidka" min="0" class="w-full"/>-->
<!--              </ifta-label>-->
              <ifta-label>
                <label class="text-sm text-gray-400">Сумма</label>
                <InputNumber v-model="dds.total" min="0" class="w-full"  @input="primeInputRefocus"/>
              </ifta-label>
              <ifta-label v-if="Number(dds.item) === 1">
                <label class="text-sm text-gray-400">Сумма без КФ {{dds.deal.coef ? `(${dds.deal.coef})` : null}}</label>
                <InputNumber v-model="sumWithoutCF" min="0" class="w-full" disabled/>
              </ifta-label>
<!--              <ifta-label>-->
<!--                <label class="text-sm text-gray-400">Cумма аванса</label>-->
<!--                <InputNumber v-model="dds.avance_sum" min="0" class="w-full"/>-->
<!--              </ifta-label>-->
<!--              <ifta-label>-->
<!--                <label class="text-sm text-gray-400">ФОТР</label>-->
<!--                <InputNumber v-model="dds.fotr" min="0" class="w-full"/>-->
<!--              </ifta-label>-->
              <ifta-label>
                <label class="text-sm text-gray-400">Касса</label>
                <Select
                    class="w-full h-full"
                    v-model="dds.cash_register_id"
                    :options="ddsLists ? ddsLists.cashRegister : []"
                    optionLabel="title"
                    optionValue="id"
                />
              </ifta-label>
              <ifta-label>
                <label class="text-sm text-gray-400">Статус</label>
                <Select
                    class="w-full h-full"
                    v-model="dds.status"
                    id="status"
                    :options="[{id: 0, name: 'Подготовка'}, {id: 1, name: 'В обработке'}, {id: 2, name: 'Согласован'}, {id: 3, name: 'Принят'}, {id: 4, name: 'Не принят'},]"
                    optionValue="id"
                    optionLabel="name"
                />
              </ifta-label>

            </div>

            <div class="rounded-md grid md:grid-cols-2 gap-2 mt-2">
              <FormCheckbox
                  v-if="dds.type === 1 && dds.item === '1'"
                  v-model="dds.final_act"
                  label="Финальный акт"
                  class="max-h-[58px]"
                  :disabled="ddsOriginal.final_act"
              />
              <div v-if="dds.type === 1">
                <FormCheckbox
                    v-model="dds.partialPaymentActive"
                    label="Частичная оплата"
                    class="max-h-[58px]"
                    :disabled="ddsOriginal.partial_payment"
                />
                <ifta-label v-if="dds.partialPaymentActive" >
                  <label>Укажите сумму</label>
                  <input-number v-model="dds.partial_payment" class="w-full"   :disabled="ddsOriginal.partial_payment"/>
                </ifta-label>
              </div>
              <div v-if="dds.type === 1">
                <FormCheckbox
                    v-model="dds.depositMinusActive"
                    label="Оплата с депозита"
                    class="max-h-[58px]"
                    :disabled="ddsOriginal.deposit_minus"
                />
                <ifta-label v-if="dds.depositMinusActive">
                  <label>Укажите сумму</label>
                  <input-number v-model="dds.deposit_minus" class="w-full" :disabled="ddsOriginal.deposit_minus"/>
                </ifta-label>
              </div>
              <div v-if="dds.type === 1">
                <FormCheckbox
                    v-model="dds.discountMinusActive"
                    label="Скидка"
                    class="max-h-[58px]"
                    :disabled="ddsOriginal.discount_minus"
                />
                <ifta-label v-if="dds.discountMinusActive">
                  <label>Укажите сумму</label>
                  <input-number v-model="dds.discount_minus" class="w-full" :disabled="ddsOriginal.discount_minus"/>
                </ifta-label>
              </div>
            </div>

            <div class="rounded-md grid md:grid-cols-1 mt-2">
              <ifta-label>
                <label>Комментарий</label>
                <Textarea v-model="dds.comment" rows="5" cols="1" />
              </ifta-label>
            </div>

          </div>
          <div v-show="leftActiveTab === 1" class="lg:hidden">
            <documents-scans :dds="dds" @upload="onUploadButtonClick" />
          </div>
          <div v-show="leftActiveTab === 10">
            <change-journal :events="dds.events"/>
            <div class="flex justify-center py-2">
              <button @click.stop.prevent="showCommentModal" class="button-modal disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!dds.id" :title="!dds.id ? 'Доступно после создания' : 'Добавить'">Добавить комментарий</button>
            </div>
          </div>
        </main>
      </section>

      <section class="max-lg:hidden p-2 pt-0 overflow-hidden h-full bg-modal-panel-bg">
        <nav class="custom-nav">
          <div class="flex items-center">
           <p @click = 'rightActiveTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : rightActiveTab === 0}">Сканы документов</p>
          </div>
        </nav>
        <main class="h-[calc(100%-50px)] pt-2 overflow-auto">
          <div v-show="rightActiveTab === 0">
            <documents-scans :dds="dds" @upload="onUploadButtonClick" />
          </div>
        </main>
      </section>
    </form>
  </div>
</template>