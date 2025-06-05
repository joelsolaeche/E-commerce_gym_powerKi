import { useState } from 'react'
import { useUser } from '../context/UserContext'

const Register = ({ setCurrentPage }) => {
  const { register } = useUser()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    type: 'buyer'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationError, setRegistrationError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres'
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      setRegistrationError('')
      const { confirmPassword, ...userData } = formData
      
      console.log('About to register user with data:', userData)
      
      try {
        // Call the register function from UserContext
        const success = await register(userData)
        if (success) {
          console.log('Registration successful, redirecting to catalog')
          setCurrentPage('catalog')
        }
      } catch (error) {
        console.error('Registration error details:', error)
        // Display the specific error message
        setRegistrationError(error.message || 'Hubo un problema al registrarse. Por favor intente nuevamente.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
      {/* Dragon Ball themed background */}
      <div className="absolute inset-0 -z-10"></div>
      
      <div className="max-w-lg w-full space-y-8 sm:space-y-10">        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12" style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FFA500 100%)' }}>
            <span className="text-2xl">🐉</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center">
            🌟 Únete al Torneo Universal ⚡
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-600 font-medium">Regístrate como guerrero para comenzar tu entrenamiento</p>
        </div>          <div className="rounded-2xl shadow-2xl border-2 border-orange-400/30 transition-all duration-500 hover:shadow-2xl hover:border-orange-400/50" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 225, 0.95) 100%)' }}>
          <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
            {registrationError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {registrationError}
                </div>
              </div>
            )}
            {/* User Type */}
            <div>              <label className="block text-sm font-bold mb-3" style={{ color: '#0D47A1' }}>
                ⚔️ Tipo de Guerrero
              </label>
              <div className="grid grid-cols-2 gap-3">                <label className="relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200" style={{ borderColor: '#FFD700', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)' }}>
                  <input
                    type="radio"
                    name="type"
                    value="buyer"
                    checked={formData.type === 'buyer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.type === 'buyer' ? 'border-orange-400 bg-gradient-to-r from-orange-400 to-yellow-300' : 'border-orange-500/50'}`}>
                      {formData.type === 'buyer' && <div className="w-2 h-2 bg-orange-400 rounded-full m-0.5"></div>}
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl mb-1">🛒</div>
                      <span className="text-sm font-medium" style={{ color: '#212121' }}>Comprador</span>
                    </div>
                  </div>
                </label>
                <label className="relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200" style={{ borderColor: '#FFD700', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)' }}>
                  <input
                    type="radio"
                    name="type"
                    value="seller"
                    checked={formData.type === 'seller'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${formData.type === 'seller' ? 'border-orange-400 bg-gradient-to-r from-orange-400 to-yellow-300' : 'border-orange-500/50'}`}>
                      {formData.type === 'seller' && <div className="w-2 h-2 bg-orange-400 rounded-full m-0.5"></div>}
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl mb-1">💰</div>
                      <span className="text-sm font-medium" style={{ color: '#212121' }}>Vendedor</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                  👤 Nombre del Guerrero *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
                  style={{ 
                    borderColor: '#FFD700',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                    color: '#212121'
                  }}
                  placeholder="Tu nombre"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.firstName}
                </p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                  🏰 Apellido del Clan *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
                  style={{ 
                    borderColor: '#FFD700',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                    color: '#212121'
                  }}
                  placeholder="Tu apellido"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.lastName}
                </p>}
              </div>
            </div>
              {/* Username */}              <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                ⚡ Alias de Combate *
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
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-12 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
                  style={{ 
                    borderColor: '#FFD700',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                    color: '#212121'
                  }}
                  placeholder="Tu nombre de guerrero único"
                />
              </div>
              {errors.username && <p className="text-red-400 text-xs mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.username}
              </p>}
            </div>
              {/* Email */}            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                📧 Email de guerrero *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{ color: '#FFD700' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-12 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
                  style={{ 
                    borderColor: '#FFD700',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                    color: '#212121'
                  }}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>}
            </div>
              {/* Passwords */}            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                  🔐 Contraseña *
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-4 pr-12 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D47A1' }}>
                  ✅ Confirmar Contraseña *
                </label>                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" style={{ color: '#FFD700' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-4 pr-12 py-3.5 border-2 rounded-lg focus:outline-none text-base font-bold transition-all duration-300 focus:shadow-lg transform focus:scale-105"
                    style={{ 
                      borderColor: '#FFD700',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%)',
                      color: '#212121'
                    }}
                    placeholder="Repetir contraseña"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword}
                </p>}
              </div>
            </div>              <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white py-3.5 px-4 rounded-xl hover:from-orange-500 hover:via-yellow-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-1 active:translate-y-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : '⚡ ¡Iniciar Entrenamiento! 🥋'}
            </button>
          </form>
            <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              ¿Ya eres un guerrero registrado?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-blue-600 hover:text-orange-500 font-semibold transition-colors duration-200 hover:underline"
              >
                Despertar poder interno
              </button>
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => setCurrentPage('catalog')}
            className="text-gray-600 hover:text-orange-500 font-medium transition-colors duration-200 flex items-center justify-center mx-auto hover:scale-105 transform"
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

export default Register
