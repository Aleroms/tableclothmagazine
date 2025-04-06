// last name optional to support usernames
export interface User {
  id: string;
  img_url?: string;
  role: string;
  auth_level: string;
  first_name: string;
  last_name?: string;
}

export interface Article {
  id: string;
  issue_id: string;
  writer: User;
  title: string;
  content: string;
  release_date: Date;
}

export interface Issue {
  id: string;
  name: string;
  img_url: string;
  editors_note: string;
  editor: User;
  release_date: Date;
  articles: Article[];
}

export interface Showcase {
  id: string;
  img_url: string;
  link: string;
  name?: string;
}
