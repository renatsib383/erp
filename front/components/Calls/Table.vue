<script setup>
import DataTableWork from "@/assets/presets/custom/DataTableDeal.vue";
import {fetchCallsData} from "~/services/api/callsServices.js";
import {useRoute} from "#vue-router";

const emit = defineEmits([]);
const props = defineProps(["datatable", "asideParams"]);
const route = useRoute();
const store = useMainStore()

watch(props.asideParams, (newValue) => {
  debounce(getData(), 500);
},{ deep: true });

const calls = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const first = ref(0);
const callTable = ref();
const multiSortMeta = ref([]);

onMounted(async () => {
  const fetchWithFilters = Object.keys(route.query).some(key => key.includes('filter') || key.includes('search'));
  if (!fetchWithFilters) {
    await getData();
  }
  await nextTick();
  processAudios();
});

const getData = async (event) => {
  loading.value = true;
  emit("set-loading", "works");
  const params = JSON.parse(JSON.stringify(props.asideParams));

  const response = await fetchCallsData(params, event);

  if (response.success) {
    calls.value = response.data;
    totalRecords.value = response.total;
  }

  setTimeout(() => {
    loading.value = false;
    emit("set-loading", "");
  })
};

const onRowClick = async (event) => {};

const onSort = (event) => {
  getData(event);
};

const onValueChange = () => {
  processAudios();
}

const formatType = (type) => {
  return type === "out" ? "Исходящий" : "Входящий";
};

const formatDateTime = (date) => {
  let event = new Date(date);
  return (
    event.toLocaleDateString("ru-RU") + " " + event.toLocaleTimeString("ru-RU")
  );
};

const formatContact = (data) => {
  // let fio = "";
  // let phone = data.client_phone;
  // if (phone === data.deal.telephone) {
  //   fio = data.deal.fio ?? "";
  // } else {
  //   let name = data.deal.contacts.find(
  //     (contact) => contact.phone === phone
  //   )?.name;
  //   fio = name !== undefined ? name : "";
  // }
  //
  // return fio + " " + phone;
  return data.client_phone
};

const onPage = (event) => {
  getData(event);
};

const  processAudios = async () => {
  let audios = document.querySelectorAll('audio');

  for (let audio of audios) {
    audio.addEventListener('play',(event) => {
      for (let audio of audios) {
        if (event.target != audio && !audio.paused) {
          audio.pause();
        }
      }
    })
  }   
};

const initAudio = (event) => {
    const audio = event.target;
    if (!audio.getAttribute('src')) {
        audio.src = audio.dataset.src;
        audio.classList.remove("max-w-[100px]");
    }
}

const openDeal = (dealId) => {
  store.setNewModal({modalData: {id: dealId}, modalTitle: 'deal'})
}


</script>

<template>
  <section class="relative h-full">
    <div 
      v-if="loading"
      class="loading-overlay absolute inset-[10px] top-[56px]">
        <Skeleton class="w-full mb-1 rounded-none" height="48px" v-for="i in 25"/>
    </div>
    <DataTableWork
        :value="calls" :paginator="calls.length >= 50" :first="first" :rows="25" :rowsPerPageOptions="[50, 100]"
        :totalRecords="totalRecords" :loading="loading" :metaKeySelection="false" v-model:multiSortMeta="multiSortMeta"
        @page="onPage($event)" @sort="onSort($event)" @row-click="onRowClick" @value-change="onValueChange"
        stateStorage="local" sortMode="multiple" selectionMode="single"
        ref="callTable" dataKey="id"
        lazy removableSort stripedRows
    >
      <Column field="created_at" header="Дата" sortable>
        <template #body="{ data }">
          {{ formatDateTime(data.created_at) }}
        </template>
      </Column>
      <Column field="employee.employee_full_name" header="Автор" sortable>
        <template #body="{ data }">
          <div v-if="data.user">{{ data.user.fio }}</div>
          <div v-else>{{ data.employee?.employee_full_name }}</div>
        </template>
      </Column>
      <Column field="deal.uid" header="Объект">
        <template #body="{ data }">
          <p
             @click.stop.prevent="openDeal(data.deal_id)"
             class="cursor-pointer underline text-blue-500 pr-2"
          >
            {{data.deal_id}}
          </p>
        </template>
      </Column>
      <Column field="client_phone" header="Контакт">
        <template #body="{ data }">
          {{ formatContact(data) }}
        </template>
      </Column>
      <Column field="type" header="Тип звонка">
        <template #body="{ data }">
          {{ formatType(data.type) }}
        </template>
      </Column>
      <Column field="record" header="Запись разговора">
        <template #body="{ data }">
         <audio
            controls
            preload="metadata"
            :src="data.record.file_link"
            v-if="
              data.record?.call_record_duration &&
              data.record?.call_record_duration > 0
            "
          >
            Ваш браузер не поддерживает аудио элемент.
          </audio>
        </template>
      </Column>
    </DataTableWork>
  </section>
</template>


