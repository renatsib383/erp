<script setup>
import {useMainStore} from "~/stores/main.js";

const store = useMainStore();
const dialogRef = inject('dialogRef');
const modal = dialogRef.value.data.modal

const modalsIcon = {
  deal: '/menu/deals.svg',
  contact: '/menu/contact.svg',
  company: '/menu/team.svg',
  user: "/menu/users.svg",
  role: "/menu/users.svg",
  position: "/menu/users.svg",
  work: "/menu/work.svg",
  collection: "/menu/work.svg",
  pdf: "/filetypes/file.svg",
  dds: '/menu/dds.svg',
  salary: '/menu/salary.svg',
  deduction: '/menu/deductions.svg',
}

const modalsRuTitle = {
  deal: 'Объект',
  contact: "Контакт",
  company: "Компания",
  user: "Пользователь",
  role: "Роль",
  position: "Должность",
  work: "Работа",
  collection: "Набор",
  pdf: "Документ",
  dds: "Ддс",
  salary: "ЗП",
  deduction: "Вычет",
}

const openModal = (modal) => {
  store.setNewModal(modal)
  store.removeFromModalsHistoryList(modal)
  dialogRef.value.close()
}

</script>

<template>
  <header
      @click="openModal(modal)"
      class="flex items-center justify-between h-[40px] bg-slate-500 px-4 text-lg text-slate-200 hover:bg-modal-header-hover w-full cursor-pointer"
  >

    <div class="flex items-center gap-1 py-[8px] text-base">
      <img v-if="modalsIcon[modal.modalTitle]" class="opacity-75" loading="lazy" :src="'/images' + modalsIcon[modal.modalTitle]" alt="logo" width="28px" height="28px">
      <span v-else class="pi pi-external-link text-lg"/>

      <h2 class="font-normal text-lg">{{modalsRuTitle[modal.modalTitle]}} {{modal.modalTitle === 'pdf' ? '' : modal.modalData.id ? modal.modalData.id : '- создание'}}</h2>
    </div>

    <p class="flex items-center gap-2 text-base w-[140px]">{{modal.date}}</p>
  </header>
</template>