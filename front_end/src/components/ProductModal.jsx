import { useCart } from '../context/CartContext';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  
  if (!product) return null;

  const handleAddToCart = () => {
    const cartItem = { ...product, stock: product.stockQuantity };
    if (addToCart(cartItem)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)' }}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)' }}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold pr-4 text-gray-800">{product.name}</h2>
            <button
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
                src={product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0ZGNkYwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiI+UHJvZHVjdG88L3RleHQ+PC9zdmc+'}
                alt={product.name}
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transition-transform duration-300"
                style={{ border: '2px solid #FFD700' }}
              />
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-6 py-3 text-sm font-bold rounded-full mb-4 bg-gradient-to-r from-gray-200 to-gray-300 text-blue-800 border border-orange-400/30">
                  {product.category?.description || ''}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <p className="text-4xl lg:text-5xl font-bold text-yellow-400" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                      ${product.price}
                    </p>
                    {product.discountPercentage > 0 && (
                      <span className="inline-flex px-3 py-1 text-base font-bold rounded-full bg-red-500 text-white animate-pulse shadow-lg">
                        -{product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                  {product.discountPercentage > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </p>
                      <span className="text-sm text-green-600 font-bold">
                        ¡Ahorras ${(product.originalPrice - product.price).toFixed(2)}!
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 rounded-xl border-2 border-orange-400/50 bg-gradient-to-r from-gray-100/80 to-gray-200/80 backdrop-blur-sm">
                <p className="text-sm mb-2 text-orange-600 font-bold">⚡ Vendido por</p>
                <p className="font-semibold text-gray-800 text-lg">{product.sellerName || 'Power Ki Gym'}</p>
                <p className={`text-sm font-medium mt-3 ${product.stockQuantity > 0 ? '' : ''}`} style={{ color: product.stockQuantity > 0 ? '#4CAF50' : '#F44336' }}>
                  {product.stockQuantity > 0 ? `⚡ ${product.stockQuantity} unidades en arsenal` : '❌ Arsenal agotado'}
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-800 border-b border-orange-400/30 pb-2">📋 Descripción del Arsenal</h3>
                <p className="leading-relaxed text-gray-700 text-base bg-gray-100/50 p-4 rounded-lg border border-orange-400/20">
                  {product.description}
                </p>
              </div>
              
              <button
                onClick={handleAddToCart}
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
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 