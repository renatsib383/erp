export const connectRooms = (approvedSmeta) => {
    const list = approvedSmeta?.rooms?.list?.map(Number) || []; // Список комнат в смете

    // Фильтруем и создаем новый объект с работами из включенных комнат
    const involvedRooms = Object.entries(approvedSmeta?.rooms?.works || {}).reduce((acc, [key, value]) => {
        if (list.includes(Number(key))) {
            acc[key] = value;
        }
        return acc;
    }, {});

    const combinedWorks = Object.values(involvedRooms).reduce((acc, item) => {
        acc.total = Math.round((acc.total + item.total) * 100) / 100; // округляем до 2 знаков после запятой и оставляем как число

        for (const [workId, quantity] of Object.entries(item.works)) {
            if (acc.works[workId]) {
                acc.works[workId] += Number(quantity);
            } else {
                acc.works[workId] = Number(quantity);
            }
        }

        return acc;
    }, { total: 0, works: {} });

    return {
        id: 0,
        name: 'Все помещения',
        works: combinedWorks
    };
};

export const getSmetWorksSum = (rooms, activeEstimate) => {
    const list = activeEstimate?.rooms?.list?.map(Number) || []; // Список комнат в смете
    // Проверяем есть ли такая комната в смете и включена ли она(участвует в вычисление цены)
    const involvedRooms = Object.entries(rooms).filter(([key]) => list.includes(Number(key)));

    let sum = 0;
    involvedRooms.forEach(([, room]) => {
        sum += Number(room.total);
    });

    // return sum ? Math.round(sum * 100) / 100 : 0;
    return sum ? Math.ceil(sum) : 0;
};

export const getSmetWorksSumWithoutDiscount = (rooms, skidka, activeEstimate) => {
    const smetWorksSum = getSmetWorksSum(rooms, activeEstimate); // Сумма со скидкой
    if (!smetWorksSum || !skidka) {
        return smetWorksSum || 0;
    }

    const total = smetWorksSum / (1 - skidka / 100); // Вычисляем сумму без скидки
    // return total ? Math.round(total * 100) / 100 : 0;
    return total ? Math.ceil(total) : 0;
};

export const getSmetWorksQuantity = (rooms) => {
    let quantity = 0;
    if (rooms) {
        Object.values(rooms).forEach(room => {
            Object.keys(room.works).forEach(work => quantity += 1);
        });
    }
    return quantity;
};

export const smetWorksFactorFunctions = {
    getWindowsWidth: function (room) {
        let sum = 0;
        if(room && room.windows){
            room.windows.forEach(window => {
                sum += (window.value * window.width)
            })
            return sum;
        }
    },
    getWindowsillsSquare: function (room) {
        let sum = 0;
        if(room && room.windows){
            room.windows.forEach(window => {
                sum += window.value * (window.width * window.depth)
            })
        }
        return sum;

    },
    getWindowsSquare: function (room) {
        let windowsArea = 0;
        if (room.windows) {
            room.windows.forEach((window) => {
                windowsArea += window.value * (window.height * window.width);
            });
        }
        return windowsArea;
    },
    getWindowsSlopeSqaure: function (room) {
        let sum = 0;
        if(room.windows){
            room.windows.forEach(window => {
                sum += window.value * (((window.width + window.height) * 2) * window.depth)
            })
        }
        return sum;
    },
    getWindowsCount: function (room) {
        let sum = 0;
        if(room && room.windows){
            room.windows.forEach(window => {
                sum += window.value
            })
        }
        return sum;
    },

    getDoorsSquare: function (room) {
        let doorsArea = 0;
        if (room.doors) {
            room.doors.forEach((door) => {
                doorsArea += door.value * (door.height * door.width);
            });
        }
        return doorsArea;
    },
    getDoorsWidth: function (room) {
        let sum = 0;
        if(room && room.doors) {
            room.doors.forEach(door => {
                sum += (door.value * door.width)
            })
        }
        return sum;
    },
    getDoorsCount: function (room) {
        let sum = 0;
        if(room && room.doors){
            room.doors.forEach(door => {
                sum += door.value
            })
        }
        return sum;
    },
    getDoorsAndWindowsCount: function (room) {
        return this.getDoorsCount(room) + this.getWindowsCount(room)
    },

    getColumnsWallSquare: function (room) {
        let sum = 0;
        if (room.columns){
            room.columns.forEach(column => {
                if(Number(column.type) === 2){ // Колонна
                    sum += (column.a * room.height + column.b * room.height) * 2
                }
                if(Number(column.type) === 1){ // Выступ
                    sum += column.a * room.height + column.b * room.height * 2
                }
                if(Number(column.type) === 0){ // Внешний угол
                    sum += column.a * room.height + column.b * room.height
                }
            })
        }
        return sum;
    },

    getAllCornersCount: function (room) {
        return room.room_size.outer_corner + room.room_size.inner_corner
    },
    getOutsideCornersWidth: function (room) {
        return room.room_size.outer_corner * room.height
    },
    getInsideCornersWidth: function (room) {
        return room.room_size.inner_corner * room.height
    },
    getAllCornersWidth: function (room) {
        return (room.room_size.inner_corner + room.room_size.outer_corner) * room.height
    },
    getOutsideCornersCount: function (room) {
        return room.room_size.outer_corner
    },
    getInsideCornersCount: function (room) {
        return room.room_size.inner_corner
    },
};