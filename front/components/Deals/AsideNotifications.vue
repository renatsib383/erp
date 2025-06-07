<script>
import DropdownAside from "@/Presets/Custom/DropdownAside.vue";
import InputTextAside from "@/Presets/Custom/InputTextAside.vue";

import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";

import { ref, watch } from "vue";
import vSelect from "vue-select";
import { usePage } from "@inertiajs/vue3";
import {useStore} from "vuex";

export default {
  props: ["mode", "asideOptions", "loading"],
  setup(props, context) {

    const asideOptions = ref({...props.asideOptions});

    const store = useStore();

    // Поиск
    const loadingSearch = ref(false);

    let delay;

    function onInputSearch(event) {
      if (delay) {
        clearTimeout(delay);
      }
      delay = setTimeout(() => {
        loadingSearch.value = true;
        context.emit("change-param", "search", event.target.value);
      }, 2000);
    }

    watch(() => props.loading,(newValue) => {
        if (!newValue) {
          loadingSearch.value = false;
        }
    });

    return {
      asideOptions: props.asideOptions,
      onInputSearch
    };
  },
  components: {
    InputTextAside,
    DropdownAside,
    vSelect,
    Calendar,
    Dropdown,
  },
  data() {
    return {
      filterFormData: {
        uid: "",
        uidEmpty: false,

        address: "",

        task: {
          format: "range",
          startDate: "",
          endDate: "",
          daysPeriod: 0,
        },
        withoutTasks: false,

        delay: null,
      },


      customer: {
        fio: "",
        telephone: "",
      },

      responsible: {
        prorab: "",
      },


    };
  },
  methods: {

    // formatDate(dateString) {
    //   const date = new Date(dateString);
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    //   const day = String(date.getDate()).padStart(2, "0");
    //   return `${year}-${month}-${day}`;
    // },

    emitWithTimeOut() {
      if (this.delay) {
        // задержка перед запросом
        clearTimeout(this.delay);
      }
      this.delay = setTimeout(() => {
        console.log('[AsideNotifications] emitWithTimeout');
        this.emitFilterData();
      }, 2000);
    },

    emitFilterData() {
      console.log('[AsideNotifications] emitFilterData start');
      const data = {
      }; // объект фильтров которого отправим на сервер

      // Ответственные
      const { prorab } = this.responsible;
      const responsibleFields = { prorab };
      for (const [key, value] of Object.entries(responsibleFields)) {
        if (value) {
          data[key] = value;
        }
      }

      setTimeout(() => {
        this.$emit("change-filter", "filter", data);
      }, 0);

    },

  },


  computed:{

    // activeMainFilterCount() {
    //   let count = 0;

    //   if (this.filterFormData.uid || this.filterFormData.uidEmpty) count++;

    //   return count;
    // },
    // activeCustomerFilterCount() {
    //   let count = 0;

    //   if (this.customer.fio) count++;
    //   if (this.customer.telephone) count++;
    //   if (this.customer.lead_source) count++;
    //   if (this.customer.skidka) count++;
    //   if (this.customer.coef) count++;
    //   if (this.customer.temperature && this.customer.temperature.length) count++;

    //   return count
    // },
    // activeResponsiblesFilterCount() {
    //   let count = 0;

    //   if (this.responsible.prorab && this.responsible.prorab.length) count++;
    //   if (this.responsible.responsible && this.responsible.responsible.length) count++;
    //   if (this.responsible.operator && this.responsible.operator.length) count++;
    //   if (this.responsible.zamerman && this.responsible.zamerman.length) count++;
    //   if (this.responsible.designer && this.responsible.designer.length) count++;

    //   return count
    // },
    // ActiveFiltersCount() {
    //   return this.activeMainFilterCount + this.activeCustomerFilterCount + this.activeResponsiblesFilterCount;
    // }

  },

  watch: {

    'responsible.prorab': {
      handler() {
        this.emitFilterData();
      },
    },

  },
};
</script>

<template>
  <div class="aside-deal__toggle h-full">

    <section class="text-slate-600 text-[13px] mt-2 font-medium select-none">

      <div class="search-wrapper pt-2 mb-2 w-full">
        <div class="relative">
          <div class="px-[3px]">
            <InputTextAside
              placeholder="Поиск"
              @input="onInputSearch"
              size="small"
            />
          </div>
          <ProgressSpinner
            v-if="loadingSearch"
            :pt="{
            root: 'absolute left-[3px] right-[3px] top-[3px] bottom-[3px] bg-white',
          }"
          />
        </div>
      </div>

      <div>
        <div class="mt-2">

        <div  class="min-h-full flex flex-col gap-1 text-xs p-1 border-[1px] pb-2">
          <div class="flex flex-col gap-1 bg-slate-200 p-1 rounded-md">
            <label class="py-[2px]">Прораб</label>
            <div class="flex items-center relative w-full">
              <v-select
                v-model="responsible.prorab"
                :options="asideOptions.proprab"
                :reduce="option => option.id"
                multiple
                label="name"
                value="id"
                placeholder="Не выбрано"
                class="w-full "
              />

            </div>
          </div>

        </div>

        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.table-filter-section {
  @apply max-h-[calc(100vh-305px)];
}


.activatedButton {
  background-color: rgb(15, 187, 129);
  color: white;
}

/* .aside-deal__toggle {
  font-family: "Montserrat", "sans-serif";
} */

.calendar-small {
  @apply !text-xs px-0 py-0 p-0 h-8;
}

.calendar-small input {
  @apply !max-w-8;
}

.input-small {
  @apply p-0 h-8 text-xs;
}

::-webkit-scrollbar {
  scrollbar-width: none;
}

.v-select {
  --vs-dropdown-option--active-bg: var(--p-primary-200);
  background: white;
  border-radius: 5px;
  --vs-font-size: 14px;
  --vs-dropdown-option-padding: 8px 8px;
  --vs-dropdown-option--active-color: var(--p-primary-800);
  --vs-dropdown-font-size:16px;
  --vs-dropdown-min-width: 300px;
  padding: 0px;
  margin: 0px;
}

.v-select .aside-deal__toggle {
  background: white;
}

</style>
