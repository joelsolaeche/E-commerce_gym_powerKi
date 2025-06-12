import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';
import { useReduxProducts } from '../hooks';

const HomePage = () => {
  const { products = [], isLoading } = useReduxProducts();
  
  // Extract unique categories for the category section
  const categories = Array.from(
    new Set(products.map(p => p.category?.description))
  ).filter(Boolean).slice(0, 6); // Limit to 6 categories
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-yellow-300 drop-shadow-lg">POWER KI GYM</span>
                <span className="block">Tu Tienda de Fitness</span>
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-lg">
                Encuentra los mejores productos para tu entrenamiento y alcanza tus objetivos fitness con la calidad que mereces.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/products" 
                  className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg"
                >
                  Ver Productos
                </Link>
                <Link 
                  to="/about" 
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://i1.sndcdn.com/artworks-000438423927-m6luwx-t500x500.jpg" 
                alt="Dragon Ball Character"
                className="w-full max-w-md mx-auto rounded-xl shadow-2xl border-4 border-yellow-300/50"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <FeaturedProducts />
      
      {/* Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Explora por Categoría</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra amplia gama de productos organizados por categorías para encontrar exactamente lo que necesitas
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <Link 
                  key={category} 
                  to={`/products?category=${category}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="h-48 bg-orange-100 flex items-center justify-center p-6">
                    <div className="text-5xl">{getCategoryEmoji(category)}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                      {category}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {getCategoryDescription(category)}
                    </p>
                    <span className="text-orange-500 font-medium flex items-center">
                      Ver productos
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              // Show placeholder categories if none exist yet
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="h-48 bg-gray-100 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-100 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para elevar tu entrenamiento?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre nuestra selección premium de productos y suplementos para alcanzar tus objetivos fitness más rápido
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper functions for category displays
const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Suplementos': '💊',
    'Proteínas': '🥩',
    'Accesorios': '🏋️‍♂️',
    'Vitaminas': '💉',
    'Ropa': '👕',
    'Equipamiento': '⚙️',
    'Pre-entreno': '⚡',
    'Post-entreno': '🔄',
  };
  
  return emojiMap[category] || '🔍';
};

const getCategoryDescription = (category) => {
  const descriptionMap = {
    'Suplementos': 'Potencia tu rendimiento con nuestra línea de suplementos premium',
    'Proteínas': 'Recupera y construye músculo con nuestras proteínas de alta calidad',
    'Accesorios': 'Complementa tu entrenamiento con los mejores accesorios',
    'Vitaminas': 'Mantén tu salud óptima con nuestra selección de vitaminas',
    'Ropa': 'Entrena con estilo y comodidad con nuestra línea de ropa deportiva',
    'Equipamiento': 'Equipa tu gimnasio con lo mejor en equipamiento fitness',
    'Pre-entreno': 'Maximiza tu energía antes de entrenar',
    'Post-entreno': 'Recupera tu cuerpo después de un intenso entrenamiento',
  };
  
  return descriptionMap[category] || 'Descubre productos de alta calidad para tu entrenamiento';
};

export default HomePage; 