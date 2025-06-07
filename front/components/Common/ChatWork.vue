<template>
  <div
    id="chat"
    ref="chatRef"
    class="w-full h-full relative border border-t-0 dark:border-transparent flex flex-col h-section"
    :class="propClass"
  >
    <div 
      v-if="messagesNotViewed.length > 0"
      @click="scrollChatBody"
      class="unviewed absolute w-8 h-8 right-4 bottom-[50px] bg-[var(--p-surface-200)] hover:bg-[var(--p-surface-100)] rounded-full flex items-center justify-center z-[10] cursor-pointer transition-[background-color] transition-300">
      <i class="pi pi-chevron-down text-[var(--p-surface-500)]"></i>
      <i class="absolute flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full -right-1 -bottom-1 text-white text-sm">
        <span class="px-1">{{ messagesNotViewed.length }}</span>
      </i>
    </div>
    <!-- Header -->
    <div class="p-2 bg-surface-0 dark:bg-surface-600 flex flex-row justify-between items-center gap-[10px]">
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
      <!-- <button
         v-if="subscriptionId && !contacts"
        @click="unsubscribe"
        class="descriptions-unsubscribe min-w-[115px] py-1 bg-[#D9D9D9]"
      >
        Отписаться
      </button> -->
      <!-- <div class="relative grow">
        <Select
          v-if="contactList && contactList.length > 0"
          class="custom-v-select"
          v-model="contactActiveId"
          id="contacts"
          :options="contactList"
          optionValue="id"
          optionLabel="name"
        />
        <ProgressSpinner
          v-if="loadingChat"
          :pt="{
            root: 'absolute left-[3px] right-[3px] top-[3px] bottom-[3px] bg-white',
          }"
        />
      </div> -->
      <div class="search-wrapper relative w-full">
        <InputText
          @input="onInputSearch"
          type="text"
          placeholder="Поиск"
          class="!py-[5px] rounded-none text-[15px] border-search-border focus:ring-4 focus:ring-input-focus-ring focus:ring-opacity-50 focus:!border-search-border"
          style="height: 32px"
          ref="searchRef"
        />
        <ProgressSpinner
            v-if="loadingSearch || loadingSearchDelayMin || loadingChat"
            :pt="{
              root: 'absolute left-[3px] right-[3px] top-[3px] bottom-[3px] bg-transparent h-auto w-auto',
            }"
          />
      </div>
    </div>

    <!-- Messages -->
    <div
      ref="chatBodyRef"
      @dragover.prevent
      @dragenter.prevent
      @drop="drop($event)"
      class="chat__bg relative flex flex-col flex-1 overflow-auto dark:bg-surface-950 bg-[#dad3cc]"
      :class="type == 'discussion' ? 'chat__bg--discussion' : ''"
    >

      <div class="preloader w-full h-full relative px-[12px]"
        v-if="!isMounted || loadingSearchDelayMin || loadingSearch || loadingChat">
        <div class="flex justify-center">
          <Skeleton width="100px" height="28px" class="mt-[24px] mb-[10px] bg-[#ffffff]"/>
        </div>
        <div class="flex">
          <Skeleton width="88px" height="69px" class="ml-auto mb-2 bg-[#ffffff]"/>
        </div>
        <div class="flex">
          <Skeleton width="120px" height="40px" class="ml-auto mb-2 bg-[#ffffff]"/>
        </div>
        <div class="flex">
          <Skeleton width="180px" height="69px" class="mr-auto mb-2 bg-[#ffffff]"/>
        </div>
        <!-- <div class="absolute w-[80px] h-[80px] top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2">
          <div class="w-full h-full rounded-full border-8 border-[#e5e5e5] border-t-transparent animate-spin"></div>
        </div> -->
      </div>

      <div class="chat__scroll-observer h-4" ref="scrollObserverRef" ></div>

      <div
        v-if="isMounted"
        v-show="!loadingSearchDelayMin && !loadingSearch && !loadingChat"
        ref="chatContent"
        class="chat__content relative py-2 flex flex-col grow">


        <div class="chat__date-title px-3 mx-auto text-surface-600 dark:text-surface-100 bg-[#ffffff80]"
              v-if="isEmpty">
                Нет сообщений
        </div>

        <template v-for="(data, index) in filteredMessages" :key="index">

          <div class="chat__day">
            <div
              class="chat__date sticky top-[10px] w-[100px] mx-auto mb-[10px] z-[10]"
            >
              <div class="chat__date-title text-surface-600 dark:text-surface-100 bg-[#ffffff80]">
                {{ index }}
              </div>
            </div>

            <template v-for="message in filteredMessages[index]"
              :key="message.id">

              <div
                class="chat__msg-wrapper flex px-3 mb-2 relative before:absolute before:inset-0 before:bg-[#B4D1E8] before:opacity-0 before:transition-opacity before:duration-500"
                :class="(message.user && message.user.id && message.user.id === me.id) ? 'justify-end' : 'justify-start'"
                :data-id="message.id"
              >
                <div
                  class="chat__msg chat-work__msg group relative overflow-hidden"
                  :class="
                    (message.user && message.user.id && message.user.id === me.id) ? 'chat-work__msg--me' :
                    (message.user && message.user.id && message.user.id === 42) ? 'chat-work__msg--client' : ''
                  "
                  >
                  <a
                    href=""
                    class="chat-work__msg-user"
                    v-if="message.user && !message.sameUser"
                  >
                  {{ message.user.name }}
                    <!-- {{ message.user.id === 42 ? customer_name : message.user.name }} -->
                  </a>
                  <!--  -->
                  <div v-if="message.reply_to && message.reply_to.id > 0"
                    class="pl-[10px] text-sm leading-[130%] border-l-2 border-solid border-[#fffff]">
                    {{message.reply_to && message.reply_to.user.name}}
                    <div class="whitespace-nowrap text-ellipsis overflow-hidden"
                    @click="(event) => repliedMsgClick(event, message.reply_to)">
                      <div v-if="message.text"
                        class="cursor-pointer"
                      >
                        {{message.reply_to && message.reply_to.text}}
                      </div>
                      <div v-if="!message.reply_to.text && message.reply_to.file">Прикреплен файл</div>
                    </div>
                  </div>
                    <!-- Изображение -->
                    <div v-if="message.file && message.file.mime.includes('image')" ref='imagesWrappers' 
                      :style="getImageStyle(message.file)" class="bg-[#eee]">
                      <a
                        :data-lg-size="`${message.file.dimensions[0]}-${message.file.dimensions[1]}`"
                        class="gallery-item block w-full h-full cursor-pointer"
                        :data-thumb="message.file.thumb ? `${apiBase}/chat/${message.file.thumb}` : `${apiBase}/chat/${message.file.url}`"
                        :data-src="`${apiBase}/chat/${message.file.url}`"
                        @click="galleryRef.launch($event, message.id)"
                      >
                        <img 
                          :data-src="message.file.thumb ? `${apiBase}/chat/${message.file.thumb}` : `${apiBase}/chat/${message.file.url}`" 
                          alt="" 
                          ref="imagesRefs"
                          class="w-full h-full object-cover" />
                      </a>
                    </div>
                    <!-- Аудио -->
                    <!-- <audio
                      controls
                      v-if="message.file && message.file.mime.includes('audio')"
                    >
                      <source
                        :src="`${apiBase}/chat/${message.file.url}`"
                        type="audio/mpeg"
                      />
                      Ваш браузер не поддерживает аудио элемент.
                    </audio> -->
                    <!-- Файлы pdf -->
                    <!-- <a`
                      class="flex"
                      :href="`${apiBase}/chat/${message.file.url}`"
                      :target="'_blank'"
                      v-if="
                        message.file &&
                        message.file.mime == 'application/pdf'
                      "
                    >
                      <img width="80" height="80"
                        :src="`/images/filetypes/${getFileTypeIcon(message.file.name)}`"
                        alt="file"
                      >

                      <span class="font-semibold pl-2 overflow-hidden break-words">
                        {{ message.file.name }}
                      </span>
                    </a>                       -->
                    <!-- Другие файлы -->
                    <a
                      class="flex cursor-pointer relative"
                      :href="`${apiBase}/chat/${message.file.url}`"
                      :target="['application/pdf','text/plain'].includes(message.file.mime) ? '_blank' : ''"
                      v-if="message.file &&
                        !message.file.mime.includes('image') &&
                        !message.file.mime.includes('audio') && 
                        !message.file.mime.includes('video')"                      
                    >
                      <img width="80" height="80"
                        :src="`/images/filetypes/${getFileTypeIcon(message.file.name)}`"
                        alt="file"
                      >
                      <span class="font-semibold pl-2 overflow-hidden break-words">
                        {{ message.file.name }}
                      </span>                        
                    </a>
                    <!-- Видео -->
                    <div v-if="message.file && message.file.mime.includes('video')">

                      <video
                        width="280"
                        controls
                        preload="metadata"
                      >
                        <source :src="`${apiBase}/chat/${message.file.url}#t=0.1`" :type="message.file.mime">
                      </video>                        

                    </div>
                    <!--Текст-->
                    <span v-if="!message.file" class="break-words">
                      {{ message.text }}
                    </span>
                

                  <span class="text-sm mt-1 text-right chat-work__created">
                    {{ dateFormat(message.created_at, true) }}
                  </span>
                  <div
                    @click="(e) => msgMenu(e,message)"
                    class=" chat__msg-menu-icon absolute w-5 h-5 top-1 right-1 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 rounded bg-[#d5d5d5]">
                    <i class="pi pi-chevron-down"></i>
                  </div>
                </div>
              </div>

            </template>
          </div>


        </template>

      </div>
    </div>

    <div
      v-if="showForm === 'reply'"
      class="entity-feed-form-wrapper z-50">
        <div class="entity-feed-form relative p-[10px] bg-white dark:bg-surface-600 rounded">
        <div @click="showForm = false; activeMessage = null;"
          class="group entity-feed-form__close absolute top-[5px] right-0 flex items-center justify-center w-6 h-6 text-[#92a3b4] rounded-full cursor-pointer">
          <svg width="20"
            height="20"
            class="text-[#92a3b4] group-hover:text-[#343f4a]">
            <use xlink:href="/images/sprite.svg#close" />
          </svg>
        </div>
          <div class="flex items-center">
            <i class="pi pi-reply mr-2 -scale-x-100 text-sm"></i>
            <div class="overflow-hidden">
              <div class="text-[15px] leading-[120%] text-[#42A5F5]">{{ activeMessage.user.name}}</div>
              <div class="overflow-hidden text-ellipsis">{{ activeMessage.text}}</div>
            </div>
          </div>
      </div>
    </div>

    <!--Upload File-->
    <CommonUploadFileForm
      :isShow="isShowFileForm"
      :uploadRoute="'/messages/upload'"
      :dealId="deal"
      :room="room"
      @close="closeFileForm"
      @filesUploaded="filesUploaded"
      ref="uploadFileFormRef"
      :selectedPhone="selectedUser && selectedUser.phone"
    />

    <!-- Input -->
    <div class="chat-input flex px-1 pt-[2px] items-center text-surface-700 dark:text-surface-0 cursor-pointer dark:bg-surface-600">
      <!--Отправить файл-->
      <div class="chat-send-file p-1 cursor-pointer" @click="openFileForm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            fill="currentColor"
            fill-opacity=".5"
            d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
          ></path>
        </svg>
        <!-- <input
          id="file-input"
          ref="fileInput"
          @change="
            file = $event.target.files[0];
            uploadFile();
          "
          style="display: none"
          type="file"
        /> -->
      </div>

      <!-- Текст сообщения -->
      <div class="flex-1 relative !outline-0 text-[0]">
        <span
          class="recipient absolute top-2 left-2 bg-surface-300 dark:bg-surface-600 leading-tight rounded-sm"
          :class="selectedUser ? 'px-1 pt-px pb-[3px]' : 'w-0'"
          tabindex="0"
          ref="userInputRef"
          @click="openUserSelect"
        >
        </span>
        <Textarea
          class="w-full !p-2 lg:!p-2 text-base !leading-[22px] !outline-0 border-none"
          placeholder="Введите сообщение"
          autoResize
          style="max-height: 300px;"
          rows="1"
          pt:root:id="message-input"
          @paste="paste($event)"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact.prevent="newMessage += '\n'"
          v-model="newMessage"
          ref="newMessageTextareaRef"
        />
      </div>

      <!-- Список пользователей -->
      <button 
        v-if="contactList.length > 0"  
        class="recipient text-3xl leading-none font-medium text-[var(--p-surface-700)] w-[32px] h-[32px] rounded-sm opacity-50"
        tabindex="0"
        type="button"
        label="@"
        @click="openUserSelect"
      >
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
          width="24px" height="24px" viewBox="0 0 441.164 441.164"
          xml:space="preserve">
        <g>
          <path d="M220.582,441.164c6.903,0,12.5-5.597,12.5-12.5s-5.598-12.5-12.5-12.5c-104.27,0-189.099-87.738-189.099-195.582
            S116.312,25,220.582,25s189.1,87.738,189.1,195.582c0,67.736-30.037,109.027-58.148,125.085
            c-13.99,7.992-28.035,9.798-36.654,4.715c-8.775-5.177-10.477-16.616-10.354-25.303c0-0.058,0-0.115,0-0.173V106.163
            c0-6.903-5.598-12.5-12.5-12.5s-12.5,5.597-12.5,12.5v37.494c-1.338-1.837-2.727-3.637-4.168-5.387
            c-18.773-22.77-43.943-35.309-70.876-35.309c-26.932,0-52.103,12.54-70.876,35.309c-18.198,22.07-28.22,51.269-28.22,82.217
            s10.021,60.146,28.22,82.217c18.773,22.771,43.944,35.31,70.876,35.31c26.933,0,52.103-12.541,70.876-35.31
            c1.441-1.75,2.83-3.55,4.168-5.388v27.505c-0.277,21.592,7.766,38.314,22.654,47.096c16.574,9.774,39.662,8.078,61.754-4.542
            c34.201-19.536,70.748-68.357,70.748-146.793c0-58.845-22.221-114.188-62.568-155.834C331.658,22.995,277.844,0,220.582,0
            C163.318,0,109.504,22.995,69.053,64.748c-40.349,41.646-62.57,96.989-62.57,155.834c0,58.846,22.221,114.188,62.569,155.834
            C109.504,418.169,163.318,441.164,220.582,441.164z M204.479,313.012c-40.856,0-74.096-41.507-74.096-92.525
            c0-51.02,33.239-92.526,74.096-92.526c40.856,0,74.097,41.507,74.097,92.526C278.576,271.505,245.336,313.012,204.479,313.012z"/>
        </g>
        </svg>
      </button>

      <!-- Emoji picker -->
      <div class="chat-emoji btn-wrapper relative" v-outside="() => {if (showForm == 'emoji') showForm = '' }">
        <div class="p-1"
          @click="showForm='emoji'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              opacity=".5"
              fill="currentColor"
              d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
            ></path>
          </svg>
        </div>
        <div
          v-if="showForm === 'emoji'"
          class="entity-feed-form-wrapper form-emoji absolute bottom-full right-0 mt-auto order-[10] px-3 z-20">
          <div class="entity-feed-form relative">
            <div @click="showForm = false"
              class="group entity-feed-form__close absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-[#92a3b4] bg-white rounded-full cursor-pointer">
              <svg width="20"
                height="20"
                class="text-[#92a3b4] group-hover:text-[#343f4a]">
                <use xlink:href="/images/sprite.svg#close" />
              </svg>
            </div>
            <EmojiPicker :native="true" :disable-skin-tones="true" @select="onSelectEmoji" />
          </div>
        </div>        
      </div>

      <div
        @click="sendMessage"
        class="p-1 cursor-pointer"
        v-tooltip.top="{value:``, autoHide: false}"
        autoHide = "false"
      >
        <svg
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity=".5" fill="currentColor">
            <path
              d="m3.45559904 3.48107721 3.26013002 7.74280879c.20897233.4963093.20897233 1.0559187 0 1.552228l-3.26013002 7.7428088 18.83130296-8.5189228zm-.74951511-1.43663117 20.99999997 9.49999996c.3918881.1772827.3918881.7338253 0 .911108l-20.99999997 9.5c-.41424571.1873968-.8433362-.2305504-.66690162-.6495825l3.75491137-8.9179145c.10448617-.2481546.10448617-.5279594 0-.776114l-3.75491137-8.9179145c-.17643458-.41903214.25265591-.83697933.66690162-.64958246z"
            />
            <path d="m6 12.5v-1h16.5v1z" />
          </g>
        </svg>
      </div>
      <!-- <button
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
      </button> -->
      <!-- <button v-show="isRecording" @click="stopRecording" class="">
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
      </button> -->
      <audio class="hidden" ref="audiosRefs"></audio>
    </div>

    <!-- Listbox -->
    <Listbox
      v-if="isInputUserList"
      v-show="isInputUserListShow"
      v-model="selectedUser" 
      @update:modelValue="selectUser"
      ref="userSelectRef"
      pt:root:class="absolute w-full bottom-[43px] z-20 rounded-none"
      :ptOptions = "{mergeProps: true}"
      optionLabel="name" 
      optionGroupLabel="label" 
      optionGroupChildren="items"
      :options="userListFiltered" 
      @blur="userListBlur"
      @keydown.enter.exact.prevent="addSelectedUsers"
    >
    <template #footer="slotProps">
        <div class="flex align-items-center">
          <button 
            class="w-full py-1 px-2 bg-slate-400 text-white"
            @click="removeSelectedUsers"
          > 
            Очистить
          </button>
        </div>
    </template>
    </Listbox>
  </div>
  <Menu ref="msgMenuElRef" id="overlay_menu" :model="msgMenuItems" :popup="true" />
  <CommonMediaGallery
    :groupMessages = "filteredMessages"
    :apiBase="apiBase"
    ref="galleryRef"
    type="chat"
  />
</template>

<script setup>
  import InputText from "primevue/inputtext";
  import Textarea from "primevue/textarea";
  import AvatarGroup from "primevue/avatargroup";
  import Avatar from "primevue/avatar";
  import { ref, nextTick } from "vue";
  import EmojiPicker from 'vue3-emoji-picker';
  import 'vue3-emoji-picker/css';
  import { fetchMessages, fetchDeal, createMessage, fetchFile  } from '@/services/api/chatWorkServices.js';
  import { setImboxMessageViewed } from '@/services/api/imboxServices.js';
  import throttle from "lodash.throttle";

  const ptDialog = {
    root: ({ state }) => ({
      class: [
        // Shape
        "rounded-lg",
        "shadow-lg",
        "border-0",

        // Size
        "max-h-[90vh]",
        "w-[50vw]",
        "min-w-[320px]",
        "md:min-w-[600px]",
        "max-w-[1000px]",
        "m-0",

        // Color
        "dark:border",
        "dark:border-surface-700",

        // Transitions
        "transform",
        "scale-100",

        // Maximized State
        {
          "transition-none": state.maximized,
          "transform-none": state.maximized,
          "!w-screen": state.maximized,
          "!h-screen": state.maximized,
          "!max-h-full": state.maximized,
          "!top-0": state.maximized,
          "!left-0": state.maximized,
        },
      ],
    }),
    header: {
      class: [
        // Flexbox and Alignment
        "flex items-center justify-between",
        "shrink-0",

        // Spacing
        "py-4 px-6",

        // Shape
        "border-t-0",
        "rounded-tl-lg",
        "rounded-tr-lg",

        // Colors
        "bg-surface-0 dark:bg-surface-800",
        "text-surface-700 dark:text-surface-0/80",
      ],
    },
    mask: {
      class: [
        "transition-all",
        "duration-300",
        "backdrop-blur-none",
        "bg-[#00000066]",
      ],
    },
  };

  const props = defineProps( {
    type: String,
    deal: String,
    room: String,
    isUnreadOpenTab: Boolean, // Пришло сообщение на открытую вкладку
    contacts: { type: Array, default: null },
    propClass: String,
    isActive: Boolean,
  });

  const emit = defineEmits(['last-message']);

  const me = ref({});
  const newMessage = ref("");
  const messages = ref([]); // Только для загрузки сообщений первый раз после открытия чата, новые добавляются к существующему набору
  const groupMessages = ref({}); // Все сообщения, сгруппированные по дате, сюда добавляем новые из сокета
  const users = ref([]); // Активные пользователи в чате
  const file = ref(null);
  const isRecording = ref(false); // Записывается аудио сообщение
  const mediaRecorder = ref(null);
  const chunks =  ref([]);
  const audio = ref(null);
  const searchTerm = ref("");
  const showForm = ref(false);
  const activeMessage = ref(null);
  const msgMenuItems = ref([
    {
      label: 'Ответить',
      command: (e) => {
                  showForm.value = 'reply';
                  document.querySelector(messageInputSelector).focus();
              }
    }
  ]); //Массив для контекстного меню сообщения
  const isMounted = ref(false);
  const isEmpty = ref(false);
  // const subscriptionId = ref(null);
  const loadingSearch = ref(false);
  const loadingSearchDelay = ref(null);
  const loadingSearchDelayMin = ref(null);
  const messageInputSelector = '#message-input';
  // messageInputRows: 1,
  const msgQueue = ref([]);
  const isMsgQueueSending = ref(false);
  const contactActiveId = ref(null);
  const roomPrev = ref(null);
  const contactList = ref([]);
  // roomInner: null, // Использовать вместо room внутри компонента
  const loadingChat = ref(false);
  const isInputUserList = ref(false);
  const isInputUserListShow = ref(false);
  const userList = ref([]);
  const userListFiltered = ref([]);
  const selectedUser = ref(null);
  // selectedUsersAll: [],
  const isShowFileForm = ref(false);
  const observer = ref(null);
  const lastLoadedIndex = ref(null);
  const firstDayEl = ref(null);
  const firstLoad = ref(true);
  const $api = useNuxtApp();
  const apiBase = ref('');

  const scrollObserverRef = ref(null);
  const chatBodyRef = ref(null);
  const chatRef = ref(null);
  const galleryRef = ref(null);
  const uploadFileFormRef = ref(null);
  const userInputRef = ref(null);
  const newMessageTextareaRef = ref(null);
  const audiosRefs = ref(null);
  const imagesRefs = ref(null);
  const searchRef = ref(null);
  const userSelectRef = ref(null);
  const msgMenuElRef = ref(null);

  const messagesNotViewed = ref([]);

  onUpdated(async () => {
    await nextTick();
    processImages();
  });


  onMounted( async () => {
    const runtimeConfig = useRuntimeConfig();
    apiBase.value = runtimeConfig.public.apiBase;

    // Получить id текущего пользовтаеля
    const currentUser = useSanctumUser();
    me.value = currentUser.value;

    await nextTick();
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
    recalcUserInput();

    chatBodyRef.value.addEventListener('scroll',throttle((event) => {
      for (let i = 0; i < messagesNotViewed.value.length; i++) {
        if (messagesNotViewed.value[i] < event.target.scrollTop + event.target.clientHeight) {
          messagesNotViewed.value.splice(i, 1);
          i--;
        } else {
          break;
        }
      }      
    },300))

  });

  onUnmounted(() => {
    Echo.leave(`chat.${props.room}`);
  });

  const filteredMessages = computed(() => {
    if (!searchTerm.value) {
      loadingSearch.value = false;
      return groupMessages.value;
    }
    if (contactActiveId.value) {

    }
    let result = {};
    for (let key of Object.keys(groupMessages.value)) {
        let array = groupMessages.value[key];
        array = array.filter((message) => {
          return message.text && message.text.toLowerCase().includes(searchTerm.value.toLowerCase())
          })
        if (array.length > 0) {
          result[key] = array;
        }
    }
    loadingSearch.value = false;
    return result;
  });


  const getContacts = async () => {
    // if ((!props.contacts || props.contacts.length == 0) && props.type == 'deal') {
    if (!props.contacts && ( props.type == 'deal' || (props.room && props.room.includes('deal')) ) ) {
      let deal = props.deal ? props.deal : props.room.split('__')[1];
      const response = await fetchDeal(deal);
      if (response.success) {
        contactList.value = response.deal.contacts;
      }
    }
  };  

  watch(() => props.isActive, async (newValue) => {
    if (newValue) {
      await nextTick();
      recalcUserInput();
      scrollChatBody();
    }
  })  

  watch(() => props.room, 
    async (newValue, oldValue) =>  {
      // props room обновился
      loadingChat.value = true;
      //Список контактов
      if (props.contacts) {
        contactList.value = props.contacts;
      }
      // Нет списка контактов
      await getContacts();
      //Активный контакт из room
      // let roomParams = newValue && newValue.split('__');
      // в room есть контакт - обновить активный контакт
      // if (contactList.value && contactList.value.length > 0 && roomParams && roomParams.length > 2) {
      //   let activePhone = roomParams && roomParams[2];
      //   let contactActive = contactList.value.find((contact) =>
      //     {
      //       return contact.phone == activePhone;
      //     });
      //   if (contactActive) {
      //     contactActiveId.value = contactActive.id;
      //   }
      // }
      // Нет активного контакта
      // if (contactList.value && contactList.value.length > 0 && !contactActiveId.value) {
      //   contactActiveId.value = contactList.value[0].id;
      // }
      //
      if (roomPrev.value) {
        Echo.leave(`chat.${roomPrev.value}`);
      }
      getMessages();
      webSocketsSetup();

      loadingChat.value = false;
    },
    {immediate: true}
  ),
    
  watch(filteredMessages, async () => {
    await nextTick();
    if (firstDayEl.value) {
      chatBodyRef.value.scrollTop = firstDayEl.value.offsetTop;
      firstDayEl.value = null;
    }
    if (firstLoad.value) {
      scrollChatBody();
      firstLoad.value = false;
    }
    processImages();
  });


  watch(messages, async (value) => {
      lastLoadedIndex.value = null;
      getPortion(value);
      scrollChatBody();
      await nextTick();
      setObserver();
    },
    { deep: true });


  watch(groupMessages, (value) => {
      if (!isObjectEmpty(value) && isEmpty.value) {
        isEmpty.value = false;
      }
    },
    {deep: true});


  watch(props.isUnreadOpenTab, (value) => {
    if (value) {
      chatRef.value.addEventListener('mousemove', async () => {
        // Запрос обнуляет счетчик непрочитанных
        const response = await fetchMessages(props.room);      
        // this.$api.get(`/messages`,{
        //   room: props.room
        // })
        // .then(
        //   (error) => {
        //     console.log(error);
        //   }
        // );         
      }, { once: true });
    }
  });


  watch(props.contacts, (value) => {
      contactList.value = value;
    },
    { deep: true }
  );

    const processImages = async () => {
      await nextTick();
      if (!imagesRefs.value) {
        return;
      }
      let unprocessed = imagesRefs.value.filter((image) => image.dataset && image.dataset.src);
      let lastImageLoaded;
      let proms = [];
      for (let i=unprocessed.length-1; i>-1; i--) {
        let image = unprocessed[i];
        if (image.dataset && image.dataset.src) {
                image.setAttribute('loading','lazy');
                image.setAttribute('src',image.dataset.src);
                image.removeAttribute('data-src');
        }
      }      
    };
    const getMessages = async () => {
      loadingChat.value = true;

      const messagesData = await fetchMessages(props.room);
      if (messagesData.success) {
        if (messagesData.data.length !== 0) {
          messages.value = messagesData.data;
        } else {
          messages.value = [];
          isEmpty.value = true;
        }
        isMounted.value = true;
        loadingChat.value = false;    
        if (messages.value.length > 0 &&
            messages.value[messages.value.length - 1].phone
            ) {
          setSelectedUser(messages.value[messages.value.length - 1].phone);
        }
        // Для чатов типа 'user' возвращаем последнее сообщение
        if (props.type == 'user' && messages.value.length > 0) {
          emit('last-message', messages.value[messages.value.length - 1]);
        }
      } else {
        console.log(messagesData.error);
        loadingChat.value = false;
      }
    };
    const webSocketsSetup = () => {    
      Echo.join(`chat.${props.room}`)
        .here((hereUsers) => {
          users.value = hereUsers
        })
        .joining((user) => users.value.push(user))
        .leaving(
          (user) => (users.value = users.value.filter((u) => u.id !== user.id))
        )
        .error((error) => {
          console.error(error);
        })
        .listen("NewMessage", (e) => {
          addMessage(e.message);
        })    
    }
    const setViewed = async (messageId) => {
        const respone = await setImboxMessageViewed(messageId);
    }
    // Подгружает предыдущие или последние 2 дня и добавляет к сообщениям
    const getPortion = async () => {
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
        if (lastLoadedIndex.value == 0 && observer.value) {
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
    const getRepliedMsg = (id) => {
      let info = {};
      info = messages.value.find((msg) => {
        return msg.id === id
      });
      return info;

    };
    const scrollToSmoothly = (pos, currentPos, time) => {
      var start = null;
          if (time == null) time = 500;
          pos = +pos, time = +time;

          const step = (currentTime) => {
            start = !start ? currentTime : start;
            var progress = currentTime - start;

            if (currentPos < pos) {
              chatBodyRef.value.scrollTop = (pos - currentPos) * progress / time + currentPos;
            } else {
              chatBodyRef.value.scrollTop = currentPos - (currentPos - pos) * progress / time;
            }

            if (progress < time) {
              window.requestAnimationFrame(step);
            } else {
              chatBodyRef.value.scrollTop = pos;
            }
          }

          window.requestAnimationFrame(step);
    };
    const repliedMsgClick = async (event,repliedMsg) => {

        let messageEl = document.querySelector(`[data-id="${repliedMsg.id}"]`);
        if (!messageEl && searchTerm.value) {
         searchTerm.value = null;
          searchRef.value = null;
        }
        await nextTick();
        messageEl = document.querySelector(`[data-id="${repliedMsg.id}"]`);
        chatBodyRef.value.scrollTop = scrollToSmoothly(messageEl.offsetTop - chatBodyRef.value.offsetHeight / 2, chatBodyRef.value.scrollTop ,500);

              messageEl.classList.remove(['before:!duration-1000']);
              messageEl.classList.add(['before:!opacity-100']);
              messageEl.addEventListener('transitionend',(event) => {
                messageEl.classList.add('before:!duration-[2000ms]');
                messageEl.classList.remove('before:!opacity-100');
              },{once: true});

    };
    const msgMenu = (event,message) => {
      activeMessage.value = message;

      if (message.user_id !== me.value.id){
        msgMenuItems.value = [
          {
            label: 'Ответить',
            command: (e) => {
              showForm.value = 'reply';
              document.querySelector(messageInputSelector).focus();
            }
          },
          {
            label: 'Отметить прочитанным',
            command: (e) => {
              setViewed(activeMessage.value.id);
            }
          }
        ]
      }
      else {
        msgMenuItems.value = [{
            label: 'Ответить',
            command: (e) => {
              showForm.value = 'reply';
              document.querySelector(messageInputSelector).focus();
            }
          }]
      }

      msgMenuElRef.value.toggle(event);
    };
    // Дату из строки
    const getDate = (date) => {
      return new Date(
        new Date(Date.parse(date)).toLocaleString("en-US", { timeZone: "UTC" })
      );
    };
    // Строку с датой без времени
    const getDateString = (date) => {
      return date.split("T")[0];
    };
    // const startRecording = () => {
    //   navigator.mediaDevices
    //     .getUserMedia({ audio: true })
    //     .then((stream) => {
    //       mediaRecorder.value = new MediaRecorder(stream);
    //       mediaRecorder.value.start();
    //       isRecording.value = true;

    //       mediaRecorder.value.ondataavailable = (e) => {
    //         chunks.value.push(e.data);
    //       };
    //     })
    //     .catch((err) => {
    //       console.log("Устройство не найдено:", err);
    //     });
    // };
    // const stopRecording = () => {
    //   if (!mediaRecorder.value) {
    //     console.log("Медиа-рекордер не инициализирован");
    //     return;
    //   }

    //   mediaRecorder.value.stop();
    //   isRecording.value = false;

    //   mediaRecorder.value.onstop = () => {
    //     let blob = new Blob(chunks.value, {
    //       type: "audio/ogg; codecs=opus",
    //     });
    //     audiosRefs.value.src = window.URL.createObjectURL(blob);

    //     // Создаем объект File из Blob
    //     file.value = new File([blob], "recording.ogg", {
    //       type: "audio/ogg; codecs=opus",
    //     });

    //     // Вызываем функцию uploadFile с созданным файлом
    //     uploadFile();
    //   };
    // };
    // Добавление файлов
    const openFileForm = () => {
      showForm.value = '';
      isShowFileForm.value = true;
    };
    const closeFileForm = () => {
      isShowFileForm.value = false;
    };
    const filesUploaded = () => {
      newMessage.value = "";
    };
    const drop = async(event) => {
      event.preventDefault();
      openFileForm();
      await nextTick();
      uploadFileFormRef.value.fileUploadComp.onDrop(event);
    };
    const paste = async (event) => {
      const files = (event.clipboardData || event.originalEvent.clipboardData).files;
      if (files.length > 0) {
        event.preventDefault();
        openFileForm();
        await nextTick();
        const dataTransfer = new DataTransfer();
        for (let key of Object.keys(files)) {
          dataTransfer.items.add(files[key]);
        }
        const fakeEvent = new DragEvent("drop", { dataTransfer });
        uploadFileFormRef.value.fileUploadComp.onFileSelect(fakeEvent);
      }
    };
    //
    const sendFromQueue = async () => {
      isMsgQueueSending.value = true;
      if (msgQueue.value.length > 0) {
        let curMsgSend = msgQueue.value[0];
        msgQueue.value.shift();
        await curMsgSend();
        sendFromQueue();
      } else {
        isMsgQueueSending.value = false;
      }
    };
    const sendMessage = () => {

      if (newMessage.value.length == 0) {
        return;
      }

      let message = newMessage.value;
      let activeMessageSaved = {...activeMessage.value};
      newMessage.value = "";
      activeMessage.value = null;
      showForm.value = null;
      document.getElementById("message-input").value = "";

      let recipient = null;
      if (selectedUser.value) {
        if (selectedUser.value.phone) {
          recipient = 42;
        }
        else {
          recipient = selectedUser.value.id;
        }
      }

      let messageData =  {
              room: props.room,
              text: message,
              reply_to: activeMessageSaved.id ? activeMessageSaved.id : 0,
              recipient: recipient,
              phone: selectedUser.value && selectedUser.value.phone ? selectedUser.value.phone : null
      };

      let send = async () => {

        let response = await createMessage(messageData);      
        if (response.success) {
          activeMessageSaved = null;
        }
      //   this.$api
      //     .post('/messages', 
      //       {
      //         room: props.room,
      //         text: message,
      //         reply_to: activeMessageSaved.id ? activeMessageSaved.id : 0,
      //         recipient: recipient,
      //         phone: selectedUser.value && selectedUser.value.phone ? selectedUser.value.phone : null
      //       }
      //     )
      //     .then(
      //       (response) => {
      //         activeMessageSaved = null;
      //         // axios
      //         //   .post(route("notifications.send"), {
      //         //     room: this.room,
      //         //     notification: message,
      //         //     data: this.deal
      //         //   })
      //         //   .then(
      //         //     () => {
      //         //       console.log("Последнее сообщение обновлено");
      //         //     },
      //         //     (error) => {
      //         //       console.log(
      //         //         "[ChatWork] Ошибка при обновлении последнего сообщения:",
      //         //         error
      //         //       );
      //         //     }
      //         //   );
      //       },
      //       (error) => {
      //         console.log("[ChatWork] Ошибка при отправке сообщения:", error);
      //       }
      //     );
      // };
      };
     msgQueue.value.push(send);
      if (!isMsgQueueSending.value) {
        sendFromQueue();
      }
    };
    const addNotViewed = async (message) => {
      await nextTick();
      let messageEl = document.querySelector(`[data-id='${message.id}']`);
      if (chatBodyRef.value.scrollTop + chatBodyRef.value.clientHeight < messageEl.offsetTop + messageEl.clientHeight/2) {
        messagesNotViewed.value.push(messageEl.offsetTop + messageEl.clientHeight/2);
      }
    }
    const addMessage = async (message) => {
        let created_at_date = message.created_at.split("T")[0]; // Оставляем только дату
         //Если ответ, ищем и добавляем сообщение, на которое ответ
        if (message.reply_to > 0) {
          for (let key of Object.keys(groupMessages.value)) {
            let repliedMsg = groupMessages.value[key].find((msg)=>msg.id === message.reply_to);
            if (repliedMsg) {
              message.reply_to = repliedMsg;
              break;
            }
          }
        }
        //  Добавляем в массив groupMessages за нужную дату
        if (!groupMessages.value[created_at_date]) {
          groupMessages.value[created_at_date] = [];
        }
        if (groupMessages.value[created_at_date].length > 0) {
          let lastMessage = groupMessages.value[created_at_date][groupMessages.value[created_at_date].length - 1];
          if (lastMessage.user_id === message.user_id) {
            message.sameUser = true;
          }
        }
        groupMessages.value[created_at_date].push(message);
        if (message.user.id == me.value.id) {
          scrollChatBody();
        } else {
          await addNotViewed(message);
        }
    }
    const onSelectEmoji = (emoji) => {
      newMessage.value += emoji.i;
    };
    // const uploadFile = () => {
    //   if (file.value) {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       // Создаем объект FormData и добавляем в него файл
    //       let formData = new FormData();
    //       formData.append("file", file.value);
    //       formData.append("room", props.room);
    //       if (selectedUser.value && selectedUser.value.phone) {
    //         formData.append("phone", selectedUser.value.phone);
    //       }

    //         this.$api('/messages/upload',formData).then(
    //           () => {
    //             newMessage.value = "";
    //           },
    //           (error) => {
    //             console.log(error);
    //           }
    //         );

    //       file.value = null; // Очищаем файл после отправки
    //       document.getElementById("file-input").value = "";
    //     };
    //     reader.readAsDataURL(file.value);
    //   }
    // };
    // Группирует аргумент по дате и добавляет к результату groupMessages
    const groupByDate = (messages) => {
      let _groupMessages = {};

      if (messages.length == 0) {
        return;
      }
      let groupArr = Object.keys(messages).reduce((acc, key) => {
        acc.push({...messages[key], key: key});
        return acc;
      }, []);
      _groupMessages = groupArr.reduce((acc, cur) => {
        let date = cur['created_at'].split('T')[0]; // Оставляем только дату
        (acc[date] = acc[date] || []).push(cur);  // Если нет acc[date], то создаем пустой
        return acc;
      }, {});
      for (let key of Object.keys(_groupMessages)) {
        _groupMessages[key].reduce((acc,cur) => {
          cur.sameUser = !!(cur.user_id && acc === cur.user_id);
          return cur.user_id;
        },0);

      }
      groupMessages.value = {..._groupMessages, ...groupMessages.value};
    };
    const scrollChatBody = async () => {
      await nextTick();
      if (chatBodyRef.value) {
        chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
      }
      if (document.documentElement.clientWidth > 1023) {
        let input = document.querySelector(messageInputSelector);
        if (input) {
          input.focus();
        }
      }
    };
    const isObjectEmpty = (obj) => {
      for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
          return false;
        }
      }
      return true;
    };
    const unsubscribe = () => {

      // axios
      //     .get(route('unsubscription',this.subscriptionId))
      //     .then(
      //       (response) => {
      //         this.$emit('unsubscribe',this.subscriptionId);
      //       },
      //       (error) => {
      //         console.log("Ошибка unsubscribe:", error);
      //       }
      //     );
    };
    const onInputSearch = (event) => {
      if (loadingSearchDelay.value) {
        clearTimeout(loadingSearchDelay.value);
      }
      loadingSearchDelay.value = setTimeout(() => {
      loadingSearch.value = true;

        searchTerm.value = event.target.value;

        loadingSearchDelayMin.value = true;
        setTimeout(() => {loadingSearchDelayMin.value = false},600);
      }, 1500);
    };
    const userListBlur = (event) => {
      let overlay = event.explicitOriginalTarget 
        && event.explicitOriginalTarget.nodeType == 1 
        && event.explicitOriginalTarget.closest('div[data-pc-name="listbox"]');
      if (event.explicitOriginalTarget && event.explicitOriginalTarget.nodeType == 1 && !overlay) {
        isInputUserListShow.value = false;
      }
    };
    const recalcUserInput = () => {
      let userInput = userInputRef.value;
      let width = userInput.clientWidth;
      let textarea = newMessageTextareaRef.value.$el;
      textarea.style.textIndent = `${width + 2}px`;
    };
    const addSelectedUsers = async () => {
      let userInput = userInputRef.value;
      userInput.innerText = selectedUser.value?.name ? `@ ${selectedUser.value.name}` : '';
      await nextTick();
      recalcUserInput();
      isInputUserListShow.value = false;
    };
    const removeSelectedUsers = () => {
      // selectedUser.value = {};
      selectedUser.value = null;
      addSelectedUsers();
    };  
    const selectUser = (event) => {
      addSelectedUsers();
    };
    const setSelectedUser = (userPhone) => {
      let contact = contactList.value.find(item => item.phone == userPhone);
      if (contact) {
        selectedUser.value = {...contact};
        addSelectedUsers();
      }
    };
    const openUserSelect = async () =>  {
      if (!isInputUserList.value) {
        isInputUserList.value = true;
      }
      isInputUserListShow.value = !isInputUserListShow.value;
      await nextTick();
      let ul = userSelectRef.value.$el.querySelector('ul');
      ul.focus();

      if (userList.value.length == 0) {
        userList.value= [
          { label: 'Контакты',
            code: 'contacts',
            items: [...contactList.value]
          },
        ]
        userListFiltered.value = userList.value;
      }
      
    };


</script>

<style scoped>
</style>
