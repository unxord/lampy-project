export type PageName = 'home' | 'about' | 'help';

export interface CommonContentItem {
  id: number;
  page: PageName;
  title: string;
  content: string;
  read_more_link: string | null;
  display_author: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}