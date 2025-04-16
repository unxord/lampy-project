import { CommonContentItem, PaginatedResponse, PageName } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

export const fetchContentForPage = async (
  pageName: PageName,
  pageNumber: number = 1
): Promise<PaginatedResponse<CommonContentItem>> => {

  const url = `${API_BASE_URL}getcontent/${pageName}/?page=${pageNumber}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      let errorBody = 'No details available';
      try {
        errorBody = await response.text();
      } catch (e) {

      }
      console.error(`API Error Response: ${errorBody}`);
      throw new Error(`Failed to fetch content for page '${pageName}' (page ${pageNumber}): ${response.status} ${response.statusText}`);
    }

    const data: PaginatedResponse<CommonContentItem> = await response.json();

    if (typeof data !== 'object' || data === null || !Array.isArray(data.results)) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Неожиданная структура ответа от API');
    }

    return data;

  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
    throw error;
  }
};