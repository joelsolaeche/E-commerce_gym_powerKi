import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductCatalog from './pages/ProductCatalog'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import ProductManagement from './pages/ProductManagement'
import PaymentPage from './pages/PaymentPage'
import MyOrders from './pages/MyOrders'
import MySales from './pages/MySales'
import { CartProvider } from './context/CartContext'
import { UserProvider, useUser } from './context/UserContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </UserProvider>
  )
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('catalog')
  const { user } = useUser()

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />
      case 'cart':
        // Redirect sellers away from cart
        if (user?.type === 'seller') {
          toast.info('Los vendedores no pueden acceder al carrito. Administra tus productos desde "Mis Productos".')
          setCurrentPage('catalog')
          return <ProductCatalog setCurrentPage={setCurrentPage} />
        }
        return <Cart setCurrentPage={setCurrentPage} />
      case 'payment':
        // Redirect sellers away from payment
        if (user?.type === 'seller') {
          toast.info('Los vendedores no pueden realizar compras.')
          setCurrentPage('catalog')
          return <ProductCatalog setCurrentPage={setCurrentPage} />
        }
        return <PaymentPage setCurrentPage={setCurrentPage} />
      case 'manage-products':
        return <ProductManagement setCurrentPage={setCurrentPage} />
      case 'my-orders':
        return <MyOrders setCurrentPage={setCurrentPage} />
      case 'my-sales':
        return <MySales setCurrentPage={setCurrentPage} />
      case 'catalog':
      default:
        return <ProductCatalog setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8 flex-1">
        {renderPage()}
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  )
}

export default App
