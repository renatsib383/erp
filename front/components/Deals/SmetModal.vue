<script setup>
import {createSmet, updateSmet} from "~/services/api/deals-services/smetServices.js";

const store = useMainStore()
const dialogRef = inject("dialogRef");
const emit = defineEmits(["save"]);
const {$showInfoToast} = useNuxtApp();

// onMounted(()=>{
//   smetOriginal.value.rooms.all ? actType.value = 'singleAct' : actType.value = 'breakdownByRoom'
// })

const smetOriginal = ref(dialogRef.value.data.smet);
const smet = ref({ ...smetOriginal.value });

const copyFromOtherSmets = dialogRef.value.data.copyFromOtherSmets;
const disableEdit = dialogRef.value.data.disableEdit;
const anyRooms = dialogRef.value.data.anyRooms
const anyWorks = dialogRef.value.data.anyWorks
const anyActs = dialogRef.value.data.anyActs
const buttonText = smet.value.id ? "Сохранить" : "Создать";
const withRooms = ref(false);
const withWorks = ref(false);
// const actType = ref('');
const isChanged = ref(false)
const errors = ref([])

const confirmSmetaCheckbox = ref(null)

watch(smet, () => {
  isChanged.value = true;
},{deep: true})

const setNewSmetState = async () => {
  store.showModalLoader()
  if (withWorks.value) {
    smet.value.rooms.works = { ...copyFromOtherSmets.rooms.works };
  }
  if (withRooms.value) {
    copyFromOtherSmets.rooms.list.forEach((item) => {
      if (!smet.value.rooms.list.includes(item.id)) {
        smet.value.rooms.list.push(item);
      }
    });
  }

  smet.value.rooms.all = null;

  // На обновление
  if (smet.value.id) {
    const response = await updateSmet(smet.value);
    if(response.success){
      for (const [key, value] of Object.entries(response.updatedSmet)) {
        smetOriginal.value[key] = value;
      }
      emit("save", { newSmet: response.updatedSmet });
      errors.value = []
      setTimeout(() => {
        dialogRef.value.close();
      });
    }
    else{
      errors.value = response.errors
    }

    store.hideModalLoader()
  }

  // На создание
  else {
    const response = await createSmet(smet.value);
    if(response.success){
      emit("save", { newSmet: response.data });
      errors.value = []
      dialogRef.value.close();
    } else{
      errors.value = response.errors
    }
    store.hideModalLoader()
  }
};

const showConfirmCheckboxMsg = (event) => {
  if(!smet.value.approved || !anyActs){
    $showInfoToast(anyRooms && anyWorks ? 'Можно подтвердить' : 'Сначала добавьте комнаты и укажите работы')
  }else {
    $showInfoToast(anyActs && smet.value.approved ? 'Сначала удалите все акты' : 'Отменить')
  }
}
</script>

<template>
  <section>
    <header class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-4 text-lg text-white">
      <span>Смета</span>
      <div class="flex items-center gap-2">
        <button
            v-show="isChanged"
            :title="buttonText"
            @click="setNewSmetState"
            class="bg-emerald-400 hover:bg-emerald-700 h-[var(--modal-header-height)] text-white border-0 flex items-center justify-center p-1 px-2"
        >
          <p>{{buttonText}}</p>
        </button>
        <button
            @click.prevent="dialogRef.close()"
            class="custom-collapse-button"
        >
          <span class="pi pi-times"></span>
        </button>
      </div>
    </header>
    <div class="grid gap-4 pt-2 px-4">
      <ifta-label>
        <div class="flex gap-1 items-center text-gray-400">
          <!--                        <span class="pi pi-fw pi-map-marker"></span>-->
          <label class="text-sm">Название</label>
        </div>
        <InputText
            v-model="smet.name"
            :disabled="disableEdit && disableEdit.id === smet.id"
            :invalid="errors.includes('name')"
        />
      </ifta-label>
      <ifta-label>
        <div class="flex gap-1 items-center text-gray-400">
          <!--                        <span class="pi pi-fw pi-map-marker"></span>-->
          <label class="text-sm">Комментарий</label>
        </div>
        <Textarea
            v-model="smet.comment"
            placeholder="Опишите причину"
            :disabled="disableEdit && disableEdit.id === smet.id"
        />
      </ifta-label>

      <div
          v-if="!disableEdit || smet.id === disableEdit.id"
          class="flex gap-2 items-center">
        <input
            v-if="!smet.approved || !anyActs"
            :title="anyRooms && anyWorks ? 'Подтвердить':'Сначала добавьте комнаты и укажите работы'"
            type="checkbox"
            v-model="smet.approved"
            class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
            :disabled="!anyRooms || !anyWorks"
        />
        <input
            v-else
            :title="anyActs && smet.approved ? 'Сначала удалите все акты':'Отменить'"
            type="checkbox"
            v-model="smet.approved"
            class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
            :disabled="anyActs && smet.approved"
        />
        <label class="font-medium">
          <span>Подтвердить</span>
        </label>
        <i class="pi pi-info-circle text-xl cursor-pointer" @click="showConfirmCheckboxMsg"></i>
      </div>

<!--      <div v-show="!smet.approved">-->
<!--        <p class="text-gray-400 mb-2">Тип акта:</p>-->
<!--        <div class="gap-1 flex flex-col text-gray-600">-->
<!--          <div class="flex gap-2">-->
<!--            <input-->
<!--                v-model="actType"-->
<!--                value="breakdownByRoom"-->
<!--                id="breakdownByRoom"-->
<!--                name="actType"-->
<!--                type="radio"-->
<!--                class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"-->
<!--                :disabled="anyActs"-->
<!--            />-->
<!--            <label for="breakdownByRoom" class="">С разбивкой по комнатам</label>-->
<!--          </div>-->
<!--          <div class="flex gap-2">-->
<!--            <input-->
<!--                v-model="actType"-->
<!--                value="singleAct"-->
<!--                id="singleAct"-->
<!--                name="actType"-->
<!--                type="radio"-->
<!--                class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"-->
<!--                :disabled="anyActs"-->
<!--            />-->
<!--            <label for="singleAct" class="">Единый акт</label>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <div v-show="!smet.id && copyFromOtherSmets">
        <div class="flex items-center mb-2">
          <input
              id="withRooms"
              type="checkbox"
              v-model="withRooms"
              class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label for="withRooms" class="ms-2 font-semibold"><span>Скопировать комнаты из предыдущей сметы</span></label>
        </div>
        <div class="flex items-center" v-show="withRooms">
          <input
              id="withWorks"
              type="checkbox"
              v-model="withWorks"
              class="cursor-pointer w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label for="withWorks" class="ms-2 font-semibold"><span>Скопировать работы из предыдущей сметы</span></label>
        </div>
      </div>

    </div>
  </section>
</template>
