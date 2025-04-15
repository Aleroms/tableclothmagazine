// last name optional to support usernames
export interface User {
  id: string;
  img_url?: string;
  role: string;
  auth_level: "admin" | "writer";
  first_name: string;
  last_name?: string;
  pronouns?: string;
}

export interface Article {
  id: string;
  issue_id: string;
  writer_id: string;
  title: string;
  content: string;
  release_date: Date;
}

export interface Issue {
  id: string;
  name: string;
  img_url: string;
  editors_note: string;
  editor_id: string;
  release_date: Date;
}

export interface Showcase {
  id: string;
  img_url: string;
  link: string;
  name?: string;
}

export interface Event {
  id: string;
  startDate: Date;
  endDate?: Date;
  title: string;
  notes?: string;
  externalLink?: string;
}
