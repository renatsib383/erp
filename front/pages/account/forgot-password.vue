<template>
    <section class="h-[100vh] flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-account-bg flex-1">
        <CommonApplicationLogo class="fill-current text-gray-500"/>
        <form @submit.prevent="forgotPasswordHandler" class="flex flex-col mt-6 mx-3 self-stretch sm:max-w-md sm:self-center sm:w-full">
            <Toast position="bottom-left" group="bl" />
            <IftaLabel>
                <InputText
                    type="text"
                    v-model="email"
                    :invalid="!!validationErrors.email"
                />
                <label for="email">Почта</label>
            </IftaLabel>
            <Button type="submit" :loading="processing" label="Сбросить пароль" class="mt-3" />
        </form>
    </section>
</template>

<script setup>
const {
  $showSuccessToast,
  $showErrorToast,
  $showInfoToast,
  $clearToastMessage,
  $setToastMessage,
} = useNuxtApp();


const email = ref("");
const validationErrors = ref({});
const processing = ref(false);
const {$api} = useNuxtApp();

definePageMeta({
  sanctum: {
    guestOnly: true,
  }
});

 
const forgotPasswordHandler = async () => {
    processing.value = true;

    const forgotPwdData = {
        email: email.value,
    };

    try {
        const response = await $api.post('/forgot-password', forgotPwdData);
            validationErrors.value = {};
            if (response) {
              $showInfoToast(response.message);
              setTimeout(() => navigateTo('/account/login'), 5000)
            }
        } catch (e) {
          console.error(e);
          $showErrorToast(e.response._data.message);
          validationErrors.value = e.response._data.errors;
        }

    // validationErrors.value = {
    //     email: null,
    //     count: 0
    // }
    // if(!email.value){
    //     validationErrors.value.email = "Email is required!";
    //     validationErrors.value.count += 1;
    // }
    // if(validationErrors.value.count === 0){
    //     try{
    //         const data = await client(`forgot-password`, {
    //           method: "POST",
    //           body: {
    //               email: email.value
    //           }
    //         });
    //         if(data.message){
    //             toast.add({ severity: 'success', summary: 'Успешно', detail: data.message, group: 'bl', life: 3000 });
    //         }
    //     }catch(e){
    //         toast.add({ severity: 'error', summary: 'Ошибка', detail: e.data.message, group: 'bl', life: 3000 });
    //     }
    // }
    processing.value = false;
}
</script>