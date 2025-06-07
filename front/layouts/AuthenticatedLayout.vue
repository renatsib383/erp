<script setup>
import ModalsContainer from "~/components/Common/ModalsContainer.vue";
import {useMainStore} from "~/stores/main.js";
import { useImboxStore } from '@/stores/imbox.js';
// import {fetchHolidays} from "~/services/api/productionСalendar.js";
import { fetchMessages } from '@/services/api/imboxServices.js';
const { $toastIconClass } = useNuxtApp();

const store = useMainStore();
const imboxStore = useImboxStore();
const { isOffline } = useNetworkStatus()
const router = useRouter();

const props = defineProps({
  page: {
    type: String,
    default: "",
  },
  asideAddClasses: {
    type: String,
    default: "",
  },
  asideMaxWidth: {
    type: Number,
    default: 350,
  },
  isAsideAvailable: {
    type: String,
    default: true,
  },
  loading: String,
});

onMounted(async () => {
  // setNotificationSettings()

  documentWidthPrev = document.documentElement.clientWidth;
  sidebarMode.value = document.documentElement.clientWidth < store.sidebarMobileScreen ? "mobile" : "desktop";
  sideBarWidth.value = sidebarComponent.value.nav.clientWidth;
  isMounted.value = true;
  window.addEventListener("resize", onResize);
  if (sidebarMode.value == 'mobile') {
    store.isAsideOpen = false;
  }

  // setTimeout(async() => {
  //   const response = await fetchHolidays()
  //   await store.setHolidays(response.holidays, response.preholidays)
  // }, 2000)
})

onUnmounted(() => {
  // echo.leaveAllChannels(); // закомментила - при переходе со страницы на страницу может отключать сокеты, открытые на новой странице
  // window.removeEventListener("resize", onResize); // Ошибка при переходе
});

// Настройка лейаута
const header = ref(null);
let documentWidthPrev;
const sidebarComponent = ref(null);
const height = ref(0);
const sidebarMode = ref(null);
const sideBarWidth = ref(0);
const isMounted = ref(false);

const asideClasses = computed(() => {
  if (props.isAsideAvailable) {
    return {
      [props.asideAddClasses]: true,
      'w-full': props.page === 'dashboard' || props.page === 'imbox',
    };
  } else {
    return 'hidden';
  }
});

const asideStyle = computed(() => {
  if(store.activeModal) { // Когда открыто модалка, сайдбар откроется снизу и не сжимает её
    return {
      "max-width": `${store.isAsideOpen ? props.asideMaxWidth : 0}px`,
      "transition-timing-function": 'cubic-bezier(0, 0, 0.2, 1)',
      opacity: '100',
      position: 'absolute',
    }
  }
  if (store.isAsideOpen) {
    return {
      "max-width": `${props.asideMaxWidth}px`,
      "transition-timing-function": 'cubic-bezier(0, 0, 0.2, 1)',
      opacity: '100',
    };
  } else {
    return {
      "transition-timing-function": 'cubic-bezier(0.4, 0, 1, 1)',
      opacity: '0',
    };
  }
});

const asideImboxStyle = computed(() => {
  if(store.activeModal) { // Когда открыто модалка, сайдбар откроется снизу и не сжимает её
    return {
      "max-width": `${store.isImboxMobileChatsOpen ? '100%' : 0}px`,
      "transition-timing-function": 'cubic-bezier(0, 0, 0.2, 1)',
      opacity: '100',
      position: 'absolute',
    }
  }
  if (store.isImboxMobileChatsOpen) {
    return {
      "max-width": `100%`,
      "transition-timing-function": 'cubic-bezier(0, 0, 0.2, 1)',
      opacity: '100',
    };
  } else {
    return {
      "transition-timing-function": 'cubic-bezier(0.4, 0, 1, 1)',
      opacity: '0',
    };
  }
});

const onResize = debounce(() => {
  if (document.documentElement.clientWidth < store.sidebarMobileScreen && documentWidthPrev >= store.sidebarMobileScreen) {
    store.isSidebarExpanded = false;
    sidebarMode.value = "mobile";
  } else if (document.documentElement.clientWidth >= store.sidebarMobileScreen && documentWidthPrev < store.sidebarMobileScreen) {
    store.isSidebarExpanded = true;
    sidebarMode.value = "desktop";
  }
  documentWidthPrev = document.documentElement.clientWidth;
}, 300);

const closeSearchResultsPanel = () => {
  if (header.value) {
    header.value.hideResultsPanel()
  }
}

// Модалки
// const modalsFromHistoryButton = ref(false)
// let hideTimeout = null
// const isFullPage = computed(() => { // Если открыта отдельная страница, то не будем показывать
//   const pathname = window.location.pathname.split('/');
//   return pathname.length > 2
// });


const openImbox = (room) => {
  imboxStore.activeRoom = room;
  router.push('/');
}

// const showHistoryButtonOnMove = () => {
//   modalsFromHistoryButton.value = true
//
//   if (hideTimeout) clearTimeout(hideTimeout)
//
//   hideTimeout = setTimeout(() => {
//     modalsFromHistoryButton.value = false
//   }, 3000)
// }
</script>

<template>
  <div class="flex flex-col-reverse h-screen md:flex-row text-text-color" :class="{'dark': store.isDark}">
    <CommonSidebar ref="sidebarComponent" :mode="sidebarMode" :loading="loading" />

    <div class="flex-auto relative h-[calc(100%-60px)] md:h-full z-[1] bg-sidebar-bg"
         :class="[isMounted ? 'transition-[margin-left] duration-200': '', store.isSidebarExpanded ? 'lg:w-[calc(100%-var(--sidebar-width-expanded))]' : 'lg:w-[calc(100%-var(--sidebar-width-collapsed))]']">

      <CommonHeader :sideBarWidth="sideBarWidth" :isAsideAvailable="isAsideAvailable" ref="header"/>

      <div class="flex h-content w-full">

        <!--md:mb-0   md:m-[10px] md:h-[calc(100%-10px)] -->
        <main
            class="main relative flex-1 overflow-hidden m-0"
            @click="closeSearchResultsPanel"
        >

          <!--Страницы-->
          <slot/>

          <!-- Индикатор загрузки для форм -->
          <div v-show="store.modalLoader"
               class="h-full w-full overflow-hidden flex items-center justify-center absolute top-0 z-[3000] bg-[#00000010] ">
            <ProgressSpinner />
          </div>

          <!-- Все основные модалки -->
          <modals-container :showModalsFromHistory/>

          <!-- Кнопка показа истории модалок -->
          <!--          <div-->
          <!--              v-show="!isFullPage && !modalsFromHistoryButton && !store.showModalsFromHistory"-->
          <!--              @pointermove="showHistoryButtonOnMove"-->
          <!--              class="absolute bottom-0 left-1/2 w-40 -translate-x-1/2 h-12 pointer-events-auto z-[1300]"-->
          <!--          />-->
          <!--   && modalsFromHistoryButton-->
          <!--   @pointermove="showHistoryButtonOnMove"-->
          <!-- <span
              v-show="!isFullPage || store.showModalsFromHistory"
              @click.stop.prevent="showModalsHistoryContainer"
              class="max-sm:hidden pi pi-chevron-up show-modals-history_button rounded-t cursor-pointer absolute bottom-0 left-1/2 -translate-x-1/2 py-[1px] px-[10px] bg-surface-200 dark:bg-surface-900 z-[1300] text-xl duration-500 text-surface-400"
              :style="store.showModalsFromHistory ? { transform: `translateX(-50%) translateY(-${(store.getModalsHistoryList.length * 40.2) - 30}px) scaleY(-1)` } : ''"
              title="Модалки из истории"
          /> -->

        </main>

        <aside 
          v-if="!isOffline"
          class="aside max-w-[0] transition-all duration-300 absolute top-[var(--header-height)] right-0 bottom-0 flex items-center text-aside-base  z-[100] lg:static bg-aside-bg overflow-hidden border-l border-l-sidebar-border" :class="asideClasses" :style="asideStyle">
          <div :class="[page === 'dashboard' ? 'w-full' : '', 'h-full lg:border-l-[1px] border-aside-bg']">
            <div class="aside__inner p-2 h-full overflow-auto" :class="[page === 'dashboard' ? 'py-0 lg:py-3' : '']">
              <div class="">
                <slot name="aside"></slot>
              </div>
            </div>
          </div>
        </aside>

        <aside 
          v-if="page == 'imbox'"
          class="aside-chats max-w-[0] transition-all duration-300 absolute top-[var(--header-height)] right-0 bottom-0 flex items-center text-aside-base  z-[100] lg:static bg-body-bg overflow-hidden border-l border-l-sidebar-border" :class="asideClasses" :style="asideImboxStyle">
          <div class="w-full h-full lg:border-l-[1px] border-aside-bg">
            <div class="aside__inner p-3 h-full overflow-auto">
                <slot name="chats"></slot>
            </div>
          </div>
        </aside>        

      </div>

    </div>
    <!-- <Toast class="!bottom-[-10px] !left-[5px] !z-[10000]" position="bottom-left" group="bl"/> -->
    <Toast
      class="!bottom-[-10px] !left-[5px] !z-[10000]" 
      position="bottom-left" 
      group="bl"
    >
      <template #message="slotProps">
        <i 
          :class="$toastIconClass(slotProps.message.severity)"
          aria-hidden="true"
          data-pc-section="messageicon"
        > </i>
        <div class="p-toast-message-text" data-pc-section="messagetext">
          <span class="p-toast-summary" data-pc-section="summary">
            {{ slotProps.message.summary }}
          </span>
          <div 
            v-if="slotProps.message.type == 'imbox'" 
            class="p-toast-detail" 
            data-pc-section="detail">
            <div class="mb-2">Сообщение imbox: 
              <span 
                @click="openImbox(slotProps.message.props.room)"
                class="underline font-medium cursor-pointer hover:no-underline"
              >
                {{ slotProps.message.props.title }}
              </span>
            </div>
            <div
              class="max-h-[200px] overflow-hidden">
              {{slotProps.message.detail}}
            </div>
          </div>
          <div v-else class="p-toast-detail" data-pc-section="detail">
            {{ slotProps.message.detail }}
          </div>
        </div>
      </template>
   </Toast>
    <ConfirmPopup/>
  </div>
</template>
