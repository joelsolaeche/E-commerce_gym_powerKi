import { createSlice } from '@reduxjs/toolkit';
import { api } from '../api';

// Cart API endpoints
export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: '/cart/add',
        method: 'POST',
        body: cartItem,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/update/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Cart', 'Orders'],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetUserCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useCreateOrderMutation,
} = cartApi;

// Create the cart slice for local state
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    // These reducers are for local cart state when offline
    // They can be replaced once the backend connection is established
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      state.itemCount = state.items.reduce(
        (count, item) => count + item.quantity, 
        0
      );
    },
    
    updateItem: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== productId);
      } else {
        const item = state.items.find(item => item.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
      
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      state.itemCount = state.items.reduce(
        (count, item) => count + item.quantity, 
        0
      );
    },
    
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      state.itemCount = state.items.reduce(
        (count, item) => count + item.quantity, 
        0
      );
    },
    
    clearItems: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    
    // When data is loaded from the server
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      state.itemCount = state.items.reduce(
        (count, item) => count + item.quantity, 
        0
      );
    },
  },
});

// Export actions and reducer
export const {
  addItem,
  updateItem,
  removeItem,
  clearItems,
  setCartItems
} = cartSlice.actions;

export default cartSlice.reducer; 