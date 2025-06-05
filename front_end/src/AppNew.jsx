import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ProductCatalog from './pages/ProductCatalog'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import ProductManagement from './pages/ProductManagement'
import { CartProvider } from './context/CartContext'
import { UserProvider } from './context/UserContext'

function App() {
  const [currentPage, setCurrentPage] = useState('catalog')

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />
      case 'register':
        return <Register setCurrentPage={setCurrentPage} />
      case 'cart':
        return <Cart setCurrentPage={setCurrentPage} />
      case 'manage-products':
        return <ProductManagement setCurrentPage={setCurrentPage} />
      case 'catalog':
      default:
        return <ProductCatalog setCurrentPage={setCurrentPage} />
    }
  }
  return (
    <UserProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="container mx-auto px-4 py-8 flex-1">
            {renderPage()}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </UserProvider>
  )
}

export default App
