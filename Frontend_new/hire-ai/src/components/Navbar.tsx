
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Navbar = ({ isAuthenticated, onAuthClick, guestQueries }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const navItems = [
    { 
      href: "#", 
      label: "Home", 
      description: "AI-powered talent platform",
      onClick: (e) => {
        e.preventDefault();
        scrollToTop();
      }
    },
    { 
      href: "#features", 
      label: "Features", 
      description: "Smart recruiting tools"
    },
    { 
      href: "#details", 
      label: "How It Works", 
      description: "Your hiring process, elevated"
    },
    { 
      href: "#testimonials", 
      label: "Testimonials", 
      description: "Trusted by top recruiters"
    }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        isScrolled 
          ? "py-2 sm:py-3 bg-white/95 backdrop-blur-xl shadow-xl border-b border-pulse-100/50" 
          : "py-4 sm:py-5 md:py-6 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <a 
          href="#" 
          className="flex items-center space-x-3 group relative z-10"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          aria-label="TalentGPT"
        >
          <div className="relative">
            <img 
              src="/logo.svg" 
              alt="TalentGPT Logo" 
              className="h-8 sm:h-9 transition-all duration-300 group-hover:scale-110" 
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pulse-500 to-pulse-600 rounded-full animate-pulse shadow-lg"></div>
          </div>
          <div className="hidden sm:block">
            <div className="text-xl font-bold text-gray-900 group-hover:text-pulse-600 transition-colors duration-300">
              TalentGPT
            </div>
            <div className="text-xs text-pulse-600 -mt-1 opacity-80">
              AI Recruiting Platform
            </div>
          </div>
        </a>

        {/* Enhanced Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="group relative nav-link px-4 py-3 rounded-xl hover:bg-pulse-50/80 transition-all duration-300"
              onClick={item.onClick || (() => {})}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium text-gray-700 group-hover:text-pulse-600 transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-pulse-500 transition-colors duration-300 mt-1">
                  {item.description}
                </span>
              </div>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-pulse-500 to-pulse-600 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
            </a>
          ))}

          <div className="ml-6 flex items-center gap-4">
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-pulse-50 hover:border-pulse-300 border-2 px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
                <ChevronDown className="w-4 h-4 opacity-60" />
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                {guestQueries < 3 && (
                  <Badge variant="outline" className="bg-gradient-to-r from-pulse-50 to-purple-50 text-pulse-700 border-pulse-200 px-3 py-1 font-medium">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {guestQueries} searches left
                  </Badge>
                )}
                <Button 
                  onClick={onAuthClick}
                  className="bg-gradient-to-r from-pulse-500 to-pulse-600 hover:from-pulse-600 hover:to-pulse-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-2 rounded-xl font-semibold"
                >
                  <span>Get Started</span>
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Enhanced Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          {!isAuthenticated && guestQueries < 3 && (
            <Badge variant="outline" className="bg-pulse-50 text-pulse-700 text-xs px-2 py-1">
              {guestQueries} left
            </Badge>
          )}

          {isAuthenticated ? (
            <Button size="sm" variant="outline" className="flex items-center gap-2 border-2">
              <User className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={onAuthClick}
              className="bg-gradient-to-r from-pulse-500 to-pulse-600 hover:from-pulse-600 hover:to-pulse-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Sign In
            </Button>
          )}

          <button 
            className={cn(
              "relative p-3 rounded-xl transition-all duration-300",
              isMenuOpen 
                ? "bg-pulse-500 text-white shadow-lg" 
                : "text-gray-700 hover:bg-gray-100 hover:text-pulse-600"
            )}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-6">
              <span className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition-all duration-300",
                isMenuOpen ? "rotate-45 top-3" : "top-1"
              )} />
              <span className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition-all duration-300 top-3",
                isMenuOpen ? "opacity-0" : "opacity-100"
              )} />
              <span className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition-all duration-300",
                isMenuOpen ? "-rotate-45 top-3" : "top-5"
              )} />
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out",
        isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMenu} />
        <div className={cn(
          "absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-500 ease-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full pt-20 px-6">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="group p-4 rounded-2xl hover:bg-pulse-50 transition-all duration-300 border-2 border-transparent hover:border-pulse-200" 
                  onClick={(e) => {
                    if (item.onClick) item.onClick(e);
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                  }}
                >
                  <div className="text-lg font-semibold text-gray-900 group-hover:text-pulse-600 transition-colors duration-300">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 group-hover:text-pulse-500 transition-colors duration-300">
                    {item.description}
                  </div>
                </a>
              ))}
            </nav>
            
            {!isAuthenticated && (
              <div className="mt-8 space-y-4">
                <Button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.body.style.overflow = '';
                    onAuthClick();
                  }}
                  className="w-full bg-gradient-to-r from-pulse-500 to-pulse-600 text-white shadow-lg py-4 rounded-2xl font-semibold text-lg"
                >
                  Get Started Free
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-sm text-gray-500">
                  No credit card required
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
