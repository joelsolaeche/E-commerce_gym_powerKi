import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api';

// Product API endpoints
export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    searchProducts: builder.query({
      query: (name) => `/products/search?name=${encodeURIComponent(name)}`,
      providesTags: ['Products'],
    }),
    getProductsByCategory: builder.query({
      query: (category) => `/products/byCategory/${encodeURIComponent(category)}`,
      providesTags: ['Products'],
    }),
    getProductsByPriceRange: builder.query({
      query: ({ minPrice, maxPrice }) => 
        `/products/byPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`,
      providesTags: ['Products'],
    }),
    getProductsBySeller: builder.query({
      query: (sellerId) => `/products/bySeller/${sellerId}`,
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => {
        // For FormData objects, pass them directly without extracting
        if (formData instanceof FormData) {
          return {
            url: `/products/update/${id}`,
            method: 'PUT',
            body: formData,
            // Important: don't let RTK Query serialize FormData to JSON
            formData: true,
          };
        }
        
        // For regular objects, handle normally
        return {
          url: `/products/update/${id}`,
          method: 'PUT',
          body: formData || {}, // If formData is undefined, use empty object
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

// Export API hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByPriceRangeQuery,
  useGetProductsBySellerQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

// Create a slice to store local product state
const productSlice = createSlice({
  name: 'products',
  initialState: {
    selectedProduct: null,
    selectedCategory: 'all',
    priceRange: { min: 0, max: 1000 },
    searchTerm: '',
    error: null,
    loading: false,
    featuredProducts: [],
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for any product query
      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type.includes('Products'),
        (state) => {
          state.loading = true;
        }
      )
      // Handle fulfilled state for any product query
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && action.type.includes('Products'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      // Handle rejected state for any product query
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.includes('Products'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'An unknown error occurred';
        }
      );
  },
});

export const {
  setSelectedProduct,
  setSelectedCategory,
  setPriceRange,
  setSearchTerm,
  setFeaturedProducts,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer; 