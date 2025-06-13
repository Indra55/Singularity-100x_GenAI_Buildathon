import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from 'react';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./pages/Profile";
import type { OnboardingData } from "./components/onboarding/OnboardingFlow";
import OnboardingFlow from "./components/onboarding/OnboardingFlow";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check if onboarding is needed when user is loaded
  useEffect(() => {
    if (!isLoading && user?.id) {
      console.log('User loaded, checking onboarding status:', user);
      setShowOnboarding(!user.onboarding_complete);
    }
    
    // Only mark initial check as done after we've loaded the auth state
    if (!isLoading) {
      setInitialCheckDone(true);
    }
  }, [user, isLoading]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    console.log('Onboarding completed');
    setShowOnboarding(false);
  };

  // Show loading state while checking initial auth status
  if (isLoading || !initialCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
      </div>
    );
  }

  console.log('Rendering routes. isAuthenticated:', isAuthenticated, 'user:', user);

  return (
    <Routes>
      {/* Root route - show Index for unauthenticated, redirect to dashboard for authenticated */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace state={{ from: location }} />
          ) : (
            <Index />
          )
        }
      />

      {/* Protected dashboard route */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            {/* Show onboarding modal if needed */}
            {showOnboarding && (
              <OnboardingFlow 
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
              />
            )}
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Profile route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      {/* Onboarding route - only accessible when not completed */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboardingComplete={false}>
            <OnboardingFlow 
              isOpen={true}
              onComplete={handleOnboardingComplete}
            />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
