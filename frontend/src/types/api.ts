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

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface RegisterResponse {
  user: {
      username: string;
      email: string;
  };
  message: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface ApiErrorDetail {
  [field: string]: string[];
}

export interface ApiErrorResponse {
  detail?: string;
  error?: ApiErrorDetail | string;
}