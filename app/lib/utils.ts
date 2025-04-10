import { eventsPlaceholder, issuesPlaceholder } from "./placeholder-data";

export const formatDateToUSA = (dateToFormat: Date) => {
  const mon = dateToFormat.toLocaleString("default", { month: "long" });
  const day = dateToFormat.getDay();
  const year = dateToFormat.getFullYear();

  return `${mon} ${day}, ${year}`;
};

export const latestThreeEvents = () => {
  return eventsPlaceholder
    .sort((a, b) => {
      const dateA = new Date(a.endDate || a.startDate).getTime();
      const dateB = new Date(b.endDate || b.startDate).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);
};

export const GetAllIssues = () => {
  return issuesPlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );
};
