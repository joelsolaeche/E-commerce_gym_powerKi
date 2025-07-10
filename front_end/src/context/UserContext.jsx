import { createContext, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, logout as reduxLogout } from '../store/slices/authSlice'
import config from '../config'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Sincronizar token con user y Redux
  useEffect(() => {
    if (user && user.token) {
      setToken(user.token)
      // Sincronizar con Redux
      dispatch(setCredentials({ user, token: user.token }))
      console.log('🔄 Sincronizando usuario y token con Redux:', { user: user?.email, hasToken: !!user.token })
    } else {
      setToken(null)
      // Limpiar Redux
      dispatch(reduxLogout())
      console.log('🔄 Limpiando estado Redux')
    }
  }, [user, dispatch])

  const login = async (email, password) => {
    setIsAuthenticating(true)
    try {
      console.log('Attempting login with:', email);
      
      // Make API call to backend authentication endpoint
      const response = await fetch(`${config.API_BASE_URL}/api/v1/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // Using email directly
          password: password
        })
      })

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        setIsAuthenticating(false)
        return false;
      }

      const data = await response.json()
      console.log('Login response JSON:', data); // <--- LOG explícito
      
      // Get user type/role from backend response
      const userType = data.role === 'ADMIN' ? 'seller' : 'buyer'
      
      // Create a user object with the data from the backend
      const loggedInUser = {
        id: data.userId,
        username: email,
        email: email,
        firstName: data.firstName || email.split('@')[0], // Use firstName from response, fallback to email username
        lastName: data.lastName || (userType === 'seller' ? 'Vendedor' : 'Atleta'), // Use lastName from response with fallback
        role: data.role,
        type: userType, // Add type property for compatibility with Header component
        token: data.access_token // <--- corregido
      }
      
      console.log('Setting user with role:', loggedInUser.role);
      
      // Store user in state only (no localStorage for security)
      setUser(loggedInUser);
      setIsAuthenticating(false)
      return true;
    } catch (error) {
      console.error('Login error:', error)
      setIsAuthenticating(false)
      return false
    }
  }

  const register = async (userData) => {
    setIsAuthenticating(true)
    try {
      console.log('Registering user:', userData);
      
      // Map frontend userData to backend RegisterRequest format
      const registerData = {
        firstname: userData.firstName,
        lastname: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.type === 'seller' ? 'ADMIN' : 'USER'
      }

      console.log('Sending registration data:', registerData);

      // Make API call to backend register endpoint
      const response = await fetch(`${config.API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        setIsAuthenticating(false)
        console.error('Registration failed with error:', errorText);
        
        // Check if it's an email already exists error
        if (response.status === 409 || errorText.includes('Email already exists')) {
          throw new Error(`El correo electrónico ya está registrado. Por favor use otro correo.`);
        }
        
        throw new Error(`Registration failed: ${errorText}`);
      }

      const data = await response.json();
      console.log('Registration successful, received data:', data);
      
      // Create new user object
      const newUser = {
        id: data.userId,
        username: userData.email,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: data.role,
        type: userData.type,
        token: data.access_token // <--- corregido
      }
      
      // Store user in state only (no localStorage for security)
      setUser(newUser);
      setIsAuthenticating(false)
      return true;
    } catch (error) {
      setIsAuthenticating(false)
      console.error('Registration error:', error);
      return Promise.reject(error); // Propagate the error to the caller
    }
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticating(false)
    // Limpiar Redux también
    dispatch(reduxLogout())
    console.log('🚪 Logout completo - estado limpiado en contexto y Redux')
    // No need to clear localStorage as we're not using it for security
  }

  const value = {
    user,
    token,
    isAuthenticating,
    login,
    register,
    logout
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
