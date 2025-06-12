import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';

// Create the base query
const baseQuery = fetchBaseQuery({
  baseUrl: config.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // ENHANCED TOKEN LOGIC: Try multiple sources to get a valid token
    let token = null;
    
    // 1. Try direct token storage first (most reliable)
    token = localStorage.getItem('token');
    
    // 2. If not found, try from user object in localStorage
    if (!token) {
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user && user.token) {
            console.log('API: Found token in user object');
            token = user.token;
            // Also save it directly for future use
            localStorage.setItem('token', token);
          }
        }
      } catch (e) {
        console.error('API: Error parsing user from localStorage:', e);
      }
    }
    
    if (token) {
      console.log('API: Setting Authorization header');
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('API: No token found from any source!');
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