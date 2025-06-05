import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api';

// Categories API endpoints
export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Categories', id }],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

// Create the categories slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
});

// Export actions and reducer
export const { setSelectedCategory, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer; 