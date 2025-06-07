export const setOtherRoomsNewParams = (updatedRoom, allRoomsList) => {
  const {$api} = useNuxtApp()
  // Для всех типов кроме общестроя ставим кастом
  updatedRoom.room_size.shape = 'custom'
  updatedRoom.s_floor = 0;
  updatedRoom.s_walls = 0;
  updatedRoom.p_floor = 0;
  updatedRoom.perimeter = 0;
  updatedRoom.height = 0;

  // И унаследуем параметры комнат с типом общестроя
  allRoomsList?.forEach(i => {
    if(i.room_type_id === 1 && i.involved && i.id !== updatedRoom.id){
      updatedRoom.s_floor += i.s_floor ? Number(i.s_floor) : 0;
      updatedRoom.s_walls += i.s_walls ? Number(i.s_walls) : 0;
      updatedRoom.p_floor += i.p_floor ? Number(i.p_floor) : 0;
      updatedRoom.perimeter += i.perimeter ? Number(i.perimeter) : 0;
      updatedRoom.height += i.height ? Number(i.height) : 0;
    }
  })
  setTimeout(async () => {
    console.log(updatedRoom)
    await $api.put(`/rooms/${updatedRoom.id}`, updatedRoom);
  })
}