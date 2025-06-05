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
    getProductsByPriceRange: builder.query({
      query: ({ minPrice, maxPrice }) => 
        `/products/byPrice?minPrice=${minPrice}&maxPrice=${maxPrice}`,
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
      query: ({ id, ...productData }) => ({
        url: `/products/update/${id}`,
        method: 'PUT',
        body: productData,
      }),
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

// Export the auto-generated hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetProductsByPriceRangeQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

// Create the product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

// Export actions and reducer
export const { setSelectedProduct, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer; 