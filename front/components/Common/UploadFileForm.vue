<template>
  <div
    v-if="isShow"
    class="entity-feed-form-wrapper">
    <div class="entity-feed-form relative p-[10px] bg-white dark:bg-surface-600 rounded">
      <div class="relative">
        <div class="entity-feed-form__header mb-[10px] leading-[130%] font-semibold text-surface-700  dark:text-surface-100">Файлы</div>
        <div @click="onClickCloseButton"
          class="group entity-feed-form__close absolute top-0 right-0 text-[#92a3b4] cursor-pointer">
          <svg width="20"
            height="20"
            class="text-[#92a3b4] group-hover:text-[#343f4a] dark:group-hover:text-surface-100">
            <use xlink:href="/images/sprite.svg#close" />
          </svg>
        </div>
      <FileUpload
        :maxFileSize="210000000"
        multiple
        @select="onSelect"
        :pt="ptFileUpload"
        ref="fileUploadComp"
        invalidFileSizeMessage="Размер файла не должен превышать лимит 200 Мб"
      >
        <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
            <div
              ref="fileUploadHeader" class="hidden" @click.stop="chooseCallback();"></div>
        </template>
        <template #content="{ files, uploadedFiles, uploadCallback, removeUploadedFileCallback, removeFileCallback, messages }"
        >
        <Message v-for="message of messages" :key="message" :class="{ 'mb-8': !files.length && !uploadedFiles.length}" severity="error">
                {{ message }}
        </Message>

        <div class="text-[15px] leading-[130%] w-full p-[1rem]"
              @click.stop="onFileUploadContentClick($refs.fileUploadHeader);">
                <b>Перетащите сюда файлы, либо нажмите на поле</b>
                <div>Размер файла не должен превышать лимит 200 Мб</div>
          </div>
          <div v-if="files.length > 0">
            <div>
              <div class="flex flex-wrap mt-4 p-0 gap-[5px]">
                  <div v-for="(file, index) of files" :key="setFileName(file.name) + file.type + file.size"
                  :data-tippy-content="setFileName(file.name) + '<div>Размер: ' + Math.ceil(file.size/1000) + ' Кб</div>'"
                  :data-name="setFileName(file.name)"
                  class="relative flex flex-col h-auto w-[100px] px-1 bg-[#f0f2f5] dark:bg-surface-600 items-center rounded-[3px] overflow-hidden">

                    <div class="h-[70px]">
                      <img  v-if="file.type.startsWith('image')" role="presentation" :alt="setFileName(file.name)" :src="file.objectURL" width="100" height="50" class="w-full h-full object-contain"/>
                      <div v-if="!file.type.startsWith('image')">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="70"
                          viewBox="0 0 100 100"
                        >
                        <path
                          d="M 34.179688 10.164062 C 32.103687 10.164062 30.615234 11.426266 30.615234 13.697266 L 30.648438 25.806641 C 30.648438 28.846641 32.770234 30.712891 35.615234 30.712891 C 38.460234 30.712891 40.615234 29.002891 40.615234 25.962891 L 40.615234 14.306641 L 39.613281 14.306641 L 39.523438 25.869141 C 39.523438 28.079141 37.599438 29.808594 35.648438 29.808594 C 33.697437 29.808594 31.615234 28.049844 31.615234 25.839844 L 31.644531 13.611328 C 31.644531 12.304328 33.077484 11.126953 34.271484 11.126953 C 35.465484 11.126953 36.615234 12.275031 36.615234 13.582031 L 36.615234 24.056641 C 36.615234 24.056641 36.139813 25.056641 35.632812 25.056641 C 35.125812 25.056641 34.486234 24.700391 34.615234 24.150391 L 34.615234 14.308594 L 33.615234 14.308594 L 33.582031 23.964844 C 33.582031 25.344844 34.32225 25.964844 35.65625 25.964844 C 36.99025 25.964844 37.615234 25.249141 37.615234 23.869141 L 37.615234 13.664062 C 37.615234 11.393062 36.255687 10.164062 34.179688 10.164062 z M 41.613281 11.306641 C 41.061281 11.306641 40.613281 11.754641 40.613281 12.306641 C 40.613281 12.858641 41.061281 13.306641 41.613281 13.306641 L 59.613281 13.306641 L 59.613281 23.792969 C 59.613281 29.039969 63.881906 33.306641 69.128906 33.306641 L 79.613281 33.306641 L 79.613281 82.574219 C 79.613281 86.837219 76.146812 90.306641 71.882812 90.306641 L 28.347656 90.306641 C 24.084656 90.306641 20.615234 86.838219 20.615234 82.574219 L 20.615234 21.039062 C 20.615234 16.776063 24.083656 13.308594 28.347656 13.308594 L 29.615234 13.308594 C 30.167234 13.308594 30.615234 12.860594 30.615234 12.308594 C 30.615234 11.756594 30.167234 11.308594 29.615234 11.308594 L 28.347656 11.308594 C 22.981656 11.308594 18.615234 15.672062 18.615234 21.039062 L 18.615234 82.574219 C 18.615234 87.940219 22.980656 92.306641 28.347656 92.306641 L 71.882812 92.306641 C 77.248812 92.306641 81.613281 87.940219 81.613281 82.574219 L 81.613281 32.554688 C 81.613281 32.289688 81.508313 32.035656 81.320312 31.847656 L 61.072266 11.599609 C 60.885266 11.411609 60.630234 11.306641 60.365234 11.306641 L 41.613281 11.306641 z M 60.613281 13.966797 L 78.951172 32.306641 L 69.128906 32.306641 C 64.433906 32.306641 60.613281 28.487969 60.613281 23.792969 L 60.613281 13.966797 z M 28.371094 19.505859 C 28.245219 19.481734 28.110094 19.505984 27.996094 19.583984 C 25.878094 21.023984 24.613281 23.406078 24.613281 25.955078 L 24.613281 78.617188 C 24.613281 82.856187 28.048484 86.306641 32.271484 86.306641 L 67.955078 86.306641 C 72.178078 86.306641 75.613234 82.856188 75.615234 78.617188 L 75.615234 60.806641 C 75.615234 60.530641 75.391234 60.306641 75.115234 60.306641 C 74.839234 60.306641 74.615234 60.530641 74.615234 60.806641 L 74.615234 78.617188 C 74.615234 82.305187 71.628031 85.306641 67.957031 85.306641 L 32.273438 85.306641 C 28.602438 85.306641 25.615234 82.305188 25.615234 78.617188 L 25.615234 25.955078 C 25.615234 23.737078 26.714594 21.664156 28.558594 20.410156 C 28.786594 20.255156 28.846406 19.945797 28.691406 19.716797 C 28.613906 19.603297 28.496969 19.529984 28.371094 19.505859 z M 75.113281 47.306641 C 74.837281 47.306641 74.613281 47.530641 74.613281 47.806641 L 74.613281 50.806641 C 74.613281 51.082641 74.837281 51.306641 75.113281 51.306641 C 75.390281 51.306641 75.613281 51.082641 75.613281 50.806641 L 75.613281 47.806641 C 75.613281 47.530641 75.389281 47.306641 75.113281 47.306641 z M 30.113281 51.306641 C 29.837281 51.306641 29.613281 51.530641 29.613281 51.806641 C 29.613281 52.082641 29.837281 52.306641 30.113281 52.306641 L 53.113281 52.306641 C 53.390281 52.306641 53.613281 52.082641 53.613281 51.806641 C 53.613281 51.530641 53.389281 51.306641 53.113281 51.306641 L 30.113281 51.306641 z M 75.113281 52.306641 C 74.837281 52.306641 74.613281 52.530641 74.613281 52.806641 L 74.613281 58.806641 C 74.613281 59.082641 74.837281 59.306641 75.113281 59.306641 C 75.390281 59.306641 75.613281 59.082641 75.613281 58.806641 L 75.613281 52.806641 C 75.613281 52.530641 75.389281 52.306641 75.113281 52.306641 z M 30.113281 58.306641 C 29.837281 58.306641 29.613281 58.530641 29.613281 58.806641 C 29.613281 59.082641 29.837281 59.306641 30.113281 59.306641 L 44.113281 59.306641 C 44.390281 59.306641 44.613281 59.082641 44.613281 58.806641 C 44.613281 58.530641 44.389281 58.306641 44.113281 58.306641 L 30.113281 58.306641 z M 46.113281 58.306641 C 45.837281 58.306641 45.613281 58.530641 45.613281 58.806641 C 45.613281 59.082641 45.837281 59.306641 46.113281 59.306641 L 70.113281 59.306641 C 70.390281 59.306641 70.613281 59.082641 70.613281 58.806641 C 70.613281 58.530641 70.389281 58.306641 70.113281 58.306641 L 46.113281 58.306641 z M 30.113281 65.306641 C 29.837281 65.306641 29.613281 65.530641 29.613281 65.806641 C 29.613281 66.082641 29.837281 66.306641 30.113281 66.306641 L 48.113281 66.306641 C 48.390281 66.306641 48.613281 66.082641 48.613281 65.806641 C 48.613281 65.530641 48.389281 65.306641 48.113281 65.306641 L 30.113281 65.306641 z M 50.113281 65.306641 C 49.837281 65.306641 49.613281 65.530641 49.613281 65.806641 C 49.613281 66.082641 49.837281 66.306641 50.113281 66.306641 L 61.113281 66.306641 C 61.390281 66.306641 61.613281 66.082641 61.613281 65.806641 C 61.613281 65.530641 61.389281 65.306641 61.113281 65.306641 L 50.113281 65.306641 z M 63.113281 65.306641 C 62.837281 65.306641 62.613281 65.530641 62.613281 65.806641 C 62.613281 66.082641 62.837281 66.306641 63.113281 66.306641 L 71.113281 66.306641 C 71.390281 66.306641 71.613281 66.082641 71.613281 65.806641 C 71.613281 65.530641 71.389281 65.306641 71.113281 65.306641 L 63.113281 65.306641 z M 30.113281 72.306641 C 29.837281 72.306641 29.613281 72.530641 29.613281 72.806641 C 29.613281 73.082641 29.837281 73.306641 30.113281 73.306641 L 54.113281 73.306641 C 54.390281 73.306641 54.613281 73.082641 54.613281 72.806641 C 54.613281 72.530641 54.389281 72.306641 54.113281 72.306641 L 30.113281 72.306641 z M 57.113281 72.306641 C 56.837281 72.306641 56.613281 72.530641 56.613281 72.806641 C 56.613281 73.082641 56.837281 73.306641 57.113281 73.306641 L 70.113281 73.306641 C 70.390281 73.306641 70.613281 73.082641 70.613281 72.806641 C 70.613281 72.530641 70.389281 72.306641 70.113281 72.306641 L 57.113281 72.306641 z"
                        ></path>
                        </svg>
                      </div>
                    </div>
                    <span class="max-w-full text-ellipsis overflow-hidden text-xs h-[3rem]">{{ file.name }}</span>
                    <div class="absolute top-1 right-1 w-6 h-6 flex items-start justify-center">
                      <button
                        @click.stop="removeFileCallback(index)"
                        class="flex items-center justify-center w-6 h-6 mt-auto shrink-0 rounded-[50%] bg-surface-300 hover:bg-[#ffffffb2] hover:text-[#26292b]"
                        v-if="!isFileLoading && !isFileLoadingMin"
                        >
                        <svg
                          width="16"
                          height="16"
                          class="text-[#66727e]">
                          <use xlink:href="/images/sprite.svg#close" />
                        </svg>
                      </button>
                      <ProgressSpinner v-if="isFileLoading || isFileLoadingMin"
                      strokeWidth="8" animationDuration=".6s" class="w-4 h-4"/>
                    </div>
                  </div>
              </div>
            </div>

            <div class="entity-feed-form__submit mt-[10px]">
              <button @click.stop="uploadFilesClick(files)"
                class="button-modal"
                :class="files.length > 0 ? '' : ''">
                <div class="button__inner">
                  <div class="button__title">Отправить</div>
                </div>
              </button>
            </div>
          </div>
        </template>
      </FileUpload>

      </div>
    </div>
  </div>
</template>

<script setup>
    import { onMounted, ref, nextTick } from "vue";
    import { uploadFile } from '@/services/api/chatWorkServices.js';
    import ptFileUpload from "@/assets/presets/custom/ptFileUpload.js";
    import tippy from 'tippy.js';
    import 'tippy.js/dist/tippy.css';
    const { $showErrorToast } = useNuxtApp()


    const props = defineProps({
      isShow: Boolean,
      dealId: String,
      uploadRoute: String,
      room: String,
      selectedPhone: String
    });

    const emit = defineEmits(['close','filesUploaded', 'select']);

    const fileUploadComp = ref(null);

    const { $api } = useNuxtApp();

    defineExpose({
      fileUploadComp
    });

    const onClickCloseButton = () => {
      emit('close');
    }

    const onFileUploadContentClick = (el) => {
      el.dispatchEvent(new Event('click',{ bubbles: true }));
    }

    const isFileLoading = ref(false);
    const isFileLoadingMin = ref(false);

    const uploadFilesClick = async (files) => {
      if (files.length > 0) {
        isFileLoading.value = true;
        await Promise.all([uploadAllFiles(files),waitLoadingMin()]);
        isFileLoading.value = false;
        emit('close');
      }
    }

    const waitLoadingMin = async () => {
      await new Promise((resolve, reject) => {
        setTimeout(
          () => {
            isFileLoadingMin.value = false; 
            resolve();
         }, 1000);
      });
    }

    const uploadAllFiles = async (files) => {
      await new Promise(async (resolve, reject) => {
        if (files.length > 0) {
          for (let file of files) {
            let response = await uploadFile(file, {
              uploadRoute: props.uploadRoute,
              dealId: props.dealId,
              room: props.room,
              selectedPhone: props.selectedPhone
            });
            if (!response) {
              $showErrorToast(`Файл ${file.name} не был загружен`)
            }
           }
        }
        resolve();
      });
    }

    // const uploadFile = async (file) => {

    //       await new Promise((resolve, reject) => {
    //         let formData = new FormData();
    //         formData.append("file", file);
    //         formData.append("deal_id", props.dealId);
    //         formData.append("room", props.room);
    //         if (props.selectedPhone) {
    //           formData.append("phone", props.selectedPhone);
    //         }
    //         console.log('[UploadFileForm] uploadFile formData', file, formData);

    //         $api.post(props.uploadRoute, formData).then(
    //           () => {
    //             console.log('[UploadFileForm] uploadFile OK');
    //             emit('filesUploaded');
    //             resolve();
    //           },
    //           (error) => {
    //             console.log('[UploadFileForm] uploadFile error' ,error);
    //             resolve();
    //           }
    //         );
    //       });
    // }

    const onSelect = async (event) => {
      for (let file of event.files) {
        let el;
        await nextTick();
        if (el = document.querySelector(`[data-name='${setFileName(file.name)}']`)) {
          tippy(el,{
            allowHTML: true,
          });
        }
      }
      emit('select');
    }

    const setFileName = (name) => {
      return name.replace(/["']/g, "");
    }
</script>

<style>

</style>
