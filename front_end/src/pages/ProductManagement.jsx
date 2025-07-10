import { useState, useEffect } from 'react'
import { useReduxProducts, useReduxCategories } from '../hooks'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify'

// Utility function to process image URLs
const processImageUrl = (url) => {
  // If URL is empty, return a default image
  if (!url || url.trim() === '') {
    return 'https://via.placeholder.com/300x200?text=Producto';
  }

  try {
    // If URL is too long, try to create a shorter version for database storage
    if (url.length > 250) {
      // Try to use a URL shortener service or image hosting API here
      // For now, we'll just use the original URL and let the backend handle it
      console.warn("Long image URL detected:", url.length, "characters");
      return url;
    }
    return url;
  } catch (error) {
    console.error("Error processing image URL:", error);
    return 'https://via.placeholder.com/300x200?text=Error';
  }
};

const ProductManagement = ({ setCurrentPage }) => {
  const { user, token } = useUser()
  
  const {
    products: allProducts = [],
    isLoading: isProductsLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetchProducts
  } = useReduxProducts()
  
  const {
    categories: categoryData = [],
    isLoading: isCategoriesLoading
  } = useReduxCategories()
  
  const categories = categoryData
  
  // Filter products to show only those created by the current seller
  const products = allProducts.filter(product => {
    if (!user?.id) return false
    
    // Check direct sellerId property
    if (product.sellerId && product.sellerId === user.id) {
      return true
    }
    
    // Check nested seller object
    if (product.seller && product.seller.id === user.id) {
      return true
    }
    
    return false
  })
  console.log('📦 All products:', allProducts.length)
  console.log('🎯 Filtered products for seller:', products.length)
  if (allProducts.length > 0) {
    console.log('📋 Sample product structure:', {
      id: allProducts[0]?.id,
      name: allProducts[0]?.name,
      sellerId: allProducts[0]?.sellerId,
      seller: allProducts[0]?.seller,
      allKeys: Object.keys(allProducts[0] || {})
    })
  }
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    stock: '',
    image: '',
    discountPercentage: ''
  })
  const [imagePreview, setImagePreview] = useState(null)
  
  // Update image preview when image URL changes
  useEffect(() => {
    if (formData.image) {
      console.log("Using image URL for preview:", formData.image);
      setImagePreview(formData.image);
    } else {
      console.log("No image to preview");
      setImagePreview(null);
    }
  }, [formData.image]);
  
  if (!user || user.type !== 'seller') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-md border border-red-400/50 rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-3xl font-bold text-white mb-4">⚡ Acceso Denegado ⚡</h2>
            <p className="text-red-100 mb-6 text-lg">
              Necesitas despertar como vendedor para gestionar el arsenal de entrenamiento.
            </p>
            <button
              onClick={() => setCurrentPage('login')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 animate-super-saiyan-glow"
            >
              ⚡ Despertar como Vendedor
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Create a copy of form data for submission
    const productData = {
      name: formData.name,
      description: formData.description,
      categoryId: parseInt(formData.categoryId), // Make sure to send categoryId as number
      stockQuantity: parseInt(formData.stock),
      sellerId: user.id // Add the current user as the seller
    }
    
    // Handle price and discount percentage
    const currentPrice = parseFloat(formData.price);
    productData.originalPrice = currentPrice;
    
    // Handle discount percentage
    if (formData.discountPercentage && formData.discountPercentage.trim() !== '') {
      const discountPercentage = parseInt(formData.discountPercentage);
      if (!isNaN(discountPercentage) && discountPercentage > 0) {
        productData.discountPercentage = discountPercentage;
        // Calculate the discounted price
        productData.price = currentPrice - (currentPrice * (discountPercentage / 100));
      } else {
        productData.price = currentPrice;
        productData.discountPercentage = 0;
      }
    } else {
      productData.price = currentPrice;
      productData.discountPercentage = 0;
    }
    
    // Handle image URL
    if (formData.image && formData.image.trim() !== '') {
      const imageUrl = formData.image.trim();
      
      // Check if URL is too long (over 250 chars is likely to cause issues)
      if (imageUrl.length > 250) {
        try {
          // For very long URLs, use a URL shortener or image proxy
          // Here we'll use a simple approach of taking just the domain and path
          const urlObj = new URL(imageUrl);
          const domain = urlObj.hostname;
          const path = urlObj.pathname;
          
          // Create a shortened version that keeps the domain and last part of the path
          const pathParts = path.split('/');
          const lastPathPart = pathParts[pathParts.length - 1];
          
          // If the last part is still too long, truncate it
          const shortenedUrl = `https://${domain}/.../${lastPathPart.substring(0, 30)}`;
          
          toast.info(`La URL de la imagen es muy larga y ha sido acortada. La imagen podría no mostrarse correctamente.`);
          console.log("Original URL was too long, using shortened reference:", shortenedUrl);
          
          // Use the original URL but warn the user
          productData.image = imageUrl;
        } catch (error) {
          console.error("Error processing image URL:", error);
          // Fallback to default image
          productData.image = 'https://via.placeholder.com/300x200?text=Producto';
          toast.warning("La URL de imagen no es válida. Se usará una imagen predeterminada.");
        }
      } else {
        productData.image = imageUrl;
        console.log("Using image URL:", imageUrl);
      }
    } else {
      // Default image if nothing provided - using a shorter placeholder URL
      productData.image = 'https://via.placeholder.com/300x200?text=Producto';
      console.log("Using default image");
    }
    
    // Log the product data we're about to submit
    console.log("Submitting product data:", productData);
    
    try {
      let result
      
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData)
      } else {
        result = await createProduct(productData)
      }
      
      console.log("Operation result:", result)
      
      if (result.success) {
        console.log("Product saved successfully:", result.data)
        toast.success(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
        await refetchProducts()  // Refresh the products list
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          description: '',
          categoryId: '',
          stock: '',
          image: '',
          discountPercentage: ''
        })
        setImagePreview(null)
        setEditingProduct(null)
        setShowAddForm(false)
      } else {
        console.error("Failed to save product:", result.error)
        toast.error(`Error: ${result.error || 'Failed to save product'}`)
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      toast.error(`Error: ${error.message || 'Unknown error'}`)
    }
  }

  const handleEdit = (product) => {
    console.log("Editing product:", product)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: (product.originalPrice || product.price).toString(),
      description: product.description,
      categoryId: product.categoryId?.toString() || '',
      stock: product.stockQuantity?.toString() || '',
      image: product.image || '',
      discountPercentage: product.discountPercentage?.toString() || ''
    })
    setImagePreview(product.image)
    setShowAddForm(true)
  }

  const handleDelete = async (productId) => {
    // Find the product name for better notification
    const productToDelete = products.find(p => p.id === productId);
    const productName = productToDelete ? productToDelete.name : 'producto';
    
    // Use toast confirmation instead of window.confirm
    toast.info(
      <div>
        <p>¿Estás seguro de eliminar {productName}?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button 
            onClick={async () => {
              toast.dismiss();
              const result = await deleteProduct(productId);
              if (result.success) {
                toast.success('Producto eliminado correctamente');
                console.log("Product deleted successfully");
                await refetchProducts();  // Refresh the products list
              } else {
                console.error("Failed to delete product:", result.error);
                toast.error(`Error: ${result.error || 'Failed to delete product'}`);
              }
            }}
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Eliminar
          </button>
          <button 
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false
      }
    );
  }

  const cancelForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      categoryId: '',
      stock: '',
      image: '',
      discountPercentage: ''
    })
    setImagePreview(null)
    setEditingProduct(null)
    setShowAddForm(false)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent mb-2">
              <span className="animate-pulse">🐉⚡</span> Arsenal de Entrenamiento Universal
            </h1>
            <p className="text-blue-700 text-lg">Administra tu inventario de equipamiento para guerreros</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 animate-super-saiyan-glow border border-orange-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>⚡ Agregar Arsenal</span>
          </button>
        </div>
        
        {/* Loading indicator */}
        {(isProductsLoading || isCategoriesLoading) && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
            <span className="ml-3 text-lg font-medium text-orange-500">Cargando...</span>
          </div>
        )}

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-cream-100 via-yellow-50 to-orange-100 backdrop-blur-md rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto shadow-2xl border-2 border-orange-400/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  ⚡ {editingProduct ? 'Actualizar Arsenal' : 'Forjar Nuevo Arsenal'} ⚡
                </h2>
                <button
                  onClick={cancelForm}
                  className="text-orange-500 hover:text-orange-700 p-2 rounded-lg hover:bg-orange-100 transition-all duration-200 transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    🏷️ Nombre del Arsenal
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                    style={{ fontSize: '16px', fontWeight: '500' }}
                    placeholder="Ej: Pesas del Entrenamiento Saiyan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">
                      💰 Precio Original (Zeni)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                      style={{ fontSize: '16px', fontWeight: '500' }}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">
                      🔥 Descuento (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="99"
                      className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                      style={{ fontSize: '16px', fontWeight: '500' }}
                      placeholder="0"
                    />
                    <p className="text-xs text-orange-600 font-medium mt-1">✨ Opcional - Ej: 10 para 10% de descuento</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">
                      📦 Cantidad Disponible
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                      className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                      style={{ fontSize: '16px', fontWeight: '500' }}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    🏷️ Tipo de Arsenal
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                    style={{ fontSize: '16px', fontWeight: '500' }}
                  >
                    <option value="">Selecciona el tipo de arsenal</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id} className="bg-white text-gray-800">
                        {category.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    🖼️ Imagen del Arsenal
                  </label>
                  <div className="space-y-3">
                    {/* Image preview */}
                    {imagePreview && (
                      <div className="mb-3 flex justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-40 w-auto object-contain rounded-lg border-2 border-orange-300 shadow-md"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjRkY2RjAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIj5BcnNlbmFsPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                      </div>
                    )}
                    
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full px-4 py-3.5 bg-white border-2 ${formData.image && formData.image.length > 250 ? 'border-red-400' : 'border-orange-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm`}
                      style={{ fontSize: '16px', fontWeight: '500' }}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-orange-600 font-medium">✨ Ingresa la URL de la imagen</p>
                      {formData.image && formData.image.length > 250 && (
                        <p className="text-xs text-red-600 font-medium">⚠️ URL demasiado larga (podría causar errores)</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Recomendación: Usa URLs cortas para evitar errores en la base de datos.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    📝 Descripción del Arsenal
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                    style={{ fontSize: '16px', fontWeight: '500' }}
                    placeholder="Describe las propiedades y beneficios de este arsenal de entrenamiento..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 animate-super-saiyan-glow border border-orange-400"
                  >
                    ⚡ {editingProduct ? 'Actualizar Arsenal' : 'Forjar Arsenal'} ⚡
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-400"
                  >
                    🚫 Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-400/50 hover:shadow-orange-500/20 hover:shadow-2xl transition-all duration-500">
          <div className="px-6 py-4 border-b border-orange-400/30 bg-gradient-to-r from-orange-500/20 to-yellow-500/20">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
              ⚔️ Tu Arsenal de Entrenamiento ⚔️
            </h3>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-orange-400 mb-4">
                <div className="text-6xl mb-4">📦</div>
              </div>
              <p className="text-blue-700 text-xl font-semibold">Arsenal Vacío</p>
              <p className="text-blue-600 mt-2">Forja tu primer arsenal para comenzar el entrenamiento</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500/30 to-yellow-500/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                      🏷️ Arsenal
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                      💰 Precio / 🔥 Descuento
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                      🏷️ Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                      📦 Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                      ⚙️ Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-500/20">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-orange-500/10 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover mr-4 shadow-lg border-2 border-orange-400/50 group-hover:border-orange-400 transition-all duration-200"
                            onError={(e) => {
                              // Use a data URI for the fallback image instead of an external URL
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjRkY2RjAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIj5BcnNlbmFsPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                          <div>
                            <div className="text-sm font-bold text-gray-800">
                              {product.name}
                            </div>
                            <div className="text-sm text-blue-600 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-yellow-400">
                          ${product.price?.toFixed(2)}
                        </div>
                        {product.discountPercentage > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-500 line-through">${product.originalPrice?.toFixed(2)}</span>
                            <span className="inline-flex px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                              -{product.discountPercentage}%
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white shadow-md">
                          {product.category?.description || product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {product.stockQuantity} unidades
                        </div>
                        {product.stockQuantity < 10 && (
                          <div className="text-xs text-red-500 font-semibold animate-pulse">⚠️ Stock Crítico</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-orange-400 hover:text-orange-300 transition-all duration-200 p-2 rounded-lg hover:bg-orange-500/20 transform hover:scale-110"
                            title="Editar Arsenal"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-400 hover:text-red-300 transition-all duration-200 p-2 rounded-lg hover:bg-red-500/20 transform hover:scale-110"
                            title="Destruir Arsenal"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back to Catalog Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentPage('catalog')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-400"
          >
            🏠 Volver al Dojo Principal
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductManagement

