<script setup>
const props = defineProps({
  value: Array,
  columns: Array
})
const emit = defineEmits(['row-click'])
</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <div
        v-if="loading"
        class="absolute inset-[10px] top-[60px] z-[100]">
      <Skeleton class="w-full mb-[4px] rounded-none" height="37px" v-for="i in 22"/>
    </div>
    <DataTable
        lazy :paginator="false" removableSort stripedRows ref="userTable" dataKey="id"
        :value="value" :first="first" :rows="50" :rowsPerPageOptions="[10, 25, 50, 100]"
        :totalRecords="totalRecords" @page="onPage($event)" @sort="onSort($event)" stateStorage="local"
        sortMode="multiple" @row-click="emit('row-click', $event.data)" selectionMode="single" :metaKeySelection="false" :multiSortMeta="multiSortMeta"
        scrollHeight="flex" scrollable
        :virtualScrollerOptions="{ itemSize: 41, delay: 50 }"
    >
      <Column header="№" class="w-[60px] p-2">
        <template #body={index}>
         {{index + 1}}
        </template>
      </Column>
      <Column field="user.name" header="Прораб">
        <template #body="{data}">
          {{data.user.name}}
        </template>
      </Column>

      <div v-for="col in columns">
        <Column
            :field="col.field"
            :header="col.header"
        >
          <template #body={data}>
            <p class="whitespace-nowrap">{{formatNumber(data[col.field])}}</p>
          </template>
        </Column>
      </div>
    </DataTable>
  </div>
</template>

<style scoped></style>