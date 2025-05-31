'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: false }
  }
  public componentDidCatch(error: Error) {
    // Don't set error state for auth errors
    if (error.name !== 'AuthError') {
      this.setState({ hasError: true })
    }
    console.error('ErrorBoundary caught an error:', error)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }

    return this.props.children
  }
}
