"use client"

import { useState, useEffect } from "react"
import { EnhancedHireAIPlatform } from "@/components/enhanced-hireai-platform"
import { AuthProvider } from "@/components/auth-context"
import LoginPage from "@/components/login-page"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return (
    <AuthProvider>
      <ErrorBoundary>
        <LoginPage />
        <EnhancedHireAIPlatform />
      </ErrorBoundary>
    </AuthProvider>
  )
}
