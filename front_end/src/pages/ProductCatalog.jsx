import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useReduxProducts } from '../hooks'
import { toast } from 'react-toastify'

const ProductCatalog = ({ setCurrentPage }) => {
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { products = [], isLoading } = useReduxProducts()
  const featuredProducts = products.slice(0, 4)
  
  const categories = ['all', ...new Set(products.map(p => p.category?.description || p.category))]
  
  const priceRanges = [
    { value: 'all', label: 'Todos los precios' },
    { value: '0-100', label: '$0 - $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: '1000-5000', label: '$1000 - $5000' },
    { value: '5000-10000', label: '$5000 - $10000' },
    { value: '10000+', label: '$10000+' }
  ]

  // Carousel auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(timer)
  }, [featuredProducts.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const productCategory = product.category?.description || product.category
    const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory
    
    let matchesPrice = true
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max)
      } else {
        matchesPrice = product.price >= parseInt(min)
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice
  })
  const handleAddToCart = (product) => {
    const cartItem = { ...product, stock: product.stockQuantity }
    addToCart(cartItem)
  }

  const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)' }}>
        <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)' }}>
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold pr-4 text-gray-800">{product.name}</h2>              <button
                onClick={onClose}
                className="p-3 rounded-full transition-all duration-200 hover:bg-orange-500/30 bg-orange-500/20"
                style={{ color: '#FF6F00' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">                
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transition-transform duration-300"
                  style={{ border: '2px solid #FFD700' }}
                />
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">                  <span className="inline-block px-6 py-3 text-sm font-bold rounded-full mb-4 bg-gradient-to-r from-gray-200 to-gray-300 text-blue-800 border border-orange-400/30">
                    {product.category?.description || product.category}
                  </span>
                  <p className="text-4xl lg:text-5xl font-bold text-yellow-400" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    ${product.price}
                  </p>
                </div>
                  <div className="p-6 rounded-xl border-2 border-orange-400/50 bg-gradient-to-r from-gray-100/80 to-gray-200/80 backdrop-blur-sm">
                  <p className="text-sm mb-2 text-orange-600 font-bold">⚡ Vendido por</p>
                  <p className="font-semibold text-gray-800 text-lg">{product.sellerName || 'Power Ki Gym'}</p><p className={`text-sm font-medium mt-3 ${product.stockQuantity > 0 ? '' : ''}`} style={{ color: product.stockQuantity > 0 ? '#4CAF50' : '#F44336' }}>
                    {product.stockQuantity > 0 ? `⚡ ${product.stockQuantity} unidades en arsenal` : '❌ Arsenal agotado'}
                  </p>
                </div>
                
                <div className="space-y-4">                  <h3 className="text-xl font-bold text-blue-800 border-b border-orange-400/30 pb-2">📋 Descripción del Arsenal</h3>
                  <p className="leading-relaxed text-gray-700 text-base bg-gray-100/50 p-4 rounded-lg border border-orange-400/20">{product.description}</p>
                </div>
                  <button
                  onClick={() => {
                    handleAddToCart(product)
                    onClose()
                  }}
                  disabled={product.stockQuantity === 0}
                  className={`w-full py-5 rounded-xl font-bold transition-all duration-200 text-lg border-2 ${
                    product.stockQuantity > 0
                      ? 'text-white shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 border-orange-400'
                      : 'cursor-not-allowed bg-gray-700 text-gray-400 border-gray-600'
                  }`}
                >
                  {product.stockQuantity > 0 ? '🛒 Agregar al Carrito' : 'Sin Stock'}
                </button>
              </div>
            </div>
          </div>        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">        {/* Hero Banner */}
        <div className="mb-10">
          <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 50%, #FFD700 100%)' }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30"></div>
            
            {/* Dragon Ball Character Image */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="relative">                <img 
                  src="https://i1.sndcdn.com/artworks-000438423927-m6luwx-t500x500.jpg" 
                  alt="Dragon Ball Character"
                  className="w-48 h-48 xl:w-56 xl:h-56 object-cover rounded-full border-4 border-yellow-300/50 shadow-2xl transition-transform duration-300"
                  style={{
                    filter: 'brightness(1.1) contrast(1.2) saturate(1.3)',
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 111, 0, 0.2)'
                  }}
                />
                {/* Energy Aura Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-300/10 to-orange-300/10 blur-md animate-super-saiyan-glow"></div>
              </div>
            </div>
              {/* Content */}
            <div className="relative px-6 py-12 sm:px-8 sm:py-16 md:py-20 lg:px-12 lg:pr-64">
              <div className="max-w-4xl mx-auto text-center lg:text-left text-white">
                <div className="mb-6">
                  <span className="inline-block text-6xl sm:text-7xl md:text-8xl mb-4 animate-pulse cursor-pointer">🐉💪</span>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">                    <span className="block bg-gradient-to-r from-yellow-300 to-orange-200 bg-clip-text text-transparent drop-shadow-lg transition-colors duration-300">
                      POWER KI GYM
                    </span>
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-300 mx-auto lg:mx-0 mb-6 rounded-full animate-pulse"></div>
                </div>
                
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-orange-100 animate-fade-in">
                  🏋️‍♂️ Tu Tienda de Fitness y Suplementos 🏋️‍♀️
                </p>
                
                <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                  ⚡ Encuentra los mejores productos para tu entrenamiento y alcanza tus objetivos fitness con la calidad que mereces ⚡
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm sm:text-base font-medium text-orange-100">                  <div className="flex items-center gap-2 bg-gray-800/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-gray-800/20 transition-colors duration-200 cursor-pointer">
                    <span>💊</span>
                    <span>Suplementos Premium</span>
                  </div>                  
                  <div className="flex items-center gap-2 bg-gray-800/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-gray-800/20 transition-colors duration-200 cursor-pointer">
                    <span>🏃‍♂️</span>
                    <span>Accesorios Pro</span>
                  </div>                  
                  <div className="flex items-center gap-2 bg-gray-800/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-gray-800/20 transition-colors duration-200 cursor-pointer">
                    <span>🚀</span>
                    <span>Resultados Garantizados</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-300/20 to-red-400/20 rounded-full blur-lg"></div>
          </div>
            {/* Filters */}
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-elegant border-2 border-orange-400/50 transition-shadow duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Search */}                <div className="sm:col-span-2 lg:col-span-1">                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  Buscar productos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}                    className="w-full pl-4 pr-12 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 text-base font-medium transition-all duration-300 hover:border-gray-400 focus:shadow-lg bg-white"
                    style={{ fontSize: '16px', fontWeight: '500', color: '#111827', '--tw-ring-color': '#FF6F00' }}
                  />
                </div>
              </div>
                {/* Category Filter */}              
                <div>                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  Categoría
                </label><select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 text-base font-medium transition-all duration-300 hover:border-gray-400 focus:shadow-lg bg-white"
                  style={{ fontSize: '16px', fontWeight: '500', color: '#111827', '--tw-ring-color': '#FF6F00' }}
                >
                  <option value="all">Todas las categorías</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
                {/* Price Filter */}              
                <div>                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  Rango de precio
                </label><select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 text-base font-medium transition-all duration-300 hover:border-gray-400 focus:shadow-lg bg-white"
                  style={{ fontSize: '16px', fontWeight: '500', color: '#111827', '--tw-ring-color': '#FF6F00' }}
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>        
          </div>        {/* Featured Products Carousel */}        
          <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center" style={{ color: '#1f2937' }}>
            ⭐ Productos Destacados
          </h2>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 border-orange-400/50 transition-shadow duration-300">
            <div className="relative h-64 sm:h-80 md:h-96">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                                          <div className="relative overflow-hidden">                      
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300"
                        onClick={() => setSelectedProduct(product)}
                      />
                      {product.stockQuantity === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-lg">SIN STOCK</span>
                        </div>
                      )}
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full text-base font-bold shadow-lg transform -rotate-12 animate-pulse border-2 border-red-400">
                          -{product.discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)' }}>
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2" style={{ background: '#212121', color: '#FFFFFF' }}>
                          {product.category?.description || product.category}
                        </span>                        <h3 className="text-2xl sm:text-3xl font-bold mb-2 cursor-pointer transition-colors duration-200" style={{ color: '#212121' }}
                            onClick={() => setSelectedProduct(product)}>
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold" style={{ color: '#FFD700' }}>
                            ${product.price}
                          </span>
                          {product.discountPercentage > 0 && (
                            <div className="flex items-center mt-1 gap-2">
                              <span className="text-lg text-white line-through opacity-80">
                                ${product.originalPrice}
                              </span>
                              <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-sm font-bold">
                                ¡Ahorras ${(product.originalPrice - product.price).toFixed(2)}!
                              </span>
                            </div>
                          )}
                        </div>
                        <p className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stockQuantity > 0 ? `${product.stockQuantity} disponibles` : 'Sin stock'}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-white">
                          <span className="font-medium">Vendido por: </span>
                          <span className="font-bold" style={{ color: '#FFD700' }}>{product.sellerName || 'Power Ki Gym'}</span>
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index === currentSlide) {
                            handleAddToCart(product);
                            toast.success(`${product.name} agregado al carrito!`);
                          }
                        }}
                        disabled={product.stockQuantity === 0 || index !== currentSlide}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 text-lg ${
                          product.stockQuantity > 0 && index === currentSlide
                            ? 'text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        style={product.stockQuantity > 0 && index === currentSlide ? {
                          background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)',
                          transition: 'all 0.2s ease'
                        } : {}}
                      >
                        {product.stockQuantity > 0 ? '🛒 Agregar al Carrito' : 'Sin Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              {/* Carousel Navigation */}            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10 backdrop-blur-sm border-2"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#FF6F00',
                borderColor: '#FFD700'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10 backdrop-blur-sm border-2"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#FF6F00',
                borderColor: '#FFD700'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>{/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'scale-125 animate-pulse'
                      : 'hover:bg-gray-300/90'
                  }`}
                  style={{
                    backgroundColor: index === currentSlide ? '#FFD700' : 'rgba(255, 255, 255, 0.7)',
                    boxShadow: index === currentSlide ? '0 0 15px rgba(255, 215, 0, 0.8)' : 'none',
                    border: index === currentSlide ? '2px solid #FF6F00' : '1px solid rgba(255, 255, 255, 0.5)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>        {/* Products Grid */}        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (            <div 
              key={product.id} 
              className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 ${
                product.discountPercentage > 0 
                  ? 'border-red-500/50 group hover:shadow-red-500/20'
                  : 'border-orange-400/30 group'
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 sm:h-56 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedProduct(product)}
                />
                {product.stockQuantity === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-lg">SIN STOCK</span>
                  </div>
                )}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform -rotate-12 animate-pulse border border-red-400">
                    -{product.discountPercentage}% OFF
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-sm" style={{ backgroundColor: '#212121', color: '#FFFFFF' }}>
                    {product.category?.description || product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">                  <h3 
                    className="text-lg font-semibold cursor-pointer flex-1 pr-2 line-clamp-2 transition-colors duration-200 text-gray-800 hover:text-orange-600"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xl font-bold whitespace-nowrap" style={{ color: '#FFD700' }}>${product.price}</span>
                      {product.discountPercentage > 0 && (
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          ¡OFERTA!
                        </span>
                      )}
                    </div>
                    {product.discountPercentage > 0 && (
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        <span className="text-xs text-green-600">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>                  <div className="mb-3">
                  <p className="text-xs text-blue-600 mb-1">Vendido por: <span className="font-medium text-blue-800">{product.sellerName || 'Power Ki Gym'}</span></p>
                  <p className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} disponibles` : 'Sin stock'}
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description.substring(0, 80)}...
                </p>                  <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stockQuantity === 0}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    product.stockQuantity > 0
                      ? 'text-white shadow-md hover:shadow-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stockQuantity > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading message */}
        {isLoading && (
          <div className="text-center py-16 text-gray-600">Cargando productos...</div>
        )}

        {/* No products message */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.881-6.077 2.33l-.893-.893a9 9 0 1112.354 0l-.893.893A7.962 7.962 0 0112 15z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No se encontraron productos</h3>
            <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}

        {/* Product Detail Modal */}
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </div>
  )
}

export default ProductCatalog

