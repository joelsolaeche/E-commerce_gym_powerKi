import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = { ...product, stock: product.stockQuantity };
    if (addToCart(cartItem)) {
      alert(`${product.name} agregado al carrito!`);
    } else {
      alert('Producto sin stock disponible');
    }
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-400/30 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onClick && onClick(product)}
    >
      <div className="relative pb-[56.25%] overflow-hidden">
        <img 
          src={product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0ZGNkYwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiI+UHJvZHVjdG88L3RleHQ+PC9zdmc+'} 
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            {product.category?.description || ''}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-orange-500">${product.price}</p>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`p-2 rounded-full ${
              product.stockQuantity > 0
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
        
        <div className="mt-2">
          <p className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stockQuantity > 0 
              ? `${product.stockQuantity} unidades disponibles` 
              : 'Sin stock'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 