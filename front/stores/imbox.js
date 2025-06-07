import { defineStore } from 'pinia';
import {useMainStore} from "~/stores/main.js";
import { fetchLists } from "@/services/api/imboxServices.js";

export const useImboxStore = defineStore(
    'imbox', {
        state: () => ({
            activeRoom: null,
            addedNotificationsCounter: 0,
            lists: {}
        }),
        persist: {
            storage: piniaPluginPersistedstate.localStorage(),
            pick: ['activeRoom'] // Какие переменные сохранить в LS
        },
        actions: {
            addedNotificationsIncrement() {
                this.addedNotificationsCounter++;
                this.__updateSidebarOptions();
            },
            addedNotificationsReset() {
                this.addedNotificationsCounter = 0;
                this.__updateSidebarOptions();
            },
            __updateSidebarOptions(counter) {
                const main = useMainStore();
                let sidebarOptions = { home: {
                    super: this.addedNotificationsCounter                  
                }};  
                main.setSidebarOptions(sidebarOptions);                
            },
            async getLists() {
                const response = await fetchLists();
                if (response.success) {
                    this.lists = response.data;
                }                
            }
        },
        getters: {
        },
    },
    {
        persist: true,
    }
)