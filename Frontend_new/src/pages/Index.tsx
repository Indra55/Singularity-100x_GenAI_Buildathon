
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlatformOverview from "@/components/PlatformOverview";
import HumanoidSection from "@/components/HumanoidSection";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import AuthModal from "@/components/auth/AuthModal";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import Dashboard from "@/components/dashboard/Dashboard";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id?: string;
  email?: string;
  username?: string;
  isGuest?: boolean;
  remainingQueries?: number;
  hasCompletedOnboarding?: boolean;
  [key: string]: any;
}

interface OnboardingData {
  [key: string]: any;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAuthenticated: isAuthFromContext } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [guestQueries, setGuestQueries] = useState(3);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced intersection observer for smoother animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "50px 0px -50px 0px"
      }
    );
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Enhanced smooth scrolling with better offset calculation
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        const navbarHeight = window.innerWidth < 768 ? 80 : 100;
        const offset = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      });
    });
  }, []);

  const handleAuthSuccess = (requiresOnboarding: boolean) => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        
        if (requiresOnboarding) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  };

  const handleOnboardingComplete = (onboardingData: OnboardingData) => {
    setShowOnboarding(false);
    setUser(prev => ({
      ...prev,
      ...onboardingData,
      hasCompletedOnboarding: true
    } as User));
  };

  const handleGuestSearch = () => {
    if (guestQueries > 0) {
      setGuestQueries(prev => prev - 1);
      // Set authenticated to true to show dashboard with chat interface
      setIsAuthenticated(true);
      setUser({ 
        isGuest: true, 
        remainingQueries: guestQueries - 1,
        hasCompletedOnboarding: true 
      });
      return true;
    } else {
      return false;
    }
  };

  // If user is authenticated and completed onboarding, show dashboard
  if (isAuthFromContext && !showOnboarding) {
    return <Dashboard user={user} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        isAuthenticated={isAuthenticated && !user?.isGuest}
        onAuthClick={() => setShowAuthModal(true)}
        guestQueries={guestQueries}
      />
      <main className="space-y-0">
        <Hero 
          onAuthClick={() => setShowAuthModal(true)}
          onGuestSearch={handleGuestSearch}
          guestQueries={guestQueries}
        />
        <PlatformOverview />
        <HumanoidSection />
        <Features />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
      
      {showOnboarding && (
        <OnboardingFlow 
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default Index;
