
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Zap, Brain, Search, FileText, MessageSquare, Star, Lock, Crown } from "lucide-react";
import LottieAnimation from "./LottieAnimation";

const Hero = ({ onAuthClick, onGuestSearch, guestQueries }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentQuickSearch, setCurrentQuickSearch] = useState(0);
  const [showUpgradePreview, setShowUpgradePreview] = useState(false);

  const quickSearches = [
    "Senior AI Engineer with LangChain",
    "GenAI Product Manager",
    "ML Research Scientist",
    "Full-stack Developer with AI experience"
  ];

  // Typing animation effect
  useEffect(() => {
    const text = "Find Perfect AI Talent";
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Cycle through quick searches
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuickSearch((prev) => (prev + 1) % quickSearches.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced hero animations with stagger effects
      const tl = gsap.timeline({ delay: 0.8 });
      
      tl.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      .from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.6")
      .from(ctaRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, "-=0.4")
      .from(statsRef.current?.children || [], {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.2");

      // Enhanced floating animations
      gsap.to(".floating-card", {
        y: "random(-30, 30)",
        x: "random(-10, 10)",
        rotation: "random(-8, 8)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: {
          amount: 3,
          from: "random"
        }
      });

      // Cursor blink animation
      gsap.to(".typing-cursor", {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      // Background parallax
      gsap.to(".hero-bg", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleGuestSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const canSearch = onGuestSearch();
      if (canSearch) {
        // Redirect to dashboard/chat with search query
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log("Redirecting to chat with query:", searchQuery);
      } else {
        setShowUpgradePreview(true);
      }
      setIsSearching(false);
    }, 1500);
  };

  const features = [
    {
      icon: Brain,
      title: "AI Search",
      description: "Natural language queries",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
      locked: false
    },
    {
      icon: FileText,
      title: "Smart Parser",
      description: "Extract insights instantly",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2,
      locked: guestQueries <= 0
    },
    {
      icon: MessageSquare,
      title: "Auto Outreach",
      description: "Personalized messages",
      color: "from-green-500 to-teal-500",
      delay: 0.3,
      locked: guestQueries <= 0
    }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pulse-50 via-white to-pulse-100 pt-28 sm:pt-32"
    >
      {/* Enhanced Background with multiple layers */}
      <div className="hero-bg absolute inset-0 opacity-40">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-pulse-200 to-purple-200 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-pink-200 to-pulse-200 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pulse-100/30 to-purple-100/30 rounded-full filter blur-3xl"></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-32 left-16 floating-card">
        <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center border border-white/50">
          <Users className="w-10 h-10 text-pulse-500" />
        </div>
      </div>
      <div className="absolute top-40 right-20 floating-card">
        <div className="w-16 h-16 bg-gradient-to-r from-pulse-500 to-pulse-600 rounded-2xl shadow-2xl flex items-center justify-center">
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-40 left-24 floating-card">
        <div className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center border border-purple-200">
          <Star className="w-7 h-7 text-purple-500" />
        </div>
      </div>
      <div className="absolute top-1/3 right-32 floating-card">
        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl shadow-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Main Content */}
          <div className="mb-12">
            <Badge className="mb-8 bg-gradient-to-r from-pulse-500 to-pulse-600 text-white border-none px-6 py-3 text-sm font-medium shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI Technology
            </Badge>
            
            <h1 
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-8 leading-tight"
            >
              <span className="inline-block">
                {typedText}
                <span className="typing-cursor text-pulse-500">|</span>
              </span>
              <span className="block bg-gradient-to-r from-pulse-500 via-pulse-600 to-purple-600 bg-clip-text text-transparent mt-2">
                in Minutes
              </span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Transform your hiring with AI-powered talent discovery. 
              <span className="block mt-2 text-lg sm:text-xl text-gray-500">
                Chat naturally, get instant matches, hire 10x faster.
              </span>
            </p>
          </div>

          {/* Enhanced Search Interface */}
          <div ref={ctaRef} className="space-y-8 mb-16">
            <div className="relative max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <Input
                    placeholder={`Try: "${quickSearches[currentQuickSearch]}"`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGuestSearch()}
                    className="pl-14 h-16 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400"
                  />
                </div>
                <Button
                  onClick={handleGuestSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="h-16 px-10 bg-gradient-to-r from-pulse-500 to-pulse-600 hover:from-pulse-600 hover:to-pulse-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold text-lg"
                >
                  {isSearching ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6" />
                      Search with AI
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={onAuthClick}
                variant="outline"
                className="border-2 border-pulse-300 hover:bg-pulse-50 hover:border-pulse-500 text-pulse-700 font-semibold px-8 py-4 rounded-xl text-lg h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="text-center">
                <p className="text-lg text-gray-600 font-medium">
                  {guestQueries > 0 ? `${guestQueries} free searches remaining` : "Sign up for unlimited access"}
                </p>
                <p className="text-sm text-gray-400 mt-1">No credit card required</p>
              </div>
            </div>
          </div>

          {/* Enhanced Feature Cards with Lock States */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`floating-card group relative bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/50 hover:bg-white/80 hover:-translate-y-2 ${
                  feature.locked ? 'opacity-60' : ''
                }`}
                style={{
                  animationDelay: `${feature.delay}s`
                }}
              >
                {feature.locked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                  feature.locked ? 'grayscale' : ''
                }`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                {feature.locked && (
                  <Button
                    size="sm"
                    onClick={() => setShowUpgradePreview(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Unlock
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Stats with animations */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50M+", label: "Candidate Profiles", icon: Users },
              { number: "98%", label: "Match Accuracy", icon: Brain },
              { number: "10x", label: "Faster Hiring", icon: Zap },
              { number: "24/7", label: "AI Support", icon: MessageSquare }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pulse-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-pulse-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-pulse-600 mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Lottie Animation */}
        <div className="absolute bottom-16 right-16 hidden lg:block opacity-60 hover:opacity-80 transition-opacity duration-300">
          <LottieAnimation
            animationPath="/loop-header.lottie"
            className="w-40 h-40"
          />
        </div>

        {/* Upgrade Preview Modal */}
        {showUpgradePreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Upgrade to Premium</h3>
                <p className="text-gray-600 mb-6">
                  You've used all your free searches. Upgrade to unlock unlimited AI-powered talent search and advanced features.
                </p>
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={() => {
                      setShowUpgradePreview(false);
                      onAuthClick();
                    }}
                    className="w-full bg-gradient-to-r from-pulse-500 to-pulse-600 text-white py-3"
                  >
                    Sign Up for Full Access
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUpgradePreview(false)}
                    className="w-full"
                  >
                    Continue Browsing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
