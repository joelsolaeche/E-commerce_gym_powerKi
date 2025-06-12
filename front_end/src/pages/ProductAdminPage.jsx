import { useState, useEffect } from 'react';
import { useReduxProducts } from '../hooks/useReduxProducts';
import { useReduxCategories } from '../hooks';

const ProductAdminPage = () => {
  const { products, isLoading, createProduct, updateProduct, deleteProduct, refetchProducts } = useReduxProducts();
  const { categories } = useReduxCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    originalPrice: '',
    price: '',
    discountPercentage: '0',
    stockQuantity: '',
    categoryId: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        name: '',
        description: '',
        originalPrice: '',
        price: '',
        discountPercentage: '0',
        stockQuantity: '',
        categoryId: '',
        image: null
      });
      setImagePreview(null);
      setSelectedProduct(null);
    }
  }, [isModalOpen]);

  // Fill form data when editing a product
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || '',
        description: selectedProduct.description || '',
        originalPrice: selectedProduct.originalPrice?.toString() || '',
        price: selectedProduct.price?.toString() || '',
        discountPercentage: selectedProduct.discountPercentage?.toString() || '0',
        stockQuantity: selectedProduct.stockQuantity?.toString() || '',
        categoryId: selectedProduct.categoryId?.toString() || '',
        image: null // We don't load the existing image into the input
      });
      setImagePreview(selectedProduct.image);
    }
  }, [selectedProduct]);

  // Calculate price based on original price and discount
  useEffect(() => {
    if (formData.originalPrice && formData.discountPercentage) {
      const originalPrice = parseFloat(formData.originalPrice);
      const discountPercentage = parseFloat(formData.discountPercentage);
      
      if (!isNaN(originalPrice) && !isNaN(discountPercentage)) {
        const discountAmount = originalPrice * (discountPercentage / 100);
        const price = originalPrice - discountAmount;
        setFormData(prev => ({ ...prev, price: price.toFixed(2) }));
      }
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter products based on search term
  const filteredProducts = products?.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle product save (create or update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Convert string values to proper types
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('originalPrice', parseFloat(formData.originalPrice));
      productData.append('price', parseFloat(formData.price));
      productData.append('discountPercentage', parseFloat(formData.discountPercentage));
      productData.append('stockQuantity', parseInt(formData.stockQuantity));
      productData.append('categoryId', parseInt(formData.categoryId));
      
      if (formData.image) {
        productData.append('image', formData.image);
      }
      
      let result;
      
      if (selectedProduct) {
        // Update existing product
        result = await updateProduct(selectedProduct.id, productData);
      } else {
        // Create new product
        result = await createProduct(productData);
      }
      
      if (result.success) {
        setFeedback({
          type: 'success',
          message: selectedProduct 
            ? 'Producto actualizado correctamente' 
            : 'Producto creado correctamente'
        });
        setIsModalOpen(false);
        refetchProducts();
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Error al guardar el producto'
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Error al guardar el producto'
      });
      console.error('Error saving product:', error);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const result = await deleteProduct(selectedProduct.id);
      
      if (result.success) {
        setFeedback({
          type: 'success',
          message: 'Producto eliminado correctamente'
        });
        setIsDeleteModalOpen(false);
        refetchProducts();
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Error al eliminar el producto'
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Error al eliminar el producto'
      });
      console.error('Error deleting product:', error);
    }
  };

  // Open edit modal
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Clear feedback message after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administración de Productos</h1>
        <button 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Agregar Producto
        </button>
      </div>
      
      {/* Feedback Message */}
      {feedback.message && (
        <div className={`p-4 mb-6 rounded-lg ${
          feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {feedback.message}
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  Cargando productos...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={product.image || 'https://via.placeholder.com/150'} 
                          alt={product.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price}</div>
                    {product.discountPercentage > 0 && (
                      <div className="text-xs text-red-600">
                        -{product.discountPercentage}% de descuento
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${
                      product.stockQuantity > 10 
                        ? 'text-green-600' 
                        : product.stockQuantity > 0 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {product.stockQuantity} unidades
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {selectedProduct ? 'Editar Producto' : 'Agregar Producto'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSaveProduct}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría *
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        {categories?.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Pricing and Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Original *
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descuento (%)
                      </label>
                      <input
                        type="number"
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio Final
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        readOnly
                        className="w-full p-2 border border-gray-200 rounded-md bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Image Upload */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen del Producto
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedProduct && !formData.image && "Deja vacío para mantener la imagen actual."}
                      </p>
                    </div>
                    {imagePreview && (
                      <div className="h-20 w-20 flex-shrink-0">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-20 w-20 object-cover border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 text-right">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                  >
                    {selectedProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
              <p className="mb-6">
                ¿Estás seguro de que deseas eliminar el producto "{selectedProduct?.name}"? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdminPage; 