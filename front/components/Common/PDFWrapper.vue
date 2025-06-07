<script setup>
import ModalHeader from "~/components/Common/ModalHeader.vue";
import {useMainStore} from "~/stores/main.js";
import {formatDateTimeStr} from "~/utils/date-functions.js";

const {$showErrorToast, $api} = useNuxtApp()
const route = useRoute()
const router = useRouter()
const dialogRef = inject('dialogRef');
const store = useMainStore();
const emit = defineEmits(['close', 'collapse', ]);

const pdfOriginal = ref(dialogRef ? dialogRef.value.data.modalData : {});
const pdfData = ref(pdfOriginal.value ? JSON.parse(JSON.stringify(pdfOriginal.value)) : null);
const collapsed = ref(false)
if(pdfData.value?.isCollapsed){
  collapsed.value = true;
}
const currentPage = ref(window.location.href)

onMounted(() => {
  getPDFDocument();
  setIsMobile();
  window.addEventListener('resize', setIsMobile);
})

onBeforeUnmount(() => {
  if (pdfData.value?.href) {
    URL.revokeObjectURL(pdfData.value.href);
  }
});

const getPDFDocument = async() => {
  if(!collapsed.value) store.showModalLoader();
  let documentHref = pdfData.value.path;
  if(!documentHref){
    documentHref = urlToPath(route.params.id)
  }

  try {
    const response = await $api.get(documentHref, {
      responseType: 'blob', // ожидаем Blob (PDF)
      headers: {
        Accept: 'application/pdf', // принимаем только PDF
        Token: 'assdfadsafsadf'
      }
    });

    pdfData.value.href = URL.createObjectURL(response)
  } catch (error) {
    console.error('Не удалось загрузить PDF:', error);
    $showErrorToast('Не удалось загрузить PDF');
    const removedModal = {
      modalData : {id: pdfData.value?.id},
      modalTitle: 'pdf',
      date: formatDateTimeStr(new Date()),
    }
    store.removeModalFromList(removedModal)
    dialogRef?.value.close()
    const oldUrl = window.location.href;
    window.history.pushState(oldUrl, '', currentPage.value)
  } finally {
    store.hideModalLoader()
  }
}

const urlToPath = (urlString) => {
  const parts = urlString.split('-'); // Разделяем строку по дефисам
  const dealId = parts[1]; // "28"
  const value = parts[3];  // "price"
  const itemId = parts[4] || undefined; // Если есть пятая часть, используем её как Id сметы или акта

  return `/deals/${dealId}/pdf/${value}${itemId ? `/${itemId}` : ''}`;
}
// Управление состоянием модалки
const closeModal = () => {
  const removedModal = {
    modalData : pdfData.value,
    modalTitle: 'pdf',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: pdfData.value.id, objectName: 'pdf'});
  dialogRef?.value.close();
};

const collapseModal = (value) => {
  emit("collapse", { id: pdfData.value.id, value,  objectName: 'pdf'});
  if(value){ // Задержка перед скрытием содержимого модалки
    setTimeout(() =>{
      collapsed.value = value;
    }, 100)
  } else {
    collapsed.value = value;
  }
};

const unCollapseModal = (event) => {
  const target = event.target.closest("button");  // Проверяем, клик был ли сделан по кнопке
  if (!target) {
    collapseModal(false);
  }
};
const isMobile = ref(false);
const setIsMobile = () => {
  if (document.documentElement.clientWidth < 1024) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
}

</script>

<template>
  <div class="h-full">
    <modal-header
        :id="pdfData?.id"
        :title="'Документ'"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="false"
        :saveText="''"
        page="documents"
        icon="/images/filetypes/file.svg"
        backLink="/deals"
        @save=""
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <main class="flex items-center justify-center h-[calc(100%-48px)] bg-gray-200 dark:bg-surface-900">
      <div v-show="pdfData && pdfData.href && !collapsed" class="h-full w-full">
        <div 
          v-if="isMobile"
          class="h-full w-full flex flex-col items-center justify-center">
          <img 
            width="80" 
            height="80"
            :src="`/images/filetypes/pdf.svg`"
            alt="file"
            class="mb-2"
          >
          <div>{{}}</div>
          <a            
            class="button-modal"
            :href="pdfData && pdfData.href"
            download
          >
            Скачать PDF
          </a>
        </div>
        <iframe 
          v-if="!isMobile"
          :src="pdfData.href" 
          type="application/pdf" 
          width="100%" 
          height="100%"
          >
        </iframe>
               
      </div>
<!--        <p><b>Упс! Кажется, PDF-файл не отобразился.</b> Попробуйте открыть его <a :href="pdfData.href">так</a>.</p>-->
    </main>
  </div>
</template>
