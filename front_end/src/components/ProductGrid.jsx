import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

const ProductGrid = ({ products, title, subtitle, loading }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title || 'Cargando productos...'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title || 'Productos'}</h2>
          {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
          <div className="bg-gray-50 rounded-xl p-10 text-center">
            <p className="text-gray-500">No hay productos disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4">
        {title && <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>}
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={handleProductClick}
            />
          ))}
        </div>
      </div>
      
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProductGrid; 