import { useState } from 'react'
import { useUser } from '../context/UserContext'
import { useCart } from '../context/CartContext'

const Header = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useUser()
  const { getCartItemsCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 backdrop-blur-md shadow-2xl border-b-2 border-orange-500/30 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('catalog')}
              className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent hover:from-orange-300 hover:via-yellow-200 hover:to-orange-400 transition-all duration-200 flex items-center gap-1 sm:gap-2 hover:scale-105 transform"
            >
              {/* Dragon Ball Character Image */}
              <div className="relative">
                <img 
                  src="https://i1.sndcdn.com/artworks-000438423927-m6luwx-t500x500.jpg" 
                  alt="Dragon Ball Character"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-yellow-300/70 shadow-lg transform hover:scale-110 transition-all duration-300"
                  style={{
                    filter: 'brightness(1.1) contrast(1.2) saturate(1.3)',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3), 0 0 25px rgba(255, 111, 0, 0.2)'
                  }}
                />
                {/* Mini Energy Aura */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse"></div>
              </div>
              <span className="text-orange-400 animate-pulse">🐉⚡</span>
              <span className="hidden sm:inline">Power Ki Gym</span>
              <span className="sm:hidden">PKG</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage('catalog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 transform ${
                currentPage === 'catalog'
                  ? 'bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white shadow-lg border border-orange-400'
                  : 'text-orange-200 hover:text-orange-100 hover:bg-orange-500/20 border border-orange-500/30'
              }`}
            >
              🛒 Productos
            </button>
            
            {user && user.type === 'seller' && (
              <button
                onClick={() => setCurrentPage('manage-products')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 transform ${
                  currentPage === 'manage-products'
                    ? 'bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white shadow-lg border border-orange-400'
                    : 'text-orange-200 hover:text-orange-100 hover:bg-orange-500/20 border border-orange-500/30'
                }`}
              >
                💼 Mis Productos
              </button>
            )}
          </nav>          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-orange-200 hover:text-orange-100 transition-all duration-200 rounded-lg hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-400/50 transform hover:scale-110"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium shadow-lg animate-pulse">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* Desktop User actions */}
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-100">
                      ⚡ Hola, {user.firstName || user.username || 'Guerrero'}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white rounded-full font-medium shadow-md">
                      {user.type === 'seller' ? '💰 Vendedor' : '🛒 Comprador'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-orange-200 hover:text-white hover:bg-red-600/80 rounded-lg transition-all duration-200 border border-orange-500/50 hover:border-red-500 transform hover:scale-105"
                  >
                    🚪 Salir
                  </button>
                </div>
                {/* Mobile user info */}
                <div className="sm:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-orange-200 hover:text-orange-100 hover:bg-orange-500/20 rounded-lg transition-colors border border-orange-500/30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </>            ) : (
              <>
                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="px-4 py-2 text-sm font-medium text-orange-200 hover:text-orange-100 transition-all duration-200 rounded-lg hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-400/50 transform hover:scale-105"
                  >
                    ⚡ Iniciar Sesión
                  </button>
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-orange-400 transform hover:scale-105 animate-super-saiyan-glow"
                  >
                    🌟 Registrarse
                  </button>
                </div>
                {/* Mobile menu button for guests */}
                <div className="sm:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-orange-200 hover:text-orange-100 hover:bg-orange-500/20 rounded-lg transition-all duration-200 border border-orange-500/30 hover:border-orange-400/50 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-orange-500/30 py-4 bg-gradient-to-b from-blue-800/90 to-indigo-900/90 backdrop-blur-sm rounded-b-lg shadow-xl">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setCurrentPage('catalog')
                  setIsMobileMenuOpen(false)
                }}
                className={`text-left px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2 transform hover:scale-105 ${
                  currentPage === 'catalog'
                    ? 'bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white shadow-lg border border-orange-400'
                    : 'text-orange-200 hover:text-orange-100 hover:bg-orange-500/20 border border-orange-500/30'
                }`}
              >
                🛒 Productos
              </button>
              
              {user && user.type === 'seller' && (
                <button
                  onClick={() => {
                    setCurrentPage('manage-products')
                    setIsMobileMenuOpen(false)
                  }}
                  className={`text-left px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg mx-2 transform hover:scale-105 ${
                    currentPage === 'manage-products'
                      ? 'bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white shadow-lg border border-orange-400'
                      : 'text-orange-200 hover:text-orange-100 hover:bg-orange-500/20 border border-orange-500/30'
                  }`}
                >
                  💼 Mis Productos
                </button>
              )}

              {user ? (
                <div className="px-4 py-3 mx-2 space-y-3 bg-gradient-to-r from-blue-800/50 to-indigo-900/50 rounded-lg border border-orange-500/30 shadow-lg">
                  <div className="text-sm">
                    <p className="font-medium text-orange-100">⚡ Hola, {user.firstName || user.username || 'Guerrero'}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-gradient-to-r from-orange-500/80 to-yellow-500/80 text-white rounded-full font-medium shadow-md">
                      {user.type === 'seller' ? '💰 Vendedor' : '🛒 Comprador'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-orange-200 hover:text-white hover:bg-red-600/80 rounded-lg transition-all duration-200 border border-orange-500/50 hover:border-red-500 transform hover:scale-105"
                  >
                    🚪 Salir
                  </button>
                </div>
              ) : (
                <div className="px-2 py-2 space-y-2">
                  <button
                    onClick={() => {
                      setCurrentPage('login')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-orange-200 hover:text-orange-100 transition-all duration-200 bg-gradient-to-r from-blue-800/50 to-indigo-900/50 rounded-lg hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-400/50 transform hover:scale-105"
                  >
                    ⚡ Iniciar Sesión
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('register')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 rounded-lg transition-all duration-200 shadow-lg border border-orange-400 transform hover:scale-105 animate-super-saiyan-glow"
                  >
                    🌟 Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
