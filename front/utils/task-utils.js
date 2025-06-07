
const TASK_OPTIONS = {
    colors: {
        1: '#0be370',  // Звонок - Зеленый
        2: '#FF7F50',  // Встреча - Оранжевый
        999: '#20B2AA', // Прочее - Бирюзовый
        null: '#3357FF',  // Если тип не выбран - Синий
    },
    types: {
        1: 'Звонок', // Звонок
        2: 'Встреча', // Встреча
        999: 'Прочее' // Прочее
    },
    icons: {
        1: 'pi pi-phone', // Звонок
        2: 'pi pi-users', // Встреча
        999: 'pi pi-thumbtack' // Прочее
    }
}


export const isOverdue = (task) => {
    let endDate = null;

    if (task.end) {
        endDate = new Date(task.end);
    } else if (!task.end && task.duration && task.start) {
        const dateR = new Date(task.start);
        endDate = new Date(dateR.getTime() + task.duration * 60 * 1000);
    } else if (!task.end && !task.duration && task.start){
        const dateR = new Date(task.start);
        endDate = new Date(dateR.getTime() + ((12*60) * 60 * 1000));
    }

    if (endDate && !isNaN(endDate.getTime())) {
        const endDateUTC = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);
        const currentDate = new Date(Date.now());

        if (currentDate.getTime() > endDateUTC.getTime()) {
            return true;
            // task.overdue = true;
        }
    } else {
        console.error("endDate is not valid:", endDate);
    }
    return false;
}

export const setTaskColor = (tasks) => {

    return tasks.map(task => {
        // let endDate = null;

        // if (task.end) {
        //     endDate = new Date(task.end);
        // } else if (!task.end && task.duration && task.start) {
        //     const dateR = new Date(task.start);
        //     endDate = new Date(dateR.getTime() + task.duration * 60 * 1000);
        // } else if (!task.end && !task.duration && task.start){
        //     const dateR = new Date(task.start);
        //     endDate = new Date(dateR.getTime() + ((12*60) * 60 * 1000));
        // }

        // if (endDate && !isNaN(endDate.getTime())) {
        //     const endDateUTC = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);
        //     const currentDate = new Date(Date.now());

        //     if (currentDate.getTime() > endDateUTC.getTime()) {
        //         task.overdue = true;
        //     }
        // } else {
        //     console.error("endDate is not valid:", endDate);
        // }

        if (isOverdue(task)) {
            task.overdue = true;
        }

        return {
            ...task,
            allDay: task.all_day,
            extendedProps : {customData: {duration: task.duration}},
            backgroundColor: TASK_OPTIONS.colors[task.type],
            borderColor: task.overdue ? 'red' : 'transparent',
        };
    });
}

export {TASK_OPTIONS};