<script setup>
const dialogRef = inject("dialogRef");
const emit = defineEmits(["save", 'emit-additional-work-to-deal']);

const deal = ref(dialogRef.value.data.deal ? JSON.parse(JSON.stringify(dialogRef.value.data.deal)) : null);

// const skidkaOriginal = ref(Number(dialogRef.value.data.skidka));
// const skidka = ref(skidkaOriginal.value);
// const deal_id = ref(dialogRef.value.data.deal.id)

// const createNewPriceList = async() => {
//   try {
//     const response = await $api.post('/deals.price', deal_id.value), {skidka: skidka.value})
//
//     if (response.status === 200) {
//       emit("save", { Data: response.data });
//       dialogRef.value.close();
//     }
//   } catch (e) {
//       console.error('Deals price-list create error: ', e);
//   }
// }

// Данные для работы
const showWorkForm = ref(false)

const initialWorkState = {
  name: '',
  price: null,
  category: null,
  work_group_id: null,
  factor: null,
  type: 0,
  ed: 0,
  sort: 0,
}
const work = ref(JSON.parse(JSON.stringify(initialWorkState)));
const isEmptyField = ref(false)
const isChanged = ref(false)
const impossibleToEdit = ref(false) // Запрет на редактирование после подтверждения сметы

const categoryList = dialogRef.value.data.category
const factorList =  dialogRef.value.data.factor.map((factor, index) => {
  return {label: factor.title, value: index}
})
const edList = dialogRef.value.data.ed.map((item, index) => {
  return {value: index, label: item}
})
const typeList = dialogRef.value.data.type.map((item, index) => {
  return {value: index, label: item}
})
const groupList = computed(() => {
  let category = categoryList.find(cat => cat.value === work.value.category)
  return category ? category.groups : []
});

const changeWorkFormShowState = (value) => {
  showWorkForm.value = value
  if (!value) {
    work.value = JSON.parse(JSON.stringify(initialWorkState));
    setTimeout(()=>{
      impossibleToEdit.value = false
      isChanged.value = false
    },0)
  }
}

const emitAdditonalWorkToDeal = () => {
  if (!work.value.name || !work.value.price || !work.value.category || !work.value.work_group_id || work.value.factor === null || work.value.sort === null || work.value.ed === null) {
    isEmptyField.value = true;
  } else {
    isEmptyField.value = false
  }

  if (!isEmptyField.value) {
    if (!deal.value.price.additional || typeof deal.value.price.additional !== 'object') {
      deal.value.price.additional = {};
    }
    deal.value.price.additional = {
      ...deal.value.price.additional,
      [work.value.id]: work.value,
    };
    showWorkForm.value = false
    isChanged.value = false
    emit('emit-additional-work-to-deal', {newAddWork: work.value})
  }
}

const editAdditionalWork = (additional) => {
  showWorkForm.value = true
  work.value = JSON.parse(JSON.stringify(additional))
  impossibleToEdit.value = true
}

watch(work, (newValue) => {
  isChanged.value = true
}, {deep:true})

</script>

<template>
  <header class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-4 text-lg text-white">
    <span>Прайс-лист</span>
    <div class="flex items-center gap-2">
      <button
          v-show="isChanged && !impossibleToEdit"
          @click="emitAdditonalWorkToDeal"
          class="bg-emerald-400 hover:bg-emerald-700 h-[var(--modal-header-height)] text-white border-0 flex items-center justify-center p-1 px-2"
      >
        <p>Сохранить</p>
      </button>
      <button
          @click.prevent="dialogRef.close()"
          class="custom-collapse-button"
      >
        <span class="pi pi-times" />
      </button>
    </div>
  </header>
  <main class="p-2 transition-transform duration-300">
    <div v-show="showWorkForm" class="rounded-md grid md:grid-cols-1 gap-2 px-1 text-gray-400">
      <h3 class="font-bold text-md text-surface-500 pb-1 pl-1">{{work?.id ? 'Просмотр' : 'Добавление'}} дополнительной работы</h3>
<!--      :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && !work.name}"-->
      <ifta-label :class="{'ring-[1px] rounded-lg ring-red-400': isEmptyField && !work.name}">
        <label :class="{'!text-red-500': isEmptyField && !work.name}">Название работы</label>
        <InputText v-model="work.name" rows="3" cols="20" :disabled="impossibleToEdit" />
      </ifta-label>
      <div class="grid md:grid-cols-2 gap-2">
        <ifta-label :class="{'ring-[1px] rounded-lg ring-red-400': isEmptyField && !work.category}">
          <label :class="{'!text-red-500': isEmptyField && !work.category}">Категория</label>
          <Dropdown
              v-model="work.category"
              :options="categoryList"
              @change="categoryChanged"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              :disabled="impossibleToEdit"
          />
        </ifta-label>
        <ifta-label :class="{'ring-[1px] rounded-lg ring-red-400': isEmptyField && !work.work_group_id}">
          <label :class="{'!text-red-500': isEmptyField && !work.work_group_id}">Группа</label>
          <Dropdown
              v-model="work.work_group_id"
              :options="groupList"
              optionLabel="name"
              optionValue="id"
              class="w-full"
              :disabled="!work.category || impossibleToEdit"
              :placeholder="!work.category ? 'Укажите категорию' : 'Выберите группу'"
          />
        </ifta-label>
        <ifta-label :class="{'ring-[1px] rounded-lg ring-red-400': isEmptyField && work.type === null}">
          <label :class="{'!text-red-500': isEmptyField && work.type === null}">Вид работ</label>
          <Dropdown
              v-model="work.type"
              :options="typeList"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              :disabled="impossibleToEdit"
          />
        </ifta-label>
        <ifta-label>
          <label>Порядок сортировки</label>
          <input
              v-model="work.sort"
              @input="work.sort = Math.max(0, work.sort)"
              type="number" class="custom-ifta-input"
              :disabled="impossibleToEdit"
          />
        </ifta-label>
        <ifta-label :class="{'ring-[1px] rounded-lg ring-red-400': isEmptyField && !work.factor}">
          <label :class="{'!text-red-500': isEmptyField && !work.factor}">Фактор</label>
          <Dropdown
              v-model="work.factor"
              :options="factorList"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              :disabled="impossibleToEdit"
          />
        </ifta-label>
        <ifta-label :class="{'ring-[1px] rounded-lg ring-red-400': isEmptyField && work.ed === null}">
          <label :class="{'!text-red-500': isEmptyField && work.ed === null}">Ед. изм.</label>
          <Dropdown
              v-model="work.ed"
              :options="edList"
              optionLabel="label"
              optionValue="value"
              class="w-full"
              :disabled="impossibleToEdit"
          />
        </ifta-label>
        <ifta-label :class="{'ring-[1px] rounded-lg ring-red-400': isEmptyField && !work.price}">
          <label :class="{'!text-red-500': isEmptyField && !work.price}">Цена</label>
          <label>Цена</label>
          <input
              v-model="work.price"
              @input="work.price = Math.max(0, work.price)"
              type="number" class="custom-ifta-input"
              :disabled="impossibleToEdit"
          />
        </ifta-label>
      </div>
      <ifta-label >
        <label>Описание работы</label>
        <Textarea
            v-model="work.description"
            rows="3"
            cols="20"
            class="w-full"
            :disabled="impossibleToEdit"
        />
      </ifta-label>
      <Button
          label="Отмена"
          @click="changeWorkFormShowState(false)"
          class="w-40 button-modal mx-auto"
      />

    </div>
    <div v-show="!showWorkForm" class="flex flex-col">
      <h3 class="font-bold text-md text-surface-500 pb-1 pl-1">Дополнительные работы</h3>
      <div v-if="deal.price && deal.price.additional" class="py-1 flex flex-col">
        <div
            v-for="(work, key) in deal.price.additional"
            :key="key"
            class="p-2 border-2 rounded-lg mb-2 flex justify-between items-center gap-1 hover:bg-slate-200 dark:hover:bg-surface-950 cursor-pointer"
            @click="editAdditionalWork(work)"
        >
          <div class="flex flex-col gap-1 col-span-full lg:col-span-1">
            <h4>{{ work.name }}</h4>
          </div>
          <span class="col-span-1">{{ work.price }}р.</span>
        </div>
      </div>
      <Button
          label="Добавить доп.работу"
          @click="changeWorkFormShowState(true)"
          class="w-64 mx-auto mt-2 button-modal"
          :disabled="!deal.price"
      />
    </div>
  </main>
</template>
