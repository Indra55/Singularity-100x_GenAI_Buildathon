import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { evaluateQuestion, generateReport, CoachPersonality, DifficultyLevel, FocusArea } from "@/services/interviewService";
import { v4 as uuidv4 } from 'uuid';
import styles from './EnhancedAICoach.module.css';
import { 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  Target, 
  TrendingUp, 
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Zap,
  Eye,
  MessageCircle,
  Users,
  FileText,
  Shield,
  Volume2,
  VolumeX,
  Settings,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  BookOpen,
  Sparkles,
  Cpu,
  HeadphonesIcon,
  Camera,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: {
    score?: number;
    strengths?: string[];
    improvements?: string[];
    suggestions?: string[];
  };
  type?: 'coaching' | 'suggestion' | 'question' | 'feedback' | 'tip' | 'scenario' | 'analysis';
  score?: number;
  sentiment?: 'positive' | 'neutral' | 'constructive';
  tags?: string[];
  aiPersonality?: 'mentor' | 'expert' | 'supportive' | 'challenging';
}

interface CoachingInsight {
  type: 'strength' | 'improvement' | 'warning' | 'tip';
  title: string;
  description: string;
  actionable: string;
  priority: 'high' | 'medium' | 'low';
}

interface EnhancedAICoachProps {
  scenario?: any;
  onComplete?: (data: any) => void;
  userProgress?: any;
  currentModule?: string;
}

const EnhancedAICoach = ({ scenario, onComplete, userProgress, currentModule }: EnhancedAICoachProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🎯 Welcome to your AI Interview Coach! I'm here to help you practice and improve your interviewing skills.\n\n## How This Works\n- I'll help you practice common interview scenarios\n- You can type your responses to my questions\n- I'll provide feedback on your answers\n- Use the controls to adjust difficulty and focus areas\n\n## Let's Get Started!\n\nI'll be playing the role of a candidate. You can start by asking me interview questions or describing a scenario you'd like to practice. What would you like to work on today?",
      isUser: false,
      timestamp: new Date(),
      type: 'coaching',
      aiPersonality: 'mentor',
      tags: ['welcome', 'instructions']
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [coachPersonality, setCoachPersonality] = useState<'mentor' | 'expert' | 'supportive' | 'challenging'>('mentor');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [focusArea, setFocusArea] = useState<'questioning' | 'bias-detection' | 'time-management' | 'communication' | 'all'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<string>('difficult-candidate');
  const [conversationDepth, setConversationDepth] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [sessionReport, setSessionReport] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => `session_${uuidv4()}`);
  
  // Enhanced metrics
  const [interviewerScore, setInterviewerScore] = useState(78);
  const [questioningSkills, setQuestioningSkills] = useState(85);
  const [biasDetection, setBiasDetection] = useState(72);
  const [timeManagement, setTimeManagement] = useState(88);
  const [communicationStyle, setCommunicationStyle] = useState(82);
  const [adaptability, setAdaptability] = useState(76);
  const [confidenceLevel, setConfidenceLevel] = useState(79);
  
  // Real-time insights
  const [currentInsights, setCurrentInsights] = useState<CoachingInsight[]>([]);
  const [conversationFlow, setConversationFlow] = useState<'exploration' | 'practice' | 'feedback' | 'mastery'>('exploration');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Session timer
  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Advanced scenario database
  const scenarioDatabase = {
    'difficult-candidate': [
      "The candidate keeps interrupting you and seems dismissive of your questions.",
      "A senior developer is showing signs of arrogance and technical elitism.",
      "The candidate appears nervous but their anxiety is affecting the interview flow."
    ],
    'technical-deep-dive': [
      "You need to assess a candidate's system design skills for a complex architecture role.",
      "The candidate claims expertise in a technology you're not familiar with.",
      "How do you evaluate problem-solving skills in a coding interview?"
    ],
    'bias-scenarios': [
      "You notice the candidate has a gap in employment history.",
      "The candidate has an accent that makes communication challenging.",
      "You find yourself making assumptions based on the candidate's university."
    ],
    'time-pressure': [
      "You're running behind schedule with multiple back-to-back interviews.",
      "The candidate is taking too long to answer questions.",
      "You need to cut the interview short due to technical difficulties."
    ]
  };

  // Enhanced AI response generation with personality
  const generateAdvancedCoachingResponse = (userInput: string, personality: string) => {
    const responses = {
      mentor: [
        "Great approach! I can see you're thinking strategically. Let's build on this by considering...",
        "That's a solid foundation. From my experience, adding this element could make it even stronger...",
        "Excellent insight! This reminds me of a situation where...",
        "I appreciate your thoughtfulness. Let me share a framework that might help..."
      ],
      expert: [
        "Technically sound, but let's optimize this approach. Industry best practice suggests...",
        "Your methodology is correct. However, research shows that candidates respond better when...",
        "That's a valid technique. The data indicates we can improve effectiveness by...",
        "Solid execution. Based on interviewing analytics, consider this enhancement..."
      ],
      supportive: [
        "You're doing great! 🌟 That shows real growth in your interviewing skills.",
        "Don't worry, this is a common challenge. Let's work through it together step by step.",
        "I believe in your ability to handle this! Here's a gentle way to approach it...",
        "You're on the right track! Let's add some confidence-building techniques..."
      ],
      challenging: [
        "Good start, but can you push yourself further? What if the candidate...",
        "That's surface-level thinking. Dig deeper - what's the real issue here?",
        "I'll be direct: there's a better way to handle this. Are you ready for advanced techniques?",
        "You can do better than that. Let me challenge you with a harder scenario..."
      ]
    };

    const personalityResponses = responses[personality as keyof typeof responses] || responses.mentor;
    const baseResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    
    // Add specific coaching based on focus area
    const focusSpecificAdvice = {
      questioning: " Remember to use the STAR method for behavioral questions and avoid leading questions that reveal your preferred answer.",
      'bias-detection': " Watch for unconscious bias triggers like cultural assumptions or appearance-based judgments. Stay focused on job-relevant competencies.",
      'time-management': " Keep track of time allocation: 5 minutes intro, 20 minutes technical, 15 minutes behavioral, 10 minutes questions. Use gentle transitions to stay on track.",
      communication: " Mirror the candidate's communication style while maintaining professionalism. Use active listening techniques and provide clear context for each question.",
      all: " Consider the holistic interview experience - technical assessment, cultural fit, communication skills, and growth potential."
    };

    return baseResponse + (focusSpecificAdvice[focusArea as keyof typeof focusSpecificAdvice] || focusSpecificAdvice.all);
  };

  // Real-time insight generation
  const generateInsights = (messageCount: number, userInput: string): CoachingInsight[] => {
    const insights: CoachingInsight[] = [];
    
    if (messageCount > 3 && userInput.toLowerCase().includes('technical')) {
      insights.push({
        type: 'tip',
        title: 'Technical Question Balance',
        description: 'Great focus on technical skills!',
        actionable: 'Consider mixing in behavioral questions to assess soft skills',
        priority: 'medium'
      });
    }
    
    if (messageCount > 5) {
      insights.push({
        type: 'strength',
        title: 'Conversation Flow',
        description: 'You\'re maintaining good dialogue depth',
        actionable: 'Continue building on candidate responses',
        priority: 'low'
      });
    }
    
    return insights;
  };

  const renderMessageContent = (message: Message) => {
    if (!message.content) return null;
    
    // Ensure content is a string before splitting
    const content = typeof message.content === 'string' ? message.content : String(message.content);
    
    // Split content into lines and process each line
    return (
      <div>
        {content.split('\n').map((line, i) => {
          // Skip empty lines
          if (!line.trim()) return null;
          
          // Headers
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-base font-bold mt-6 mb-3">{line.substring(3)}</h2>;
          }
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-lg font-bold mt-8 mb-4">{line.substring(2)}</h1>;
          }
          
          // Code blocks
          if (line.startsWith('```')) {
            return (
              <pre key={i} className="bg-gray-100 p-4 rounded-md my-2 overflow-x-auto">
                <code>{line.substring(3)}</code>
              </pre>
            );
          }
          
          // Lists
          if (line.startsWith('- ')) {
            return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>;
          }
          
          // Numbered lists
          if (/^\d+\.\s/.test(line)) {
            return <li key={i} className="ml-4 list-decimal">{line.substring(line.indexOf(' ') + 1)}</li>;
          }
          
          // Bold and italic
          const boldItalic = line
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          
          return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: boldItalic }} />;
        })}
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!isSessionActive) setIsSessionActive(true);
    setConversationDepth(prev => prev + 1);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
      type: 'question'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsAnalyzing(true);

    try {
      // Call the backend API
      const response = await evaluateQuestion({
        sessionId,
        coachPersonality,
        level: difficulty,
        focusArea,
        scenarioType: currentScenario,
        query: inputMessage
      });

      // Extract the response text from the API response structure
      let responseContent = '';
      if (response && typeof response === 'object') {
        // Handle the specific response format with 'response' and 'history' properties
        if ('response' in response && response.response) {
          responseContent = response.response;
        } 
        // Fallback to other possible response formats
        else if ('message' in response) {
          responseContent = response.message;
        } else if ('content' in response) {
          responseContent = response.content;
        } else {
          // If we can't find a message, stringify the whole response
          responseContent = JSON.stringify(response);
        }
      } else if (typeof response === 'string') {
        // If it's already a string, use it as is
        responseContent = response;
      } else {
        // Fallback for any other type
        responseContent = String(response);
      }

      // Process the AI response with markdown formatting
      const feedback = {
        score: 7, // This would come from the API in a real implementation
        strengths: ['Good question structure', 'Relevant to role'],
        improvements: ['Could dive deeper into technical specifics', 'Consider adding a follow-up question'],
        suggestions: ['Ask about specific technologies used', 'Request a real-world example']
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
        feedback
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Generate insights based on the conversation
      const newInsights = generateInsights(messages.length, inputMessage);
      setCurrentInsights(newInsights);
      
      // Update metrics
      updateMetricsAdvanced();
      
      // Voice feedback if enabled
      if (voiceEnabled) {
        speakResponse(aiMessage.content);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback to local response if API fails
      const fallbackResponse = `## Coaching Tips\n\nI'm here to help you improve your interviewing skills. Here are some key principles to keep in mind:\n\n### Key Principles\n- **Be specific** - Ask for concrete examples\n- **Use the STAR method** - Situation, Task, Action, Result\n- **Stay objective** - Focus on skills and experience\n- **Be consistent** - Ask all candidates similar questions\n\n### Try This\nAsk me to evaluate a question or practice an interview scenario with you!`;
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateMetricsAdvanced = () => {
    const improvement = Math.floor(Math.random() * 3) + 1;
    setInterviewerScore(prev => Math.min(100, prev + improvement));
    
    // Focus area specific improvements
    switch (focusArea) {
      case 'questioning':
        setQuestioningSkills(prev => Math.min(100, prev + improvement + 1));
        break;
      case 'bias-detection':
        setBiasDetection(prev => Math.min(100, prev + improvement + 1));
        break;
      case 'time-management':
        setTimeManagement(prev => Math.min(100, prev + improvement + 1));
        break;
      case 'communication':
        setCommunicationStyle(prev => Math.min(100, prev + improvement + 1));
        break;
      default:
        setAdaptability(prev => Math.min(100, prev + improvement));
    }
    
    setConfidenceLevel(prev => Math.min(100, prev + Math.floor(Math.random() * 2) + 1));
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.substring(0, 200));
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const generateSessionReport = async () => {
    if (!sessionId) return;
    
    setIsGeneratingReport(true);
    try {
      const report = await generateReport(sessionId);
      setSessionReport(report);
      
      // Create a blob and download the report
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-session-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating report:', error);
      // Fallback to a simple report
      const simpleReport = `Interview Session Report\n\n` +
        `Date: ${new Date().toLocaleString()}\n` +
        `Duration: ${Math.floor(sessionTime / 60)}m ${sessionTime % 60}s\n` +
        `Scenario: ${currentScenario}\n` +
        `Conversation Depth: ${conversationDepth} turns\n\n` +
        `Performance Metrics:\n` +
        `- Interviewer Score: ${interviewerScore}/100\n` +
        `- Questioning Skills: ${questioningSkills}/100\n` +
        `- Bias Detection: ${biasDetection}/100\n` +
        `- Time Management: ${timeManagement}/100\n` +
        `- Communication Style: ${communicationStyle}/100\n\n` +
        `Key Insights:\n` +
        currentInsights.map(insight => `- ${insight.title}: ${insight.description}`).join('\n');
      
      setSessionReport(simpleReport);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleEndSession = async () => {
    setIsSessionActive(false);
    await generateSessionReport();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("I would start by acknowledging their expertise while gently redirecting: 'I can see you have strong opinions about this. Help me understand your thought process when you encounter disagreement in technical decisions.'");
      }, 3000);
    }
  };

  const generateNewScenario = () => {
    const scenarios = scenarioDatabase[currentScenario as keyof typeof scenarioDatabase] || scenarioDatabase['difficult-candidate'];
    const newScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const scenarioMessage: Message = {
      id: Date.now().toString(),
      content: `🎯 New ${difficulty} scenario: ${newScenario}`,
      isUser: false,
      timestamp: new Date(),
      type: 'scenario',
      aiPersonality: coachPersonality
    };
    
    setMessages(prev => [...prev, scenarioMessage]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteSession = () => {
    if (onComplete) {
      onComplete({ 
        score: interviewerScore, 
        feedback: 'Excellent progress in your advanced interviewer training!',
        skills: {
          questioning: questioningSkills,
          biasDetection: biasDetection,
          timeManagement: timeManagement,
          communication: communicationStyle,
          adaptability: adaptability,
          confidence: confidenceLevel
        },
        sessionTime: sessionTime,
        conversationDepth: conversationDepth,
        insights: currentInsights
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl p-4 lg:p-6 border border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Advanced AI Coach
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </h1>
                <p className="text-sm lg:text-base text-gray-600">
                  Personality: <Badge variant="outline" className="ml-1">{coachPersonality}</Badge>
                  • Focus: <Badge variant="outline" className="ml-1">{focusArea}</Badge>
                  • Level: <Badge variant="outline" className="ml-1">{difficulty}</Badge>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-blue-600">{interviewerScore}%</div>
                <div className="text-xs lg:text-sm text-gray-500">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-xl font-bold text-indigo-600">{formatTime(sessionTime)}</div>
                <div className="text-xs lg:text-sm text-gray-500">Session Time</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={voiceEnabled ? "bg-green-50 border-green-200" : ""}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Coach Personality</label>
              <Select value={coachPersonality} onValueChange={(value: any) => setCoachPersonality(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentor">🎓 Mentor</SelectItem>
                  <SelectItem value="expert">🔬 Expert</SelectItem>
                  <SelectItem value="supportive">🤗 Supportive</SelectItem>
                  <SelectItem value="challenging">⚡ Challenging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty Level</label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">🌱 Beginner</SelectItem>
                  <SelectItem value="intermediate">🚀 Intermediate</SelectItem>
                  <SelectItem value="advanced">⭐ Advanced</SelectItem>
                  <SelectItem value="expert">🏆 Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Focus Area</label>
              <Select value={focusArea} onValueChange={(value: any) => setFocusArea(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🎯 All Skills</SelectItem>
                  <SelectItem value="questioning">❓ Questioning</SelectItem>
                  <SelectItem value="bias-detection">👁️ Bias Detection</SelectItem>
                  <SelectItem value="time-management">⏰ Time Management</SelectItem>
                  <SelectItem value="communication">💬 Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Scenario Type</label>
              <Select value={currentScenario} onValueChange={setCurrentScenario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="difficult-candidate">😤 Difficult Candidate</SelectItem>
                  <SelectItem value="technical-deep-dive">🔧 Technical Deep-dive</SelectItem>
                  <SelectItem value="bias-scenarios">⚖️ Bias Scenarios</SelectItem>
                  <SelectItem value="time-pressure">⏱️ Time Pressure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Enhanced Chat Interface */}
          <div className="xl:col-span-2 order-1">
            <Card className="h-[70vh] min-h-[500px] flex flex-col shadow-xl border-0 overflow-hidden">
              <CardHeader className="p-4 lg:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      Advanced Training Session
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Cpu className="w-3 h-3 mr-1" />
                        AI Enhanced
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm lg:text-base">
                      Depth Level: {conversationDepth} • Flow: {conversationFlow}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEndSession}
                      className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                      disabled={isGeneratingReport}
                    >
                      {isGeneratingReport ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        'End Session'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateNewScenario}
                      className="bg-blue-50 border-blue-200 hover:bg-blue-100"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      New Scenario
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Enhanced Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isUser && (
                        <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs lg:text-sm">
                            🤖
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
                        <div
                          className={`p-4 lg:p-5 rounded-xl text-sm lg:text-base leading-relaxed ${
                            message.isUser
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-gray-50 border border-gray-200 rounded-tl-none'
                          }`}
                        >
                          {renderMessageContent(message)}
                        
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 flex-wrap">
                            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {message.type && (
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {message.type}
                              </Badge>
                            )}
                            {message.aiPersonality && !message.isUser && (
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {message.aiPersonality}
                              </Badge>
                            )}
                            {message.score && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>{message.score}%</span>
                              </div>
                            )}
                            {message.tags && message.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {message.isUser && (
                        <Avatar className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                          <AvatarFallback className="bg-blue-500 text-white text-xs lg:text-sm">
                            YOU
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isAnalyzing && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs lg:text-sm">
                          🤖
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 lg:p-4 rounded-2xl border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700 text-sm lg:text-base">
                          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          Analyzing your interviewing strategy with advanced AI...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50 p-4 flex-shrink-0">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={`Ask your ${coachPersonality} coach about interviewer techniques, or describe a challenging scenario...`}
                        className="min-h-[60px] text-sm lg:text-base resize-none"
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={toggleRecording}
                          variant={isRecording ? "destructive" : "outline"}
                          size="sm"
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500"
                        disabled={!inputMessage.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Performance Panel */}
          <div className="space-y-4 lg:space-y-6 order-2">
            {/* Advanced Skills Metrics */}
            <Card className="shadow-xl border-0">
              <CardHeader className="p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Advanced Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{conversationDepth}</div>
                    <div className="text-xs text-gray-600">Depth Level</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{currentInsights.length}</div>
                    <div className="text-xs text-gray-600">Active Insights</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: 'Questioning Skills', value: questioningSkills, color: 'bg-blue-500' },
                    { label: 'Bias Detection', value: biasDetection, color: 'bg-purple-500' },
                    { label: 'Time Management', value: timeManagement, color: 'bg-green-500' },
                    { label: 'Communication', value: communicationStyle, color: 'bg-orange-500' },
                    { label: 'Adaptability', value: adaptability, color: 'bg-indigo-500' },
                    { label: 'Confidence', value: confidenceLevel, color: 'bg-pink-500' }
                  ].map((skill) => (
                    <div key={skill.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.label}</span>
                        <span className="font-medium">{skill.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${skill.color} transition-all duration-500`}
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Insights */}
            {currentInsights.length > 0 && (
              <Card className="shadow-lg border border-yellow-200">
                <CardHeader className="p-4 lg:p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Real-time Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-3">
                    {currentInsights.map((insight, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            insight.priority === 'high' ? 'bg-red-500' :
                            insight.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{insight.title}</p>
                            <p className="text-gray-600 mt-1">{insight.description}</p>
                            <p className="text-blue-600 mt-1 font-medium">{insight.actionable}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Coaching Tips */}
            <Card className="shadow-lg border-0">
              <CardHeader className="p-4 lg:p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Adaptive Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <ThumbsUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Strength Identified</p>
                      <p className="text-gray-600">Your {focusArea} skills are improving consistently</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Next Challenge</p>
                      <p className="text-gray-600">Ready for {difficulty === 'beginner' ? 'intermediate' : difficulty === 'intermediate' ? 'advanced' : 'expert'} level scenarios</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">AI Recommendation</p>
                      <p className="text-gray-600">Practice more {currentScenario.replace('-', ' ')} scenarios</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3"
                onClick={handleCompleteSession}
              >
                <Award className="w-4 h-4 mr-2" />
                Complete Advanced Session
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="py-2">
                  <FileText className="w-4 h-4 mr-1" />
                  Detailed Report
                </Button>
                <Button variant="outline" className="py-2" onClick={() => setIsSessionActive(!isSessionActive)}>
                  {isSessionActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {isSessionActive ? 'Pause' : 'Resume'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAICoach;