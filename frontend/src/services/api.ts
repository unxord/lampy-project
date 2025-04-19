import {
  CommonContentItem,
  PaginatedResponse,
  PageName,
  RegisterData,
  RegisterResponse,
  LoginData,
  LoginResponse,
  ApiErrorResponse,
  ApiErrorDetail
} from '../types/api';

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

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const url = `${API_BASE_URL}auth/register/`;
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
           const errorBody: ApiErrorResponse | ApiErrorDetail = await response.json().catch(() => ({ detail: 'Unknown registration error' }));
           console.error('Registration API Error Body:', errorBody);

           let errorMessage = `Registration failed: ${response.status} ${response.statusText}`;

           if (errorBody && typeof errorBody === 'object') {
              if ('detail' in errorBody && typeof errorBody.detail === 'string') {
                  errorMessage = errorBody.detail;
              } else {
                  const allMessages = Object.values(errorBody)
                                         .flat()
                                         .filter(msg => typeof msg === 'string');

                  if (allMessages.length > 0) {
                      errorMessage = allMessages.join('. ');
                  } else {
                       errorMessage = "Произошла ошибка валидации.";
                  }
              }
           } else if (typeof errorBody === 'string') {
               errorMessage = errorBody;
           }

           console.log("Throwing error with formatted message:", errorMessage);
           throw new Error(errorMessage);
      }

      return await response.json() as RegisterResponse;

  } catch (error) {
      console.error(`Error registering user at ${url}:`, error);
      throw error;
  }
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const url = `${API_BASE_URL}auth/token/`;
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          const errorBody: ApiErrorResponse = await response.json().catch(() => ({ detail: 'Unknown login error' }));
          console.error('Login API Error:', errorBody);
           let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
           if (errorBody && typeof errorBody.detail === 'string') {
               errorMessage = errorBody.detail;
           }
          throw new Error(errorMessage);
      }

      return await response.json() as LoginResponse;

  } catch (error) {
      console.error(`Error logging in user at ${url}:`, error);
      throw error;
  }
};