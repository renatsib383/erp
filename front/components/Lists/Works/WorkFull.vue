<script setup>
import {worksPageData} from "~/services/fakedata/worksPageData.js";
import {useConfirm} from "primevue/useconfirm";
import {fetchWork, searchProducts} from "~/services/api/worksServices.js";
import {useMainStore} from "~/stores/main.js";
import {formatDateTimeStr} from "~/utils/date-functions.js";
import ModalHeader from "~/components/Common/ModalHeader.vue";
import ChangeJournal from "~/components/Common/СhangeJournal.vue";

const emit = defineEmits(['save', 'emit-additional-work'])
const route = useRoute()
const store = useMainStore();
const props = defineProps({
  fromPriceList: { type: Boolean, default: false},
  group : {type: Object, default: {}},
  category : {type: Array, default: []},
  factor : {type: Array, default: []},
  ed : {type: Array, default: []},
  type : {type: Array, default: []} ,
})
const dialogRef = inject('dialogRef');

onMounted(() => {
  if(work.value && work.value.products){
    workProducts.value = JSON.parse(JSON.stringify(work.value.products))
  }
})

const workOriginal = ref(dialogRef ? dialogRef.value.data.modalData : null);
const work = ref(workOriginal.value ? JSON.parse(JSON.stringify(workOriginal.value)) : null)
const isEmptyField = ref(false)
// Приходят от API
const incompleteRecords = ref(false)

const buttonText = ref('Сохранить')
if (work.value && !work.value.id) {
  buttonText.value = 'Создать'
}

const isChanged = ref(false)

const groupList = computed(() => {
  const categories = worksPageData.category || props.category;
  let category = categories.find(cat => cat.id === work.value.category)
  if(!category) category = categories.find(cat => cat.value === work.value.category)
  return category ? category.groups : []
});

const categoryList = worksPageData.category
  ? Object.values(worksPageData.category).map((cat) => {
      return { value: Number(cat.id), label: cat.name};
    })
  : props.category

const typeList = worksPageData.type
  ? Object.entries(worksPageData.type).map(([key, value]) => ({
    value: Number(key),
    label: value}))
  : Object.entries(props.type).map(([key, value]) => ({
    value: Number(key),
    label: value}));

const edList = worksPageData.ed
  ? Object.entries(worksPageData.ed).map(([key, value]) => ({
    value: Number(key),
    label: value}))
  : Object.entries(props.ed).map(([key, value]) => ({
    value: Number(key),
    label: value}));

const factors = Object.entries(worksPageData.factor || props.factor);
const factorList = factors.map(([key, value]) => ({
  value: Number(key),
  label: value.title
}))

const categoryChanged = () => {
  work.value.group = null
}

// const setNewData = async () => {
// 	if (!work.value.name || !work.value.price || work.value.category === null || work.value.group === null || work.value.ed === null || work.value.factor === null || work.value.sort === null) {
// 		isEmptyField.value = true;
// 	} else {
// 		isEmptyField.value = false
// 	}
//
//   work.value.products = workProducts.value.map((product) => {
//     return {product_id: product.product.id, count: product.count}
//   })
// 	if (!isEmptyField.value) {
// 		if (work.value.id) {
// 			try {
// 				const response = await axios.put(
// 					route('works.work.update', work.value.id),
// 					work.value
// 				)
// 				if (response.status === 200) {
// 					for (const [key, value] of Object.entries(response.data)) {
// 						workOriginal.value[key] = value
// 					}
// 					isChanged.value = false
// 					dialogRef.value.close();
// 				}
// 			} catch (e) {
// 				console.log(e);
// 			}
// 		} else {
// 			try {
// 				const response = await axios.post(route('works.work.store'), work.value)
// 				if (response.status === 200) {
// 					for (const [key, value] of Object.entries(work.value)) {
// 						workOriginal.value[key] = value
// 					}
// 					isChanged.value = false
// 					await emitNewWork(response.data)
// 					await dialogRef.value.close();
// 				} else {
// 					incompleteRecords.value = true
// 				}
//
// 			} catch (e) {
// 				console.log(e);
// 			}
//
// 		}
// 	}
// }

// const emitNewWork = async (newWork) => {
// 	emit('save', { work: newWork });
// }

const emitAdditionalWork = async () => {
  if (!work.value.name || !work.value.price || !work.value.category || !work.value.group || work.value.factor === null || work.value.sort === null || work.value.ed === null) {
    isEmptyField.value = true;
  } else {
    isEmptyField.value = false
  }

  if (!isEmptyField.value) {
    emit('emit-additional-work', { work: work.value });
  }
}

const getWorkData = async () => {
  const id = route.params.id ? route.params.id : work.value?.id;
  const result = await fetchWork(id);
  if (result.success) {
    work.value = result.data;
  }

  setTimeout(() => (isChanged.value = false));
};

if(!work.value || Object.keys(work.value).length <= 2){
  getWorkData()
}

// watch(work, () => {
//   isChanged.value = true;
// }, { deep: true });


defineExpose({
  emitAdditionalWork,
})

// Расходники
const workProducts = ref([]);
const items = ref([]);
const delay = ref(null)
const addNewProductButtonStatus = ref(true)
const duplicateMsg = ref('')

const addNewProduct = () => {
  const newProduct = {
    count: 0,
    product: {
      name: ''
    }
  };
  workProducts.value.push(newProduct);
  setTimeout(() => {
    addNewProductButtonStatus.value = false
  }, 0)
}

const search = (event) => {
  if (event.query.length > 2){
    if(delay.value){
      clearTimeout(delay.value)
    }
    delay.value = setTimeout(async () => {
      const existingProductNames = workProducts.value.map((p) => p.product.name);
      const result = await searchProducts(event.query, existingProductNames);

      if (result.success) {
        items.value = result.data;
      } else {
        console.error(result);
        items.value = [];
      }
    }, 300);
  }
}

const productSelected = (product) => {
  if(product.product.name){
      product.count = 1
      isChanged.value = true;
      addNewProductButtonStatus.value = true
  }
}

const removeProduct = (product) => {
  workProducts.value = workProducts.value.filter(p => p !== product)
  isChanged.value = true
  addNewProductButtonStatus.value = true
}

const productCountsChange = () => {
  isChanged.value = true;
}

// Вкладки
const activeTab = ref(0) // Активная вкладка (по умолчанию "Основное")

// Меню
const menu = ref();
const menuItems = ref([
  // {
  //   label: 'Удалить',
  //   icon: 'pi pi-trash',
  //   command: (event) => {
  //     if(work.value.id){
  //       showDeleteConfirmPopup(event)
  //     }
  //   },
  // },
]);
// const confirm = useConfirm()
//
// const toggle = (event) => {
//   menu.value.toggle(event);
// };
//
// const showDeleteConfirmPopup = (event) => {
//   confirm.require({
//     target: event.currentTarget,
//     message: `Вы точно хотите удалить "${work.value.name}"?`,
//     icon: 'pi pi-info-circle',
//     rejectProps: {
//       label: 'Отмена',
//       severity: 'secondary',
//       outlined: true
//     },
//     acceptProps: {
//       label: 'Удалить',
//       severity: 'danger'
//     },
//     accept: async() => {
//       await axios.delete(route('works.work.destroy', work.value.id));
//       dialogRef.value.close();
//       emit('delete', {workId: work.value.id});
//     },
//     reject: () => null,
//   });
// }

// Управление состоянием модалки
const collapsed = ref(false)
if(work.value?.isCollapsed){
  collapsed.value = true;
}

const closeModal = () => {
  const removedModal = {
    modalData: work.value,
    modalTitle: 'work',
    date: formatDateTimeStr(new Date()),
  }
  store.removeModalFromList(removedModal)
  emit("close", { id: work.value.id, objectName: 'work'});
  dialogRef.value.close();
};

const collapseModal = (value) => {
  emit("collapse", { id: work.value.id ? work.value.id : 'new', value,  objectName: 'work'});
  if(value){ // Задержка перед скрытием содержимого модалки
    setTimeout(() =>{
      collapsed.value = value;
    }, 100)
  } else {
    collapsed.value = value;
  }
};

const unCollapseModal = (event) => {
  const target = event.target.closest("button");  // Проверяем, клик был ли сделан по кнопке
  if (!target) {
    collapseModal(false);
  }
};
</script>

<template>
  <section class="h-full">
    <modal-header
        :id="work?.id"
        :title="`Работа ${work?.id || ''}`"
        :collapsed="collapsed"
        :dialogRef="dialogRef"
        :isChanged="isChanged"
        :saveText="buttonText"
        page="works"
        icon="/images/menu/work.svg"
        backLink="/works"
        @save="setNewData"
        @collapse="collapseModal"
        @uncollapse="unCollapseModal"
        @close="closeModal"
    />
    <form v-if="work && !collapsed" @submit.prevent="setNewData" class="modal-form">
      <section class="bg-modal-panel-bg p-2 pt-0 overflow-hidden h-full">
        <nav class="custom-nav">
          <div class="flex items-center">
            <p @click = 'activeTab = 0' class="custom-nav-tab" :class="{'custom-nav-tab_active' : activeTab === 0}">Основное</p>
            <p @click = 'activeTab = 1' class="custom-nav-tab" :class="{'custom-nav-tab_active' : activeTab === 1}">Расходники</p>
          </div>
          <span @click.stop="activeTab = 10" class="custom-nav-history" :class="{'custom-nav-tab_active' : activeTab === 10}" title="История"/>
        </nav>
        <main class="pt-2 h-[calc(100%-50px)] overflow-auto" >
          <div v-show="activeTab === 0" class="rounded-md grid md:grid-cols-1 gap-2 px-1 text-gray-400">
            <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && !work.name}">
              <label>Название работы</label>
              <InputText v-model="work.name" rows="3" cols="20" />
            </ifta-label>
            <div class="grid md:grid-cols-2 gap-2">
              <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && !work.category}">
                <label>Категория</label>
                <Dropdown
                    v-model="work.category"
                    :options="categoryList"
                    @change="categoryChanged"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                />
              </ifta-label>
              <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && !work.group}">
                <label>Группа</label>
                <Dropdown
                    v-model="work.group"
                    :options="groupList"
                    optionLabel="name"
                    optionValue="id"
                    class="w-full"
                />
              </ifta-label>
              <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && !work.group}">
                <label>Вид работ</label>
                <Dropdown v-model="work.type" :options="typeList" optionLabel="label" optionValue="value" class="w-full"/>
              </ifta-label>
              <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && work.sort === null}">
                <label>Порядок сортировки</label>
                <InputNumber v-model="work.sort" class="w-full"/>
              </ifta-label>
              <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && work.factor === null}">
                <label>Фактор</label>
                <Dropdown v-model="work.factor" :options="factorList" optionLabel="label" optionValue="value" class="w-full"/>
              </ifta-label>
              <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && work.ed === null}">
                <label>Ед. изм.</label>
                <Dropdown v-model="work.ed" :options="edList" optionLabel="label" optionValue="value" class="w-full"/>
              </ifta-label>
              <ifta-label :class="{'ring-[2px] rounded-lg ring-red-400': isEmptyField && !work.price}">
                <label>Цена</label>
                <InputNumber v-model="work.price" class="w-full"/>
              </ifta-label>
            </div>
            <ifta-label >
              <label>Описание работы</label>
              <Textarea v-model="work.description" rows="3" cols="20" class="w-full" />
            </ifta-label>

          </div>
          <section v-if="!fromPriceList && activeTab === 1">
            <div class="border-[1px] rounded-md grid md:grid-cols-1 gap-2 px-1 py-2">
              <div v-for="(item, index) in workProducts" class="flex flex-col gap-2">
                <div v-if="index < 1" class="max-lg:hidden grid lg:grid-cols-2">
                  <div class="flex gap-1 items-center text-gray-400 justify-center">
                    <span class="pi pi-fw pi-table"></span>
                    <label class="text-sm">Название</label>
                  </div>
                  <div class="flex gap-1 items-center text-gray-400 justify-end pr-12">
                    <span class="pi pi-fw pi-table"></span>
                    <label class="text-sm">Количество</label>
                  </div>
                </div>

                <div class="grid lg:grid-cols-[2fr_0.85fr_0.05fr] gap-2 border-[1px] border-slate-300 mb-2 p-1 py-1.5 rounded-md items-center">
                  <AutoComplete v-model="item.product" :suggestions="items" @complete="search" @item-select="productSelected(item)" optionLabel="name" style="width: 100%"><template #option="slotProps">
                    <div class="flex items-center">
                      <div>{{ slotProps.option.name }}</div>
                    </div>
                  </template>
                  </AutoComplete>

                  <InputNumber :step="0.1" @input="productCountsChange" @update:model-value="productCountsChange" v-model="item.count" inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="2" fluid showButtons :min="0"  class="w-full"/>

                  <button class="max-lg:hidden" @click.stop.prevent="removeProduct(item)">
                    <i class="pi pi-times-circle text-lg text-surface-400 hover:text-red-400"></i>
                  </button>
                  <button class="max-lg:mx-auto lg:hidden py-2 px-8 bg-slate-400 rounded-lg w-32" @click.stop.prevent="removeProduct(item)">
                    <span class="pi pi-trash text-white hover:text-red-400"></span>
                  </button>
                </div>
              </div>

              <div class="flex justify-center mt-2">
                <button @click.stop.prevent="addNewProduct"  class="py-2 px-8 rounded-lg button-modal" :class="{'bg-slate-300 cursor-not-allowed': !addNewProductButtonStatus}" :disabled="!addNewProductButtonStatus">
                  Добавить
                </button>
              </div>

            </div>
          </section>
          <div v-show="activeTab === 10">
            <change-journal :events="work.events"/>
          </div>
        </main>

        <div class="flex justify-center my-2"
             v-if="isChanged && fromPriceList">
          <Button
              type="button"
              label="Сохранить"
              @click.stop="emitAdditionalWork"
              class="w-64"
          />
        </div>
      </section>

      <section class="bg-modal-panel-bg p-2 pt-0 max-lg:hidden">

      </section>
    </form>
  </section>
</template>

<style scoped>
.custom-input input {
  max-width: 100%;
  padding: 7.5px 5px;
}
.custom-input button {
  max-width: 30px;
}

.custom-v-select {
  font-size: 14px;
  box-shadow: none;
  --vs-dropdown-option--active-bg: #34d399;
  width: 100%;
}

.custom-v-select:hover {
  font-size: 14px;
}

.custom-v-select .vs__dropdown-toggle {
  padding: 7.5px;
  border-color: #d1d5db;
  box-shadow: 0 0 0 0 #d1d5db;
  transition-duration: 200ms;
  border-radius: 8px;
}

.custom-v-select .vs__dropdown-toggle:hover {
  padding: 7.5px;
  border-color: #34d39980;
  border-radius: 10px;
}

.custom-v-select .vs__dropdown-toggle:focus-within {
  outline: none;
  /* Убираем стандартный outline */
  box-shadow: 0 0 0 4px #34d39980;
  /* Создаем эффект "ring" */
  border-radius: 10px;
}
.custom-v-select .vs__dropdown-menu {
  max-height: 300px;
}
</style>
