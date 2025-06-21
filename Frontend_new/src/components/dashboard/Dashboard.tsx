import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type User } from "@/contexts/AuthContext";
import { Candidate as BaseCandidate } from "@/services/candidateService";
import { recordInteraction } from "@/services/candidateInteractionsService";
import { storeGeneratedCandidate, getUserGeneratedCandidates, GeneratedCandidate } from "@/services/generatedCandidatesService";

// Extend the Candidate interface to include the profile_pic property
interface Candidate extends BaseCandidate {
  profile_pic?: string;
}
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, ExternalLink, Linkedin, Github, FileText } from "lucide-react";

// Import components with dynamic imports for better performance
const Navbar = React.lazy(() => import("@/components/dashboard/DashboardNavbar"));
const Sidebar = React.lazy(() => import("@/components/dashboard/Sidebar"));
const ChatInterface = React.lazy(() => import("@/components/dashboard/ChatInterface"));
const CandidateList = React.lazy(() => import("@/components/dashboard/CandidateList").then(module => ({
  default: module.CandidateList as React.ComponentType<{
    candidates: Candidate[];
    onSelect: (candidate: Candidate) => void;
    selectedCandidates: Candidate[];
    viewMode: 'list' | 'grid';
  }>
})));

// Main components
const PipelineIntelligence = React.lazy(() => import("@/components/dashboard/PipelineIntelligence"));
const AIInterviewerTraining = React.lazy(() => import("@/components/dashboard/AIInterviewerTraining"));
const CandidateSearch = React.lazy(() => import("@/components/dashboard/CandidateSearch"));
const SwipeableCardStack = React.lazy(() => import("@/components/dashboard/SwipeableCardStack"));
const ResumeParser = React.lazy(() => import("@/components/dashboard/ResumeParser"));
const OutreachCenter = React.lazy(() => import("@/components/dashboard/OutreachCenter"));
const Analytics = React.lazy(() => import("@/components/dashboard/Analytics"));
const AIInterview = React.lazy(() => import("@/components/dashboard/AIInterview"));
const JDMaker = React.lazy(() => import("@/components/dashboard/JDMaker"));
const AITraining = React.lazy(() => import("@/components/dashboard/training/EnhancedTrainingModule"));

interface DashboardProps {
  user?: User;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('search');
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [generatedCandidates, setGeneratedCandidates] = useState<GeneratedCandidate[]>([]);
  const [viewMode, setViewMode] = useState<'search' | 'swipe'>('search');
  
  // Fetch generated candidates on component mount
  useEffect(() => {
    const fetchGeneratedCandidates = async () => {
      if (user?.id) {
        try {
          const candidates = await getUserGeneratedCandidates(user.id);
          setGeneratedCandidates(candidates);
        } catch (error) {
          console.error('Error fetching generated candidates:', error);
        }
      }
    };

    fetchGeneratedCandidates();
  }, [user?.id]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
      </div>
    );
  }

  const handleCandidateSelect = useCallback(async (candidate: Candidate) => {
    try {
      // Store the candidate in generated_candidates table
      if (user?.id) {
        await storeGeneratedCandidate(
          user.id,
          candidate,
          'AI_GENERATED'
        );
      }
      
      setSelectedCandidates(prev => {
        const isSelected = prev.some(c => c.id === candidate.id);
        if (isSelected) {
          return prev.filter(c => c.id !== candidate.id);
        } else {
          return [...prev, candidate];
        }
      });
    } catch (error) {
      console.error('Error storing candidate:', error);
    }
  }, [user?.id]);

  const handleSearchResults = useCallback((results: Candidate[]) => {
    setCandidates(results);
  }, []);

  const handleSwipe = useCallback(async (candidateId: string, action: 'like' | 'pass') => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Record the interaction first
      await recordInteraction(
        user.id,
        candidateId,
        action === 'like' ? 'SWIPE_RIGHT' : 'SWIPE_LEFT'
      );

      // If it's a like, store the candidate and update selected candidates
      if (action === 'like') {
        const candidate = candidates.find(c => c.id === candidateId);
        if (candidate) {
          // Store the candidate in generated_candidates table
          const storedCandidate = await storeGeneratedCandidate(
            user.id,
            candidate,
            'AI_GENERATED'
          );
          
          // Update the generated candidates list
          setGeneratedCandidates(prev => [...prev, storedCandidate]);
          
          // Update selected candidates
          setSelectedCandidates(prev => {
            const isSelected = prev.some(c => c.id === candidate.id);
            if (isSelected) {
              return prev.filter(c => c.id !== candidate.id);
            } else {
              return [...prev, candidate];
            }
          });
        }
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
      // You might want to show a toast notification here
    }
  }, [candidates, user?.id]);

  const onSelect = useCallback((candidate: Candidate) => {
    handleCandidateSelect(candidate);
  }, [handleCandidateSelect]);

  const renderCandidateCard = useCallback((candidate: Candidate, onViewMore: () => void) => {
    // Function to get a consistent random human photo based on candidate ID
    const getRandomHumanPhoto = (id: string) => {
      const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return `https://picsum.photos/seed/${seed}/200/200`;
    };
  
    // Get vibrant colors based on candidate name
    const getVibrantColors = (name: string) => {
      const colorSets = [
        { bg: 'bg-yellow-400', border: 'border-yellow-500', accent: 'bg-blue-600' },
        { bg: 'bg-pink-400', border: 'border-pink-500', accent: 'bg-green-600' },
        { bg: 'bg-orange-600', border: 'border-orange-600', accent: 'bg-red-600', customBg: '#ea580c' },
        { bg: 'bg-lime-400', border: 'border-lime-500', accent: 'bg-purple-600' },
        { bg: 'bg-orange-600', border: 'border-orange-600', accent: 'bg-indigo-600', customBg: '#ea580c' },
        { bg: 'bg-emerald-400', border: 'border-emerald-500', accent: 'bg-rose-600' }
      ];
      const index = name.length % colorSets.length;
      return colorSets[index];
    };
  
    const colors = getVibrantColors(candidate.name);
  
    return (
      <div className="group relative w-full h-full">
        {/* Main card with brutalist styling */}
        <div 
          className={`relative w-full h-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 font-mono`}
          style={{ backgroundColor: colors.customBg || '' }}
        >
          
          {/* Top section with avatar */}
          <div className="relative p-6 pb-4">
            {/* Avatar container */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className={`w-24 h-24 ${colors.accent} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden`}>
                  <Avatar className="w-full h-full rounded-none border-0">
                    <AvatarImage 
                      src={candidate.profile_pic} 
                      alt={candidate.name} 
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className={`${colors.accent} rounded-none text-white text-2xl font-bold`}>
                      <img 
                        src={getRandomHumanPhoto(candidate.id)} 
                        alt={candidate.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://i.pravatar.cc/150?u=${candidate.id}`;
                          target.style.display = 'none';
                          target.parentElement.innerHTML = '😊';
                        }}
                      />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
  
            {/* Name and title */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-black uppercase tracking-wide">
                {candidate.name}
              </h3>
              <p className="text-sm font-bold text-black uppercase tracking-wider">
                {candidate.title}
              </p>
              {candidate.company && (
                <p className="text-xs font-bold text-black/80 uppercase">
                  {candidate.company}
                </p>
              )}
            </div>
          </div>
  
          {/* White section */}
          <div className="bg-white border-t-4 border-black mx-0 min-h-[120px] flex flex-col">
            
            {/* Info grid */}
            <div className="p-4 flex-1">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 border-2 border-black bg-gray-100">
                  <MapPin className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-bold uppercase truncate">
                    {candidate.location || 'Remote'}
                  </p>
                </div>
                <div className="text-center p-2 border-2 border-black bg-gray-100">
                  <Briefcase className="w-4 h-4 mx-auto mb-1" />
                  <p className="text-xs font-bold uppercase">
                    {candidate.years_of_experience || '0'}Y EXP
                  </p>
                </div>
              </div>
  
              {/* Summary box */}
              {candidate.summary && (
                <div className="border-2 border-black border-dashed p-3 mb-4 bg-gray-50">
                  <p className="text-xs leading-relaxed text-center font-medium line-clamp-3">
                    {candidate.summary}
                  </p>
                </div>
              )}
  
              {/* Skills as tags */}
              {candidate.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {candidate.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-bold bg-black text-white uppercase tracking-wide"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.skills.length > 4 && (
                    <span className="px-2 py-1 text-xs font-bold border-2 border-black bg-white uppercase">
                      +{candidate.skills.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
  
            {/* Bottom section */}
            <div className="p-4 pt-2 border-t-2 border-black bg-gray-50">
              <div className="flex justify-between items-center">
                {/* Social links */}
                <div className="flex space-x-2">
                  {candidate.social_links?.linkedin && (
                    <a 
                      href={candidate.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
                      onClick={e => e.stopPropagation()}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {candidate.social_links?.github && (
                    <a 
                      href={candidate.social_links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
                      onClick={e => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {candidate.social_links?.portfolio && (
                    <a 
                      href={candidate.social_links.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
  
                {/* View profile button */}
                <Button
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 uppercase text-xs tracking-wide"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMore();
                  }}
                >
                  View Profile
                </Button>
              </div>
  
              {/* Select button */}
              <Button
                className="w-full mt-3 bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 border-0 shadow-none uppercase text-sm tracking-wider transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(candidate);
                }}
              >
                SELECT CANDIDATE
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [onSelect]);

  const renderSearchView = () => (
    <div className="space-y-6">
      <CandidateSearch 
        onResults={handleSearchResults}
        onCandidateSelect={handleCandidateSelect}
        selectedCandidates={selectedCandidates}
      />
      
      {candidates.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'search' | 'swipe')}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="search">List View</TabsTrigger>
                <TabsTrigger value="swipe">Swipe View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {viewMode === 'search' ? (
            <CandidateList 
              candidates={candidates}
              onSelect={handleCandidateSelect}
              selectedCandidates={selectedCandidates}
              viewMode="grid"
            />
          ) : (
            <SwipeableCardStack
              candidates={candidates}
              onSwipe={handleSwipe}
              renderCard={renderCandidateCard}
            />
          )}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return renderSearchView();
      case 'candidates':
        return (
          <CandidateList 
            candidates={candidates}
            onSelect={handleCandidateSelect}
            selectedCandidates={selectedCandidates}
            viewMode="list"
          />
        );
      case 'parser':
        return <ResumeParser user={user} />;
      case 'jd':
        return <JDMaker user={user} />;
      case 'interview':
        return <AIInterview user={user} />;
      case 'outreach':
        return (
          <OutreachCenter 
            selectedCandidates={selectedCandidates}
            onCandidateRemove={(id: string) => setSelectedCandidates(prev => prev.filter(c => c.id !== id))}
            userId={user?.id}
          />
        );
      case 'pipeline':
        return (
          <Suspense fallback={<div>Loading pipeline intelligence...</div>}>
            <PipelineIntelligence user={user} />
          </Suspense>
        );
      case 'training':
        return (
          <Suspense fallback={<div>Loading AI Interviewer Training...</div>}>
            <AIInterviewerTraining user={user} />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<div>Loading Analytics...</div>}>
            <Analytics user={user} />
          </Suspense>
        );
      // ...
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} selectedCount={selectedCandidates.length} />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Wrap with Suspense for code splitting
export default function DashboardWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
      </div>
    }>
      <Dashboard />
    </Suspense>
  );
}
