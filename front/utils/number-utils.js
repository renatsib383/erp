export const formatNumber = (value) => {
  if (!value) return '';

  const number = Math.ceil(value); // округляю в большую сторону

  // добавляем пробелы
  const formattedInteger = String(number).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return formattedInteger ? formattedInteger : '';
};