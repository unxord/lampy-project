export interface MainContentItem {
    id: number;
    title: string;
    content: string;
    content_type: 'INFO' | 'ANNOUNCE' | 'NEWS';
    content_type_display: string;
    read_more_link: string | null;
    order: number;
    created_at: string;
    updated_at: string;
  }

  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}