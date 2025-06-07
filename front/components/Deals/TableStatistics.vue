<script setup>
import {getSmetsList} from "~/services/api/deals-services/smetServices.js";

const { $api } = useNuxtApp();

const dialogRef = inject("dialogRef");

const deal = dialogRef.value.data.deal

const act_statuses = [
  "В разработке",
  "Согласование с заказчиком",
  "Оплачен",
  "Подписан и сдан"
]

const actsList = ref([])
const smetsList = ref([])

const actsTotal = ref({
  total: 0,
  totalKEF: 0,
  masterSalaryTotal: 0,
  prorabSalaryTotal: 0,
  retentionTotal: 0,
})
const smetsTotal = ref({
  total: 0,
})

const blackMaterialList = ref([])
const blackMaterialTotal = ref({
  total: 0,
  prorabSalaryTotal: 0,
})

onMounted(async () => {
  await getActs()
  await getSmets()
  // await getBlackMaterial()
})

const getSmets = async () => {
  smetsList.value = await getSmetsList(deal.id)

  smetsList.value.forEach(smeta =>  {
    smeta.total = 0
    Object.values(smeta.rooms.works).forEach(room => smeta.total += room.total)

    setTimeout(() => {
      smeta.total =  Math.round(smeta.total)

      if(smeta.approved) smetsTotal.value.total += Number(smeta.total)
    })
  })
}

const getActs = async () => {
  try {
    const response = await $api.get(`/acts?filter[deal_id]=${deal.id}`);
    actsList.value = await response.data;
  } catch (e) {
    console.error("Acts loadData error", e);
  } finally {
    actsList.value.forEach(act =>  {
      actsTotal.value.total += Number(act.total)
    })
  }
};

const getBlackMaterial = async () => {
  blackMaterialList.value = []
  try {
    const response = await $api.get(`/orders/${deal.id}`);
    blackMaterialList.value = await response.data.orders;
  } catch (e) {
    console.error("Acts loadData error", e);
  } finally {
    blackMaterialList.value.forEach(item =>  {
      blackMaterialTotal.value.total += item.total
    })
  }
};

</script>

<template>
  <section class="w-full h-full overflow-auto bg-white dark:bg-surface-800 pt-2">
    <h3 class="text-center font-bold">Сметы</h3>
    <div class="overflow-x-auto w-full pb-2">
      <div class="mt-1 grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[1200px] w-full bg-surface-300 py-2 text-surface-600 font-semibold border-surface-300 text-[15px] text-center">
        <label>№</label>
        <label>Сумма</label>
        <label>Название</label>
        <label>Подтверждена</label>
        <label>Дата создания</label>
        <label>Количество комнат</label>
      </div>

      <div
          class="grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[1200px] border-x-[1px] border-surface-300 text-center"
          v-for="(smeta, index) in smetsList"
      >
        <p class="border-r-[1px] border-b-[1px]">{{index}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{smeta.total}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{smeta.name}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{smeta.approved ? 'Да' : 'Нет'}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{formatDateStr(smeta.created_at)}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{smeta.rooms?.list.length}}</p>
      </div>

      <div  class="grid grid-cols-[repeat(6,_minmax(100px,_1fr))] border-surface-300 text-center">
        <h2 class="border-x-[1px] border-b-[1px]">Итого</h2>
        <p class="border-r-[1px] border-b-[1px]">{{smetsTotal.total}} руб.</p>
      </div>
    </div>

    <h3 class="text-center font-bold">Акты</h3>
    <div class="overflow-x-auto w-full pb-2">
      <div class="mt-1 grid grid-cols-[repeat(12,_minmax(100px,_1fr))] min-w-[1200px] w-full bg-surface-300 py-2 text-surface-600 font-semibold border-surface-300 text-[15px] text-center">
        <div class="flex  items-center justify-center">
          <label>№</label>
        </div>
        <div class="flex  items-center justify-center">
<!--          <span class="pi pi-fw pi-inbox"></span>-->
          <label>Выручка</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Выручка без кэф</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>ЗП Мастер</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>ЗП Прораб</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Удержания</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Дата оплаты</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Тип оплаты</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Статус</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Аванс</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Депозит</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Накопленная скидка</label>
        </div>
      </div>

      <div
        class="grid grid-cols-[repeat(12,_minmax(100px,_1fr))] min-w-[1200px] border-x-[1px] border-surface-300 text-center"
        v-for="(act, index) in actsList"
      >
        <p class="border-r-[1px] border-b-[1px]">{{index}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{ act.total }}</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">{{ formatDateStr(act.date_paid) }}</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">{{ act_statuses[act.status] }}</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>

      </div>

      <div  class="grid grid-cols-[repeat(12,_minmax(100px,_1fr))] border-surface-300 text-center">
        <h2 class="border-x-[1px] border-b-[1px]">Итого</h2>
        <p class="border-r-[1px] border-b-[1px]">{{actsTotal.total}} руб.</p>
        <p class="border-r-[1px] border-b-[1px]">{{actsTotal.totalKEF}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{actsTotal.masterSalaryTotal}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{actsTotal.prorabSalaryTotal}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{actsTotal.retentionTotal}}</p>
      </div>
    </div>

    <h3 class="mt-4 text-center font-bold">Черновой материал</h3>
    <div class="overflow-x-auto w-full pb-2">
      <div class="mt-1 grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[600px] bg-surface-300 py-2 text-surface-600 font-semibold border-surface-300 text-[15px] text-center">
        <div class="flex  items-center justify-center">
          <label>№ Специфик</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Сумма</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>ЗП Прораб</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Дата оплаты</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Тип оплаты</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Статус</label>
        </div>
      </div>
      <div
        class="grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[600px] border-x-[1px] border-surface-300 text-center"
        v-for="item in blackMaterialList"
      >
        <p class="border-r-[1px] border-b-[1px]">{{item.id}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{item.total}}</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">{{item.status}}</p>

      </div>
      <div  class="grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[600px] border-surface-300 text-center">
        <h2 class="border-x-[1px] border-b-[1px]">Итого</h2>
        <p class="border-r-[1px] border-b-[1px]">{{blackMaterialTotal.total}}</p>
        <p class="border-r-[1px] border-b-[1px]">{{blackMaterialTotal.prorabSalaryTotal}}</p>
      </div>
    </div>

    <h3 class="mt-4 text-center font-bold">Спецмонтаж</h3>
    <div class="overflow-x-auto w-full pb-2">
      <div class="mt-1 grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[600px] bg-surface-300 py-2 text-surface-600 font-semibold border-surface-300 text-[15px] text-center">
        <div class="flex  items-center justify-center">
          <label>№ Специфик</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Сумма</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>ЗП Прораб</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Дата оплаты</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Тип оплаты</label>
        </div>
        <div class="flex  items-center justify-center">
          <label>Статус</label>
        </div>
      </div>
      <div
        class="grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[600px] border-x-[1px] border-surface-300 text-center"
        v-for="item in specifications"
      >
        <p class="border-r-[1px] border-b-[1px]">{{item}}</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>
        <p class="border-r-[1px] border-b-[1px]">Пусто</p>

      </div>
      <div  class="grid grid-cols-[repeat(6,_minmax(100px,_1fr))] min-w-[600px] border-surface-300 text-center">
        <h2 class="border-x-[1px] border-b-[1px]">Итого</h2>
<!--        v-for="item in specificationsTotal"-->
        <div>
          <p class="border-r-[1px] border-b-[1px]">0</p>
        </div>
      </div>
    </div>

  </section>
</template>
