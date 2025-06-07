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
const overscan = 5 //  запас по строкам (рендерим чуть больше, чтобы избежать мигания)

const totalHeight = computed(() => props.value.length * props.rowHeight) // высота всех строк (для расчёта заглушек).

const visibleRows = computed(() => { // список строк, которые отрисовываются.
  const safeStart = Math.max(startIndex.value - overscan, 0)
  const end = safeStart + step.value + overscan * 2
  return props.value.slice(safeStart, end)
})

// Заглушки нужны, чтобы сохранить правильную прокрутку. создаётся иллюзия, что таблица длинная и как будто все строки отрисованы
const firstRowHeight = computed(() => startIndex.value * props.rowHeight)
const lastRowHeight = computed(() => totalHeight.value - (firstRowHeight.value + visibleRows.value.length * props.rowHeight))

const updateScroll = () => {
  const scrollTop = containerRef.value?.scrollTop || 0
  startIndex.value = Math.floor(scrollTop / props.rowHeight)
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
        <th class="px-2 py-2 font-semibold">№</th>
        <th
            v-for="col in columns"
            :key="col.field"
            class="px-2 py-1 font-semibold"
        >
          <span>{{ col.header }}</span>
          <span v-if="col?.sortable" class="cursor-pointer p-0.5"  @click="emit('sort', col.field)">
            {{(sortedColumns[col.field] && sortedColumns[col.field] >= 1) ? '▼' : '▲'}}
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
          <td class="py-2 min-w-[40px]">{{ startIndex + index + 1 }}</td>
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
