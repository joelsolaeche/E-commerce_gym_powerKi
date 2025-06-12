import { useSelector } from 'react-redux';
import {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../store/slices/categorySlice';

export const useReduxCategories = () => {
  const categories = useSelector(state => state.categories);
  
  // Get all categories
  const { data: allCategories, isLoading: isLoadingCategories, refetch: refetchCategories } = 
    useGetCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });
  
  // Get category by ID
  const getCategoryById = (id) => {
    const { data, isLoading, error } = useGetCategoryByIdQuery(id);
    return { category: data, isLoading, error };
  };
  
  // Create category
  const [createCategoryMutation, createCategoryResult] = useCreateCategoryMutation();
  const createCategory = async (categoryData) => {
    try {
      const result = await createCategoryMutation(categoryData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to create category' };
    }
  };
  
  // Update category
  const [updateCategoryMutation, updateCategoryResult] = useUpdateCategoryMutation();
  const updateCategory = async (id, categoryData) => {
    try {
      const result = await updateCategoryMutation({ id, ...categoryData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to update category' };
    }
  };
  
  // Delete category
  const [deleteCategoryMutation, deleteCategoryResult] = useDeleteCategoryMutation();
  const deleteCategory = async (id) => {
    try {
      await deleteCategoryMutation(id).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Failed to delete category' };
    }
  };
  
  return {
    // Data
    categories: allCategories || [],
    
    // Status
    isLoading: categories.loading || isLoadingCategories || 
      createCategoryResult.isLoading || 
      updateCategoryResult.isLoading || 
      deleteCategoryResult.isLoading,
    error: categories.error,
    
    // Methods
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    refetchCategories
  };
}; 