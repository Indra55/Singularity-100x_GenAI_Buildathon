
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  Brain,
  TrendingUp,
  Star,
  User,
  MessageSquare,
  Clock,
  Award,
  Filter,
  Search
} from "lucide-react";

const CandidateScoring = ({ user, stats }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");

  // Mock candidate data with AI scoring
  const candidates = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Senior AI Engineer",
      company: "OpenAI",
      aiScore: 94,
      fitScore: 88,
      engagementScore: 92,
      urgencyScore: 85,
      overallScore: 90,
      avatar: "SC",
      skills: ["Python", "TensorFlow", "LangChain"],
      interactions: 12,
      lastActivity: "2 hours ago",
      likelihood: "Very High",
      source: "LinkedIn",
      status: "interview_scheduled"
    },
    {
      id: "2",
      name: "Alex Rodriguez",
      role: "ML Research Scientist", 
      company: "DeepMind",
      aiScore: 91,
      fitScore: 95,
      engagementScore: 78,
      urgencyScore: 90,
      overallScore: 88,
      avatar: "AR",
      skills: ["PyTorch", "Computer Vision", "Research"],
      interactions: 8,
      lastActivity: "5 hours ago",
      likelihood: "High",
      source: "Referral",
      status: "contacted"
    },
    {
      id: "3",
      name: "Maya Patel",
      role: "AI Product Manager",
      company: "Anthropic", 
      aiScore: 87,
      fitScore: 91,
      engagementScore: 89,
      urgencyScore: 75,
      overallScore: 85,
      avatar: "MP",
      skills: ["Product Strategy", "AI Ethics", "Leadership"],
      interactions: 15,
      lastActivity: "1 day ago",
      likelihood: "High",
      source: "Direct Apply",
      status: "responded"
    },
    {
      id: "4",
      name: "David Kim",
      role: "Data Scientist",
      company: "Meta",
      aiScore: 82,
      fitScore: 79,
      engagementScore: 85,
      urgencyScore: 88,
      overallScore: 83,
      avatar: "DK",
      skills: ["Statistics", "Python", "SQL"],
      interactions: 6,
      lastActivity: "3 hours ago",
      likelihood: "Medium",
      source: "GitHub",
      status: "sourced"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      sourced: { color: "bg-gray-100 text-gray-800", label: "Sourced" },
      contacted: { color: "bg-blue-100 text-blue-800", label: "Contacted" },
      responded: { color: "bg-green-100 text-green-800", label: "Responded" },
      interview_scheduled: { color: "bg-purple-100 text-purple-800", label: "Interview Scheduled" }
    };
    const config = statusConfig[status] || statusConfig.sourced;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = scoreFilter === "all" || 
                        (scoreFilter === "high" && candidate.overallScore >= 85) ||
                        (scoreFilter === "medium" && candidate.overallScore >= 70 && candidate.overallScore < 85) ||
                        (scoreFilter === "low" && candidate.overallScore < 70);
    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Smart Candidate Scoring & Ranking</h2>
        <Badge className="bg-pulse-500 text-white px-4 py-2">
          <Brain className="w-4 h-4 mr-2" />
          AI-Powered
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All Scores" },
            { value: "high", label: "High (85+)" },
            { value: "medium", label: "Medium (70-84)" },
            { value: "low", label: "Low (<70)" }
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={scoreFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setScoreFilter(filter.value)}
              className={scoreFilter === filter.value ? "bg-pulse-500 hover:bg-pulse-600" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Scoring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">High Score Candidates</p>
                <h3 className="text-2xl font-bold mt-1">23</h3>
                <p className="text-xs text-green-600 mt-1">Score 85+</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg AI Score</p>
                <h3 className="text-2xl font-bold mt-1">87.2</h3>
                <p className="text-xs text-green-600 mt-1">+3.5 this week</p>
              </div>
              <Brain className="w-8 h-8 text-pulse-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                <h3 className="text-2xl font-bold mt-1">84%</h3>
                <p className="text-xs text-green-600 mt-1">Above target</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Prediction Accuracy</p>
                <h3 className="text-2xl font-bold mt-1">92%</h3>
                <p className="text-xs text-green-600 mt-1">Model improving</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-pulse-500" />
            AI-Ranked Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.role} at {candidate.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(candidate.status)}
                        <Badge variant="outline">{candidate.source}</Badge>
                        <span className="text-sm text-gray-500">{candidate.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold rounded-lg px-3 py-1 ${getScoreColor(candidate.overallScore)}`}>
                      {candidate.overallScore}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Overall Score</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">AI Fit</p>
                    <p className={`font-semibold ${getScoreColor(candidate.aiScore)}`}>{candidate.aiScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Role Fit</p>
                    <p className={`font-semibold ${getScoreColor(candidate.fitScore)}`}>{candidate.fitScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Engagement</p>
                    <p className={`font-semibold ${getScoreColor(candidate.engagementScore)}`}>{candidate.engagementScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Urgency</p>
                    <p className={`font-semibold ${getScoreColor(candidate.urgencyScore)}`}>{candidate.urgencyScore}</p>
                  </div>
                </div>

                {/* Skills and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Key Skills:</span>
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                    <Button size="sm" className="bg-pulse-500 hover:bg-pulse-600">
                      Take Action
                    </Button>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="mt-4 p-3 bg-pulse-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-pulse-500" />
                    <span className="font-medium text-sm">AI Insights</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Likelihood to accept:</strong> {candidate.likelihood} • 
                    <strong> Best contact time:</strong> Tuesday 10-11 AM • 
                    <strong> Interests:</strong> Remote-first companies, AI research
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateScoring;
