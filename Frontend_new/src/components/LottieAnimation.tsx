
import React, { useEffect, useRef } from "react";

interface LottieAnimationProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAnimation = ({
  animationPath,
  className = "",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For now, we'll use a fallback div since we don't have the actual Lottie file
    // In a real implementation, you would load the Lottie animation here
  }, [animationPath]);

  return (
    <div ref={containerRef} className={className}>
      {/* Fallback animation using CSS */}
      <div className="w-full h-full bg-gradient-to-br from-pulse-100 to-pulse-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pulse-500/20 to-pulse-600/20 animate-pulse"></div>
        <div className="text-center animate-float z-10">
          <div className="w-16 h-16 bg-pulse-500 rounded-full mx-auto mb-4 animate-pulse"></div>
          <h3 className="text-xl font-semibold text-pulse-700 mb-2">TalentGPT</h3>
          <p className="text-pulse-600">AI-Powered Talent Sourcing</p>
        </div>
        {/* Floating particles effect */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-pulse-400 rounded-full animate-float"></div>
        <div className="absolute bottom-8 right-6 w-3 h-3 bg-pulse-500 rounded-full animate-float delay-500"></div>
        <div className="absolute top-1/2 left-8 w-1 h-1 bg-pulse-600 rounded-full animate-float delay-1000"></div>
      </div>
    </div>
  );
};

export default LottieAnimation;
