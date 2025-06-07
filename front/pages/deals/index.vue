<script setup>
import AsideDeal from "~/components/Deals/AsideDeal.vue";
import KanbanDeal from "~/components/Deals/KanbanDeal.vue";
import TableDeal from "~/components/Deals/TableDeal.vue";
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import { useListsStore } from '@/stores/lists.js'
import {getListsData} from "~/services/api/deals-services/dealsServices.js";
import {useMainStore} from "~/stores/main.js";
// import MapDeal from "@/Components/Deals/MapDeal.vue";


defineProps({
  datatable: {
    type: Object,
    required: true,
  },
});

const listsStore = useListsStore();
const store = useMainStore();

const stages = reactive({});
const mode = ref(localStorage.getItem("selectedMode") || 'kanban');
const asideParams = ref({
  pipeline: JSON.parse(localStorage.getItem("selectedPipeline")) || 1,
  sort: [{
   field: "created_at",
   order: "-1",
  },],
});
const loading = ref(false);
const dealsLists = await getListsData();
listsStore.setDealsLists(dealsLists) // Получаю списки для раздела и сохраню в store
const tableDeal = ref(null)
const kanbanDeal = ref(null)

const getDeal = computed(() => store.getNewDealForTable);

watch(getDeal, (newValue) => {
  if (newValue) {
    addNewDeal(newValue)
  }
});
const addNewDeal = async (deal) => {
  if (tableDeal.value && tableDeal.value.addNewDealWithoutPageReload) {
    tableDeal.value.addNewDealWithoutPageReload(deal);
  }
  // if (kanbanDeal.value && kanbanDeal.value.addNewDealWithoutPageReload) {
  //   kanbanDeal.value.addNewDealWithoutPageReload(deal);
  // }
  // if (this.$refs.mapDeal && this.$refs.mapDeal.addNewDealWithoutPageReload) {
  //   if (deal.geo) this.$refs.mapDeal.addNewDealWithoutPageReload(deal);
  // }
};

const onChangeMode = (newMode) => {
  localStorage.setItem("selectedMode", newMode);
  mode.value = newMode;
};

const onChangeAsideParam = (name, value) => {
  asideParams.value[name] = value;
  if(name === 'pipeline'){
    localStorage.setItem("selectedPipeline", value);
  }
};

const onUpdateVisibleColumns = (value) => {
  asideParams.value.visibleColumns = value;
};

const onSetLoading = (value) => {
  loading.value = value;
};

definePageMeta({
  permission: 'Deal.view',
});

</script>


<template>
  <authenticated-layout :loading="loading" :component="deal">
      <KanbanDeal
          v-if="mode === 'kanban'"
          :asideParams="asideParams"
          @openModal="openModal"
          @set-loading="onSetLoading"
          ref="kanbanDeal"
          class="absolute"
      />
      <TableDeal
          v-if="mode === 'table'"
          :asideParams="asideParams"
          :stages="stages"
          :datatable="datatable"
          ref="tableDeal"
          @change-sort="onChangeAsideParam"
          @set-loading="onSetLoading"
          @openModal="openModal"
          class="p-[10px] pb-0"
      />
<!--      <MapDeal-->
<!--         v-if="mode === 'map'"-->
<!--         ref="mapDeal"-->
<!--         @openModal="openModal"-->
<!--      />-->
    <template #aside>
      <div class="w-[316px] h-full">
        <AsideDeal
            :mode="mode"
            :aside-params="asideParams"
            :loading="loading"
            @change-mode="onChangeMode"
            @change-param="onChangeAsideParam"
            @change-filter="onChangeAsideParam"
            @update-visible-columns="onUpdateVisibleColumns"
            @openModal="openModal"
            @addNewDeal="addNewDeal"
            ref="asideDeal"
        />
      </div>
    </template>
  </authenticated-layout>
</template>

<style scoped>

#table {
  font-family: "Gilroy",serif;
}

.sortable-drag.sortable-chosen {
  opacity: 1 !important;
}

.sortable-fallback {
  z-index: 1000;
}

.sortable-ghost.sortable-chosen {
  opacity: 0.5;
}

.kanban-move-card__step-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border: 1px solid #c5c5c5;
  font-size: 16px;
  cursor: pointer;
}

.swiper-wrapper::-webkit-scrollbar {
  display: none;
}

.swiper-wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.overflow-hidden .add-fast-form {
  overflow: hidden;
}

@media (max-width: 480px) {
  .swiper-wrapper {
    width: 100% !important;
    overflow: initial !important;
  }
}

.deals {
  display: flex;
}

.dragArea {
  width: 100%;
}

/* ::-webkit-scrollbar-track {
          width: 20px;
      } */

/* .deals-wrapper {
  scrollbar-width: auto;
}

.deals-wrapper::-webkit-scrollbar-thumb {
  @apply bg-gray-400;
  border-radius: 3px;
}

.deals-wrapper::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600;
}

.deals-wrapper::-webkit-scrollbar {
  width: 6px;
} */
</style>

