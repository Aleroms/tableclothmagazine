import { promises as fs } from "fs";
import path from "path";

import { User, Event } from "./definitions";
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

export const getAllEvents = (): Event[] => getSortedEvents(eventsPlaceholder);

export const getAllEventsChronological = (): Event[] =>
  getSortedEvents(eventsPlaceholder, false);

export const getSortedEvents = (
  events: Event[],
  reverse: boolean = true
): Event[] => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.endDate || a.startDate).getTime();
    const dateB = new Date(b.endDate || b.startDate).getTime();

    return reverse ? dateB - dateA : dateA - dateB;
  });
};

export const getCurrentIssueEvents = (): Event[] => {
  if (eventsPlaceholder.length === 0) return [];

  // Find the current issue id (max num)
  const currentIssueId = getCurrentIssueId();

  return getIssueEventsById(currentIssueId);
};

export const getPastIssueEvents = (reverse: boolean = true): Event[] => {
  if (eventsPlaceholder.length === 0) return [];

  const currentIssueId = getCurrentIssueId();
  const pastIssuesEvents = eventsPlaceholder.filter(
    (event) => event.issue_id !== currentIssueId
  );

  
  return getSortedEvents(pastIssuesEvents, reverse);
};

export const getCurrentIssueId = (): number =>
  Math.max(...eventsPlaceholder.map((event) => event.issue_id));

export const getIssueEventsById = (id: number): Event[] =>
  eventsPlaceholder.filter((event) => event.issue_id === id);

export const getAllIssues = () =>
  issuesPlaceholder.sort(
    (a, b) => b.release_date.getTime() - a.release_date.getTime()
  );

export const getArticles = (limit: number) =>
  articlePlaceholder
    .sort((a, b) => b.release_date.getTime() - a.release_date.getTime())
    .slice(0, limit);

export const getIssueById = (id: number) =>
  issuesPlaceholder.find((issue) => issue.id === id);

export const getUserById = (id: string): User | undefined =>
  usersPlaceholder.find((user) => user.id === id);

export const getAllTableclothUsers = (): User[] =>
  usersPlaceholder.filter(
    (user) => user.auth_level === "admin" || user.auth_level === "writer"
  );

export const getArticlesByIssueId = (issueId: number) =>
  articlePlaceholder.filter((article) => article.issue_id === issueId);

export const getMarkdownByArticleId = async (articleId: string) => {
  const article = articlePlaceholder.find(
    (article) => article.id === articleId
  );

  if (article == null) {
    return undefined;
  }

  const { issue_id, id } = article;

  const content = await fs.readFile(
    path.join(
      process.cwd(),
      `content/issues/${issue_id}/article/${id}/page.mdx`
    ),
    "utf-8"
  );

  return content;
};

export const getArticleByArticleId = (articleId: string) =>
  articlePlaceholder.find((article) => article.id === articleId);

export const getAuthorById = (authorId: string) =>
  usersPlaceholder.find((user) => user.id === authorId);
