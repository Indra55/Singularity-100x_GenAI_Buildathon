
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  X, 
  Clock, 
  ArrowRight, 
  User, 
  MessageSquare,
  Award,
  FileText
} from "lucide-react";

const CandidateFlow = ({ scheduledCandidates, onUpdateCandidates }) => {
  const [feedback, setFeedback] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const stages = {
    "first_interview": { 
      label: "First Interview", 
      next: "technical_round",
      color: "bg-blue-100 text-blue-800" 
    },
    "technical_round": { 
      label: "Technical Round", 
      next: "final_interview",
      color: "bg-purple-100 text-purple-800" 
    },
    "final_interview": { 
      label: "Final Interview", 
      next: "offer_stage",
      color: "bg-orange-100 text-orange-800" 
    },
    "offer_stage": { 
      label: "Offer Stage", 
      next: "hired",
      color: "bg-green-100 text-green-800" 
    },
    "hired": { 
      label: "Hired", 
      next: null,
      color: "bg-green-200 text-green-900" 
    },
    "rejected": { 
      label: "Rejected", 
      next: null,
      color: "bg-red-100 text-red-800" 
    }
  };

  const handleAccept = (candidateId) => {
    const candidate = scheduledCandidates.find(c => c.id === candidateId);
    const currentStage = candidate.stage;
    const nextStage = stages[currentStage]?.next;

    if (nextStage) {
      const updatedCandidates = scheduledCandidates.map(c => 
        c.id === candidateId 
          ? { 
              ...c, 
              stage: nextStage,
              status: nextStage === "hired" ? "hired" : "progressed",
              lastUpdate: new Date().toISOString(),
              feedback: feedback[candidateId] || ""
            }
          : c
      );
      onUpdateCandidates(updatedCandidates);
    }
    
    setFeedback(prev => ({ ...prev, [candidateId]: "" }));
  };

  const handleReject = (candidateId) => {
    const updatedCandidates = scheduledCandidates.map(c => 
      c.id === candidateId 
        ? { 
            ...c, 
            stage: "rejected",
            status: "rejected",
            lastUpdate: new Date().toISOString(),
            feedback: feedback[candidateId] || ""
          }
        : c
    );
    onUpdateCandidates(updatedCandidates);
    setFeedback(prev => ({ ...prev, [candidateId]: "" }));
  };

  const handleFeedbackChange = (candidateId, value) => {
    setFeedback(prev => ({ ...prev, [candidateId]: value }));
  };

  const activeCandidates = scheduledCandidates.filter(c => c.stage !== "rejected");
  const rejectedCandidates = scheduledCandidates.filter(c => c.stage === "rejected");

  const getCandidatesByStage = (stage) => {
    return activeCandidates.filter(c => c.stage === stage);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-pulse-500" />
            Candidate Pipeline Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(stages).filter(([key]) => key !== "rejected").map(([key, stage]) => (
              <div key={key} className="text-center">
                <div className={`rounded-lg p-3 ${stage.color}`}>
                  <p className="font-medium text-sm">{stage.label}</p>
                  <p className="text-2xl font-bold mt-1">
                    {getCandidatesByStage(key).length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Active Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCandidates.map((candidate) => (
              <div key={candidate.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={stages[candidate.stage]?.color}>
                          {stages[candidate.stage]?.label}
                        </Badge>
                        <Badge variant="outline">Score: {candidate.score}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {candidate.stage === "hired" ? (
                    <Badge className="bg-green-200 text-green-900 px-4 py-2">
                      <Award className="w-4 h-4 mr-2" />
                      Hired!
                    </Badge>
                  ) : null}
                </div>

                {candidate.stage !== "hired" && (
                  <>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Interview Feedback & Notes
                      </label>
                      <Textarea
                        placeholder={`Add feedback for ${stages[candidate.stage]?.label}...`}
                        value={feedback[candidate.id] || ""}
                        onChange={(e) => handleFeedbackChange(candidate.id, e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleAccept(candidate.id)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {stages[candidate.stage]?.next === "hired" ? "Hire" : "Accept & Continue"}
                        {stages[candidate.stage]?.next && stages[candidate.stage]?.next !== "hired" && (
                          <>
                            <ArrowRight className="w-4 h-4 mx-2" />
                            {stages[stages[candidate.stage]?.next]?.label}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => handleReject(candidate.id)}
                        variant="destructive"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>

                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </>
                )}

                {candidate.interviewDate && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center gap-4">
                      <span><strong>Date:</strong> {candidate.interviewDate}</span>
                      <span><strong>Time:</strong> {candidate.interviewTime}</span>
                      <span><strong>Type:</strong> {candidate.interviewType}</span>
                    </div>
                    {candidate.notes && (
                      <p className="mt-2"><strong>Notes:</strong> {candidate.notes}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rejected Candidates */}
      {rejectedCandidates.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Rejected Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rejectedCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">{candidate.role}</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateFlow;
