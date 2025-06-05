import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'

const Cart = ({ setCurrentPage }) => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { user } = useUser()
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      alert('Debes iniciar sesión para realizar la compra')
      setCurrentPage('login')
      return
    }
    
    if (cart.length === 0) {
      alert('Tu carrito está vacío')
      return
    }
    
    setShowCheckoutModal(true)
  }

  const confirmCheckout = () => {
    // Simulate stock update and order processing
    alert('¡Compra realizada con éxito! El stock ha sido actualizado.')
    clearCart()
    setShowCheckoutModal(false)
    setCurrentPage('catalog')
  }
    const CheckoutModal = () => {
    if (!showCheckoutModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-md" style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 225, 0.98) 100%)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              🏆 Confirmar Entrenamiento
            </h3>
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="text-white p-2 rounded-full transition-all duration-200 hover:shadow-lg transform hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
            <div className="space-y-4 mb-6">
            <div className="border-t-2 pt-4" style={{ borderColor: '#FFD700' }}>
              <h4 className="font-bold mb-3 flex items-center p-3 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)' }}>
                <svg className="w-4 h-4 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                📜 Arsenal Final:
              </h4>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm p-3 rounded-lg border-2 border-orange-200/50" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)' }}>
                    <span className="font-bold" style={{ color: '#0D47A1' }}>{item.name} x{item.quantity}</span>
                    <span className="font-bold" style={{ color: '#FFD700' }}>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 mt-3 pt-3 flex justify-between font-bold text-lg p-3 rounded-lg" style={{ borderColor: '#FFD700', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: 'white' }}>
                <span>🏆 Poder Total:</span>
                <span>${getCartTotal()}</span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border-2" style={{ background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)', borderColor: '#2196F3' }}>
              <p className="text-xs sm:text-sm flex items-start font-medium" style={{ color: '#0D47A1' }}>
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: '#2196F3' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong>⚡ Aviso del Maestro:</strong> Esta es una demostración del Torneo de Artes Marciales. 
                  No se procesarán pagos reales. Tu fuerza se actualizará automáticamente después de confirmar.
                </span>
              </p>
            </div>
          </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="flex-1 px-4 py-3 text-white rounded-lg text-sm sm:text-base font-bold transition-all duration-200 border-2 hover:shadow-lg transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #757575 0%, #424242 100%)', borderColor: '#9E9E9E' }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #616161 0%, #212121 100%)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #757575 0%, #424242 100%)'
              }}
            >
              ❌ Cancelar
            </button>
            <button
              onClick={confirmCheckout}
              className="flex-1 px-4 py-3 text-white rounded-lg text-sm sm:text-base font-bold shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFEB3B 100%)'
                e.target.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)'
                e.target.style.color = '#212121'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
                e.target.style.boxShadow = ''
                e.target.style.color = 'white'
              }}
            >
              ⚡ ¡Confirmar Poder!
            </button>
          </div>
        </div>
      </div>
    )
  }
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8 sm:py-12 px-4 relative min-h-screen" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 rounded-2xl"></div>
        
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8 sm:p-10 border-2 border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)' }}>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}>
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>          <h2 className="text-xl sm:text-2xl font-bold mb-8 text-gray-800">Tu carrito está vacío 🐉</h2>
          <p className="mb-8 text-sm sm:text-base text-gray-600">
            Descubre nuestros productos y agrega algunos a tu carrito para comenzar tu aventura fitness ⚡
          </p><button
            onClick={() => setCurrentPage('catalog')}
            className="px-8 py-4 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFEB3B 100%)'
              e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
              e.target.style.boxShadow = ''
            }}
          >
            🛍️ Explorar Productos
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-7xl mx-auto px-4 relative min-h-screen py-8" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
      {/* Dragon Ball themed background */}
      <div className="absolute inset-0 -z-10"></div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
            🐉 Carrito de Compras ⚡
          </h1>
          <p className="text-blue-600 mt-1 font-medium">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} artículos en tu carrito de guerrero
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('catalog')}
          className="text-white font-medium text-sm sm:text-base transition-all duration-300 flex items-center px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFEB3B 100%)'
            e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
            e.target.style.boxShadow = ''
          }}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continuar Entrenando
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl shadow-2xl border-2 border-orange-400/30 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.95) 100%)' }}>
            <div className="p-6 border-b-2 border-orange-300/50" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
              <h2 className="text-xl font-bold text-white flex items-center drop-shadow-lg">
                <svg className="w-6 h-6 mr-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                🎯 Arsenal del Guerrero ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>
            </div>
              <div className="divide-y divide-orange-200/50">
              {cart.map(item => (
                <div key={item.id} className="p-6 transition-all duration-300 hover:shadow-lg border-l-4 border-transparent hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-transparent">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-golden shadow-lg transform hover:scale-105 transition-transform duration-300"
                        style={{ borderColor: '#FFD700' }}
                      />
                      <div className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}>
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)' }}>
                          {item.category}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)', color: 'white' }}>
                          {item.seller}
                        </span>
                      </div>
                      <p className="text-xl font-bold mt-2" style={{ color: '#FFD700' }}>${item.price}</p>
                    </div>
                      <div className="flex flex-col items-end space-y-3">
                      {/* Quantity controls */}
                      <div className="flex items-center border-2 rounded-lg shadow-lg" style={{ borderColor: '#FFD700' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 transition-all duration-200 rounded-l-lg hover:shadow-lg transform hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)', color: 'white' }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFEB3B 100%)'
                            e.target.style.color = '#212121'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
                            e.target.style.color = 'white'
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="px-4 py-2 font-bold min-w-[3rem] text-center text-white" style={{ background: '#FFD700', color: '#212121' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-3 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg hover:shadow-lg transform hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)', color: 'white' }}
                          onMouseEnter={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFEB3B 100%)'
                              e.target.style.color = '#212121'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
                              e.target.style.color = 'white'
                            }
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-white p-2 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-110 border-2 border-red-400 hover:border-red-600"
                        style={{ background: 'rgba(244, 67, 54, 0.1)' }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(244, 67, 54, 0.1)'
                        }}
                        title="Eliminar del carrito"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                    <div className="mt-4 flex justify-between items-center bg-gradient-to-r from-orange-50/50 to-yellow-50/50 p-3 rounded-lg border border-orange-200/50">
                    <div className="flex items-center text-sm font-medium" style={{ color: '#0D47A1' }}>
                      <svg className="w-4 h-4 mr-1" style={{ color: '#4CAF50' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Stock disponible: {item.stock - item.quantity} unidades
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      Subtotal: <span style={{ color: '#FFD700' }}>${item.price * item.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl shadow-2xl p-6 sticky top-4 border-2 border-orange-400/30" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.95) 100%)' }}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
              <svg className="w-6 h-6 mr-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
              💰 Poder de Compra
            </h2>
              <div className="space-y-4 mb-6 p-4 rounded-lg border-2 border-orange-200/50" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)' }}>
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: '#0D47A1' }}>Subtotal:</span>
                <span className="font-bold text-lg" style={{ color: '#212121' }}>${getCartTotal()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: '#0D47A1' }}>Envío:</span>
                <span className="font-bold flex items-center" style={{ color: '#4CAF50' }}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Gratis ⚡
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: '#0D47A1' }}>Impuestos (15%):</span>
                <span className="font-bold" style={{ color: '#212121' }}>${Math.round(getCartTotal() * 0.15)}</span>
              </div>
              <div className="border-t-2 pt-4" style={{ borderColor: '#FFD700' }}>
                <div className="flex justify-between text-xl font-bold p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: 'white' }}>
                  <span>🏆 Total:</span>
                  <span>${Math.round(getCartTotal() * 1.15)}</span>
                </div>
              </div>
            </div>              {!user && (
              <div className="border-2 rounded-lg p-4 mb-4" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 111, 0, 0.1) 100%)', borderColor: '#FFC107' }}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#FF6F00' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-bold" style={{ color: '#0D47A1' }}>
                    ⚡ Necesitas poder de guerrero para continuar
                  </p>
                </div>
              </div>
            )}
              <button
              onClick={handleCheckout}
              className="w-full text-white py-4 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 font-bold text-lg shadow-2xl transform hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFEB3B 100%)'
                e.target.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)'
                e.target.style.color = '#212121'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
                e.target.style.boxShadow = ''
                e.target.style.color = 'white'
              }}
            >
              {user ? '🛒 ¡Finalizar Entrenamiento!' : '🔐 Despertar Poder Interno'}
            </button>
              <div className="mt-4 text-center">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-white text-sm font-bold transition-all duration-300 flex items-center justify-center mx-auto p-2 rounded-lg border-2 border-red-400 hover:border-red-600 hover:shadow-lg transform hover:scale-105"
                style={{ background: 'rgba(244, 67, 54, 0.1)' }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(244, 67, 54, 0.1)'
                }}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                💥 Deshacer Todo
              </button>
            </div>
              <div className="mt-6 space-y-2 text-xs text-center p-4 rounded-lg border-2 border-orange-200/50" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)', color: '#0D47A1' }}>
              <div className="flex items-center justify-center font-bold">
                <svg className="w-4 h-4 mr-1" style={{ color: '#4CAF50' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>🛡️ Protección Total Garantizada</span>
              </div>
              <div className="flex items-center justify-center font-bold">
                <svg className="w-4 h-4 mr-1" style={{ color: '#2196F3' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
                <span>💳 Métodos de Pago Universales</span>
              </div>
              <div className="flex items-center justify-center font-bold">
                <svg className="w-4 h-4 mr-1" style={{ color: '#FF6F00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>🚀 Envío Express Gratis +$100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal />
    </div>
  )
}

export default Cart
