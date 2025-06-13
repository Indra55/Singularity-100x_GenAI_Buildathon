import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboardingComplete?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requireOnboardingComplete = false,
  redirectTo = '/', // Changed from '/login' to '/' since login is on the root path
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated, redirect to login
      if (!isAuthenticated) {
        navigate(redirectTo, { state: { from: location }, replace: true });
        return;
      }

      // If onboarding is required but not completed, redirect to onboarding
      if (requireOnboardingComplete && user && !user.onboarding_complete) {
        navigate('/onboarding', { state: { from: location }, replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, location, requireOnboardingComplete, redirectTo]);

  // Show loading state while checking auth status
  if (isLoading || !isAuthenticated || (requireOnboardingComplete && user && !user.onboarding_complete)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;