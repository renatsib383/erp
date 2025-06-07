<script setup>
import { useMainStore } from '@/stores/main.js'

const props = defineProps(["sideBarWidth", "isAsideAvailable"])
const emit = defineEmits(['goToDealsWithSearchParam'])
const store = useMainStore();
const { $api } = useNuxtApp();
const user = useSanctumUser()

const route = useRoute();
const breadcrumbs = getBreadcrumbs(route.matched, route.path);

const search = ref('')
const delay = ref(null)
const showResultsPanel = ref(true)
const searchResults = ref({})
const permissionToPanel = user.value.roles.find(role => role.id === 1)

const onSearchInput = async () => {
  if (delay.value) {
    clearTimeout(delay.value)
  }
  delay.value = setTimeout(async () => {  // async для функции в setTimeout
    showResultsPanel.value = true

    try {
      if(search.value.length && search.value.length > 2){
        const res = await $api.get(`/search?search=${search.value}`)
        searchResults.value = res
        searchResults.value.noItems = !res.deals.length || !res.contacts.length
      }else{
        searchResults.value = {}
      }
    } catch (e) {
      console.log(e)
    } finally {
      delay.value = null // Обнуляем delay после завершения
    }
  }, 300)
}

const openDeal = (deal) => {
  deal.isCollapsed = false;
  const onlyRequiredFields = ["id", "isCollapsed", "type"]; // чтобы не мусорить LS только нужные поля оставляем
  const dealWithOnlyRequiredFields = Object.fromEntries(
      Object.entries(deal).filter(([key]) => onlyRequiredFields.includes(key))
  );

  store.setNewModal({modalData: dealWithOnlyRequiredFields, modalTitle: 'deal'})
}

const openContact = (contact) => {
  store.setNewModal({modalData: contact, modalTitle: 'contact'})
}

const goToDealsWithSearchParam = () => {
  window.location.href = `/deals?search=${search.value}`
}

const cleanSearch = () => {
  search.value = ''
  searchResults.value = {}
}

const hideResultsPanel = () => {
  showResultsPanel.value = false
}

defineExpose({hideResultsPanel})
</script>

<template>
  <header @click.stop="hideResultsPanel" class="flex bg-header-bg items-center h-header px-3 border-b border-b-sidebar-border">

    <!-- Хлебные крошки -->
    <div class="breadcrumbs grow text-[15px] pr-2">
      <ul class="breadcrumbs-list flex items-center">
        <li class="breadcrumbs-item">
          <a href="/"
             class="flex items-center justify-between gap-2 text-[var(--secondary)]">
            <div class="w-6 h-6 text-current">
              <svg xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke-width="1.5"
                   stroke="#64748b"
                   aria-hidden="true"
                   data-slot="icon"
                   class="hover:stroke-[var(--secondary)]"
              >
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25">
                </path>
              </svg>
            </div>
          </a>
        </li>
        <li class="breadcrumbs-item flex items-center" v-for="crumb in breadcrumbs">
          <a :href="crumb.path" v-if="!crumb.last">
            {{ crumb.name }}
          </a>
          <span v-if="crumb.last">
            {{ crumb.name }}
          </span>
        </li>
        <li class="breadcrumbs-item flex items-center" v-if="breadcrumbs.length == 0">
          <span>Рабочий стол</span>
        </li>
      </ul>
    </div>

    <!-- Поиск -->
    <div v-if="permissionToPanel" class="md:w-[320px] max-md:hidden relative ml-auto flex justify-end">
      <IconField class="w-full">
        <InputText
            v-model="search"
            @click.stop="showResultsPanel = true"
            @input="onSearchInput"
            placeholder="Быстрый поиск"
            class="input-search !py-[5px] rounded-none text-[15px] !bg-search-bg focus:!bg-search-focus-bg border-search-border focus:ring-4 focus:ring-input-focus-ring focus:ring-opacity-50 focus:!border-search-border"
        />
        <InputIcon v-if="!search.length" class="pi pi-search" />
      </IconField>

      <div v-if="Object.keys(searchResults).length && showResultsPanel"
           class="w-full bg-white dark:bg-surface-800 absolute top-9 z-[1300] shadow-lg flex flex-col gap-2">

        <div v-if="searchResults.deals.length"
             class="border-b-[1px] dark:border-surface-500 grid grid-cols-[0.2fr_1fr] p-2 gap-2">
          <h2 class="text-surface-500">Объекты</h2>
          <div>
            <div v-for="deal in searchResults.deals.slice(0, 5)"
                 :key="deal.id"
                 class="text-surface-600 dark:text-surface-300">
              Объект <span class="text-blue-500 cursor-pointer"
                    @click="openDeal(deal)">{{ deal.uid }}</span> от {{ formatDateStr(deal.created_at) }}
            </div>
            <!-- если сделок больше 5, отображаем ссылку "Показать все" -->
            <div v-if="searchResults.deals.length > 5"
                 class="text-blue-500 cursor-pointer"
                 @click.stop="goToDealsWithSearchParam">Показать все</div>
          </div>
        </div>

        <div v-if="searchResults.contacts.length" class="border-b-[1px] dark:border-surface-500 grid grid-cols-[0.2fr_1fr] p-2 pb-4 gap-2">
          <h2 class="text-surface-500">Контакты</h2>
          <div>
            <div v-for="contact in searchResults.contacts">
              <span class="capitalize cursor-pointer text-blue-500" @click="openContact(contact)">{{ contact.name }}</span> +{{ contact.phone }}
            </div>
          </div>
        </div>

        <div v-show="searchResults.noItems" class="p-2">Ничего не найдено</div>
      </div>
      <span v-show="search" @click="cleanSearch" class="absolute right-1 p-1 pi pi-times text-lg text-red-500 cursor-pointer" />
    </div>

    <div class="flex items-center ml-3">

      <!-- <span class="text-sm pr-2">{{user ? user.name : 'Пользователь'}}</span>


      <button @click="logoutHandler" class="pi pi-sign-out mr-2 px-2 py-1 p-2 text-slate-500 bg-gray-200 rounded-full hover:bg-gray-300"
      /> -->
      <button v-if="isAsideAvailable"
            @click="store.toggleAside()"
            :class="store.isAsideOpen ? 'pi pi-angle-right' : 'pi pi-angle-left'"
            class="px-2 py-1 p-2 text-slate-500 bg-gray-200 rounded-full hover:bg-gray-300" />

  </div>
</header></template>

<style scoped>.input-search {
  position: relative;
}

.input-search::before {
  content: '';
  position: absolute;
  right: 10px;
  width: 10px;
  height: 10px;
}

.breadcrumbs-item::before {
	content: "";
  height: .875rem;
  width: .875rem;  
	mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232e2e2e' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E");
	mask-size: cover;
  background-color: rgb(75, 85, 99);
}

</style>
