import { defineStore } from 'pinia'
import {updateTask ,createTask } from "~/services/api/tasksServices.js";

export const useTasksStore = defineStore(
    'task', {
        actions: {
         
            async updateTask(taskData) {

                let newEvent = {};                
                newEvent = Object.assign(newEvent, taskData);
                this._processData(newEvent);
                
                // newEvent = Object.fromEntries(
                //   Object.entries(newEvent).filter(([key]) => key !== 'customData')
                // );
                              

                const response = await updateTask(newEvent);
                return response;

            },
            //
            async createTask(taskData) {
                let newEvent = {};                
                newEvent = Object.assign(newEvent, taskData);
                this._processData(newEvent);
                const response = await createTask(newEvent);
                return response;                
            },
            _processData(newEvent) {
                const currentUser = useSanctumUser();
    
                newEvent.created_by = newEvent.created_by ? newEvent.created_by : currentUser.value.id;
                
                newEvent.performer = newEvent.performer ? typeof newEvent.performer === 'object' ? newEvent.performer.id : newEvent.performer : null
                // newEvent.duration = newEvent.customData.duration
                newEvent.allDay = newEvent.duration === 1440;
                newEvent.all_day = newEvent.allDay;
                if (typeof newEvent.start == 'string') {
                    newEvent.start = new Date(newEvent.start);
                }
                newEvent.end = new Date(newEvent.start.getTime() + newEvent.duration * 60 * 1000);
                if (newEvent.timeZone && newEvent.timeZone === 'UTC') {
                    newEvent.start = newEvent.start && createDateAsUTC(newEvent.start);
                    newEvent.end = newEvent.end && createDateAsUTC(newEvent.end);
                }
            },           
        },
 
    },
)