<script setup>
import RoomFull from "~/components/Deals/RoomFull.vue";
import ptFieldsetDealModal from '@/assets/presets/custom/fieldsetDealModal.js';
import {updateSmet} from "~/services/api/deals-services/smetServices.js";
const ptFieldsetOptions = { mergeSections: true, mergeProps: true };

const props = defineProps({
  deal_id: Number,
  deal_uid: Number,
  deferred_skidka_paid: Boolean,
  skidka: Boolean,
  actsList: {
    type: Array,
    default: () => [],
  },
  actStatusList: Array,
  approvedSmeta: Object,
});
const emit = defineEmits(['change-window', 'download-pdf', 'change-defferedSkidkaStatus']);

const acts = ref(props.actsList);
const deferredSkidkaPaid = ref(false)
const act_statuses = props.actStatusList.map((status, index) => ({
  label: status,
  value: index,
}));

const isLastActFinished = computed(() => {
  const lastAct = acts.value[acts.value.length - 1];
  return lastAct?.status >= 2 || false;
});
const actType = ref(null)

watch(props, () => {
  acts.value = props.actsList;
})
onMounted(() => {
  deferredSkidkaPaid.value = props.deferred_skidka_paid
  actType.value = props.approvedSmeta?.rooms.all ? 'singleAct' : 'breakdownByRoom';
})

const changeDefferedSkidkaStatus = () => {
  deferredSkidkaPaid.value = !deferredSkidkaPaid.value;
  emit('change-defferedSkidkaStatus', deferredSkidkaPaid.value);
}

const getDefferedDiscount = (actTotal) => {
  if(props.skidka){
    return Math.round((actTotal * (props.skidka / (100 - props.skidka))) * 100) / 100;
  }
  return 0;
}

const getTotalDefferedDiscount = () => {
  let total = 0;
  acts.value.forEach((act) => {
    total += getDefferedDiscount(act.total)
  })
  return total ? total : 0;
}
const createNewAct = () => {
  emit("open-act", {deal_id: null, user_id: null, total: null, works: null, additional: null},);
};

const updateAct = (act) => {
  emit("open-act", act);
};

const formatDate = (value) => {
  const date = new Date(value);
  return value ? `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}` : null;
}

const downloadPDF = (actId) => {
  emit("download-pdf", 'act', actId, props.deal_id);
}

const changeActType = async() => {
  if(props.approvedSmeta){
    const thisSmet = JSON.parse(JSON.stringify(props.approvedSmeta));
    thisSmet.rooms.all = null;
    if(actType.value === "singleAct"){
      thisSmet.rooms.all = true;
    }
    await updateSmet(thisSmet);
  }
}
</script>

<template>
    <section>
      <Fieldset 
        legend="Отложенная скидка"
        :pt="ptFieldsetDealModal"
        :ptOptions="ptFieldsetOptions"
      >
        <div class="dark:text-surface-300 flex items-center justify-between border-[1px] rounded-lg dark:border-surface-300 cursor-pointer list-none p-2 text-slate-600">
            <p>Итого:</p>
            <div class="flex items-center gap-4">
              <span>{{getTotalDefferedDiscount()}}руб.</span>
              <div class="flex flex-col items-center">
                <label class="text-surface-500 text-sm">Выплачено</label>
                <input :checked="deferredSkidkaPaid" @click="changeDefferedSkidkaStatus" type="checkbox" class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 rounded-full h-6 w-10 relative transition-all duration-100 ease-out hover:bg-gray-400 checked:bg-emerald-500 checked:hover:bg-emerald-600">
              </div>
            </div>
          </div>
      </Fieldset>

      <Fieldset
          legend="Тип акта"
          :pt="ptFieldsetDealModal"
          :ptOptions="ptFieldsetOptions"
      >
        <div class="gap-1 flex flex-col text-gray-600">
            <div class="flex gap-2">
              <input
                v-model="actType"
                @change="changeActType"
                value="breakdownByRoom"
                id="breakdownByRoom"
                name="actType"
                type="radio"
                class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                :disabled="actsList.length"
              />
              <label for="breakdownByRoom" class="cursor-pointer">С разбивкой по комнатам</label>
            </div>
            <div class="flex gap-2">
              <input
                  v-model="actType"
                  @change="changeActType"
                  value="singleAct"
                  id="singleAct"
                  name="actType"
                  type="radio"
                  class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  :disabled="actsList.length"
              />
              <label for="singleAct" class="cursor-pointer">Единый акт</label>
            </div>
          </div>
      </Fieldset>

      <Fieldset 
        legend="Акты"
        :pt="ptFieldsetDealModal"
        :ptOptions="ptFieldsetOptions"
        >
        <div class="custom-ifta-label-block flex flex-col gap-2">
          <div
            class="flex flex-col justify-between border-[1px] cursor-pointer list-none p-2 text-slate-600 hover:bg-slate-200"
            v-for="(act, index) in acts"
            :key="act.id"
            @click="updateAct(act)"
          >
            <div class="grid grid-cols-2 items-center justify-between w-full font-medium">
              <p class="items-center">
                <span class="pi pi-file mr-1"/>
                АКТ-{{ index+1 }}-{{ deal_uid }}-Прораб
<!--                от {{ formatDate(act.created_at) }}-->
              </p>
              <div class="flex items-center justify-between">
                <span>{{act_statuses[act.status].label}}</span>
                <span title="Загрузить PDF" class="pi pi-file-pdf text-xl p-2" @click.stop="downloadPDF(act.id)"/>
              </div>
            </div>
            <div class="flex flex-col gap-1 text-sm mt-1">
              <p>Итого к оплате: {{ Math.round(act.total * 100) / 100 }}руб.</p>
              <p>Отложенная скидка: {{ getDefferedDiscount(act.total) }}руб.</p>
              <p>Дата оплаты: {{formatDate(act.date_paid)}}</p>
              <p>Дата подписания: {{formatDate(act.date_sign)}}</p>
            </div>

          </div>

          <div class="flex items-center justify-center">
            <button
              v-if="(acts && acts.length === 0) || (acts && acts.length > 0 && isLastActFinished)"
              @click="createNewAct()"
              class="mt-2 button-modal"
            >
              Создать акт
            </button>
          </div>
        </div>
      </Fieldset>
    </section>
    <section
      class="h-full ease-in-out transition"
      v-if="activeWindow === 'actFull'"
      :class="{
        'slide-up-enter-active': activeWindow === 'Room',
        'slide-up-leave-active': activeWindow === 'Deals',
      }"
    >
      <div
        class="flex items-center justify-between shrink-0 px-4 py-[7.5px] border-t-[1px] bg-slate-500 dark:!border-surface-800 text-white"
      >
        <div>
          <button
            v-show="roomChanged"
            @click="saveRoomState"
            class="absolute right-14 bg-white border-0 text-slate-500 flex items-center justify-center rounded-md p-1"
          >
            <i class="pi pi-check-circle mr-1"></i>
            <p>Сохранить</p>
          </button>
          <button
            @click="changeWindow('Deals')"
            class="relative flex items-center justify-center mr-2 last:mr-0 w-8 h-8 border-0 rounded-full text-white bg-transparent transition duration-200 ease-in-out hover:text-slate-500 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus:outline-offset-0 focus:ring focus:ring-inset focus:ring-primary-400 overflow-hidden"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
      <RoomFull class="h-[calc(100%-54px)]" ref="roomFull" />
    </section>
</template>
