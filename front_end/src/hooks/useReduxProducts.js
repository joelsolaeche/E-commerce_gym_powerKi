import { useSelector, useDispatch } from 'react-redux';
import {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByPriceRangeQuery,
  useGetProductsBySellerQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  setSelectedProduct,
  setSelectedCategory,
  setPriceRange,
  setSearchTerm,
  setFeaturedProducts,
  clearProductError
} from '../store/slices/productSlice';

export const useReduxProducts = () => {
  const productsState = useSelector(state => state.products);
  const dispatch = useDispatch();
  
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
    dispatch(setSearchTerm(searchTerm));
    const { data, isLoading, error } = useSearchProductsQuery(searchTerm);
    return { products: data, isLoading, error };
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    dispatch(setSelectedCategory(category));
    if (category === 'all') {
      return { products: allProducts, isLoading: isLoadingProducts };
    }
    const { data, isLoading, error } = useGetProductsByCategoryQuery(category);
    return { products: data, isLoading, error };
  };
  
  // Get products by price range
  const getProductsByPriceRange = (minPrice, maxPrice) => {
    dispatch(setPriceRange({ min: minPrice, max: maxPrice }));
    const { data, isLoading, error } = useGetProductsByPriceRangeQuery({ minPrice, maxPrice });
    return { products: data, isLoading, error };
  };

  // Get products by seller ID
  const getProductsBySeller = (sellerId) => {
    const { data, isLoading, error, refetch } = useGetProductsBySellerQuery(sellerId, { 
      refetchOnMountOrArgChange: true 
    });
    return { products: data, isLoading, error, refetch };
  };
  
  // Set featured products
  const setFeatured = (products) => {
    dispatch(setFeaturedProducts(products));
  };

  // Set selected product
  const selectProduct = (product) => {
    dispatch(setSelectedProduct(product));
  };

  // Clear product errors
  const clearErrors = () => {
    dispatch(clearProductError());
  };
  
  // Create product
  const [createProductMutation, createProductResult] = useCreateProductMutation();
  const createProduct = async (productData) => {
    try {
      console.log("Creating product with data:", productData);
      const formData = new FormData();
      
      // Handle image field separately
      let hasImage = false;
      
      Object.keys(productData).forEach(key => {
        if (key === 'image') {
          if (productData[key] instanceof File) {
            // Ensure the file is a valid image before adding to FormData
            if (productData[key].type.startsWith('image/')) {
              formData.append('image', productData[key]);
              console.log("Added image file to FormData:", productData[key].name);
              hasImage = true;
            } else {
              console.error("Invalid image file type:", productData[key].type);
            }
          } else if (typeof productData[key] === 'string' && productData[key].trim() !== '') {
            // For string URLs, use imageUrl parameter instead of image
            formData.append('imageUrl', productData[key]);
            console.log("Added imageUrl to FormData:", productData[key]);
            hasImage = true;
          }
        } else if (key === 'categoryId') {
          // Ensure categoryId is sent as number
          formData.append(key, productData[key]);
          console.log("Added categoryId to FormData:", productData[key]);
        } else {
          formData.append(key, productData[key]);
        }
      });
      
      // If no image is provided, use a default one
      if (!hasImage) {
        formData.append('imageUrl', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjRkY2RjAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIj5BcnNlbmFsPC90ZXh0Pjwvc3ZnPg==');
        console.log("Using default image");
      }
      
      const result = await createProductMutation(formData).unwrap();
      console.log("Product created successfully:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to create product:", error);
      return { success: false, error: error.data?.message || 'Failed to create product' };
    }
  };
  
  // Update product
  const [updateProductMutation, updateProductResult] = useUpdateProductMutation();
  const updateProduct = async (id, productData) => {
    try {
      console.log("Updating product with ID:", id, "and data:", productData);
      const formData = new FormData();
      
      // Handle image field separately
      let hasImage = false;
      
      // Add all fields to FormData
      Object.keys(productData).forEach(key => {
        if (key === 'image') {
          if (productData[key] instanceof File) {
            // Ensure the file is a valid image before adding to FormData
            if (productData[key].type.startsWith('image/')) {
              formData.append('image', productData[key]);
              console.log("Added image file to FormData:", productData[key].name);
              hasImage = true;
            } else {
              console.error("Invalid image file type:", productData[key].type);
            }
          } else if (typeof productData[key] === 'string' && productData[key].trim() !== '') {
            // For string URLs, use imageUrl parameter instead of image
            formData.append('imageUrl', productData[key]);
            console.log("Added imageUrl to FormData:", productData[key]);
            hasImage = true;
          }
        } else if (key === 'categoryId') {
          // Ensure categoryId is sent as number
          formData.append(key, productData[key]);
          console.log("Added categoryId to FormData:", productData[key]);
        } else {
          formData.append(key, productData[key]);
        }
      });
      
      // Log all entries in the FormData object for debugging
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      // IMPORTANT: Don't convert FormData to plain object - pass it directly
      const result = await updateProductMutation({ id, formData }).unwrap();
      console.log("Product updated successfully:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to update product:", error);
      return { success: false, error: error.data?.message || 'Failed to update product' };
    }
  };
  
  // Delete product
  const [deleteProductMutation, deleteProductResult] = useDeleteProductMutation();
  const deleteProduct = async (id) => {
    try {
      console.log("Deleting product with ID:", id);
      await deleteProductMutation(id).unwrap();
      console.log("Product deletion successful");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete product:", error);
      return { success: false, error: error.data?.message || 'Failed to delete product' };
    }
  };
  
  // Filter products by multiple criteria
  const filterProducts = (products = [], filters = {}) => {
    if (!products) return [];
    
    return products.filter(product => {
      // Search term filter
      const matchesSearch = !filters.searchTerm || 
        product.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = !filters.category || filters.category === 'all' || 
        product.category === filters.category;
      
      // Price range filter
      let matchesPrice = true;
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        matchesPrice = product.price >= filters.minPrice && 
          (filters.maxPrice === 0 || product.price <= filters.maxPrice);
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  };
  
  return {
    // Data
    products: allProducts || [],
    selectedProduct: productsState.selectedProduct,
    selectedCategory: productsState.selectedCategory,
    priceRange: productsState.priceRange,
    searchTerm: productsState.searchTerm,
    featuredProducts: productsState.featuredProducts,
    
    // Status
    isLoading: productsState.loading || isLoadingProducts || 
      createProductResult.isLoading || 
      updateProductResult.isLoading || 
      deleteProductResult.isLoading,
    error: productsState.error,
    
    // Methods
    getProductById,
    searchProducts,
    getProductsByCategory,
    getProductsByPriceRange,
    getProductsBySeller,
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts,
    selectProduct,
    setFeatured,
    clearErrors,
    filterProducts
  };
}; 