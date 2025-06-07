<script setup>
import ContactFull from "~/components/Lists/Contacts/ContactFull.vue";
import UserFull from "~/components/Lists/Users/UserFull.vue";
import WorkFull from "~/components/Lists/Works/WorkFull.vue";
import CollectionsFull from "~/components/Lists/Works/CollectionsFull.vue";
import DealModal from "~/components/Deals/DealModal.vue";
import CompanyFull from "~/components/Lists/Companies/CompanyFull.vue";
import HistoryModal from "~/components/Common/HistoryModal.vue";
import PDFWrapper from "~/components/Common/PDFWrapper.vue";
import {useDialog} from "primevue/usedialog";
import {useMainStore} from "~/stores/main.js";
import ptDialog from "assets/presets/custom/modalPreset.js";
import ddsFull from "~/components/Dds/ddsFull.vue";
import salaryFull from "~/components/Salary/salaryFull.vue";
import deductionFull from "~/components/Deductions/deductionFull.vue";

const dialog = useDialog();
const store = useMainStore();
const props = defineProps(['showModalsFromHistory'])
const emit = defineEmits(['showModalsFromHistory']);
const activeModal = computed(() => store.getActiveModal)
const showModalsFromHistory = computed(() => store.showModalsFromHistory)

const modalComponents = {
  contact: ContactFull,
  company: CompanyFull,
  user: UserFull,
  work: WorkFull,
  collection: CollectionsFull,

  deal: DealModal,

  pdf: PDFWrapper,
  dds: ddsFull,

  salary: salaryFull,
  deduction: deductionFull,
};

watch(activeModal, (newValue) => {
  if(newValue){
    openListModal( JSON.parse(JSON.stringify(newValue)), false )
    // Открывается модалка, кнопку истории модалок переместим назад
    // const historyShowButton = document.querySelector('.show-modals-history_button')
    // historyShowButton.style.zIndex = 0
  }
})

watch(showModalsFromHistory, (newValue) => {
  if(newValue){
    const historyModals = store.getModalsHistoryList
    // Поднимаем свораченных модалок и добавим модалки из истории
    addModalFromHistoryToDom(historyModals, openHistoryModalComponent)
  }
  else { // Когда скрывается контейнер
    // Спускаем свернутые обратно вниз
    raiseLowerCollapsedModals()
    // удаляем все модалки истории из DOM
    removeHistoryModalsFromDom()

  }
})

onMounted(() => {
  window.addEventListener("beforeunload", saveCollapsedModalsBeforeReload);

  if(activeModal.value){
    const pathname = window.location.pathname.split('/')
    // Если открыта отдельная страница, то не будем открывать модалки
    if(pathname.length > 2){
      return;
    }
    // Открываем последнюю модалку
    activeModal.value.collapsed = true
    openListModal( JSON.parse(JSON.stringify(activeModal.value)) )
  }
  store.setModalsFromHistoryViewState(false) // Закрываю историю при переходе, чтобы кнопка в воздухе не висела
  // store.getListModals.forEach((modal, index) => { // Открываем 5 модалок после перезагрузки
  //   openListModal( JSON.parse(JSON.stringify(modal)) )
  //   setTimeout(() => onModalCollapse(modal.modalData.id, true, modal.modalTitle) )
  // })
})

const openListModal = (modal, isCollapsed=true) => {
  modal.modalData.isCollapsed = isCollapsed
  let dialogRef = null;

  dialogRef = dialog.open(modalComponents[modal.modalTitle], {
    props: {
      draggable: false,
      modal: false,
      pt: {
        ...ptDialog,
        mask: {
          ...ptDialog?.mask, // Сохранение текущих настроек
          class: `${ptDialog?.mask?.class || ''} ${modal.modalTitle}-${modal.modalData.id}-dialog ${isCollapsed ? 'translate-y-[calc(100%-40px)] custom-collapsed-modals' : null}`.trim() // Добавление кастомного класса
        }
      },
      appendTo: document.querySelector('.dialogs-container'),
      showHeader: false,
    },
    data: {
      modalData: modal.modalData
    },
    emits: {
      onCollapse: (newValue) => {
        onModalCollapse(newValue.id, newValue.value, newValue.objectName)
        store.setModalsFromHistoryViewState(false) // Когда разворачивается обычная модалка, скрываем модалки из истории
      },
      onClose: (newValue) => {
        // Если при закрытии свернутой модалки, показываются модалки из истории, то сразу закрытую модалку добавляем сверху них
        if(store.showModalsFromHistory){
          const closedModal = {
            modalData: {
              id: newValue.id,
            },
            modalTitle: newValue.objectName,
            date: formatDateTimeStr(new Date())
          }
          openHistoryModalComponent(closedModal) // Добавляю в компонент истории модалок только что закрытую модалку
          setTimeout(() => {
            updateHistoryModalsPositions()
          },100)
        }
        setTimeout(() => updateCollapsedModalsPositions(newValue.id, newValue.objectName))
      }

    }
  });
}

const saveCollapsedModalsBeforeReload = () => {
  // Сохраняю модалки, которые были открыты до перезагрузки
  const components = ['contact', 'company', 'user', 'work', 'collection', 'deal', 'dds', 'salary', 'deduction'];
  const collapsedModals = Array.from(document.querySelectorAll('.custom-collapsed-modals'));
  const closedTime = formatDateTimeStr(new Date());

  collapsedModals.forEach(modal => {
    const modalClass = Array.from(modal.classList).find(cls =>
        components.some(component => cls.startsWith(component + '-'))
    );

    if (modalClass) {
      const [component, id] = modalClass.split('-');
      store.addToModalsHistoryList({ modalData: { id }, modalTitle: component, date: closedTime });
    }
  });
};

const openHistoryModalComponent = (modal, isCollapsed = true) => {
   if(modal) {
    modal.modalData.isCollapsed = true
    let dialogRef = null;
    dialogRef = dialog.open(HistoryModal, {
      props: {
        draggable: false,
        modal: false,
        pt: {
          ...ptDialog,
          mask: {
            ...ptDialog?.mask, // Сохранение текущих настроек
            class: `${ptDialog?.mask?.class || ''} history-${modal.modalTitle}-${modal.modalData.id}-dialog ${isCollapsed ? 'translate-y-[calc(100%-40px)] custom-history-collapsed-modals' : ''}`.trim() // Добавление кастомного класса
          }
        },
        appendTo: document.querySelector('.dialogs-container'),
        showHeader: false,
      },
      data:{
        modal: JSON.parse(JSON.stringify(modal))
      }
    })
  }
}

onBeforeUnmount(saveCollapsedModalsBeforeReload);

onUnmounted(() => {
  window.removeEventListener("beforeunload", saveCollapsedModalsBeforeReload);
});
</script>

<template>
  <section class="dialogs-container h-full w-full">
    <DynamicDialog/>
  </section>
</template>