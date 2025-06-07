<script setup>
const props = defineProps({
  value: Array,
  columns: Array
})
const emit = defineEmits(['row-click'])

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
  <div class="w-full h-full overflow-auto">
    <table class="text-sm">
      <thead class="sticky top-0 bg-header-bg z-[10] leading-none">
      <tr>
        <th class="px-2 py-1 font-semibold">№</th>
        <th
            v-for="col in columns"
            :key="col.field"
            class="px-2 py-1 font-semibold"
        >
          {{ col.header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item, index) in value"
          @click="emit('row-click', item)"
          class="bg-white dark:bg-[#28334e] text-center border-b-4 border-header-bg w-full"
      >
        <td class="p-2 min-w-[40px]">{{ index + 1 }}</td>

        <td
            v-for="col in columns"
            :key="col.field"
            class="p-2 whitespace-nowrap"
        >
          <slot
              :name="`body-${col.field}`"
              :data="item"
              :row="item"
              :index="index"
          >
            {{ getValue(item, col.field) }}
          </slot>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
