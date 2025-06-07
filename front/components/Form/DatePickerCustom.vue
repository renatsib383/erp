<template>
  <!-- <div class="flex flex-col">
    <div>{{ dateFormatted }}</div>
    <div>{{ model }}</div>
  </div> -->
  <IftaLabel pt:root:class="relative" :class="{'border-[1px] border-red-500 rounded-md' : invalid}">
    <div class="datepicker-custom__masked-input-wrapper relative">
      <input
        v-model = "dateFormatted"
        class="datepicker-masked-input p-inputtext"
        ref="dateInputRef"
        :placeholder="showTime ? 'дд.мм.гггг чч:мм' : 'дд.мм.гггг'"
        @click="showCalendar"
        @blur="checkOnBlur()"
        :disabled="disabled"
      />     
      <i class="pi pi-calendar absolute top-1/2 right-[10px] text-surface-400 -translate-y-1/2"></i>                                             
    </div>  
    <!-- show-button-bar -->
    <DatePicker
      v-model="model"
      class="datepicker-custom w-full"
      :showTime="showTime"
      :hourFormat="hourFormat"
      :stepMinute="stepMinute"
      :show-button-bar = "showButtonBar"
      :disabled = "disabled"
      :maxDate="maxDate"
      :minDate="minDate"
      id="changed"
      ref="datePickerRef"
      :invalid="invalid"
    >
      <template #date="slotProps">
        <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
      </template>
    </DatePicker>
    <label for="changed" class="text-sm text-surface-400">{{ label }}</label>
  </IftaLabel>
</template>  

<script setup>
import Cleave from 'cleave.js';
import moment from 'moment';

const props = defineProps({
  'label': String,
  'showTime': {
    type: Boolean,
    default: false
  },
  'hourFormat': {
    type: String,
    default: '24'
  },
  'stepMinute': {
    type: Number,
    default: 1
  },
  'showButtonBar': {
    type: Boolean,
    deafult: false
  },
  'disabled': {
    type: Boolean,
    default: false
  },
  invalid : {
    type: Boolean,
    default: false
  },
  noMax : {
    type: Boolean,
    default: false
  }
})

const model = defineModel();
const maxDate = props.noMax ? null : new Date(); // Сегодня
const minDate = new Date('01.01.2020');

let cleaveInstance = null;
const dateInputRef = ref(null);

watch(dateInputRef, (element) => {
  if (dateInputRef.value) {
    if (!props.showTime) {
      cleaveInstance = new Cleave(dateInputRef.value, {
        date: true,
        delimiter: '.',
        datePattern: ['d', 'm', 'Y'],
        // dateMin: '2000-01-01',
        // dateMax: '2049-12-31',      
      });
    } else {
      cleaveInstance = new Cleave(dateInputRef.value, {
        delimiters: ['.', '.', ' ', ':'],
        blocks: [2, 2, 4, 2, 2],
        numericOnly: true,        
      });
    }
    

    // Синхронизация Cleave.js с v-model
    dateInputRef.value.addEventListener('input', () => {
      dateFormatted.value = cleaveInstance.getFormattedValue();
    });    
  }
})

const dateFormatted = ref(null);

const checkOnBlur = () => {
  if (!props.showTime) {
    let isValid = moment(dateFormatted.value, "DD.MM.YYYY", true).isValid();
    if (!isValid) {
      dateFormatted.value = '';
    }
  } else {
    let isValid = moment(dateFormatted.value, "DD.MM.YYYY HH:mm", true).isValid();
    if (!isValid) {
      dateFormatted.value = '';
    }
  }
}

const checkFormattedDateTime = (formattedValue) => {
      // дата и время
        if (moment(formattedValue, "DD.MM.YYYY HH:mm", true).isValid()) {
          return moment(formattedValue, 'DD.MM.YYYY HH:mm').toDate();          
        } else {
          return false;
        }
}

watch(dateFormatted, (newValue) => {
    if (cleaveInstance) {
      cleaveInstance.setRawValue(newValue);
    }
    // 
    if (!newValue) {
      model.value = null;
    }
    //  Только дата
    if (!props.showTime && newValue.length == 10) {
      const [day, month, year] = newValue.split('.');
      model.value = new Date(year, month - 1, day);
    } 
    // дата и время
    if (props.showTime && newValue.length == 16) {
      let newDate = checkFormattedDateTime(newValue);
      if (newDate) {
        model.value = newDate;
      } else {
        dateFormatted.value = '';
        model.value = null;
      }      
    }
      // console.log('[FormDatePicker] dateFormatted WATCH model.value',model.value);        

      // // дата и время
      // if (props.showTime && newValue.length == 16) {
      //   console.log('[FormDatePicker] dateFormatted WATCH showTime', newValue);
      //   const [dateStr, timeStr] = newValue.split(' ');
      //   const [day, month, year] = dateStr.split('.');
      //   console.log('[FormDatePicker] dateFormatted WATCH [dateStr, timeStr] [day, month, year]', [dateStr, timeStr],[day, month, year]);
      //   let newDate = new Date(year, month - 1, day);
      //   console.log('[FormDatePicker] dateFormatted WATCH newDate', newDate);
      //   let [hours, minutes] = timeStr.split(':');
      //   if (newDate == "Invalid Date" || isNaN(newDate) || hours > 24 || minutes > 59) {
      //     dateFormatted.value = '';
      //   } else {
      //     model.value = new Date(year, month - 1, day, hours, minutes);
      //     console.log('[FormDatePicker] dateFormatted WATCH model.value',model.value);
      //   }
      // }
    });

watch(() => model.value, (newValue) => {
  let newValueDate;
  let formatted;
  if (newValue) {
      if (typeof newValue == 'string') {
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(newValue)) {
          newValueDate = moment(newValue, 'DD.MM.YYYY').toDate();
        } else {
          newValueDate = new Date(newValue);
        }        
      }
      else {
        newValueDate = newValue;
      }
      formatted = newValueDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      if (props.showTime) {
        let formattedTime = newValueDate.toLocaleTimeString('ru-RU',{ 
          hour: "2-digit", minute: "2-digit" 
        });
        formatted = formatted + ' ' + formattedTime;
      }      
  } else {
    formatted = '';
  }
  // console.log('[FormDatePicker] WATCH model.value formatted, dateFormatted.value',formatted, dateFormatted.value)
  if (formatted != dateFormatted.value) {
      dateFormatted.value = formatted;
      // console.log('[FormDatePicker] WATCH model.value dateFormatted.value',dateFormatted.value);
  }
},{ immediate: true });   


const datePickerRef = ref(null);
const datePickerInput = ref(null);

watch(datePickerRef,(newValue) => {
  if (newValue) {
    datePickerInput.value = newValue.$el.querySelector('input');
  }
})

const showCalendar = () => {
  if (datePickerInput.value) {
    datePickerInput.value.click();
  }
}

</script>


