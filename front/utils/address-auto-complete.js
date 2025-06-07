import { ref } from 'vue';
import { fetchSuggestions } from '~/services/api/dadataApi.js'

const dadataToken = '21e1f007947f2a918b5ec3fbe51d35163044aa22';

export const useAddressAutocomplete = () => {
  const addressQuery = ref('');
  const suggestions = ref([]);
  const selectedIndex = ref(-1);

  const getSuggestions = async () => {
    suggestions.value = await fetchSuggestions(addressQuery.value, dadataToken);
  };

  const setAddress = (suggestion, deal, setDealCoordinates) => {
    addressQuery.value = suggestion.value;
    deal.address = suggestion.value;
    deal.geo = {
      lat: suggestion.data.geo_lat,
      lon: suggestion.data.geo_lon,
    };
    setDealCoordinates();
    suggestions.value = [];
  };

  const moveDown = () => {
    if (selectedIndex.value < suggestions.value.length - 1) {
      selectedIndex.value++;
      addressQuery.value = suggestions.value[selectedIndex.value].value;
    }
  };

  const moveUp = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--;
      addressQuery.value = suggestions.value[selectedIndex.value].value;
    }
  };


  return {
    addressQuery,
    suggestions,
    selectedIndex,
    getSuggestions,
    setAddress,
    moveDown,
    moveUp,
  };
};
