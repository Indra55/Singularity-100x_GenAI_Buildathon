"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isGuestMode: boolean
  login: (email: string, password: string) => void
  signup: (email: string, password: string, name?: string) => void
  logout: () => void
  continueAsGuest: () => void
  messageCount: number
  incrementMessageCount: () => void
  resetMessageCount: () => void
  hasReachedMessageLimit: boolean
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
    const storedUser = localStorage.getItem("hireai_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }

    const storedMessageCount = localStorage.getItem("hireai_message_count")
    if (storedMessageCount) {
      setMessageCount(Number.parseInt(storedMessageCount, 10))
    }

    const guestMode = localStorage.getItem("hireai_guest_mode")
    if (guestMode === "true") {
      setIsGuestMode(true)
    }
  }, [])

  // Save message count to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("hireai_message_count", messageCount.toString())
  }, [messageCount])

  const login = (email: string, password: string) => {
    // In a real app, you would validate credentials against a backend
    // For now, accept any non-empty credentials
    if (email && password) {
      const user = { email }
      setUser(user)
      setIsAuthenticated(true)
      setIsGuestMode(false)
      localStorage.setItem("hireai_user", JSON.stringify(user))
      localStorage.removeItem("hireai_guest_mode")
    }
  }

  const signup = (email: string, password: string, name?: string) => {
    // In a real app, you would create a new user in the backend
    // For now, just simulate a successful signup
    if (email && password) {
      const user = { email, name }
      setUser(user)
      setIsAuthenticated(true)
      setIsGuestMode(false)
      localStorage.setItem("hireai_user", JSON.stringify(user))
      localStorage.removeItem("hireai_guest_mode")
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setIsGuestMode(false)
    localStorage.removeItem("hireai_user")
    localStorage.removeItem("hireai_guest_mode")
  }

  const continueAsGuest = () => {
    setIsGuestMode(true)
    localStorage.setItem("hireai_guest_mode", "true")
  }

  const incrementMessageCount = () => {
    if (!isAuthenticated) {
      setMessageCount((prev) => prev + 1)
    }
  }

  const resetMessageCount = () => {
    setMessageCount(0)
    localStorage.removeItem("hireai_message_count")
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
