
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CandidateSearch = ({ user, onResults, onCandidateSelect, selectedCandidates }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState("cards");
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    skills: []
  });
  const { toast } = useToast();

  // Mock candidate data
  const mockCandidates = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "Senior AI Engineer",
      company: "OpenAI",
      location: "San Francisco, CA",
      experience: "5+ years",
      skills: ["Python", "TensorFlow", "LangChain", "GPT Models"],
      matchScore: 95,
      avatar: "SC",
      summary: "Experienced AI engineer with deep expertise in large language models and natural language processing.",
      availability: "Open to new opportunities"
    },
    {
      id: "2", 
      name: "Alex Rodriguez",
      title: "Machine Learning Research Scientist",
      company: "DeepMind",
      location: "London, UK",
      experience: "7+ years",
      skills: ["PyTorch", "Computer Vision", "Reinforcement Learning", "Research"],
      matchScore: 92,
      avatar: "AR",
      summary: "Research scientist specializing in computer vision and reinforcement learning applications.",
      availability: "Available in 2 weeks"
    },
    {
      id: "3",
      name: "Maya Patel", 
      title: "GenAI Product Manager",
      company: "Anthropic",
      location: "Remote",
      experience: "4+ years",
      skills: ["Product Strategy", "AI Ethics", "LLM Integration", "Team Leadership"],
      matchScore: 88,
      avatar: "MP",
      summary: "Product manager with expertise in generative AI and responsible AI development.",
      availability: "Immediately available"
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with LLM processing
    setTimeout(() => {
      toast({
        title: "Search Complete",
        description: `Found ${mockCandidates.length} candidates matching your criteria.`
      });
      
      onResults(mockCandidates);
      setIsSearching(false);
    }, 2000);
  };

  const suggestedQueries = [
    "Find GenAI engineers in Europe with LangChain experience",
    "Senior ML engineers with computer vision background", 
    "AI product managers with startup experience",
    "Research scientists specializing in NLP"
  ];

  const isSelected = (candidate) => selectedCandidates.some(c => c.id === candidate.id);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pulse-500" />
            AI-Powered Candidate Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Describe your ideal candidate in natural language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-base"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-pulse-500 hover:bg-pulse-600"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Suggested Queries */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-pulse-50"
                  onClick={() => setSearchQuery(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {mockCandidates.length > 0 && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Search Results</h2>
            <p className="text-gray-600">{mockCandidates.length} candidates found</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {mockCandidates.length > 0 && (
        <div className={viewMode === "cards" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {mockCandidates.map((candidate) => (
            <Card 
              key={candidate.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected(candidate) ? 'ring-2 ring-pulse-500 bg-pulse-50' : ''
              }`}
              onClick={() => onCandidateSelect(candidate)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.title}</p>
                      <p className="text-xs text-gray-500">{candidate.company}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {candidate.matchScore}% match
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">{candidate.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📍 {candidate.location}</span>
                    <span>💼 {candidate.experience}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600">🟢 {candidate.availability}</span>
                  <Button size="sm" variant={isSelected(candidate) ? "default" : "outline"}>
                    {isSelected(candidate) ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
