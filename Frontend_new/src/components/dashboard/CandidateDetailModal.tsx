import { X, Mail, Briefcase, MapPin, UserCheck, Calendar as CalendarIcon, ExternalLink, FileText, Linkedin, Github } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Candidate } from '@/services/candidateService';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDetailModal({ candidate, isOpen, onClose }: CandidateDetailModalProps) {
  if (!candidate) return null;

  const renderSocialLinks = () => {
    if (!candidate.social_links) return null;
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Connect</h4>
        <div className="flex flex-wrap gap-2">
          {candidate.social_links.linkedin && (
            <a 
              href={candidate.social_links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
              onClick={e => e.stopPropagation()}
            >
              <Linkedin className="w-3 h-3 mr-1" /> LinkedIn
            </a>
          )}
          {candidate.social_links.github && (
            <a 
              href={candidate.social_links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <Github className="w-3 h-3 mr-1" /> GitHub
            </a>
          )}
          {candidate.social_links.portfolio && (
            <a 
              href={candidate.social_links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3 mr-1" /> Portfolio
            </a>
          )}
          {candidate.resume_url && (
            <a 
              href={candidate.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 text-sm bg-green-50 text-green-600 rounded-full hover:bg-green-100"
              onClick={e => e.stopPropagation()}
            >
              <FileText className="w-3 h-3 mr-1" /> Resume
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
          <DialogDescription>
            {candidate.title} {candidate.company && `at ${candidate.company}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {candidate.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {candidate.location}
              </div>
            )}
            {candidate.work_preference && (
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 mr-1" />
                {candidate.work_preference}
              </div>
            )}
            {candidate.available_from && (
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Available from {new Date(candidate.available_from).toLocaleDateString()}
              </div>
            )}
            {candidate.years_of_experience > 0 && (
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {candidate.years_of_experience} years experience
              </div>
            )}
          </div>

          {candidate.summary && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">About</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">{candidate.summary}</p>
            </div>
          )}
          
          {candidate.skills?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {renderSocialLinks()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
