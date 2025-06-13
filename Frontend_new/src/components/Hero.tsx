import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Zap, Brain, Search, FileText, MessageSquare, Star, Lock, Crown } from "lucide-react";

const Hero = ({ onAuthClick, onGuestSearch, guestQueries = 3 }) => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
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
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Cycle through quick searches
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuickSearch((prev) => (prev + 1) % quickSearches.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGuestSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const canSearch = onGuestSearch ? onGuestSearch() : guestQueries > 0;
      if (canSearch) {
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
      title: "AI-Powered Search",
      description: "Intelligent candidate matching with natural language processing",
      color: "from-orange-500 to-red-500",
      locked: false
    },
    {
      icon: FileText,
      title: "Smart Resume Parser",
      description: "Extract key insights and skills from candidate profiles instantly",
      color: "from-amber-500 to-orange-500", 
      locked: guestQueries <= 0
    },
    {
      icon: MessageSquare,
      title: "Automated Outreach",
      description: "Generate personalized messages that convert prospects",
      color: "from-orange-600 to-amber-600",
      locked: guestQueries <= 0
    }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50/30 via-white to-amber-50/40"
    >
      {/* Refined Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-32 left-32 w-96 h-96 bg-gradient-to-r from-orange-200/60 to-amber-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-48 right-24 w-80 h-80 bg-gradient-to-r from-amber-200/60 to-orange-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-48 w-72 h-72 bg-gradient-to-r from-orange-300/40 to-red-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Elegant Floating Elements */}
      <div className="absolute top-24 left-12 lg:left-20 animate-float" style={{ animationDuration: '6s' }}>
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center border border-orange-100/50 hover:shadow-orange-200/50 transition-shadow duration-500">
          <Users className="w-8 h-8 lg:w-10 lg:h-10 text-orange-500" />
        </div>
      </div>
      <div className="absolute top-40 right-16 lg:right-24 animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }}>
        <div className="w-14 h-14 lg:w-18 lg:h-18 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center">
          <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-48 left-16 lg:left-28 animate-float" style={{ animationDuration: '7s', animationDelay: '2s' }}>
        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center border border-amber-200/50">
          <Star className="w-5 h-5 lg:w-7 lg:h-7 text-amber-500" />
        </div>
      </div>
      <div className="absolute top-1/3 right-20 lg:right-40 animate-float" style={{ animationDuration: '5s', animationDelay: '3s' }}>
        <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>

      <div className="container relative z-10 px-6 sm:px-8 lg:px-12 text-center py-24">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="mb-16">
            <Badge className="mb-8 lg:mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base font-medium shadow-lg rounded-full">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 mr-3" />
              Powered by Advanced AI Technology
            </Badge>
            
            <h1 
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-8 lg:mb-12 leading-tight tracking-tight"
            >
              <span className="inline-block font-extralight">
                {typedText}
                <span className="text-orange-500 animate-pulse font-thin">|</span>
              </span>
              <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent mt-4 font-medium">
                in Minutes
              </span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-600 mb-12 lg:mb-16 max-w-5xl mx-auto leading-relaxed font-light"
            >
              Transform your hiring process with AI-powered talent discovery.
              <span className="block mt-4 text-lg sm:text-xl lg:text-2xl text-gray-500 font-extralight">
                Natural conversations, instant matches, accelerated results.
              </span>
            </p>
          </div>

          {/* Refined Search Interface */}
          <div ref={ctaRef} className="space-y-8 lg:space-y-12 mb-20 lg:mb-24">
            <div className="relative max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl lg:rounded-3xl shadow-2xl border border-white/60 hover:shadow-orange-200/20 transition-all duration-500">
                <div className="relative flex-1">
                  <Search className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 lg:w-7 lg:h-7" />
                  <Input
                    placeholder={`Try: "${quickSearches[currentQuickSearch]}"`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGuestSearch()}
                    className="pl-14 lg:pl-16 h-14 lg:h-18 text-lg lg:text-xl border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 font-light"
                  />
                </div>
                <Button
                  onClick={handleGuestSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="h-14 lg:h-18 px-8 lg:px-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl lg:rounded-2xl font-medium text-lg lg:text-xl"
                >
                  {isSearching ? (
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="animate-spin rounded-full h-5 w-5 lg:h-7 lg:w-7 border-b-2 border-white"></div>
                      <span className="hidden sm:inline">Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 lg:gap-4">
                      <Brain className="w-5 h-5 lg:w-7 lg:h-7" />
                      <span className="hidden sm:inline">Search with AI</span>
                      <span className="sm:hidden">Search</span>
                      <ArrowRight className="w-5 h-5 lg:w-7 lg:h-7" />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center">
              <Button
                onClick={onAuthClick}
                variant="outline"
                className="border-2 border-orange-300 hover:bg-orange-50 hover:border-orange-500 text-orange-700 font-medium px-8 lg:px-12 py-4 lg:py-5 rounded-xl lg:rounded-2xl text-lg lg:text-xl h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 ml-3" />
              </Button>
              <div className="text-center">
                <p className="text-lg lg:text-xl text-gray-600 font-medium">
                  {guestQueries > 0 ? `${guestQueries} complimentary searches remaining` : "Sign up for unlimited access"}
                </p>
                <p className="text-sm lg:text-base text-gray-400 mt-2 font-light">No credit card required</p>
              </div>
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20 lg:mb-24">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white/80 backdrop-blur-lg rounded-3xl lg:rounded-4xl p-8 lg:p-10 shadow-2xl hover:shadow-orange-200/30 transition-all duration-700 border border-white/60 hover:bg-white/90 hover:-translate-y-2 lg:hover:-translate-y-3 ${
                  feature.locked ? 'opacity-70' : ''
                }`}
              >
                {feature.locked && (
                  <div className="absolute top-4 lg:top-6 right-4 lg:right-6">
                    <Lock className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                  </div>
                )}
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 lg:mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-2xl ${
                  feature.locked ? 'grayscale' : ''
                }`}>
                  <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="font-semibold text-xl lg:text-2xl mb-3 lg:mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-4 lg:mb-6 font-light">{feature.description}</p>
                {feature.locked && (
                  <Button
                    size="sm"
                    onClick={() => setShowUpgradePreview(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 text-sm lg:text-base py-2 lg:py-3 px-4 lg:px-6 rounded-xl"
                  >
                    <Crown className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Upgrade to Unlock
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Refined Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              { number: "50M+", label: "Candidate Profiles", icon: Users },
              { number: "98%", label: "Match Accuracy", icon: Brain },
              { number: "10x", label: "Faster Hiring", icon: Zap },
              { number: "24/7", label: "AI Support", icon: MessageSquare }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl lg:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 text-orange-600" />
                </div>
                <div className="text-3xl lg:text-4xl xl:text-5xl font-light text-orange-600 mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Refined Upgrade Preview Modal */}
        {showUpgradePreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl lg:rounded-4xl p-8 lg:p-12 max-w-md lg:max-w-lg w-full shadow-2xl border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Crown className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold mb-6 text-gray-900">Upgrade to Premium</h3>
                <p className="text-base lg:text-lg text-gray-600 mb-8 font-light leading-relaxed">
                  You've used all your complimentary searches. Upgrade to unlock unlimited AI-powered talent search and advanced features.
                </p>
                <div className="space-y-4 mb-6">
                  <Button
                    onClick={() => {
                      setShowUpgradePreview(false);
                      onAuthClick && onAuthClick();
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 lg:py-5 text-lg lg:text-xl rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign Up for Full Access
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUpgradePreview(false)}
                    className="w-full py-4 lg:py-5 text-lg lg:text-xl rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                  >
                    Continue Browsing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;