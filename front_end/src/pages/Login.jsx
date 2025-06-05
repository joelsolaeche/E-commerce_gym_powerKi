import { useState } from 'react'
import { useUser } from '../context/UserContext'

const Login = ({ setCurrentPage }) => {
  const { login } = useUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)
    
    try {
      const success = await login(username, password)
      if (success) {
      setCurrentPage('catalog')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'username') {
      setUsername(value)
    } else if (name === 'password') {
      setPassword(value)
    }
    setError('')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
      {/* Dragon Ball themed background */}
      <div className="absolute inset-0 -z-10"></div>
      
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12" style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}>
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center">
            🐉 Despertar Poder Interno ⚡
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-600 font-medium">Accede al Torneo de Artes Marciales</p>
        </div>
          <div className="rounded-2xl shadow-2xl border-2 border-orange-400/30 transition-all duration-500 hover:shadow-2xl hover:border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.95) 100%)' }}>
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6 p-6 sm:p-8">
            {error && (
              <div className="border-2 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm flex items-center font-bold" style={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', borderColor: '#f44336' }}>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ⚠️ {error}
              </div>
            )}
              <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                📧 Email de guerrero
              </label>                
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: '#FFD700' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-12 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
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
                  placeholder="Ej: Goku, Vegeta, Gohan..."
                />
              </div>
            </div>
              <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                🔐 Contraseña
              </label>              
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: '#FFD700' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-12 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
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
                  placeholder="Tu energía secreta..."
                />              </div>
            </div>
            
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center">
                  <span className="mr-2">Iniciando sesión...</span>
                </span>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-yellow-300 group-hover:text-yellow-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  ¡Liberar Poder! 🔥
                </>
              )}
            </button>
          </form>
            <div className="mt-6 text-center">
            <p className="text-sm sm:text-base font-medium" style={{ color: '#0D47A1' }}>
              ¿Necesitas despertar tu poder?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="font-bold transition-all duration-200 px-2 py-1 rounded hover:shadow-lg transform hover:scale-105"
                style={{ color: '#FF6F00', background: 'rgba(255, 111, 0, 0.1)' }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'white'
                  e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#FF6F00'
                  e.target.style.background = 'rgba(255, 111, 0, 0.1)'
                }}
              >
                🌟 Únete al Torneo
              </button>
            </p>
          </div>
            {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-lg border-2" style={{ background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)', borderColor: '#2196F3' }}>
            <h4 className="font-bold mb-3 text-sm sm:text-base flex items-center" style={{ color: '#0D47A1' }}>
              <svg className="w-4 h-4 mr-2" style={{ color: '#2196F3' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              🎭 Guerreros de Práctica:
            </h4>
            <div className="text-xs sm:text-sm space-y-2 font-medium">
              <div className="p-2 rounded border-2 transition-all duration-200 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)', borderColor: '#4CAF50' }}>
                <p><span className="font-bold" style={{ color: '#2E7D32' }}>🏆 Maestro:</span> <span style={{ color: '#0D47A1' }}>admin / admin123</span></p>
              </div>
              <div className="p-2 rounded border-2 transition-all duration-200 hover:shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(255, 111, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)', borderColor: '#FF6F00' }}>
                <p><span className="font-bold" style={{ color: '#E65100' }}>⚡ Estudiante:</span> <span style={{ color: '#0D47A1' }}>buyer1 / buyer123</span></p>
              </div>
            </div>
          </div>
        </div>
          <div className="text-center">
          <button
            onClick={() => setCurrentPage('catalog')}
            className="text-white font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center mx-auto px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #757575 0%, #424242 100%)' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)'
              e.target.style.boxShadow = '0 0 20px rgba(255, 111, 0, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #757575 0%, #424242 100%)'
              e.target.style.boxShadow = ''
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            🏠 Volver al Dojo
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
