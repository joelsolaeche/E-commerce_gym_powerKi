import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReduxProducts } from '../hooks';
import ProductModal from './ProductModal';

const FeaturedProducts = () => {
  const { products = [], isLoading } = useReduxProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const featuredProducts = products.slice(0, 4); // Take first 4 products as featured

  // Carousel auto-rotation
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const showProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos Destacados</h2>
          <div className="w-full h-96 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Productos Destacados</h2>
          <Link to="/products" className="text-orange-500 hover:text-orange-600">
            Ver todos →
          </Link>
        </div>
        
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-6 h-[500px]">
          {/* Carousel */}
          <div className="h-full relative">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-6">
                  <div className="flex flex-col justify-center space-y-6 p-4">
                    <span className="text-sm font-semibold text-orange-500">Destacado</span>
                    <h3 className="text-3xl font-bold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 line-clamp-3">{product.description}</p>
                    <div className="flex items-end">
                      <span className="text-4xl font-bold text-orange-500">${product.price}</span>
                      {product.discountPercentage > 0 && (
                        <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => showProductDetails(product)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <img
                      src={product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI0ZGNkYwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiI+UHJvZHVjdG88L3RleHQ+PC9zdmc+'}
                      alt={product.name}
                      className="object-cover rounded-xl h-full max-h-[400px] w-full"
                    />
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discountPercentage}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-orange-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </div>
  );
};

export default FeaturedProducts; 