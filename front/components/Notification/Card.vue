<script setup>
const props = defineProps({
  isUnread: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['read'])

const showFull = ref(false)
const isOverflowing = ref(false)
const isTransition = ref(false)
const contentRef = ref(null)

const checkOverflow = () => {
  if (contentRef.value) {
    isOverflowing.value = contentRef.value.scrollHeight > 84
  }
}

const toggleShowFull = () => {
  isTransition.value = true
  showFull.value = !showFull.value
  setTimeout(() => {
    isTransition.value = false
  }, 300)
}

onMounted(checkOverflow)
onUpdated(checkOverflow)
</script>

<template>
  <div class="notification-card relative p-2 pr-[6px] mb-1 text-[12px] leading-tight font-medium text-sidebar-text bg-white dark:bg-[#4B5A71] rounded-md cursor-pointer">
    <div class="mr-[45px] mb-1 overflow-hidden" :style="{ maxHeight: showFull ? 'none' : '48px' }" :class="{ 'transition-all duration-300 ease-in-out': isTransition }">
      <div class="notification-card__header pr-[6px] mb-1 text-[13px] text-surface-700 dark:text-surface-100">
        <slot name="header"></slot>
      </div>
      <div class="notification-card__text">
        <slot name="text"></slot>
      </div>
    </div>
    <button
        @click.stop="toggleShowFull"
        class="absolute bottom-0 left-0 p-1.5 text-[10px] text-slate-400 hover:text-slate-700 transition-colors"
    >
      {{ showFull ? "Свернуть" : "Развернуть" }}
    </button>
    <div class="notification-card__bottom flex justify-end">
      <slot name="bottom"></slot>
    </div>
    <div class="notification-card__btns absolute right-1 top-1 flex gap-[7px]">
      <button
          v-show="isUnread"
          class="group flex shrink-0 items-center justify-center w-[17px] h-[17px] text-sm rounded-full bg-green-500"
          @click.stop="emit('read')"
          title="Пометить прочитанным"
      >
        <svg width="11"
             height="6"
             class="text-surface-100 group-hover:text-surface-0">
          <use xlink:href="/images/sprite.svg#double-check" />
        </svg>
      </button>
    </div>
  </div>
</template>