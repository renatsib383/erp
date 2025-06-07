<script setup>
import {ref, reactive, inject, watch, onMounted} from 'vue';

const emit = defineEmits(['on-submit','test', 'close-form']);
const props = defineProps(['pipeline_id'])

const newDealData = ref({
    id: null,
    pipeline_id: props.pipeline_id,
    fio: '',
    telephone: null,
    address: '',
})
const pipelines = ref(Object.values(usePage().props.pipelines));

const isLoading = ref(false);

const type = ref({id: null, name: ''});
const addDealMsg = ref({msg: '', color: 'text-emerald-600', telephone: null,});

const addDeal = async (event) =>  {
    addDealMsg.value.msg = '';
    addDealMsg.value.telephone = null;

    if (!newDealData.value.telephone) {
      addDealMsg.value.telephone = 'Обязательное поле!';
      return;
    }

    isLoading.value = true;
    const pipeline = pipelines.value.find(p => p.id === newDealData.value.pipeline_id)

    await axios.post(route('deals.store.unique-uid'),{
      uid: newDealData.value.id ? newDealData.value.id : null,
      fio: newDealData.value.fio,
      telephone: String(newDealData.value.telephone).replace(/[^0-9]/g, ''),
      address: newDealData.value.address,
      geo: newDealData.value.geo,
      // pipeline_id: newDealData.value.pipeline_id,
      stages: [Object.values(pipeline.stages)[0].id]
    }).then(
      (response) => {
        isLoading.value = false;
        if (response.status == 200) {
          if (typeof response.data == 'object') {
            addDealMsg.value.msg = `Сделка ${response.data.uid} создана`;
            addDealMsg.value.color = 'text-emerald-600';
            console.log('NEW DEAL Res',response.data)
            emit('on-submit', response.data)
            setTimeout(() => closeForm(), 2000)
          }
        }
      },(error) => {
        isLoading.value = false;
        addDealMsg.value.msg = error.response.data.message;
        addDealMsg.value.color = 'text-red-600';
        console.log(error);
        setTimeout(()=> addDealMsg.value.msg = null, 3000)
      })

}

const closeForm = () => {
  emit('close-form');
}

const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const token = '21e1f007947f2a918b5ec3fbe51d35163044aa22'
const query = ref('')
const suggestions = ref([])
const selectedIndex = ref(-1); // Для управления с клавиатуры

const getSuggestions = () => {
  axios.post(url,
    {
      "query": query.value,
      "locations": [{
        "region": "москва"
      }]
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${token}`
      }
    }
  )
    .then(response => {
      suggestions.value = response.data.suggestions
    })
    .catch(error => {
      console.error("error", error.response ? error.response.data : error.message);
    });
}

const setAddress = (suggestion) => {
  query.value = suggestion.value
  newDealData.value.address = suggestion.value
  newDealData.value.geo = {
    lat: suggestion.data.geo_lat,
    lon: suggestion.data.geo_lon,
  }
  suggestions.value = []
}

// Для управления с клавиатуры
const moveDown = () => {
  if (selectedIndex.value < suggestions.value.length - 1) {
    selectedIndex.value++;
    //Сразу показываем в поле поиска
    query.value = suggestions.value[selectedIndex.value].value
  }
};
const moveUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
    query.value = suggestions.value[selectedIndex.value].value
  }
};
const selectSuggestion = () => {
  if (selectedIndex.value >= 0) {
    setAddress(suggestions.value[selectedIndex.value]);
  }
};

</script>

<template>
    <form @submit.prevent="addDeal" :class="{'opacity-50': isLoading}">
      <div class="w-full border-2 border-dashed border-slate-400 rounded-lg mb-2 ">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1 font-semibold text-[14px] text-slate-600 p-2">
            <label v-if="!addDealMsg.msg" class="text-sm">UID сделки</label>
            <label v-if="addDealMsg.msg" class="text-sm" :class="addDealMsg.color">{{addDealMsg.msg}}</label>
            <InputTextAside v-model="newDealData.id" placeholder="Например: ИМ/2321" class="font-medium !border-slate-300 hover:!border-slate-300 focus:ring-[1px] placeholder:font-normal" :class="{'ring-[1px] !ring-red-500 border-none': addDealMsg.id}"/>
            <label class="text-sm">ФИО заказчика</label>
            <InputTextAside v-model="newDealData.fio" placeholder="иванов иван" class="font-medium !border-slate-300 focus:ring-[1px] text-transform: capitalize placeholder:font-normal"/>

            <label class="text-sm">Телефон</label>
            <InputMask
              id="phone"
              v-model="newDealData.telephone"
              mask="+7 (999) 999-99-99"
              placeholder="+7 (___) ___-__-__"
              class="font-medium !p-1.5 hover:border-slate-300 border-slate-300 focus:ring-slate-400 focus:ring-[1px] placeholder:font-normal"
              :class="{'ring-[1px] !ring-red-500 border-none': addDealMsg.telephone}"
            />

            <div class="relative">
              <label class="text-sm">Адрес</label>
              <InputTextAside
                v-model="query"
                class="font-medium !border-slate-300 focus:ring-[1px] placeholder:font-normal"
                @focus="getSuggestions"
                @input="getSuggestions"
                @keydown.down.prevent="moveDown"
                @keydown.up.prevent="moveUp"
                @keydown.enter.prevent.stop="selectSuggestion"
                placeholder="Начните ввод и выберите из списка"
              />
              <ul v-show="suggestions.length" class="absolute top-15px bg-white z-10 py-2 w-full gap-1 flex flex-col border-2 border-t-0 rounded-b-lg overflow-y-auto max-h-[300px] overflow-y-auto">
                <li
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  class="cursor-pointer hover:bg-emerald-400 hover:text-white text-sm p-1"
                  :class="{ 'bg-emerald-400 text-white': index === selectedIndex }"
                  @click.stop="setAddress(suggestion)"
                >
                  {{ suggestion.value }}
                </li>
              </ul>
            </div>

          </div>
        </div>
        <div class="flex items-center justify-center gap-4 my-2">
          <button class="py-1.5 px-4 bg-emerald-400 text-[14px] text-white rounded-lg" type="submit" @click="type.id = 'sab'">Добавить</button>
          <button class="py-1.5 px-4 bg-slate-400 text-[14px] text-white rounded-lg" @click.stop="closeForm">Отменить</button>
        </div>
      </div>
    </form>
</template>
