import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchCandidates, Candidate, SearchFilters } from "@/services/candidateService";
import { storeGeneratedCandidate } from "@/services/generatedCandidatesService";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  onResults: (results: Candidate[]) => void;
  onCandidateSelect: (candidate: Candidate) => void;
  selectedCandidates: Candidate[];
}

const CandidateSearch: React.FC<Props> = ({ onResults, onCandidateSelect, selectedCandidates }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    min_experience: undefined,
    max_experience: undefined,
    skills: []
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const results = await searchCandidates(searchQuery, filters, 10);
      
      toast({
        title: "Search Complete",
        description: `Found ${results.length} candidates matching your criteria.`
      });
      
      onResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to fetch candidates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCandidateSelect = async (candidate: Candidate) => {
    try {
      // Store the candidate in generated_candidates table
      if (user?.id) {
        await storeGeneratedCandidate(
          user.id,
          candidate,
          'AI_GENERATED'
        );
      }
      
      // Call the parent's onCandidateSelect
      onCandidateSelect(candidate);
      
      toast({
        title: "Candidate Selected",
        description: `${candidate.name} has been added to your selected candidates.`
      });
    } catch (error) {
      console.error("Error storing candidate:", error);
      toast({
        title: "Error",
        description: "Failed to store candidate. Please try again.",
        variant: "destructive"
      });
    }
  };

  const suggestedQueries = [
    "Find GenAI engineers in Europe with LangChain experience",
    "Senior ML engineers with computer vision background", 
    "AI product managers with startup experience",
    "Research scientists specializing in NLP"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pulse-500" />
            AI-Powered Candidate Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Describe your ideal candidate in natural language..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  setSearchQuery(query);
                  setTimeout(() => handleSearch(), 100);
                }}
              >
                {query}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateSearch;
