import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useRegisterMutation, setCredentials, logout } from '../store/slices/authSlice';

export const useReduxAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [loginMutation, loginResult] = useLoginMutation();
  const [registerMutation, registerResult] = useRegisterMutation();

  const login = async (username, password) => {
    try {
      const result = await loginMutation({ username, password }).unwrap();
      dispatch(setCredentials(result));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const result = await registerMutation(userData).unwrap();
      dispatch(setCredentials(result));
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.data?.message || 'Registration failed' };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: loginResult.isLoading || registerResult.isLoading,
    error: auth.error,
    login,
    register,
    logout: logoutUser
  };
}; 