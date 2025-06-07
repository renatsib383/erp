export const deepEqual = (ob1, ob2, ignoreKeys = ['updated_at'], dates) => {
  const a = JSON.parse(JSON.stringify(ob1));
  const b = JSON.parse(JSON.stringify(ob2));
  let anyDifferance = false

  const keysA = Object.keys(ob1).filter((key) => !ignoreKeys.includes(key));

  for (const key of keysA) {
    if (dates && dates.includes(key)) { // Даты приводим в одинаковый вид
      a[key] = a[key] ? new Date(a[key]).toDateString().slice(0,10) : null;
      b[key] = b[key] ? new Date(b[key]).toDateString().slice(0,10) : null;
    }


    if(JSON.stringify(a[key]) !== JSON.stringify(b[key])){
      console.log("Различия:", key, a[key], '->', b[key]);
      anyDifferance = true
      if(!a[key] && !b[key]){
        anyDifferance = false
      }
      return anyDifferance;
    }
  }

  return anyDifferance;
};
