
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Video, Brain, Plus, Clock, CheckCircle } from "lucide-react";
import InterviewSession from "./InterviewSession";
import InterviewResults from "./InterviewResults";

const AIInterview = ({ user }) => {
  const [activeTab, setActiveTab] = useState('setup'); // setup, session, results
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [jobPosition, setJobPosition] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [customQuestions, setCustomQuestions] = useState([]);
  const [interviewData, setInterviewData] = useState(null);

  // Mock candidates data
  const mockCandidates = [
    { id: 1, name: "John Doe", email: "john.doe@email.com", position: "Senior Software Engineer", experience: "5 years" },
    { id: 2, name: "Sarah Wilson", email: "sarah.wilson@email.com", position: "Frontend Developer", experience: "3 years" },
    { id: 3, name: "Michael Brown", email: "michael.brown@email.com", position: "Full Stack Developer", experience: "4 years" },
    { id: 4, name: "Emily Davis", email: "emily.davis@email.com", position: "UI/UX Designer", experience: "6 years" },
  ];

  const interviewTypes = [
    "Technical Interview",
    "Behavioral Interview", 
    "System Design Interview",
    "Cultural Fit Interview",
    "Leadership Interview"
  ];

  const handleStartInterview = () => {
    if (!selectedCandidate || !jobPosition || !interviewType) {
      return;
    }
    
    setInterviewData({
      candidate: selectedCandidate,
      jobPosition,
      interviewType,
      customQuestions,
      startTime: new Date()
    });
    setActiveTab('session');
  };

  const handleInterviewComplete = (results) => {
    setInterviewData(prev => ({ ...prev, ...results, endTime: new Date() }));
    setActiveTab('results');
  };

  const handleNewInterview = () => {
    setActiveTab('setup');
    setSelectedCandidate(null);
    setJobPosition("");
    setInterviewType("");
    setCustomQuestions([]);
    setInterviewData(null);
  };

  if (activeTab === 'session' && interviewData) {
    return (
      <InterviewSession 
        interviewData={interviewData}
        onComplete={handleInterviewComplete}
        onBack={() => setActiveTab('setup')}
      />
    );
  }

  if (activeTab === 'results' && interviewData) {
    return (
      <InterviewResults 
        interviewData={interviewData}
        onNewInterview={handleNewInterview}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Interview System</h2>
          <p className="text-gray-600">Set up and conduct AI-powered interviews with candidates</p>
        </div>
        <Badge className="bg-pulse-500 text-white">
          <Brain className="w-4 h-4 mr-2" />
          AI Powered
        </Badge>
      </div>

      {/* Interview Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Interview Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Candidate Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Candidate</label>
            <Select value={selectedCandidate?.id.toString()} onValueChange={(value) => {
              const candidate = mockCandidates.find(c => c.id.toString() === value);
              setSelectedCandidate(candidate);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a candidate for the interview" />
              </SelectTrigger>
              <SelectContent>
                {mockCandidates.map((candidate) => (
                  <SelectItem key={candidate.id} value={candidate.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{candidate.name}</span>
                      <span className="text-sm text-gray-500">{candidate.position} • {candidate.experience}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Position */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Position</label>
            <Input
              placeholder="e.g., Senior React Developer"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
            />
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Interview Type</label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger>
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                {interviewTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Candidate Preview */}
          {selectedCandidate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Selected Candidate</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {selectedCandidate.name}</p>
                <p><span className="font-medium">Email:</span> {selectedCandidate.email}</p>
                <p><span className="font-medium">Current Position:</span> {selectedCandidate.position}</p>
                <p><span className="font-medium">Experience:</span> {selectedCandidate.experience}</p>
              </div>
            </div>
          )}

          {/* Start Interview Button */}
          <div className="pt-4">
            <Button 
              onClick={handleStartInterview}
              disabled={!selectedCandidate || !jobPosition || !interviewType}
              className="bg-pulse-500 hover:bg-pulse-600 w-full"
              size="lg"
            >
              <Video className="w-4 h-4 mr-2" />
              Start AI Interview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interview Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-pulse-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-pulse-600" />
              </div>
              <h4 className="font-medium mb-2">1. Setup</h4>
              <p className="text-sm text-gray-600">Select candidate and configure interview parameters</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pulse-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-pulse-600" />
              </div>
              <h4 className="font-medium mb-2">2. Interview</h4>
              <p className="text-sm text-gray-600">AI asks questions, candidate responds via video</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pulse-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-pulse-600" />
              </div>
              <h4 className="font-medium mb-2">3. Analysis</h4>
              <p className="text-sm text-gray-600">AI analyzes responses and provides detailed feedback</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInterview;
