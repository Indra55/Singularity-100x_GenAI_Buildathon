import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  company?: string;
  profile_pic?: string;
  avatar?: string;
  onboarding_complete: boolean;
}

interface AuthResponse {
  requiresOnboarding: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (username: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!storedToken || !storedUser) {
          console.log('No stored token or user found');
          setIsLoading(false);
          return;
        }

        console.log('Found stored token, using it without verification');
        
        // Set token for API client
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          // Use stored user data directly since we can't verify the token
          const userData = JSON.parse(storedUser);
          console.log('Setting user from stored data');
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any partial state on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post('/users/login', { email, password });
      const { token, user } = response.data;
      
      console.log('Login successful, saving token and user data');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token for API client
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);
      
      // Return the onboarding status for the component to handle navigation
      return {
        requiresOnboarding: !user.onboarding_complete
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to be handled by the component
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/users/register', { username, email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setToken(token);
    setUser(user);
    
    // Return the onboarding status for the component to handle navigation
    return {
      requiresOnboarding: true
    };
  };

  const logout = async () => {
    // Clear local storage and state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    
    console.log('User logged out successfully');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;