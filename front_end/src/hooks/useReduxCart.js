import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../context/UserContext';
import {
  useGetUserCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useCreateOrderMutation,
  setCartItems,
  addItem,
  updateItem,
  removeItem,
  clearItems
} from '../store/slices/cartSlice';

export const useReduxCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const reduxAuth = useSelector(state => state.auth);
  const { user: contextUser } = useUser(); // Get user from context
  
  // Use either context user or redux auth, with context taking priority
  const isAuthenticated = !!contextUser || reduxAuth.isAuthenticated;
  const user = contextUser || reduxAuth.user;
  
  // Get user cart from API if authenticated, otherwise use local state
  const { data: serverCart, isLoading: isLoadingCart, refetch: refetchCart } = 
    useGetUserCartQuery(undefined, { 
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true 
    });
  
  // If server cart data is available, update local state
  if (serverCart && !isLoadingCart) {
    dispatch(setCartItems(serverCart));
  }
  
  // Add to cart
  const [addToCartMutation, addToCartResult] = useAddToCartMutation();
  const addToCart = async (product, quantity = 1) => {
    if (product.stockQuantity === 0) return false;
    
    if (isAuthenticated) {
      try {
        await addToCartMutation({ productId: product.id, quantity }).unwrap();
        refetchCart();
        return true;
      } catch (error) {
        console.error("Add to cart error:", error);
        return false;
      }
    } else {
      // Use local cart state if not authenticated
      dispatch(addItem({ product, quantity }));
      return true;
    }
  };
  
  // Update cart item
  const [updateCartItemMutation, updateCartItemResult] = useUpdateCartItemMutation();
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    if (isAuthenticated) {
      try {
        await updateCartItemMutation({ productId, quantity }).unwrap();
        refetchCart();
        return true;
      } catch (error) {
        console.error("Update quantity error:", error);
        return false;
      }
    } else {
      // Use local cart state if not authenticated
      dispatch(updateItem({ productId, quantity }));
      return true;
    }
  };
  
  // Remove from cart
  const [removeFromCartMutation, removeFromCartResult] = useRemoveFromCartMutation();
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await removeFromCartMutation(productId).unwrap();
        refetchCart();
        return true;
      } catch (error) {
        console.error("Remove from cart error:", error);
        return false;
      }
    } else {
      // Use local cart state if not authenticated
      dispatch(removeItem(productId));
      return true;
    }
  };
  
  // Clear cart
  const [clearCartMutation, clearCartResult] = useClearCartMutation();
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearCartMutation().unwrap();
        refetchCart();
        return true;
      } catch (error) {
        console.error("Clear cart error:", error);
        return false;
      }
    } else {
      // Use local cart state if not authenticated
      dispatch(clearItems());
      return true;
    }
  };
  
  // Create order
  const [createOrderMutation, createOrderResult] = useCreateOrderMutation();
  const createOrder = async (orderData) => {
    if (!isAuthenticated) {
      return { success: false, error: 'You must be logged in to create an order' };
    }
    
    // No localStorage usage for security
    
    try {
      // Make sure we use the user ID from the context if available
      const finalOrderData = {
        ...orderData,
        userId: user?.id || orderData.userId
      };
      
      console.log('Creating order with data:', finalOrderData);
      const result = await createOrderMutation(finalOrderData).unwrap();
      await clearCart();
      return { success: true, data: result };
    } catch (error) {
      console.error('Order creation error:', error);
      if (error.status === 403) {
        return { 
          success: false, 
          error: 'Error de autenticación: Su sesión ha expirado. Por favor, inicie sesión nuevamente.' 
        };
      }
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to create order' 
      };
    }
  };
  
  return {
    cart: cart.items,
    total: cart.total,
    itemCount: cart.itemCount,
    isLoading: isLoadingCart || 
               addToCartResult.isLoading || 
               updateCartItemResult.isLoading || 
               removeFromCartResult.isLoading || 
               clearCartResult.isLoading || 
               createOrderResult.isLoading,
    error: cart.error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    refetchCart,
    isAuthenticated
  };
}; 