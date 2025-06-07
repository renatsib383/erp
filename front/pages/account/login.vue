<template>
  <!-- <section class="h-[100vh] flex items-center justify-center px-4"> -->
    <section class="h-[100vh] flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-account-bg flex-1">
      <CommonApplicationLogo class="fill-current text-gray-500"/>      
    <form @submit.prevent="loginHandler" class="flex flex-col mt-6 mx-3 self-stretch sm:max-w-md sm:self-center sm:w-full">
      <Toast position="bottom-left" group="bl" />
      <div class="w-full mb-3">
        <IftaLabel>
          <InputText 
            type="email" 
            v-model="email" 
            :invalid="!!validationErrors.email" 
            class="w-full"
          />
          <label for="email">Почта</label>
        </IftaLabel>
      </div>
      <div class="w-full mb-3">
        <IftaLabel>
          <InputText 
            type="password" 
            v-model="password" 
            :invalid="!!validationErrors.password" 
            class="w-full"
          />
          <label for="password">Пароль</label>
        </IftaLabel>
      </div>
      <Button type="submit" label="Авторизироваться" :loading="processing" class="mb-3" />
      <NuxtLink to="/account/register" label="" class="mb-3 text-surface-400 hover:text-surface-100 underline">Зарегистрироваться</NuxtLink>
      <p class="text-white">
        Забыли пароль?
        <NuxtLink to="/account/forgot-password" class="text-surface-400 hover:text-surface-100 underline">
          Сбросить</NuxtLink>
      </p>
    </form>
    
    
  </section>
</template>

<script setup>
const {$showErrorToast} = useNuxtApp();
const { login } = useSanctumAuth()

definePageMeta({
  sanctum: {
    guestOnly: true,
  }
});

const email = ref("");
const password = ref("");

const validationErrors = ref({});

const processing = ref(false);

const loginHandler = async () => {
  processing.value = true;
  
  try {
    const userCredentials = {
      email: email.value,
      password: password.value,
      remember: true,
    };
    await login(userCredentials);
  } catch (error) {
    $showErrorToast(error.response._data.message)
    validationErrors.value = error.response._data.errors;
  } finally {
    processing.value = false;
  }
};
</script>