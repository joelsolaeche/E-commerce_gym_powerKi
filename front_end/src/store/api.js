import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';

// Define the base query
const baseQuery = fetchBaseQuery({
  baseUrl: config.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from auth state
    const token = getState().auth.token;
    
    // If we have a token, add it to the request headers
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
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