import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';

// Create the base query
const baseQuery = fetchBaseQuery({
  baseUrl: config.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state only (no localStorage for security)
    const token = getState().auth?.token;
    
    if (token) {
      console.log('API: Setting Authorization header');
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('API: No token found in Redux state!');
    }
    
    return headers;
  },
});

// Create the API
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Products', 'User', 'Cart', 'Orders', 'Categories'],
  endpoints: () => ({}),
});

// We'll define specific API slices in separate files that will inject
// endpoints into this API 