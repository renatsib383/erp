<script setup>
const props = defineProps({
  'name': {
    type: String
  },
  'activeCount' : {
    type: Number,
    default: null
  },
  collapsed : {
    type: Boolean,
    default: true
  }
});

const collapsed = ref(true);

onMounted(() => {
  collapsed.value = props.collapsed;
})

</script>

<template>
    <Fieldset 
        :toggleable="true"
        legend="name"
        :collapsed="collapsed"
        @update:collapsed="collapsed = $event"
    >
        <template #legend="scope">
            <button @click="scope.toggleCallback" class="p-fieldset-toggle-button ">
              <i class="pi" :class="collapsed ? 'pi-plus': 'pi-minus'"/>
              <div>
                  <span class="p-fieldset-legend-label font-medium">{{ name }}</span>
                  <span class="p-fieldset-legend-label text-red-400" v-show="activeCount">({{activeCount}})</span>
              </div>
            </button>
        </template>                

        <slot></slot>
    </Fieldset>
</template>