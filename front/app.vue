<script setup>
import { useMainStore } from '@/stores/main.js'
import {useNotificationStore} from "@/stores/notifications.js";
import { useImboxStore } from '@/stores/imbox.js';
import {fetchUsersWithRolesAndNewFilters} from "~/services/api/usersServices.js";

const { $pwa, $showErrorToast, $showInfoToast, $showTypedToast, $api } = useNuxtApp()
const { isOffline } = useNetworkStatus()
const store = useMainStore();
const listsStore = useListsStore();
const notificationStore = useNotificationStore()
const imboxStore = useImboxStore();
const user = useSanctumUser();
const echo = useEcho();
const route = useRoute();

let deferredPrompt = null;

localStorage.removeItem('savedVisibleColumns') // Нужно, чтобы избежать ошибки в таблице с LStorage
localStorage.removeItem('savedVisibleColumns1')

onMounted(() => {
  setViewHeight();
  setIsDark();

  // 1. Кастомный баннер для предложения установить приложение
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Предотвращаем автоматический показ баннера
    deferredPrompt = e; // Сохраняем событие для дальнейшего использования
    $pwa.installPrompt = true; // Устанавливаем флаг, что промпт доступен
  });

  setupImboxNotifications();

  // Так как пользователей могут менять через админку, решили обновить список каждый час, чтобы разрешения и роли актуальные были
  setTimeout(() => {
    updateUsersListWithInterval()
  }, 1500)

  setTimeout(() => {
    getPermissionsToNotificationShow()
    setupNotifications()
  }, 2500)
})

// Page
const setViewHeight = () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}
const setIsDark = () => {
  try {
      document.documentElement.classList.toggle("dark", store.isDark);
    } catch (e) {
      console.error("Failed to set theme class:", e);
    }
}

// UsersList
const updateUsersListWithInterval = async () => {
  const params = { // Параметры, чтобы получить только необходимые данные
    include: 'roles',
    fields: {
      users: ['id', 'name', 'profile_type', 'profile_id'],
      roles: ['id', 'name'],
    },
  }
  setInterval(async () => {
    const allUsers = await fetchUsersWithRolesAndNewFilters(params)
    listsStore.setUsersLists(allUsers)
  }, 3600000)

  // Первый раз при открытии, а дальше каждый час
  const allUsers = await fetchUsersWithRolesAndNewFilters(params)
  listsStore.setUsersLists(allUsers)
}

// Notifications
const setupNotifications = async () => {
  await notificationStore.fetchNotifications();

  if (user.value?.id) {
    echo.private(`App.Models.User.${user.value.id}`).notification((notification) => {
      const note = {
        id: notification.id,
        type: notification.type,
        data: {
          body: notification.body,
          date: notification.date,
          link: notification.link,
          title: notification.title,
        }
      }
      notificationStore.addNewNotification(note);

      // setTimeout(async () => {
        // try {
        //   await $api.post("/push/send", { notification: notification.id });
        // } catch (e) {
        //   console.error('Error while send Notification',e);
        // }
        // showNotification(note)
      // })
    });
  }
}

// Imbox
const setupImboxNotifications = () => {
    let sidebarOptions = { home: {
      super: 0
    }};
    store.setSidebarOptions(sidebarOptions);
    echo.join('imbox')
      .listen('Update', (e) => {   
        if (route.fullPath != '/' && user.value.id != e.data.last_message.user.id) {
          imboxStore.addedNotificationsIncrement();
          $showTypedToast('imbox','Сообщение',e.data.last_message.text,'info',{title: e.data.title, room: e.data.room});
        }
    })
}

// PWA
const installPWA = async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt(); // Показываем баннер
    // const { outcome } = await deferredPrompt.userChoice;
    // console.log('Результат выбора пользователя:', outcome); // 'accepted' или 'dismissed' // После accepted браузер сразу устоановить приложение
    setTimeout(() => {
      deferredPrompt = null; // Сбрасываем после использования
      dismissPrompt() // Скрываем баннер
    }, 10)
  } else {
    console.log('Промпт установки недоступен');
  }
};

const dismissPrompt = () => {
  if ($pwa && $pwa.installPrompt) {
    $pwa.installPrompt = false; // Скрываем уведомление
  }
}

const updatePWA = async () => {
  try {
    let registration;

    // Нужно для обновления всех вкладов
    navigator.serviceWorker.addEventListener('controllerchange', () => { // Ждем смены контроллера
      // $showInfoToast('Контроллер сменился');
      window.location.reload();
    })

    // 1: Пробуем получить регистрацию через $pwa плагин
    if ($pwa && typeof $pwa.getSWRegistration === 'function') {
      registration = await $pwa.getSWRegistration();
    }

    // 2: Если $pwa не сработал, используем нативный API
    if (!registration) {
      // console.log('$pwa.getSWRegistration не вернул регистрацию, проверяем вручную');
      registration = await navigator.serviceWorker.getRegistration();
    }

    // 3: Проверяем ожидающий SW
    const waitingWorker = registration.waiting;
    if (waitingWorker) {
      // $showInfoToast('Найден ожидающий Service Worker, отправляем SKIP_WAITING');
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    else {
      // $showErrorToast('Нет ожидающего Service Worker или регистрации');
      reloadPage()
    }
  }
  catch (error) {
    // $showErrorToast('Ошибка при обновлении PWA');
    console.log('Ошибка при обновлении PWA:', error);
  }
};

const closeUpdatePWABanner = () => {
  $pwa.needRefresh = false; // Скрываем баннер обновления
  $pwa.cancelPrompt()
  console.log('Уведомление об обновлении закрыто');
}

const reloadPage = () => {
  window.location.reload()
}

// Пуши - спросить разрешение для показа уведомлений
const getPermissionsToNotificationShow = async () => {
  const result = await Notification.requestPermission();
  if (result === 'denied') {
    // console.log('The user denied');
    return;
  }
  if (result === 'granted') {
    // console.log('The user accepted');
    await subscribeUser();
  }
}
// Пуши - подписка
const subscribeUser = async () => {
  try {
    // Ждем, пока Service Worker не станет активным
    const registration = await navigator.serviceWorker.ready;

    // Проверяем подписку
    const subscription = await registration.pushManager.getSubscription();
    // console.log(subscription)
    if (subscription) {
      console.info('Пользователь уже подписан:', subscription);
      return;
    }

    // Подписываем, если нет подписки
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
          'BML9MeXXFdnDJX686oyh_cyXtb4E8eIVKvF9RWchF_ldzcR-dImRnhO061Dugvsnq2X9RyLWyGNV_V6IUQ5PtUE',
    });

    // Отправляем подписку на сервер
    await sendSubscriptionToServer(newSubscription);
  } catch (err) {
    console.error('Error during subscription process:', err);
  }
}

const sendSubscriptionToServer = async (subscription) => {
  // Отправляем подписку на сервер
  try {
    await $api.post("/push/subscribe", { subscription, user_id: user.value.id  });
    // console.info('User is subscribe now.');
  } catch (e) {
    console.error('Ошибка при подписке к Push', e);
  }
}

</script>

<template>
    <VitePwaManifest/>
    <NuxtLayout>
      <!-- Предложение установить приложение -->
      <div v-if="$pwa && $pwa.installPrompt" class="fixed top-[20px] right-[20px] max-sm:right-1/2 max-sm:translate-x-1/2 z-40 bg-primary-700 rounded flex flex-col text-white p-4 px-6 text-center min-w-[300px] max-w-[350px] opacity-90">
        <h3 class="text-lg">Установите приложение для более удобного пользования!</h3>
        <div class="mt-[15px] flex justify-center gap-4" >
          <button @click.stop="installPWA" class="text-[16px] p-[8px] bg-emerald-500 text-white rounded min-w-[100px]">Установить</button>
          <button @click="dismissPrompt" class="rounded p-[8px] bg-white text-black text-[14px] min-w-[100px]">Нет, позже</button>
        </div>
      </div>

      <!-- Когда оффлайн -->
      <div v-show="isOffline" class="fixed top-[20px] right-1/2 translate-x-1/2 z-40 bg-primary-700 rounded-xl flex p-2 px-3 text-center items-center justify-center gap-2 text-surface-300 opacity-90">
        <p class="text-lg"> Автономный режим </p>
        <span class="relative text-red-400"><span class="pi pi-wifi"/><span class="left-[7px] -top-[3px] text-[18px] absolute rotate-45">|</span></span>
        <!-- <button @click="reloadPage" class="pi pi-replay bg-primary-600 rounded-full p-2 px-3"/>-->
      </div>

      <!-- Пришло новое обновление -->
      <div v-show="$pwa.needRefresh" class="fixed top-[20px] right-[20px] max-sm:right-1/2 max-sm:translate-x-1/2 z-[60] bg-primary-700 rounded flex flex-col text-white p-4 px-6 text-center min-w-[300px] max-w-[350px]">
        <h3 class="text-lg">Пришло новое обновление!<br>Обновите для улучшения опыта использования</h3>

        <div class="mt-[15px] flex justify-center gap-4" >
          <button @click="updatePWA" class="text-[16px] p-[8px] bg-emerald-500 text-white rounded min-w-[100px] flex items-center justify-center gap-2">
            <p>Обновить</p>
            <span class="pi pi-sync text-sm"/>
          </button>
          <button @click="closeUpdatePWABanner" class="rounded p-[8px] bg-white text-black text-[14px] min-w-[100px]">Позже</button>
        </div>
      </div>

  <!--    <NuxtLoadingIndicator />-->
  <!--    <CommonHeader class="ml-[72px]"/>-->
  <!--    <CommonSidebar/>-->
    <NuxtPage/>
    </NuxtLayout>
</template>