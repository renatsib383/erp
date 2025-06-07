<script setup>
import {ref, watch} from 'vue';

import {fetchEmployees} from '@/services/api/callsServices.js';
import {formatDateStr} from "~/utils/date-functions.js";

const delay = ref(0)
const emit = defineEmits(['change-searchValue', 'change-params'])
const search = ref('')
const params = ref({
  created_at: [],
  uis_login: [],
  deal_id: null,
  client_phone: null,
  type: null,
  // valueAfter: null,
  // valueBefore: null,
})

const employees = await fetchEmployees();
const author_options = employees.success && employees.data?.length ? employees.data : [{name: 'test', id: 1}];

const callTypeOptions = [{ value: 'out', label: 'Исходящий' }, { value: 'in', label: 'Входящий' }]

const route = useRoute()

onMounted(async () => {
  if (Object.keys(route.query).length > 0) {
    setFiltersFromURL();
  }
});

watch(() => params.value.uis_login, (newValue) => {
  emitwithTimeOut()
})
watch(() => params.value.type, (newValue) => {
  emitwithTimeOut()
})

const emitwithTimeOut = (type) => {
  if (delay.value) {
    clearTimeout(delay.value)
  }
  delay.value = setTimeout(() => {
    emitParams()
  }, 1000);
}

const emitParams = () => {
  params.value.created_at.map(item => {
    if(item){
      return new Date(item)
    }
  })
    emit('change-params', {filter: params.value, search: search.value})
}

const setFiltersFromURL = () => {
  if (route.query) {
    Object.entries(route.query).forEach(([key, value]) => {
      const match = key.match(/^filter\[(\w+)]/); // Ищем filter[type], filter[performer] и т. д.
      if (match) {
          const filterKey = match[1];
          if (filterKey === "created_at" && value) {
            const parsedValue = Array.isArray(value)
                ? value.map((v) => new Date(v))  // Если массив, преобразуем каждый элемент
                : [new Date(value)]; // Если одиночное значение, оборачиваем в массив

            params.value.created_at.push(...parsedValue);
          }
          if(filterKey === 'uis_login'){
            const author = author_options.find(item => Number(item.id) === Number(value));
            if(author) params.value[filterKey] = author;
          }
          if(filterKey === 'client_phone'){
            params.value[filterKey] = value;
          }
          if(filterKey === 'type'){
            const type = callTypeOptions.find(item => item.value === value);
            params.value.type = type;
          }
        }
    });

    if(route.query.search){
      search.value = route.query.search
    }

    emitwithTimeOut()
  }
}

</script>

<template>
  <section class="flex flex-col relative">

    <div class="px-[3px] select-none">

      <div class="flex justify-between items-center pt-1">
        <span class="relative  w-full">
          <FormSearch
              v-model="search"
              @change-search="emitwithTimeOut('search')"
              placeholder="Поиск "
          />
        </span>
      </div>

      <div class="mt-2">
        <p class="aside__caption-field mb-2">Фильтры</p>

        <div>
          <div class="mt-1 h-full">

            <div class="min-h-full flex flex-col pb-2">

              <div class="pb-2">
                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">

                    <IftaLabel>
                      <Datepicker
                          v-model="params.created_at"
                          @date-select="emitwithTimeOut"
                          @clearClick="emitwithTimeOut"
                          format="dd.mm.yyyy"
                          selectionMode="range"
                          :manualInput="false"
                          showButtonBar
                          showIcon
                          iconDisplay="input"
                          id="date"
                          placeholder="Все"
                          class="w-full"
                      >
                        <template #date="slotProps">
                          <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                        </template>
                      </Datepicker>

                      <label>Дата</label>
                    </IftaLabel>

                </div>
              </div>


               <div class="pb-2">
                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">

                    <IftaLabel>
                      <FormVSelect
                          v-model="params.uis_login"
                          :options="author_options"
                          :reduce="option => option.id"
                          multiple
                          label="name"
                          value="id"
                          placeholder="Все"
                          class="w-full"
                      >
                      </FormVSelect>
                      <label>Автор</label>
                    </IftaLabel>

                </div>
                </div>

                <div class="pb-2">
                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                  <IftaLabel>
                    <InputText
                        id="phone"
                        type="number"
                              v-model="params.client_phone"
                              @input="emitwithTimeOut('filter')"
                              mask="+7 (999) 999-99-99"
                              placeholder="+7 (999) 999-99-99"
                              class="w-full" />
                     <label>Контакт</label>
                  </IftaLabel>
                </div>
                </div>


                <div class="pb-2">
                <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                <IftaLabel>
                  <div class="flex items-center relative">
                    <FormVSelect v-model="params.type"
                              :options="callTypeOptions"
                              :reduce="option => option.value"
                              label="label"
                              value="value"
                              placeholder="Все"
                              class="w-full" />
                  </div>
                  <label>Тип звонка</label>
                </IftaLabel>
              </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style></style>
