<script setup>

const props = defineProps({
  addedContacts: Array,
  numberSuggestions: Array,
  namesSuggestions: Array,
  addNewContactStatus: Boolean,
  errorMessages: Object,
  contactErrors: Array,
});

const emit = defineEmits([
  'addNewContact',
  'deleteContact',
  'setContact',
  'getNumberSuggestions',
  'getNamesSuggestions',
  'setNameSuggestion',
  'createNewContact',
  'openContact',
]);

const selectedNameIndex = ref(-1);
const selectedNumberIndex = ref(-1);

const moveDownNamesSuggestion = (contact) => {
  if (selectedNameIndex.value < props.namesSuggestions.length - 1) {
    selectedNameIndex.value++;
    contact.full_name = props.namesSuggestions[selectedNameIndex.value].value;
  }
};

const moveUpNamesSuggestion = (contact) => {
  if (selectedNameIndex.value > 0) {
    selectedNameIndex.value--;
    contact.full_name = props.namesSuggestions[selectedNameIndex.value].value;
  }
};

const moveUpNumbersSuggestion = () => {
  if (selectedNumberIndex.value > 0) {
    selectedNumberIndex.value--;
  }
};

const moveDownNumbersSuggestion = () => {
  if (selectedNumberIndex.value < props.numberSuggestions.length - 1) {
    selectedNumberIndex.value++;
  }
};
</script>

<template>
  <Fieldset legend="Контакты" pt:root="p-1 mx-2 pb-2 mt-4">
    <div v-show="errorMessages.contacts" class="flex items-center justify-between">
      <h2 id="contacts" class="text-red-500 font-normal">Обязательное поле!</h2>
    </div>
    <div v-show="addedContacts">
      <div
          v-for="(contact, index) in addedContacts"
          :key="index"
      >
        <div v-if="index === 0" class="max-lg:hidden grid lg:grid-cols-2">
          <div class="flex gap-1 items-center text-gray-400 justify-center">
            <span class="pi pi-fw pi-user"></span>
            <label for="pipeline" class="text-sm text-surface-400">ФИО</label>
          </div>
          <div class="flex gap-1 items-center text-gray-400 justify-center pr-16">
            <span class="pi pi-phone pi-fw"></span>
            <label for="stage" class="text-sm text-surface-400">Телефон</label>
          </div>
        </div>

        <div class="grid grid-cols-[1fr_0.7fr_0.1fr_0.1fr] mb-1">
          <div class="relative">
            <InputText
                v-model="contact.full_name"
                @input="emit('getNamesSuggestions', contact)"
                @keydown.down.prevent="moveDownNamesSuggestion(contact)"
                @keydown.up.prevent="moveUpNamesSuggestion(contact)"
                @keydown.enter.prevent.stop="emit('setNameSuggestion', contact, namesSuggestions[selectedNameIndex])"
                type="text"
                class="w-full rounded-none h-[44px]"
                placeholder="Начните ввод и выберите из списка"
                :disabled="!contact.editable || contact.id"
                :invalid="(index === addedContacts.length-1) && contactErrors.includes('name')"
            />
            <ul v-show="namesSuggestions.length && addedContacts[addedContacts.length - 1] === contact"
                class="absolute top-15px bg-white border-surface-300 dark:border-surface-600 dark:bg-surface-800 z-10 py-2 w-full gap-1 flex flex-col border-[1px] border-t-0 rounded-b-lg max-h-[300px] overflow-y-auto">
              <li
                  v-for="(suggestion, index) in namesSuggestions"
                  :key="index"
                  class="cursor-pointer hover:bg-primary-400 hover:text-white text-sm p-1"
                  :class="{ 'bg-primary-400 text-white': index === selectedNameIndex }"
                  @click="emit('setNameSuggestion',contact, suggestion)"
              >
                {{suggestion.value}}
              </li>
            </ul>
          </div>

          <div class="relative">
            <InputMask
                v-model="contact.phone"
                mask="+7 (999) 999-99-99"
                class="w-full rounded-none h-[44px]"
                placeholder="+7 (___) ___-__-__"
                @update:model-value="emit('getNumberSuggestions', contact)"
                @keydown.down.prevent="moveDownNumbersSuggestion()"
                @keydown.up.prevent="moveUpNumbersSuggestion()"
                @keydown.enter.prevent.stop="emit('setContact', contact, numberSuggestions[selectedNumberIndex])"
                :disabled="!contact.editable || contact.id"
                :invalid="(index === addedContacts.length-1) &&  contactErrors.includes('phone')"
            />
            <ul v-show="numberSuggestions?.length && addedContacts[addedContacts.length - 1] === contact"
                class="absolute top-15px bg-white border-surface-300 dark:border-surface-600 dark:bg-surface-800 z-10 py-2 w-full gap-1 flex flex-col border-[1px] border-t-0 rounded-b-lg max-h-[300px] overflow-y-auto">
              <li
                  v-for="(suggestion, index) in numberSuggestions"
                  :key="index"
                  class="cursor-pointer hover:bg-primary-400 hover:text-white text-sm p-1"
                  :class="{ 'bg-primary-400 text-white': index === selectedNumberIndex }"
                  @click="emit('setContact',contact, suggestion)"
              >
                <!--  :class="{ 'bg-primary-400 text-white': index === selectedIndex }"-->
                <div class="flex flex-col items-start justify-center">
                  <span class="text-base">{{ suggestion.full_name }}</span>
                  <span>+{{ suggestion.phone }}</span>
                </div>
              </li>
            </ul>
          </div>

          <a
              v-if="contact.id"
              :href="contact.phone && `tel:${contact.phone.replace(/\D/g, '')}`"
              title="Позвонить"
              class="p-[10px] bg-green-500 flex items-center h-[44px]"
          >
            <span class="pi pi-phone text-surface-200 text-xl"/>
          </a>
          <button  v-else title="Сохранить" @click="emit('createNewContact', contact)"  class="h-[44px] p-[10px] bg-green-500 flex items-center">
            <span class="pi pi-save text-surface-200 text-xl"/>
          </button>
          <button v-if="contact.id" @click="emit('openContact', contact)" title="Открыть" class="h-[44px] p-[10px] bg-surface-400 border-l-[1px] border-primary-300 dark:border-surface-600 flex items-center">
            <span class="pi pi-external-link text-surface-200 text-xl"/>
          </button>
          <button v-else @click="emit('deleteContact', contact)" title="Отменить" class="h-[44px] p-[10px] bg-surface-400 border-l-[1px] border-primary-300 dark:border-surface-600 flex items-center">
            <span class="pi pi-undo text-surface-200 text-2xl"/>
          </button>
        </div>
      </div>

      <div class="flex justify-center">
        <button
            class="button-modal"
            :class="{ '!bg-slate-300 cursor-not-allowed': !addNewContactStatus }"
            @click="emit('addNewContact')"
            :disabled="!addNewContactStatus"
        >
          Добавить контакт
        </button>
      </div>
    </div>
  </Fieldset>
</template>