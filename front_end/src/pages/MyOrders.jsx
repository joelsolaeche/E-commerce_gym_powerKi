import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify'
import config from '../config'

const MyOrders = ({ setCurrentPage }) => {
  const { user, token } = useUser()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState({})

  useEffect(() => {
    if (user && token) {
      fetchOrders()
    }
  }, [user, token])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Fetching orders for user:', user?.id, 'with token:', token ? 'exists' : 'missing')
      
      const response = await fetch(`${config.API_BASE_URL}/orders/ordersFromUser/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('🔍 Response status:', response.status)
      console.log('🔍 Response headers:', [...response.headers.entries()])

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        console.log('Orders fetched:', data)
      } else {
        const errorText = await response.text()
        console.error('🔍 Error fetching orders:', response.status, errorText)
        toast.error('Error al cargar las órdenes')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Error de conexión al cargar las órdenes')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-500'
      case 'confirmed':
      case 'confirmado':
        return 'bg-green-500'
      case 'shipped':
      case 'enviado':
        return 'bg-blue-500'
      case 'delivered':
      case 'entregado':
        return 'bg-green-600'
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pendiente'
      case 'confirmed':
        return 'Confirmado'
      case 'shipped':
        return 'Enviado'
      case 'delivered':
        return 'Entregado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status || 'Pendiente'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-md border border-red-400/50 rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-3xl font-bold text-white mb-4">⚡ Acceso Requerido ⚡</h2>
            <p className="text-red-100 mb-6 text-lg">
              Necesitas iniciar sesión para ver tus compras.
            </p>
            <button
              onClick={() => setCurrentPage('login')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ⚡ Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (user.type === 'seller') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 backdrop-blur-md border border-blue-400/50 rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-3xl font-bold text-white mb-4">⚡ Área de Vendedor ⚡</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Como vendedor, revisa tus ventas en la sección correspondiente.
            </p>
            <button
              onClick={() => setCurrentPage('my-sales')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mr-4"
            >
              📊 Ver Mis Ventas
            </button>
            <button
              onClick={() => setCurrentPage('catalog')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🏠 Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-300 to-blue-500 bg-clip-text text-transparent mb-2">
              <span className="animate-pulse">🛒⚡</span> Mis Compras de Entrenamiento
            </h1>
            <p className="text-blue-700 text-lg">Historial de tu arsenal adquirido</p>
          </div>
          <button
            onClick={() => setCurrentPage('catalog')}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>🏠 Seguir Comprando</span>
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <span className="ml-3 text-lg font-medium text-blue-500">Cargando compras...</span>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center border-2 border-blue-400/50">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-blue-700 mb-4">No hay compras aún</h3>
                <p className="text-blue-600 mb-6 text-lg">
                  ¡Es hora de comenzar tu entrenamiento! Explora nuestro catálogo y encuentra el arsenal perfecto.
                </p>
                <button
                  onClick={() => setCurrentPage('catalog')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🛒 Explorar Catálogo
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-400/50 hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-blue-400/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                      <div>
                        <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                          📋 Orden #{order.id}
                        </h3>
                        <p className="text-blue-600 text-sm">
                          {formatDate(order.orderDate || order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full text-white ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ${order.totalAmount?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items?.length || 0} artículo(s)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Toggle Button */}
                  <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50">
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="w-full flex items-center justify-between text-left text-blue-700 hover:text-blue-900 transition-colors duration-200"
                    >
                      <span className="font-medium">
                        {expandedOrders[order.id] ? '▼ Ocultar detalles' : '▶ Ver detalles de productos'}
                      </span>
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${expandedOrders[order.id] ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Order Items (Expandable) */}
                  {expandedOrders[order.id] && (
                    <div className="px-6 py-4 bg-gray-50/50">
                      <div className="space-y-4">
                        {order.orderProducts?.map((orderProduct, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-blue-200/50 hover:border-blue-300/50 transition-colors duration-200"
                          >
                            <img
                              src={orderProduct.product?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzMzNzQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIj5Qcm9kdWN0bzwvdGV4dD48L3N2Zz4='}
                              alt={orderProduct.product?.name}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-blue-300/50"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzMzNzQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIj5Qcm9kdWN0bzwvdGV4dD48L3N2Zz4='
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {orderProduct.product?.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {orderProduct.product?.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm font-medium text-blue-600">
                                  Cantidad: {orderProduct.quantity}
                                </span>
                                <span className="text-sm font-medium text-green-600">
                                  ${orderProduct.product?.price?.toFixed(2) || '0.00'} c/u
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                ${((orderProduct.product?.price || 0) * (orderProduct.quantity || 1)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )) || (
                          <p className="text-gray-500 text-center py-4">
                            No hay detalles de productos disponibles
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
