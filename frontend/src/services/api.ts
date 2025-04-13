// frontend/src/services/api.ts
import { MainContentItem, PaginatedResponse } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

export const fetchMainContent = async (): Promise<MainContentItem[]> => {
  const response = await fetch(`${API_BASE_URL}maincontent/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch main content: ${response.status} ${response.statusText}`);
  }

  const data: PaginatedResponse<MainContentItem> = await response.json();

  if (typeof data === 'object' && data !== null && Array.isArray(data.results)) {
      return data.results;
  } else {
      console.error('Unexpected API response structure:', data);
      throw new Error('Неожиданная структура ответа от API');
  }
};