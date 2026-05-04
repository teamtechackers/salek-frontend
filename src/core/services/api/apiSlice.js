import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

// Add a global error handler for 401 responses
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Determine the request URL — args can be a string or an object
  const requestUrl = typeof args === 'string' ? args : args?.url;
  const isLoginRequest = requestUrl?.includes('/admin/login');

  // Only redirect on 401 for authenticated (non-login) requests.
  // Login failures also return 401 but should show an inline error, not a redirect.
  if (result.error && result.error.status === 401 && !isLoginRequest) {
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    toast.error('Session expired. Please login again.');
    window.location.href = '/login';
  }

  return result;
};

export const apiSliceWithAuth = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ['User', 'Vaccine', 'Notification'],
});
