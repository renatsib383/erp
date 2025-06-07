<template>
    <v-select 
        :closeOnSelect="false"
        label="label"
        value="value"
        class=" w-full v-select-custom">
        <template v-slot:option="option" v-if="type == 'stages'">
            <div class="p-2 text-black"
              :style="{ backgroundColor: option.color, width: '100%' }">{{ option.label }}</div>
        </template>
        <template v-slot:no-options>Пусто</template>
        <template #open-indicator>
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" 
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="" data-pc-section="dropdownicon"><path d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z" fill="currentColor"></path></svg>
        </template>                          
    </v-select>
</template>

<script setup>
    import vSelect from "vue-select";
    import OpenIndicator from "~/components/Common/VSelect/OpenIndicator.vue";
    import Deselect from "~/components/Common/VSelect/Deselect.vue";

    vSelect.props.components.default = () => ({ OpenIndicator, Deselect });
    const props = defineProps(['type']);



</script>

<style>
.v-select .vs--single.vs--loading .vs__selected, .vs--single.vs--open .vs__selected {
  opacity: 1;
}
</style>