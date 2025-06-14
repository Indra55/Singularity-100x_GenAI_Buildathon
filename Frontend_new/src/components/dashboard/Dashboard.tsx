import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
const CandidateSearch = React.lazy(() => import("@/components/dashboard/CandidateSearch"));
const SwipeableCardStack = React.lazy(() => import("@/components/dashboard/SwipeableCardStack"));
const ResumeParser = React.lazy(() => import("@/components/dashboard/ResumeParser"));
const OutreachCenter = React.lazy(() => import("@/components/dashboard/OutreachCenter"));
const Analytics = React.lazy(() => import("@/components/dashboard/Analytics"));
const AIInterview = React.lazy(() => import("@/components/dashboard/AIInterview"));
const JDMaker = React.lazy(() => import("@/components/dashboard/JDMaker"));

interface DashboardProps {
  user?: any; // Consider defining a proper User type
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

  const renderCandidateCard = useCallback((candidate: Candidate, onViewMore: () => void) => (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {candidate.profile_pic ? (
                <AvatarImage src={candidate.profile_pic} alt={candidate.name} />
              ) : null}
              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{candidate.name}</h3>
              <p className="text-sm text-gray-600">{candidate.title}</p>
              <p className="text-xs text-gray-500">{candidate.company}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-pulse-600 hover:text-pulse-700"
            onClick={(e) => {
              e.stopPropagation();
              onViewMore();
            }}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            <span>View More</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{candidate.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2" />
            <span>{candidate.years_of_experience || '0'} years experience</span>
          </div>
          
          {candidate.summary && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>
              <p className="text-sm text-gray-600 line-clamp-3">{candidate.summary}</p>
            </div>
          )}
          
          {candidate.skills?.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-2">
              {candidate.social_links?.linkedin && (
                <a 
                  href={candidate.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600"
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
                  className="text-gray-500 hover:text-gray-800"
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
                  className="text-gray-500 hover:text-purple-600"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(candidate);
              }}
            >
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ), [onSelect]);

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
      case 'analytics':
        return <Analytics user={user} />;
      default:
        return renderSearchView();
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
