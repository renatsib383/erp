<template>
    <section class="h-[80vh] flex items-center justify-center px-4">
        <form @submit.prevent="verifyEmailHandler" class="max-w-lg w-full">
            <h1 class="mb-3 text-3xl font-bold">Email verification!</h1>
            <Toast position="bottom-left" group="bl" />
            <p class="mb-3">To verify your email, just click the button below to receive the email and in the email click.</p>
            <Button type="submit" :loading="processing" label="Resend verification" />
        </form>
    </section>
</template>

<script setup>
    const errors = ref({
        email: null,
        count: 0
    });
    const processing = ref(false);
    const toast = useToast();
    const api = useRuntimeConfig().public.api;
    const cookie = useCookie('auth_credientials');

    const verifyEmailHandler = async () => {
        processing.value = true;

        try{
            const data = await $fetch(`${api}/api/verify-email`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer '+cookie.value
                }
            });
            if(data.message){
                toast.add({ severity: 'success', summary: 'Успешно', detail: data.message, group: 'bl', life: 3000 });
            }
        }catch(e){
            toast.add({ severity: 'error', summary: 'Ошибка', detail: e.data.message, group: 'bl', life: 3000 });
        }
        processing.value = false;
    }
</script>