import React, { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Zap, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Candidate } from '@/services/candidateService';
import { CandidateDetailModal } from './CandidateDetailModal';

interface SwipeableCardStackProps {
  candidates: Candidate[];
  onSwipe: (candidateId: string, action: 'like' | 'pass') => void;
  renderCard: (candidate: any, onViewMore: () => void) => React.ReactNode;
  onReset?: () => void;
}

const SwipeableCardStack: React.FC<SwipeableCardStackProps> = ({
  candidates,
  onSwipe,
  renderCard,
  onReset
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const currentCandidate = candidates[currentIndex];
  const nextCandidates = candidates.slice(currentIndex + 1, currentIndex + 4);
  const allCardsSwiped = currentIndex >= candidates.length;

  const handleViewMore = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailModalOpen(true);
  }, []);

  const resetStack = useCallback(() => {
    setCurrentIndex(0);
    setDragOffset({ x: 0, y: 0 });
    if (onReset) onReset();
  }, [onReset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (allCardsSwiped) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || allCardsSwiped) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY * 0.3 }); // Reduced vertical movement
  };

  const handleMouseUp = () => {
    if (!isDragging || allCardsSwiped) return;
    
    setIsDragging(false);
    
    const threshold = 120;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      const action = x > 0 ? 'like' : 'pass';
      handleSwipe(action);
    } else {
      // Smooth snap back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleSwipe = (action: 'like' | 'pass') => {
    if (!currentCandidate || allCardsSwiped) return;
    
    onSwipe(currentCandidate.id, action);
    
    // Animate card out with slight upward movement
    const direction = action === 'like' ? 1200 : -1200;
    const upwardMovement = -50;
    setDragOffset({ x: direction, y: upwardMovement });
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const getCardStyle = (index: number) => {
    if (allCardsSwiped) return {};
    
    const isActive = index === 0;
    const zIndex = 20 - index;
    const scale = 1 - (index * 0.02); // Smaller scale difference for thinner effect
    const translateY = index * 2; // Reduced vertical stacking
    const opacity = index < 4 ? 1 - (index * 0.15) : 0;
    
    if (isActive && isDragging) {
      const rotation = dragOffset.x * 0.08; // Slightly reduced rotation
      const dragScale = 1 + Math.abs(dragOffset.x) * 0.00005; // Subtle scale on drag
      return {
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y + translateY}px) rotate(${rotation}deg) scale(${dragScale})`,
        zIndex,
        opacity,
        transition: 'none',
        position: 'absolute' as const,
        width: '100%',
        height: '480px', // Fixed thinner height
        top: '50%',
        left: '50%',
        marginLeft: '-50%',
        marginTop: '-240px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
        filter: `brightness(${1 + Math.abs(dragOffset.x) * 0.0002})`,
      };
    }
    
    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      zIndex,
      opacity,
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // Improved easing
      position: 'absolute' as const,
      width: '100%',
      height: '480px', // Fixed thinner height
      top: '50%',
      left: '50%',
      marginLeft: '-50%',
      marginTop: '-240px',
      boxShadow: index === 0 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      borderRadius: '16px',
    };
  };

  const getOverlayOpacity = () => {
    const { x } = dragOffset;
    return Math.min(Math.abs(x) / 120, 0.9);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (allCardsSwiped) return;
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || allCardsSwiped) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = (touch.clientY - startPos.current.y) * 0.3;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  if (allCardsSwiped) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-6 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
          <Zap className="w-10 h-10 text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">All done!</h3>
          <p className="text-gray-600 max-w-sm leading-relaxed">
            You've reviewed all available candidates. Great job!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={resetStack}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            Review Again
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-full hover:scale-105 transition-transform"
          >
            New Search
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCandidate) {
    return null;
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] overflow-visible">
      {/* Card Stack */}
      <div className="relative h-full">
        {[currentCandidate, ...nextCandidates].map((candidate, index) => (
          <div
            key={`${candidate.id}-${currentIndex}-${index}`}
            ref={index === 0 ? cardRef : null}
            className={cn(
              "select-none",
              isDragging && index === 0 ? "cursor-grabbing" : "cursor-grab"
            )}
            style={getCardStyle(index)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden">
              {renderCard(candidate, () => handleViewMore(candidate))}
              
              {/* Enhanced Swipe Overlays */}
              {index === 0 && isDragging && (
                <>
                  {/* Like Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-2xl border-3 border-green-400 flex items-center justify-center backdrop-blur-sm"
                    style={{ 
                      opacity: dragOffset.x > 0 ? getOverlayOpacity() : 0,
                      transition: 'opacity 0.1s ease-out'
                    }}
                  >
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl transform rotate-12 scale-110">
                      <Check className="w-8 h-8" strokeWidth={3} />
                    </div>
                  </div>
                  
                  {/* Pass Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-rose-500/30 rounded-2xl border-3 border-red-400 flex items-center justify-center backdrop-blur-sm"
                    style={{ 
                      opacity: dragOffset.x < 0 ? getOverlayOpacity() : 0,
                      transition: 'opacity 0.1s ease-out'
                    }}
                  >
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white p-4 rounded-full shadow-2xl transform -rotate-12 scale-110">
                      <X className="w-8 h-8" strokeWidth={3} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Action Buttons */}
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex gap-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe('pass')}
          className="w-14 h-14 rounded-full border-2 border-red-200 bg-white hover:border-red-400 hover:bg-red-50 group shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          disabled={allCardsSwiped}
        >
          <X className="w-5 h-5 text-red-500 group-hover:text-red-600" strokeWidth={2.5} />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSwipe('like')}
          className="w-14 h-14 rounded-full border-2 border-green-200 bg-white hover:border-green-400 hover:bg-green-50 group shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          disabled={allCardsSwiped}
        >
          <Check className="w-5 h-5 text-green-500 group-hover:text-green-600" strokeWidth={2.5} />
        </Button>
      </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SwipeableCardStack;