<template>
    <section class="h-[100vh] flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-account-bg flex-1">
        <CommonApplicationLogo class="fill-current text-gray-500"/>
        <form @submit.prevent="resetHandler" class="flex flex-col mt-6 mx-3 self-stretch sm:max-w-md sm:self-center sm:w-full">
            <Toast position="bottom-left" group="bl" />
            <div class="w-full mb-3">
                <IftaLabel>
                <InputText
                    type="email"
                    v-model="email"
                    :invalid="!!validationErrors.email"
                />
                <label for="email">{{
                    validationErrors.email ? validationErrors.email[0] : "Почта"
                }}</label>
                </IftaLabel>
            </div>
            <div class="w-full mb-3">
                <IftaLabel>
                <Password
                    v-model="password"
                    :invalid="!!validationErrors.password"
                    class="w-full"
                />
                <label for="password">{{
                    validationErrors.password
                    ? validationErrors.password[0]
                    : "Пароль"
                }}</label>
                </IftaLabel>
            </div>
            <div class="w-full mb-3">
                <IftaLabel>
                <Password
                    v-model="password_confirmation"
                    :invalid="!!validationErrors.password"
                    class="w-full"
                />
                <label for="password_confirmation">{{
                    validationErrors.password
                    ? validationErrors.password[0]
                    : "Подтвердите пароль"
                }}</label>
                </IftaLabel>
            </div>
            <Button type="submit" :loading="processing" label="Сбросить пароль" />
            <a href="/account/login" label="" class="mt-3 text-surface-400 hover:text-surface-100 underline">Авторизироваться</a>
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
    const password = ref("");
    const password_confirmation = ref("");
    const validationErrors = ref({});
    const processing = ref(false);
    const { $api } = useNuxtApp();
    const route = useRoute();
    email.value = route.query.email;

    definePageMeta({
      sanctum: {
        guestOnly: true,
      }
    });

    const resetHandler = async () => {
        processing.value = true;

        const resetPwdData = {
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,         
            token: route.params.token
        };

        try {
            const response = await $api.post('/reset-password', resetPwdData);
            validationErrors.value = {};
            console.log('[reset-password.vue] response', response);
            if (response) $showSuccessToast(response.message);
        } catch (e) {
            console.error(e);
            validationErrors.value = e.response._data.errors;
        }

        processing.value = false;
    }
</script>
