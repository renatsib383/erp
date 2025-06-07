<script setup>
import { computed, defineExpose, ref, watch } from "vue";
import { useMainStore } from '@/stores/main.js'
import { useRoute } from 'vue-router';
import {menuItems as rawMenuItems, list, finance, bottomMenuItems, } from "~/utils/sidebar-utils.js";
import { logout } from "~/services/api/authServices";
import ptDrawerNotifications from '@/assets/presets/custom/drawerNotificationsPreset.js';
// import ptBaseSelect from "~/assets/presets/custom/ptBaseSelect.js";
import Select from 'primevue/select';

const route = useRoute();
const store = useMainStore();
const notificationStore = useNotificationStore();
const user = useSanctumUser();


const isAdminVisible = () => {
  let index = user.value.roles.findIndex(item => {
    return item.name == 'superadmin'
  });
  if (index >=0 ) {
    return true;
  } else {
    return false;
  }
}

// const project = ref('admin.atloncrm.ru');
// const otherProjects = user.value.roles.find(role => role.id === 1) ? ['admin.atloncrm.ru'] : [];

const nav = ref(0);
const props = defineProps(["loading"]);
const loadingIcon = ref(props.loading);
const isLaptop = ref(window.innerHeight);

onMounted(async () => {
  onResize();
  window.addEventListener("resize", onResize);
  scrollableEl.value.addEventListener('scroll', getScrollPosition);
})

const navClasses = computed({
  get() {
    return {
      "md:w-[var(--sidebar-width-expanded)]": store.isSidebarExpanded,
      "md:w-[var(--sidebar-width-collapsed)]": !store.isSidebarExpanded
    }
  },
});

const clickLink = function(item) {
  loadingIcon.value = item.name;
  // setTimeout(() => loadingIcon.value = '', 3000); // Через 3 секунды отключим лоадер, на случай если просто второй раз тыкнули
  if (item.route === route.fullPath) {
    window.history.pushState(window.location.pathname, '', item.route)
    window.location.reload()
  }
}

watch(() => props.loading,  (newValue, oldValue) => {
  loadingIcon.value = newValue;
});

defineExpose({
  nav,
});

// Верхняя часть меню, которая скроллиться, если не влезает
const scrollableEl = useTemplateRef('scrollable');
const scrollPosition = ref('top');

const getScrollPosition = () => {
  if (!scrollPosition.value || !scrollableEl.value) {
    return;
  }

  if (scrollableEl.value.clientHeight == scrollableEl.value.scrollHeight) {
    scrollPosition.value = 'none';
  } else {
    if (scrollableEl.value.scrollTop == 0) {
      scrollPosition.value = 'top';
    } else if (scrollableEl.value.scrollTop + scrollableEl.value.clientHeight  >= scrollableEl.value.scrollHeight) {
      scrollPosition.value = 'bottom';
    } else {
      scrollPosition.value = 'between';
    }  
  }
}

const isMobile = ref(false);

const setIsMobile = () => {
  if (document.documentElement.clientWidth < 768) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
}

const onResize = () => {
  setIsMobile();
  getScrollPosition();
}

const notificationsDrawerVisible = ref(false);
const listsDrawerVisible = ref(false);
const financeDrawerVisible = ref(false);
const menuMobileDrawerVisible = ref(false);

const drawers = {
  'notifications': notificationsDrawerVisible, 
  'lists': listsDrawerVisible,
  'finance': financeDrawerVisible,

  'menu_mobile': menuMobileDrawerVisible
};

// Второй уровень меню, добавляем ссылки к drawers
const items = rawMenuItems.map(item =>
    item.name === 'lists' ? { ...item, menuRef: listsDrawerVisible } : item.name === 'finance' ? { ...item, menuRef: financeDrawerVisible } : item
);

const profile =  
  {
      title: "Профиль",
      route: "/profile",
      icon: "/images/menu/users.svg",
      icon_active: "/images/menu/users_active.svg",
      width: "32",
      height: "32",
      name: "profile",
  };

const cleanDrawers = () => {
  for (let key of Object.keys(drawers)) {
    drawers[key].value = false;
  }
}

const closeMenu2 = debounce((menuRef) => {
  if (menuRef.value) {
    menuRef.value = false;
  }
},10);

const toggleMenu2 = debounce((menuRef) => {
  let prev = menuRef.value;
  cleanDrawers();
  menuRef.value = !prev;
},10);

const isItemActive = (itemName) => {
  if (drawers[itemName].value) {
    return true;
  } else {
    return false;
  }
}

const isActiveRoute = (item) => {
  return item.route === route.path; // Сравниваем полный путь
};

const itemClasses = (item) => {
  if (isActiveRoute(item) && !isMobile.value) {
    return 'bg-sidebar-item-active-bg text-sidebar-item-active-text';
  }
  else return '';
}

const computedItems = computed(() => {
  const allowed = allowedSections(items);

  // Для мобили добавляем уведомления в меню
  const notification = {
    title: "Уведомления",
    name: "notifications",
    svg: "bell",
    width: "32",
    height: "32",
    important: true,
    menuRef: notificationsDrawerVisible
  }

  if (!isMobile.value) {
    const notificationIndex = allowed.findIndex(item => item.name === "notifications");
    if(notificationIndex >= 0) {
      allowed.splice(notificationIndex, 1);
    }
    return allowed
  } else if (isMobile.value) {
    if(!allowed.find(item => item.name === "notifications")) {
      allowed.push(notification)
    }
    return allowed.filter(item => item.important)
  }
})

const mobileAddItems = computed(() => {
  const allowed = allowedSections(items);
  return allowed.filter(item => !item.important);
})

const allowedSections = (sections) => {
  const root = user.value.roles.find(r => r.id === 1);
  if(root) return sections;
  return sections.filter(item => {
    // Рабочий стол всегда разрешено
    if(item.permission_title === 'Dashboard') return item
    // Списки показываем если внутри списков есть разрешенный раздел
    if(item.permission_title === 'List') {
      const anyAllowedSectionInLists = filteredGroup(list.groups)
      if(anyAllowedSectionInLists.length) return item
    }
    if(user.value.permissions.permissions[item.permission_title] && user.value.permissions.permissions[item.permission_title]?.view) return item
  } )
}

const filteredGroup = (listGroups) => {
  return  listGroups
      .map(group => {
          return {
            ...group,
            items: allowedSections(group.items)
          }
      })
      .filter(group => group.items.length > 0)
}

const processing = ref(false);

const logoutHandler = async () => {
  await logout(processing);
}

// const openProject = () => {
//   window.open(`https://${project.value}`, '_blank')
//   setTimeout(() => project.value = '')
// }

// История модалок
const showModalsHistoryContainer = () => {
  if (checkIsFullPage()) {
    return;
  }
  if(store.showModalsFromHistory){
    store.setModalsFromHistoryViewState(false)
  } else {
    store.setModalsFromHistoryViewState(true)
  }
}

const checkIsFullPage = () => {
// Если открыта отдельная страница, то не будем показывать историю модалок
  const pathname = window.location.pathname.split('/');
  return pathname.length > 2
}

const isFullPage = computed(() => {
  return checkIsFullPage();
});


</script>

<template>
  <nav
      class="sidebar-main z-[1200] h-[60px] md:w-[60px] md:h-screen lg:w-[auto] shrink-0 text-sidebar-text select-none"
      ref="nav"
  >
    <div class="sidebar-main__inner relative h-full w-full bg-sidebar-bg border-r border-r-solid border-r-sidebar-border transition-all duration-200"
         :class="navClasses"
    >
      <div class="sidebar-menu w-full h-full flex md:flex-col items-center overflow-hidden">

        <div class="sidebar-menu__header hidden min-h-[var(--header-height)] md:flex items-center  w-full mb-2 py-0.5 px-[10px] text-[15px] border-b border-b-solid border-b-sidebar-border">

          <div 
            class="sidebar-menu__logo w-[120px] mr-auto transition-opacity ease-in-out duration-200"
            :class="store.isSidebarExpanded ? 'opacity-100' : 'opacity-0 absolute -z-[1]'"
           >
            <img 
              v-if="!store.isDark"
              src="/images/atlon-grey.png"/>
            <img 
              v-if="store.isDark"
              src="/images/atlon.png"/>
          </div>

          <button @click="store.toggleIsDark()" title="Переключить тему" class="flex items-center justify-center ml-[5px]">
            <span class="text-lg pi pi-fw h-[30px] w-[30px] text-[#64748b] hover:text-[var(--secondary)]" :class="store.isDark ? 'pi-sun' : 'pi-moon'"></span>
          </button>

        </div>

        <!--Верхние иконки-->
        <section class="relative flex grow md:block md:w-full overflow-hidden">
          <div class="sidebar-menu__shadow-top absolute top-0 w-full h-[50px] pointer-events-none opacity-0 transition-opacity duration-100 z-[1] bg-gradient-to-t from-transparent to-sidebar-scroll-shadow"
               :class="{ 'opacity-100' : ['bottom', 'between'].includes(scrollPosition) }"
               v-if="!isMobile">
            <div class="sidebar-menu__shadow-top-line absolute left-[13px] right-[13px] h-[2px] rounded-sm bg-sidebar-scroll-line"></div>
          </div>

          <div class="sidebar-menu__scrollable flex max-sm:h-[50px] max-sm:items-center justify-between gap-1 px-[10px] md:flex-col md:justify-start md:overflow-y-auto overflow-x-hidden w-full md:w-auto"
               ref="scrollable">
            <!--Верхние иконки-->
            <div
                v-for="item in computedItems"
                :key="item.label"
                class="sidebar-item"
                :class="{'scale-90 !mb-1': isLaptop < 700}"
            >
              <!--              bg-primary-700-->
              <NuxtLink
                  v-if="item.route && (item.route !== 'users.index')"
                  :to="item.route"
                  class="sidebar-link relative flex flex-col w-full justify-center md:justify-start"
                  :class="itemClasses(item)"
                  @click="clickLink(item)"
              >
                <div class="flex items-center w-full justify-center md:justify-start md:p-[4px] mx-auto ">
                  <div class="relative menu-icon shrink-0">
                    <img
                        v-if="item.icon"
                        :src="isActiveRoute(item) ? item.icon_active : item.icon"
                        :width="item.width"
                        :height="item.height"
                        :title="item.title"
                    />
                    <div
                        v-if="store.sidebarOptions && store.sidebarOptions[item.name] && store.sidebarOptions[item.name].super"
                        class="absolute bg-[#ff0000] min-w-[20px] h-[20px] flex justify-center items-center text-sm leading-none rounded-full -top-1 -right-2 z-[1] text-white"
                    >
                      <p class="inline-block px-1">{{ store.sidebarOptions[item.name] && store.sidebarOptions[item.name].super}}</p>
                    </div>
                    <span
                        v-show="loadingIcon === item.name"
                        class="absolute w-[34px] h-[34px] rounded-full border-2 border-surface-600 !border-t-transparent animate-spin -top-[1px] -left-[1px] dark:border-white z-[0]"
                    />
                  </div>
                  <p class="hidden md:block flex-1 pl-[14px] text-start text-[15px] leading-none whitespace-nowrap transition-opacity"
                     :class="store.isSidebarExpanded ? 'opacity-100' : 'opacity-0'"
                  >
                    {{item.title}}
                  </p>
                </div>
              </NuxtLink>

              <!--Drawers-->
              <div
                  v-if="typeof item.menuRef != 'undefined'"
                  class="sidebar-item"
                  @click="toggleMenu2(item.menuRef)"
              >
                <div class="flex items-center justify-center md:justify-start w-full md:p-[4px] mx-auto">
                  <div class="relative menu-icon shrink-0">
                    <img
                        v-if="item.icon && item.name === 'lists'"
                        :src="list.included?.some(path => route.path.includes(path)) ? item.icon_active : item.icon"
                        :width="item.width"
                        :height="item.height"
                        :title="item.title"
                    />
                    <img
                        v-if="item.icon && item.name === 'finance'"
                        :src="finance.included?.some(path => route.path.includes(path)) ? item.icon_active : item.icon"
                        :width="item.width"
                        :height="item.height"
                        :title="item.title"
                    />
                    <svg
                        v-if="item.name === 'notifications'"
                        width="32px"
                        height="32px"
                        class="fill-[#64748b] m-1 ml-[1px]"
                        title="Уведомления"
                    >
                      <use :xlink:href="`/images/sprite.svg#bell`" />
                    </svg>

                    <span
                        v-show="loadingIcon === item.name"
                        class="absolute w-[34px] h-[34px] rounded-full border-2 border-surface-600 !border-t-transparent animate-spin -top-[1px] -left-[1px] dark:border-white z-[0]"
                    />
                    <span
                      v-if="notificationStore.unreadNotificationsQuantity && item.name === 'notifications'"
                      class="notifications-quantity absolute bg-[#ff0000] min-w-[20px] h-[20px] flex justify-center items-center text-sm leading-none rounded-full -top-1 -right-1 z-[1] text-white"
                    >
                      {{Math.min(99, notificationStore.unreadNotificationsQuantity)}}
                    </span>
                  </div>
                  <p class="hidden md:block flex-1 pl-[14px] text-start text-[15px] leading-none inline-block whitespace-nowrap">
                    {{item.title}}
                  </p>
                </div>
              </div>

            </div>


            <!--Доп.меню на мобиле-->
            <div class="flex items-center w-full md:p-[6px] mx-auto justify-center md:justify-start cursor-pointer"
                 v-if="isMobile"
                 ref="addNavTriggerEl"
                 @click="toggleMenu2(drawers['menu_mobile'])"
            >
              <div>
                <i class="pi pi-ellipsis-h" style="font-size: 24px;"></i>
              </div>
            </div>


          </div>

          <div class="sidebar-menu__shadow-bottom absolute bottom-0 w-full h-[50px] pointer-events-none opacity-0 transition-opacity duration-100 z-[1] bg-gradient-to-b from-transparent to-sidebar-scroll-shadow"
               v-if="!isMobile"
               :class="{ 'opacity-100' :  ['top', 'between'].includes(scrollPosition) }"
          >
            <div class="sidebar-menu__shadow-bottom-line absolute bottom-0 left-[13px] right-[13px] h-[2px] rounded-sm bg-sidebar-scroll-line"></div>
          </div>

        </section>


        <!-- Ссылка на админку -->
        <section 
          v-if="isAdminVisible()"
          class="hidden md:flex relative md:block md:w-full">
          <div class="flex justify-between items-center w-full gap-1 h-full md:block px-[10px]">
            <a 
              href="https://admin.atloncrm.ru" 
              target="_blank"            
              class="sidebar-item block"
            >
              <div
                  title="Перейти в админку"
                  class="grid grid-cols-[36px_1fr] items-center py-1 px-[1px]"
                  :class="{'sidebar-item--disabled': isFullPage}"
                  @click="showModalsHistoryContainer"
              >
                <button class="text-surface-0 bg-[#64748b] rounded-full w-[30px] h-[30px] m-0.5">
                  <span class="pi pi-objects-column text-[15px]"/>
                </button>
                <p class="hidden md:block flex-1 pl-[14px] whitespace-nowrap">admin.atloncrm.ru</p>
              </div>
            </a>
          </div>
        </section>

        <!-- Профиль пользователя на десктопе -->
        <section
          v-if="!isMobile"
          class="nav-bottom-desctop-profile relative flex md:block md:w-full md:my-1 border-y border-y-sidebar-border"
        >
          <div class="gap-1 md:block px-[10px]"
            :class="store.isSidebarExpanded ? 'px-[10px]' : 'px-[5px]'"
          >
            <div class="">
              <NuxtLink
                v-if="profile.route && (profile.route !== 'users.index')"
                :to="profile.route"
                class="relative flex flex-col w-full"
                @click="clickLink(profile)"
              >
                <div class="flex items-center w-full md:py-[4px] md:px-[2px] mx-auto"
                  :class="{'!px-0': !store.isSidebarExpanded}" title="Профиль"
                >
                  <div class="menu-icon mr-[6px] transition-opacity transition-transform ease-in-out duration-200"
                    :class="store.isSidebarExpanded ? 'opacity-100 scale-1 relative' : 'opacity-0 scale-[0.01] absolute'"
                  >
                    <Avatar
                        :label="user.avatar ? '' : user.name.slice(0,1)"
                        image="/images/pwa/pwa-192x192.png"
                        class="mr-2 bg-[#64748b] dark:bg-[#64748b] text-surface-100 text-[20px]"

                        size="normal" shape="circle"
                    />
                    <span
                        v-show="loadingIcon === profile.name"
                        class="absolute w-[34px] h-[34px] rounded-full border-2 border-surface-600 !border-t-transparent animate-spin -top-[1px] -left-[1px] dark:border-white z-[0]"
                    />
                  </div>
                  <div
                      class="hidden md:flex items-center flex-1 text-start text-[15px] leading-none inline-block whitespace-nowrap min-w-0"
                      :class="{'flex-col': !store.isSidebarExpanded}">
                    <div class="min-w-0 max-w-full">
                      <p
                          class="text-sm text-black dark:text-surface-0 hover:text-[var(--secondary)] dark:hover:text-[var(--secondary)] font-medium pr-2 overflow-hidden text-ellipsis"
                          :class="{'!pr-0': !store.isSidebarExpanded}"
                      >
                        {{user ? user.name : 'Пользователь'}}
                      </p>
                      <p class="block whitespace-nowrap text-sm overflow-hidden text-ellipsis text-[rgb(148,163,184)] pr-2"
                         :class="{'hidden': !store.isSidebarExpanded}">
                        {{user ? user.email : ''}}
                      </p>
                    </div>
                    <button @click.stop.prevent="logoutHandler"
                            class="px-2 py-1 p-2 text-slate-500"
                            :class="{'!p-0': !store.isSidebarExpanded}"
                            title="Выход"
                    >
                      <div class="w-6 h-6 text-gray hover:text-[var(--secondary)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Нижние иконки на десктопе-->
        <section class="nav-bottom-desktop relative flex md:block md:w-full md:pb-2"
                 v-if="!isMobile">

          <div class="relative md:block md:w-full md:pb-2 h-full md:block px-[10px] flex flex-col gap-2">
            <!--Уведомления-->
            <div
                  @click="toggleMenu2(drawers['notifications'])"
                  class="sidebar-item items-center grid grid-cols-[36px_1fr]"
              >
                <div class="relative" title="Уведомления">
                  <svg
                      width="32px"
                      height="32px"
                      class="fill-[#64748b] m-1 ml-[1px]"
                  >
                    <use :xlink:href="`/images/sprite.svg#bell`" />
                  </svg>
                  <span
                      v-show="notificationStore.unreadNotificationsQuantity"
                      class="notifications-quantity absolute bg-[#ff0000] min-w-[20px] h-[20px] flex justify-center items-center text-sm leading-none rounded-full -top-0.5 -right-0.5 z-[1] text-white"
                  >
                        {{Math.min(99, notificationStore.unreadNotificationsQuantity)}}
                      </span>
                </div>
                <p class="hidden md:block flex-1 pl-[14px] text-start text-[15px] leading-none inline-block whitespace-nowrap">Уведомления</p>
              </div>

            <!-- История -->
            <div
                title="История"
                class="sidebar-item grid grid-cols-[36px_1fr] items-center"
                :class="{'sidebar-item--disabled': isFullPage}"
                @click="showModalsHistoryContainer"
            >
              <button class="text-surface-0 bg-[#64748b] rounded-full w-[29px] h-[29px] m-[3px]">
                <span class="pi pi-history text-[15px]"/>
              </button>
              <p class="hidden md:block flex-1 pl-[15px] whitespace-nowrap">История</p>
            </div>

            <!-- Свернуть сайдбар -->
            <div
                :title="store.isSidebarExpanded ? 'Свернуть' : 'Развернуть'"
                class="sidebar-item items-center grid grid-cols-[36px_1fr]"
                @click="store.toggleSidebar"
            >
              <button class="text-slate-500 bg-gray-200 rounded-full w-7 h-7 m-1">
                <span class='pi' :class="!store.isSidebarExpanded ? 'pi-angle-right' : 'pi-angle-left'"/>
              </button>
              <p class="hidden md:block flex-1 pl-[14px] whitespace-nowrap">Свернуть</p>
            </div>

          </div>
        </section>
      </div>
    </div>
  </nav>

  <!-- Списки - панель -->
  <CommonDrawerMenu2 
    v-model:isVisible="listsDrawerVisible" 
    @update:visible="(value)=>updateVisibleMenu2(value,drawers['lists'])"
    class="!md:w-[240px] !h-[calc(100%-60px)] md:!h-full !bg-sidebar-bg !text-[var(--p-sidebar-text)]"
  >
      <div class="flex items-center justify-between border-b-[1.5px] border-sidebar-border px-3 py-[10px]">
        <h2 class="font-semibold text-lg uppercase text-surface-700 dark:text-surface-100">Списки</h2>
        <span @click.stop="closeMenu2(drawers['lists'])" class="pi pi-times-circle text-2xl text-sidebar-text hover:text-sidebar-item-active-text cursor-pointer" />
      </div>
      <div v-for="(group,index) in filteredGroup(list.groups)" :key="index" class="px-[10px]">
        <h4 class="py-4 pb-2 text-surface-700 dark:text-[rgb(203,213,225)]">{{ group.name }}</h4>
        <div
          v-for="item in group.items"
          :key="item.label"
          class="w-full cursor-pointer "
        >
<!--                  || page.props.auth.user.role_id === 22)-->
          <NuxtLink
              v-if="item.route && (item.route !== 'users.index')"
              :to="item.route"
              class="flex w-full relative p-[6px] items-center hover:bg-sidebar-item-active-bg"
              :class="isActiveRoute(item)
            ? ''
            : ''
          "
              @click="clickLink(item)"
          >
            <img
                :src="isActiveRoute(item) ? item.icon_active : item.icon"
                :width="item.width"
                :height="item.height"
            />
            <p class="text-left leading-none inline-block pl-[14px] text-[15px]">{{item.title}}</p>
          </NuxtLink>

        </div>
      </div>
  </CommonDrawerMenu2>

  <!-- Финансы - панель -->
  <CommonDrawerMenu2
    v-model:isVisible="financeDrawerVisible"
    class="!md:w-[240px] !h-[calc(100%-60px)] md:!h-full !bg-sidebar-bg !text-[var(--p-sidebar-text)]"
  >
      <div class="flex items-center justify-between border-b-[1.5px] border-sidebar-border px-3 py-[10px]">
        <h2 class="font-semibold text-lg uppercase text-surface-700 dark:text-surface-100">Статистика</h2>
        <span @click.stop="closeMenu2(drawers['finance'])" class="pi pi-times-circle text-2xl text-sidebar-text hover:text-sidebar-item-active-text cursor-pointer" />
      </div>
      <div v-for="(group,index) in filteredGroup(finance.groups)" :key="index" class="px-[10px]">
        <h4 class="py-4 pb-2 text-surface-700 dark:text-[rgb(203,213,225)]">{{ group.name }}</h4>
        <div
          v-for="item in group.items"
          :key="item.label"
          class="w-full cursor-pointer "
        >
          <NuxtLink
              v-if="item.route && (item.route !== 'users.index')"
              :to="item.route"
              class="flex w-full relative p-[6px] items-center hover:bg-sidebar-item-active-bg"
              @click="clickLink(item)"
          >
            <img
                :src="isActiveRoute(item) ? item.icon_active : item.icon"
                :width="item.width"
                :height="item.height"
            />
            <p class="text-left leading-none inline-block pl-[14px] text-[15px]">{{item.title}}</p>
          </NuxtLink>
        </div>
      </div>
  </CommonDrawerMenu2>

  <!--Уведомления:панель-->
  <CommonDrawerMenu2
    v-model:isVisible="notificationsDrawerVisible"
    :pt="ptDrawerNotifications"
    class="!h-[calc(100%-60px)] md:!h-full"
    >
    <div class="drawer-sidepanel-inner relative h-full flex flex-col py-[10px] px-2 bg-sidebar-bg">
      <NotificationList @close="closeMenu2(drawers['notifications'])"/>
    </div>

  </CommonDrawerMenu2>  

  <!--Доп пункты меню на мобиле-->
  <CommonDrawerMenu2
    v-if="isMobile"
    v-model:isVisible="menuMobileDrawerVisible"
    class="drawer-mobile !h-auto min-h-[10rem] flex justify-center bg-sidebar-bg text-sidebar-text"
  >

    <div class="py-2">
      <div v-for="item in mobileAddItems">
        <NuxtLink
            v-if="item.route && (item.route !== 'users.index')"
            :to="item.route"
            class="relative flex flex-col w-full py-1 px-2"
            :class="route.path.includes(item.name)
              ? ''
              : ''
            "
            @click="clickLink(item)"
        > 
              <div class="flex items-center w-full md:p-[6px] mx-auto">
                <div class="relative menu-icon shrink-0">
                  <img
                    class=""
                    :src="item.icon"
                    :width="item.width"
                    :height="item.height"
                  />
                  <div
                    v-if="store.sidebarOptions && store.sidebarOptions[item.name] && store.sidebarOptions[item.name].super"
                    class="absolute bg-[#ff0000] min-w-[20px] h-[20px] flex justify-center items-center text-sm leading-none rounded-full -top-1 -right-2 z-[1]"
                    >
                    <p class="inline-block px-1">{{ store.sidebarOptions[item.name] && store.sidebarOptions[item.name].super}}</p>
                  </div>
                  <span
                      v-show="loadingIcon === item.name"
                      class="absolute w-[34px] h-[34px] rounded-full border-2 border-surface-600 !border-t-transparent animate-spin -top-[1px] -left-[1px] dark:border-white z-[0]"
                  />
                </div>  
                <p class="flex-1 pl-[14px] text-start text-[15px] leading-none inline-block whitespace-nowrap">{{item.title}}</p>
              </div>
        </NuxtLink>

        <div
          v-if="typeof item.menuRef != 'undefined'"
          class="w-full cursor-pointer rounded-md md:hover:bg-sidebar-item-active-bg py-1 px-2 md:px-0"
          @click="toggleMenu2(item.menuRef)"
        >
          <div class="flex items-center w-full md:p-[6px] mx-auto">
              <div class="relative menu-icon shrink-0">
                <img
                  class=""
                  :src="item.icon"
                  :width="item.width"
                  :height="item.height"
                />
                <div
                  v-if="store.sidebarOptions && store.sidebarOptions[item.name] && store.sidebarOptions[item.name].super"
                  class="absolute bg-[#ff0000] min-w-[20px] h-[20px] flex justify-center items-center text-sm leading-none rounded-full -top-1 -right-2 z-[1]"
                  >
                  <p class="inline-block px-1">{{ store.sidebarOptions[item.name] && store.sidebarOptions[item.name].super}}</p>
                </div>
                <span
                    v-show="loadingIcon === item.name"
                    class="absolute w-[34px] h-[34px] rounded-full border-2 border-surface-600 !border-t-transparent animate-spin -top-[1px] -left-[1px] dark:border-white z-[0]"
                />
              </div>  
              <p class="flex-1 pl-[14px] text-start text-[15px] leading-none inline-block whitespace-nowrap">{{item.title}}</p>
          </div>       
        </div>
      </div>

      <!-- Ссылка на админку на мобиле -->
      <div class="w-full cursor-pointer rounded-md md:hover:bg-sidebar-item-active-bg py-1 px-2 md:px-0">
        <a 
          href="https://admin.atloncrm.ru" 
          target="_blank"
          class="md:hover:bg-sidebar-item-active-bg" >
          <div
              title="Перейти в админку"
              class="grid grid-cols-[34px_1fr] items-center"
              :class="{'sidebar-item--disabled': isFullPage}"
              @click="showModalsHistoryContainer"
          >
            <button class="text-surface-0 bg-[#64748b] rounded-full w-[30px] h-[30px] m-0.5">
              <span class="pi pi-objects-column text-[14px]"/>
            </button>
            <p class="md:hidden flex-1 pl-[12px] whitespace-nowrap">admin.atloncrm.ru</p>
          </div>
        </a>
      </div>     

      <!-- Профиль пользователя на мобиле  -->
      <NuxtLink
        v-if="isMobile"
        to="/profile"
        class="relative flex w-full"
        :class="isActiveRoute(profile)
          ? ''
          : ''
        "
        @click="clickLink(profile)"
    > 
          <div class="flex items-center w-full md:p-[6px] mx-auto justify-center md:justify-start py-1 px-2 border-y border-y-sidebar-border border-y-solid ">
            <div 
              class="flex items-center flex-1 text-start text-[15px] leading-none inline-block whitespace-nowrap min-w-0"
            >
              <div class="relative menu-icon shrink-0">
                <Avatar
                    :label="user.avatar ? '' : user.name.slice(0,1)"
                    image="/images/pwa/pwa-192x192.png"
                    class="mr-2 bg-[#64748b] dark:bg-[#64748b] text-surface-100 text-[20px]"

                    size="normal" shape="circle"
                />
              </div>    
              <div class="min-w-0 pl-[6px]">
                <p 
                  class="text-sm text-black dark:text-surface-0 hover:text-[var(--secondary)] dark:hover:text-[var(--secondary)] font-medium"
                >
                  {{user ? user.name : 'Пользователь'}}
                </p>   
              </div>
              <button @click.stop.prevent="logoutHandler" class="p-2 pl-6 text-slate-500" title="Выход">
                <div class="w-6 h-6 text-gray">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"></path>
                    </svg>
                </div>                        
              </button>                                           
            </div>
          </div>
      </NuxtLink>    

      <!-- Переключатель темной темы на мобиле-->
      <div class="w-full cursor-pointer rounded-md md:hover:bg-sidebar-item-active-bg py-1 px-2 md:px-0">
        <div @click="store.toggleIsDark()" class="dark-mode-toggle md:p-[6px] md:hover:bg-sidebar-item-active-bg" >
          <div v-show="!store.isDark" class="flex items-center cursor-pointer">
            <span class="w-8 h-8 flex justify-center items-center shrink-0">
              <i class="pi pi-sun text-[24px]"></i>
            </span>
            <p class="flex-1 pl-[14px] whitespace-nowrap">Темная тема</p>
          </div>
          <div v-show="store.isDark" class="flex items-center cursor-pointer">
            <span class="w-8 h-8 flex justify-center items-center shrink-0">
              <i class="pi pi-moon text-[24px]"></i>
            </span>
            <p class="flex-1 pl-[14px] whitespace-nowrap">Светлая тема</p>
          </div>
        </div>
      </div>   

    </div>

  </CommonDrawerMenu2>    

</template>


<style scoped>
  .sidebar-menu__scrollable {
    scrollbar-width: none;
  }

  .sidebar-item {
    @apply w-full cursor-pointer md:hover:bg-sidebar-item-active-bg md:hover:text-sidebar-item-active-text px-1.5 md:px-0;
  }

  .sidebar-item--disabled {
    @apply cursor-not-allowed opacity-50 md:hover:bg-transparent md:hover:text-inherit;
  }

  .projects-select.p-focus {
    @apply !border-input-border !ring-4 !ring-input-focus-ring !ring-opacity-50;
  }

</style>