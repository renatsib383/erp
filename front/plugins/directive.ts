import outside from "@venegrad/vue3-click-outside"

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.directive('outside', outside)
})


// import vClickOutside from 'v-click-outside';

// export default defineNuxtPlugin((nuxtApp) => {
//     nuxtApp.vueApp.directive('click-outside', vClickOutside
//     // {
//     //     mounted(element, binding, globalThis) {
//     //         // Your custom directive logic here
//     //         element.classList.add('my-directive-test');
//     //         console.log("[My directive works!!!!!!!!!!!!!!!]", binding.value); // Output: the value passed as an argument to the directive. In this case the string 'Hello'
//     //     }
//     // }
//     );
// });