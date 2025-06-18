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

  const getRandomHumanPhoto = (id: string) => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/200/200`;
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {candidates.map((candidate) => {
          const avatarSrc = candidate.photo || getRandomHumanPhoto(candidate.id);
          
          return (
            <div 
              key={candidate.id} 
              className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              onClick={() => onSelect(candidate)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 border-2 border-black bg-[#f97316] overflow-hidden">
                      <img 
                        src={avatarSrc}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = getRandomHumanPhoto(candidate.id);
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black mb-1">{candidate.name}</h3>
                      <p className="text-gray-700 font-medium">{candidate.title}</p>
                      <p className="text-sm text-gray-600">{candidate.company}</p>
                    </div>
                  </div>
                  <button 
                    className="bg-[#f97316] text-white px-4 py-2 border-2 border-black font-medium hover:bg-[#ea580c] transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewMore(candidate);
                    }}
                  >
                    View More
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{candidate.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm">{formatExperience(candidate.years_of_experience)}</span>
                  </div>
                </div>
                
                {candidate.summary && (
                  <div className="border-2 border-black border-dashed bg-gray-50 p-4 mb-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {candidate.summary.length > 150 ? `${candidate.summary.substring(0, 150)}...` : candidate.summary}
                    </p>
                  </div>
                )}
                
                {candidate.skills?.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 6).map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-white border border-black px-2 py-1 text-xs font-medium text-black"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 6 && (
                        <span className="bg-gray-100 border border-black px-2 py-1 text-xs font-medium text-black">
                          +{candidate.skills.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {candidate.social_links?.linkedin && (
                      <a 
                        href={candidate.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 border border-black bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
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
                        className="w-8 h-8 border border-black bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-colors duration-200"
                        onClick={e => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <button
                    className={`px-4 py-2 border-2 border-black font-medium transition-colors duration-200 ${
                      isSelected(candidate) 
                        ? 'bg-white text-black hover:bg-gray-100' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(candidate);
                    }}
                  >
                    {isSelected(candidate) ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
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
      {candidates.map((candidate) => {
        const avatarSrc = candidate.photo || getRandomHumanPhoto(candidate.id);
        
        return (
          <div 
            key={candidate.id} 
            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            {/* Header with orange background */}
            <div className="bg-[#f97316] p-4 relative">
              <button 
                className="absolute top-3 right-3 bg-white text-black px-2 py-1 border border-black text-xs font-medium hover:bg-gray-100 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewMore(candidate);
                }}
              >
                View More
              </button>
              
              {/* Avatar */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-20 border-2 border-black bg-white overflow-hidden">
                  <img 
                    src={avatarSrc}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getRandomHumanPhoto(candidate.id);
                    }}
                  />
                </div>
              </div>
              
              {/* Name and title */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">{candidate.name}</h3>
                <p className="text-white/90 text-sm font-medium">{candidate.title}</p>
                <p className="text-white/80 text-xs">{candidate.company}</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{candidate.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatExperience(candidate.years_of_experience)}</span>
                </div>
                
                {candidate.summary && (
                  <div className="border border-black border-dashed bg-gray-50 p-3">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {candidate.summary.length > 80 ? `${candidate.summary.substring(0, 80)}...` : candidate.summary}
                    </p>
                  </div>
                )}
                
                {candidate.skills?.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-white border border-black px-2 py-1 text-xs font-medium text-black"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 4 && (
                        <span className="bg-gray-100 border border-black px-2 py-1 text-xs font-medium text-black">
                          +{candidate.skills.length - 4}
                        </span>
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
                        className="w-7 h-7 border border-black bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                        onClick={e => e.stopPropagation()}
                      >
                        <Linkedin className="w-3 h-3" />
                      </a>
                    )}
                    {candidate.social_links?.github && (
                      <a 
                        href={candidate.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 border border-black bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-colors duration-200"
                        onClick={e => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  
                  <button
                    className={`px-3 py-1 border-2 border-black text-sm font-medium transition-colors duration-200 ${
                      isSelected(candidate) 
                        ? 'bg-white text-black hover:bg-gray-100' 
                        : 'bg-[#f97316] text-white hover:bg-[#ea580c]'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(candidate);
                    }}
                  >
                    {isSelected(candidate) ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}