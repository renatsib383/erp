import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

// Предварительное кэширование ресурсов из манифеста
precacheAndRoute(self.__WB_MANIFEST);

// Немедленное управление активными клиентами
clientsClaim();
// Удаление устаревших кэшей
cleanupOutdatedCaches();

// Настройка белого списка для навигационных запросов
const allowlist = import.meta.env.DEV
  ? [/^\/$/] // В режиме разработки кэшируем только главную страницу
  : undefined; // В продакшене кэшируем все навигационные запросы

// Регистрация маршрута для оффлайн-поддержки
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL('/'),
    { allowlist }
  )
);

// Активируем новый SW только после подтверждения пользователя
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    return self.skipWaiting()
  }
})

self.addEventListener('push', function(event) {
  let note = event.data.json();

  event.waitUntil(
    self.registration.showNotification(note.title, {
      body: note.body.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""),
      icon: '/logo.png',
      tag: note.data.link || 'default', // Группировка(заменяет старое уведомление) по объекту. Т.е в рамках одной сделки будет только одно уведомление с последними изменениями
      renotify: true, //  вызывает звук или вибрацию
      data: {
        link: note.data.link,
      },
    })
  );
  // Attempt to resubscribe after receiving a notification
  // event.waitUntil(resubscribeToPush());
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const link = event.notification.data.link;

  if (link) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        // Проверяем, есть ли уже открытое окно с этим URL
        for (let client of windowClients) {
          if (client.url === link && 'focus' in client) {
            return client.focus();
          }
        }
        // Если окно не найдено, открываем новое
        return clients.openWindow(link);
      })
    );
  }
});



