import { useState, useEffect } from 'react';
import { useReduxProducts } from '../hooks';
import ProductGrid from '../components/ProductGrid';

const ProductsPage = () => {
  const { products = [], isLoading } = useReduxProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  
  // Extract unique categories from products
  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    ...Array.from(new Set(products.map(p => p.category?.description))).filter(Boolean).map(cat => ({
      value: cat,
      label: cat
    }))
  ];
  
  const priceRanges = [
    { value: 'all', label: 'Todos los precios' },
    { value: '0-25', label: '$0 - $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: '$100+' }
  ];

  // Filter products based on search, category, and price range
  const filteredProducts = products.filter(product => {
    // Search term filter
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || 
                           product.category?.description === selectedCategory;
    
    // Price range filter
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        matchesPrice = product.price >= parseInt(min);
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-10 pb-6 bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Catálogo de Productos</h1>
          <p className="text-white/80 mb-6">Explora nuestra amplia selección de productos para tu entrenamiento</p>
          
          {/* Search */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pr-10 rounded-xl border-none focus:ring-2 focus:ring-orange-300 shadow-lg"
            />
            <svg 
              className="absolute right-3 top-3 text-gray-400 h-6 w-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Filters */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Filtros</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Precio</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Help Box */}
            <div className="bg-orange-50 rounded-xl border border-orange-200 p-6">
              <h3 className="text-orange-800 font-bold mb-2">¿Necesitas ayuda?</h3>
              <p className="text-sm text-orange-700 mb-4">Si tienes dudas sobre algún producto, no dudes en contactarnos.</p>
              <a 
                href="#" 
                className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Contactar
              </a>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid 
              products={filteredProducts} 
              loading={isLoading}
              title={`${filteredProducts.length} Productos Encontrados`}
              subtitle={searchTerm ? `Mostrando resultados para "${searchTerm}"` : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 