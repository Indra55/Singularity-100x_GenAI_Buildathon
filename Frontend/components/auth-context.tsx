"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

const API_URL = 'http://localhost:5000/api';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  messageCount: number;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
  hasReachedMessageLimit: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const MESSAGE_LIMIT = 3

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('hireai_token');
    const storedUser = localStorage.getItem('hireai_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const storedMessageCount = localStorage.getItem('hireai_message_count');
    if (storedMessageCount) {
      setMessageCount(Number.parseInt(storedMessageCount, 10));
    }

    const guestMode = localStorage.getItem('hireai_guest_mode');
    if (guestMode === 'true') {
      setIsGuestMode(true);
    }
  }, [])

  // Save message count to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hireai_message_count', messageCount.toString());
  }, [messageCount])

  const login = async (email: string, password: string) => {
    try {      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });        const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.message || 'Login failed');
        error.name = 'AuthError';
        return Promise.reject(error);
      }
      const user = { email: data.user.email, name: data.user.name };
      
      setUser(user);
      setIsAuthenticated(true);
      setIsGuestMode(false);
      
      localStorage.setItem('hireai_token', data.token);
      localStorage.setItem('hireai_user', JSON.stringify(user));
      localStorage.removeItem('hireai_guest_mode');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      const user = { email: data.user.email, name: data.user.name };
      
      setUser(user);
      setIsAuthenticated(true);
      setIsGuestMode(false);
      
      localStorage.setItem('hireai_token', data.token);
      localStorage.setItem('hireai_user', JSON.stringify(user));
      localStorage.removeItem('hireai_guest_mode');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setIsGuestMode(false)
    localStorage.removeItem('hireai_token')
    localStorage.removeItem('hireai_user')
    localStorage.removeItem('hireai_guest_mode')
  }

  const continueAsGuest = () => {
    setIsGuestMode(true)
    localStorage.setItem('hireai_guest_mode', 'true')
  }

  const incrementMessageCount = () => {
    if (!isAuthenticated) {
      setMessageCount((prev) => prev + 1)
    }
  }

  const resetMessageCount = () => {
    setMessageCount(0)
    localStorage.removeItem('hireai_message_count')
  }

  const hasReachedMessageLimit = !isAuthenticated && messageCount >= MESSAGE_LIMIT

  const value = {
    user,
    isAuthenticated,
    isGuestMode,
    login,
    signup,
    logout,
    continueAsGuest,
    messageCount,
    incrementMessageCount,
    resetMessageCount,
    hasReachedMessageLimit,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
