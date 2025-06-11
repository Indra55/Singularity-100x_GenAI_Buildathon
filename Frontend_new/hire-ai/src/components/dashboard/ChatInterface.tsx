import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Grid, List, ArrowLeft, Mic, Check, X, Heart, Star, MapPin, Clock, Briefcase, GraduationCap, DollarSign, Zap, Filter, SortAsc, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SwipeableCardStack from "./SwipeableCardStack";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  candidates?: any[];
  showViewToggle?: boolean;
  suggestions?: string[];
}

const ChatInterface = ({ user, onCandidateSelect, selectedCandidates }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI recruiting assistant. I can help you find the perfect candidates for your team. What kind of talent are you looking for today?",
      timestamp: new Date(),
      suggestions: [
        "Find senior AI engineers with LangChain experience",
        "Looking for product managers with GenAI background", 
        "Need full-stack developers with React and Python",
        "Find UX designers with AI product experience",
        "Senior data scientists with ML experience"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'results' | 'swipe'>('chat');
  const [cardViewMode, setCardViewMode] = useState<'cards' | 'list'>('cards');
  const [currentCandidates, setCurrentCandidates] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    experience: 'all',
    location: 'all',
    skills: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedSuggestions = [
    "Find senior AI engineers with LangChain experience",
    "Looking for product managers with GenAI background", 
    "Need full-stack developers with React and Python",
    "Find UX designers with AI product experience",
    "Senior data scientists with ML experience",
    "Find DevOps engineers with Kubernetes expertise",
    "Looking for mobile developers with React Native",
    "Need blockchain developers with Solidity",
    "Find cybersecurity specialists with penetration testing",
    "Senior frontend developers with Next.js experience"
  ];

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
      summary: "Experienced AI engineer specializing in RAG systems and LangChain applications. Built production-scale AI systems for fintech and healthcare with 99.8% uptime.",
      matchReasons: [
        "Expert in LangChain and RAG systems",
        "6+ years of AI/ML experience", 
        "Strong Python and TensorFlow background",
        "Production experience with vector databases"
      ],
      lastActive: "2 hours ago",
      avatar: "SC",
      matchScore: 95,
      education: "MS Computer Science, Stanford",
      certifications: ["AWS ML Specialty", "TensorFlow Developer"],
      projects: ["Built AI chatbot with 10M+ users", "Led ML platform serving 1B+ requests/day"],
      personality: "Innovative problem-solver with leadership skills"
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
      summary: "Research scientist with deep expertise in large language models and computer vision applications.",
      matchReasons: [
        "8+ years ML research experience",
        "Published papers on LLMs",
        "Strong academic background", 
        "Experience with transformer architectures"
      ],
      lastActive: "1 day ago",
      avatar: "AR",
      matchScore: 92,
      education: "PhD Machine Learning, MIT",
      certifications: ["Google Cloud ML Engineer"],
      projects: ["Published 15+ papers in top ML conferences", "Created breakthrough CV algorithm"],
      personality: "Detail-oriented researcher with strong analytical skills"
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
      matchReasons: [
        "Product leadership in GenAI",
        "Experience with AI ethics",
        "Strong technical background",
        "Team management skills"
      ],
      lastActive: "30 minutes ago",
      avatar: "MP",
      matchScore: 88,
      education: "MBA Harvard, BS Engineering",
      certifications: ["Product Management Certificate"],
      projects: ["Launched 3 AI products with $50M+ revenue", "Led team of 12 engineers"],
      personality: "Strategic thinker with excellent communication"
    }
  ];

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I found ${mockCandidates.length} excellent candidates matching your criteria for "${messageText}". These professionals have strong backgrounds in the areas you mentioned. You can view them as cards, browse the list, or use our new swipe mode for quick candidate evaluation!`,
        timestamp: new Date(),
        candidates: mockCandidates,
        showViewToggle: true,
        suggestions: [
          "Show me more senior candidates",
          "Filter by specific technologies",
          "Find candidates in my timezone",
          "Show salary ranges"
        ]
      };

      setMessages(prev => [...prev, botResponse]);
      setCurrentCandidates(mockCandidates);
      setIsTyping(false);

      toast({
        title: "Candidates Found",
        description: `Found ${mockCandidates.length} matching candidates`,
      });
    }, 2000);
  };

  const handleViewResults = (mode: 'cards' | 'list' | 'swipe') => {
    if (mode === 'swipe') {
      setViewMode('swipe');
    } else {
      setCardViewMode(mode);
      setViewMode('results');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSwipeAction = (candidateId: string, action: 'like' | 'pass') => {
    const candidate = currentCandidates.find(c => c.id === candidateId);
    if (candidate && action === 'like') {
      onCandidateSelect(candidate);
      toast({
        title: "Candidate Selected",
        description: `${candidate.name} added to your shortlist`,
      });
    }
    
    // Remove candidate from current stack
    setCurrentCandidates(prev => prev.filter(c => c.id !== candidateId));
  };

  const isSelected = (candidate) => selectedCandidates.some(c => c.id === candidate.id);

  const CandidateCard = ({ candidate, isStacked = false }) => (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
      isSelected(candidate) ? 'ring-2 ring-pulse-500 bg-pulse-50' : 'bg-gray-900 text-white'
    } ${isStacked ? 'absolute' : ''}`} onClick={() => !isStacked && onCandidateSelect(candidate)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
              {candidate.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{candidate.name}</h3>
              <p className="text-sm text-gray-400">{candidate.title}</p>
              <p className="text-xs text-gray-500">{candidate.company}</p>
            </div>
          </div>
          <Badge className="bg-green-600 text-white">
            {candidate.matchScore}% match
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-pulse-400" />
              <span className="text-gray-300">{candidate.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-pulse-400" />
              <span className="text-gray-300">{candidate.experience}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-pulse-400" />
              <span className="text-gray-300">{candidate.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-pulse-400" />
              <span className="text-gray-300 text-xs">{candidate.education}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-pulse-400" />
              Summary
            </h4>
            <p className="text-sm text-gray-300">{candidate.summary}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-pulse-600 text-white">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-1">
              <Star className="w-4 h-4 text-pulse-400" />
              Key Projects
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              {candidate.projects.slice(0, 2).map((project, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-pulse-500 rounded-full mt-2 flex-shrink-0"></span>
                  {project}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last Active: {candidate.lastActive}
          </span>
          <Button 
            size="sm" 
            className={isSelected(candidate) ? "bg-pulse-500" : "bg-green-600 hover:bg-green-700"}
          >
            {isSelected(candidate) ? "Selected" : "Contact"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (viewMode === 'swipe') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setViewMode('chat')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Swipe Mode</h2>
            <p className="text-gray-600">Swipe right to like, left to pass</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-pulse-50 text-pulse-700">
              {currentCandidates.length} candidates left
            </Badge>
          </div>
        </div>

        <SwipeableCardStack 
          candidates={currentCandidates}
          onSwipe={handleSwipeAction}
          renderCard={(candidate) => <CandidateCard candidate={candidate} isStacked={true} />}
        />
      </div>
    );
  }

  if (viewMode === 'results') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setViewMode('chat')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </Button>
            <div>
              <h2 className="text-xl font-semibold">Search Results</h2>
              <p className="text-gray-600">Found {currentCandidates.length} candidates matching your criteria</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={cardViewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setCardViewMode("cards")}
              className="flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              Cards
            </Button>
            <Button
              variant={cardViewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setCardViewMode("list")}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewResults('swipe')}
              className="flex items-center gap-2 bg-pulse-500 text-white hover:bg-pulse-600"
            >
              <Heart className="w-4 h-4" />
              Swipe Mode
            </Button>
          </div>
        </div>

        <div className={cardViewMode === "cards" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          {currentCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-pulse-500 to-pulse-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          PeopleGPT Assistant
        </h2>
        <p className="text-pulse-100 text-sm">Describe your ideal hire in natural language and let AI find the best matches</p>
      </div>

      {/* Messages Container - Fixed height with scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'bot' && (
              <div className="w-10 h-10 bg-pulse-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[70%] rounded-2xl p-4 ${
              message.type === 'user' 
                ? 'bg-pulse-500 text-white' 
                : 'bg-white border shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {message.suggestions && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-600 font-medium">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-7 px-2 hover:bg-pulse-50 hover:border-pulse-300"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {message.showViewToggle && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleViewResults('cards')}
                    className="bg-pulse-600 hover:bg-pulse-700 text-white flex items-center gap-2"
                  >
                    <Grid className="w-4 h-4" />
                    Card View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewResults('list')}
                    className="flex items-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    List View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewResults('swipe')}
                    className="flex items-center gap-2 border-pulse-500 text-pulse-600 hover:bg-pulse-50"
                  >
                    <Heart className="w-4 h-4" />
                    Swipe Mode
                  </Button>
                </div>
              )}
            </div>
            {message.type === 'user' && (
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 bg-pulse-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border rounded-2xl p-4 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions - Sticky at bottom */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-pulse-500" />
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {predefinedSuggestions.slice(0, 4).map((suggestion, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs h-7 px-3 hover:bg-pulse-50 hover:border-pulse-300 text-gray-600"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input at the very bottom */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe your ideal candidate... e.g., 'Senior AI engineer with LangChain experience'"
            className="flex-1"
            disabled={isTyping}
          />
          <Button onClick={() => handleSendMessage()} disabled={isTyping || !inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Mic className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
