
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, Plus, CheckCircle, X, Brain, Zap, Target, TrendingUp, Star } from "lucide-react";

const InterviewScheduler = ({ onScheduleComplete }) => {
  const [batchSize, setBatchSize] = useState(10);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState("technical");
  const [notes, setNotes] = useState("");
  const [aiOptimization, setAiOptimization] = useState(true);

  // Enhanced candidate pool with AI scoring
  const availableCandidates = [
    { id: "1", name: "Sarah Chen", role: "Senior AI Engineer", score: 94, status: "qualified", aiMatch: 98, probability: 92 },
    { id: "2", name: "Alex Rodriguez", role: "ML Scientist", score: 91, status: "qualified", aiMatch: 95, probability: 88 },
    { id: "3", name: "Maya Patel", role: "AI Product Manager", score: 87, status: "qualified", aiMatch: 91, probability: 85 },
    { id: "4", name: "David Kim", role: "Data Scientist", score: 82, status: "qualified", aiMatch: 87, probability: 78 },
    { id: "5", name: "Lisa Wang", role: "AI Engineer", score: 89, status: "qualified", aiMatch: 93, probability: 82 },
    { id: "6", name: "John Smith", role: "ML Engineer", score: 86, status: "qualified", aiMatch: 89, probability: 79 },
    { id: "7", name: "Emma Brown", role: "AI Researcher", score: 92, status: "qualified", aiMatch: 96, probability: 90 },
    { id: "8", name: "Michael Davis", role: "Data Engineer", score: 84, status: "qualified", aiMatch: 86, probability: 76 },
    { id: "9", name: "Sophia Wilson", role: "AI Architect", score: 90, status: "qualified", aiMatch: 94, probability: 87 },
    { id: "10", name: "James Taylor", role: "ML Specialist", score: 85, status: "qualified", aiMatch: 88, probability: 80 }
  ];

  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const handleCandidateToggle = (candidate) => {
    setSelectedCandidates(prev => {
      const isSelected = prev.find(c => c.id === candidate.id);
      if (isSelected) {
        return prev.filter(c => c.id !== candidate.id);
      } else if (prev.length < batchSize) {
        return [...prev, candidate];
      }
      return prev;
    });
  };

  const handleAIOptimize = () => {
    // AI selects best candidates based on score and probability
    const sortedCandidates = [...availableCandidates]
      .sort((a, b) => (b.aiMatch * b.probability) - (a.aiMatch * a.probability))
      .slice(0, batchSize);
    setSelectedCandidates(sortedCandidates);
  };

  const handleScheduleBatch = () => {
    if (selectedCandidates.length === 0 || !interviewDate || !interviewTime) {
      alert("Please select candidates and set interview date/time");
      return;
    }

    const scheduledInterviews = selectedCandidates.map(candidate => ({
      ...candidate,
      interviewDate,
      interviewTime,
      interviewType,
      notes,
      status: "interview_scheduled",
      stage: "first_interview",
      aiRecommendations: {
        optimalTimeSlot: true,
        interviewerMatch: 95,
        successProbability: candidate.probability
      }
    }));

    onScheduleComplete(scheduledInterviews);
  };

  const avgAiMatch = selectedCandidates.length > 0 
    ? Math.round(selectedCandidates.reduce((sum, c) => sum + c.aiMatch, 0) / selectedCandidates.length)
    : 0;

  const avgProbability = selectedCandidates.length > 0 
    ? Math.round(selectedCandidates.reduce((sum, c) => sum + c.probability, 0) / selectedCandidates.length)
    : 0;

  return (
    <div className="space-y-6">
      <Card className="border-pulse-200 bg-gradient-to-r from-pulse-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Brain className="w-5 h-5 text-pulse-500" />
              <Zap className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            AI-Powered Interview Scheduler
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1">
              Smart Optimization Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Insights Panel */}
          {selectedCandidates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-pulse-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-pulse-500" />
                  <span className="text-sm font-medium">AI Match Score</span>
                </div>
                <p className="text-2xl font-bold text-pulse-600">{avgAiMatch}%</p>
                <p className="text-xs text-gray-500">Perfect role alignment</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{avgProbability}%</p>
                <p className="text-xs text-gray-500">Hiring probability</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Quality Rating</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">A+</p>
                <p className="text-xs text-gray-500">Exceptional batch</p>
              </div>
            </div>
          )}

          {/* Interview Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Batch Size</label>
              <Input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                max="20"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Interview Date</label>
              <Input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Interview Time</label>
              <Input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Interview Type</label>
              <select
                className="w-full p-2 border rounded-md"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
              >
                <option value="technical">Technical Interview</option>
                <option value="behavioral">Behavioral Interview</option>
                <option value="cultural">Cultural Fit</option>
                <option value="final">Final Round</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">AI Optimization</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={aiOptimization}
                  onChange={(e) => setAiOptimization(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Enable AI candidate selection</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Add any special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* AI Optimization Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleAIOptimize}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Auto-Select Best {batchSize}
            </Button>
            <Badge className="bg-pulse-100 text-pulse-700 px-3 py-2">
              {availableCandidates.length} qualified candidates available
            </Badge>
          </div>

          {/* Enhanced Candidate Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Smart Candidate Selection ({selectedCandidates.length}/{batchSize})</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
              {availableCandidates.map((candidate) => {
                const isSelected = selectedCandidates.find(c => c.id === candidate.id);
                return (
                  <div
                    key={candidate.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-pulse-500 bg-gradient-to-r from-pulse-50 to-purple-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleCandidateToggle(candidate)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          {candidate.name}
                          {candidate.aiMatch >= 95 && <Star className="w-4 h-4 text-yellow-500" />}
                        </h4>
                        <p className="text-sm text-gray-600">{candidate.role}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Score: {candidate.score}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            AI: {candidate.aiMatch}%
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Success: {candidate.probability}%
                          </Badge>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-pulse-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleScheduleBatch}
            className="w-full bg-gradient-to-r from-pulse-500 to-purple-600 hover:from-pulse-600 hover:to-purple-700 text-lg py-6"
            disabled={selectedCandidates.length === 0}
          >
            <Zap className="w-5 h-5 mr-2" />
            Launch AI-Optimized Interviews ({selectedCandidates.length})
            <TrendingUp className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewScheduler;
