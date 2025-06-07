<template>
    <nav class="w-full border-b border-gray-200 bg-white">
        <div class="max-w-6xl m-auto flex items-center justify-between py-3 px-4">
            <NuxtLink to="/">
                <img src="https://api.iconify.design/logos:laravel.svg?color=%23fe1616" alt="Laravel Logo" width="40">
            </NuxtLink>
            <ul class="font-semibold flex items-center">
                <div v-if="is_auth" class="flex items-center">
                    <NuxtLink class="px-6" to="/">Home</NuxtLink>
                    <NuxtLink class="px-6" to="/users">Users</NuxtLink>
                    <form @submit.prevent="logoutHandler" method="post">
                        <Button type="submit" :loading="processing" label="Logout" />
                    </form>
                </div>
                <div class="flex items-center" v-else>
                    <NuxtLink class="px-6" to="/account/login">Login</NuxtLink>
                    <NuxtLink class="px-6" to="/account/register">Register</NuxtLink>
                </div>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { useToastStore } from "@/stores/toast";
    const is_auth = ref(false);
    const processing = ref(false);
    const failed = ref("");
    const toast = useToast();
    const toastStore = useToastStore();

    const api = useRuntimeConfig().public.api;
    const cookie = useCookie('auth_credientials');

    watchEffect(() => {
        if(cookie.value){
            is_auth.value = true;
        }else{
            is_auth.value = false;
        }
    })

    const logoutHandler = async () => {
        processing.value = true;
        try{
            const data = await $fetch(`${api}/api/logout`, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer '+cookie.value
                }
            });
            if(data.message){
                cookie.value = null;
                navigateTo('/account/login');
                toastStore.setMessage(data.message, 'success');
            }
        }catch(e){
            toast.add({ severity: 'error', summary: 'Ошибка', detail: e.data.message, group: 'bl', life: 3000 });
        }
        processing.value = false;
    }
</script>
