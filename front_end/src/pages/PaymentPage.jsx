import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { useReduxCart, useReduxProducts } from '../hooks'

const PaymentPage = ({ setCurrentPage }) => {
  const { cart, getCartTotal, clearCart } = useCart()
  const { user } = useUser()
  const { createOrder } = useReduxCart()
  const { refetchProducts } = useReduxProducts()
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardType, setCardType] = useState('')

  // Validar que el usuario esté logueado y tenga productos en el carrito
  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión para acceder al pago')
      setCurrentPage('login')
      return
    }
    if (!cart || cart.length === 0) {
      toast.error('Tu carrito está vacío')
      setCurrentPage('cart')
      return
    }
  }, [user, cart, setCurrentPage])

  // Detectar tipo de tarjeta
  const detectCardType = (number) => {
    const cleaned = number.replace(/\D/g, '')
    if (cleaned.match(/^4/)) return 'visa'
    if (cleaned.match(/^5[1-5]/)) return 'mastercard'
    if (cleaned.match(/^3[47]/)) return 'amex'
    return ''
  }

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/)
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ')
    }
    return value
  }

  // Formatear fecha de expiración
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value)
      setFormData(prev => ({ ...prev, [name]: formatted }))
      setCardType(detectCardType(value))
    } else if (name === 'expiryDate') {
      const formatted = formatExpiryDate(value)
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '').substring(0, 4)
      setFormData(prev => ({ ...prev, [name]: cleaned }))
    } else if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Simular procesamiento de pago con tarjeta
      toast.info('🔄 Procesando tu pago con tarjeta...', { autoClose: 1000 })
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular validación de tarjeta exitosa
      console.log('Payment data:', formData)
      toast.success('✅ ¡Pago con tarjeta aprobado!', { autoClose: 1500 })
      
      // Ahora procesar la orden real como lo hace el carrito
      try {
        const orderData = {
          userId: user.id,
          paymentMethod: 'TARJETA_CREDITO' // Ya que se pagó con tarjeta
        }
        
        console.log("Creando orden después del pago exitoso...", orderData)
        
        // Llamar API para crear la orden
        const response = await fetch('http://localhost:8080/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        })
        
        if (response.ok) {
          console.log("¡Orden creada exitosamente!")
          
          // Actualizar stock de productos
          for (const item of cart) {
            try {
              await fetch(`http://localhost:8080/products/directUpdateStock/${item.id}/${item.quantity}`, {
                method: 'POST'
              })
              console.log(`Stock actualizado para producto ${item.id}`)
            } catch (stockError) {
              console.error(`Error actualizando stock para producto ${item.id}:`, stockError)
            }
          }
          
          // Refrescar productos y limpiar carrito
          await refetchProducts()
          clearCart()
          
          toast.success('🎉 ¡Compra completada exitosamente! Tu equipo está listo para el entrenamiento 🔥', { 
            autoClose: 5000 
          })
          
          // Redirigir al catálogo
          setTimeout(() => {
            setCurrentPage('catalog')
          }, 2000)
          
        } else {
          throw new Error('Error al crear la orden')
        }
        
      } catch (orderError) {
        console.error('Error creando la orden:', orderError)
        toast.error('❌ Error al finalizar la compra. Contacta soporte.')
      }
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('❌ Error al procesar el pago. ¡Verifica los datos de tu tarjeta!')
    } finally {
      setIsProcessing(false)
    }
  }

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '🔴'
      case 'amex':
        return '💎'
      default:
        return '💳'
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 relative" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
      {/* Fondo temático */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full animate-bounce" style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full animate-ping" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)' }}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-4 shadow-2xl transition-all duration-300 transform hover:scale-110" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🏆 Portal de Poder Financiero ⚡
          </h1>
          <p className="text-lg text-blue-600 font-medium">
            Potencia tu entrenamiento con el mejor equipo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario de pago */}
          <div className="rounded-2xl shadow-2xl border-2 border-orange-400/30 p-8 transition-all duration-500 hover:shadow-2xl hover:border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.95) 100%)' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)' }}>
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Información de Tarjeta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Número de tarjeta */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                  {getCardIcon()} Número de Tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    maxLength="19"
                    required
                    className="w-full pl-4 pr-12 py-4 border-2 rounded-lg focus:outline-none text-lg font-mono transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6F00'
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#FFD700'
                      e.target.style.boxShadow = ''
                    }}
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <span className="text-2xl">{getCardIcon()}</span>
                  </div>
                </div>
              </div>

              {/* Fecha y CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                    📅 Fecha de Expiración
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    maxLength="5"
                    required
                    className="w-full pl-4 pr-4 py-4 border-2 rounded-lg focus:outline-none text-lg font-mono transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6F00'
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#FFD700'
                      e.target.style.boxShadow = ''
                    }}
                    placeholder="MM/AA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                    🔒 CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    maxLength="4"
                    required
                    className="w-full pl-4 pr-4 py-4 border-2 rounded-lg focus:outline-none text-lg font-mono transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6F00'
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#FFD700'
                      e.target.style.boxShadow = ''
                    }}
                    placeholder="123"
                  />
                </div>
              </div>

              {/* Nombre del titular */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                  👤 Nombre del Titular
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-4 pr-4 py-4 border-2 rounded-lg focus:outline-none text-lg transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                  style={{ 
                    borderColor: '#FFD700',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                    color: '#212121'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6F00'
                    e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#FFD700'
                    e.target.style.boxShadow = ''
                  }}
                  placeholder="Nombre completo como aparece en la tarjeta"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                  📧 Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-4 pr-4 py-4 border-2 rounded-lg focus:outline-none text-lg transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                  style={{ 
                    borderColor: '#FFD700',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                    color: '#212121'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6F00'
                    e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#FFD700'
                    e.target.style.boxShadow = ''
                  }}
                  placeholder="tu@email.com"
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 text-lg font-bold rounded-lg text-white transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                  }
                }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando Poder...
                  </span>
                ) : (
                  <>🔥 ¡Liberar Poder de Pago! ⚡</>
                )}
              </button>
            </form>
          </div>

          {/* Información adicional y facturación */}
          <div className="space-y-6">
            {/* Resumen del carrito */}
            <div className="rounded-2xl shadow-2xl border-2 border-orange-400/30 p-6 transition-all duration-500 hover:shadow-2xl hover:border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.95) 100%)' }}>
              <h3 className="text-xl font-bold mb-4 flex items-center text-white p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                🛒 Resumen de tu Pedido
              </h3>
              
              <div className="space-y-3">
                {cart && cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-lg border-2 border-orange-200/50" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)' }}>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: '#0D47A1' }}>{item.name}</p>
                      <p className="text-xs" style={{ color: '#666' }}>Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#FFD700' }}>${item.price * item.quantity}</p>
                      <p className="text-xs" style={{ color: '#666' }}>${item.price} c/u</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t-2 pt-3 mt-4" style={{ borderColor: '#FFD700' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: '#0D47A1' }}>Subtotal:</span>
                    <span className="font-bold" style={{ color: '#212121' }}>${getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: '#0D47A1' }}>Impuestos (15%):</span>
                    <span className="font-bold" style={{ color: '#212121' }}>${Math.round(getCartTotal() * 0.15)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: 'white' }}>
                    <span>🏆 Total a Pagar:</span>
                    <span>${Math.round(getCartTotal() * 1.15)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección de facturación */}
            <div className="rounded-2xl shadow-2xl border-2 border-orange-400/30 p-8 transition-all duration-500 hover:shadow-2xl hover:border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.95) 100%)' }}>
              <h3 className="text-xl font-bold mb-4 flex items-center text-white p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)' }}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                📍 Dirección de Facturación
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  name="billingAddress.street"
                  value={formData.billingAddress.street}
                  onChange={handleInputChange}
                  placeholder="Calle y número"
                  className="w-full pl-4 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                  style={{ 
                    borderColor: '#FFD700',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                    color: '#212121'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6F00'
                    e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#FFD700'
                    e.target.style.boxShadow = ''
                  }}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Ciudad"
                    className="w-full pl-4 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6F00'
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#FFD700'
                      e.target.style.boxShadow = ''
                    }}
                  />
                  
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleInputChange}
                    placeholder="Estado/Provincia"
                    className="w-full pl-4 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6F00'
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#FFD700'
                      e.target.style.boxShadow = ''
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={handleInputChange}
                    placeholder="Código postal"
                    className="w-full pl-4 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6F00'
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#FFD700'
                      e.target.style.boxShadow = ''
                    }}
                  />
                  
                  <input
                    type="text"
                    name="billingAddress.country"
                    value={formData.billingAddress.country}
                    onChange={handleInputChange}
                    placeholder="País"
                    className="w-full pl-4 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 focus:shadow-lg transform focus:scale-[1.02]"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FF6F00'
                      e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#FFD700'
                      e.target.style.boxShadow = ''
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Información de seguridad */}
            <div className="rounded-2xl shadow-2xl border-2 border-green-400/30 p-6 transition-all duration-500 hover:shadow-2xl hover:border-green-400/50" style={{ background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center text-white p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)' }}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                🛡️ Pago Seguro
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Cifrado SSL de 256 bits</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Protección contra fraude</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">PCI DSS Compliant</span>
                </div>
              </div>
            </div>

            {/* Botón de volver */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="w-full py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl border-2"
              style={{ 
                background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)',
                borderColor: '#2196F3',
                color: '#0D47A1'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(13, 71, 161, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)'
                e.target.style.color = '#0D47A1'
              }}
            >
              ← Volver al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage 