<script setup>
import {Swiper} from "swiper";
import draggable from 'vuedraggable'
import scrollMap from "~/components/Common/scroll-map.vue";
import {nextTick} from 'vue';
import { useMainStore } from '@/stores/main.js'
import {fetchKanbanData, updateDeal} from "~/services/api/deals-services/dealsServices.js";
import {useListsStore} from "~/stores/lists.js";

const route = useRoute();
const store = useMainStore();
const listsStore = useListsStore();
const props = defineProps({asideParams: Object,});
const emit = defineEmits(["goToDealsWithSearchParams", "set-loading"])
const state = reactive({
  stagesLoadedNum: {}, // Кол-во загруженных сделок в каждой колонке (stage)
  stageIsLoading: {}, // Флаг текущей загрузки сделок в колонку
  lastScrollTop: {}, // Последняя позицию скролла для каждой колонки
  mobileWidth: 480,
  dealsLimit: 10, // Сделок в столбце при первой загрузке
});

const activeAccordionIndex = ref(null)
const scrollElement = ref(null); //Элемент, который содержит все колонки и прокручивается горизонтально, передается в scroll-map
const scroll = ref(null); //template ref для scrollElement
const swiper = ref(null);
const isMobile = ref(false);
const draggableDisabled = ref(false);
const isMounted = ref(false);
const lockedDeals = ref([]); // Массив заблокированных для перетаскивания карточек
const savingDeals = ref([]); // Массив карточек, которые сам пользователь перетащил и они сохраняются
const movedDeals = ref([]); // Массив карточек, которые сам пользователь перетащил

const stages = ref({})
const stagesArr = ref([]);
const deals = ref({});
const dragging = reactive({
  isDragging: false, // отменить перетаскивание
  stageFrom: null, // в процессе перетаскивания
  stageTo: null, // предыдущий статус
  cancel: false, // новый статус
});
const contextMenuStages = reactive([]);
const contextMoveMenu = ref(null)
const isDealsLoaded = ref(false);
const loading = ref(''); // любая загрузка сделок, в том числе подзагрузка при прокрутке
const loadingFirst = ref(false); // первоначальная загрузка для скелетонов

onMounted(async () => {
  // if (!Object.keys(route.query).some(key => key.includes('filter') || key.includes('search'))) {
  // }
  setStages();
  await getDeals();

  await nextTick();

  setPageSettings()

  webSocketsSetup()

  setTimeout(() => {
    observerSetup()
  });
});

// Сокеты
const webSocketsSetup = () => {
  Echo.join('deals')
      .listen("Deal.Created", (e) => {
        let newDeal = e.deal;
        let openPipelineInfo = getOpenPipelineStages(e.deal.stages);
        if (!openPipelineInfo) return;
        for (let openPipelineStage of openPipelineInfo) {
          deals.value[openPipelineStage.id].unshift(newDeal);
        }
      })
      .listen("Deal.Updated", (e) => {
        let openPipelineInfo = getOpenPipelineStages(e.deal.stages);
        if (!openPipelineInfo) return;

        for (let openPipelineStage of openPipelineInfo) {
          let dealIndex = deals.value[openPipelineStage.id].findIndex(deal => deal.id === e.deal.id);

          if (dealIndex >= 0) {
            deals.value[openPipelineStage.id][dealIndex] = e.deal;
          } else {
            deals.value[openPipelineStage.id].unshift(e.deal);
          }
        }
      })
      .listen("Deal.Moved", (e) => {
        let openPipelineInfoRemove = getOpenPipelineStages(e.remove);
        if (!openPipelineInfoRemove) return;

        openPipelineInfoRemove.forEach((openPipelineStage) => {
          const stageDeals = deals.value[openPipelineStage.id];
          const index = stageDeals.findIndex(item => item.id === e.deal_id);
          if (index !== -1) {
            stageDeals.splice(index, 1); // Используем splice для удаления
          }
        });
      })
      .listenForWhisper('dragging', (e) => {
        setTimeout(() => {
          if (e.locked) {
            lockedDeals.value.push(Number(e.id));
          } else {
            lockedDeals.value = lockedDeals.value.filter((deal) => deal !== (Number(e.id)));
          }
        })
      })
      .error((error) => {
        console.error('Kanban Echo join error',error);
      });

  const getOpenPipelineStages = (stages) => {
    let openStages = stages?.filter(stage => stage.pipeline.id === props.asideParams.pipeline);
    return openStages.length > 0 ? openStages : [];
  };
}

// Методы
const setPageSettings = () => {
  scrollElement.value = scroll.value; // Прокручиваемый элемент со всеми колонками для получения scrollWidth, передается в компонент scroll-map

  if (document.documentElement.clientWidth <= state.mobileWidth) {
    swiper.value = new Swiper(".swiper", {});
    isMobile.value = true;
    draggableDisabled.value = true;
  } else {
    draggableDisabled.value = false;
    isMobile.value = false;
  }

  isMounted.value = true;
}

const setStages = () => {
  stages.value = {}
  stagesArr.value = [];
  let pipelineStages = listsStore.pipelines[props.asideParams.pipeline]?.stages;
  if(pipelineStages){
    for (const stageNum of Object.keys(pipelineStages)) {
      stages.value[stageNum] = {
        ...pipelineStages[stageNum],
        caption: 0,
        count: 0,
        total_frmt: 0,
        id: stageNum,
        icon: '',
        label: pipelineStages[stageNum].title,
      };
      stagesArr.value[stageNum] = stageNum;
    }
  }
}

const onMoveStart = (e) => {
  const dealId = e.clone.id;
  Echo.join('deals')
      .whisper('dragging', { id: dealId, locked: true });
}

const onMove = (e) => {
  if(lockedDeals.value.includes(Number(e.dragged.id))) return false; // Если кто то другой сейчас её перетаскивает, то блокируем перетаскивание программно

  // Если сделку перетащили и она ещё сохраняется
  if (e && savingDeals.value.includes(Number(e.dragged.id))) {
    return false;
  }

  dragging.isDragging = true;
  dragging.stageFrom = e?.from.dataset.stage;
  dragging.stageTo = e?.to.dataset.stage;

  // document.addEventListener("keydown", (e) => this.cancelDragging(e));
  if (dragging.cancel) return false;

}

const moveDealEnd = (e) => {
  dragging.isDragging = false;
  dragging.stageFrom = null;
  dragging.stageTo = null;

  const dealId = e.clone.id;

  if (savingDeals.value.includes(Number(dealId))) {
    return;
  }

  if (dragging.cancel) {
    dragging.cancel = false;
    Echo.join('deals')
      .whisper('dragging', { id: dealId, locked: false });
    return;
  }

  if (e.from.dataset.stage === e.to.dataset.stage) {
    Echo.join('deals')
      .whisper('dragging', { id: dealId, locked: false });
    return;
  }

  savingDeals.value.push(+dealId);

  const newDeal = deals.value[e.to.dataset.stage].find(
      (deal) => +deal.id === +e.item.id
  );
  newDeal.stage = e.to.dataset.stage;
  updateDealAfterMove(newDeal);
  
}

const updateDealAfterMove = async (dealWithNewStage) => {
  // Нахожу старую колонку в этой воронке и удаляю его, и создаю новый массив из ИД этапов, чтобы обновить состояние сделки
  const dealNewStage = Object.values(stages.value).find((stage) => stage.id === dealWithNewStage.stage);
  const selectedPipelineStagesId = Object.keys(listsStore.pipelines[props.asideParams.pipeline].stages)
  const dealOldStage = dealWithNewStage.stages.find(stage => {
    if(selectedPipelineStagesId.includes(String(stage.id ? stage.id : stage))) {
      return stage
    }
  });

  const newStagesIdArray = []
  dealWithNewStage.stages.map(stage => {
    if(typeof stage === "object"){
      if(stage.id !== Number(dealOldStage.id)){
        newStagesIdArray.push(Number(stage.id));
      }
    } else if (typeof stage === "number"){
      if(stage !== Number(dealOldStage)){
        newStagesIdArray.push(Number(stage));
      }
    }
  });
  newStagesIdArray.push(Number(dealNewStage.id));

  dealWithNewStage.stages = newStagesIdArray
  dealWithNewStage.tags = getTags(dealWithNewStage.tags);

  await updateDeal(dealWithNewStage);
  Echo.join('deals')
    .whisper('dragging', { id: dealWithNewStage.id, locked: false });
  savingDeals.value = savingDeals.value.filter((deal) => deal !== (Number(dealWithNewStage.id)));
  movedDeals.value.push(Number(dealWithNewStage.id));
  // deals.value[dealWithNewStage.stage][index] = { ...dealWithNewStage }; - теперь обновляется по сокету
}

const onResize = () => {
  if (document.documentElement.clientWidth <= state.mobileWidth) {
    if (!swiper.value) {
      swiper.value = new Swiper(".swiper", {});
    }
    if (!draggableDisabled.value) {
      draggableDisabled.value = true;
    }
  } else {
    if (swiper.value) {
      swiper.value.destroy(true, true);
      swiper.value = null;
    }
    if (draggableDisabled.value) {
      draggableDisabled.value = false;
    }
  }
}

const getDeals = async () => {
  deals.value = {};
  isDealsLoaded.value = false;

  loadingFirst.value = true;
  const res = await fetchKanbanData(props, emit, stagesArr, state.dealsLimit, loading);
  loadingFirst.value = false;
  setData(res)
};

const setData = (response) => {
  deals.value = response.stages;
  isDealsLoaded.value = true;
  loading.value = "";
  emit("set-loading", "");

  setStageStat(response.stat);

  setTimeout(() => {
    document.querySelectorAll(".deals-wrapper").forEach((panel) => {
      panel.scrollTop = 0;
    });
  }, 0);
};

const setStageStat = (stagesStat) => {
  const getCountDealCaption = (count) => {
    const last2Digits = count % 100;
    if (last2Digits > 10 && last2Digits < 20) {
      return "сделок";
    }
    switch (count % 10) {
      case 1:
        return "объект";
      case 2:
      case 3:
      case 4:
        return "объекта";
      default:
        return "объектов";
    }
  };

  if(stagesStat){
    Object.values(stagesStat).forEach((stage) => {
      stages.value[stage.stage].count = stage.count;
      stages.value[stage.stage].caption = getCountDealCaption(stage.count);
      stages.value[stage.stage].total = stage.sum;
      stages.value[stage.stage].total_frmt = new Intl.NumberFormat("ru-RU").format(stage.sum);
    });
  }
};

const openDeal = async (e, dealData) => {
  let deal = {};

  if (dealData) {
    deal = dealData;
  }

  if (e) {
    if (e.target.tagName === "A") return;
  }

  if (deal || deal.stages) {
    deal.isCollapsed = false
    // history.pushState(null, null, `${window.location.origin}/deals/${deal.id}`)
    const onlyRequiredFields = ["id", "isCollapsed", "type"]; // чтобы не мусорить LS только нужные поля оставляем
    const dealWithOnlyRequiredFields = Object.fromEntries(
        Object.entries(deal).filter(([key]) => onlyRequiredFields.includes(key))
    );

    // store.setNewDealToStore(dealWithOnlyRequiredFields)
    store.setNewModal({modalData: dealWithOnlyRequiredFields, modalTitle: 'deal'})
  }
}

const getPercent = (smetTotal, actTotal) => {
  const smetNum = Number(smetTotal);
  const actNum = Number(actTotal);

  if (!smetNum || !actNum) return 0;

  const percent = (actNum * 100) / smetNum;
  return Math.round(percent);
};

const formatDate = (value) => {
  if (value) {
    const date = new Date(value);
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  }
};

const getDealClasses = (dealId, deal) => {
  let classes = [];

  // borderColor
  const dealModals = store.getListModals.filter(modal => modal.modalTitle === 'deal');
  const storeDealModalsId = dealModals.map(modal => modal.modalData.id);
  if (storeDealModalsId.includes(dealId)) {
    classes.push('border-l-8 border-l-blue-400');
  } else if (movedDeals.value.includes(dealId)) {
    classes.push('border-l-8 border-l-gray-300');
  }

  // draggingClasses
  if (lockedDeals.value.includes(Number(dealId)) ||
      savingDeals.value.includes(Number(dealId))) {
    classes.push('opacity-50');
  }

  // coloredCards согласно срокам работ
  if (deal && deal.date_end) {
    const today = new Date();
    const dateEnd = new Date(deal.date_end);
    const differenceInHours = Math.round((dateEnd - today) / (1000 * 60 * 60));

    if (differenceInHours < 24) {
      classes.push('!bg-red-100 dark:!bg-red-400');
    } else if (differenceInHours > 24 && differenceInHours < 168) {
      classes.push('!bg-yellow-100 dark:!bg-yellow-400');
    } else if (differenceInHours > 168 && differenceInHours < 720) {
      classes.push('!bg-emerald-100 dark:!bg-emerald-400');
    }
  }

  return classes.join(' ');
};

// Настройка observer
const observerSetup = () => {
  // Инициализация состояний
  Object.values(stages.value).forEach((stage) => {
    if (!state.stagesLoadedNum[stage.id]) {
      state.stagesLoadedNum[stage.id] = { loaded: 0, count: stage.count };
    }
    state.stageIsLoading[stage.id] = false;
  });

  // Создаем observer
  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !state.stageIsLoading[entry.target.dataset.stage]) {
            const stageId = entry.target.dataset.stage;
            loadMoreDeals(stageId);
          }
        });
      },
      {
        root: null,
        rootMargin: '100px 0px', // Чтобы загрузку чуть раньше начать
        threshold: 0, // Срабатывает при появлении % элемента
      }
  );

  nextTick(() => {
    // Вешаем наблюдатель для всех блоков которых снизу карточек создали как триггер для загрузки
    const loadMoreElements = document.querySelectorAll('.load-more');
    loadMoreElements.forEach((el) => observer.observe(el));
  });

  onBeforeUnmount(() => observer.disconnect());
}

// Подгрузка дополнительных сделок
const loadMoreDeals = async (stageId) => {
  if (state.stageIsLoading[stageId]) {
    return;
  }

  state.stageIsLoading[stageId] = true;
  const stages = {value: [stageId]}

  const res = await fetchKanbanData(props, emit, stages, state.dealsLimit, loading, deals.value[stageId].length)

  const newDeals = res.stages[stageId];
  deals.value[stageId] = [...deals.value[stageId], ...newDeals];
  state.stagesLoadedNum[stageId].loaded += newDeals?.length;
  state.stagesLoadedNum[stageId].count = res.stat[stageId].count;
  state.stageIsLoading[stageId] = false;
};

// Жиз.цикл
onUnmounted(() => {
  Echo.leave('deals'); // Отключаемся от канала
});

// Watchers
watch(() => props.asideParams, () => {
  setStages();
  getDeals();
}, { deep: true });

// defineExpose({
//   addNewDealWithoutPageReload,
// })

</script>

<template>
  <section class="h-full w-full bg-header-bg overflow-hidden">
    <scroll-map
        :steps-amount="Object.keys(stages).length"
        :scroll="scrollElement"
        @scroll-resize="onResize"
    >
      <div v-if="stages" id="kanbanboard" class="swiper deals-board !flex h-full">
        <div v-if="loadingFirst"
                  class="swiper-wrapper"
          :class="{ 'flex !w-auto !overflow-scroll' : !isMobile }">
          <div
            v-for="i in 5"
            class="deals-list swiper-slide h-full flex flex-col shrink-0 px-1 max-sm:!w-full !w-[300px]"
            >
              <div class="flex pt-2 pb-1 px-3 min-h-[40px] border-b-4 mb-1">
                <div class="grow">
                  <h6 class="text-xs font-medium text-center flex flex-col items-center justify-center">
                    <Skeleton width="9rem" class="mb-1"></Skeleton>
                    <Skeleton width="5rem"></Skeleton>
                  </h6>
                </div>
              </div>
              <div v-for="j in 5"
                class="px-1">
                <Skeleton height="124px" class="w-full mb-1 rounded-sm"></Skeleton>
              </div>
          </div>
        </div>
        <div
          v-if="!loadingFirst"
          ref="scroll"
          class="swiper-wrapper"
          :class="{ 'flex !w-auto !overflow-scroll' : !isMobile }"
        >
          <div
              v-for="stage in stages"
              :id="`stage-${stage.id}`"
              :key="stage.id"
              class="deals-list swiper-slide h-full flex flex-col shrink-0 px-1 max-sm:!w-full !w-[300px]"
          >
            <div class="flex pt-2 pb-1 px-3 min-h-[40px] border-b-4" :style="`border-color: ${stage.color}`">
              <div class="grow">
                <h6 class="text-xs font-medium text-center flex flex-col items-center justify-center">
                  <span class="uppercase text-slate-600 dark:text-surface-100 whitespace-nowrap">
                    {{ stage.title }}
                  </span>
                  <span class="mt-1 px-2 text-slate-500 dark:text-surface-300 whitespace-nowrap">
                    {{ `${stage.count} ${stage.caption}: ${stage.total_frmt} ₽` }}
                  </span>
                </h6>
              </div>
            </div>
            <div
                class="deals-wrapper h-[calc(100%-56px)] relative flex-col justify-start content-start items-start overflow-y-auto overflow-x-hidden mt-1 px-1"
                :class="{ 'hover:bg-slate-200': dragging.isDragging, '!w-full' : draggableDisabled, 'opacity-30' : state.stageIsLoading[stage.id]
                }"
              >
                <div :id="stage.id" class="deals relative flex w-full min-h-full">
                  <draggable
                      v-model="deals[stage.id]"
                      :data-stage="stage.id"
                      :move="onMove"
                      :force-fallback="true"
                      :fallbackOnBody="true"
                      :fallbackTolerance="5"
                      :disabled="draggableDisabled"
                      @start="onMoveStart"
                      @end="moveDealEnd"
                      itemKey="id"
                      group="kanban"
                      class="w-full"
                  >
                    <template #item="{element, index}">
                      <BCard
                          :key="element.id"
                          :id="element.id"
                          :data-stage="stage.id"
                          class="deals-box bg-white dark:bg-surface-600 relative flex flex-col min-w-0 mb-[5px] text-[13px] leading-tight font-medium text-slate-500 dark:text-surface-300 border border-slate-300 border-solid rounded-sm"
                          @click="e => openDeal(e, element)"
                          :class="getDealClasses(element.id, element)"
                      >
                        <BCardBody :href="`#${element.id}-task`" class="flex-auto px-1 cursor-pointer">
                          <div class="flex justify-between w-full">
                            <div class="flex items-center justify-start flex-col mt-1">
                              <h6 class="cursor-pointer mb-0 text-sm text-[#0057A9] dark:text-surface-100 font-medium leading-none underline">
                                {{ element.uid || "УИД не указан" }}</h6>
                            </div>
                            <div class="shrink-0 flex flex-col justify-end">
                              <span>{{ formatDate(element.created_at) }}</span>
                            </div>
                          </div>
                          <div class="mt-1 relative transition-all duration-300 ease-in-out">
                            <span class="capitalize">{{ element.contacts && element.contacts[0] ? element.contacts[0].name : null }}</span>
                            <div
                                class="flex custom-accordion-header p-1 max-w-10"
                                @click.stop="activeAccordionIndex = element.id"
                                v-show="activeAccordionIndex !== element.id"
                            >
                              <a class="block leading-[0] cursor-pointer"><i class="!leading-[10px] pi pi-ellipsis-h text-slate-600 text-base pointer-events-none"></i></a>
                            </div>
                            <div v-show="activeAccordionIndex === element.id" class="custom-accordion-content">
                              <div v-for="(contact, index) in element.contacts" @click.stop class="my-1 gap-1 flex items-center">
                                <p v-show="index !== 0" class="capitalize">{{ contact.name }}</p>
                                <div v-show="contact.phone" class="flex items-center">
                                  <a :href="contact.phone ? `tel:${contact.phone.replace(/\D/g, '')}` : '#'" >+{{contact.phone}}</a>
                                  <span class="ml-1 pi pi-phone -scale-x-100"/>
                                </div>
                              </div>
                              <p v-show="!element.contacts || !element.contacts.length">Больше нет контактов</p>
                            </div>
                            <div class="mt-1">
                              <p>Дата начала: {{ formatDate(element.date_start) }}</p>
                              <p>Дата окончания: {{ formatDate(element.date_end) }}</p>
                              <p>Замерщик:
                                <!-- {{ users.find(user => user.id === deal.zamerman) ? users.find(user => user.id === deal.zamerman).name : null }}-->
                              </p>
                              <p>Прораб:
                                <!--{{ users.find(user => user.id === deal.prorab) ? users.find(user => user.id === deal.prorab).name : null }}-->
                              </p>
                            </div>
                          </div>
                        </BCardBody>

                        <BCardFooter class="px-1 py-1 border-t border-dashed border-[#e9ebec] dark:border-surface-400">
                          <div class="mb-1 grow text-truncatec flex justify-between items-center pr-1">
                            <span v-if="element.smets_sum_total" class="my-1 text-slate-500 dark:text-surface-200 leading-none flex items-center gap-1">
                              <span>{{ element.smets_sum_total }}&#8381; /</span>
                              <span>{{ element.acts_sum_total ? element.acts_sum_total : 0 }}&#8381; ({{getPercent(element.smets_sum_total, element.acts_sum_total)}}&#37;)</span>
                            </span>
                            <span v-else></span>
                            <!-- <img v-show="lockedDeals.includes(Number(element.id))" src="/images/menu/drag.svg" alt="drag" width="20px" height="20px" title="Карточка в данный момент перетаскивается другим пользователем" /> -->
<!--                            <span v-show="lockedDeals.includes(Number(element.id))" class="pi pi-ban text-red-500 cursor-pointer" title="Карточка в данный момент перетаскивается другим пользователем" />-->
                          </div>
                          <ul class="deal-tags list-none m-0 my-1 p-0 text-slate-600 dark:text-surface-200 leading-none">
                            <li
                                v-for="(tag, index) in getTags(element.tags)"
                                :key="index"
                                class="deal-tag inline-block px-[2px] mr-1 border border-solid border-slate-400 rounded-sm"
                            >
                              {{ tag }}
                            </li>
                          </ul>
                        </BCardFooter>
                      </BCard>
                    </template>
                  </draggable>
                </div>
                <div
                    ref="loadMore"
                    v-show="state.stagesLoadedNum[stage.id] &&  state.stagesLoadedNum[stage.id].loaded < state.stagesLoadedNum[stage.id].count && state.stagesLoadedNum[stage.id].count >= 10"
                    :data-stage="stage.id"
                    class="load-more h-[10px] w-full"
                />
            </div>
          </div>
        </div>
      </div>
    </scroll-map>
    <ContextMenu ref="contextMoveMenu" :model="contextMenuStages"/>
  </section>
</template>

<style>

#kanbanboard,
#table {
  font-family: "Gilroy";
}

#kanbanboard {
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
}

.swiper-wrapper::-webkit-scrollbar {
  display: none;
}

.swiper-wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.overflow-hidden {
  overflow: hidden;
}

@media (max-width: 480px) {
  .swiper-wrapper {
    width: 100% !important;
    overflow: initial !important;
  }
}

.dragArea {
  width: 100%;
}
</style>
