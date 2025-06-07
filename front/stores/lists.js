import { defineStore } from 'pinia'
import {getDDSLists} from "~/services/api/ddsServices.js";

export const useListsStore = defineStore(
  'lists', {
        state: () => ({
            act_statuses: null,
            roomSettings: null,
            partners: null,
            tags: null,
            users: null,
            tasks: null,
            pipelines: null,
            workSettings: null,
            fields: null,

            ddsLists: null,
            ddsStatistics: null,

            usersWithRolesList: null,
        }),
        actions: {
            setDealsLists(list) {
                this.act_statuses = list.act_statuses;
                this.roomSettings = list.roomSettings;
                this.partners = list.partners;
                this.tags = list.tags;
                this.users = list.users;
                this.tasks = list.tasks;
                this.pipelines = list.pipelines;
                this.workSettings = list.workSettings;
                this.fields = list.fields;
            },

            async fetchDdsLists() {
                this.ddsLists = await getDDSLists()
            },
            setDdsStatistics(cashRegisters, operations) {
                this.ddsStatistics = {
                  cashRegisters,
                  operations,
                }
            },

            setUsersLists(list){
              this.usersWithRolesList = list;
            }
        },
        getters: {
            getDdsLists : (state) => state.ddsLists,
            getDdsStatistics : (state) => state.ddsStatistics,
        },
    },
)