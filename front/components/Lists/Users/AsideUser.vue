<script setup>
const listsStore = useListsStore()
const delay = ref()
const emit = defineEmits(['change-searchValue', 'set-newuser'])
const search = ref('')
const params = ref({
  department: null,
  affiliate: null,
  chief:null,
})

const chiefOptions = computed(() => {
  return listsStore?.usersWithRolesList ? listsStore.usersWithRolesList : []
})
const route = useRoute()

const isAllowed = checkPermission('User', 'create')

onMounted(async () => {
  if (route.query.search) {
    search.value = route.query.search
    emit('change-searchValue', search.value)
  }
});

const onSearchInput = () => {
	if (delay.value) {
		clearTimeout(delay.value)
	}
	delay.value = setTimeout(() => {
    const oldURL = window.location.href;
    const newUrl = search.value.length ? `${window.location.pathname}?search=${search.value}` : null;
    if (newUrl) {
      history.pushState(oldURL, '', newUrl);
    } else {
      history.pushState(oldURL, '', window.location.pathname);
    }
		emit('change-searchValue', search.value)
	}, 100);
}

const setNewUser = () => {
	emit('set-new-user')
}

watch(params, (newValue) => {
  emitParams()
}, {deep: true})

const emitParams = () => {
  emit('change-params', params.value)
}
</script>

<template>
	<div class="aside-deal__toggle h-[calc(100%-20px)] px-[3px] overflow-hidden">

    <div class="flex justify-between items-center pt-1">
        <span class="relative  w-full">
          <FormSearch
              v-model="search"
              @change-search="onSearchInput"
              :placeholder="'Поиск по имени пользователя'"
          />
        </span>
      </div>


		<div
        v-if="isAllowed"
        class="flex justify-center my-2"
    >
			<button @click="setNewUser" class="aside-accent-btn">
				Добавить пользователя
			</button>
		</div>

    <section class="mt-2 select-none">
      <p class="aside__caption-field mb-2">Фильтры</p>

      <div class="min-h-full flex flex-col gap-1 pb-2">
        <!--
                <div class="pb-2">
                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative w-full">
                      <IftaLabel>
                        <Select
                            v-model="params.department"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Все"
                            class="w-full"
                        >
                        </Select>
                        <label>Отдел</label>
                      </IftaLabel>
                    </div>
                  </div>
                </div>

                <div class="pb-2">
                  <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
                    <div class="flex items-center relative w-full">
                      <IftaLabel>
                        <Select
                          v-model="params.affiliate"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Все"
                          class="w-full"
                        >
                        </Select>
                        <label>Филиал</label>
                      </IftaLabel>
                    </div>
                  </div>
                </div>-->

        <div class="pb-2">
          <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
            <iftaLabel>
              <label>Руководитель</label>
              <Select
                  v-model="params.chief"
                  :options="chiefOptions"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Выберите"
                  class="w-full"
              />
            </iftaLabel>
          </div>
        </div>

      </div>
    </section>
	</div>
</template>
<style></style>
