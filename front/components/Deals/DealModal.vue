<script setup>
import SmetModal from "~/components/Deals/SmetModal.vue";
import RoomFull from "~/components/Deals/RoomFull.vue";
import PriceListFull from "~/components/Deals/PriceListFull.vue";
import ActTable from "~/components/Deals/ActTable.vue";
import ActFull from "~/components/Deals/ActFull.vue";
import DealContacts from "~/components/Deals/DealContacts.vue";
import {
  createDeal,
  fetchDeal,
  getListsData,
  updateDeal,
  updateDealFrom
} from "~/services/api/deals-services/dealsServices.js";
import {
  addCopiedSmetToNewDeal,
  createAutoSmet,
  getSmetsList,
  updateSmet
} from "~/services/api/deals-services/smetServices.js";
import {getRoomsList} from "~/services/api/deals-services/roomServices.js"
import {getWorksCollection, getWorksList} from "~/services/api/worksServices.js";
import {createUpdatePriceList} from "~/services/api/deals-services/priceListServices.js";
import {getActs} from "~/services/api/deals-services/actsServices.js";
import {fetchNumberSuggestions, setNewData} from "~/services/api/contactsServices.js";
import {useDialog} from "primevue/usedialog";
import {useMainStore} from "~/stores/main.js";
import ptDialog from "~/assets/presets/custom/baseDialogPreset.js";
import ptTabViewDealModalPreset from "~/assets/presets/custom/tabViewDealModalPreset.js";
import ptTabViewChatPreset from "~/assets/presets/custom/tabViewChatPreset.js";
import {fetchNamesSuggestions} from "~/services/api/dadataApi.js";
import ptFieldsetDealModal from '@/assets/presets/custom/fieldsetDealModal.js';
import {formatDateTimeStr} from "~/utils/date-functions.js";
import {deepEqual} from "~/utils/objectСomparison.js";
import {fetchUsersWithRolesAndNewFilters} from "~/services/api/usersServices.js";
import {useListsStore} from "~/stores/lists.js";

const ptFieldsetOptions = { mergeSections: true, mergeProps: true };

// import {YandexMap, YandexMapDefaultFeaturesLayer, YandexMapDefaultSchemeLayer, YandexMapMarker} from 'vue-yandex-maps';
// import Feed from "../Common/Feed.vue";
// import ChatWork from "../Common/ChatWork.vue";

const store = useMainStore();
const listsStore = useListsStore()
const route = useRoute()
const { $showSuccessToast, $showErrorToast, $showInfoToast, $api} = useNuxtApp();
const emit = defineEmits(["close", "addNewDeal", "openModal", "collapse"]);
const dialogData = inject("dialogRef");

const dialog = useDialog();

// Основная информация по сделке
const originalDeal = ref(null); // Сохраняем также исходное состояние и обновим его если всё успешно сохранилось на сервере
const deal = ref(null);
const isDealChanged = ref(false);
const dealChanged = ref(false);
const tagsArr = ref([]);
const vueSelect = ref(null);
const closeTagsSelectOptions = ref(false)
// const deferredDiscount = ref(false)
const lists = ref(null)
const loading = ref(false) //

let pagePartners = []
let pageTags = []
let pageCompanies = []
let fields = []
let taskTypes = []
let roomSettings = []

const collapsed = ref(false);
const home = ref(null);

let facility_typeList = []
let facility_conditionList = []
let temperatureList = []
let operatorList = []
let zamermanList = []
let designerList = []

// Списки ответсвенных
const responsibleList = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }
  return listsStore.usersWithRolesList
});

const prorabList = computed(() => {
  if (!listsStore.usersWithRolesList) {
    return [];
  }

  const prorabList = listsStore.usersWithRolesList.filter(user =>
      user.roles.some(role => role.id === 3)
  );
  return prorabList
});

const isMobile = ref(false);
const header = ref();
const errorMessages = ref(null);

const pipelines = ref([]);
const addedPipelines = ref([]);

// Чат
const unreadDiscussion = ref(null); // для отображения на вкладке Обсуждение
const unreadChat = ref(null); // для отображения на вкладке Чат
const isUnreadOpenTabChat = ref(false); // Пришло сообщение на открытую вкладку
const isUnreadOpenTabDiscussion = ref(false); // Пришло сообщение на открытую вкладку
const chatContacts = ref(null); // Список контактов для чата

//Watchs
watch(deal, () => {
  showDealSaveButton()
}, {deep: true});
watch(tagsArr, () => {
  showDealSaveButton('tags')
}, {deep: true},);
watch(addedPipelines, () => {
  updatePipelineRemoveState();
}, {deep: true},);
//  Непрочитанные на открытых вкладках обнуляем
watch(unreadDiscussion, (newVal) => {
  if (newVal > 0 && chatTabIndex.value == 1) {
    // Отправляем в чат, чтобы считывать движение мыши
    isUnreadOpenTabDiscussion.value = true;
  } else {
    isUnreadOpenTabDiscussion.value = false;
  }
});
watch(unreadChat, (newVal) => {
  if (newVal > 0 && chatTabIndex.value == 2) {
    // Отправляем в чат, чтобы считывать движение мыши
    isUnreadOpenTabChat.value = true;
  } else {
    isUnreadOpenTabChat.value = false;
  }
});

onMounted(() => {
  let dealID = null;
  let isCollapsed = false;
  let newDealData = null;

  if (dialogData) {
    dealID = dialogData.value.data.modalData.id;
    newDealData = dialogData.value.data.modalData;
    isCollapsed = dialogData.value.data.modalData.isCollapsed;
  } else {
    dealID = route.params.id ? route.params.id : 0;
  }

  initializeDeal(dealID, newDealData, isCollapsed);

  if(!isCollapsed){
    setTimeout(() => setUrl(dealID))
  }
});

onUnmounted(() => {
  if(deal.value?.id){
    Echo.leave(`deal.${deal.value.id}`);
  }
});

const initializeDeal = async (dealID, newDealData, isCollapsed) => {
  loading.value = true
  let dealData = null
  if(dealID){
    await fetchDeal(dealID).then((data) => {
      if(!data || !data.deal){
        dialogData?.value.close()
        return
      }

      if (dealID && dealID !== 0) {
        // if (!newDealData || (newDealData && newDealData.id !== data?.deal?.id)) {
        //   const rawDeal = data.deal;
        //   if (isCollapsed) {
        //     rawDeal.onMount = true;
        //     // store.setNewDealToStore(rawDeal)
        //   }
        // }
        dealData = data.deal;
        lists.value = data.lists;

        if(isCollapsed){
          collapsed.value = true; // Скрываю кнопку свернуть, после перезагрузки
        }
      }
    })
  }
  else if(dealID === 0){
    dealData = newDealData;
    if(isCollapsed){
      collapsed.value = true; // Скрываю кнопку свернуть, после перезагрузки
    }
    lists.value = await getListsData()
  }
  else {
    clearURL()
    dialogData.value.close()
  }

  // Все данные найдены
  if (dealData && lists.value) {
    loading.value = false
    pipelines.value = Object.values(lists.value.pipelines);
    addedPipelines.value = [];
    dealData.stages.forEach((stage) => {
      const pipelineData = pipelines.value.find(p => Number(p.id) === Number(stage.pipeline.id));
      const pip = {
        pipeline: stage.pipeline.id,
        stage: stage.id,
        stageColor: stage.color,
        stages: Object.values(pipelineData.stages),
        pipelines: getPipelineOptions()
      };
      addedPipelines.value.push(pip);
      addedPipelines.value.forEach(p => {
        p.pipelines = getPipelineOptions(p);
      });
    });
    originalDeal.value = dealData;
    deal.value = JSON.parse(JSON.stringify(dealData));
    addedContacts.value = JSON.parse(JSON.stringify(dealData.contacts));
    chatContacts.value = addedContacts.value;
    setListsData();
    addNewContactStatus.value = true;
    errorMessages.value = {};
    smets.value = [];
    actsList.value = [];
    rooms.value = [];

    activeTab.value = "home";
    activeWindow.value = "Deals";
    approvedSmeta.value = null;
    approvedSmetaForAct.value = null;

    setDealCoordinates();
    addressQuery.value = dealData.address;
    tagsArr.value = getTags(deal.value.tags);

    if (window.localStorage.getItem("copiedSmeta")) {
      copiedSmeta.value = JSON.parse(window.localStorage.getItem("copiedSmeta"));
    }

    deal.value.created_at_frmt = deal.value.created_at ? formatDateTimeStr(deal.value.created_at) : '';
    deal.value.date_start = deal.value.date_start ? formatDateStr(deal.value.date_start) : '';
    deal.value.date_end = deal.value.date_end ? formatDateStr(deal.value.date_end) : '';

    setTimeout(() => {
      updateContactRemoveState();
      updatePipelineRemoveState();
      if (deal.value.type && deal.value.type === 'emptyDeal') {
        isDealChanged.value = true;
      } else {
        isDealChanged.value = false;
      }
    }, 0);
    // Подключаемся к каналу
    Echo.join(`deal.${deal.value.id}`)
        .listen("Deal.Updated", (e) => {
          if (Number(e.deal.id) === Number(deal.value?.id)) {
            Object.assign(originalDeal.value, e.deal);
            Object.assign(deal.value, e.deal);

            addedPipelines.value = [];
            addedContacts.value = JSON.parse(JSON.stringify(deal.value.contacts));
            chatContacts.value = addedContacts.value;
            deal.value.stages.forEach((stage) => {
              const pipelineData = pipelines.value.find(p => Number(p.id) === Number(stage.pipeline.id));
              const pip = {
                pipeline: stage.pipeline.id,
                stage: stage.id,
                stageColor: stage.color,
                stages: Object.values(pipelineData.stages),
                pipelines: getPipelineOptions()
              };
              addedPipelines.value.push(pip);
              addedPipelines.value.forEach(p => {
                p.pipelines = getPipelineOptions(p);
              });
            });
            tagsArr.value = getTags(deal.value.tags);
            setTimeout(() => isDealChanged.value = false)
          }
        })
        .listen("Smet.Created", (e) => {
          console.log("Smet.Created", e);
          if(!smets.value.length){
            getRooms()
          }
          smets.value.push(e.smet);
          activeEstimate.value = e.smet;
          if (e.smet.approved === true) {
            approvedSmeta.value = e.smet;
            loadActs();
            if (e.smet.rooms.all) {
              connectAllRooms();
            }
          } else {
            approvedSmeta.value = null;
          }
        })
        .listen("Smet.Updated", (e) => {
          console.log("Smet.Updated", e);
          const thisSmet = smets.value.find(smeta => Number(smeta.id) === Number(e.smet.id))
          if(thisSmet){
            Object.assign(thisSmet, e.smet);

            if (thisSmet.approved === true) {
              approvedSmeta.value = thisSmet;
              loadActs();
              if (thisSmet.rooms.all) {
                connectAllRooms();
              }
            } else if(approvedSmeta.value?.id == thisSmet?.id) {
              approvedSmeta.value = null;
            }
            if(activeEstimate.value.id === e.smet.id){
              Object.assign(activeEstimate.value, e.smet);
            }
            setTimeout(() => currentRoomSelectedWorks())
          }
        })
        .listen("Act.Created", (e) => {
          console.log("Act.Created", e);
          Object.assign(currentAct.value, e.act);
          actsList.value.push(e.act);
        })
        .listen("Act.Updated", (e) => {
          console.log("Act.Updated", e);
          const thisAct = actsList.value.find((act) => Number(act.id) === Number(e.act.id))
          if(thisAct){
            Object.assign(thisAct, e.act);
            if(Number(thisAct.id) === Number(currentAct.value.id)){
              Object.assign(currentAct.value, thisAct);
            }
          }
        })
        .listen("Room.Created", (e) => {
          console.log("Room.Created", e);
          const roomInList = rooms.value.find((room) => room.id === e.room.id);
          if (!roomInList) rooms.value.push(e.room);
          if (Number(currentRoom.value?.id) === Number(e.room.id) || !currentRoom.value.id) {
            Object.assign(currentRoom.value, JSON.parse(JSON.stringify(e.room)));
            currentRoomSelectedWorks();
            currentRoom.value.id ? roomComponentTitle = 'Редактирование' : roomComponentTitle = 'Создание';
          }
        })
        .listen("Room.Updated", (e) => {
          console.log("Room.Updated", e);
          setTimeout(() => {
            let thisRoom = rooms.value.find((room) => Number(room.id) === Number(e.room.id))
            if(thisRoom){
              Object.assign(thisRoom, JSON.parse(JSON.stringify(e.room)));
              if (Number(currentRoom.value.id) === Number(thisRoom.id)) {
                Object.assign(currentRoom.value, JSON.parse(JSON.stringify(e.room)));
                currentRoomSelectedWorks();
              }
            }
          }, 100)
        });
  } else {
    deal.value = null;
    clearURL()
    dialogData?.value.close()
  }
}

const addNewPipeline = () => {
  const pip = {
    pipeline: null,
    stage: null,
    stages: [],
    pipelines: getPipelineOptions()
  }
  if (addedPipelines.value.length && addedPipelines.value[addedPipelines.value.length - 1].stage) addedPipelines.value.push(pip)

  addedPipelines.value.forEach(p => {
    p.pipelines = getPipelineOptions(p);
  });
};

const getPipelineOptions = (pip) => {
  const added = addedPipelines.value
      .filter(p => p !== pip && p.pipeline) // Исключаем текущий объект
      .map(p => p.pipeline);

  return pipelines.value
      .map(p => ({
        id: p.id,
        name: p.name,
      }))
      .filter(p => !added.includes(p.id));
};

const updatePipelineStages = (pip) => {
  const selectedPipeline = pipelines.value.find(p => p.id === pip.pipeline);
  pip.stages = selectedPipeline ? Object.values(selectedPipeline.stages) : [];
  pip.stage = null;
  pip.stageColor = null;
  isDealChanged.value = false;

  addedPipelines.value.forEach(p => {
    p.pipelines = getPipelineOptions(p);
    if (p !== pip) {
      p.disabled = true;
    }
  });
};

const updateStageColor = (pip) => {
  const selectedPipeline = pipelines.value.find(p => p.id === pip.pipeline)
  const selectedStage = Object.values(selectedPipeline.stages).find(s => s.id === pip.stage)
  pip.stageColor = selectedStage ? selectedStage.color : '';
  isDealChanged.value = true;

  addedPipelines.value.forEach(p => {
    p.disabled = false;
  })
};

const deleteDealPipeline = (pipelineId) => {
  addedPipelines.value = addedPipelines.value.filter(p => p.pipeline !== pipelineId)
  isDealChanged.value = true;
}

const updatePipelineRemoveState = () => {
  if (addedPipelines.value.length === 2 && !addedPipelines.value[addedPipelines.value.length - 1].stage) {
    addedPipelines.value[addedPipelines.value.length - 1].canRemove = true;
    addedPipelines.value[addedPipelines.value.length - 2].canRemove = false;
  } else {
    addedPipelines.value.forEach(pipeline => {
      pipeline.canRemove = addedPipelines.value.length > 1; // Если больше одного, можно удалить
    });
  }
};

const setListsData = () => {
  facility_typeList = lists.value.fields.facility_type.list.map((item, index) => {
    return {value: index, label: item};
  },);
  facility_conditionList = lists.value.fields.facility_condition.list.map((item, index) => {
    return {value: index, label: item};
  });
  temperatureList = lists.value.fields.temperature.list.map((item, index) => {
    return {
      value: index,
      label: item,
    };
  }) || [];
  // responsibleList = lists.value.users;
  // operatorList = responsibleList.filter((user) => user.role_id === 2);
  // zamermanList = responsibleList.filter((user) => user.role_id === 3);
  // designerList = responsibleList.filter((user) => user.role_id === 5);
  // prorabList = responsibleList.filter((user) => user.role_id === 4);

  pagePartners = lists.value.partners;
  pageTags = getTags(lists.value.tags);
  pageCompanies = Object.entries(lists.value.companies).map(([id, name]) => ({ id: Number(id), name }));
  fields = lists.value.fields;
  taskTypes = lists.value.tasks.types;
  roomSettings = lists.value.roomSettings
}
const showDealSaveButton = (event) => {
  let changed = false
  if (event) {
    if (event === 'tags') {
      const dealTags = getTags(tagsArr.value);
      const originalDealTags = getTags(originalDeal.value.tags);
      changed = JSON.stringify(dealTags) !== JSON.stringify(originalDealTags)
    }
  }

  changed = deepEqual(originalDeal.value, deal.value, ['updated_at'], ['date_start', 'date_end']);
  setTimeout(() => isDealChanged.value = changed)
}

const filteredTags = computed(() => {
  if (tagsArr.value && tagsArr.value.length) {
    return pageTags.filter((stage) => {
      if (!tagsArr.value.includes(stage)) {
        return stage;
      }
    })
  } else {
    return pageTags;
  }
})

// URL
const currentPage = ref(window.location.href)

const setUrl = (dealID) => {
  const newUrl = dealID ? `/deals/${dealID}` : null;
  if (newUrl) {
    window.history.pushState(currentPage.value, '', newUrl)
  }
}

const clearURL = () => {
  const oldUrl = window.location.href;
  window.history.pushState(oldUrl, '', currentPage.value)
}

const collapseModal = (value) => { // Свернуть
  if(!dialogData) return
  emit("collapse", { id: deal.value.id, value, objectName: 'deal' });
  if(value){ // Задержка перед скрытием содержимого модалки
    clearURL()
    setTimeout(() =>{
      collapsed.value = value;
    }, 100)
  } else {
    setUrl(deal.value.id)
    collapsed.value = value;
    if (window.localStorage.getItem("copiedSmeta")) { // При разворачивание также проверим не было ли скопирована смета, чтобы не следить за LS
      copiedSmeta.value = JSON.parse(window.localStorage.getItem("copiedSmeta"));
    }
  }
};

const handleHeaderClick = (event) => { // Развернуть
  const target = event.target.closest("button");  // Проверяем, клик был сделан по кнопке
  if (!target) {
    collapseModal(false);
  }
};


const saveDealNewState = async () => {
  // Обновление отдельных сущностей сделки
  deal.value.tags = tagsArr.value;
  addedPipelines.value = addedPipelines.value.filter(pip => pip && pip.stage)
  deal.value.stages = addedPipelines.value.map(pip => pip.stage);

  const contactsIsReady = await setupContactsBeforeSaving()
  if(!contactsIsReady) return
  else contactErrors.value = [];

  deal.value.contacts = addedContacts.value.map(contact => {
    return {
      surname: contact.surname,
      name: contact.name,
      patronymic: contact.patronymic,
      phone: String(contact.phone).replace(/[^0-9]/g, '')
    };
  })
  // Исправление бага со временем
  if (deal.value.zamer_time && deal.value.zamer_time !== originalDeal.value.zamer_time) {
    if (String(deal.value.zamer_time).length > 8) {
      deal.value.zamer_time = String(deal.value.zamer_time).slice(16, 21) + ":00";
    }
  }
  // Проверка на наличие контакта
  // if (!deal.value.contacts.length) {
  //   $showErrorToast('Укажите контакты!')
  //   errorMessages.value.contacts = true
  // } else {
  //   errorMessages.value = {}
  // }

  // Сохранение сделки в бд
  store.showModalLoader()

  if (deal.value.type && deal.value.type === 'emptyDeal') { //&& !errorMessages.value.contacts
    const response = await createDeal(deal.value, errorMessages.value);
    if(response.success) {
      store.addNewDealToKanbanAndTable(response.deal)

      const onlyRequiredFields = ["id", "isCollapsed", "type"]; // чтобы не мусорить LS только нужные поля оставляем
      const dealWithOnlyRequiredFields = Object.fromEntries(
          Object.entries(response.deal).filter(([key]) => onlyRequiredFields.includes(key))
      );
      store.setNewModal({modalData: dealWithOnlyRequiredFields, modalTitle: 'deal'})

      dialogData.value.close();
      $showSuccessToast('Объект успешно создан!');
    } else{
      $showErrorToast(response.msg)
      if(response.msg.includes('uid')){
        errorMessages.value.uid = true
      }
    }
    store.hideModalLoader()
  }
  else if (!deal.value.type) {
    if (originalDeal.value.skidka !== deal.value.skidka) {
      await updatePriceList('onDealUpdating');
    }
    store.showModalLoader()
    const response = await updateDeal(deal.value, errorMessages, chatContacts, isDealChanged, dealChanged);
    if(response.success){
      store.addNewDealToKanbanAndTable(response.deal)
    }
    store.hideModalLoader()
  }
};

const saveRoomState = () => {
  if (activeEstimate.value && !activeEstimate.value.approved) {
    roomFull.value.saveNewRoomState();
  }
};

const closeModal = () => {
  const removedModal = {
    modalData: {
      id: deal.value.id
    },
    modalTitle: 'deal',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: deal.value.id, objectName: 'deal'});
  clearURL()
  dialogData.value.close();
};

const changeTab = (value) => {
  activeTab.value = value;
  if (value === 'renovation') {
    if (deal.value.price && (!smets.value || !smets.value.length)) {
      getSmets();
    }
  }
  if (value === 'acts') {
    if (deal.value.price && (!smets.value || !smets.value.length)) {
      getSmets();
    }
  }

};

const changeWindow = (value) => {
  activeWindow.value = value;
};

// Табы и окна
const activeTab = ref("home");
const activeWindow = ref("Deals");

// Сметы
const smets = ref([]);
const activeEstimate = ref({
  deal_id: null,
  name: null,
  rooms: {
    list: [],
    works: {},
  },
  approved: false,
  total: null,
  comment: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
});
const approvedSmeta = ref(null);
const approvedSmetaForAct = ref(null);
const copiedSmeta = ref(null);
const activeSmetaValuesSum = ref({wallsSSum: null, floorSSum: null, pSum: null, floorPSum: null, hSum: null});

const currentRoom = ref({});
const selectedWorks = ref({});

const updateSmetRooms = (newRoom, newWorks, onlyUpdateWorks) => {
  // В смету добавляем ИД новой комнаты
  if (activeEstimate.value.rooms.list && !activeEstimate.value.rooms.list.includes(Number(newRoom.id))) {
    activeEstimate.value.rooms.list.push(Number(newRoom.id));
  } else if (!activeEstimate.value.rooms.list) {
    activeEstimate.value.rooms = {list: [Number(newRoom.id)]};
  }

  // Добавляем новые работы в смету
  if (newWorks) {
    activeEstimate.value.rooms.works = {
      ...activeEstimate.value.rooms.works,
      ...newWorks.selectedWorks,
    };
  }

  activeEstimate.value.total = getSmetWorksSum(activeEstimate.value.rooms.works, activeEstimate.value)
  currentRoomSelectedWorks();

  // Сохраняем изменения в смете
  console.log(activeEstimate.value);
  setTimeout(async() => await updateSmet(activeEstimate.value))
};

const getSmets = async (getAfterAutoCreate) => {
  smets.value = [];
  store.showModalLoader();
  if(getAfterAutoCreate){
    smets.value = await getSmetsList(deal.value.id);
  } else{
    smets.value = JSON.parse(JSON.stringify(deal.value.smets));
  }

  if (smets.value.length) {
    setTimeout(() => {
      // Проверим наличие подтвержденной сметы
      approvedSmeta.value = smets.value.find((item) => item.approved);

      // Выбираю активную смету
      activeEstimate.value = smets.value.find((item) => item.approved)
          ? smets.value.find((item) => item.approved)
          : smets.value[smets.value.length - 1];
    }, 0);
  }

  if (!smets.value.length) {
    if (deal.value.price) {
      autoCreateNewSmet();
    }
  }

  store.hideModalLoader()
  setTimeout(() => getRooms(getAfterAutoCreate))
};

const autoCreateNewSmet = async () => {
  await createAutoSmet(deal.value.id); // Создаем смету и загрузим список
  await getSmets('getAfterAutoCreate')
};

const showFilteredRooms = computed(() => {
  if (activeEstimate.value.rooms.list) {
    let smetRooms = [];
    rooms.value.forEach((room, index) => {
      smetRooms[index] = {
        ...room,
        involved: activeEstimate.value.rooms.list.includes(Number(room.id)),
      };
    });

    let parametrs = {
      floorSSum: 0,
      floorPSum: 0,
      wallsSSum: 0,
      pSum: 0,
      hSum: 0
    }
    smetRooms.forEach(room => {
      if (room.involved && room.room_type_id === 1) {
        parametrs.floorSSum += Number(room.s_floor)
        parametrs.floorPSum += Number(room.p_floor)
        parametrs.wallsSSum += Number(room.s_walls)
        parametrs.pSum += Number(room.perimeter)
        parametrs.hSum += Number(room.height)
      }
    })
    activeSmetaValuesSum.value.floorSSum = Math.round(parametrs.floorSSum * 100) / 100;
    activeSmetaValuesSum.value.floorPSum = Math.round(parametrs.floorPSum * 100) / 100;
    activeSmetaValuesSum.value.wallsSSum = Math.round(parametrs.wallsSSum * 100) / 100;
    activeSmetaValuesSum.value.pSum = Math.round(parametrs.pSum * 100) / 100;
    activeSmetaValuesSum.value.hSum = Math.round(parametrs.hSum * 100) / 100;

    return smetRooms;
  } else {
    return [];
  }
});

const involveOrNot = async (room) => {
  room.involved = !room.involved;
  if (room.involved) {
    activeEstimate.value.rooms.list.push(Number(room.id));
  } else {
    activeEstimate.value.rooms.list = activeEstimate.value.rooms.list.filter((roomId) => roomId !== Number(room.id));
    // if (activeEstimate.value.rooms.works[room.id]) {
    //   delete activeEstimate.value.rooms.works[room.id]
    // }
  }
  // Сохраняем изменения в смете
  const updatedEstimate = await updateSmet(activeEstimate.value);
  setTimeout(() => {
    for (const [key, value] of Object.entries(updatedEstimate)) {
      activeEstimate.value[key] = value;
    }
  })
};

const currentRoomSelectedWorks = () => {
  const roomWorks = activeEstimate.value.rooms.works[currentRoom.value.id]?.works;
  selectedWorks.value = roomWorks && typeof roomWorks === 'object'
      ? { ...activeEstimate.value.rooms.works[currentRoom.value.id] }
      : { total: 0, works: {}, handEdited: [] };
};

const setActiveSmeta = (smetaId) => {
  activeEstimate.value = smets.value.find((item) => item.id === smetaId);
};

const selectedWorksChanged = async (data) => {
  // Смотрим есть ли есть текущая смета, т.е созданная ранее
  if (activeEstimate.value.id) {
    // Обновляем или добавляем работы для текущей комнаты
    if(activeEstimate.value.rooms.works[currentRoom.value.id]){
      delete activeEstimate.value.rooms.works[currentRoom.value.id];
    }

    activeEstimate.value.rooms.works = {
      ...activeEstimate.value.rooms.works, // Оставляем существующие данные
      ...data.selectedWorks, // Обновляем новыми
    };

    setTimeout(async() => {
      activeEstimate.value.total = getSmetWorksSum(activeEstimate.value.rooms.works, activeEstimate.value)

      // Обновляем смету
      const response = await updateSmet(activeEstimate.value);
    })
  }
};

let smetDialogRef = null;
const createNewSmet = async () => {
  smetDialogRef = dialog.open(SmetModal, {
    props: {
      header: `Создание новой сметы`,
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('.main'),
      showHeader: false,
    },
    data: {
      smet: {
        deal_id: deal.value.id,
        name: null,
        comment: null,
        withWorks: false,
        withRooms: false,
        act_rooms: false,
        discount: 0,
        total_discount: 0,
        rooms: {
          list: [],
          works: {},
        },
        approved: false,
        total: 0,
      },
      copyFromOtherSmets: smets.value.length > 0 ? smets.value[smets.value.length - 1] : null,
      disableEdit: approvedSmeta,
      anyRooms: !!rooms.value.length,
      anyActs: false,
    },
    emits: {
      // onSave: (newData) => {
      //   smets.value.push(newData.newSmet);
      //   activeEstimate.value = newData.newSmet;
      //   if (newData.newSmet.rooms.all) {
      //     connectAllRooms()
      //   }
      // },
    },
  });
};

const editSmeta = async (smeta) => {
  smetDialogRef = dialog.open(SmetModal, {
    props: {
      header: `Изменение сметы`,
      draggable: false,
      modal: true,
      pt: ptDialog,
      appendTo: document.querySelector('.main'),
      showHeader: false,
    },
    data: {
      smet: smeta,
      copyFromOtherSmets: smets.value.find((item) => item.approved),
      anyRooms: !!smeta.rooms.list.length, // Нельзя подтвердить пока нет комнат
      anyWorks: allRoomsHasWorks(smeta), // Нельзя подтвердить пока нет работ
      anyActs: !!actsList.value.length, // Нельзя убрать подтверждение пока есть акты
    },
  });
};

const allRoomsHasWorks = (smetaRef) => {
  const smeta = JSON.parse(JSON.stringify(smetaRef))
  if (!smeta.rooms) return false;

  if (typeof smeta.rooms.works === 'object') {
    const rooms = Object.values(smeta.rooms.works);
    return rooms.every(room => room.works && Object.keys(room.works).length > 0);
  }

  return false;
};

const copySmet = async (smeta) => {
  window.localStorage.setItem('copiedSmeta', JSON.stringify(smeta));
  copiedSmeta.value = smeta
  $showInfoToast(`Смета "${copiedSmeta.value.name}" скопирована`)
}

const pasteCopiedSmeta = async () => {
  const data = await addCopiedSmetToNewDeal(deal.value.id, copiedSmeta.value.id);
  // if (data) {
  //   smets.value.push(data.smet);
  //   activeEstimate.value = data.smet;
  //   data.rooms.forEach(room => rooms.value.push(room));
  // }

  setTimeout(() => {
    copiedSmeta.value = null;
    window.localStorage.removeItem('copiedSmeta');
  })
};

const connectAllRooms = async () => {
  const allRooms = connectRooms(approvedSmeta.value);
  approvedSmeta.value.rooms.all = allRooms;
};

// Комнаты
const roomFull = ref(null);
const roomChanged = ref(false);

const rooms = ref([]);
const roomsForAct = ref([]);
let roomComponentTitle = 'Создание'

const setRoomChanged = (value, from) => {
  // console.log(value, from)
  if (approvedSmeta.value) {
    roomChanged.value = false
  } else {
    roomChanged.value = value;
  }
};

const getRooms = async (getAfterAutoCreate) => {
  rooms.value = []

  if(getAfterAutoCreate){
    const response = await getRoomsList(deal.value.id);
    if(response.success){
      rooms.value = response.rooms
    }
  } else{
    rooms.value = JSON.parse(JSON.stringify(deal.value.rooms))
  }
  // Комнаты добавляются в общий массив но через компьютед делаю фильтр и вывожу только те который принадлежат активной смете
  await getWorksCollection(worksCollectionData);
  await getWorksList(worksList, worksListWithOriginalPrices, group, category, factorList, edList, workTypeList);
  setTimeout(() => {
    connectAdditionalWorks();
    updatePrices();
    updateActiveEstimateTotal();
  }, 0);
  if (approvedSmeta.value && (!actsList.value || !actsList.value.length)) {
    await loadActs(getAfterAutoCreate)
  }
};

const openRoom = (room) => {
  currentRoom.value = JSON.parse(JSON.stringify(room));
  currentRoom.value.id ? roomComponentTitle = 'Редактирование' : roomComponentTitle = 'Создание';
  changeWindow("Room");
  currentRoomSelectedWorks();
};

const addNewRoom = () => {
  currentRoom.value = {
    deal_id: deal.value.id,
    name: "",
    room_type_id: 1,
    length: null,
    width: null,
    height: rooms.value && rooms.value.length && rooms.value[0].height ? rooms.value[0].height : null,
    s_floor: 0,
    s_walls: 0,
    perimeter: 0,
    s_holes: 0,
    slopes_doors: 0,
    slopes_windows: 0,
    doors_width: 0,
    doors: [{value:1,height:2,width:0.8}],
    windows: [],
    columns: [],
    room_size: {
      shape: 'rectangle',
      a: null,
      b: null,
      c: null,
      d: null,
      h: rooms.value && rooms.value.length && rooms.value[0].height ? rooms.value[0].height : null,
      s: null,
      p: null,
      s_walls: null,
      outer_corner: 0,
      inner_corner: 0,
      s_columns: 0,
      p_columns: 0,
      projectionsCorner: 0,
      projectionsCornerInner: 0,
    }
  };
  currentRoomSelectedWorks()
  currentRoom.value.id ? roomComponentTitle = 'Редактирование' : roomComponentTitle = 'Создание';
  changeWindow("Room");
};

const getRoomWorksSum = (roomId) => {
  if (activeEstimate.value.rooms && activeEstimate.value.rooms.works
      && activeEstimate.value.rooms.works[roomId]
      && activeEstimate.value.rooms.works[roomId].total) {
    const total = activeEstimate.value.rooms.works[roomId].total;
    // return total ? Math.round(total * 100) / 100 : 0;
    return total ? Math.ceil(total) : 0;
  }
  return 0;
};

const getRoomTotalWithoutDiscount = (roomId) => {
  if (activeEstimate.value?.rooms?.works[roomId]?.total) {
    const total = activeEstimate.value.rooms.works[roomId].total / (1 - originalDeal.value.skidka / 100);
    // return total ? Math.round(total * 100) / 100 : 0;
    return total ? Math.ceil(total) : 0; // Округление в большую сторону
  }
  return 0;
};

//Работы и прайс-лист
const worksList = ref([]);
let worksListWithOriginalPrices = [];
const group = ref({});
const category = ref({});
const factorList = ref([]);
const edList = ref([])
const workTypeList = ref([]);
const worksCollectionData = ref([]);

const connectAdditionalWorks = () => {
  // Добавляю доп.работы, которые принадлежат только этой сделке
  if (deal.value.price.additional && Object.values(deal.value.price.additional).length) {
    Object.values(deal.value.price.additional).forEach(work => {
      worksList.value.push(work);
      worksListWithOriginalPrices.push(work)
    })
  }
}
// Заменяем цены работ на цены из прайс-листа
const updatePrices = () => {
  worksList.value.forEach(work => {
    if (deal.value?.price.list.hasOwnProperty(work.id)) {
      work.price = deal.value.price.list[work.id];
    }
  });
};
// Функция для возврата исходных цен
// const resetPrices = () => {
//   worksList.value = JSON.parse(JSON.stringify(worksListWithOriginalPrices));
// }

// Операции после изменения отложенной скидки
const updateActiveEstimateTotal = () => {
  let total = 0;
  smets.value.forEach(smeta => {
    Object.values(smeta.rooms.works).forEach(room => {
      if(room?.works){
        Object.entries(room.works).forEach(([key, value]) => {
          const quantity = Number(value); // Получаем количество работы
          const price = worksList.value.find(item => item.id === Number(key)).price // Получаем цену из списка
          total += quantity * price; // Умножаем количество на цену и добавляем к общей сумме
        })
      } else{

      }
      if(room?.total) room.total = total;
      total = 0;
    })
    smeta.total = getSmetWorksSum(smeta.rooms.works, smeta)
  })
}

const editPriceList = (priceList) => {
  smetDialogRef = dialog.open(PriceListFull, {
    props: {
      header: `Прайс-лист`,
      draggable: false,
      modal: true,
      pt: ptDialog,
      showHeader: false,
      appendTo: document.querySelector('.main'),
    },
    data: {
      priceList: null,
      skidka: deal.value.skidka,
      deal: deal.value,
      toUpdate: !!priceList,
      impossibleToEdit: approvedSmeta.value ? true : false,
      group: group.value,
      category: category.value,
      factor: factorList.value,
      ed: edList.value,
      type: workTypeList.value,
    },
    emits: {
      onEmitAdditionalWorkToDeal: (newData) => {
        store.showModalLoader()
        console.log(store.modalLoader)
        if (!deal.value.price.additional || typeof deal.value.price.additional !== 'object') {
          deal.value.price.additional = {};
        }

        const additionalWork = JSON.parse(JSON.stringify(newData.newAddWork))
        if (additionalWork.id) {// Обновляем объект, если он уже есть
          deal.value.price.additional[additionalWork.id] = {
            ...deal.value.price.additional[additionalWork.id],
            ...additionalWork
          };
        } else {
          additionalWork.id = Object.keys(deal.value.price.additional).length + 1000000;
          additionalWork.default_value = 0;
          deal.value.price.additional = {
            ...deal.value.price.additional,
            [additionalWork.id]: additionalWork,
          };
        }

        // Ищем в worksList и обновляем если есть уже такой объект
        const index = worksList.value.findIndex(work => work.id === additionalWork.id);
        if (index !== -1) {
          worksList.value[index] = { ...worksList.value[index], ...additionalWork };
        } else {
          worksList.value.push(additionalWork);
        }

        deal.value.stages = addedPipelines.value.map(pip => pip.stage);
        setTimeout(async() => {
          deal.value.tags = tagsArr.value;
          await updateDeal(deal.value)
          store.hideModalLoader()
          isDealChanged.value = false;
        }, 0);

      }
    },
  });
}

const updatePriceList = createUpdatePriceList(deal, store, smets, autoCreateNewSmet, updatePrices, updateActiveEstimateTotal, isDealChanged);

// Акты
const currentAct = ref(null);
const actChanged = ref(null);
const actsList = ref(null);
// Для вызова функций дочерних компонентов
const actFull = ref(null);
const actTable = ref(null);
let actComponentTitle = 'Создание';

const loadActs = getActs(deal, actsList, store, approvedSmeta, connectAllRooms);

const setActChanged = (value) => {
  actChanged.value = value;
};

const CreteOrOpenAct = async (act) => {
  if (approvedSmeta.value) {
    if (!act.deal_id || !act.user_id) {
      act.deal_id = deal.value.id;
      // act.user_id = usePage().props.auth.user.id;
    }
    currentAct.value = act;
    act.id ? actComponentTitle = 'Редактирование' : actComponentTitle = 'Создание';

    approvedSmetaForAct.value = JSON.parse(JSON.stringify(approvedSmeta.value))
    roomsForAct.value = rooms.value

    if (approvedSmeta.value.rooms.all) {
      roomsForAct.value = [{
        id: approvedSmeta.value.rooms.all.id,
        name: approvedSmeta.value.rooms.all.name,
      }]

      approvedSmetaForAct.value.rooms.works = {
        [0]: approvedSmeta.value.rooms.all.works
      }
      approvedSmetaForAct.value.rooms.list.push(approvedSmeta.value.rooms.all.id)
    }

    setTimeout(() => {
      changeWindow("Act");
    });
  }
};

const saveActState = () => {
  actFull.value.saveNewActState();
};

const changeDefferedSkidkaPaidStatus = (value) => {
  deal.value.deferred_skidka_paid = value;
}

//  Табы чатов
const chatTabIndex = ref(0);
const mobileTabIndex = ref(0);

const dealUpdateMsgTimer = ref(0);

const updateStatusMessage = ref({msg: '', color: 'text-emerald-500'});
const updateFromAMOSAB = updateDealFrom(deal, updateStatusMessage, originalDeal, dealUpdateMsgTimer);

// Адреса
const {addressQuery, suggestions, selectedIndex, getSuggestions, moveDown, moveUp, setAddress} = useAddressAutocomplete();

const mapSettings = ref({
  location: {
    center: [37.617644, 55.755819],
    zoom: 13,
  },
})
const marker = ref({
  coordinates: [37.617644, 55.755819],
})

const setDealCoordinates = () => {
  if (deal.value.geo && deal.value.geo.lat && deal.value.geo.lon) {
    mapSettings.value.location.center = [deal.value.geo.lon, deal.value.geo.lat]
    marker.value.coordinates = [deal.value.geo.lon, deal.value.geo.lat]
  }
}

// Доп.телефоны
const addedContacts = ref([])
const addNewContactStatus = ref(true)
const numberSuggestions = ref([])
const numberSuggestionsDelay = ref(null)
const isSettingContact = ref(false)
const namesSuggestions = ref([])
const contactErrors = ref([])

const addNewContact = () => {
  const contact = {
    surname: "",
    name: "",
    patronymic: "",
    full_name: "",
    phone: null,
    canRemove: true,
    editable: true
  }
  isSettingContact.value = false;
  addedContacts.value.push(contact)
  addNewContactStatus.value = false
  setTimeout(() => {
    isDealChanged.value = false;
    // updateContactRemoveState()
  }, 0)
}

const updateContactRemoveState = () => {
  if (addedContacts.value.length === 2 && !addedContacts.value[addedContacts.value.length - 1].phone) {
    addedContacts.value[addedContacts.value.length - 1].canRemove = true;
    addedContacts.value[addedContacts.value.length - 2].canRemove = false;
  } else {
    addedContacts.value.forEach((contact, index) => {
      contact.canRemove = addedContacts.value.length > 1; // Если больше одного, можно удалить
      // contact.canRemove = true;
    });
  }
};

const createNewContact = async (contact) => {
  if(!contact.name && !contact.patronymic && !contact.surname) {
    setFioFromFullName(contact)
  }

  store.showModalLoader()
  const res = await setNewData(contact)

  if(res.success){
    contact = res.data;
    contactErrors.value = []
    setTimeout(() => {
      saveDealNewState()
    },0)
  } else if(res.errors.length){
    contactErrors.value = res.errors
  }
  store.hideModalLoader()
}

const setContact = (contact, suggestion) => {
  let duplicate = null;

  addedContacts.value.forEach(c => {
    if (c !== contact) {
      if (String(c.phone).replace(/[^0-9]/g, '') === String(suggestion.phone).replace(/[^0-9]/g, '')) {
        duplicate = true;
      }
    }
  });

  if (!duplicate) {
    // if (!contact.surname?.length) contact.surname = suggestion.surname
    // if (!contact.name?.length) contact.name = suggestion.name
    // if (!contact.name?.length) contact.patronymic = suggestion.patronymic
    // if (!contact.full_name?.length) contact.full_name = suggestion.full_name
    if (suggestion.name !== 'контакт' && suggestion.surname !== 'Новый'){
      contact.name = suggestion.name
      contact.surname = suggestion.surname
      contact.patronymic = suggestion.patronymic
      contact.full_name = suggestion.full_name
    }
    contact.phone = suggestion.phone

    if(suggestion.id){ // Если выбрпали из существующих контактов, то просто указываем его и сохранять не надо
      Object.assign(contact, suggestion);
      namesSuggestions.value = []
    }

    isSettingContact.value = true;
    numberSuggestions.value = [];
    namesSuggestions.value = [];
    addNewContactStatus.value = true;
    updateContactRemoveState()
    isDealChanged.value = true
  } else {
    $showErrorToast("Контакт уже добавлен!")
    numberSuggestions.value = []
  }
}

const openContact = (contact) => {
  store.setNewModal({modalData: contact, modalTitle: 'contact'})
  collapseModal(true)
}

const deleteContact = (contact) => {
  addedContacts.value = addedContacts.value.filter(c => c !== contact);

  addNewContactStatus.value = true;
  setTimeout(() => {
    updateContactRemoveState()
    isDealChanged.value = true
    numberSuggestions.value = []
  }, 0)
}

const getNamesSuggestions = async (contact) => {
  if(contact.full_name?.length > 2){
    namesSuggestions.value = await fetchNamesSuggestions(contact.full_name)
  }
}

const setNameSuggestion = (contact, suggestion) => {
  contact.full_name = suggestion.value
  contact.surname = suggestion.data.surname
  contact.name = suggestion.data.name
  contact.patronymic = suggestion.data.patronymic
  namesSuggestions.value = []
}

const getNumberSuggestions = (contact) => {
  const query = String(contact.phone).replace(/[^0-9]/g, "");
  if (query.length > 3 && !isSettingContact.value) {
    fetchNumberSuggestions(query, numberSuggestionsDelay, (result) => {
      numberSuggestions.value = result;
    });
  }
};

const setFioFromFullName = (contact) => {
  const parts = contact.full_name.trim().split(' ');

  switch (parts.length) {
    case 0:
      break;
    case 1:
      contact.name = parts[0];
      break;
    case 2:
      const patronymicEndings = ['ович', 'евич', 'ич', 'овна', 'евна', 'ична', 'инична'];
      const secondWord = parts[1].toLowerCase();
      const isPatronymic = patronymicEndings.some(ending => secondWord.endsWith(ending));

      if (isPatronymic) {
        contact.name = parts[0];
        contact.patronymic = parts[1];
      } else {
        contact.surname = parts[0];
        contact.name = parts[1];
      }
      break;
    case 3:
      contact.surname = parts[0];
      contact.name = parts[1];
      contact.patronymic = parts[2];
      break;
  }
};

const setupContactsBeforeSaving = async () => {
  let emptyNameField = false;
  let emptyPhoneField = false;

  // Проверяем каждый контакт
  addedContacts.value.forEach(contact => {
    if (contact.id) return; // Пропускаем существующие контакты

    if(!contact.name && !contact.patronymic && !contact.surname) {
      setFioFromFullName(contact)
    }

    if (!contact.name) emptyNameField = true;
    if (!contact.phone) emptyPhoneField = true;
  });

  // Выводим сообщения об ошибках
  if (emptyNameField) {
    contactErrors.value.push('name')
    $showErrorToast("Укажите имя контакта");
  }
  if (emptyPhoneField){
    contactErrors.value.push('phone')
    $showErrorToast("Укажите телефон контакта");
  }

  // Возвращаем результат проверки
  if (emptyNameField || emptyPhoneField) return false;

  numberSuggestions.value = []
  namesSuggestions.value = []
  return true;
};

// участники
const leftParticipantsPopover = ref(null)
const showLeftParticipantsPopover = (event) => {
  leftParticipantsPopover.value.toggle(event);
}

//PDF
const downloadPDF = async (value, itemId, dealId) => {
  const path = `/deals/${dealId}/pdf/${value}${itemId ? `/${itemId}` : ''}`;
  // Создаем некий объект с идшкой, чтобы в модалке можно было открыть
  const pdfDocument = {
    modalData: {
      id: `deal-${dealId}-pdf-${value}${itemId ? `-${itemId}` : ''}`,
      path: path,
    },
    modalTitle: 'pdf',
  }

  // if(dialogData){ // Если открыта отдельная страница сделки, то не будем сворачивать сделку
  //   collapseModal(true)
  // }

  store.setNewModal(pdfDocument)

};

// Закрытие опций при клике
const closeOptionsPanels = () => {
  numberSuggestions.value = []
  namesSuggestions.value = []
}

// Отвественные
const getProrabs = async () => {
  const params = {
    fields: {
      users: ['id', 'name'],
    },
    filter: {
      roles: [3]
    }
  }
  prorabList.value = await fetchUsersWithRolesAndNewFilters(params)
}
</script>

<template>
  <div
      v-if="deal || loading"
      class="modal-container w-full h-full overflow-hidden"
      @click="closeOptionsPanels"
  >
<!--      :class="{ 'translate-y-[calc(100%-var(--header-height))]': collapsed }"-->
    <div v-if="loading" class="h-full w-full">
      <header class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-4 text-lg text-white">
        <div class="flex items-center gap-1 py-[8px]">
          <img loading="lazy" src="/images/menu/deals.svg" alt="deal-logo" width="28px" height="28px">
          <h2 class="font-normal pr-2">
            <span>Объект</span>
          </h2>
        </div>
        <div class="flex items-center gap-2 text-base">
          <button
              v-if="dialogData"
              class="custom-collapse-button"
          >
            <span class="pi pi-times"></span>
          </button>
          <NuxtLink v-else to="/deals"><button title="Вернуться к списку" class="custom-collapse-button text-white bg-transparent transition duration-200 ease-in-out hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800/80  border-0', flex items-center justify-center rounded-full w-8 h-8 p-1"><span class="pi pi-list text-xl"/></button></NuxtLink>
        </div>
      </header>
      <div class="h-[calc(100%-var(--header-height))] bg-white dark:bg-surface-800 relative overflow-hidden rounded-lg flex items-center">
        <ProgressSpinner/>
      </div>
    </div>

    <div v-else class="h-full w-full">
      <header
          @click="handleHeaderClick"
          class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-4 text-lg text-white"
          :class="{'hover:bg-modal-header-hover cursor-pointer': collapsed}"
      >
        <div class="flex items-center gap-1 py-[8px]">
          <img loading="lazy" src="/images/menu/deals.svg" alt="deal-logo" width="28px" height="28px">
          <h2 class="font-normal pr-2">
            <span v-show="!deal.type || deal.type !== 'emptyDeal'">Объект {{ deal && deal.id }}</span>
            <span v-show="deal.type && deal.type === 'emptyDeal'">Новый объект</span>
          </h2>
        </div>
        <div class="flex items-center gap-2 text-base">
<!--          <div-->
<!--              v-show="dealChanged"-->
<!--              class="absolute top-0 right-[95px] px-3 h-[50px] text-emerald-500 border-0 text-base flex items-center justify-center p-1"-->
<!--          >-->
<!--            <p>Сохранено!</p>-->
<!--          </div>-->
          <button
              v-show="isDealChanged && !collapsed"
              :title="Сохранить"
              @click="saveDealNewState"
              class="bg-emerald-400 hover:bg-emerald-700 h-[var(--modal-header-height)] text-white border-0 flex items-center justify-center py-1 px-2"
          >
<!--            <i class="pi pi-check-circle pr-1"></i>-->
            <p>Сохранить</p>
          </button>
          <button
              title="Свернуть"
              v-show="!collapsed && dialogData"
              @click="collapseModal(true)"
              class="custom-collapse-button"
          >
            <span class="pi pi-minus"></span>
          </button>
          <button
              v-show="!collapsed && deal.id && deal.id > 0"
              class="custom-collapse-button"
              title="Скопировать ссылку на объект"
              @click="copyLinkToModal(deal.id, 'deals')"
          >
            <span class="pi pi-copy custom-collapse-button cursor-pointer"/>
          </button>
          <button
              v-show="!collapsed && deal.id && deal.id > 0 && dialogData"
              class="custom-collapse-button"
              title="Открыть в новой вкладке"
              @click="openModalOnPage(deal.id, 'deals')"
          >
            <span class="pi pi-external-link custom-collapse-button cursor-pointer"/>
          </button>
          <button
              v-if="dialogData"
              @click.prevent="closeModal"
              class="custom-collapse-button"
          >
            <span class="pi pi-times"></span>
          </button>
          <NuxtLink v-else to="/deals"><button title="Вернуться к списку" class="custom-collapse-button text-white bg-transparent transition duration-200 ease-in-out hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800/80  border-0', flex items-center justify-center rounded-full w-8 h-8 p-1"><span class="pi pi-list text-xl"/></button></NuxtLink>
        </div>
      </header>
      <!--Основной раздел-->
      <section v-show="!collapsed" class="h-[calc(100%-40px)] relative overflow-hidden">
        <section v-show="activeWindow === 'Deals'" class="flex flex-col h-full lg:block relative bg-gray-200 dark:bg-surface-900 p-0">

          <TabView v-model:activeIndex="mobileTabIndex" :pt="ptTabViewDealModalPreset">
            <TabPanel header="Header I" class="panel-left">
              <main class="flex flex-col bg-white dark:bg-modal-panel-bg max-sm:p-0 overflow-hidden relative h-full lg:mt-0 l-lg">
                <!--навигация-->
                <nav class="modal-advanced-menu relative flex items-center border-b-2 text-surface-700 dark:text-surface-400 dark:border-surface-800 justify-between mx-2">
                  <div class="flex items-center gap-2 max-sm:gap-0">
                    <p @click="changeTab('home'); mobileTabIndex = 0" class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : activeTab === 'home'}">Инфо</p>
                    <p v-show="(!deal.type || deal.type !== 'emptyDeal')" @click="changeTab('renovation'); mobileTabIndex = 0" class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : activeTab === 'renovation'}">Сметы</p>
                    <p v-show="(!deal.type || deal.type !== 'emptyDeal')" @click="changeTab('acts'); mobileTabIndex = 0" class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : activeTab === 'acts'}">Акты</p>
                    <p @click="mobileTabIndex = 1; chatTabIndex = 0"  class="lg:hidden text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : chatTabIndex === 0 && mobileTabIndex === 1}">Лента</p>
                    <p @click="mobileTabIndex = 1; chatTabIndex = 1" class="lg:hidden text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : chatTabIndex === 1 && mobileTabIndex === 1}">
                      <span>Чат</span>
                      <div v-if="unreadChat"
                           class="notifications__amount flex gap-2 ml-2">
                        <div
                            class="notifications__amount-chat flex justify-center items-center w-[25px] h-[25px] text-sm rounded-full bg-green-300">
                          {{ unreadChat }}
                        </div>
                      </div>
                    </p>
                  </div>
                </nav>

                <!--Главное-->
                <section
                    v-show="activeTab === 'home'"
                    class="home h-full overflow-y-auto overflow-x-hidden transition-all"
                    ref="home"
                >
                <Fieldset 
                  legend="Основные"
                  :pt="ptFieldsetDealModal"
                  :ptOptions="ptFieldsetOptions"
                  >
                  <div class="deal-main-form">
                    <!-- <h2 class="font-bold">Основные</h2> -->
                    <div class="grid lg:grid-cols-2 gap-2">
                      <div class="flex flex-col gap-2">
                        <IftaLabel :class="{'ring-1 ring-red-500 rounded-md':errorMessages && errorMessages.uid}">
                          <InputText
                              v-model="deal.uid"
                              aria-describedby="username-help"
                              class="w-full"
                          />
                          <label class="text-sm text-surface-400">ИД объекта</label>
                        </IftaLabel>
                      </div>
                      <div class="flex flex-col gap-2">
                        <IftaLabel>
                          <InputText
                              v-model="deal.created_at_frmt"
                              showIcon
                              iconDisplay="input"
                              id="created"
                              dateFormat="dd/mm/yy"
                              class="w-full"
                              disabled
                          />
                          <label class="text-sm text-surface-400">Дата создания</label>
                        </IftaLabel>
                      </div>
                      <div class="flex flex-col gap-2">
                        <IftaLabel>
                          <Select
                              class="v-select-custom w-full h-full"
                              v-model="deal.company_id"
                              id="company"
                              :options="pageCompanies"
                              optionValue="id"
                              optionLabel="name"
                          />
                          <label class="text-sm text-surface-400">Компания</label>
                        </IftaLabel>
                      </div>
                      <div class="flex flex-col gap-2">
                        <IftaLabel class="h-full">
                          <FormVSelect
                              class="v-select-custom w-full h-full"
                              v-model="deal.partner"
                              :options="pagePartners"
                              taggable
                              push-tags
                          >
                          </FormVSelect>
                          <label for="partner" class="text-sm text-surface-400">Партнерка</label>
                        </IftaLabel>
                      </div>
                      <div class="flex flex-col gap-2">
                        <FormDatePickerCustom
                          v-model="deal.date_start"
                          show-button-bar
                          id="changed"
                          :label="'Дата начала работ'"
                          :noMax="true"
                        >
                        </FormDatePickerCustom>                         
                        <!-- <IftaLabel>
                          <DatePicker
                              v-model="deal.date_start"
                              showIcon
                              iconDisplay="input"
                              id="changed"
                              class="w-full"
                              show-button-bar
                          >
                            <template #date="slotProps">
                              <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                            </template>
                          </DatePicker>
                          <label for="changed" class="text-sm text-surface-400">Дата начала работ</label>
                        </IftaLabel> -->
                      </div>
                      <div class="flex flex-col gap-2">
                        <FormDatePickerCustom
                          v-model="deal.date_end"
                          show-button-bar
                          id="changed"
                          :label="'Дата окончания работ'"
                          :noMax="true"
                        >
                        </FormDatePickerCustom>                        
                        <!-- <IftaLabel>
                          <DatePicker
                              v-model="deal.date_end"
                              showIcon
                              iconDisplay="input"
                              id="changed"
                              class="w-full"
                              show-button-bar
                          >
                            <template #date="slotProps">
                              <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
                            </template>
                          </DatePicker>
                          <label for="changed" class="text-sm text-surface-400">Дата окончания работ</label>
                        </IftaLabel> -->
                      </div>
                    </div>
                    <div class="flex flex-col gap-2 mt-2">
                      <IftaLabel class="h-full">
                        <FormVSelect
                            class="v-select-custom w-full h-full"
                            v-model="tagsArr"
                            :options="filteredTags"
                            :closeOnSelect="closeTagsSelectOptions"
                            ref="vueSelect"
                            multiple
                            taggable
                            push-tags
                            placeholder="Начните ввод и выберите из списка щелчком или кнопкой Enter"
                        >
                        </FormVSelect>
                        <label class="text-sm text-surface-400">Тэги</label>
                      </IftaLabel>
                    </div>
                  </div>
                </Fieldset>

                <Fieldset 
                  legend="Объект"
                  :pt="ptFieldsetDealModal"
                  :ptOptions="ptFieldsetOptions"
                  >
                    <!-- <h2 @click="setDealCoordinates" class="font-bold">Объект</h2> -->
                    <div class="grid lg:grid-cols-2 gap-2">
                      <div class="flex flex-col gap-2">
                        <IftaLabel>
                          <Select
                              v-model="deal.facility_type"
                              id="object-type"
                              placeholder="Выберите тип"
                              :options="facility_typeList"
                              optionValue="value"
                              optionLabel="label"
                              class="w-full"
                          />
                          <label for="object-type" class="text-sm text-surface-400">Тип недвижимости</label>
                        </IftaLabel>
                      </div>
                      <div class="flex flex-col gap-2">
                        <IftaLabel>
                          <Select
                              v-model="deal.facility_condition"
                              id="object-type"
                              placeholder="Выберите тип"
                              :options="facility_conditionList"
                              optionValue="value"
                              optionLabel="label"
                              class="w-full"
                          />
                          <label for="object-status" class="text-sm text-surface-400">Состояние недвижимости</label>
                        </IftaLabel>
                      </div>
                    </div>
                    <div class="mt-2 flex flex-col gap-2 relative">
                      <IftaLabel class="w-full">
                        <InputText
                            id="address"
                            v-model="addressQuery"
                            @input="getSuggestions"
                            @keydown.down.prevent="moveDown"
                            @keydown.up.prevent="moveUp"
                            @keydown.enter.prevent.stop="setAddress(suggestions[selectedIndex], deal, setDealCoordinates)"
                            placeholder="Начните ввод и выберите из списка"
                            class="w-full"
                        />
                        <label for="address" class="text-sm text-surface-400">Адрес</label>
                      </IftaLabel>
                      <ul v-show="suggestions.length"
                          class="dropdown-suggestions absolute top-[70px] bg-white dark:bg-surface-900 z-10 p-1 w-full gap-1 flex flex-col rounded-b-lg overflow-y-auto">
                        <li
                            v-for="(suggestion, index) in suggestions"
                            :key="index"
                            class="cursor-pointer  hover:bg-primary-400 hover:text-white text-sm p-1 rounded-[2px]"
                            :class="{ 'bg-primary-400 text-white': index === selectedIndex }"
                            @click.stop="setAddress(suggestion, deal, setDealCoordinates)"
                        >
                          {{ suggestion.value }}
                        </li>
                      </ul>
                    </div>
                    <!--v-if="deal.geo"-->
                    <div v-if="false" class="w-full h-full mt-2">
                      <yandex-map
                          v-model="map"
                          :settings="mapSettings"
                          width="100%"
                          height="250px"
                      >
                        <yandex-map-default-scheme-layer/>
                        <yandex-map-default-features-layer/>
                        <!--                                 mapSettings.location.center-->
                        <yandex-map-marker
                            v-model="clusterer"
                            :settings="marker"
                        >
                          <div
                              class="cursor-pointer relative  font-bold text-sm flex flex-col items-center justify-center">
                            <svg class="fill-red-600" width="30px" height="100%" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg" fill="none">
                              <path fill-rule="evenodd"
                                    d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                                    clip-rule="evenodd"/>
                            </svg>
                          </div>
                        </yandex-map-marker>
                      </yandex-map>
                    </div>
                </Fieldset>

                <Fieldset 
                  legend="Воронки и этапы"
                  :pt="ptFieldsetDealModal"
                  :ptOptions="ptFieldsetOptions"
                >
                    <div v-for="(pip, index) in addedPipelines" :key="index" class="flex flex-col gap-2">
                      <div v-if="index === 0" class="max-lg:hidden grid lg:grid-cols-2">
                        <div class="flex gap-1 items-center text-gray-400 justify-center">
                          <span class="pi pi-fw pi-table"></span>
                          <label for="pipeline" class="text-sm text-surface-400">Воронки</label>
                        </div>
                        <div class="flex gap-1 items-center text-gray-400 justify-center pr-6">
                          <span class="pi pi-fw pi-table"></span>
                          <label for="stage" class="text-sm text-surface-400">Этапы</label>
                        </div>
                      </div>

                      <div class="grid lg:grid-cols-[1fr_1fr_0.1fr] items-center mb-1">
                        <Select
                            v-model="pip.pipeline"
                            :options="pip.pipelines"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Выберите воронку"
                            @change="updatePipelineStages(pip)"
                            :disabled="pip.disabled"
                            class="min-w-full rounded-none h-full"
                        />

                        <Select
                            v-model="pip.stage"
                            :options="pip.stages"
                            @change="updateStageColor(pip)"
                            optionLabel="title"
                            optionValue="id"
                            placeholder="Выберите этап"
                            :pt="{list: '-px-2'}"
                            pt:label="dark:!text-surface-700"
                            :style="{ backgroundColor: pip.stageColor }"
                            :disabled="!pip.stages.length || pip.disabled"
                            class="min-w-full rounded-none h-full"
                        >
                          <template #option="slotProps">
                            <p :style="{ backgroundColor: slotProps.option.color}" class="py-2 px-1 -my-[5px] w-full dark:text-surface-700">
                              {{ slotProps.option.title }}</p>
                          </template>
                        </Select>

                        <button
                            @click="deleteDealPipeline(pip.pipeline)"
                            title="Удалить"
                            class="max-lg:hidden h-full p-2 bg-surface-400 flex items-center disabled:cursor-not-allowed"
                            :disabled="!pip.canRemove"
                        >
                          <span class="pi pi-trash pi-fw text-surface-200 text-xl"/>
                        </button>
                        <button v-show="pip.canRemove" @click="deleteDealPipeline(pip.pipeline)" class="max-lg:mx-auto lg:hidden py-2 px-8 bg-slate-400 w-32 mt-1">
                          <span class="pi pi-trash text-white  hover:text-red-400"></span>
                        </button>
                      </div>
                    </div>

                    <div class="flex justify-center">
                      <button
                          class="button-modal"
                          @click="addNewPipeline"
                      >
                        Добавить воронку
                      </button>
                    </div>
                </Fieldset>

                <deal-contacts
                  :addedContacts
                  :numberSuggestions
                  :namesSuggestions
                  :addNewContactStatus
                  :errorMessages
                  :contactErrors
                  @addNewContact="addNewContact"
                  @deleteContact="deleteContact"
                  @setContact="setContact"
                  @getNumberSuggestions="getNumberSuggestions"
                  @getNamesSuggestions="getNamesSuggestions"
                  @setNameSuggestion="setNameSuggestion"
                  @createNewContact="createNewContact"
                  @openContact="openContact"
                  class="px-2"
                />

                <Fieldset
                  v-if="false"
                  legend="Заказчик"
                  :pt="ptFieldsetDealModal"
                  :ptOptions="ptFieldsetOptions"
                  >

                  <div class="">
                    <!-- <h2 class="font-bold">Заказчик</h2> -->
                    <div class="grid lg:grid-cols-2 gap-2">
                      <div class="flex flex-col gap-2">
                        <Iftalabel>
                          <Select
                              v-model="deal.temperature"
                              id="object-type"
                              placeholder="Выберите тип"
                              :options="temperatureList"
                              optionValue="value"
                              optionLabel="label"
                              class="w-full"
                              pt:panel:class="!w-[210px] bg-white shadow-lg"
                          />
                          <label for="temperature" class="text-sm text-surface-400">Лояльность клиента</label>
                        </Iftalabel>
                      </div>
                      <div class="flex flex-col gap-2">
                        <Iftalabel>
                          <InputText
                              id="phone"
                              v-model="deal.lead_source"
                              aria-describedby="username-help"
                          />
                          <label for="lead_source" class="text-sm text-surface-400">Откуда узнали о нас</label>
                        </Iftalabel>
                      </div>
                    </div>
                  </div>

                </Fieldset>

                <Fieldset 
                  legend="Ответственные"
                  :pt="ptFieldsetDealModal"
                  :ptOptions="ptFieldsetOptions"
                  class="mb-4"
                  >
                    <div class="grid lg:grid-cols-2 gap-2">
                      <Iftalabel>
                        <Select
                            v-model="deal.responsible"
                            id="responsible_user"
                            :options="responsibleList"
                            filter
                            :virtualScrollerOptions="{itemSize: 38,}"
                            optionValue="id"
                            optionLabel="name"
                            placeholder="Выберите"
                            class="w-full"
                        />
                        <label for="responsible_user" class="text-sm text-surface-400">Ответственный</label>
                      </Iftalabel>
                      <!--  <Iftalabel>-->
                      <!--    <Select-->
                      <!--        v-model="deal.operator"-->
                      <!--        id="operator"-->
                      <!--        :options="operatorList"-->
                      <!--        filter-->
                      <!--        :virtualScrollerOptions="{itemSize: 38,}"-->
                      <!--        optionValue="id"-->
                      <!--        optionLabel="name"-->
                      <!--        placeholder="Выберите"-->
                      <!--        class="w-full"-->
                      <!--    />-->
                      <!--    <label for="operator" class="text-sm text-surface-400">КЦ1 ответственный за сделку</label>-->
                      <!--  </Iftalabel>-->

                      <!--  <Iftalabel>-->
                      <!--    <Select-->
                      <!--        v-model="deal.zamerman"-->
                      <!--        id="zamerman"-->
                      <!--        :options="zamermanList"-->
                      <!--        filter-->
                      <!--        :virtualScrollerOptions="{itemSize: 38,}"-->
                      <!--        optionValue="id"-->
                      <!--        optionLabel="name"-->
                      <!--        placeholder="Выберите"-->
                      <!--        class="w-full"-->
                      <!--    />-->
                      <!--    <label for="zamerman" class="text-sm text-surface-400">Замерщик</label>-->
                      <!--  </Iftalabel>-->

                      <!--  <Iftalabel>-->
                      <!--    <Select-->
                      <!--        v-model="deal.designer"-->
                      <!--        id="designer"-->
                      <!--        :options="designerList"-->
                      <!--        filter-->
                      <!--        :virtualScrollerOptions="{itemSize: 38,}"-->
                      <!--        optionValue="id"-->
                      <!--        optionLabel="name"-->
                      <!--        placeholder="Выберите"-->
                      <!--        class="w-full"-->
                      <!--    />-->
                      <!--    <label for="designer" class="text-sm text-surface-400">Дизайнер</label>-->
                      <!--  </Iftalabel>-->

                      <Iftalabel>
                        <Select
                            @beforeShow="getProrabs"
                            v-model="deal.prorab"
                            id="prorab"
                            :options="prorabList"
                            filter
                            :virtualScrollerOptions="{itemSize: 38,}"
                            optionValue="id"
                            optionLabel="name"
                            placeholder="Выберите"
                            class="w-full"
                        />
                        <label for="prorab" class="text-sm text-surface-400">Прораб</label>
                      </Iftalabel>
                    </div>
                </Fieldset>                  
<!--                  <div class="border-t-[1px] px-2 py-4">-->
<!--                    <div class="flex justify-between items-center">-->
<!--                      <h2 class="font-bold">Участники</h2>-->
<!--                      <div class="flex items-center gap-2">-->
<!--                        <button class="text-surface-400 text-[15px]">Покинуть</button>-->
<!--                        <i class="pi pi-info-circle text-xl cursor-pointer text-slate-600 dark:text-surface-100"-->
<!--                           @click="showLeftParticipantsPopover"></i>-->
<!--                      </div>-->
<!--                      <Popover ref="leftParticipantsPopover" class="bg-black">-->
<!--                        Нажимая на "покинуть", вы перестаните получать уведомления по этой сделке.-->
<!--                      </Popover>-->
<!--                    </div>-->
<!--                    <div class="flex items-center">-->
<!--                      <p class="text-surface-400">Отвественные:</p>-->
<!--                      <AvatarGroup class="ml-5">-->
<!--                        <template v-for="user in ['FFF', 'DDD', 'NNN']">-->
<!--                          <Avatar-->
<!--                              v-tooltip.bottom="user"-->
<!--                              :label="user"-->
<!--                              shape="circle"-->
<!--                              class="text-[10px] hover:z-50"-->
<!--                          />-->
<!--                        </template>-->
<!--                      </AvatarGroup>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="mb-2 border-y-[1px] px-2 py-4">-->
<!--                    <h2 class="font-bold">Финансы</h2>-->
<!--                    <div class="mt-2 grid lg:grid-cols-2 gap-4">-->
<!--                      <div class="flex flex-col gap-2">-->
<!--                        <Iftalabel>-->
<!--                          <InputText-->
<!--                              id="budget"-->
<!--                              v-model="deal.budget_sum"-->
<!--                              aria-describedby="username-help"-->
<!--                          />-->
<!--                          <label for="budget" class="text-sm text-surface-400">Бюджет заказчика</label>-->
<!--                        </Iftalabel>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->

                <Fieldset
                    v-if="false"
                  legend="Получить данные из:"
                  :pt="ptFieldsetDealModal"
                  :ptOptions="ptFieldsetOptions"
                  pt:root = "mb-2"
                  >

                  <div class="p-2 pt-0 relative">
                    <!-- <h2 class="font-bold">Получить данные из: </h2> -->
                    <div class="grid lg:grid-cols-2 gap-2">
                      <button @click="updateFromAMOSAB('AMO')" class="button-modal">AMO
                        CRM
                      </button>
                      <button @click="updateFromAMOSAB('SAB')" class="button-modal">SAB
                        CRM
                      </button>
                    </div>
                  </div>
                </Fieldset>

                </section>

                <!--Ремонт-->
                <section
                    v-if="activeTab === 'renovation' && !deal.type"
                    class="h-full overflow-y-auto overflow-x-hidden"
                >

                  <Fieldset
                    legend="Прайс-лист"
                    :pt="ptFieldsetDealModal"
                    :ptOptions="ptFieldsetOptions"
                    >
                      <div class="flex flex-col gap-2">
                        <div
                            v-if="deal.price"
                            @click="editPriceList(deal.price)"
                            class="custom-ifta-label-block border-[1px] flex items-center justify-between font-medium cursor-pointer list-none py-1.5 px-2 hover:bg-slate-200 dark:hover:bg-surface-950 border-surface-300 dark:border-surface-700"
                        >
                          <h2 class="font-semibold">
                            Прайс-лист от {{ formatDateStr(deal.price.created_at) }}
                          </h2>
                          <div>
                                <span
                                    title="Загрузить PDF"
                                    class="pi pi-file-pdf text-xl p-2 pr-4"
                                    @click.stop="downloadPDF('price', null, deal.id)"
                                />
                                <span title="Изменить" class="pi pi-pencil text-lg p-2"
                             />
                          </div>
                        </div>
                        <div class="flex items-center justify-center" v-if="!deal.price">
                          <button
                              @click="updatePriceList()"
                              class="button-modal my-1 py-2 px-3"
                          >
                            Сформировать прайс-лист
                          </button>
                        </div>
                      </div>
                  </Fieldset>

                  <Fieldset
                    legend="Сметы"
                    :pt="ptFieldsetDealModal"
                    :ptOptions="ptFieldsetOptions"
                    >

                      <div class="grid grid-cols-2 gap-2">
                        <Iftalabel>
                          <inputNumber id="coef" v-model="deal.coef" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>
                          <label for="coef" class="text-sm text-surface-400">Коэффициент</label>
                        </Iftalabel>
                        <IftaLabel>
                          <inputNumber v-model="deal.coef_additional_partner" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>
                          <label class="text-sm text-surface-400">Добавочный коэффициент партнёра</label>
                        </IftaLabel>
                        <IftaLabel>
                          <inputNumber v-model="deal.prepayment" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>
                          <label class="text-sm text-surface-400">Предоплата</label>
                        </IftaLabel>
                        <IftaLabel>
                            <label class="text-sm">Скидка</label>
                            <inputNumber
                                class="w-full"
                                v-model="deal.skidka"
                                :minFractionDigits="2" :maxFractionDigits="2"
                                :disabled="approvedSmeta"
                                min="0"
                                max="100"
                                @input="showDealSaveButton"
                            />
                          </IftaLabel>

                        <div class="flex flex-col gap-2">
                          <FormCheckbox
                            v-model="deal.deferred_discount"
                            :disabled="approvedSmeta ? true : false"
                            label="Отложенная скидка"
                          />
                        </div>
                        <div class="flex flex-col gap-2">
                          <FormCheckbox
                              v-model="deal.confirm_act"
                              label="Подтверждение акта сдачи-приемки"
                          />
                        </div>
                        <IftaLabel class="h-full">
                          <inputNumber v-model="deal.hold_master" :minFractionDigits="2" :maxFractionDigits="2" class="w-full h-full"/>
                          <label class="text-sm text-surface-400">Удержка мастера</label>
                        </IftaLabel>
                        <IftaLabel>
                          <inputNumber v-model="deal.forced_percent_master" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>
                          <label class="text-sm text-surface-400">Принудительный процент мастера</label>
                        </IftaLabel>
                        <IftaLabel>
                          <inputNumber v-model="deal.coef_price_master" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>
                          <label class="text-sm text-surface-400">Коэффициент для прайса мастера</label>
                        </IftaLabel>
                        <IftaLabel>
                          <inputNumber v-model="deal.increase_master" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>
                          <label class="text-sm text-surface-400">Увелечения для мастера (%)</label>
                        </IftaLabel>
                        <IftaLabel>
                          <inputNumber v-model="deal.forced_percent_prorab" :minFractionDigits="2" :maxFractionDigits="2" class="w-full"/>
                          <label class="text-sm text-surface-400">Принудительный процент прораба</label>
                        </IftaLabel>
                        <IftaLabel>
                          <InputText v-model="deal.deposit" class="w-full" readonly/>
                          <label class="text-sm text-surface-400">Депозит</label>
                        </IftaLabel>
                      </div>
                      <div v-if="deal.price" class="mt-2">
                        <div
                            v-for="(smeta, index) in smets"
                            :key="smeta.id"
                            class="border-[1px] mt-2 border-surface-300 dark:border-surface-700"
                            @click.stop="setActiveSmeta(smeta.id)"
                            title="Выбрать"
                        >
                          <div
                              class="custom-ifta-label-block gap-2 flex justify-between items-center font-medium cursor-pointer list-none py-1.5 px-2 text-slate-600 hover:bg-slate-200 dark:hover:bg-surface-950"
                              :class="{'bg-primary-500 text-white hover:!bg-primary-500 dark:hover:!bg-surface-950': activeEstimate.id === smeta.id}"
                          >
                            <p class="font-semibold dark:text-surface-200 ">Смета-{{index+1}}-{{deal.uid}}-Прораб
                              <!-- от {{ formatDateStr(smeta.created_at) }}-->
                              <!-- <span>({{getSmetWorksQuantity(smeta.rooms.works)}} работ на сумму {{getSmetWorksSum(smeta.rooms.works)}}руб.)</span>-->
                            </p>
                            <div class="flex gap-3 items-center">
                                  <span
                                      title="Подтверждена"
                                      v-show="smeta.approved"
                                      class="pi pi-check text-emerald-400 text-xl font-extrabold"
                                  />
                              <span
                                  class='pi pi-copy text-xl p-2'
                                  title="Копировать"
                                  @click.stop="copySmet(smeta)"
                              />
                              <span
                                  title="Загрузить PDF"
                                  class="pi pi-file-pdf text-xl p-2"
                                  @click.stop="downloadPDF('smet', smeta.id, deal.id)"
                              />
                              <span
                                  @click.stop="editSmeta(smeta)"
                                  title="Изменить"
                                  class="pi pi-pencil text-lg p-2"
                              />
                            </div>
                          </div>
                          <div v-show="activeEstimate.id === smeta.id" class="p-2 border-surface-300 dark:border-surface-700">
                            <p class="py-1 mt-1">Суммарные параметры по объекту</p>
                            <div class="grid grid-cols-4 text-emerald-600 bg-sky-100 p-1 my-1">
                              <p class="text-center">S пола</p>
                              <p class="text-center">S стен</p>
                              <p class="text-center">P пола</p>
                              <p class="text-center">P потолка</p>
                              <!-- <p class="text-center">Высота</p> -->
                            </div>
                            <div class="grid grid-cols-4 mb-1">
                              <p class="text-center">{{ activeSmetaValuesSum.floorSSum }}</p>
                              <p class="text-center">{{ activeSmetaValuesSum.wallsSSum }}</p>
                              <p class="text-center">{{ activeSmetaValuesSum.floorPSum }}</p>
                              <p class="text-center">{{ activeSmetaValuesSum.pSum }}</p>
                              <!-- <p class="text-center">{{ activeSmetaValuesSum.hSum }}</p> -->
                            </div>
                            <p class="text-sm ml-1">
                              Итого : {{ formatNumber( getSmetWorksSumWithoutDiscount(smeta.rooms.works, originalDeal.skidka, activeEstimate) ) || 0}} |
                              Скидка: {{ formatNumber( getSmetWorksSumWithoutDiscount(smeta.rooms.works, originalDeal.skidka, activeEstimate) - getSmetWorksSum(smeta.rooms.works, activeEstimate) ) || 0 }} |
                              Итого со скидкой: {{ formatNumber(getSmetWorksSum(smeta.rooms.works, activeEstimate)) || 0 }} руб.
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center justify-center gap-2">
                          <button
                              @click="createNewSmet"
                              v-if="!approvedSmeta"
                              class="mt-2 button-modal"
                          >
                            Добавить смету
                          </button>
                          <button
                              v-if="copiedSmeta && !smets.find(s => s.id === copiedSmeta.id) && !approvedSmeta"
                              @click="pasteCopiedSmeta"
                              class="mt-2 button-modal"
                          >
                            Вставить скопированную смету
                          </button>
                        </div>
                      </div>

                  </Fieldset>

                  <Fieldset
                    legend="Комнаты"
                    :pt="ptFieldsetDealModal"
                    :ptOptions="ptFieldsetOptions"
                    class="mb-2"
                    >
                    <div v-if="deal.price">
                        <div
                            @click.stop="openRoom(room)"
                            v-for="(room, index) in showFilteredRooms"
                            :key="index"
                            class="custom-ifta-label-block border w-full py-2 mb-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-surface-950 flex flex-col border-surface-300 dark:border-surface-700"
                        >
                          <div class="flex items-center justify-between py-1 px-2">
                            <span class="font-semibold uppercase">{{ room.name }}</span>
                            <input
                                :title="room.involved ? 'Участвует' : 'Не участвует'"
                                v-model="room.involved"
                                type="checkbox"
                                class="cursor-pointer w-5 h-5 text-slate-600 bg-gray-100 border-gray-300 rounded focus:ring-slate-500"
                                @click.stop="involveOrNot(room)"
                                :disabled="approvedSmeta"
                            />
                          </div>
                          <div class="grid grid-cols-5 text-emerald-600 bg-sky-100 p-1 my-1">
                            <p class="text-center">S пола</p>
                            <p class="text-center">S стен</p>
                            <p class="text-center">P пола</p>
                            <p class="text-center">P потолка</p>
                            <p class="text-center">Высота</p>
                          </div>
                          <div class="grid grid-cols-5 mb-1">
                            <p class="text-center">{{ Math.round(room.s_floor * 100) / 100 }}</p>
                            <p class="text-center">{{ Math.round(room.s_walls * 100) / 100 }}</p>
                            <p class="text-center">{{ Math.round(room.p_floor * 100) / 100 }}</p>
                            <p class="text-center">{{ Math.round(room.perimeter * 100) / 100 }}</p>
                            <p class="text-center">{{ Math.round(room.height * 100) / 100 }}</p>
                          </div>
                          <p class="text-sm ml-1">
                            Итого : {{ formatNumber(getRoomTotalWithoutDiscount(room.id)) || 0 }} |
                            Скидка: {{ formatNumber( (getRoomTotalWithoutDiscount(room.id) - getRoomWorksSum(room.id)) ) || 0 }} |
                            Итого со скидкой: {{ formatNumber( getRoomWorksSum(room.id) ) || 0}} руб.
                          </p>
                        </div>
                        <div class="flex items-center justify-center">
                          <button
                              v-show="!approvedSmeta"
                              @click="addNewRoom"
                              class="mt-2 button-modal"
                          >
                            Добавить комнату
                          </button>
                        </div>
                      </div>
                  </Fieldset>
                
                </section>

                <!--Акты-->
                <div v-if="activeTab === 'acts' && !approvedSmeta && !deal.type"
                     class="h-full text-center flex flex-col justify-center items-center">
                  <p class="text-center">Акты недоступны до подтверждения сметы</p>
                </div>
                <section v-if="activeTab === 'acts' && !deal.type && approvedSmeta"
                         class="h-full overflow-y-auto overflow-x-hidden">
                  <ActTable
                      :deal_id="deal.id"
                      :deal_uid="deal.uid"
                      :deferred_skidka_paid="deal.deferred_skidka_paid"
                      :skidka="deal.deferred_discount ? deal.skidka : false"
                      :actsList="actsList"
                      :actStatusList="lists.act_statuses"
                      :approvedSmeta="approvedSmeta"
                      @open-act="CreteOrOpenAct"
                      @download-pdf="downloadPDF"
                      @change-defferedSkidkaStatus="changeDefferedSkidkaPaidStatus"
                      ref="actTable"
                  />
                </section>
              </main>
            </TabPanel>
            <TabPanel v-if="!deal.type" header="Header II" :pt="{content: { class: 'overflow-hidden' }}">
              <div class="h-full overflow-hidden bg-modal-panel-bg">
                <!--навигация-->
                <nav class="modal-advanced-menu relative flex items-center border-b-2 text-surface-700 dark:text-surface-400 dark:border-surface-800 justify-between mx-2">
                  <div class="flex items-center gap-2 max-sm:gap-0">
                    <p @click="changeTab('home'); mobileTabIndex = 0" class="lg:hidden text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : activeTab === 'home' && mobileTabIndex === 0}">Инфо</p>
                    <p v-show="(!deal.type || deal.type !== 'emptyDeal')" @click="changeTab('renovation'); mobileTabIndex = 0" class="lg:hidden text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : activeTab === 'renovation' && mobileTabIndex === 0}">Сметы</p>
                    <p v-show="(!deal.type || deal.type !== 'emptyDeal')" @click="changeTab('acts'); mobileTabIndex = 0" class="lg:hidden text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : activeTab === 'acts' && mobileTabIndex === 0}">Акты</p>
                    <p @click="mobileTabIndex = 1; chatTabIndex = 0"  class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : chatTabIndex === 0}">Лента</p>
                    <p @click="mobileTabIndex = 1; chatTabIndex = 1" class="text-center px-2 py-3 font-medium border-surface-500 cursor-pointer" :class="{'border-b-2 -mb-[2px] text-surface-500 dark:text-surface-100 dark:border-surface-100' : chatTabIndex === 1}">
                      <span>Чат</span>
                      <div v-if="unreadChat"
                           class="notifications__amount flex gap-2 ml-2">
                        <div
                            class="notifications__amount-chat flex justify-center items-center w-[25px] h-[25px] text-sm rounded-full bg-green-300">
                          {{ unreadChat }}
                        </div>
                      </div>
                    </p>
                  </div>
                </nav>
                <TabView v-model:activeIndex="chatTabIndex" :pt="ptTabViewChatPreset" pt:panelcontainer="bg-white dark:bg-modal-panel-bg">
                  <TabPanel header="Header I" class="" pt:content="">
                    <!-- v-if="chatTabIndex == 0" -->
                    <CommonFeed
                        :deal_id="`${deal.id}`"
                        :fieldsFromDeal="fields"
                        :usersFromDeal="responsibleList"
                        :typesFromDeal="taskTypes"
                        :pipelinesFromDeal="pipelines"
                        :isActive = "chatTabIndex == 0"
                        v-show="true"
                        class="overflow-hidden h-full border-b-[1px] border-t-0 border-x-0 box-border bg-white"
                    >
                    </CommonFeed>
                  </TabPanel>
                  <TabPanel header="Header III" class="" pt:content="">
                    <!-- v-if="chatTabIndex == 1" -->
                    <CommonChatWork
                        type="deal"
                        :deal="deal.id"
                        :contacts="chatContacts"
                        :room="`deal__${deal.id}`"
                        :isUnreadOpenTab="isUnreadOpenTabChat"
                        :isActive = "chatTabIndex == 1"
                        v-show="true"
                        class="overflow-hidden h-full border-b-[1px] border-t-0 border-x-0 box-border bg-white"
                    >
                    </CommonChatWork>
                  </TabPanel>
                </TabView>
              </div>
            </TabPanel>
          </TabView>


        </section>

        <!--Раздел комнаты-->
        <section
            v-if="activeWindow === 'Room'"
            class="h-full ease-in-out transition"
            :class="{
                'slide-up-enter-active': activeWindow === 'Room',
                'slide-up-leave-active': activeWindow === 'Deals',
              }"
        >
          <section class="flex items-center justify-between shrink-0 px-4 py-[3.5px] border-t-[1px] border-modal-body-bg bg-modal-header text-white">
            <h2>{{ roomComponentTitle }} комнаты</h2>
            <div>
              <button
                  v-show="roomChanged"
                  @click="saveRoomState"
                  class="absolute top-0 right-[65px] py-1 px-2 h-[40px] bg-emerald-500 hover:bg-emerald-700 text-white border-0 text-base flex items-center justify-center"
              >
<!--                <i class="pi pi-check-circle mr-1"></i>-->
                <p>Сохранить</p>
              </button>
              <button
                  @click="changeWindow('Deals')"
                  class="relative flex items-center justify-center mr-2 last:mr-0 w-8 h-8 border-0 rounded-full text-white bg-transparent transition duration-200 ease-in-out hover:text-slate-500 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus:outline-offset-0 focus:ring focus:ring-inset focus:ring-primary-400 overflow-hidden"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </section>
          <RoomFull
              @selectedWorksChanged="selectedWorksChanged"
              @room-changed="setRoomChanged"
              @close-window="changeWindow('Deals')"
              @update-rooms="updateSmetRooms"
              :room="currentRoom"
              :allRoomsList="showFilteredRooms"
              :selectedWorks="selectedWorks"
              :worksCollectionData="worksCollectionData"
              :worksList="worksList"
              :group="group"
              :category="category"
              :disableEdit="approvedSmeta"
              :roomSettings="roomSettings"
              :factorList="factorList"
              ref="roomFull"
              class="h-[calc(100%-40px)]"
          />
        </section>

        <!--Раздел акта-->
        <section
            class="h-full ease-in-out transition"
            v-if="activeWindow === 'Act'"
            :class="{
                'slide-up-enter-active': activeWindow === 'Act',
                'slide-up-leave-active': activeWindow === 'Deals',
              }"
        >
          <section
              class="flex items-center justify-between shrink-0 px-4 py-[7.5px] border-t-[1px] bg-modal-header dark:border-surface-900 text-white"
          >
            <h2 class="text-lg">{{ actComponentTitle }} акта</h2>
            <div>
              <button
                  @click="saveActState"
                  v-show="actChanged"
                  class="absolute top-0 right-[65px] py-1 px-2 h-[50px] bg-emerald-500 hover:bg-emerald-700 text-white border-0 text-base flex items-center justify-center p-1"
              >
<!--                <i class="pi pi-check-circle mr-1"></i>-->
                <p>Сохранить</p>
              </button>
              <button
                  @click="changeWindow('Deals')"
                  class="relative flex items-center justify-center mr-2 last:mr-0 w-8 h-8 border-0 rounded-full text-white bg-transparent transition duration-200 ease-in-out hover:text-slate-500 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus:outline-offset-0 focus:ring focus:ring-inset focus:ring-primary-400 overflow-hidden"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </section>
          <ActFull
              ref="actFull"
              class="h-[calc(100%-var(--modal-header-height))]"
              :rawAct="currentAct"
              :actsList="actsList"
              :approvedSmeta="approvedSmetaForAct"
              :rooms="roomsForAct"
              :worksList="worksList"
              :group="group"
              :category="category"
              :factorList="factorList"
              :actStatusList="lists.act_statuses"
              @act-changed="setActChanged"
              @close-window="changeWindow('Deals')"
          />
        </section>
      </section>
    </div>
  </div>
</template>

<style>

.modal-default-button {
  float: right;
}

/* Анимация модалки комнат */
.slide-up-enter-active {
  animation: slideUp 0.3s ease-out;
}

.slide-up-leave-active {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}
.v-select-custom .vs__dropdown-toggle {
  height: 100%;
  /* padding: 12px 5px 5px !important; */
  border-color: #cbd5e1;
}


.dark .v-select-custom .vs__dropdown-toggle {
  border-color: var(--p-surface-700);
}


.custom-discount_input {
  padding: 2px 4px;
}

.p-inputnumber-input {
  max-width: 100%;
}


/* .field-tall .p-inputtext {
  padding-top: 36px;
} */

</style>
