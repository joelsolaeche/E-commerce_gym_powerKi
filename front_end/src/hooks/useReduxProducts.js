import { useSelector } from 'react-redux';
import {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetProductsByPriceRangeQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../store/slices/productSlice';

export const useReduxProducts = () => {
  const products = useSelector(state => state.products);
  
  // Get all products
  const { data: allProducts, isLoading: isLoadingProducts, refetch: refetchProducts } = 
    useGetProductsQuery(undefined, { refetchOnMountOrArgChange: true });
  
  // Get product by ID
  const getProductById = (id) => {
    const { data, isLoading, error } = useGetProductByIdQuery(id);
    return { product: data, isLoading, error };
  };
  
  // Search products
  const searchProducts = (searchTerm) => {
    const { data, isLoading, error } = useSearchProductsQuery(searchTerm);
    return { products: data, isLoading, error };
  };
  
  // Get products by price range
  const getProductsByPriceRange = (minPrice, maxPrice) => {
    const { data, isLoading, error } = useGetProductsByPriceRangeQuery({ minPrice, maxPrice });
    return { products: data, isLoading, error };
  };
  
  // Create product
  const [createProductMutation, createProductResult] = useCreateProductMutation();
  const createProduct = async (productData) => {
    try {
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key] instanceof File) {
          formData.append(key, productData[key]);
        } else {
          formData.append(key, productData[key]);
        }
      });
      
      const result = await createProductMutation(formData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to create product' };
    }
  };
  
  // Update product
  const [updateProductMutation, updateProductResult] = useUpdateProductMutation();
  const updateProduct = async (id, productData) => {
    try {
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (key === 'image' && productData[key] instanceof File) {
          formData.append(key, productData[key]);
        } else {
          formData.append(key, productData[key]);
        }
      });
      
      const result = await updateProductMutation({ id, ...formData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to update product' };
    }
  };
  
  // Delete product
  const [deleteProductMutation, deleteProductResult] = useDeleteProductMutation();
  const deleteProduct = async (id) => {
    try {
      await deleteProductMutation(id).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to delete product' };
    }
  };
  
  return {
    products: allProducts || [],
    isLoading: isLoadingProducts || createProductResult.isLoading || updateProductResult.isLoading || deleteProductResult.isLoading,
    error: products.error,
    getProductById,
    searchProducts,
    getProductsByPriceRange,
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts,
    selectedProduct: products.selectedProduct
  };
}; 