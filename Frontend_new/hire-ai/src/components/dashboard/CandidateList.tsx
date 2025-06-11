
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, X, MessageSquare, MapPin, Clock, DollarSign, Star, Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CandidateList = ({ candidates: propCandidates, onCandidateSelect, selectedCandidates }) => {
  const [viewMode, setViewMode] = useState("table");

  // Mock candidates data if no candidates are provided
  const mockCandidates = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "Senior AI Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      experience: "6 years",
      salary: "$180k - $220k",
      skills: ["LangChain", "RAG Systems", "Python", "TensorFlow", "OpenAI APIs"],
      summary: "Experienced AI engineer specializing in RAG systems and LangChain applications.",
      lastActive: "2 hours ago",
      avatar: "SC",
      matchScore: 95,
      status: "Available",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567"
    },
    {
      id: "2", 
      name: "Alex Rodriguez",
      title: "ML Research Scientist",
      company: "DeepMind",
      location: "London, UK",
      experience: "8 years",
      salary: "$200k - $250k",
      skills: ["PyTorch", "Computer Vision", "NLP", "Research", "LLMs"],
      summary: "Research scientist with deep expertise in large language models and computer vision.",
      lastActive: "1 day ago",
      avatar: "AR",
      matchScore: 92,
      status: "Available",
      email: "alex.rodriguez@email.com",
      phone: "+44 20 1234 5678"
    },
    {
      id: "3",
      name: "Maya Patel", 
      title: "GenAI Product Manager",
      company: "Anthropic",
      location: "Remote",
      experience: "5 years",
      salary: "$160k - $200k",
      skills: ["Product Strategy", "AI Ethics", "LLM Integration", "Team Leadership"],
      summary: "Product manager with expertise in generative AI and responsible AI development.",
      lastActive: "30 minutes ago",
      avatar: "MP",
      matchScore: 88,
      status: "Available",
      email: "maya.patel@email.com",
      phone: "+1 (555) 987-6543"
    },
    {
      id: "4",
      name: "David Kim",
      title: "Full Stack Developer",
      company: "Startup Inc.",
      location: "Austin, TX",
      experience: "4 years",
      salary: "$130k - $160k",
      skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
      summary: "Full-stack developer with expertise in modern web technologies and cloud platforms.",
      lastActive: "3 hours ago",
      avatar: "DK",
      matchScore: 82,
      status: "Available",
      email: "david.kim@email.com",
      phone: "+1 (555) 456-7890"
    },
    {
      id: "5",
      name: "Emily Johnson",
      title: "UX Designer",
      company: "Design Co",
      location: "New York, NY",
      experience: "7 years",
      salary: "$120k - $150k",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "AI/UX"],
      summary: "Senior UX designer specializing in AI product experiences and design systems.",
      lastActive: "5 hours ago",
      avatar: "EJ",
      matchScore: 79,
      status: "Available",
      email: "emily.johnson@email.com",
      phone: "+1 (555) 321-0987"
    }
  ];

  const candidates = propCandidates.length > 0 ? propCandidates : mockCandidates;

  const isSelected = (candidate) => selectedCandidates.some(c => c.id === candidate.id);

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for ${selectedCandidates.length} candidates`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'Interviewing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hired':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Candidates ({candidates.length})</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Manage your talent pipeline and candidate interactions</p>
            </div>
            {selectedCandidates.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-pulse-500">
                  {selectedCandidates.length} selected
                </Badge>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                  Bulk Reject
                </Button>
                <Button size="sm" className="bg-pulse-500 hover:bg-pulse-600">
                  Add to Outreach
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Title & Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id} className={isSelected(candidate) ? 'bg-pulse-50' : ''}>
                    <TableCell>
                      <Checkbox 
                        checked={isSelected(candidate)}
                        onCheckedChange={() => onCandidateSelect(candidate)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pulse-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {candidate.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {candidate.experience}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{candidate.title}</div>
                        <div className="text-sm text-gray-500">{candidate.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{candidate.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {candidate.matchScore}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" title="View Details">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Send Message">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Remove">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  isSelected(candidate) ? 'ring-2 ring-pulse-500 bg-pulse-50' : ''
                }`} onClick={() => onCandidateSelect(candidate)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
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
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {candidate.matchScore}%
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{candidate.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-3 h-3" />
                        <span>{candidate.salary}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700">{candidate.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <Badge className={`text-xs ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {candidates.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">Start searching for candidates to see them here.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            Card View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
