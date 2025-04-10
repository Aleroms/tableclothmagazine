import { User } from "./definitions";
import {
  articlePlaceholder,
  eventsPlaceholder,
  issuesPlaceholder,
  usersPlaceholder,
} from "./placeholder-data";

export const formatDateToUSA = (dateToFormat: Date) => {
  const mon = dateToFormat.toLocaleString("default", { month: "long" });
  const day = dateToFormat.getDay();
  const year = dateToFormat.getFullYear();

  return `${mon} ${day}, ${year}`;
};

export const latestThreeEvents = () =>
  eventsPlaceholder
    .sort((a, b) => {
      const dateA = new Date(a.endDate || a.startDate).getTime();
      const dateB = new Date(b.endDate || b.startDate).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

export const getAllIssues = () =>
  issuesPlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );

export const getArticles = (limit: number) =>
  articlePlaceholder
    .sort((a, b) => b.release_date.getTime() - a.release_date.getTime())
    .slice(0, limit);

export const getIssueById = (id: string) =>
  issuesPlaceholder.find((issue) => issue.id === id);

export const getUserById = (id: string): User | undefined =>
  usersPlaceholder.find((user) => user.id === id);

export const getArticlesByIssueId = (issueId: string) =>
  articlePlaceholder.filter((article) => article.issue_id === issueId);
