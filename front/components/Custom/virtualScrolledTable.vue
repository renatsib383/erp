<script setup>
const props = defineProps({
  value: Array,
  columns: Array,
  rowHeight: {
    type: Number,
    default: 38
  },
  sortedColumns: Object,
})
const emit = defineEmits(['row-click'])

const containerRef = ref(null)
const startIndex = ref(0) //с какой строки начинать рендер
const step = ref(10) // количество строк помещающих в видимую область
const overscan = 0 //  запас по строкам (рендерим чуть больше, чтобы избежать мигания) // Пока на стадии тестирования

const totalHeight = computed(() => props.value.length * props.rowHeight) // высота всех строк (для расчёта заглушек).

const visibleRows = computed(() => { // список строк, которые отрисовываются.
  const safeStart = Math.max(startIndex.value - overscan, 0)
  const end = safeStart + step.value + overscan * 2
  return props.value.slice(safeStart, end)
})

// Заглушки нужны, чтобы сохранить правильную прокрутку. создаётся иллюзия, что таблица длинная и как будто все строки отрисованы
const firstRowHeight = computed(() => startIndex.value * props.rowHeight)
const lastRowHeight = computed(() => totalHeight.value - (firstRowHeight.value + visibleRows.value.length * props.rowHeight))

const updateScroll = (e) => {
  const scrollTop = containerRef.value?.scrollTop || 0
  startIndex.value = Math.floor(scrollTop / props.rowHeight)
  if(e) emit('scroll', e)
}

const updateStep = () => {
  if (containerRef.value) {
    const height = containerRef.value.clientHeight
    step.value = Math.ceil(height / props.rowHeight)
  }
}

onMounted(() => {
  updateStep()
  containerRef.value?.addEventListener('scroll', updateScroll)
})

watch(() => props.value, () => {
  updateStep()
  updateScroll()
})

const getValue = (obj, path) => {
  if (!obj || !path) return ''

  const value = path.includes('.')
      ? path.split('.').reduce((acc, key) => acc?.[key], obj)
      : obj[path]

  if (typeof value === 'number') return formatNumber(value);

  return value ?? ''
}
</script>

<template>
  <div ref="containerRef" class="w-full h-full overflow-auto scroll-smooth">
    <table class="text-sm w-full">
      <thead class="custom-table-thead select-none">
        <tr>
        <th class="px-2 py-2 font-semibold w-[73px]">№</th>
        <th
            v-for="col in columns"
            :key="col.field"
            class="px-2 py-1 font-semibold"
        >
          <span class="flex items-center gap-1 justify-center">
            <span>{{ col.header }}</span>
            <span
                v-if="col?.sortable"
                class="cursor-pointer p-0.5 pi"
                :class="(sortedColumns[col.field] && sortedColumns[col.field] >= 1) ? 'pi-sort-amount-up-alt' : 'pi-sort-amount-down'"
                @click="emit('sort', col.field)"
            />
          </span>
        </th>
      </tr>
      </thead>
      <tbody>
        <!-- Верхняя заглушка -->
        <tr :style="{ height: `${firstRowHeight}px` }">
          <td :colspan="columns.length + 1" class="p-0"></td>
        </tr>

        <!-- Видимые строки -->
        <tr
            v-for="(item, index) in visibleRows"
            :key="startIndex + index"
            @click="emit('row-click', item)"
            class="custom-table-tr"
        >

          <td v-if="item.id" class="py-2 pl-2 flex items-center gap-2 text-center text-surface-500 font-[500]" :style="item.isDuplicate ? 'color:red' : null">
              <span @click.stop="emit('openPage', item)" class="pi pi-external-link text-[17px] cursor-pointer pt-0.5" />
              <span>{{ startIndex + index + 1 }}</span>
          </td>
          <td v-else>{{ startIndex + index + 1 }}</td>

          <td v-for="col in columns" :key="col.field" class="py-2">
            <slot
                :name="`body-${col.field}`"
                :data="item"
                :row="item"
                :index="startIndex + index"
            >
              {{ getValue(item, col.field) }}
            </slot>
          </td>

        </tr>

        <!-- Нижняя заглушка -->
        <tr :style="{ height: `${lastRowHeight}px` }">
          <td :colspan="columns.length + 1" class="p-0"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
