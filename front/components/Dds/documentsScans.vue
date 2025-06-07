<script setup>
const apiBase = useRuntimeConfig().public.apiBase;

const showImagePreview = (event) => {
  const parent = event.target.parentElement;
  parent.querySelector('.p-image-preview-mask').click();    
}


defineProps({
  dds: Object,
  apiBase: String,
});
defineEmits(['upload']);
</script>

<template>
  <div class="w-full">
    <div v-if="dds.id">
      <FileUpload
          name="file"
          customUpload
          @uploader="$emit('upload', $event)"
          accept="image/*,application/pdf"
          :maxFileSize="8000000"
          :fileLimit="10"
          chooseLabel="Добавить"
          :show-cancel-button="false"
          class="rounded-none"
          pt:header:class="flex flex-wrap [&>.p-button]:grow"
      >
        <template #empty><span class="text-sm text-surface-600">Перетащите сюда файл или нажмите "Добавить"</span></template>
      </FileUpload>

      <div class="mt-2 flex flex-wrap items-center justify-start gap-2">
        <template v-for="file in dds.files">
          <Image 
              alt="Image" 
              preview
              v-if="file.mime.includes('image')"
              class="sm:basis-[48%] basis-full object-contain cursor-pointer"
              pt:previewmask:class="w-[80px]"
              >
              <template #previewicon>
                  <i class="pi pi-eye"></i>
              </template>
              <template #image>
                  <img class="w-[80px] h-[80px] object-contain" :src="`${apiBase}/storage/${file.url}`" />
                  <div class="pl-2 overflow-hidden break-words" @click="showImagePreview">{{ file.name }}</div>
              </template>
              <template #preview="slotProps">
                  <img :src="`${apiBase}/storage/${file.url}`" alt="preview" :style="slotProps.style" @click="slotProps.onClick" />
              </template>
          </Image>          

          <a
            v-else
            class="flex sm:basis-[48%] basis-full cursor-pointer relative"
            :href="`${apiBase}/storage/${file.url}`"
            target="_blank"                   
          >
            <img width="80" height="80"
              :src="`/images/filetypes/pdf.svg`"
              alt="file"
            >
            <span class="font-semibold pl-2 overflow-hidden break-words">
              {{ file.name }}
            </span>                        
          </a>          
        </template>
        <!-- <Button @click="ImageDeleteConfirm($event, 'facsimile')" label="Удалить" severity="danger" outlined></Button> -->
      </div>
    </div>
    <div v-else class="text-center">
      <p class="text-sm text-surface-400 dark:text-surface-100 py-2">Добавление доступно после создания</p>
    </div>
  </div>
</template>