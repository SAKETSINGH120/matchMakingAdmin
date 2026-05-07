export function convertUTCToLocalDateString(dateString) {
  if (!dateString) return;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function convertUTCDateToYYYYMMDD(dateString) {
  if (!dateString) return null;
  return Intl.DateTimeFormat("en-CA").format(new Date(dateString));
}
