export const primeInputRefocus = ($event) => {
  const target = $event.originalEvent.target;
  target.blur();
  target.focus();
}