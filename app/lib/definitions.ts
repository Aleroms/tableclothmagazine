// last name optional to support usernames
export interface User {
  id: string;
  img_url?: string;
  role: string;
  auth_level: "admin" | "writer" | "basic";
  first_name: string;
  last_name?: string;
  pronouns?: string;
  fav_color?: string;
  description?: string;
}

export interface Article {
  id: string;
  issue_id: number;
  writer_id: string;
  title: string;
  content: string;
  markdown?: string;
  release_date: Date;
}

export interface Issue {
  id: number;
  name: string;
  img_url: string;
  editors_note: string;
  editor_id: string;
  release_date: Date;
  description: string;
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
  duration?: string;
}
