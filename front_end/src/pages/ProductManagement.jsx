import { useState } from 'react'
import { useUser } from '../context/UserContext'

// Power Ki Gym products data for demonstration
const initialProducts = [
  {
    id: 1,
    name: 'Proteína Whey Gold Standard',
    price: 45.00,
    description: 'Proteína de suero de leche de la más alta calidad. 24g de proteína por porción.',
    category: 'Suplementos',
    stock: 25,
    image: 'https://farmaciadelpuebloar.vtexassets.com/arquivos/ids/174764/PROTEINA-GOLD-STANDARD-OPTIMUM-NUTRITION-907-GR.jpg?v=638490612095100000'
  },
  {
    id: 2,
    name: 'Bandas Elásticas Set Completo',
    price: 35.00,
    description: 'Set de 5 bandas de resistencia con diferentes niveles de resistencia.',
    category: 'Accesorios',
    stock: 15,
    image: 'https://sportfitness.co/cdn/shop/collections/set-de-bandas-elasticas-x5-sportfitness.jpg?v=1670008040'
  }
]

const ProductManagement = ({ setCurrentPage }) => {
  const { user } = useUser()
  const [products, setProducts] = useState(initialProducts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    image: ''
  })
  // Power Ki Gym categories for dropdown
  const categories = ['Suplementos', 'Accesorios']  // Check if user is a seller
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id 
          ? { ...formData, id: editingProduct.id, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : product
      ))
      setEditingProduct(null)
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: products.length + 1,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }
      setProducts(prev => [...prev, newProduct])
    }

    // Reset form
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      image: ''
    })
    setShowAddForm(false)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      image: product.image
    })
    setShowAddForm(true)
  }

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId))
    }
  }

  const cancelForm = () => {
    setShowAddForm(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      image: ''    })
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
        </div>      {/* Add/Edit Product Form */}
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
                </label>                <input
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 mb-2">
                    💰 Precio (Zeni)
                  </label>                  <input
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
                    📦 Cantidad Disponible
                  </label>                  <input
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
                </label>                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                  style={{ fontSize: '16px', fontWeight: '500' }}
                >
                  <option value="">Selecciona el tipo de arsenal</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-white text-gray-800">{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  🖼️ Imagen del Arsenal
                </label>                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3.5 bg-white border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:border-orange-400 focus:shadow-lg shadow-sm"
                  style={{ fontSize: '16px', fontWeight: '500' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  📝 Descripción del Arsenal
                </label>                <textarea
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
      )}        {/* Products Table */}
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
              <table className="w-full">                <thead className="bg-gradient-to-r from-orange-500/30 to-yellow-500/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                      🏷️ Arsenal
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                      💰 Precio (Zeni)
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
                              e.target.src = 'https://via.placeholder.com/56x56/FF6F00/FFFFFF?text=Arsenal'
                            }}
                          />                          <div>
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
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white shadow-md">
                          {product.category}
                        </span>
                      </td>                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">
                          {product.stock} unidades
                        </div>
                        {product.stock < 10 && (
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
        </div>{/* Back to Catalog Button */}
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
