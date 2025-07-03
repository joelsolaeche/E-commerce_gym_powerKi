import { createContext, useContext, useState, useEffect } from 'react'
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
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([
    // Power Ki Gym demo users
    { id: 1, username: 'admin', email: 'admin@powerkigym.com', password: 'admin123', firstName: 'Carlos', lastName: 'Gimnasio', type: 'seller' },
    { id: 2, username: 'buyer1', email: 'athlete@powerkigym.com', password: 'buyer123', firstName: 'Ana', lastName: 'Atleta', type: 'buyer' }
  ])

  // No longer initialize from localStorage for security
  // User will need to log in again after page refresh

  const login = async (username, password) => {
    try {
      console.log('Attempting login with:', username);
      
      // Make API call to backend authentication endpoint
      const response = await fetch(`${config.API_BASE_URL}/api/v1/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username, // Using username as email for simplicity
          password: password
        })
      })

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        return false;
      }

      const data = await response.json()
      console.log('Login response:', data);
      
      // Get user type/role from backend response
      const userType = data.role === 'ADMIN' ? 'seller' : 'buyer'
      
      // Create a user object with the data from the backend
      const loggedInUser = {
        id: data.userId,
        username: username,
        email: username,
        firstName: data.firstName || username.split('@')[0], // Use firstName from response, fallback to email username
        lastName: data.lastName || (userType === 'seller' ? 'Vendedor' : 'Atleta'), // Use lastName from response with fallback
        role: data.role,
        type: userType, // Add type property for compatibility with Header component
        token: data.accessToken
      }
      
      console.log('Setting user with role:', loggedInUser.role);
      
      // Store user in state only (no localStorage for security)
      setUser(loggedInUser);
      
      return true;
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (userData) => {
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
        token: data.accessToken
      }
      
      // Store user in state only (no localStorage for security)
      setUsers([...users, newUser]);
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return Promise.reject(error); // Propagate the error to the caller
    }
  }

  const logout = () => {
    setUser(null);
    // No need to clear localStorage as we're not using it for security
  }

  const value = {
    user,
    users,
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
