import { defineStore } from 'pinia'
import {fetchNotifications} from "~/services/api/notificationsServices.js";

export const useNotificationStore = defineStore(
    'notifications', {
        state: () => ({
            notifications: [],
            viewedNotificationsArchive: []
        }),
        actions: {
            async fetchNotifications(params) {
                try {
                    const loadedQuantity = this.notifications.length
                    const newNotifications = await fetchNotifications(loadedQuantity, 50);
                    if (newNotifications.unread?.length) {
                        this.notifications = [...this.notifications, ...newNotifications.unread];
                    }
                    if (newNotifications.read?.length) {
                      this.viewedNotificationsArchive = [...this.viewedNotificationsArchive, ...newNotifications.read];
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            addNewNotification(notification) {
                this.notifications.unshift(notification);
            },

            deleteShowedNotification(id) {
              const index = this.notifications.findIndex(n => n.id === id);
              if (index === -1) {
                return;
              }

              // Извлекаем уведомление и добавляем в архив
              const [thisNotification] = this.notifications.splice(index, 1);
              this.viewedNotificationsArchive.unshift(thisNotification);
            }
        },
        getters:{
            unreadNotificationsQuantity: state => {
                const unread = state.notifications.filter(note => !note.read_at)
                return unread.length
            }
        }
    },
)