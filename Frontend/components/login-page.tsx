"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, User, Lock, Mail, ArrowRight, Sparkles, Eye, EyeOff, UserPlus, LogIn, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"

export default function LoginPage() {
  const { isAuthenticated, isGuestMode, login, signup, continueAsGuest } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // If already authenticated or in guest mode, don't show the login page
  if (isAuthenticated || isGuestMode) {
    return null
  }

  const continueWithoutLogin = () => {
    continueAsGuest()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      if (isLoginMode) {
        login(email, password)
      } else {
        signup(email, password, name)
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError("")
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/8 rounded-full blur-[100px] animate-pulse delay-2000" />

        {/* Enhanced floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-violet-200 to-pink-200 bg-clip-text text-transparent">
            HireAI Platform
          </h1>
          <p className="text-violet-300 mt-2">AI-Powered Recruitment Solution</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900/70 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-8 shadow-2xl shadow-violet-500/10"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-full blur-md"
              />
              <div className="relative bg-gradient-to-r from-violet-500 to-pink-500 rounded-full p-3">
                {isLoginMode ? <LogIn className="w-6 h-6 text-white" /> : <UserPlus className="w-6 h-6 text-white" />}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-6">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLoginMode && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-violet-200 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-gray-800/50 border-violet-500/30 text-white placeholder:text-gray-500 pl-10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    />
                    <User className="w-4 h-4 text-violet-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-200 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-800/50 border-violet-500/30 text-white placeholder:text-gray-500 pl-10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  required
                />
                <Mail className="w-4 h-4 text-violet-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-violet-200 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-gray-800/50 border-violet-500/30 text-white placeholder:text-gray-500 pl-10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-violet-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-3"
              >
                {error}
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg shadow-violet-500/25 flex items-center justify-center transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {isLoginMode ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/70 text-gray-400">Or</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full border-violet-500/30 text-violet-300 hover:text-white hover:bg-violet-500/10 hover:border-violet-500/50 transition-all duration-300 py-3"
                  onClick={continueWithoutLogin}
                >
                  <div className="flex items-center justify-center">
                    <Zap className="w-4 h-4 mr-2" />
                    <span>Continue without logging in</span>
                    <div className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                      3 messages
                    </div>
                  </div>
                </Button>
              </motion.div>
              <p className="text-xs text-gray-500 mt-2">
                Try the AI assistant with limited access • No signup required
              </p>
            </motion.div>

            <motion.button
              onClick={toggleMode}
              className="mt-6 text-violet-300 hover:text-violet-200 text-sm flex items-center justify-center mx-auto transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {isLoginMode ? "Create a new account" : "Sign in to existing account"}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4">
            <p className="mb-2">
              <span className="text-green-400">✓</span> For testing: use any email and password
            </p>
            <p>
              <span className="text-yellow-400">⚡</span> Guest users get 3 free AI messages
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
