import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Briefcase, Linkedin, Github, Mail } from "lucide-react";
import { Candidate } from "@/services/candidateService";
import { CandidateDetailModal } from './CandidateDetailModal';

interface CandidateListProps {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
  selectedCandidates: Candidate[];
  viewMode?: 'grid' | 'list';
}

export function CandidateList({ 
  candidates, 
  onSelect, 
  selectedCandidates, 
  viewMode = 'grid' 
}: CandidateListProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewMore = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const isSelected = (candidate: Candidate) => 
    selectedCandidates.some(c => c.id === candidate.id);

  const formatExperience = (years?: number) => {
    if (!years) return 'No experience';
    return years === 1 ? '1 year' : `${years} years`;
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate.profile_pic} alt={candidate.name} />
                    <AvatarFallback>
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
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
                    handleViewMore(candidate);
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  <span>View More</span>
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{candidate.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>{formatExperience(candidate.years_of_experience)}</span>
                </div>
                
                {candidate.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
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
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
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
                </div>
                <Button
                  variant={isSelected(candidate) ? "outline" : "default"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(candidate);
                  }}
                >
                  {isSelected(candidate) ? 'Selected' : 'Select'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={candidate.profile_pic} alt={candidate.name} />
                  <AvatarFallback>
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{candidate.name}</CardTitle>
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
                  handleViewMore(candidate);
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                <span>View More</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{candidate.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{formatExperience(candidate.years_of_experience)}</span>
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
                </div>
                <Button
                  variant={isSelected(candidate) ? "outline" : "default"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(candidate);
                  }}
                >
                  {isSelected(candidate) ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
