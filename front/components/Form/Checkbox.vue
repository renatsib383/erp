<template>
    <IftaLabel 
        @click="toggle"
        class="custom-iftalabel-checkbox flex items-center border-[1px] pl-2 border-surface-300 h-full min-h-[58px] dark:bg-surface-950 dark:border-surface-700 cursor-pointer"
        :class="{'!cursor-not-allowed': disabled }">
        <div class="pr-1 flex items-center">
            <input 
                v-if="!(typeof model == 'undefined')"
                v-model="model"
                :disabled="disabled"
                type="checkbox"
                    class="disabled:cursor-not-allowed cursor-pointer custom-checkbox rounded-full h-6 w-10 appearance-none bg-gray-300 dark:bg-gray-400 hover:enabled:bg-gray-400 dark:hover:enabled:bg-gray-600 checked:bg-emerald-500 dark:checked:bg-emerald-500 checked:hover:enabled:bg-emerald-600 dark:checked:hover:enabled:bg-emerald-600 relative transition-all duration-100 ease-out "/>
            <input 
                v-if="(typeof model == 'undefined')"
                :checked="checked"
                :disabled="disabled"
                type="checkbox"
                    class="disabled:cursor-not-allowed cursor-pointer custom-checkbox appearance-none bg-gray-300 dark:bg-gray-400 hover:enabled:bg-gray-400 dark:hover:enabled:bg-gray-600 rounded-full h-6 w-10 relative transition-all duration-100 ease-out checked:bg-emerald-500 dark:checked:bg-emerald-500 checked:hover:enabled:bg-emerald-600 dark:checked:hover:enabled:bg-emerald-600"/>
        </div>
        <div class="flex grow">
            <label class="!static px-1 text-sm text-surface-400 leading-tight">{{ label }}</label>
        </div>
    </IftaLabel>
</template>

<script setup>
const model = defineModel();

const props = defineProps({
    label: String,
    disabled: Boolean,
    checked: Boolean,
})

const toggle = () => {
    if (props.disabled) {
        return;
    }
    if (!(typeof model.value == 'undefined')) {
        model.value = !model.value;
    }
}

</script>


