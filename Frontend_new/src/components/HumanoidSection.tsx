import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brain, Users, Zap, Target, Search, MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const HumanoidSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setIsIntersecting(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      // Clear existing ScrollTriggers
      scrollTriggerRefs.current.forEach(st => st.kill());
      scrollTriggerRefs.current = [];

      // Enhanced card stacking animation with GSAP
      const cards = gsap.utils.toArray(".stack-card");
      
      cards.forEach((card, index) => {
        const cardElement = card as HTMLElement;
        
        const scrollTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.15) / 0.3));
            
            // Adjusted stacking effect for better visibility
            const yOffset = (1 - cardProgress) * 100 + index * 15; // Reduced offset
            const scale = 0.9 + cardProgress * 0.1; // Adjusted scale range
            const opacity = Math.max(0.6, cardProgress); // Increased minimum opacity
            const rotateX = (1 - cardProgress) * 5; // Reduced rotation
            
            gsap.set(cardElement, {
              y: yOffset,
              scale: scale,
              opacity: opacity,
              rotationX: rotateX,
              zIndex: hoveredCard === index ? 1000 : 10 + index,
              transformOrigin: "center bottom"
            });

            // Update active card based on progress
            if (progress >= 0.7) {
              setActiveCardIndex(3);
            } else if (progress >= 0.5) {
              setActiveCardIndex(2);
            } else if (progress >= 0.3) {
              setActiveCardIndex(1);
            } else {
              setActiveCardIndex(0);
            }
          }
        });

        scrollTriggerRefs.current.push(scrollTrigger);

        // Entrance animation when card becomes active
        const entranceScrollTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `${index * 20}% center`,
          end: `${(index + 1) * 20 + 20}% center`,
          onEnter: () => {
            gsap.to(cardElement, {
              rotationY: 0,
              duration: 0.8,
              ease: "power2.out"
            });
          }
        });

        scrollTriggerRefs.current.push(entranceScrollTrigger);
      });

      // Parallax effect for background images
      const parallaxScrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const cards = gsap.utils.toArray(".parallax-bg");
          
          cards.forEach((card, index) => {
            const cardElement = card as HTMLElement;
            const speed = 0.2 + (index * 0.1);
            
            gsap.to(cardElement, {
              y: progress * 100 * speed,
              scale: 1 + (progress * 0.05 * speed),
              rotation: progress * 2 * speed,
              duration: 0.1,
              ease: "none"
            });
          });
        }
      });

      scrollTriggerRefs.current.push(parallaxScrollTrigger);

      return () => {
        observer.disconnect();
        scrollTriggerRefs.current.forEach(st => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [])

  const handleCardMouseEnter = (index: number) => {
    setHoveredCard(index);
    // Temporarily disable ScrollTrigger updates for this card
    const cardElement = document.querySelector(`.stack-card:nth-child(${index + 1})`) as HTMLElement;
    if (cardElement) {
      gsap.set(cardElement, {
        zIndex: 1000,
        scale: 1,
        clearProps: "transform"
      });
    }
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
    // Re-enable ScrollTrigger updates
    ScrollTrigger.refresh();
  };

  const cardData = [
    {
      title: "We're giving AI a way to navigate talent acquisition",
      background: "/background-section1.png",
      tag: "Intelligence",
      icon: Brain,
      features: ["Natural Language Processing", "Smart Candidate Matching", "Predictive Analytics"]
    },
    {
      title: "We're bringing adaptive matching to where recruiters work",
      background: "/background-section2.png", 
      tag: "Automation",
      icon: Zap,
      features: ["Real-time Matching", "Workflow Integration", "Automated Screening"]
    },
    {
      title: "We're creating partners, <span class='text-pulse-500'>not replacements</span>",
      background: "/background-section3.png",
      tag: "Collaboration",
      icon: Users,
      features: ["Human-AI Partnership", "Enhanced Decision Making", "Augmented Intelligence"]
    },
    {
      title: "We're revolutionizing how talent meets opportunity",
      background: "/background-section1.png",
      tag: "Innovation",
      icon: Target,
      features: ["Global Talent Pool", "Instant Connections", "Future-Ready Hiring"]
    }
  ];

  return (
    <div 
      ref={sectionRef} 
      className="relative" 
      style={{ height: '800vh' }}
    >
      <section className="w-full h-screen py-10 md:py-16 sticky top-0 overflow-hidden bg-gradient-to-b from-gray-50 to-white" id="talent-vision">
        <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-4 mb-4 pt-8 sm:pt-6 md:pt-4">
              <div className="pulse-chip opacity-0 animate-fade-in" style={{
                animationDelay: "0.1s"
              }}>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
                <span>Our Vision</span>
              </div>
            </div>
            
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 md:mb-6">
              The Future of Talent Acquisition
            </h2>
            
            {/* Active Card Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {cardData.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeCardIndex 
                      ? 'w-8 bg-pulse-500' 
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div ref={cardsContainerRef} className="relative flex-1 perspective-1000">
            {cardData.map((card, index) => (
              <div 
                key={index}
                className={`stack-card absolute inset-0 overflow-hidden shadow-2xl rounded-3xl border-2 border-white/50 group transition-all duration-300 ${
                  hoveredCard === index ? 'hover:shadow-3xl hover:border-pulse-400/50' : ''
                }`}
                style={{
                  height: '60vh',
                  maxHeight: '600px',
                  transform: 'translateY(100px) scale(0.95)', // Adjusted initial position
                  opacity: 0.8, // Increased initial opacity
                  isolation: 'isolate'
                }}
                onMouseEnter={() => handleCardMouseEnter(index)}
                onMouseLeave={handleCardMouseLeave}
              >
                <div
                  className={`parallax-bg absolute inset-0 z-0 bg-gradient-to-b from-pulse-900/60 via-pulse-800/40 to-dark-900/80 transition-all duration-700 ${
                    hoveredCard === index ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                  style={{
                    backgroundImage: `url('${card.background}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundBlendMode: "overlay",
                    willChange: "transform"
                  }}
                ></div>
                
                {/* Animated overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-20"></div>
                
                {/* Enhanced Tag with Icon */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                    <card.icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{card.tag}</span>
                  </div>
                </div>
                
                {/* Floating elements with enhanced animations */}
                <div className="absolute top-12 left-12 w-2 h-2 bg-pulse-400 rounded-full animate-float opacity-60"></div>
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-white/40 rounded-full animate-float delay-1000 opacity-80"></div>
                <div className="absolute top-1/3 left-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                
                <div className="relative z-10 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-between">
                  <div className="max-w-2xl">
                    <h3 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-white font-bold leading-tight mb-6"
                      dangerouslySetInnerHTML={{ __html: card.title }}
                    />
                    
                    {/* Feature List */}
                    <div className="space-y-3">
                      {card.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-center gap-3 text-white/90 opacity-0 animate-fade-in"
                          style={{ animationDelay: `${featureIndex * 0.2}s` }}
                        >
                          <div className="w-2 h-2 bg-pulse-400 rounded-full"></div>
                          <span className="text-lg font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom stats/info */}
                  <div className="flex items-center justify-between mt-8">
                    <div className="text-white/70 text-sm">
                      Step {index + 1} of {cardData.length}
                    </div>
                    <div className="flex items-center gap-2">
                      {[Search, MessageSquare, Brain].map((Icon, i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced card glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-t from-pulse-500/20 to-transparent pointer-events-none transition-opacity duration-500 ${
                  hoveredCard === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></div>
                
                {/* Pulse border effect */}
                <div className={`absolute inset-0 rounded-3xl border-2 pointer-events-none transition-all duration-500 ${
                  hoveredCard === index ? 'border-pulse-400/50' : 'border-pulse-400/0 group-hover:border-pulse-400/50'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HumanoidSection; 