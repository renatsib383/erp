<script setup>
import {fetchWorksDataLists} from "~/services/api/worksServices.js";

const delay = ref()
const emit = defineEmits(['change-searchValue', 'set-newwork'])
const search = ref('')
const route = useRoute()
const props = defineProps(['cachedLists'])
const cachedLists = ref({})

// const showAddButtonFor = ref('works')
const params = ref({
  category: null,
  group: null,
  name: '',
})

const categoryList = ref([])

const groupList = ref([])

if(props.cachedLists) {
  cachedLists.value = await fetchWorksDataLists()
}

onMounted(async () => {
  const { category } = props.cachedLists;
  cachedLists.value = props.cachedLists;
  categoryList.value = category;

  Object.entries(route.query).forEach(([key, value]) => {
    const match = key.match(/^filter\[(\w+)]/);
    if (!match) return;

    const filterKey = match[1];

    if (filterKey === "name") {
      search.value = value;
      emit('change-searchValue', search.value)
    }

    if (filterKey === "work_group_id") {
      const { selectedCategory, selectedGroup } = category.reduce(
          (acc, cat) => {
            const group = cat.groups.find((g) => Number(g.id) === Number(value));
            return group ? { selectedCategory: cat, selectedGroup: group } : acc;
          },
          { selectedCategory: null, selectedGroup: null }
      );

      if (selectedCategory && selectedGroup) {
        params.value.category = selectedCategory.value;
        params.value.group = selectedGroup.id;
      }
    }
    onParamsChange()
  });
});

watch(params,(newValue) => {
  groupList.value = newValue.category ? categoryList.value.find(category => category.value === newValue.category).groups : []
  if(!newValue.category){
    newValue.group = null
  }
  onParamsChange()
}, {deep:true})

const onSearchInput = () => {
	if (delay.value) {
		clearTimeout(delay.value)
	}
	delay.value = setTimeout(() => {
		emit('change-searchValue', search.value)
	}, 100);
}

const onParamsChange = () => {
  emit('change-params', params.value)
}

const setNewWork = () => {
	emit('set-newwork')
}

// const setNewCollection = () => {
//   emit('set-collection')
// }
// const setNewCategory = () => {
//   emit('set-newcategory')
// }

// defineExpose({showAddButtonFor})

</script>

<template>
	<div class="aside-deal__toggle h-full overflow-hidden">
		<div class="flex justify-between items-center p-1">
			<span class="relative  w-full">
        <FormSearch
            v-model="search"
            @change-search="onSearchInput"
            :placeholder="'Поиск по названию'"
        />
			</span>
		</div>
    <!--		<div class="flex justify-center my-2">-->
    <!--			<button @click="setNewWork" class="py-2 mb-1 mx-1 px-8 border-slate-400 border-dashed border-2 text-slate-600 font-medium text-[15px] rounded-lg w-full">-->
    <!--				Добавить работу-->
    <!--			</button>-->
    <!--		</div>-->
    <section class="mt-2 select-none">
      <p class="aside__caption-field mb-2">Фильтры</p>
      <div class="min-h-full flex flex-col gap-1 text-xs pb-2">

        <div class="pb-2">
          <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
            <div class="flex items-center relative w-full">
              <IftaLabel>
                <label>Категория</label>
                <Select 
                  v-model="params.category"
                  :options="categoryList"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Все"
                  class="w-full"
                  showClear
                >
                </Select>                        
              </IftaLabel>
            </div>
          </div>
        </div>

        <div class="pb-2">
          <div class="aside-filter__content flex flex-col gap-1 p-1 rounded-md">
            <div class="flex items-center relative w-full">
              <IftaLabel>
                <label>Группа</label>
                <Select 
                  v-model="params.group"
                  :options="groupList"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Все"
                  class="w-full"
                  :disabled="!params.category"
                  showClear
                >
                </Select>                        
              </IftaLabel>
            </div>
          </div>
        </div>

      </div>
    </section>
<!--
    <div v-show="showAddButtonFor === 'sets'" class="flex justify-center my-2">
      <button @click="setNewCollection" class="py-2 mb-1 mx-1 px-8 border-slate-400 border-dashed border-2 text-slate-600 font-medium text-[15px] rounded-lg w-full">
        Добавить набор работ
      </button>
    </div>
    <div v-show="showAddButtonFor === 'categories'" class="flex justify-center my-2">
      <button @click="setNewCategory" class="py-2 mb-1 mx-1 px-8 border-slate-400 border-dashed border-2 text-slate-600 font-medium text-[15px] rounded-lg w-full">
        Добавить категорию
      </button>
    </div>
-->
	</div>
</template>
<style></style>
