
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  Video, 
  User, 
  Brain, 
  Heart,
  Zap,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Timer,
  Target
} from "lucide-react";

interface CandidateProfile {
  name: string;
  type: 'nervous' | 'overconfident' | 'hostile' | 'perfect' | 'unprepared';
  traits: string[];
  responses: string[];
  stressLevel: number;
  engagement: number;
}

interface InteractiveSimulatorProps {
  onComplete: (score: number, insights: string[]) => void;
  onBack: () => void;
}

const InteractiveSimulator = ({ onComplete, onBack }: InteractiveSimulatorProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'setup' | 'interview' | 'feedback'>('setup');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const candidateProfiles: CandidateProfile[] = [
    {
      name: "Alex Chen - Nervous Graduate",
      type: 'nervous',
      traits: ['Fidgeting', 'Soft voice', 'Avoiding eye contact', 'Over-apologizing'],
      responses: [
        "Um, I think I can handle that... maybe?",
        "Sorry, could you repeat the question?",
        "I'm not sure if I'm qualified enough..."
      ],
      stressLevel: 85,
      engagement: 40
    },
    {
      name: "Jordan Blake - Overconfident Senior",
      type: 'overconfident',
      traits: ['Interrupting', 'Dismissive', 'Name-dropping', 'Questioning your expertise'],
      responses: [
        "I've already done that at my previous company, but better.",
        "That's basic stuff. What's the real challenge here?",
        "I could probably teach you a few things about this..."
      ],
      stressLevel: 20,
      engagement: 90
    },
    {
      name: "Sam Rodriguez - Hostile Candidate",
      type: 'hostile',
      traits: ['Defensive', 'Argumentative', 'Challenging questions', 'Passive-aggressive'],
      responses: [
        "Why would you even ask me that?",
        "This interview process seems pretty flawed to me.",
        "I don't see how that's relevant to the job."
      ],
      stressLevel: 70,
      engagement: 60
    },
    {
      name: "Taylor Kim - Perfect Candidate",
      type: 'perfect',
      traits: ['Well-prepared', 'Articulate', 'Confident', 'Engaging'],
      responses: [
        "That's a great question. In my experience...",
        "I'd approach that by first analyzing...",
        "I'm excited about the opportunity to contribute..."
      ],
      stressLevel: 30,
      engagement: 95
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && currentPhase === 'interview') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setInterviewProgress(prev => Math.min(prev + 0.5, 100));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, currentPhase]);

  const startInterview = () => {
    if (!selectedCandidate) return;
    setCurrentPhase('interview');
    setIsActive(true);
    setTimeElapsed(0);
    setInterviewProgress(0);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const endInterview = () => {
    setIsActive(false);
    setCurrentPhase('feedback');
    
    // Generate AI insights and score
    const mockInsights = [
      "Good use of open-ended questions to assess communication skills",
      "Could have probed deeper into technical competencies",
      "Maintained professional demeanor throughout the session",
      "Effectively managed time constraints"
    ];
    
    const mockScore = 75 + Math.random() * 20; // 75-95% range
    setInsights(mockInsights);
    setScore(mockScore);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCandidateTypeColor = (type: string) => {
    switch (type) {
      case 'nervous': return 'bg-blue-100 text-blue-800';
      case 'overconfident': return 'bg-orange-100 text-orange-800';
      case 'hostile': return 'bg-red-100 text-red-800';
      case 'perfect': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (currentPhase === 'feedback') {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Training
        </Button>

        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-green-600" />
              Interview Simulation Complete
            </CardTitle>
            <CardDescription>
              Analyzed your performance with {selectedCandidate?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{Math.round(score)}%</div>
                <div className="text-sm text-green-700">Overall Score</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-blue-700">Duration</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">{insights.length}</div>
                <div className="text-sm text-purple-700">Insights</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600">A-</div>
                <div className="text-sm text-orange-700">Grade</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-pulse-600" />
                AI-Generated Insights
              </h3>
              <div className="grid gap-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setCurrentPhase('setup')} variant="outline">
                Try Another Candidate
              </Button>
              <Button onClick={() => onComplete(score, insights)} className="bg-pulse-500 hover:bg-pulse-600">
                Complete Training
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentPhase === 'interview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            ← Back to Training
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <Button onClick={endInterview} variant="outline">
              End Interview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pulse-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-pulse-600" />
                    Live Interview Simulation
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      onClick={toggleRecording}
                      className={isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-pulse-500 hover:bg-pulse-600'}
                    >
                      <Mic className="w-4 h-4 mr-1" />
                      {isRecording ? 'Stop' : 'Record'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pulse-500/20 via-purple-500/20 to-blue-500/20" />
                  <div className="relative text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-xl font-semibold text-gray-700">{selectedCandidate?.name}</div>
                    <div className="text-sm text-gray-500 mt-2">
                      {isRecording && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          Recording in progress...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Interview Progress</span>
                    <span className="text-sm text-gray-600">{Math.round(interviewProgress)}%</span>
                  </div>
                  <Progress value={interviewProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Response Area */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-pulse-600" />
                    <span className="font-medium">Latest Response:</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic">
                      "{selectedCandidate?.responses[Math.floor(Math.random() * selectedCandidate.responses.length)]}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Candidate Info Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Candidate Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className={getCandidateTypeColor(selectedCandidate?.type || '')}>
                    {selectedCandidate?.type.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">Stress Level</div>
                    <Progress value={selectedCandidate?.stressLevel} className="h-2" />
                    <div className="text-xs text-gray-600 mt-1">{selectedCandidate?.stressLevel}%</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Engagement</div>
                    <Progress value={selectedCandidate?.engagement} className="h-2" />
                    <div className="text-xs text-gray-600 mt-1">{selectedCandidate?.engagement}%</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Observable Traits</div>
                  <div className="space-y-1">
                    {selectedCandidate?.traits.map((trait, index) => (
                      <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Ask follow-up questions to assess deeper</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <span>Notice the candidate's stress level</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>Maintain empathetic approach</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        ← Back to Training
      </Button>

      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-pulse-50 to-purple-50">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Video className="w-7 h-7 text-pulse-600" />
            Interactive Interview Simulator
          </CardTitle>
          <CardDescription>
            Practice with AI-powered candidate personas in realistic interview scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose a Candidate Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidateProfiles.map((candidate, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedCandidate?.name === candidate.name 
                        ? 'ring-2 ring-pulse-500 bg-pulse-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <Badge className={getCandidateTypeColor(candidate.type)}>
                            {candidate.type}
                          </Badge>
                        </div>
                        {selectedCandidate?.name === candidate.name && (
                          <CheckCircle className="w-5 h-5 text-pulse-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>Stress: {candidate.stressLevel}%</div>
                          <div>Engagement: {candidate.engagement}%</div>
                        </div>
                        <div className="text-xs">
                          Traits: {candidate.traits.slice(0, 2).join(', ')}
                          {candidate.traits.length > 2 && '...'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedCandidate && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Ready to Start!</h4>
                <p className="text-green-700 text-sm mb-4">
                  You'll be conducting a live interview simulation with {selectedCandidate.name}. 
                  The AI will respond in character, and you'll receive real-time feedback on your interviewing technique.
                </p>
                <Button onClick={startInterview} className="bg-pulse-500 hover:bg-pulse-600">
                  <Play className="w-4 h-4 mr-2" />
                  Start Interview Simulation
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveSimulator;
