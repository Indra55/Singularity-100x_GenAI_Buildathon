
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, RotateCcw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCardStackProps {
  candidates: any[];
  onSwipe: (candidateId: string, action: 'like' | 'pass') => void;
  renderCard: (candidate: any) => React.ReactNode;
}

const SwipeableCardStack: React.FC<SwipeableCardStackProps> = ({
  candidates,
  onSwipe,
  renderCard
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastSwipeDirection, setLastSwipeDirection] = useState<'like' | 'pass' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const currentCandidate = candidates[currentIndex];
  const nextCandidates = candidates.slice(currentIndex + 1, currentIndex + 4);

  useEffect(() => {
    if (currentIndex >= candidates.length) {
      // All cards swiped
      setCurrentIndex(0);
    }
  }, [currentIndex, candidates.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const threshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      const action = x > 0 ? 'like' : 'pass';
      handleSwipe(action);
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleSwipe = (action: 'like' | 'pass') => {
    if (!currentCandidate) return;
    
    setLastSwipeDirection(action);
    onSwipe(currentCandidate.id, action);
    
    // Animate card out
    const direction = action === 'like' ? 1000 : -1000;
    setDragOffset({ x: direction, y: 0 });
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setLastSwipeDirection(null);
    }, 300);
  };

  const getCardStyle = (index: number) => {
    const isActive = index === 0;
    const zIndex = 10 - index;
    const scale = 1 - (index * 0.05);
    const translateY = index * 8;
    const opacity = index < 3 ? 1 - (index * 0.2) : 0;
    
    if (isActive && isDragging) {
      const rotation = dragOffset.x * 0.1;
      return {
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y + translateY}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex,
        opacity,
        transition: 'none'
      };
    }
    
    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      zIndex,
      opacity,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  const getOverlayOpacity = () => {
    const { x } = dragOffset;
    return Math.min(Math.abs(x) / 100, 1);
  };

  if (!currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-24 h-24 bg-pulse-100 rounded-full flex items-center justify-center">
          <Zap className="w-12 h-12 text-pulse-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">All done!</h3>
        <p className="text-gray-600 text-center max-w-md">
          You've reviewed all candidates. Check your selected candidates or start a new search.
        </p>
        <Button 
          onClick={() => setCurrentIndex(0)}
          className="bg-pulse-500 hover:bg-pulse-600"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Review Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] perspective-1000">
      {/* Card Stack */}
      <div className="relative w-full h-full">
        {[currentCandidate, ...nextCandidates].map((candidate, index) => (
          <div
            key={`${candidate.id}-${currentIndex}-${index}`}
            ref={index === 0 ? cardRef : null}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={getCardStyle(index)}
            onMouseDown={index === 0 ? handleMouseDown : undefined}
            onMouseMove={index === 0 ? handleMouseMove : undefined}
            onMouseUp={index === 0 ? handleMouseUp : undefined}
            onMouseLeave={index === 0 ? handleMouseUp : undefined}
          >
            <div className="relative w-full h-full">
              {renderCard(candidate)}
              
              {/* Swipe Overlays */}
              {index === 0 && isDragging && (
                <>
                  {/* Like Overlay */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-green-500/20 rounded-lg border-4 border-green-500 flex items-center justify-center transition-opacity",
                      dragOffset.x > 0 ? "opacity-100" : "opacity-0"
                    )}
                    style={{ opacity: dragOffset.x > 0 ? getOverlayOpacity() : 0 }}
                  >
                    <div className="bg-green-500 text-white p-4 rounded-full transform rotate-12">
                      <Check className="w-8 h-8" />
                    </div>
                  </div>
                  
                  {/* Pass Overlay */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-red-500/20 rounded-lg border-4 border-red-500 flex items-center justify-center transition-opacity",
                      dragOffset.x < 0 ? "opacity-100" : "opacity-0"
                    )}
                    style={{ opacity: dragOffset.x < 0 ? getOverlayOpacity() : 0 }}
                  >
                    <div className="bg-red-500 text-white p-4 rounded-full transform -rotate-12">
                      <X className="w-8 h-8" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe('pass')}
          className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-500 hover:bg-red-50 group"
        >
          <X className="w-6 h-6 text-red-500 group-hover:text-red-600" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 rounded-full border-2 border-green-200 hover:border-green-500 hover:bg-green-50 group"
        >
          <Check className="w-6 h-6 text-green-500 group-hover:text-green-600" />
        </Button>
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute -bottom-28 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {candidates.length}
        </span>
        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pulse-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / candidates.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SwipeableCardStack;
