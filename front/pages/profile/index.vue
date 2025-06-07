<script setup>
import AuthenticatedLayout from "~/layouts/AuthenticatedLayout.vue";
import { logout  } from "~/services/api/authServices";
import {page} from "~/services/fakedata/profilePageData.js";
import ChangeJournal from "~/components/Common/СhangeJournal.vue";
import {fetchUser} from "~/services/api/usersServices.js";

const sactumUser = useSanctumUser()
const user = ref(null)

const status = [
  { value: 0, label: 'Выключен' },
  { value: 1, label: 'Включен' },
  { value: 3, label: 'Заблокирован' }
]
const processing = ref(false);

onBeforeMount(() => {
  fetchUser(sactumUser.value.id, 'roles,events').then(res => {
    user.value = res.data;
    !user.value.fio ? user.value.fio = user.value.profile?.fio : null
    !user.value.phone ? user.value.phone = user.value.profile?.phone : null
  })
})

const logoutHandler = async () => {
  await logout(processing);
}
</script>

<template>
    <Head title="Профиль" />
    <authenticated-layout :loading="loading" :isAsideAvailable = "false">
      <section class="h-full w-full p-4 overflow-hidden shadow max-sm:overflow-y-auto">
        <div v-if="user" class="grid grid-cols-1 sm:grid-cols-[0.3fr_1fr] max-lg:gap-4 gap-8 mx-auto h-full">
          <div class="rounded-lg pt-6">
            <div class="flex flex-col items-center">
              <Image v-if="user.avatar" :src="user.avatar" imageClass="w-36 h-36 rounded-full" />
              <div v-else class="bg-[#64748b] w-36 h-36 rounded-full flex items-center text-surface-100 justify-center font-semibold text-3xl">
                {{ user.name?.length > 5 ? user.name.slice(0,5)+'...' : user.name }}
              </div>
              <h1 class="mt-2 text-xl font-bold capitalize text-center">{{ user.fio || user.profile?.fio}}</h1>
            </div>
            <hr class="mb-6 mt-2 border-t border-gray-300">
            <div class="font-semibold text-[16px] mb-1 flex items-center gap-1 justify-left">
              Статус:
              <div class="w-5 h-5 rounded-full ml-1" :class="{'bg-red-400': user.status === 3, 'bg-emerald-400': user.status === 1, 'bg-gray-400': !user.status}"/>
              <span class="font-normal">{{ status.find(s => s.value === user.status)?.label || 'Не указан'}}</span>
            </div>

            <div class="flex items-center gap-2 flex-wrap mb-1 ">
              <h3 class="font-semibold text-[16px] flex items-center gap-1">Роли:</h3>
              <p v-for="role in user.roles" class="mr-1">{{ role.name }}</p>
            </div>

            <hr class="my-6 border-t border-gray-300">
            <h3 class="font-semibold text-[16px] mb-2">Контакты</h3>
            <div class="text-primary-400 flex flex-col gap-1">
              <p class="flex items-center gap-2"><i class="pi pi-phone"/> <a :class="{'text-blue-500':user.phone}" :href="user.phone ? 'tel:+' + user.phone : undefined">{{ user.phone ? (user.phone[0] !== '+' ? `+${user.phone}` : user.phone) : 'Не указан' }}</a></p>
              <p class="flex items-center gap-2"><i class="pi pi-envelope"/> <a :class="{'text-blue-500':user.email}" :href="user.email ? `mailto:${user.email}` : undefined">{{ user.email ? user.email : 'Не указан'}}</a></p>
            </div>
            <hr class="my-6 border-t border-gray-300">
            <button @click.stop="logoutHandler" class="py-2 px-4 bg-slate-600 rounded-lg text-white">
              Покинуть сессию
            </button>
          </div>

          <div>
            <change-journal :events="user.events"/>
          </div>
            <DatePicker
              v-if="false"
              v-model="date"
              inline class="w-full max-sm:hidden"
            >
              <template #date="slotProps">
                <p :class="{'text-red-400': isHolidayDay(slotProps.date)}">{{ slotProps.date.day }}</p>
              </template>
            </DatePicker>

        </div>
      </section>
    </authenticated-layout>
</template>

<style>
.p-accordionheader {
  padding: 10px;
}
</style>

