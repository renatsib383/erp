<script setup>
import {
  YandexMap,
  YandexMapClusterer,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker
} from 'vue-yandex-maps';
import ProgressSpinner from 'primevue/progressspinner';

import {onMounted, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const emit = defineEmits(['openModal'])
onMounted(() => {
  // Если до перезагрузки модалка была открыта или перешли по ссылке, откроем ее принудительно
  getDealsCoordinates()
})

const markers = ref([]);

const onMarkerClick = (marker) => {
  marker.dealDataLoading = true
  openDeal(marker)
}

const openDeal = async (marker) => {
  if (marker || marker.deal_id){
    const deal = {
      id: marker.deal_id,
      noCollapsed: true,
    }
    history.pushState(null, null,`${window.location.origin}/deals/${deal.id}`)
    await store.dispatch('setNewDealToStore', deal)
    marker.dealDataLoading = false
  }
}

const getDealsCoordinates = async() => {
  try {
    const response = await axios.get(route('deals.map.data'))
    if(response.status === 200){
      const dealsData = await response.data

      markers.value = dealsData.map(item => ({
        deal_id: item.id,
        uid: item.uid,
        coordinates: [parseFloat(item.geo.lon), parseFloat(item.geo.lat)]
      }));
    }
  } catch (e) {
    console.error('GET deals.map.data error',e)
  }
}

const addNewDealWithoutPageReload = (deal) =>{
  const newMarker = {
    deal_id: deal.id,
    uid: deal.uid,
    coordinates: [parseFloat(deal.geo.lon), parseFloat(deal.geo.lat)]
  }
  markers.value.push(newMarker)
}

defineExpose({
  addNewDealWithoutPageReload,
});

</script>

<template>
  <div class="relative h-full bg-white">
    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: [37.617644, 55.755819],
          zoom: 7,
        },
      }"
      width="100%"
      height="100%"
    >
      <yandex-map-default-scheme-layer />
      <yandex-map-default-features-layer/>
      <yandex-map-clusterer
        zoom-on-cluster-click
        :grid-size="300"
      >
        <yandex-map-marker
          v-model="clusterer"
          v-for="(marker, index) in markers"
          :key="index"
          :settings="marker"
          >
          <div @click.stop.prevent="onMarkerClick(marker)" class="cursor-pointer relative  font-bold text-sm flex flex-col items-center justify-center" title="Открыть сделку">
            <svg class="fill-red-600" width="30px" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg>
            <p class="p-[1px] text-center">
              {{marker.uid}}
            </p>
            <span v-if="marker.dealDataLoading" class="absolute"><ProgressSpinner style="width: 40px; height: 40px" strokeWidth="8" /></span>
          </div>
        </yandex-map-marker>

        <!-- Тут также есть clusterer и coordinates -->
        <template #cluster="{ length }">
          <div class="cluster bg-red-600 rounded-full w-[30px] h-[30px] flex items-center justify-center text-white">
            <p class="">{{ length }}</p>
          </div>
        </template>

      </yandex-map-clusterer>
    </yandex-map>
  </div>
</template>

