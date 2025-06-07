<script setup>
import axios from "axios";
import { inject, onMounted, ref, watch } from "vue";
import vSelect from "vue-select";

const emit = defineEmits(["save",]);

const dialogRef = inject("dialogRef");
const categoryOriginal = ref(dialogRef.value.data.category)
const category = ref( JSON.parse(JSON.stringify(categoryOriginal.value)) )
const roomTypes = dialogRef.value.data.roomTypes.map((type,index) => {
  return  { label: type, id: index }
})

const buttonText = ref("Сохранить");
if (!category.value.id) buttonText.value = "Создать";
const isChanged = ref(false);

const setNewData = async() => {
  category.value.groups = category.value.groups ? category.value.groups.filter((item) => item.name) : null; // Оставляю только заполненные группы
  await setCategoryGroups()

  if(!category.value.id) {
    try {
      const response = await axios.post(route('works.category.store'), category.value)
      if(response.status === 200){
        for (const [key, value] of Object.entries(response.data)) {
          categoryOriginal.value[key] = value;
        }
        emit("save", { newCategory: response.data });
        dialogRef.value.close();
      }
    } catch (e) {
      console.error(e)
    }
  }
  if(category.value.id){
    try {
      const response = await axios.put(route('works.category.update', category.value.id), category.value)
      if (response.status === 200) {
        for (const [key, value] of Object.entries(response.data)) {
          categoryOriginal.value[key] = value;
        }
        isChanged.value = false;
        dialogRef.value.close();
      }
    } catch (e) {
      console.log(e)
    }
  }
}

const setCategoryGroups = async() => {
  category.value.groups.forEach(item => {
    if (!item.id && item.work_category_id) {
      axios.post(route('works.group.store'), item)
        .then((response) => {
          for (const [key, value] of Object.entries(response.data)) { // Создаю группу в бд и добавлю в категорию
            item[key] = value;
          }
        })
        .catch((e) => console.log(e));
    }
    if(item.id){
      const originalGroup = categoryOriginal.value.groups.find(group => group.id === item.id);
      if(originalGroup) {
        if(JSON.stringify(originalGroup) !== JSON.stringify(item)) {
          axios.put(route('works.group.update', item.id), item)
            .then((response) => {
            })
            .catch((e) => console.log(e));
        }
      }
    }

  });
}

const deleteGroup = (group) => {
  try {
    axios.delete(route('works.group.destroy', group.id))
  }catch (e) {
    console.log(e)
  }
  category.value.groups = category.value.groups.filter(item => item !== group)
}

const addGroup = async() => {
  const newGroup = {
    id: null,
    name: '',
    sort: 0,
    work_category_id: category.value.id ? category.value.id : null,
  }
  category.value.groups.push(newGroup)
}

watch(category, () => {
  isChanged.value = true;
}, { deep: true });

</script>

<template>
  <div class="min-h-[50vh] ">
    <form @submit.prevent="setNewData" class="flex flex-col gap-2">
      <Iftalabel>
        <label class="text-sm text-surface-400">Название</label>
        <InputText v-model="category.name" type="text" class="w-full mb-2"/>
      </Iftalabel>
      <Iftalabel>
        <label class="text-sm text-surface-400">Тип комнат</label>
        <v-select
          class="custom-v-select"
          v-model="category.room_types"
          :reduce="(option) => option.id"
          :options="roomTypes"
          multiple
          label="label"
        />
      </Iftalabel>
      <Iftalabel>
        <label class="text-sm text-surface-400">Порядок сортировки</label>
        <InputText type="number" v-model="category.sort"/>
      </Iftalabel>

      <div v-show="category.id">
        <h2 class="font-semibold">Группы</h2>
        <div v-for="group in category.groups" class="py-1 my-1 border-slate-300 rounded grid grid-cols-[1.5fr_0.3fr_0.1fr] gap-2 max-sm:grid-cols-1 items-center">
          <Iftalabel>
            <label class="text-sm text-surface-400">Название</label>
            <InputText v-model="group.name" type="text" class="w-full"/>
          </Iftalabel>
          <Iftalabel>
            <label class="text-sm text-surface-400">Cортировка</label>
            <InputText v-model="group.sort" type="text" class="w-full" />
          </Iftalabel>
          <span v-show="group.id" @click="deleteGroup(group)" class="sm:block hidden pi pi-trash text-slate-400 hover:text-red-400 cursor-pointer max-sm:mx-auto max-sm:py-2 max-sm:px-16 max-sm:bg-slate-500 max-sm:text-white max-sm:rounded"/>
        </div>
      </div>
      <div v-show="category.id" class="flex justify-center">
        <button @click.prevent="addGroup" class="bg-slate-400 p-2 text-white rounded">Добавить группу</button>
      </div>

      <div
        v-if="isChanged"
        class="mt-2 flex justify-center items-center absolute max-sm:top-3 top-1 right-16 max-sm:right-11"
      >
        <Button class="absolute -top-3 h-[50px] right-[5px]  px-3 !bg-emerald-500 hover:bg-emerald-700 text-white border-0 text-base flex items-center justify-center p-1" type="submit">
          <i class="pi pi-check-circle mr-1"></i>
          <p>{{ buttonText }}</p>
        </Button>
      </div>
    </form>
  </div>
</template>
