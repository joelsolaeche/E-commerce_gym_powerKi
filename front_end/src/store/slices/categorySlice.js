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
        url: `/categories/update/${id}`,
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

// Create a slice to store local category state
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for any category query
      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type.includes('Categories'),
        (state) => {
          state.loading = true;
        }
      )
      // Handle fulfilled state for any category query
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && action.type.includes('Categories'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      // Handle rejected state for any category query
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.includes('Categories'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'An unknown error occurred';
        }
      );
  },
});

export const { clearCategoryError } = categorySlice.actions;

export default categorySlice.reducer; 