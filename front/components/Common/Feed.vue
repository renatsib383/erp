<template>
  <div
    id="chat"
    class="w-full h-[calc(100%-4px)] border border-t-0 border-l-0 dark:border-transparent flex flex-col h-section text-[#26292b] dark:text-surface-0">

    <!-- Header -->
    <div class="p-2 flex flex-row justify-between items-center gap-[10px] dark:bg-surface-600">
      <AvatarGroup class="">
        <template v-for="user in users">
          <Avatar
            v-tooltip.bottom="user.info.name"
            :label="user.info.name.replace(/[^a-zа-яё]/gi, '').slice(0, 3)"
            shape="circle"
            class="text-[10px] hover:z-50"
          />
        </template>
      </AvatarGroup>
      <InputText
        v-model="searchTerm"
        type="text"
        placeholder="Поиск"
        class="!py-[5px] rounded-none text-[15px] border-search-border focus:ring-4 focus:ring-input-focus-ring focus:ring-opacity-50 focus:!border-search-border"
        style="height: 32px"
        @input="getFilteredMessages"     
      />
    </div>

    <!-- Body -->
    <div
      ref="chatBodyRef"
      @dragover.prevent
      @dragenter.prevent
      @drop="drop($event)"
      class="flex flex-1 overflow-auto bg-[#f5f6f8] dark:bg-surface-900">

      <div class="preloader w-full relative"
        v-if="!isMounted">
        <div v-for="i in 2">
          <div class="flex justify-center">
            <Skeleton width="100px" height="28px" class="mt-[8px] mb-[10px] bg-[#ffffff]"/>
          </div>
          <div class="c1 flex justify-center">
            <Skeleton width="220px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>
          <div class="c2 flex justify-center">
            <Skeleton width="240px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>
          <div class="c3 flex justify-center">
            <Skeleton width="180px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>        
          <div class="c4 flex justify-center">
            <Skeleton width="80px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>        
          <div class="c5 flex justify-center">
            <Skeleton width="240px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>        
          <div class="c6 flex justify-center">
            <Skeleton width="80px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>        
          <div class="c7 flex justify-center">
            <Skeleton width="240px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>        
          <div class="c8 flex justify-center">
            <Skeleton width="100px" height="28px" class="mt-[8px] mb-[10px] bg-[#ffffff]"/>
          </div>
          <div class="c9 flex justify-center">
            <Skeleton width="220px" height="16px" class="mb-2 bg-[#ffffff]"/>
          </div>  
        </div>
        <!-- <div class="absolute w-[80px] h-[80px] top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
          <div class="w-full h-full rounded-full border-8 border-[#e5e5e5] border-t-transparent animate-spin"></div>
        </div> -->
      </div>

      <div class="chat__scroll-observer h-4" ref="scrollObserverRef" ></div>

      <div class="flex flex-col py-2 w-full grow"
        v-if="isMounted">

        <!-- Форма нового сообщения-->  
        <div v-show="showForm == 'note'"
          class="entity-feed-form-wrapper px-3 mt-auto order-[10]">
          <div class="entity-feed-form relative p-[10px] text-surface-700 dark:text-surface-100 bg-white rounded dark:bg-surface-600">
            <form class="" @submit.prevent="sendMessage">
              <div class="form-top">
                <div class="entity-feed-form__header mb-[10px] leading-[130%] font-semibold">Новое примечание</div>
                <!--<div 
                  ref="userSelectRef"
                  class="flex mb-[10px] items-center" 
                >
                   <div class="entity-feed-form__header relative leading-[130%] cursor-pointer" @click="openUserSelect()">
                    <span>Уведомить:</span>
                    <Listbox
                      v-if="isInputUserList"
                      v-show="isInputUserListShow"
                      v-model="selectedUser"
                      ref="userSelectListRef"
                      @update:modelValue="addSelectedUsers"                      
                      pt:root:class="absolute bottom-full z-20"
                      :ptOptions = "{mergeProps: true}"
                      optionLabel="name"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      :options="userListFiltered"
                      @blur="blur"
                      @focus=""
                    >
                      <template #footer="slotProps">
                          <div class="flex align-items-center">
                            <button
                              class="w-full py-1 px-2 bg-slate-400 text-white rounded-lg"
                              @click="removeSelectedUsers"
                            >
                              Очистить
                            </button>
                          </div>
                      </template>
                    </Listbox>
                  </div> 
                  <div class="flex items-center">
                    <span ref="usersSelectedRef" class="mx-1 text-surface-900 font-medium"></span>
                    <Button
                      @click="openUserSelect"
                      icon="pi pi-sort-down-fill"
                      variant="outlined"
                      pt:root:class="!p-1 !w-4 !h-4 !bg-transparent !rounded-sm"
                      pt:icon:class="!text-xs !text-surface-400 dark:!text-surface-100"
                      :ptOptions = "{mergeProps: true}"
                      ref="openUserSelectBtnRef"
                    >
                    </Button>
                  </div> 
                </div>-->
                <div @click="showForm = false"
                  class="group entity-feed-form__close absolute top-[10px] right-[10px] text-[#92a3b4] cursor-pointer">
                  <svg width="20"
                    height="20"
                    class="text-[#92a3b4] group-hover:text-[#343f4a]">
                    <use xlink:href="/images/sprite.svg#close" />
                  </svg>
                </div>
              </div>
              <div class="form__field entity-feed-form__field">
                  <Textarea
                  class="w-full rounded-none"
                  placeholder="Введите примечание"
                  autoResize
                  rows="4"
                  ref="input"
                  @paste="paste($event)"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact.prevent="newMessage += '\n'"
                  v-model="newMessage"
                  />
              </div>
              <div class="entity-feed-form__submit mt-[10px]">
                <button type="submit"
                  class="button-modal" title="Добавить">
                    Добавить
                </button>
              </div>
            </form>
          </div>
        </div>



        <!--Форма загрузки файлов-->
        <CommonUploadFileForm
          :isShow="isShowFileForm"
          :uploadRoute="'/deal/notes/upload'"
          :dealId="deal_id"
          @close="closeFileForm"
          @filesUploaded="filesUploaded"
          ref="uploadFileFormRef"
          class="order-10 mt-auto"
          @select="onFileSelect"
        />

        <!-- Сообщения -->
        <template v-for="(data, index) in filteredMessages" :key="index">
          <div class="chat__day px-3"
            :class="(index === 'new-tasks') ? 'order-[1]' : ''">
            <div class="chat__date sticky top-[10px] flex items-center mb-[10px] z-[10]">
              <div class="chat__date-title flex min-w-[100px] mx-auto  px-2  text-[#66727e] bg-white">
                  {{ (index === 'new-tasks') ? 'Текущие задачи' : index }}
              </div>
            </div>

            <template
              v-for="message in filteredMessages[index]"
              :key="message.id"
            >

              <!-- Заметка -->
              <div v-if="message.entry_type && message.entry_type == 'note'"
                class="chat-feed__entity chat-feed__entity--msg flex mb-2"
                :class="getMsgClasses(message)"
                >
                <div class="chat-feed__entity-icon mr-[15px]">
                  <i
                    class="!flex items-center justify-center"
                    :class="getMsgIcon(message)">
                  </i>
                </div>
                <div class="chat-feed__entity-main text-sm overflow-hidden"
                    :class="message.user.id === me.id ? 'chat-feed__msg--me' : ''">
                    <div class="chat-feed__entity-title flex items-center text-[#92a3b4]">
                      <span class="text-sm mr-1">
                        {{ dateFormat(message.created_at,true) }}
                      </span>
                      <a
                        href=""
                        class="chat-feed__msg-user"
                        >
                          {{ message.user.name }}
                      </a>
                    </div>

                    
                    <p class="chat-feed__entity-content mt-[5px]">
                      <!-- Файл pdf -->
                      <!-- <div v-if="message.file && message.file.mime.includes('pdf')">
                        <a :href="`${apiBase}/feed/${message.file.url}`" target="_blank" class="flex items-start gap-1">
                          <span class="pi pi-file-pdf h-full w-full text-7xl py-2 text-red-500"></span>
                          {{ message.file.name }}
                        </a>
                      </div>                       -->

                      <!-- Изображение -->
                      <div v-if="message.file && message.file.mime.includes('image')">

                        <div :style="getImageStyle(message.file)" class="bg-[#eee]">
                          <a
                              :data-lg-size="`${message.file.dimensions[0]}-${message.file.dimensions[1]}`"
                              class="gallery-item block w-full h-full cursor-pointer"
                              :data-thumb="message.file.thumb ? `${apiBase}/feed/${message.file.thumb}` : `${apiBase}/feed/${message.file.url}`"
                              :data-src="`${apiBase}/chat/${message.file.url}`"
                              @click="galleryRef.launch($event, message.id)"
                            >
                              <img 
                                :data-src="message.file.thumb ? `${apiBase}/feed/${message.file.thumb}` : `${apiBase}/feed/${message.file.url}`" 
                                alt="" 
                                ref="imagesRefs" 
                                class="w-full h-full object-cover"/>
                          </a>
                        </div>

                      </div>

                      <!-- <audio
                        controls
                        v-if="message.file && message.file.mime.includes('webm')"
                      >
                        <source
                          :src="`/feed/${message.file.url}`"
                          type="audio/mpeg"
                        />
                        Ваш браузер не поддерживает аудио элемент.
                      </audio> -->

                      <!-- Видео -->
                      <div v-if="message.file && message.file.mime.includes('video')">
                          <video
                            width="280"
                            controls
                            preload="metadata"
                          >
                            <source :src="`${apiBase}/feed/${message.file.url}#t=0.1`" :type="message.file.mime">
                          </video>

                      </div>

                      <a
                        class="chat-feed__file-other-type"
                        :href="`${apiBase}/feed/${message.file.url}`"
                        v-if="
                          message.file &&
                          !message.file.mime.includes('image') &&
                          !message.file.mime.includes('webm') &&
                          !message.file.mime.includes('video') && 
                          !message.file.mime.includes('audio')
                        "
                        :target="['application/pdf','text/plain'].includes(message.file.mime) ? '_blank' : ''"
                      >
                        <div class="flex items-start gap-1">
                          <img width="80" height="80"
                            :src="`/images/filetypes/${getFileTypeIcon(message.file.name)}`"
                            alt="file"
                          >
                          {{ message.file.name }}
                        </div>
                      </a>
                    </p>
                    <div class="break-words">{{ message.text }}</div>
                </div>
              </div>

              <!-- Задача -->
              <div class="mb-2"
                v-if="message.entry_type && message.entry_type == 'task'">
                <div
                  class="chat-feed__entity chat-feed__entity--task grid grid-cols-[auto_1fr] flex py-2 px-3 dark:bg-surface-600"
                  @click.stop.prevent="editTask(message)">
                  <div class="chat-feed__task-icon flex items-center justify-center w-9 h-9 mr-4 rounded-full"
                    :class="isTaskComplete(message) ? 'bg-[#02ce79]' : 'bg-[#92a3b4]'">
                    <svg
                      width="20"
                      height="20"
                      class="text-white">
                      <use xlink:href="/images/sprite.svg#task-check" />
                    </svg>
                  </div>
                  <div class="text-sm mr-1">
                    <div v-html="renderTask(message,index)"></div>
                  </div>
                  <div class="col-start-2 mt-1" v-if="!isTaskComplete(message)">
                    <!-- <form @submit.prevent="updateTaskResult(message)"
                      @click.stop
                      :ref="`task_${getMessageId(message)}_result`"
                      class="flex"
                      >                     -->
                    <form @submit.prevent="updateTaskResult(message)"
                      @click.stop
                      :ref="(el) => currentTaskRef = el" 
                      class="flex"
                      >
                      <Textarea
                        :pt="{ root: 'chat-feed__task-result w-full py-[9px] leading-[18px]' }"
                        :ptOptions="{ mergeProps: true }"
                        class="mr-2 text-[15px]"
                        placeholder='Добавить результат'
                        rows="1"
                        cols="30" />
                      <button
                        type="submit"
                        class="flex items-center justify-center shrink-0 w-9 h-9 ml-[20px] bg-emerald-500 rounded-full"
                        :class="{'!bg-red-200': (message.performer && message.performer.id !== me.id) || (message.eventable && message.eventable.performer && message.eventable.performer.id !== me.id)}"
                      >
                        <svg width="24"
                          height="24"
                          class="text-white">
                          <use xlink:href="/images/sprite.svg#arrow-right" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <!-- Изменение -->
              <div class="chat-feed__entity chat-feed__entity--event flex mb-2 justify-center"
                v-if="message.entry_type && message.entry_type == 'event'">
                <div class="">
                  <div class="mr-1 text-[13px] leading-[120%] text-center text-[#92a3b4] [&_i]:text-[#66727e] [&_i]:not-italic">
                    <span class="mr-1"> {{ dateFormat(message.created_at,true) }}</span>
                    <span class="text-[#66727e] mr-1">{{ message.user && message.user.name }}</span>
                    <template
                      v-if="message.type == 'created'">
                      <span v-html="renderCreatedEvent(message)"></span>
                    </template>                    
                    <template
                      v-if="message.type === 'updated'"
                      v-for="(data, field) in message.data">
                      <span v-html="renderEvent(field, data)"></span>
                    </template>
                  </div>
                </div>
              </div>           

              <!-- Аудио -->
              <div v-if="message.file && message.file.mime.includes('audio')" class="chat-call">
                <div class="flex mb-2 justify-center text-center">
                  <div class="rounded py-2 px-3">
                    <p class="text-sm mt-1">
                      {{ dateFormat(message.created_at,false,true) }}
                    </p>
                    <audio controls preload="metadata" ref="audiosRefs"> 
                      <source
                        :src="`${apiBase}/feed/${message.file.url}`"
                        :type="message.file.mime"
                      />
                      Ваш браузер не поддерживает аудио элемент.
                    </audio>
                  </div>
                </div>
              </div>
            </template>

          </div>
        </template>


      </div>

    </div>

    <!-- Input 2 -->
    <div class="relative flex justify-center dark:bg-surface-600 text-surface-500 dark:text-surface-400"
      :class="showForm ? 'after:absolute after:left-0 after:top-0 after:right-0 after:bottom-0 after:cursor-not-allowed z-10' : '' ">
      <div class="flex items-center justify-between w-full h-[70px] px-[50px] max-w-[480px] text-xs leading-[120%]  text-center">
        <div @click="newTask"
          class="w-[80px] cursor-pointer hover:text-surface-950 dark:hover:text-surface-0" >
          <div class="flex items-center justify-center">
            <svg width="20"
                height="20"
                class="text-accent">
              <use xlink:href="/images/sprite.svg#task-check" />
          </svg>
          </div>
          <div class="entity-feed-actions-menu__item-title">
            Создать задачу
          </div>
        </div>
        <div
          @click="openFormNotes"
          class="w-[80px] cursor-pointer hover:text-surface-950 dark:hover:text-surface-0">
          <div class="pi pi-book text-base"></div>
          <div class="entity-feed-actions-menu__item-title">
            Добавить примечание
          </div>
        </div>
        <div
          @click="openFileForm"
          class="w-[80px] cursor-pointer hover:text-surface-950 dark:hover:text-surface-0">
          <div class="pi pi-paperclip text-base"></div>
          <div class="entity-feed-actions-menu__item-title">
            Прикрепить файлы
          </div>
        </div>
        <!-- <div class="record-button">
          <button
            v-show="!isRecording && newMessage.length === 0"
            @click="startRecording"
            class="p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#263238"
                fill-opacity=".45"
                d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
              ></path>
            </svg>
          </button>
          <button v-show="isRecording" @click="stopRecording" class="p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="red"
                fill-opacity=".75"
                d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"
              ></path>
            </svg>
          </button>
          <audio class="hidden" ref="audio"></audio>
        </div> -->
      </div>
    </div>

  </div>

  <CommonMediaGallery
    :groupMessages = "filteredMessages"
    :apiBase="apiBase"
    ref="galleryRef"
    type="feed"
  />
</template>

<script setup>
  import InputText from "primevue/inputtext";
  import Textarea from "primevue/textarea";
  import TaskForm from "@/components/Tasks/Full.vue";
  import { ref, nextTick } from "vue";
  import ptDialog from "@/assets/presets/custom/TaskFullPreset.js";

  import { fetchDealLists, fetchMessages, createMessage, fetchFile } from '@/services/api/feedServices.js';
  // import { updateTask } from '@/services/api/tasksServices.js';
  import { useTasksStore } from '~/stores/tasks.js'


  const props = defineProps({
    deal_id: {
      type: String,
    },
    fieldsFromDeal: {
      type: Object,
    },
    typesFromDeal: {
      type: Array,
    },
    usersFromDeal: {
      type: Array,
    },
    pipelinesFromDeal: {
      type: Array,
    },
    isActive: {
      type: Boolean
    },
  });

  const me = ref({});
  const newMessage = ref("");
  const groupMessages = ref({});
  const filteredMessages = ref({});
  const users = ref([]);
  // file: null,
  const isRecording = ref(false);
  const mediaRecorder = ref(null);
  const chunks =ref([]);
  // audio: null,
  const searchTerm =ref("");
  const sending =ref(false);
  const taskIsChanged =ref(false);
  const showForm = ref(false);
  const isMounted = ref(false);
  // const fields = ref(null);
  const isInputUserList = ref(false);
  const isInputUserListShow = ref(false);
  const userList = ref([]);
  const selectedUser = ref([]);
  // const isFileLoading = ref(false);
  // const isFileLoadingMin = ref(false);
  const isShowFileForm = ref(false);
  const messages = ref({});
  const lastLoadedIndex = ref(null);
  const firstDayEl = ref(null);
  const dealLists = ref({});
  const apiBase = ref('');
  const firstLoad = ref(true);
  const taskStore = ref(null);

  const scrollObserverRef = ref(null);
  const imagesRefs = ref(null);
  const audiosRefs = ref(null);
  const uploadFileFormRef = ref(null);
  const userSelectRef = ref(null);
  const userSelectListRef = ref(null);
  const openUserSelectBtnRef = ref(null);
  const chatBodyRef = ref(null);
  const observer = ref({});
  const usersSelectedRef = ref(null);
  const userListFiltered = ref([]);
  const currentTaskRef = ref(null);
  const galleryRef = ref(null);

  const dialog = useDialog();
  const tasksStore = useTasksStore();

  onMounted(async () => {
    const currentUser = useSanctumUser();
    me.value = currentUser.value;

    const runtimeConfig = useRuntimeConfig();
    apiBase.value = runtimeConfig.public.apiBase;    

    if (!props.fieldsFromDeal || 
      !props.typesFromDeal ||
      !props.usersFromDeal ||
      !props.pipelinesFromDeal
    ) {
      const response = await fetchDealLists();
      if (response.success) {
        dealLists.value = response.lists;
      } 
    }

    
    getMessages();
    observer.value = new IntersectionObserver (
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
              firstDayEl.value = chatBodyRef.value.querySelector('.chat__day');
              getPortion();
          }
        });
      },
      {
        threshold: [1],
      }
    );    
  }),

  onUnmounted(async () => {
    Echo.leave(`feed.${props.deal_id}`);
  }),

  // computed: {
    // filteredMessages: function() {
    //   let result = {};
    //   if (!this.searchTerm) {
    //     result = this.groupMessages;
    //   }
    //   else {
    //     for (let key of Object.keys(this.groupMessages)) {
    //       let array = this.groupMessages[key];
    //       array = array.filter((message) => {
    //         return message.text && message.text.toLowerCase().includes(this.searchTerm.toLowerCase())
    //         })
    //       if (array.length > 0) {
    //         result[key] = array;
    //       }
    //   }      
    // }

    //   console.log('[Feed] filteredMessages result: ',result );
    //   return result;
    // },
  // },

    watch(groupMessages,
      async (newValue) => {
        getFilteredMessages();
        await nextTick();
        if (firstDayEl.value) {
          chatBodyRef.value.scrollTop = firstDayEl.value.offsetTop;
          firstDayEl.value = null;
        }
        processImages();   
        processAudios();
        // this.scrollChatBody(); - закомменчено - не должно быть прокрутки после подгрузки предыдущих
        // this.$refs.gallery && this.$refs.gallery.refresh();
      }, {deep: true}
    ),
    watch(filteredMessages,async (newValue) => {
      await nextTick();
      if (firstDayEl.value) {
        chatBodyRef.scrollTop = firstDayEl.value.offsetTop;
        firstDayEl.value = null;
      }
      if (firstLoad.value) {
        scrollChatBody();
        firstLoad.value = false;
      }
      processImages();
    })
    watch(messages, async (newValue) => {
        lastLoadedIndex.value = null;
        getPortion(newValue);
        // this.scrollChatBody(); - закомменчено - в filteredMessages достаточно
        await nextTick();
        setObserver();
    });
    watch(() => props.isActive, async (newValue) => {
      if (newValue) {
        await nextTick();
        scrollChatBody();
      }
    })      

    const getMessages = async () => {

      const messagesData = await fetchMessages(props.deal_id);
      if (messagesData.success) {
        messages.value = messagesData.data.feed;
        isMounted.value = true;
      } else {
        return;
      }

      Echo.join(`feed.${props.deal_id}`)
      .here((hereUsers) => (users.value = hereUsers))
      .joining((user) => users.value.push(user))
      .leaving(
        (user) => (users.value = users.value.filter((u) => u.id !== user.id))
      )
      .error((error) => {
        console.error(error);
      })
      .listen(".NoteCreated", (e) => {
        addMessage(e.model, 'note');
      })
      .listen(".DealEventCreated", (e) => {
        addMessage(e.model, 'event');
      })
      .listen("NewCall", (e) => {
        addMessage(e.call, 'call');
      })
      .listen(".TaskEventCreated", (e) => {
        addMessage(e.model, 'task');
      });
    };

    const groupByDate = (newMessages) => {
      let _groupMessages = {};

      //  только те, которые переданы в messages
      _groupMessages = newMessages.reduce((acc, cur) => {
        if (!(cur.entry_type == 'task' && !cur.completed)) {
          let date = cur["created_at"].split("T")[0]; // Оставляем только дату
          acc[date] = acc[date] || []; // Если нет acc[date], то создаем пустой
          acc[date].push(cur);
        }
        return acc;
      }, {});
      //
      groupMessages.value = {..._groupMessages, ...groupMessages.value};
      // Незакрытые задачи берем за все дни
      let newTasks = [];
      newTasks = messages.value.filter(message => message.entry_type == 'task' && !message.completed);
      // Сортируем по  убыванию даты
      newTasks.sort((prev,cur) => new Date(prev.start) - new Date(cur.start));
      if (newTasks.length > 0) {
        groupMessages.value['new-tasks'] = newTasks;
      }
    };
    // Подгружает предыдущие или последние 2 дня и добавляет к сообщениям
    const getPortion = () => {
      if (messages.value.length > 0) {
        let dateChanged = 0;
        let prevDate = null;
        if (!lastLoadedIndex.value) {
          lastLoadedIndex.value = messages.value.length-1;
        }
        let prevLastLoadedIndex = lastLoadedIndex.value;
        for (let i=lastLoadedIndex.value; i>-1; i--) {
          let curDate = getDateString(messages.value[i].created_at);
          if (prevDate !== curDate) {
            prevDate = getDateString(messages.value[i].created_at);
            dateChanged += 1;
          }
          lastLoadedIndex.value = i;
          if (dateChanged > 2) { // подгрузить сообщения за 2 предыдуших дня
            break;
          }
        }
        let start = lastLoadedIndex.value == 0 ? 0 : lastLoadedIndex.value+1;
        if (lastLoadedIndex.value == 0) {
          observer.value.unobserve(scrollObserverRef.value);
        }
        let lastMessages;
        lastMessages = messages.value.slice(start,prevLastLoadedIndex+1);
        groupByDate(lastMessages);
      } else {
        groupMessages.value = {};
      }
    };
    const setObserver = async () => {
      await nextTick();
      if (scrollObserverRef.value && messages.value.length > 0) {
          observer.value.observe(scrollObserverRef.value);
      }    
    };  
    const getFilteredMessages = () => {
      let result = {};
      if (!searchTerm.value) {
        result = groupMessages.value;
      }
      else {
          for (let key of Object.keys(groupMessages.value)) {
            let array = groupMessages.value[key];
            array = array.filter((message) => {
              return ( message.text && message.text.toLowerCase().includes(searchTerm.value.toLowerCase()) ) ||
              // задача
              ( message.title && message.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ) ||
              ( message.description	 && message.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ) ||
              // новая задача
              ( message.data && message.data.title && message.data.title.new.toLowerCase().includes(searchTerm.value.toLowerCase()) )
              })
            if (array.length > 0) {
              result[key] = array;
            }
        }      
      }

      filteredMessages.value = result;
    };
    // getDataVideo(message) {
    //   return '{"source": [{"src": "${apiBase}/feed/' + message.file.url + '", "type": "' + message.file.mime + '"}], "attributes": {"preload": false, "controls": true}}';
    // },    
    // Строку с датой без времени
    const getDateString = (date) => {
      return date.split("T")[0];
    };
    const processImages = async () => {
      await nextTick();
      if (!imagesRefs.value) {
        return;
      }
      let unprocessed = imagesRefs.value.filter((image) => image.dataset && image.dataset.src);
      for (let i=unprocessed.length-1; i>-1; i--) {
        let image = unprocessed[i];
        if (image.dataset && image.dataset.src) {
          image.setAttribute('loading','lazy');
          image.setAttribute('src',image.dataset.src);
          image.removeAttribute('data-src');
        }
      }      
    };    
    const processAudios = async() => {
      if (!audiosRefs.value) {
        return;
      }
      for (let audio of audiosRefs.value) {
        audio.addEventListener('play',(event) => {
          for (let audio of audiosRefs.value) {
            if (event.target != audio && !audio.paused) {
              audio.pause();
            }
          }
        })
      }   
    };    
    const onFileSelect = async () => {
      scrollChatBody();
    };
    const getMessageId = (message) => {
      return message.eventable_id || message.id;
    };
    const openDialog = (data, originalMessage) => {
      let params = {
        ...data,
        types: props.typesFromDeal ? props.typesFromDeal : dealLists.value.tasks.types,
        users: props.usersFromDeal ? props.usersFromDeal : dealLists.value.users,
        errors: ref({}),
        timeZone: "UTC",
        calledFrom: 'deal'
      };
      let taskDialogRef = dialog.open(TaskForm, {
        props: {
          showHeader: false,
          draggable: false,
          modal: true,
          appendTo: ".main",
          pt: ptDialog,
        },
        data: params,
        onSubmit: async (eventData) => {
          // const response = await updateTask(eventData);
          const response = await tasksStore.updateTask(eventData);
          if (response.success) {
            const usersList = props.usersFromDeal ? props.usersFromDeal : dealLists.value.users
              if(originalMessage.eventable) {
                for (const [key, value] of Object.entries(eventData)) {
                  originalMessage.eventable[key] = value;
                }
                originalMessage.eventable.performer = usersList.find(user => user.id === eventData.performer)
              } else{
                for (const [key, value] of Object.entries(eventData)) {
                  originalMessage[key] = value;
                }
                originalMessage.performer = usersList.find(user => user.id === eventData.performer)
              }
              taskDialogRef && taskDialogRef.close(); 
          } else {
            taskDialogRef &&
                taskDialogRef.options.onError(response.errors);
          }
          return taskDialogRef.data.errors.value;
        },
        onError: (errors) => {
          taskDialogRef.data.errors.value = errors;
        },
      });
    };
    const newTask = () => {
      let date = new Date();
      const tomorrow = new Date(date.getTime() + 1440 * 60 * 1000)

      openDialog(
        {
          title: '',
          all_day: true,
          duration: 1440, // Продолжительность на весь день
          start: tomorrow,
          deal_id: props.deal_id,
          mode: "create",
          performer: me.value && me.value.id
        },
      );
    };
    const editTask = (originalMessage) => {
      // let taskData = JSON.parse(JSON.stringify(originalMessage.eventable || originalMessage));
      let taskData = originalMessage.eventable ? originalMessage.eventable : originalMessage;
      let editData = {
        ...taskData,
        mode: "update",
      };

      // editData.start = this.getDate(editData.start);
      // editData.end = editData.end === null ? null : this.getDate(editData.end);
      editData.performer =  editData.performer ? editData.performer.id : null;

      openDialog(editData, originalMessage);
    };
    const updateTaskResult = (task) => {
      const isPerformerMissing = task.eventable && !task.eventable.performer && !task.performer;
      const isPerformerCurrentUser = (task.eventable?.performer?.id === me.value.id) || (task.performer?.id === me.value.id);

      if (isPerformerMissing || isPerformerCurrentUser) {
        let taskData = JSON.parse(JSON.stringify(task.eventable || task));
        taskData.author = taskData.author.id;
        taskData.performer = taskData.performer?.id || null;
      

        if (currentTaskRef.value) {
          taskData.description = currentTaskRef.value.querySelector('.chat-feed__task-result').value;
        }

        taskData.status = 3;
        taskData.completed = true;

        const response = tasksStore.updateTask(taskData);
      }
    };
    const isTaskComplete = (data) => {
      return !(data.status < 3 || (data.eventable && data.eventable.status < 3));
    };

    const renderTask = (data, index) => {
      let taskData = (data.eventable) ? data.eventable : data;
      let types = props.typesFromDeal ? props.typesFromDeal : dealLists.value.tasks.types;
      let type = taskData.type
        ? types.find((item) => item.code === taskData.type)
            .name + ":"
        : "";
      let performer = "";
      if (taskData.performer !== null) {
        performer =
         "Для " + taskData.performer.name;
      }
      //  Дата выполнения
      let completed = taskData.events.find(element => {
        if (element.data && element.data.status && element.data.status.new === 3) {
          return true;
        }
      })
      //
      let addClasses = '';
      let resultInfo = '';
      if (isTaskComplete(taskData) && completed) {
        addClasses+=" line-through";
        resultInfo = `
          <div class='mt-4'>
            <div class='text-[13px] leading-[135%] text-[#92a3b4]'>${dateFormat(completed.updated_at)}</div>
            <div>${taskData.description ? 'Результат по задаче: ' + taskData.description : 'Выполнена'}</div>
          </div>
        `;
      }
      return `
                <div class="text-[13px] leading-[135%] text-[#92a3b4]">
                  ${(taskData.all_day) ? dateFormatUni(taskData.start, false, true) + ' Весь день ' : dateFormatUni(taskData.start, false)} ${performer}
                </div>
                <div class="${addClasses}">${type} ${taskData.title ? taskData.title : ''}</div>
                ${resultInfo}
          `;
    };
    const renderCreatedEvent = (message) => {
      return `<span>Создана сделка ИД ${message.data.id.new}</span>`;
    };
    const renderEvent = (field, data) => {
      if (field === 'stages') {
        const pipelinesData = props.pipelinesFromDeal && props.pipelinesFromDeal.length
          ? props.pipelinesFromDeal
          : Object.values(dealLists.value.pipelines);

        let oldStages = data.old && Object.keys(data.old).length > 0
          ? ` <p class="mb-[2px]">Было</p>
          ${Object.values(data.old).map(stage => {
              const pipeline = pipelinesData.find(p => p.stages && Object.values(p.stages).find(s => s.id === stage));
              if (!pipeline) return '';  // Проверка наличия pipeline
              const stageData = pipeline.stages && Object.values(pipeline.stages).find(s => s.id === stage);
              if (!stageData) return '';  // Проверка наличия данных для этапа
              return `<div class="grid grid-cols-2">
                  <span class="border-[1px] p-1">${pipeline.name}</span>
                  <span class="p-1 border-[1px] dark:text-surface-700" style="background-color: ${stageData.color}">${stageData.title}</span>
              </div>`;
            }).join('')}
          ` : '';


        let newStages = data.new && Object.keys(data.new).length > 0
          ? ` <p class="mb-[2px]">Стало</p>
          ${Object.values(data.new).map(stage => {
              const pipeline = pipelinesData.find(p => p.stages && Object.values(p.stages).find(s => s.id === stage));
              if (!pipeline) return '';  // Проверка наличия pipeline
              const stageData = pipeline.stages && Object.values(pipeline.stages).find(s => s.id === stage);
              if (!stageData) return '';  // Проверка наличия данных для этапа
              return `<div class="grid grid-cols-2">
                  <span class="border-[1px] p-1">${pipeline.name}</span>
                  <span class="p-1 border-[1px] dark:text-surface-700" style="background-color: ${stageData.color}">${stageData.title}</span>
              </div>`;
            }).join('')}
          ` : '';

        return `<span>Изменено поле "Воронки и этапы"</span>${oldStages}${newStages}`;
      }
      let fieldConfig = null;
      if (dealLists.value.fields){
        fieldConfig = dealLists.value.fields[field];
      } else {
        fieldConfig = props.fieldsFromDeal[field];
      }
      if (fieldConfig === undefined) {
        return '';
      }
      let newVal = data.new;
      let oldVal = data.old;
      if (fieldConfig.type === "index" && fieldConfig.target !== "User") {
        newVal =
           fieldConfig.list && fieldConfig.list[newVal] instanceof Object
            ? fieldConfig.list[newVal].title
            :  fieldConfig.list && fieldConfig.list[newVal] ? fieldConfig.list[newVal] : "";
        oldVal =
           fieldConfig.list && fieldConfig.list[oldVal] instanceof Object
            ? fieldConfig.list[oldVal].title
            :  fieldConfig.list && fieldConfig.list[oldVal] ? fieldConfig.list[oldVal] : "";
      }
      if (fieldConfig.type === "index" && fieldConfig.target === "User") {
        const usersList = props.usersFromDeal ? props.usersFromDeal : dealLists.value.users
        newVal = newVal ? usersList.find(user => user.id == newVal).name : "";
        oldVal = oldVal ? usersList.find(user => user.id == oldVal).name : "";
      }
      oldVal = oldVal ? oldVal : "";
      newVal = newVal ? newVal : "";
      if(field === 'price') {
        return `<span>Прайс-лист изменён</span> `;
      }
      if (!oldVal || oldVal === undefined) {
        return `<span>Изменено поле <i>«${fieldConfig.name}»</i>.</span> <div>Новое значение <i>«${newVal}»</i></div>`;
      }
      return `<span>Изменено поле <i>«${fieldConfig.name}»</i>.</span> <div>Предыдущее значение <i>«${oldVal}»</i>, новое значение <i>«${newVal}»</i></div>`;
    };
    // startRecording() {
    //   navigator.mediaDevices
    //     .getUserMedia({ audio: true })
    //     .then((stream) => {
    //       this.mediaRecorder = new MediaRecorder(stream);
    //       this.mediaRecorder.start();
    //       this.isRecording = true;

    //       this.mediaRecorder.ondataavailable = (e) => {
    //         console.log('[Feed] this.mediaRecorder.ondataavailable');
    //         this.chunks.push(e.data);
    //       };
    //     })
    //     .catch((err) => {
    //       console.log("Устройство не найдено:", err);
    //     });
    // },
    // stopRecording() {
    //   if (!this.mediaRecorder) {
    //     console.log("Медиа-рекордер не инициализирован");
    //     return;
    //   }

    //   this.mediaRecorder.stop();
    //   this.isRecording = false;

    //   this.mediaRecorder.onstop = () => {
    //     let blob = new Blob(this.chunks, {
    //       type: "audio/ogg; codecs=opus",
    //     });
    //     this.$refs.audio.src = window.URL.createObjectURL(blob);

    //     // Создаем объект File из Blob
    //     this.file = new File([blob], "recording.ogg", {
    //       type: "audio/ogg; codecs=opus",
    //     });

    //     // Вызываем функцию uploadFile с созданным файлом
    //     this.uploadFiles([this.file]);
    //   };
    // },
    const uploadFiles = async (files) => {
        openFileForm();
        await nextTick();
        const dataTransfer = new DataTransfer();
        for (let key of Object.keys(files)) {
          dataTransfer.items.add(files[key]);
        }
        const fakeEvent = new DragEvent("drop", { dataTransfer });
        uploadFileFormRef.value.fileUploadComp.onFileSelect(fakeEvent);
    };
    // Добавление файлов
    const openFileForm = async () => {
      isShowFileForm.value = true;
      await nextTick();
      scrollChatBody();
    };
    const closeFileForm = async () => {
      isShowFileForm.value = false;
    };
    const filesUploaded = async () => {
      newMessage.value = "";
    };
    const drop = async (event) => {
      event.preventDefault();
      openFileForm();
      await nextTick();
      uploadFileFormRef.value.fileUploadComp.onDrop(event);
    };
    const paste = async (event) => {
      const files = (event.clipboardData || event.originalEvent.clipboardData).files;
      if (files.length > 0) {
        event.preventDefault();
        uploadFiles(files)
      }
    };
    const getFileTypeIcon = (filename) => {
      let extension = filename.split('.').pop();
      switch (extension) {
        case 'pdf':
          return 'pdf.svg';
        case 'doc':
        case 'docx':
          return 'doc.svg';
        case 'xls':
        case 'xlsx':
          return 'xls.svg';
        case 'txt':

          return 'txt.svg';
        case 'zip':
        case 'rar':
        case '7z':
          return 'zip.svg';
        case 'mp3':
        case 'wav':
        case 'ogg':
          return 'audio.svg';
        case 'mp4':
        case 'mov':
        case 'avi':
          return 'video.svg';
        default:
          return 'file.svg';
      }
    };
    const getImageStyle = (imageFile) => {
      let width,height;
      if (imageFile.dimensions[0] >= imageFile.dimensions[1]) {
        width = 320;
      }
      else {
        width = 240;
      }
      height = imageFile.dimensions[1]/imageFile.dimensions[0] * width;
      return `width: ${width}px; height: ${height}px;`;
    };
    //
    const sendMessage = async () => {
      if (newMessage.value.length > 0 && !sending.value) {
        sending.value = true;

        const response = await createMessage(props.deal_id,newMessage.value,selectedUser.value ? selectedUser.value.id : null);
        if (response.success) {
          newMessage.value = "";
          sending.value = false;
          showForm.value = false;        
        }

        // axios
        //   .post(route("deal.note.add"), {
        //     deal_id: this.deal_id,
        //     message: this.newMessage,
        //     recipient: this.selectedUser ? this.selectedUser.id : null
        //   })
        //   .then(
        //     () => {
        //       this.newMessage = "";
        //       this.sending = false;
        //       this.showForm = false;
        //     },
        //     (error) => {
        //       console.log("Ошибка при отправке сообщения:", error);
        //     }
        //   );
      }
    };
    const getMsgIcon = (message) => {
      if (message.file) {
        if (message.file.mime.includes('image')) {
          return 'pi pi-image';
        }
        else if (message.file.mime.includes('webm')) {
          return 'pi pi-headphones';
        }
        else {
          return 'pi pi-paperclip'
        }
      }
      else if (message.text) {
        return 'pi pi-book';
      }
      else {
        return '';
      }

    };
    const getMsgClasses = (message) => {
        if (message.entry_type.includes('note')) {
          return 'bg-white dark:bg-surface-600 p-[10px]';
        }
        else {
          return '';
        }
    };
    const scrollChatBody = async () => {
    
      if (taskIsChanged.value) {
        taskIsChanged.value = false;
        return;
      }
      await nextTick();
      let chatBody = chatBodyRef && chatBodyRef.value;
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    };
    // message.eventable - поля для измененных записей
    const addMessage = (data,type) => {
        let created_at_date = data.created_at.split("T")[0]; // Оставляем только дату
        if (!groupMessages.value[created_at_date]) {
          groupMessages.value[created_at_date] = [];
        }
        let message = data.eventable && (type === 'task') ? {...data.eventable} : {...data};
        message.entry_type = type;
        let taskIsAdded = false;
        //  Для задач вносим исправления в существующую запись
        if (type === 'task' && data.type === 'updated') {
          // Статус изменен на выполнено - удаляем из текущих
          if (message.events[message.events.length - 1].data.status
              && message.events[message.events.length - 1].data.status.new === 3) {
            let index = groupMessages.value['new-tasks'].findIndex((msg) => message.id === msg.id);
            groupMessages.value['new-tasks'].splice(index,1);
            if (groupMessages.value['new-tasks'].length === 0) {
              delete groupMessages.value['new-tasks'];
            }
            // Добавляем в основные
          } else {
          // Другие изменения - оставляем на месте
            taskIsChanged.value = true;
            // created_at_date = message.created_at.split("T")[0]; // Выделяем дату
            let index = groupMessages.value['new-tasks'].findIndex((msg, index) => {
              if (message.id === msg.id) {
                return true;
              }});
            if (index > -1) {
              groupMessages.value['new-tasks'][index] = message;
            }
          }
        }
        // Добавляем новую задачу в Текущие задачи
        else if (type === 'task' && data.type === 'created') {
          taskIsAdded = true;
          groupMessages.value['new-tasks'] = groupMessages.value['new-tasks'] || [];
          groupMessages.value['new-tasks'].push(message);
          groupMessages.value['new-tasks'].sort((prev,cur) => new Date(prev.start ? prev.start : prev.eventable.start) - new Date(cur.start ? cur.start : cur.eventable.start));
        }
        // Добавляем сообщение в ленту по дате
        if (!taskIsChanged.value && !taskIsAdded) {
          groupMessages.value[created_at_date].push(message);
          if (message.user && message.user.id == me.value.id) scrollChatBody();
        }
    };
    // Выбор пользователей для уведомления
    const openUserSelect = async () => {
      if (!isInputUserList.value) {
        isInputUserList.value = true;
      }
      await nextTick();
      let userSelectList = userSelectRef.value;
      let ul = userSelectListRef.value.$el.querySelector('ul li');
      ul.focus();

      if (userList.value.length == 0) {
        const usersList = props.usersFromDeal ? props.usersFromDeal : dealLists.value.users;
        userList.value= [
          { label: 'Пользователи',
            code: 'users',
            items: usersList.map(item => ({'id': item.id, 'name': item.name }))
          }
        ]
        userListFiltered.value = userList.value;
      }
      isInputUserListShow.value = !isInputUserListShow.value;
      document.addEventListener('click',userSelectClickOutside);
    };
    const userSelectClickOutside = (event) => {
      let parent = userSelectRef.value;
        if (parent && parent.contains && parent.contains(event.target.parentNode)) {
          return;
        }
        let btn = openUserSelectBtnRef.value.$el;
        if (btn && btn.contains && btn.contains(event.target.parentNode)) {
          return;
        }
        closeUserSelect();
    };
    const closeUserSelect = () => {
      isInputUserListShow.value = false;
      //!!! this.selectedUser = [];
      document.removeEventListener('click',userSelectClickOutside);
    };
    const addSelectedUsers = () => {
      if (selectedUser.value) {
        isInputUserListShow.value = false;
      }
      let usersSelectedEl = usersSelectedRef.value;
      usersSelectedEl.innerText = ' @'+selectedUser.value.name;
    };
    const removeSelectedUsers = () => {
      selectedUser.value = [];
      usersSelectedRef.value.innerText = '';
      closeUserSelect();
    };
    //
    const openFormNotes = () => {
      showForm.value = 'note';
      scrollChatBody();
      selectedUser.value = [];
      let usersSelectedEl = usersSelectedRef.value;
      usersSelectedEl.innerText = ' ';      
    }
    //

</script>

<style scoped></style>
