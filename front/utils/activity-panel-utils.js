export const fillMissingValues = async (employers, panelType) => {
    const updatedData = await employers.map((employer) => {
        const filledValues = {};
        let activeValuesLength = 0; // Количество активного времени

        for (const date in employer.values) {
            const dayValues = employer.values[date];
            const today = new Date().toISOString().slice(0, 10);
            let dayValue = 0; // Значение будет 0 для прошедших дней или -1 для сегодняшнего
            const maxBlocks = 131;
            let activeDayValueLength = 0;

            if (date === today) {
                dayValue = -1;
            }

            if (!Array.isArray(dayValues) || dayValues.length === 0) {
                // Если пустой массив
                filledValues[date] =
                    panelType === 'day' ? Array(maxBlocks).fill(dayValue) : [100];
                continue;
            }

            // Создаем массив до максимального значения
            const filledDayValues =
                panelType === 'day' ? Array(maxBlocks).fill(dayValue) : [];

            // Заполняем массив с индексами активности
            dayValues.forEach((value) => {
                if (typeof value === 'number' && value > 0) {
                    if (panelType === 'day') {
                        filledDayValues[value - 1] = value;
                    }
                    activeValuesLength += 1;
                    activeDayValueLength += 1;
                }
            });

            if (panelType === 'range') {
                const thisDayActivityPercent = Math.round(activeDayValueLength * 0.76);
                const thisDayDeactivityPercent = Math.round(
                    100 - thisDayActivityPercent
                );
                filledDayValues.push(
                    thisDayActivityPercent,
                    thisDayDeactivityPercent
                );
                activeDayValueLength = 0;
            }

            filledValues[date] = filledDayValues;
        }

        const activityTime = (activeValuesLength * 5) / 60; // Количество активного времени в часах
        const hours = Math.floor(activityTime); // Часы
        const minutes = Math.round((activityTime - hours) * 60); // Минуты

        const activityPercent = Math.round(activeValuesLength * 0.76);

        return {
            ...employer,
            values: filledValues,
            activityTime: `${hours}ч. ${minutes}мин.`,
            activityPercent: `${activityPercent}%`,
        };
    });

    return updatedData;
};