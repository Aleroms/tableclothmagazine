

export const formatDateToUSA = (dateToFormat: Date) => {
  const mon = dateToFormat.toLocaleString("default", { month: "long" });
  const day = dateToFormat.getDay();
  const year = dateToFormat.getFullYear();

  return `${mon} ${day}, ${year}`;
};
