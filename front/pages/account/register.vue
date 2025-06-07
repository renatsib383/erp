<template>
  <section class="h-[100vh] flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-account-bg flex-1">
    <CommonApplicationLogo class="fill-current text-gray-500"/>      
    <form @submit.prevent="registerHandler" class="flex flex-col mt-6 mx-3 self-stretch sm:max-w-md sm:self-center sm:w-full">
      <Toast position="bottom-left" group="bl" />
      <div class="w-full mb-3">
        <IftaLabel>
          <InputText
            type="text"
            v-model="name"
            :invalid="!!validationErrors.name"
          />
          <label for="name">Имя</label>
        </IftaLabel>
      </div>
      <div class="w-full mb-3">
        <IftaLabel>
          <InputText
            type="email"
            v-model="email"
            :invalid="!!validationErrors.email"
          />
          <label for="email">Почта</label>
        </IftaLabel>
      </div>
      <div class="w-full mb-3">
        <IftaLabel>
          <Password
            v-model="password"
            :invalid="!!validationErrors.password"
            class="w-full"
          />
          <label for="password">Пароль</label>
        </IftaLabel>
      </div>
      <div class="w-full mb-3">
        <IftaLabel>
          <Password
            v-model="password_confirmation"
            :invalid="!!validationErrors.password"
            class="w-full"
          />
          <label for="password_confirmation">Подтвердите пароль</label>
        </IftaLabel>
      </div>
      <Button type="submit" :loading="processing" label="Зарегистрироваться" />
      <NuxtLink to="/account/login" class="mt-3 text-surface-400 hover:text-surface-100 underline">Авторизироваться</NuxtLink>
    </form>
  </section>
</template>

<script setup>
const {$showSuccessToast,  $showErrorToast} = useNuxtApp();

const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const validationErrors = ref({});
const processing = ref(false);
const {$api} = useNuxtApp();

definePageMeta({
  sanctum: {
    excluded: true,
  },
});

const registerHandler = async () => {
  processing.value = true;

  const registerData = {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
  };

  try {
      const response = await $api.post('/register', registerData);
      validationErrors.value = {};
      $showSuccessToast('Регистрация прошла успешно!')
      navigateTo('')
    } catch (e) {
      console.error(e);
      $showErrorToast(e.response._data.message)
      validationErrors.value = e.response._data.errors;
    }

  processing.value = false;
};

</script>