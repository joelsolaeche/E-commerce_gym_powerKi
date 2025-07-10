import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from './UserContext'
import config from '../config'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const { user, token } = useUser()
  const [cart, setCart] = useState([])
  const [cartId, setCartId] = useState(null)

  // Obtener el cartId y el carrito del backend
  const fetchCart = async () => {
    if (!user || !token) {
      setCart([])
      setCartId(null)
      console.log('fetchCart: usuario o token no disponible, no se consulta el backend')
      return
    }
    
    console.log('🛒 fetchCart iniciado para usuario:', user.id)
    
    try {
      const res = await fetch(`${config.API_BASE_URL}/cart/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      console.log('🛒 fetchCart respuesta:', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('🛒 fetchCart datos recibidos:', data)
        
        // El backend puede devolver los productos en diferentes formatos
        let cartProducts = []
        if (data.products) {
          cartProducts = data.products
        } else if (data.cartProducts) {
          // Los cartProducts vienen con estructura { id, cart, product, quantity }
          cartProducts = data.cartProducts.map(cp => ({
            id: cp.product.id,
            name: cp.product.name,
            description: cp.product.description,
            price: cp.product.price,
            originalPrice: cp.product.originalPrice,
            discountPercentage: cp.product.discountPercentage,
            image: cp.product.image,
            stockQuantity: cp.product.stockQuantity,
            stock: cp.product.stockQuantity, // Agregar alias para compatibilidad
            category: cp.product.category?.description || cp.product.category,
            quantity: cp.quantity
          }))
        } else if (Array.isArray(data)) {
          cartProducts = data
        }
        
        console.log('🛒 fetchCart productos procesados:', cartProducts)
        console.log('🛒 Primer producto stock info:', cartProducts[0] ? { 
          id: cartProducts[0].id, 
          name: cartProducts[0].name, 
          stock: cartProducts[0].stock, 
          stockQuantity: cartProducts[0].stockQuantity,
          quantity: cartProducts[0].quantity 
        } : 'No hay productos')
        
        // Mantener el orden de productos existentes para evitar reordenación visual
        setCart(prevCart => {
          if (prevCart.length === 0) {
            // Si no hay carrito previo, usar el nuevo orden
            return cartProducts
          }
          
          // Crear un mapa para el orden actual
          const currentOrder = prevCart.map(item => item.id)
          const newProductsMap = new Map(cartProducts.map(item => [item.id, item]))
          
          // Mantener orden existente y agregar nuevos al final
          const orderedProducts = []
          
          // Primero agregar productos existentes en su orden actual
          currentOrder.forEach(id => {
            if (newProductsMap.has(id)) {
              orderedProducts.push(newProductsMap.get(id))
              newProductsMap.delete(id)
            }
          })
          
          // Luego agregar productos nuevos al final
          newProductsMap.forEach(product => {
            orderedProducts.push(product)
          })
          
          return orderedProducts
        })
        setCartId(data.id)
      } else {
        const errorText = await res.text()
        setCart([])
        setCartId(null)
        console.warn('fetchCart: respuesta no OK', res.status, errorText)
      }
    } catch (err) {
      setCart([])
      setCartId(null)
      console.error('fetchCart: error de red', err)
    }
  }

  // Agregar producto al carrito en el backend
  const addToCart = async (productId, quantity = 1) => {
    console.log('🛒 addToCart iniciado:', { productId, quantity, user: user?.id, hasToken: !!token })
    
    if (!user || !token) {
      console.warn('addToCart: usuario o token no disponible')
      return
    }
    
    let currentCartId = cartId
    console.log('🛒 cartId actual en memoria:', currentCartId)
    
    if (!currentCartId) {
      // Intentar obtener el cartId si no está en memoria
      console.log('🛒 Obteniendo cartId del backend...')
      try {
        const cartRes = await fetch(`${config.API_BASE_URL}/cart/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log('🛒 Respuesta al obtener cart:', cartRes.status)
        
        if (cartRes.ok) {
          const cartData = await cartRes.json()
          console.log('🛒 Datos del cart obtenidos:', cartData)
          currentCartId = cartData.id
          setCartId(cartData.id)
        } else {
          const errorText = await cartRes.text()
          console.error('addToCart: error obteniendo cartId', cartRes.status, errorText)
          return
        }
      } catch (err) {
        console.error('addToCart: error de red al obtener cartId', err)
        return
      }
    }
    
    console.log('🛒 Enviando producto al backend:', { cartId: currentCartId, productId, quantity })
    
    try {
      const res = await fetch(`${config.API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId: currentCartId, productId, quantity }),
      })
      
      console.log('🛒 Respuesta de cart/add:', res.status)
      
      if (res.ok) {
        // El backend puede devolver texto plano o JSON
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const responseData = await res.json()
          console.log('🛒 Producto agregado exitosamente (JSON):', responseData)
        } else {
          const responseText = await res.text()
          console.log('🛒 Producto agregado exitosamente (texto):', responseText)
        }
      } else {
        const errorText = await res.text()
        console.error('addToCart: respuesta no OK', res.status, errorText)
      }
    } catch (err) {
      console.error('addToCart: error en la petición cart/add', err)
    }
    
    console.log('🛒 Refrescando carrito...')
    await fetchCart()
  }

  // Quitar producto del carrito en el backend
  const removeFromCart = async (productId) => {
    console.log('🛒 removeFromCart iniciado:', { productId, cartId, user: user?.id })
    
    if (!user || !token || !cartId) {
      console.warn('removeFromCart: usuario, token o cartId no disponible')
      return
    }
    
    try {
      const res = await fetch(`${config.API_BASE_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId, productId }),
      })
      
      console.log('🛒 removeFromCart respuesta:', res.status)
      
      if (res.ok) {
        console.log('🛒 Producto removido exitosamente')
      } else {
        const errorText = await res.text()
        console.error('removeFromCart: respuesta no OK', res.status, errorText)
      }
    } catch (err) {
      console.error('removeFromCart: error en la petición', err)
    }
    
    await fetchCart()
  }

  // Limpiar carrito en el backend
  const clearCart = async () => {
    console.log('🛒 clearCart iniciado:', { cartId, user: user?.id })
    
    if (!user || !token || !cartId) {
      console.warn('clearCart: usuario, token o cartId no disponible')
      return
    }
    
    try {
      const res = await fetch(`${config.API_BASE_URL}/cart/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId }),
      })
      
      console.log('🛒 clearCart respuesta:', res.status)
      
      if (res.ok) {
        console.log('🛒 Carrito limpiado exitosamente')
      } else {
        const errorText = await res.text()
        console.error('clearCart: respuesta no OK', res.status, errorText)
      }
    } catch (err) {
      console.error('clearCart: error en la petición', err)
    }
    
    await fetchCart()
  }

  // Actualizar cantidad de producto en el carrito
  const updateQuantity = async (productId, newQuantity) => {
    console.log('🛒 updateQuantity iniciado:', { productId, newQuantity, user: user?.id, cartId })
    
    if (!user || !token || !cartId) {
      console.warn('updateQuantity: usuario, token o cartId no disponible')
      return
    }
    
    // Si la nueva cantidad es 0 o menos, eliminar el producto del carrito
    if (newQuantity <= 0) {
      await removeFromCart(productId)
      return
    }
    
    try {
      const res = await fetch(`${config.API_BASE_URL}/cart/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartId, productId, quantity: newQuantity }),
      })
      
      console.log('🛒 updateQuantity respuesta:', res.status)
      
      if (res.ok) {
        console.log('🛒 Cantidad actualizada exitosamente')
      } else {
        const errorText = await res.text()
        console.error('updateQuantity: respuesta no OK', res.status, errorText)
      }
    } catch (err) {
      console.error('updateQuantity: error en la petición', err)
    }
    
    await fetchCart()
  }

  const getCartItemsCount = () => {
    if (!Array.isArray(cart)) return 0
    return cart.reduce((total, item) => total + (item.quantity || 0), 0)
  }

  const getCartTotal = () => {
    if (!Array.isArray(cart)) return 0
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0)
  }

  useEffect(() => {
    if (user && token) {
      fetchCart()
    } else {
      setCart([])
      setCartId(null)
    }
  }, [user, token])

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, clearCart, updateQuantity, getCartItemsCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  )
}
