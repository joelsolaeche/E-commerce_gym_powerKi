import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

/**
 * Hook for verifying token validity and handling token-related issues
 * Can be used in components that make API calls requiring authentication
 */
export const useTokenVerification = (options = {}) => {
  const { user, ensureToken } = useUser();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);
  
  // Automatically verify on mount and when user changes
  useEffect(() => {
    if (!options.skipAutoVerify) {
      verifyToken();
    }
  }, [user]);
  
  // Function to verify the token
  const verifyToken = () => {
    if (!user) {
      console.log('TokenVerification: No user found');
      setIsVerified(false);
      setError('No user logged in');
      return false;
    }
    
    if (!user.token) {
      console.log('TokenVerification: User has no token');
      setIsVerified(false);
      setError('No token available');
      return false;
    }
    
    // Basic validation: check if token is a string with at least one dot (JWT format)
    const isValidFormat = typeof user.token === 'string' && 
                         user.token.length > 20 && 
                         user.token.split('.').length === 3;
    
    if (!isValidFormat) {
      console.log('TokenVerification: Token has invalid format');
      setIsVerified(false);
      setError('Invalid token format');
      return false;
    }
    
    // No localStorage usage for security
    
    console.log('TokenVerification: Token verified successfully');
    setIsVerified(true);
    setError(null);
    return true;
  };
  
  return {
    isVerified,
    error,
    verifyToken,
    
    // Helper function to ensure token is valid before an API call
    withTokenVerification: async (apiCall) => {
      const isValid = verifyToken();
      if (!isValid) {
        return { 
          success: false, 
          error: error || 'Authentication error: Invalid or missing token'
        };
      }
      
      try {
        return await apiCall();
      } catch (error) {
        console.error('API call failed after token verification:', error);
        return { success: false, error: error.message || 'API call failed' };
      }
    }
  };
};

export default useTokenVerification; 