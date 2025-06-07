// Преобразует строку даты в формате  ISO 8601 в дату, так, чтобы сохранить исходные время и дату.
export const parseISOStrict = (dateString) => {
    return new Date(
      new Date(Date.parse(dateString)).toLocaleString("en-US", { timeZone: "UTC" })
    );
}


export const dateFormatUni = (date, timeOnly= false, dateOnly = false) => {
  // date - либо строка, либо дата в текущей Time Zone
  // строку преобразовывает в дату в текущей TZ, с исходным значением даты, дату осталяет без изменений
  if (typeof date == 'string') {
    let result = dateFormat(date,timeOnly,true,dateOnly);
    return dateFormat(date,timeOnly,true,dateOnly);
  }
  if (typeof date == 'object') {
    let result = dateFormat(date,timeOnly,false,dateOnly);
    return dateFormat(date,timeOnly,false,dateOnly);
  }
}


export const dateFormat = (date, timeOnly= false, changeTimeZone= false, dateOnly = false) => {
    let dateObj = new Date(date);
    if (changeTimeZone) {
      dateObj = new Date(dateObj.toLocaleString('en-US', { timeZone: 'UTC' }));
    }

    let day,month,year;
    if (!timeOnly) {
      day = String(dateObj.getDate()).padStart(2, "0");
      month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Январь это 0
      year = dateObj.getFullYear();
    }

    let hours = String(dateObj.getHours()).padStart(2, "0");
    let minutes = String(dateObj.getMinutes()).padStart(2, "0");
    if (timeOnly) {
      return `${hours}:${minutes}`;
    } else if (dateOnly) {
      return `${day}.${month}.${year}`;
    }
    else {
      return `${day}.${month}.${year} в ${hours}:${minutes}`;
    }
}

// Вспомогательная функция для отображения даты
export const formatDateStr = (value) => {
    if (!value){
        return null;
    }
    const date = new Date(value);
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

// Вспомогательная функция для отображения даты и времени
export const formatDateTimeStr = (value) => {
  const date = formatDateStr(value);
  const time = new Date(value);
  return `${date}  ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
}

export const formatDateForServer = (value) => {
    if(value){
        return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
    }
    return null;
}

export const createDateAsUTC = (date) => {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}