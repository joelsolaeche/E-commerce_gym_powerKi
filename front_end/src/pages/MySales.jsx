import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify'
import config from '../config'

const MySales = ({ setCurrentPage }) => {
  const { user, token } = useUser()
  const [sales, setSales] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSales, setExpandedSales] = useState({})
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalOrders: 0
  })

  useEffect(() => {
    if (user && token && user.type === 'seller') {
      fetchSales()
    }
  }, [user, token])

  const fetchSales = async () => {
    setIsLoading(true)
    try {
      // For now, we'll fetch all orders and filter by seller products
      // TODO: Create a specific endpoint /orders/seller/{sellerId} in the backend
      const response = await fetch(`${config.API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const allOrders = await response.json()
        console.log('🔍 DEBUG: All orders from backend:', allOrders)
        console.log('🔍 DEBUG: Current user ID:', user.id)
        console.log('🔍 DEBUG: User type:', user.type)
        
        // Debug: Check each order's products
        allOrders.forEach((order, index) => {
          console.log(`🔍 DEBUG: Order ${index + 1} (ID: ${order.id}):`)
          console.log('  - Order products:', order.orderProducts)
          if (order.orderProducts) {
            order.orderProducts.forEach((orderProduct, prodIndex) => {
              console.log(`    Product ${prodIndex + 1}:`, {
                name: orderProduct.product?.name,
                sellerId: orderProduct.product?.sellerId,
                sellerIdFromSeller: orderProduct.product?.seller?.id,
                seller: orderProduct.product?.seller,
                matchesCurrentUserSellerId: orderProduct.product?.sellerId === user.id,
                matchesCurrentUserSellerObj: orderProduct.product?.seller?.id === user.id
              })
            })
          }
        })
        
        // Filter orders that contain products from this seller and only keep seller's products
        const sellerSales = allOrders
          .filter(order => 
            order.orderProducts && order.orderProducts.some(orderProduct => {
              // Check both sellerId field and seller.id field
              const sellerId = orderProduct.product?.sellerId || orderProduct.product?.seller?.id
              return sellerId === user.id
            })
          )
          .map(order => {
            // Filter orderProducts to only include those from this seller
            const sellerOrderProducts = order.orderProducts.filter(orderProduct => {
              // Check both sellerId field and seller.id field
              const sellerId = orderProduct.product?.sellerId || orderProduct.product?.seller?.id
              return sellerId === user.id
            })
            
            // Calculate total amount for seller's products only
            const sellerTotalAmount = sellerOrderProducts.reduce((total, orderProduct) => {
              return total + ((orderProduct.product?.price || 0) * (orderProduct.quantity || 1))
            }, 0)
            
            return {
              ...order,
              orderProducts: sellerOrderProducts,
              sellerTotalAmount, // Add calculated amount for seller's products
              originalTotalAmount: order.totalAmount // Keep original for reference
            }
          })
          .filter(order => order.orderProducts.length > 0) // Only keep orders with seller's products
        
        setSales(sellerSales)
        calculateStats(sellerSales)
        console.log('Sales fetched for seller:', sellerSales.length, 'orders with seller products')
      } else if (response.status === 404) {
        // No sales found, that's okay
        setSales([])
        setStats({ totalSales: 0, totalRevenue: 0, totalOrders: 0 })
        console.log('No sales found for seller')
      } else {
        console.error('Error fetching sales:', response.status)
        toast.error('Error al cargar las ventas')
      }
    } catch (error) {
      console.error('Error fetching sales:', error)
      toast.error('Error de conexión al cargar las ventas')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (salesData) => {
    let totalSales = 0 // Total quantity of products sold
    let totalRevenue = 0 // Total revenue from seller's products
    let totalOrders = salesData.length // Total orders containing seller's products

    salesData.forEach(sale => {
      if (sale.orderProducts) {
        sale.orderProducts.forEach(orderProduct => {
          const quantity = orderProduct.quantity || 0
          const price = orderProduct.product?.price || 0
          
          totalSales += quantity
          totalRevenue += price * quantity
        })
      }
    })

    setStats({
      totalSales,
      totalRevenue,
      totalOrders
    })
  }

  const toggleSaleExpansion = (saleId) => {
    setExpandedSales(prev => ({
      ...prev,
      [saleId]: !prev[saleId]
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
        return 'bg-yellow-500'
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
        return status || 'Confirmado'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-md border border-red-400/50 rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-3xl font-bold text-white mb-4">⚡ Acceso Requerido ⚡</h2>
            <p className="text-red-100 mb-6 text-lg">
              Necesitas iniciar sesión para ver tus ventas.
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

  if (user.type !== 'seller') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 backdrop-blur-md border border-blue-400/50 rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-white mb-4">⚡ Área de Comprador ⚡</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Como comprador, revisa tus compras en la sección correspondiente.
            </p>
            <button
              onClick={() => setCurrentPage('my-orders')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mr-4"
            >
              🛒 Ver Mis Compras
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent mb-2">
              <span className="animate-pulse">💰⚡</span> Mis Ventas de Arsenal
            </h1>
            <p className="text-orange-700 text-lg">Dashboard de tus ventas y ganancias</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentPage('manage-products')}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span>💼 Gestionar Productos</span>
            </button>
            <button
              onClick={() => setCurrentPage('catalog')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>🏠 Ver Catálogo</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl border border-green-400/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Ingresos</p>
                <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💵</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl border border-blue-400/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Productos Vendidos</p>
                <p className="text-3xl font-bold">{stats.totalSales}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl border border-purple-400/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Órdenes con Ventas</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
            <span className="ml-3 text-lg font-medium text-orange-500">Cargando ventas...</span>
          </div>
        )}

        {/* Sales List */}
        {!isLoading && (
          <div className="space-y-6">
            {sales.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center border-2 border-orange-400/50">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-orange-700 mb-4">No hay ventas aún</h3>
                <p className="text-orange-600 mb-6 text-lg">
                  ¡Empieza a vender tu arsenal! Agrega productos y espera a que los guerreros los descubran.
                </p>
                <button
                  onClick={() => setCurrentPage('manage-products')}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  💼 Gestionar Mis Productos
                </button>
              </div>
            ) : (
              sales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-400/50 hover:shadow-orange-500/20 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Sale Header */}
                  <div className="px-6 py-4 border-b border-orange-400/30 bg-gradient-to-r from-orange-500/20 to-yellow-500/20">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                      <div>
                        <h3 className="text-xl font-bold text-orange-800 flex items-center gap-2">
                          📋 Venta #{sale.id}
                        </h3>
                        <p className="text-orange-600 text-sm">
                          {formatDate(sale.orderDate || sale.createdAt)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Cliente: {sale.customerName || 'Cliente'}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full text-white ${getStatusColor(sale.status)}`}>
                          {getStatusText(sale.status)}
                        </span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ${sale.sellerTotalAmount?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {sale.orderProducts?.length || 0} artículo(s) vendido(s)
                          </p>
                          {sale.originalTotalAmount !== sale.sellerTotalAmount && (
                            <p className="text-xs text-gray-500">
                              (de ${sale.originalTotalAmount?.toFixed(2) || '0.00'} total de la orden)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sale Toggle Button */}
                  <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-orange-50">
                    <button
                      onClick={() => toggleSaleExpansion(sale.id)}
                      className="w-full flex items-center justify-between text-left text-orange-700 hover:text-orange-900 transition-colors duration-200"
                    >
                      <span className="font-medium">
                        {expandedSales[sale.id] ? '▼ Ocultar detalles' : `▶ Ver tus ${sale.orderProducts?.length || 0} producto(s) vendido(s)`}
                      </span>
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${expandedSales[sale.id] ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Sale Items (Expandable) */}
                  {expandedSales[sale.id] && (
                    <div className="px-6 py-4 bg-orange-50/50">
                      <div className="space-y-4">
                        {sale.orderProducts?.map((orderProduct, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-orange-200/50 hover:border-orange-300/50 transition-colors duration-200"
                          >
                            <img
                              src={orderProduct.product?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY2RjAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIj5Qcm9kdWN0bzwvdGV4dD48L3N2Zz4='}
                              alt={orderProduct.product?.name}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-orange-300/50"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY2RjAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCxzYW5zLXNlcmlmIj5Qcm9kdWN0bzwvdGV4dD48L3N2Zz4='
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
                                <span className="text-sm font-medium text-orange-600">
                                  Vendidos: {orderProduct.quantity}
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
                              <p className="text-sm text-gray-500">
                                Ganancia
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

export default MySales
