<script setup>
    import { fetchDeal  } from '@/services/api/chatWorkServices.js';

    const store = useMainStore();

    const props = defineProps(["deal_id"]);
    const deal = ref({});
    const loading = ref(false);

    const setDealData = async (deal_id) => {
        loading.value = true;
        const responseDeal = await fetchDeal(deal_id);
        if (responseDeal.success) {
            deal.value = responseDeal.deal;
        }
        loading.value = false;
    };

    onMounted(() => {
        setDealData(props.deal_id);
    })

    watch(() => props.deal_id,(newVal) => {
        setDealData(props.deal_id);
    })

    const openDeal = () => {
    deal.value.isCollapsed = false
    const onlyRequiredFields = ["id", "isCollapsed", "type"]; // чтобы не мусорить LS только нужные поля оставляем
    const dealWithOnlyRequiredFields = Object.fromEntries(
        Object.entries(deal.value).filter(([key]) => onlyRequiredFields.includes(key))
    );

    store.setNewModal({modalData: dealWithOnlyRequiredFields, modalTitle: 'deal'})

    }    

</script>

<template>
    <div class="chat-user p-4 pt-6" v-if="loading">
        <div class="grid lg:grid-cols-2 gap-2">
            <Skeleton class="w-full" height="58px" v-for="i in 4"/>
        </div>
        <Skeleton class="w-full min-h-9 mt-2" borderRadius="0"/>
    </div>
    <div class="chat-user p-4 pt-6" v-if="!loading">

        <div class="grid lg:grid-cols-2 gap-2">

            <div class="flex flex-col gap-2">
                <IftaLabel>
                    <InputText
                        v-model="deal.uid"
                        aria-describedby="username-help"
                        class="w-full"
                        disabled
                    />
                    <label class="text-sm text-surface-400">ИД объекта</label>
                </IftaLabel>
            </div>
            <div class="flex flex-col gap-2">
                <IftaLabel>
                    <InputText
                        :defaultValue="deal.created_at ? formatDateTimeStr(deal.created_at) : ''"
                        showIcon
                        iconDisplay="input"
                        id="created"
                        dateFormat="dd/mm/yy"
                        class="w-full"
                        disabled
                    />
                    <label class="text-sm text-surface-400">Дата создания</label>
                </IftaLabel>
            </div>
            <div class="flex flex-col gap-2">
                <IftaLabel>
                    <InputText
                        :defaultValue="deal.date_start ? formatDateTimeStr(deal.date_start) : ''"
                        showIcon
                        iconDisplay="input"
                        id="created"
                        dateFormat="dd/mm/yy"
                        class="w-full"
                        disabled
                    />
                    <label class="text-sm text-surface-400">Дата начала работ</label>
                </IftaLabel>
            </div>        
            <div class="flex flex-col gap-2">
                <IftaLabel>
                    <InputText
                        :defaultValue="deal.date_end ? formatDateTimeStr(deal.date_end) : ''"
                        showIcon
                        iconDisplay="input"
                        id="created"
                        dateFormat="dd/mm/yy"
                        class="w-full"
                        disabled
                    />
                    <label class="text-sm text-surface-400">Дата окончания работ</label>
                </IftaLabel>
            </div>             

        </div>  

        <div class="min-h-9 mt-2">
            <div
                @click="openDeal()"
                class="h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-2 text-lg text-white mb-[1px] cursor-pointer"
            >
                <div class="flex items-center gap-1 py-[8px]">
                    <img loading="lazy" src="/images/menu/deals.svg" alt="deal-logo" width="28px" height="28px">
                    <h2 class="font-normal pr-2">
                    <span>Объект {{deal.uid}}</span>
                    </h2>
                </div>
            </div>
        </div>  
    </div>
</template>