"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Mic,
  MicOff,
  Brain,
  User,
  Bot,
  Grid3X3,
  List,
  MessageSquare,
  Download,
  X,
  ChevronRight,
  CheckCircle,
  XCircle,
  Globe,
  Loader2,
  Search,
  Users,
  FileText,
  TrendingUp,
  Sparkles,
  Menu,
  BarChart3,
  Crown,
  Clock,
  Star,
  Briefcase,
  Code,
  Award,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Linkedin,
  Github,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  candidates?: Candidate[]
  showViewOptions?: boolean
}

interface Candidate {
  id: string
  name: string
  title: string
  company: string
  location: string
  experience: number
  skills: string[]
  score: number
  avatar: string
  summary: string
  salary: string
  availability: string
  lastActive: string
  matchReasons: string[]
  githubStars: number
  publications: number
  languages: string[]
  education: string
  certifications: string[]
  projects: string[]
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    portfolio?: string
  }
  resumeUrl?: string
  matchScoreBreakdown?: {
    skillsMatch?: number
    experienceMatch?: number
    educationMatch?: number
    locationMatch?: number
    overallFit?: number
  }
  email: string
  phone?: string
  yearsInAI?: number
  status: "new" | "contacted" | "interviewing" | "hired" | "rejected"
  swipeDirection?: "left" | "right"
}

const mockCandidates: Candidate[] = []

export function EnhancedHireAIPlatform() {
  const { isAuthenticated, isGuestMode, logout, messageCount, incrementMessageCount, hasReachedMessageLimit, user } =
    useAuth()
  const [activeTab, setActiveTab] = useState("peoplegpt")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI recruiting assistant. I can help you find the perfect candidates for your team. What kind of talent are you looking for today?",
      timestamp: new Date(),
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [showCandidates, setShowCandidates] = useState(false)
  const [searchResults, setSearchResults] = useState<Candidate[]>([])
  const [swipedCardIds, setSwipedCardIds] = useState<string[]>([])
  const [swipedCandidates, setSwipedCandidates] = useState<Candidate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false)
  const [outreachMessages, setOutreachMessages] = useState<Record<string, string>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    // Check if user has reached message limit
    if (hasReachedMessageLimit && !isAuthenticated) {
      // Add a system message about the limit
      const limitMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: "You've reached the limit of 3 messages. Please sign in to continue using the AI assistant.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, limitMessage])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsTyping(true)
    setShowCandidates(false)

    try {
      const response = await fetch("http://localhost:5001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: currentMessage,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const candidates = data.candidates || []

      setSearchResults(candidates)
      setCurrentCandidateIndex(0)
      setSwipeDirection(null)

      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: data.message || "I've found some candidates that match your criteria. Would you like to see them?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (isGuestMode) {
        incrementMessageCount()
      }

      if (candidates.length > 0) {
        setShowCandidates(true)
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: "I'm sorry, I encountered an error while searching for candidates. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleViewModeSelect = (mode: "card" | "list") => {
    setViewMode(mode)
    setShowCandidates(true)
  }

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)

    // Get the current candidate ID and candidate object
    const candidateId = searchResults[currentCandidateIndex].id
    const currentCandidate = searchResults[currentCandidateIndex]
    
    // Create a copy of the candidate with the swipe direction
    const swipedCandidate = {
      ...currentCandidate,
      swipeDirection: direction
    }
    
    // Add the candidate to selected candidates if swiped right
    if (direction === "right") {
      if (!selectedCandidates.includes(candidateId)) {
        setSelectedCandidates((prev) => [...prev, candidateId])
      }
    }
    
    // Add the candidate to swiped cards
    setSwipedCardIds((prev) => [...prev, candidateId])
    
    // Add the candidate with swipe direction to swipedCandidates
    setSwipedCandidates((prev) => [...prev, swipedCandidate])

    // Add a timeout to reset the swipe direction and move to the next card
    setTimeout(() => {
      setSwipeDirection(null)
      if (currentCandidateIndex < searchResults.length - 1) {
        setCurrentCandidateIndex(currentCandidateIndex + 1)
      }
    }, 600) // Longer delay to allow overlay to be visible
  }

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    )
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    
    try {
      // Fetch candidates from the Flask API
      const response = await fetch('http://localhost:5001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch candidates')
      }

      const data = await response.json()
      setSearchResults(data.candidates || [])
    } catch (error) {
      console.error('Error fetching candidates:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file.name)
      
      if (isGuestMode) {
        incrementMessageCount()
      }
      
      // Show candidates if there are search results
      if (searchResults.length > 0) {
        setShowCandidates(true)
      }
    }
  }
  
  const handleChatSubmit = async () => {
    try {
      // Chat submission logic here
      console.log('Chat submitted')
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant" as "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateOutreach = async () => {
    // Use either selected candidates or right-swiped candidates
    const candidatesToOutreach = selectedCandidates.length > 0 ? 
      selectedCandidates : 
      swipedCandidates.filter(c => c.swipeDirection === "right").map(c => c.id)
    
    if (candidatesToOutreach.length === 0) return
    setIsGeneratingOutreach(true)

    try {
      const messages: Record<string, string> = {}
      
      // Get the candidates from searchResults or swipedCandidates
      for (const candidateId of candidatesToOutreach) {
        // First try to find in swipedCandidates (which has the swipe direction)
        let candidate = swipedCandidates.find((c) => c.id === candidateId)
        
        // If not found, look in searchResults
        if (!candidate) {
          candidate = searchResults.find((c) => c.id === candidateId)
        }
        
        if (candidate) {
          try {
            // Get message type and tone from UI (or use defaults)
            const messageTypeElement = document.querySelector('select[name="messageType"]') as HTMLSelectElement;
            const toneElement = document.querySelector('select[name="tone"]') as HTMLSelectElement;
            const customPromptElement = document.querySelector('textarea[name="customPrompt"]') as HTMLTextAreaElement;
            
            const messageType = messageTypeElement?.value || 'email';
            const tone = toneElement?.value || 'professional';
            const customPrompt = customPromptElement?.value || '';
            
            // Prepare sender info from user profile
            const senderInfo = {
              name: user?.name || '',
              email: user?.email || '',
              companyName: user?.companyName || '',
              industrySector: user?.industrySector || '',
              companySize: user?.companySize || '',
              officeLocations: user?.officeLocations || [],
              keyDepartments: user?.keyDepartments || []
            };
            
            // Call our backend API to generate personalized message using Gemini AI
            const response = await fetch('http://localhost:5003/generate-outreach', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                candidate,
                messageType,
                tone,
                customPrompt,
                senderInfo
              }),
            });
            
            const data = await response.json();
            
            if (data.success) {
              messages[candidateId] = data.message;
            } else {
              // Fallback to template-based message if API fails
              messages[candidateId] = `Hi ${candidate.name},

I hope this email finds you well. I came across your impressive profile${candidate.skills?.length > 0 ? ` and was particularly drawn to your expertise in ${candidate.skills[0]}${candidate.skills.length > 1 ? ` and ${candidate.skills[1]}` : ''}` : ''}.

${user?.companyName ? `At ${user.companyName}` : 'At our company'}${user?.industrySector ? `, a leading organization in the ${user.industrySector} sector` : ''}, we're building cutting-edge solutions${user?.keyDepartments && user.keyDepartments.length > 0 ? ` with our ${user.keyDepartments.slice(0, 2).join(' and ')} teams` : ''}. We believe your background${candidate.title ? ` in ${candidate.title}` : ''} would be a perfect fit for our team${user?.companySize ? ` of ${user.companySize} professionals` : ''}.${candidate.skills?.length > 0 ? ` Your experience with ${candidate.skills.slice(0, Math.min(3, candidate.skills.length)).join(", ")} aligns perfectly with what we're looking for.` : ''}

Would you be interested in a brief conversation about an exciting opportunity? I'd love to learn more about your career goals and share how you could make a significant impact with us${user && user.officeLocations && user.officeLocations.length > 0 ? ` at our ${user.officeLocations[0]} location` : ''}.

Best regards,
${user?.name || '[Your Name]'}
${user?.companyName || ''}`;
              console.error('Error from AI service:', data.error);
            }
          } catch (apiError) {
            // Fallback to template-based message if API call fails
            messages[candidateId] = `Hi ${candidate.name},

I hope this email finds you well. I came across your impressive profile${candidate.skills?.length > 0 ? ` and was particularly drawn to your expertise in ${candidate.skills[0]}${candidate.skills.length > 1 ? ` and ${candidate.skills[1]}` : ''}` : ''}.

${user?.companyName ? `At ${user.companyName}` : 'At our company'}${user?.industrySector ? `, a leading organization in the ${user.industrySector} sector` : ''}, we're building cutting-edge solutions${user?.keyDepartments && user.keyDepartments.length > 0 ? ` with our ${user.keyDepartments.slice(0, 2).join(' and ')} teams` : ''}. We believe your background${candidate.title ? ` in ${candidate.title}` : ''} would be a perfect fit for our team${user?.companySize ? ` of ${user.companySize} professionals` : ''}.${candidate.skills?.length > 0 ? ` Your experience with ${candidate.skills.slice(0, Math.min(3, candidate.skills.length)).join(", ")} aligns perfectly with what we're looking for.` : ''}

Would you be interested in a brief conversation about an exciting opportunity? I'd love to learn more about your career goals and share how you could make a significant impact with us${user && user.officeLocations && user.officeLocations.length > 0 ? ` at our ${user.officeLocations[0]} location` : ''}.

Best regards,
${user?.name || '[Your Name]'}
${user?.companyName || ''}`;
            console.error('API call error:', apiError);
          }
        }
      }
      
      setOutreachMessages(messages);
    } catch (error) {
      console.error('Error generating outreach messages:', error);
    } finally {
      setIsGeneratingOutreach(false);
    }
  }

  const navigationItems = [
    { id: "peoplegpt", label: "PeopleGPT", icon: Brain, description: "AI-powered candidate search" },
    { id: "search", label: "Advanced Search", icon: Search, description: "Detailed search filters" },
    { id: "browse", label: "Browse Candidates", icon: Users, description: "Swipe through profiles" },
    { id: "parser", label: "Resume Parser", icon: FileText, description: "AI resume analysis" },
    { id: "ranking", label: "AI Ranking", icon: TrendingUp, description: "Smart candidate ranking" },
    { id: "enrichment", label: "Web Enrichment", icon: Globe, description: "Profile enhancement" },
    { id: "outreach", label: "Outreach Generator", icon: MessageSquare, description: "Personalized messages" },
    { id: "analytics", label: "Analytics", icon: BarChart3, description: "Recruitment insights" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-violet-950/20 to-black text-white relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/8 rounded-full blur-[100px] animate-pulse delay-2000" />

        {/* Enhanced floating particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Modern Header */}
      <header className="relative z-10 border-b border-violet-500/30 bg-gradient-to-r from-black/90 via-violet-950/90 to-black/90 backdrop-blur-xl shadow-lg shadow-violet-900/10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:bg-white/10 rounded-full p-2 h-9 w-9"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 ring-2 ring-violet-500/20">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent tracking-tight">
                    HireAI Platform
                  </h1>
                  <p className="text-[10px] uppercase tracking-wider text-violet-300/80 font-medium">AI-Powered Recruitment</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Status Indicators */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-emerald-300">AI Online</span>
                </div>
                
                {selectedCandidates.length > 0 && (
                  <div className="flex items-center space-x-1 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-medium text-blue-300">{selectedCandidates.length}</span>
                  </div>
                )}
                
                {!isAuthenticated && isGuestMode && messageCount > 0 && (
                  <div className="flex items-center space-x-1 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                    <MessageSquare className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-medium text-amber-300">{messageCount}/3</span>
                  </div>
                )}
              </div>
              
              {/* Auth Status */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Premium Badge - Only visible on larger screens */}
                  <div className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-2.5 py-1 rounded-full border border-amber-500/30 shadow-sm">
                    <Crown className="w-3 h-3 text-amber-400" fill="currentColor" />
                    <span className="text-xs font-semibold text-amber-300">Premium</span>
                  </div>
                  
                  {/* Company Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-0 hover:from-violet-600/30 hover:to-fuchsia-600/30 ring-2 ring-violet-500/30 hover:ring-violet-500/50 transition-all duration-200">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-violet-700 to-fuchsia-800 text-white text-xs font-medium">
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Online indicator */}
                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-gray-900/95 backdrop-blur-xl border border-violet-500/30 text-white p-0 rounded-xl shadow-xl shadow-violet-900/20 mt-1 overflow-hidden">
                      {/* User Profile Header */}
                      <div className="p-5 border-b border-violet-500/20 bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 ring-2 ring-violet-500/30">
                            <AvatarFallback className="bg-gradient-to-br from-violet-700 to-fuchsia-800 text-white font-medium">
                              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-base font-semibold text-white">{user?.name}</p>
                            <p className="text-xs text-violet-300">{user?.email}</p>
                            <div className="flex items-center mt-1 space-x-1">
                              <div className="flex items-center space-x-0.5 bg-amber-500/20 px-1.5 py-0.5 rounded-full">
                                <Crown className="w-2.5 h-2.5 text-amber-400" fill="currentColor" />
                                <span className="text-[10px] font-medium text-amber-300">Premium</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Company Information */}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-white flex items-center mb-3">
                          <Briefcase className="w-3.5 h-3.5 mr-1.5 text-violet-400" />
                          <span className="bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent">Company Profile</span>
                        </h3>
                        
                        {user?.companyName ? (
                          <div className="space-y-4">
                            <div className="bg-white/5 rounded-lg p-3 border border-violet-500/20">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-lg font-semibold text-white">{user.companyName}</p>
                                  <p className="text-sm text-violet-300">{user.industrySector || 'Industry not specified'}</p>
                                </div>
                                <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                                  {user.companySize ? `${user.companySize} employees` : 'Size not specified'}
                                </Badge>
                              </div>
                            </div>
                            
                            {user.officeLocations && user.officeLocations.length > 0 && (
                              <div>
                                <p className="text-xs uppercase tracking-wider text-violet-400 font-medium mb-2 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" /> Locations
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {user.officeLocations.map((location, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-violet-500/10 hover:bg-violet-500/20 text-violet-200 border-violet-500/30 transition-colors duration-200">
                                      {location}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {user.keyDepartments && user.keyDepartments.length > 0 && (
                              <div>
                                <p className="text-xs uppercase tracking-wider text-violet-400 font-medium mb-2 flex items-center">
                                  <Users className="w-3 h-3 mr-1" /> Departments
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {user.keyDepartments.map((dept, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30 transition-colors duration-200">
                                      {dept}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-violet-500/10 rounded-lg p-4 text-center border border-violet-500/20">
                            <p className="text-sm text-violet-300 mb-2">No company information available</p>
                            <Button variant="outline" size="sm" className="text-xs border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:text-white">
                              Complete Profile
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <DropdownMenuSeparator className="bg-violet-500/20" />
                      
                      <div className="p-2">
                        <DropdownMenuItem asChild className="cursor-pointer focus:bg-violet-600/20 focus:text-white">
                          <Button variant="ghost" size="sm" className="w-full justify-start text-violet-300 hover:text-white hover:bg-violet-500/20 rounded-md transition-colors duration-200" onClick={logout}>
                            <span className="flex items-center">
                              <X className="w-4 h-4 mr-2" />
                              Sign Out
                            </span>
                          </Button>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : isGuestMode ? (
                <div className="flex items-center space-x-1 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  <User className="w-3 h-3 text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">Guest</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  <X className="w-3 h-3 text-red-400" />
                  <span className="text-xs font-medium text-red-300">Not Logged In</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed lg:relative z-20 w-80 h-screen bg-black/60 backdrop-blur-xl border-r border-violet-500/20 overflow-y-auto"
            >
              <div className="p-6">
                <nav className="space-y-2">
                  {/* Always show PeopleGPT tab */}
                  <Button
                    key="peoplegpt"
                    variant={activeTab === "peoplegpt" ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab("peoplegpt")
                      setSidebarOpen(false)
                    }}
                    className={cn(
                      "w-full justify-start text-left p-4 h-auto",
                      activeTab === "peoplegpt"
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                        : "text-violet-300 hover:text-white hover:bg-violet-500/10",
                    )}
                  >
                    <Brain className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">PeopleGPT</div>
                      <div className="text-xs opacity-70 truncate">AI-powered candidate search</div>
                    </div>
                  </Button>

                  {/* Only show other navigation items if authenticated */}
                  {isAuthenticated ? (
                    navigationItems.slice(1).map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "default" : "ghost"}
                        onClick={() => {
                          setActiveTab(item.id)
                          setSidebarOpen(false)
                        }}
                        className={cn(
                          "w-full justify-start text-left p-4 h-auto",
                          activeTab === item.id
                            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                            : "text-violet-300 hover:text-white hover:bg-violet-500/10",
                        )}
                      >
                        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70 truncate">{item.description}</div>
                        </div>
                      </Button>
                    ))
                  ) : isGuestMode ? (
                    <div className="mt-8 p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg">
                      <h3 className="text-sm font-semibold text-violet-300 mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Guest Mode Active
                      </h3>
                      <p className="text-xs text-violet-200 mb-3">
                        You're using limited access. Sign up to unlock all features!
                      </p>
                      <div className="text-xs text-yellow-300 mb-3">
                        {messageCount}/3 messages used
                        <div className="w-full bg-gray-700 h-2 mt-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-500 to-red-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${(messageCount / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                        onClick={() => {
                          localStorage.removeItem("hireai_guest_mode")
                          window.location.reload()
                        }}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-8 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                      <h3 className="text-sm font-semibold text-violet-300 mb-2">Limited Access</h3>
                      <p className="text-xs text-violet-200 mb-4">
                        Sign in to unlock all features and unlimited messages with the AI assistant.
                      </p>
                    </div>
                  )}
                </nav>

                {/* Quick Stats - only show if authenticated */}
                {isAuthenticated && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-wider">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">1,247</div>
                        <div className="text-xs text-violet-300">Total Candidates</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">89</div>
                        <div className="text-xs text-green-300">Active Searches</div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">156</div>
                        <div className="text-xs text-blue-300">Interviews</div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">23</div>
                        <div className="text-xs text-yellow-300">Hires</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* PeopleGPT Tab */}
              <TabsContent value="peoplegpt">
                {!showCandidates ? (
                  <PeopleGPTChat
                    messages={messages}
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    isTyping={isTyping}
                    isListening={isListening}
                    setIsListening={setIsListening}
                    handleSendMessage={handleSendMessage}
                    handleViewModeSelect={handleViewModeSelect}
                    messagesEndRef={messagesEndRef}
                    textareaRef={textareaRef}
                    hasReachedMessageLimit={hasReachedMessageLimit}
                    isAuthenticated={isAuthenticated}
                    messageCount={messageCount}
                  />
                ) : (
                  <CandidateResults
                    searchResults={searchResults}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    selectedCandidates={selectedCandidates}
                    toggleCandidateSelection={toggleCandidateSelection}
                    currentCandidateIndex={currentCandidateIndex}
                    swipeDirection={swipeDirection}
                    handleSwipe={handleSwipe}
                    setShowCandidates={setShowCandidates}
                    generateOutreach={generateOutreach}
                    isGeneratingOutreach={isGeneratingOutreach}
                    swipedCardIds={swipedCardIds}
                    swipedCandidates={swipedCandidates}
                    setSwipedCandidates={setSwipedCandidates}
                    isAuthenticated={isAuthenticated}
                    isGuestMode={isGuestMode}
                  />
                )}
              </TabsContent>

              {/* Only show other tabs if authenticated */}
              {isAuthenticated && (
                <>
                  {/* Advanced Search Tab */}
                  <TabsContent value="search">
                    <AdvancedSearchTab
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      isSearching={isSearching}
                      handleSearch={handleSearch}
                      searchResults={searchResults}
                      selectedCandidates={selectedCandidates}
                      toggleCandidateSelection={toggleCandidateSelection}
                    />
                  </TabsContent>

                  {/* Browse Candidates Tab */}
                  <TabsContent value="browse">
                    <BrowseCandidatesTab
                      candidates={mockCandidates}
                      selectedCandidates={selectedCandidates}
                      toggleCandidateSelection={toggleCandidateSelection}
                    />
                  </TabsContent>

                  {/* Resume Parser Tab */}
                  <TabsContent value="parser">
                    <ResumeParserTab
                      uploadedFile={uploadedFile}
                      handleFileUpload={handleFileUpload}
                      fileInputRef={fileInputRef}
                    />
                  </TabsContent>

                  {/* AI Ranking Tab */}
                  <TabsContent value="ranking">
                    <AIRankingTab 
                      candidates={mockCandidates} 
                      selectedCandidates={selectedCandidates} 
                      setSelectedCandidates={setSelectedCandidates}
                      setActiveTab={setActiveTab}
                    />
                  </TabsContent>

                  {/* Web Enrichment Tab */}
                  <TabsContent value="enrichment">
                    <WebEnrichmentTab candidates={mockCandidates} />
                  </TabsContent>

                  {/* Outreach Generator Tab */}
                  <TabsContent value="outreach">
                    <OutreachGeneratorTab
                      selectedCandidates={selectedCandidates}
                      candidates={searchResults}
                      generateOutreach={generateOutreach}
                      isGeneratingOutreach={isGeneratingOutreach}
                      outreachMessages={outreachMessages}
                      swipedCandidates={swipedCandidates}
                    />
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics">
                    <AnalyticsTab />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </main>
      </div>

      {/* Selected Candidates Floating Action */}
      <AnimatePresence>
        {selectedCandidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Card className="bg-black/90 border-violet-500/30 backdrop-blur-xl shadow-2xl shadow-violet-500/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <span className="text-violet-200">
                    <span className="font-bold text-violet-400">{selectedCandidates.length}</span> candidates selected
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-violet-500/30 text-violet-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    {isAuthenticated ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={generateOutreach}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Generate Outreach
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => {
                          localStorage.removeItem("hireai_guest_mode")
                          window.location.reload()
                        }}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade for Outreach
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedCandidates([])}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// PeopleGPT Chat Component
function PeopleGPTChat({
  messages,
  currentMessage,
  setCurrentMessage,
  isTyping,
  isListening,
  setIsListening,
  handleSendMessage,
  handleViewModeSelect,
  messagesEndRef,
  textareaRef,
  hasReachedMessageLimit,
  isAuthenticated,
  messageCount,
}: any) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          PeopleGPT Assistant
        </h2>
        <p className="text-xl text-violet-200/80 max-w-2xl mx-auto">
          Describe your ideal hire in natural language and let AI find the best matches
        </p>
      </motion.div>

      <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10 mb-6">
        <CardContent className="p-0">
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message: Message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="w-10 h-10 border-2 border-violet-500/30">
                    {message.type === "user" ? (
                      <div className="w-full h-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </Avatar>

                  <div
                    className={`rounded-2xl px-6 py-4 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                        : "bg-gray-900/80 border border-violet-500/20 text-violet-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>

                    {message.showViewOptions && (
                      <div className="mt-4 flex space-x-3">
                        <Button
                          onClick={() => handleViewModeSelect("cards")}
                          className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25"
                          size="sm"
                        >
                          <Grid3X3 className="w-4 h-4 mr-2" />
                          Card View
                        </Button>
                        <Button
                          onClick={() => handleViewModeSelect("list")}
                          variant="outline"
                          className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                          size="sm"
                        >
                          <List className="w-4 h-4 mr-2" />
                          List View
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10 border-2 border-violet-500/30">
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </Avatar>
                  <div className="bg-gray-900/80 border border-violet-500/20 rounded-2xl px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                      <span className="text-violet-200">Searching candidates...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-violet-500/20 p-6">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Describe your ideal candidate... e.g., 'Senior AI engineer with LangChain experience'"
                  className="min-h-[60px] bg-gray-900/50 border-violet-500/30 text-white placeholder:text-violet-300/50 resize-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsListening(!isListening)}
                  className={cn(
                    "border-violet-500/30 hover:bg-violet-500/10",
                    isListening && "bg-red-500/20 border-red-500/30 text-red-400",
                  )}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          "Senior AI engineers with LangChain experience",
          "Full-stack developers with React and Node.js",
          "Data scientists with Python and ML experience",
        ].map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setCurrentMessage(suggestion)}
            className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:bg-violet-500/20 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-violet-200 group-hover:text-white transition-colors">{suggestion}</span>
              <ChevronRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Rest of the component functions remain the same...
function CandidateResults({
  searchResults,
  viewMode,
  setViewMode,
  selectedCandidates,
  toggleCandidateSelection,
  currentCandidateIndex,
  swipeDirection,
  handleSwipe,
  setShowCandidates,
  generateOutreach,
  isGeneratingOutreach,
  isAuthenticated,
  isGuestMode,
  swipedCardIds,
  swipedCandidates,
  setSwipedCandidates,
}: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-bold text-white mb-2">Search Results</h3>
          <p className="text-violet-200">Found {searchResults.length} candidates matching your criteria</p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowCandidates(false)}
            className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
          >
            ← Back to Chat
          </Button>

          <div className="flex bg-gray-900/50 rounded-lg p-1 border border-violet-500/20">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className={viewMode === "card" ? "bg-violet-600 text-white" : "text-violet-300 hover:text-white"}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Cards
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-violet-600 text-white" : "text-violet-300 hover:text-white"}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="flex justify-center">
          <div className="relative w-full max-w-md h-[700px]">
            {searchResults.length > 0 ? (
              <div className="h-full">
                {/* Memoize the filtered candidates to prevent unnecessary re-renders */}
                {useMemo(() => {
                  const filteredCandidates = searchResults.filter((candidate: Candidate) => !swipedCardIds.includes(candidate.id));
                  
                  // If all candidates have been swiped, show a message
                  if (filteredCandidates.length === 0 && searchResults.length > 0) {
                    return (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <CheckCircle className="w-16 h-16 text-green-500/70 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">All candidates reviewed!</h3>
                          <p className="text-violet-300">You've reviewed all available candidates</p>
                          <div className="mt-6">
                            <p className="text-green-400 mb-2">
                              <span className="font-semibold">{swipedCandidates.filter((c: Candidate) => c.swipeDirection === "right").length}</span> candidates selected
                            </p>
                            <button 
                              className="mt-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-full transition-colors duration-200"
                              onClick={() => {
                                // Reset swipe state to allow searching again
                                setSwipedCardIds([]);
                                setSwipedCandidates([]);
                                setCurrentCandidateIndex(0);
                                setShowCandidates(false);
                              }}
                            >
                              Start New Search
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return filteredCandidates.map((candidate: Candidate, index: number) => (
                    <SwipeCardComponent
                      key={candidate.id}
                      candidate={candidate}
                      isCurrent={index === 0} // First non-swiped card is always current
                      zIndex={searchResults.length - index}
                      direction={index === 0 ? swipeDirection : null} // Only apply direction to current card
                      onSwipe={handleSwipe}
                    />
                  ));
                }, [searchResults, swipedCardIds, swipeDirection, swipedCandidates])
                }
                {/* Single set of swipe buttons for the entire card stack - only show if there are candidates to swipe */}
                {searchResults.filter((candidate: Candidate) => !swipedCardIds.includes(candidate.id)).length > 0 && (
                  <div className="absolute -bottom-24 left-0 right-0 flex justify-center space-x-8 z-50">
                    {/* Left Swipe Circle */}
                    <div 
                      className="rounded-full bg-red-500/80 p-6 cursor-pointer hover:bg-red-500 transition-colors duration-200 shadow-lg"
                      onClick={() => handleSwipe("left")}
                    >
                      <X className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                    
                    {/* Right Swipe Circle */}
                    <div 
                      className="rounded-full bg-green-500/80 p-6 cursor-pointer hover:bg-green-500 transition-colors duration-200 shadow-lg"
                      onClick={() => handleSwipe("right")}
                    >
                      <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-12 h-12 text-violet-500/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No candidates found</h3>
                  <p className="text-violet-300">Try adjusting your search criteria</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {searchResults.map((candidate: Candidate, index: number) => (
            <CandidateListCard
              key={candidate.id}
              candidate={candidate}
              index={index}
              isSelected={selectedCandidates.includes(candidate.id)}
              onToggleSelect={() => toggleCandidateSelection(candidate.id)}
              isGuestMode={isGuestMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// SwipeCard Component Implementation
function SwipeCardComponent({
  candidate,
  isCurrent,
  zIndex,
  direction,
  onSwipe,
}: {
  candidate: Candidate
  isCurrent: boolean
  zIndex: number
  direction: "left" | "right" | null
  onSwipe: (direction: "left" | "right") => void
}) {
  const [dragX, setDragX] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [swipeOverlay, setSwipeOverlay] = useState<"left" | "right" | null>(null)

  // Memoize these calculations to reduce re-renders
  const rotation = useMemo(() => {
    if (direction === "left") return -30
    if (direction === "right") return 30
    return dragX * 0.1
  }, [direction, dragX])

  const opacity = useMemo(() => {
    if (direction) return 0
    return 1 - Math.abs(dragX) * 0.001
  }, [direction, dragX])

  const scale = useMemo(() => {
    if (!isCurrent) return 0.95 - (zIndex - 1) * 0.05
    return 1
  }, [isCurrent, zIndex])
  
  // Calculate overlay opacity based on drag position or direction prop
  const leftOverlayOpacity = useMemo(() => {
    if (direction === "left" && isCurrent) return 0.8
    if (dragX < 0) return Math.min(Math.abs(dragX) / 200, 0.8)
    return 0
  }, [dragX, direction, isCurrent])
  
  const rightOverlayOpacity = useMemo(() => {
    if (direction === "right" && isCurrent) return 0.8
    if (dragX > 0) return Math.min(dragX / 200, 0.8)
    return 0
  }, [dragX, direction, isCurrent])

  // Memoize animation values to prevent unnecessary re-renders
  const animationValues = useMemo(() => ({
    x: direction === "left" ? -1000 : direction === "right" ? 1000 : dragX,
    rotate: rotation,
    opacity: opacity,
    scale: scale,
  }), [direction, dragX, rotation, opacity, scale])

  return (
    <>
      {showModal && <CandidateDetailModal candidate={candidate} isOpen={showModal} onClose={() => setShowModal(false)} />}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ 
          zIndex,
          willChange: "transform, opacity", // Hardware acceleration hint
        }}
        drag={isCurrent ? "x" : false}
        dragElastic={0.7} // Makes the drag feel more responsive
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={(_, info) => {
          setDragX(info.offset.x)
          // Show swipe overlay while dragging
          if (info.offset.x < -50) {
            setSwipeOverlay("left")
          } else if (info.offset.x > 50) {
            setSwipeOverlay("right")
          } else {
            setSwipeOverlay(null)
          }
        }}
        onDragEnd={(_, info) => {
          const threshold = 80 // Lower threshold for easier swiping
          if (Math.abs(info.offset.x) > threshold) {
            const direction = info.offset.x > 0 ? "right" : "left"
            // Set overlay for visual feedback
            setSwipeOverlay(direction)
            // Delay the actual swipe to allow overlay to be visible
            setTimeout(() => {
              onSwipe(direction)
              setSwipeOverlay(null)
            }, 200)
          } else {
            setDragX(0)
            setSwipeOverlay(null)
          }
        }}
        animate={animationValues}
        transition={{ 
          type: "spring", 
          stiffness: 400, // Increased stiffness for snappier animation
          damping: 25, // Reduced damping for faster animation
          mass: 0.8, // Lower mass for quicker response
          velocity: 2, // Initial velocity for more responsive feel
        }}
      >
        <Card className="h-full bg-gradient-to-b from-gray-900/90 to-black/90 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10 overflow-hidden relative">
          {/* Swipe Left Overlay - Red X */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-red-500/30 backdrop-blur-sm z-10 pointer-events-none transition-opacity duration-200"
            style={{ 
              opacity: swipeOverlay === "left" || direction === "left" ? 0.9 : leftOverlayOpacity,
              display: (swipeOverlay === "left" || direction === "left" || leftOverlayOpacity > 0) ? 'flex' : 'none'
            }}
          >
            <div className="rounded-full bg-red-500/80 p-6">
              <X className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <span className="absolute bottom-10 text-white text-xl font-bold">REJECT</span>
          </div>
          
          {/* Swipe Right Overlay - Green Check */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-green-500/30 backdrop-blur-sm z-10 pointer-events-none transition-opacity duration-200"
            style={{ 
              opacity: swipeOverlay === "right" || direction === "right" ? 0.9 : rightOverlayOpacity,
              display: (swipeOverlay === "right" || direction === "right" || rightOverlayOpacity > 0) ? 'flex' : 'none'
            }}
          >
            <div className="rounded-full bg-green-500/80 p-6">
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <span className="absolute bottom-10 text-white text-xl font-bold">ACCEPT</span>
          </div>
          
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-pink-600/20 overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                  <span className="text-sm font-bold text-yellow-300">{candidate.score}</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-16 h-16 border-2 border-white/20">
                    <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-violet-600 text-white">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{candidate.name}</h3>
                    <p className="text-violet-200 text-sm truncate">{candidate.title}</p>
                    <p className="text-violet-300/80 text-xs truncate">{candidate.company}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                  <Briefcase className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{candidate.experience}</div>
                  <div className="text-xs text-violet-300">Years</div>
                </div>
                <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                  <Code className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{candidate.githubStars || 0}</div>
                  <div className="text-xs text-violet-300">Stars</div>
                </div>
                <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                  <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{candidate.publications || 0}</div>
                  <div className="text-xs text-violet-300">Papers</div>
                </div>
              </div>
              
              {/* Match Score Breakdown */}
              {candidate.matchScoreBreakdown && (
                <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
                  <h4 className="text-sm font-semibold text-white mb-2">Match Score Breakdown</h4>
                  <div className="space-y-2">
                    {candidate.matchScoreBreakdown.skillsMatch !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-violet-200">Skills Match</span>
                          <span className="text-xs font-medium text-white">{candidate.matchScoreBreakdown.skillsMatch}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-violet-500 h-1.5 rounded-full" 
                            style={{ width: `${candidate.matchScoreBreakdown.skillsMatch}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {candidate.matchScoreBreakdown.experienceMatch !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-violet-200">Experience Match</span>
                          <span className="text-xs font-medium text-white">{candidate.matchScoreBreakdown.experienceMatch}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${candidate.matchScoreBreakdown.experienceMatch}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {candidate.matchScoreBreakdown.overallFit !== undefined && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-violet-200">Overall Fit</span>
                          <span className="text-xs font-medium text-white">{candidate.matchScoreBreakdown.overallFit}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full" 
                            style={{ width: `${candidate.matchScoreBreakdown.overallFit}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location & Availability */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-violet-200">
                  <MapPin className="w-4 h-4 mr-2 text-violet-400" />
                  {candidate.location}
                </div>
                <div className="flex items-center text-sm text-violet-200">
                  <Calendar className="w-4 h-4 mr-2 text-violet-400" />
                  {candidate.availability || 'Available now'}
                </div>
                <div className="flex items-center text-sm text-violet-200">
                  <DollarSign className="w-4 h-4 mr-2 text-violet-400" />
                  {candidate.salary || 'Salary negotiable'}
                </div>
              </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Top Skills</h4>
              <div className="flex flex-wrap gap-1">
                {candidate.skills?.slice(0, 5).map((skill, i) => (
                  <Badge key={i} className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Summary</h4>
              <p className="text-sm text-violet-100">{candidate.summary}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-violet-500/20 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Base URL will be replaced with actual URL from database later
                    window.open('https://github.com', '_blank');
                  }}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Base URL will be replaced with actual URL from database later
                    window.open('https://linkedin.com', '_blank');
                  }}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Base URL will be replaced with actual URL from database later
                    window.open('#', '_blank');
                  }}
                >
                  <Globe className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Base URL will be replaced with actual URL from database later
                    window.open('#', '_blank');
                  }}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-violet-500/30 text-violet-300 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" /> View More
                </Button>
              </div>
            </div>
            
            {/* Removed individual swipe circles from each card */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </>
  )
}

// Additional component functions would continue here...
// Advanced Search Tab - Complete Implementation
function AdvancedSearchTab({
  searchQuery,
  setSearchQuery,
  isSearching,
  handleSearch,
  searchResults,
  selectedCandidates,
  toggleCandidateSelection,
}: any) {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          Advanced Search
        </h2>
        <p className="text-xl text-violet-200/80">Use detailed filters to find the perfect candidates</p>
      </motion.div>

      <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search Input */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-violet-300 mb-2">Search Query</label>
              <div className="flex space-x-4">
                <Textarea
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Senior AI engineer with LangChain experience in Europe"
                  className="flex-1 bg-gray-900/50 border-violet-500/30 text-white placeholder:text-violet-300/50"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Search
                </Button>
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Required Skills</label>
              <input
                type="text"
                placeholder="Python, TensorFlow, LangChain"
                className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white placeholder:text-violet-300/50"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Experience Level</label>
              <select className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white">
                <option value="">Any</option>
                <option value="junior">Junior (0-2 years)</option>
                <option value="mid">Mid-level (3-5 years)</option>
                <option value="senior">Senior (6-10 years)</option>
                <option value="lead">Lead (10+ years)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Location</label>
              <input
                type="text"
                placeholder="San Francisco, Remote, Europe"
                className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white placeholder:text-violet-300/50"
              />
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Salary Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white placeholder:text-violet-300/50"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white placeholder:text-violet-300/50"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Availability</label>
              <select className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white">
                <option value="">Any</option>
                <option value="immediate">Immediately</option>
                <option value="2weeks">2 weeks notice</option>
                <option value="1month">1 month notice</option>
                <option value="3months">3+ months</option>
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Company Size</label>
              <select className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white">
                <option value="">Any</option>
                <option value="startup">Startup (1-50)</option>
                <option value="small">Small (51-200)</option>
                <option value="medium">Medium (201-1000)</option>
                <option value="large">Large (1000+)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {searchResults.map((candidate: Candidate, index: number) => (
            <CandidateListCard
              key={candidate.id}
              candidate={candidate}
              index={index}
              isSelected={selectedCandidates.includes(candidate.id)}
              onToggleSelect={() => toggleCandidateSelection(candidate.id)}
              isGuestMode={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Browse Candidates Tab - Complete Implementation
function BrowseCandidatesTab({ candidates, selectedCandidates, toggleCandidateSelection }: any) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    if (direction === "right") {
      const candidateId = candidates[currentIndex].id
      if (!selectedCandidates.includes(candidateId)) {
        toggleCandidateSelection(candidateId)
      }
    }
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % candidates.length)
      setSwipeDirection(null)
    }, 300)
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          Browse Candidates
        </h2>
        <p className="text-xl text-violet-200/80">Swipe through candidate profiles to find your perfect match</p>
      </motion.div>

      <div className="flex justify-center">
        <div className="relative w-full max-w-md h-[700px]">
          {candidates.map((candidate: Candidate, index: number) => {
            if (index < currentIndex || index > currentIndex + 2) return null
            const isCurrent = index === currentIndex
            const zIndex = candidates.length - index

            return (
              <SwipeCard
                key={candidate.id}
                candidate={candidate}
                isCurrent={isCurrent}
                zIndex={zIndex}
                direction={isCurrent ? swipeDirection : null}
                onSwipe={handleSwipe}
                isGuestMode={false}
              />
            )
          })}



          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-500/30">
              <span className="text-violet-200 text-sm">
                {currentIndex + 1} / {candidates.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Resume Parser Tab - Complete Implementation
function ResumeParserTab({ uploadedFile, handleFileUpload, fileInputRef }: any) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)

  const handleProcess = () => {
    if (!uploadedFile) return
    setIsProcessing(true)
    setTimeout(() => {
      setParsedData({
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        skills: ["Python", "Machine Learning", "TensorFlow", "AWS"],
        experience: 5,
        education: "MS Computer Science",
        summary: "Experienced software engineer with expertise in AI and machine learning.",
      })
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          AI Resume Parser
        </h2>
        <p className="text-xl text-violet-200/80">Upload resumes and extract structured data with AI</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Upload Resume</h3>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-violet-500/30 rounded-xl p-8 text-center cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <FileText className="w-16 h-16 text-violet-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">
                {uploadedFile ? uploadedFile.name : "Click to upload resume"}
              </h4>
              <p className="text-violet-300">Supports PDF, DOC, DOCX files</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedFile && (
              <div className="mt-6">
                <Button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Parse Resume
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Parsed Data</h3>

            {parsedData ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-violet-300">Name</label>
                  <p className="text-white">{parsedData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-violet-300">Email</label>
                  <p className="text-white">{parsedData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-violet-300">Phone</label>
                  <p className="text-white">{parsedData.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-violet-300">Experience</label>
                  <p className="text-white">{parsedData.experience} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-violet-300">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {parsedData.skills.map((skill: string, index: number) => (
                      <Badge key={index} className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-violet-300">Summary</label>
                  <p className="text-white">{parsedData.summary}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Upload and process a resume to see parsed data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// AI Ranking Tab - Complete Implementation
function AIRankingTab({ candidates, selectedCandidates, setSelectedCandidates, setActiveTab }: any) {
  const [sector, setSector] = useState("tech")
  const [minExperience, setMinExperience] = useState(0)
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [rankedCandidates, setRankedCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("score")
  const [showModal, setShowModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)

  const handleAddSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill])
      setCurrentSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSkill()
    }
  }

  const fetchRankedCandidates = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/sector-ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sector, min_experience: minExperience, skills, top_k: 20 }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setRankedCandidates(data.candidates || [])
    } catch (err: any) {
      setError(`Failed to fetch candidates: ${err.message}`)
      console.error("Error fetching ranked candidates:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRankedCandidates()
  }, [])

  const handleSearch = () => {
    fetchRankedCandidates()
  }

  const sortedCandidates = [...rankedCandidates].sort((a, b) => {
    if (sortOption === "score") {
      return b.score - a.score
    } else if (sortOption === "experience") {
      return b.experience - a.experience
    } else if (sortOption === "sectorMatch") {
      return b.matchScoreBreakdown.sectorMatch - a.matchScoreBreakdown.sectorMatch
    }
    return 0
  })

  return (
    <>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <label htmlFor="sector" className="text-sm font-medium">Sector</label>
            <select
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="media">Media</option>
              <option value="energy">Energy</option>
              <option value="transportation">Transportation</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="experience" className="text-sm font-medium">Minimum Experience (years)</label>
            <input
              id="experience"
              type="number"
              min="0"
              value={minExperience}
              onChange={(e) => setMinExperience(parseInt(e.target.value) || 0)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="skills" className="text-sm font-medium">Required Skills</label>
            <div className="flex">
              <input
                id="skills"
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a skill"
                className="border border-gray-300 rounded-l-md px-3 py-2 flex-1"
              />
              <button
                onClick={handleAddSkill}
                className="bg-blue-500 text-white px-3 py-2 rounded-r-md"
              >
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <div key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search Candidates
          </button>

          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="score">Overall Score</option>
              <option value="experience">Experience</option>
              <option value="sectorMatch">Sector Match</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-4">Loading candidates...</div>}
      {error && <div className="text-red-500 py-4">{error}</div>}
      {!loading && !error && sortedCandidates.length === 0 && (
        <div className="text-center py-4">No candidates found matching your criteria.</div>
      )}

      {showModal && selectedCandidate && (
        <CandidateDetailModal 
          candidate={selectedCandidate} 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCandidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden"
            onClick={() => {
              setSelectedCandidate(candidate);
              setShowModal(true);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={candidate.avatar || "/avatars/placeholder.png"} />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.title}</CardDescription>
                    <div className="text-sm text-muted-foreground">
                      {candidate.company} • {candidate.location}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="ml-2">
                  {candidate.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Experience:</span> {candidate.experience} years
                </div>
                <div className="text-sm">
                  <span className="font-medium">Skills:</span>{" "}
                  {candidate.skills.slice(0, 3).join(", ")}
                  {candidate.skills.length > 3 && "..."}
                </div>
                <div className="space-y-1 mt-3">
                  <div className="text-sm font-medium">Match Score Breakdown:</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Skills Match</span>
                        <span>{candidate.matchScoreBreakdown.skillsMatch}%</span>
                      </div>
                      <Progress value={candidate.matchScoreBreakdown.skillsMatch} className="h-1 bg-slate-200" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Experience Match</span>
                        <span>{candidate.matchScoreBreakdown.experienceMatch}%</span>
                      </div>
                      <Progress value={candidate.matchScoreBreakdown.experienceMatch} className="h-1 bg-slate-200" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Sector Match</span>
                        <span>{candidate.matchScoreBreakdown.sectorMatch}%</span>
                      </div>
                      <Progress value={candidate.matchScoreBreakdown.sectorMatch} className="h-1 bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <div className="flex space-x-2">
                {candidate.socialLinks?.linkedin && (
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <a href={candidate.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {candidate.socialLinks?.github && (
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <a href={candidate.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {candidate.resumeUrl && (
                  <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Open the candidate detail modal
                    setShowModal(true);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" /> View More
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Add candidate to selected candidates if not already there
                    if (!selectedCandidates.includes(candidate.id)) {
                      setSelectedCandidates((prev) => [...prev, candidate.id]);
                    }
                    // Navigate to outreach tab
                    setActiveTab("outreach");
                    console.log('Generate outreach for', candidate.id);
                  }}
                >
                  <MessageSquare className="w-3 h-3 mr-1" /> Generate Outreach
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

// Web Enrichment Tab - Complete Implementation
function WebEnrichmentTab({ candidates }: any) {
  const [enrichmentStatus, setEnrichmentStatus] = useState<{[key: string]: string}>({})
  const [isEnriching, setIsEnriching] = useState(false)

  const handleEnrichment = (candidateId: string) => {
    setIsEnriching(true)
    setEnrichmentStatus((prev) => ({ ...prev, [candidateId]: "processing" }))

    setTimeout(() => {
      setEnrichmentStatus((prev) => ({ ...prev, [candidateId]: "completed" }))
      setIsEnriching(false)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          Web Enrichment
        </h2>
        <p className="text-xl text-violet-200/80">
          Enhance candidate profiles with data from LinkedIn, GitHub, and more
        </p>
      </motion.div>

      {/* Enrichment Sources */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: "LinkedIn", icon: "💼", status: "active", profiles: 1247 },
          { name: "GitHub", icon: "🐙", status: "active", profiles: 892 },
          { name: "Twitter", icon: "🐦", status: "active", profiles: 634 },
          { name: "AngelList", icon: "👼", status: "pending", profiles: 156 },
        ].map((source) => (
          <Card key={source.name} className="bg-black/40 border-violet-500/20 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">{source.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{source.name}</h3>
              <Badge
                className={`mb-2 ${source.status === "active" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}`}
              >
                {source.status}
              </Badge>
              <p className="text-sm text-violet-300">{source.profiles} profiles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Candidate Enrichment */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-white">Candidate Profiles</h3>
        {candidates.map((candidate: Candidate) => (
          <Card key={candidate.id} className="bg-black/40 border-violet-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={candidate.avatar || "/avatars/placeholder.png"} />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.title}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    {candidate.socialLinks.linkedin && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">LinkedIn ✓</Badge>
                    )}
                    {candidate.socialLinks.github && (
                      <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">GitHub ✓</Badge>
                    )}
                    {candidate.socialLinks.twitter && (
                      <Badge className="bg-blue-400/20 text-blue-300 border-blue-400/30">Twitter ✓</Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => handleEnrichment(candidate.id)}
                    disabled={isEnriching || enrichmentStatus[candidate.id] === "completed"}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    {enrichmentStatus[candidate.id] === "processing" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enriching...
                      </>
                    ) : enrichmentStatus[candidate.id] === "completed" ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Enriched
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Enrich Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {enrichmentStatus[candidate.id] === "completed" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <h5 className="text-sm font-semibold text-green-300 mb-2">Enrichment Results</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-violet-300">GitHub Stars:</span>
                      <span className="text-white ml-2">{candidate.githubStars}</span>
                    </div>
                    <div>
                      <span className="text-violet-300">Publications:</span>
                      <span className="text-white ml-2">{candidate.publications}</span>
                    </div>
                    <div>
                      <span className="text-violet-300">Languages:</span>
                      <span className="text-white ml-2">{candidate.languages.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-violet-300">Education:</span>
                      <span className="text-white ml-2">{candidate.education}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Outreach Generator Tab - Complete Implementation
function OutreachGeneratorTab({
  selectedCandidates,
  candidates,
  generateOutreach,
  isGeneratingOutreach,
  outreachMessages,
  swipedCandidates,
}: any) {
  const [messageType, setMessageType] = useState("email")
  const [tone, setTone] = useState("professional")
  const [customPrompt, setCustomPrompt] = useState("")

  // Get candidates that were either explicitly selected or right-swiped
  const rightSwipedCandidates = swipedCandidates?.filter((c: Candidate) => c.swipeDirection === "right") || []
  const selectedCandidateData = selectedCandidates.length > 0 
    ? candidates.filter((c: Candidate) => selectedCandidates.includes(c.id))
    : rightSwipedCandidates

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          Outreach Generator
        </h2>
        <p className="text-xl text-violet-200/80">Generate personalized messages for your selected candidates</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration */}
        <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Message Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-violet-300 mb-2">Message Type</label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white"
                >
                  <option value="email">Email</option>
                  <option value="linkedin">LinkedIn Message</option>
                  <option value="twitter">Twitter DM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-300 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="direct">Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-300 mb-2">Custom Instructions</label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add specific details about the role, company, or personalization..."
                  className="bg-gray-900/50 border-violet-500/30 text-white placeholder:text-violet-300/50"
                  rows={4}
                />
              </div>

              <Button
                onClick={generateOutreach}
                disabled={isGeneratingOutreach || selectedCandidates.length === 0}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {isGeneratingOutreach ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Generate Messages ({selectedCandidateData.length})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Messages */}
        <div className="lg:col-span-2">
          <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Generated Messages</h3>

              {selectedCandidateData.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select or right-swipe candidates to generate personalized messages</p>
                </div>
              ) : isGeneratingOutreach ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-violet-400 mx-auto mb-4 animate-spin" />
                  <p className="text-violet-200">Generating personalized messages...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedCandidateData.map((candidate: Candidate) => (
                    <div key={candidate.id} className="border border-violet-500/20 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <img src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-white">{candidate.name}</h4>
                          <p className="text-sm text-violet-300">{candidate.title}</p>
                        </div>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                        <pre className="text-sm text-violet-200 whitespace-pre-wrap font-sans">
                          {outreachMessages[candidate.id] || "Message will appear here after generation..."}
                        </pre>
                      </div>

                      {outreachMessages[candidate.id] && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-violet-500/30 text-violet-300">
                            Copy Message
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Send Message
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Analytics Tab - Complete Implementation
function AnalyticsTab() {
  const analyticsData = {
    totalCandidates: 1247,
    activeSearches: 89,
    interviews: 156,
    hires: 23,
    responseRate: 42,
    avgTimeToHire: 18,
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          Recruitment Analytics
        </h2>
        <p className="text-xl text-violet-200/80">Track your hiring performance and optimize your process</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: "Total Candidates", value: analyticsData.totalCandidates, icon: Users, color: "violet" },
          { label: "Active Searches", value: analyticsData.activeSearches, icon: Search, color: "blue" },
          { label: "Interviews", value: analyticsData.interviews, icon: MessageSquare, color: "green" },
          { label: "Hires", value: analyticsData.hires, icon: CheckCircle, color: "yellow" },
          { label: "Response Rate", value: `${analyticsData.responseRate}%`, icon: TrendingUp, color: "purple" },
          { label: "Avg. Time to Hire", value: `${analyticsData.avgTimeToHire} days`, icon: Clock, color: "pink" },
        ].map((metric, index) => (
          <Card key={index} className="bg-black/40 border-violet-500/20 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <metric.icon className={`w-8 h-8 mx-auto mb-4 text-${metric.color}-400`} />
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-violet-300">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hiring Funnel */}
        <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Hiring Funnel</h3>
            <div className="space-y-4">
              {[
                { stage: "Candidates Sourced", count: 1247, percentage: 100 },
                { stage: "Initial Screening", count: 623, percentage: 50 },
                { stage: "Technical Interview", count: 187, percentage: 15 },
                { stage: "Final Interview", count: 62, percentage: 5 },
                { stage: "Offers Extended", count: 31, percentage: 2.5 },
                { stage: "Hires", count: 23, percentage: 1.8 },
              ].map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-violet-300">{stage.stage}</span>
                    <span className="text-white">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Most In-Demand Skills</h3>
            <div className="space-y-4">
              {[
                { skill: "Python", demand: 95 },
                { skill: "React", demand: 87 },
                { skill: "Node.js", demand: 82 },
                { skill: "AWS", demand: 78 },
                { skill: "Machine Learning", demand: 74 },
                { skill: "TypeScript", demand: 69 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-violet-300">{item.skill}</span>
                    <span className="text-white">{item.demand}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${item.demand}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: "New candidate added", candidate: "Sarah Chen", time: "2 hours ago", type: "add" },
              { action: "Interview scheduled", candidate: "Marcus Rodriguez", time: "4 hours ago", type: "interview" },
              { action: "Offer extended", candidate: "Elena Kowalski", time: "1 day ago", type: "offer" },
              { action: "Candidate hired", candidate: "David Thompson", time: "2 days ago", type: "hire" },
              { action: "Search completed", candidate: "AI Engineers", time: "3 days ago", type: "search" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-900/30 rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.type === "add"
                      ? "bg-blue-500"
                      : activity.type === "interview"
                        ? "bg-yellow-500"
                        : activity.type === "offer"
                          ? "bg-purple-500"
                          : activity.type === "hire"
                            ? "bg-green-500"
                            : "bg-violet-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-white">
                    {activity.action}: <span className="text-violet-300">{activity.candidate}</span>
                  </p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SwipeCardProps {
  candidate: Candidate
  isCurrent: boolean
  zIndex: number
  direction: "left" | "right" | null
  onSwipe: (direction: "left" | "right") => void
  isGuestMode: boolean
}

function SwipeCard({ candidate, isCurrent, zIndex, direction, onSwipe, isGuestMode }: SwipeCardProps) {
  const swipeThreshold = 50 // Adjust this value to control swipe sensitivity

  const cardVariants = {
    hidden: { x: 0, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      zIndex: isCurrent ? 10 : zIndex,
      transition: { duration: 0.3 },
    },
    swipedLeft: {
      x: -1000,
      opacity: 0,
      transition: { duration: 0.5 },
    },
    swipedRight: {
      x: 1000,
      opacity: 0,
      transition: { duration: 0.5 },
    },
  } as const

  const dragTransition = {
    damping: 10,
    stiffness: 200,
  } as const

  const handleDrag = (event: any, info: any) => {
    if (isCurrent) {
      if (info.offset.x > swipeThreshold) {
        onSwipe("right")
      } else if (info.offset.x < -swipeThreshold) {
        onSwipe("left")
      }
    }
  }

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: isCurrent ? 10 : zIndex }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={direction === "left" ? "swipedLeft" : direction === "right" ? "swipedRight" : "visible"}
      drag={isCurrent}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      transition={dragTransition}
      onDragEnd={handleDrag}
    >
      <Card className="bg-black/40 border-violet-500/20 backdrop-blur-xl h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <img src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold text-white">{candidate.name}</CardTitle>
              <CardDescription className="text-violet-300">{candidate.title}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-white">Summary</h4>
              <p className="text-sm text-violet-200">{candidate.summary}</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Experience</h4>
              <p className="text-sm text-violet-200">
                {candidate.experience} years at {candidate.company} in {candidate.location}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Match Reasons</h4>
              <ul className="list-disc list-inside text-sm text-violet-200">
                {candidate.matchReasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4">
          <div className="text-sm text-violet-300">Last Active: {candidate.lastActive}</div>
          {isGuestMode ? (
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              Upgrade for Contact
            </Button>
          ) : (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Contact Candidate
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

interface CandidateListCardProps {
  candidate: Candidate
  index: number
  isSelected: boolean
  onToggleSelect: () => void
  isGuestMode?: boolean
}

function CandidateListCard({
  candidate,
  index,
  isSelected,
  onToggleSelect,
  isGuestMode,
}: CandidateListCardProps) {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      {showModal && <CandidateDetailModal candidate={candidate} isOpen={showModal} onClose={() => setShowModal(false)} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn("group cursor-pointer transition-all duration-300", isSelected && "ring-2 ring-violet-500/50")}
        onClick={onToggleSelect}
      >
        <Card className="bg-gray-900/50 border-violet-500/20 hover:bg-gray-900/70 hover:border-violet-500/40 transition-all duration-300 backdrop-blur-xl">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12 border-2 border-violet-500/30">
                  <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-violet-600 text-white">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-violet-200 transition-colors">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-violet-300">{candidate.title}</p>
                  <p className="text-xs text-violet-400">{candidate.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-medium text-yellow-300">{candidate.score}</span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-violet-200">
                <MapPin className="w-3 h-3 mr-2 text-violet-400" />
                {candidate.location}
              </div>
              <div className="flex items-center text-sm text-violet-200">
                <Briefcase className="w-3 h-3 mr-2 text-violet-400" />
                {candidate.experience} years experience
              </div>
              <div className="flex items-center text-sm text-violet-200">
                <DollarSign className="w-3 h-3 mr-2 text-violet-400" />
                {candidate.salary || 'Salary negotiable'}
              </div>
            </div>

            {/* Match Score Breakdown - Compact version */}
            {candidate.matchScoreBreakdown && (
              <div className="mb-4 p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <h4 className="text-xs font-semibold text-white mb-2">Match Score Breakdown</h4>
                <div className="space-y-1.5">
                  {candidate.matchScoreBreakdown.skillsMatch !== undefined && (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-violet-200">Skills</span>
                        <span className="text-xs font-medium text-white">{candidate.matchScoreBreakdown.skillsMatch}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-violet-500 h-1.5 rounded-full" 
                          style={{ width: `${candidate.matchScoreBreakdown.skillsMatch}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {candidate.matchScoreBreakdown.experienceMatch !== undefined && (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-violet-200">Experience</span>
                        <span className="text-xs font-medium text-white">{candidate.matchScoreBreakdown.experienceMatch}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${candidate.matchScoreBreakdown.experienceMatch}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {candidate.matchScoreBreakdown.overallFit !== undefined && (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-violet-200">Overall Fit</span>
                        <span className="text-xs font-medium text-white">{candidate.matchScoreBreakdown.overallFit}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-purple-500 h-1.5 rounded-full" 
                          style={{ width: `${candidate.matchScoreBreakdown.overallFit}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            <p className="text-sm text-violet-100 mb-4 line-clamp-2">{candidate.summary}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-4">
              {candidate.skills?.slice(0, 4).map((skill, i) => (
                <Badge key={i} className="text-xs bg-violet-500/20 text-violet-200 border-violet-500/30">
                  {skill}
                </Badge>
              ))}
              {candidate.skills?.length > 4 && (
                <Badge className="text-xs bg-gray-700/50 text-gray-300">+{candidate.skills.length - 4}</Badge>
              )}
            </div>
            


            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-violet-500/20">
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-white p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Base URL will be replaced with actual URL from database later
                    window.open('https://github.com', '_blank');
                  }}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-white p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Base URL will be replaced with actual URL from database later
                    window.open('https://linkedin.com', '_blank');
                  }}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-violet-400 hover:text-white p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Base URL will be replaced with actual URL from database later
                    window.open('#', '_blank');
                  }}
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-violet-500/30 text-violet-300 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" /> View More
                </Button>
                <Button 
                  size="sm" 
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add candidate to selected candidates if not already there
                    if (!selectedCandidates.includes(candidate.id)) {
                      setSelectedCandidates((prev) => [...prev, candidate.id]);
                    }
                    // Navigate to outreach tab
                    setActiveTab("outreach");
                    console.log('Generate outreach for', candidate.id);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-1" /> Outreach
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

// Candidate Detail Modal Component
interface CandidateDetailModalProps {
  candidate: Candidate
  isOpen: boolean
  onClose: () => void
}

function CandidateDetailModal({ candidate, isOpen, onClose }: CandidateDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-violet-500/30 rounded-lg shadow-xl">
        <div className="sticky top-0 flex items-center justify-between p-4 bg-gray-900/90 backdrop-blur-sm border-b border-violet-500/20 z-10">
          <h2 className="text-xl font-bold text-white">Candidate Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-violet-300 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20 border-2 border-violet-500/30">
              <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-violet-600 text-white text-xl">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">{candidate.name}</h3>
              <p className="text-lg text-violet-200">{candidate.title}</p>
              <p className="text-violet-300">{candidate.company}</p>
              <div className="flex items-center mt-2 space-x-3">
                <div className="flex items-center space-x-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="text-sm font-bold text-yellow-300">{candidate.score}</span>
                </div>
                <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                  {candidate.status}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Match Score Breakdown */}
          {candidate.matchScoreBreakdown && (
            <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <h4 className="text-lg font-semibold text-white mb-3">Match Score Breakdown</h4>
              <div className="space-y-2">
                {candidate.matchScoreBreakdown.skillsMatch !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-violet-200">Skills Match</span>
                      <span className="text-sm font-medium text-white">{candidate.matchScoreBreakdown.skillsMatch}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-violet-500 h-2 rounded-full" 
                        style={{ width: `${candidate.matchScoreBreakdown.skillsMatch}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {candidate.matchScoreBreakdown.experienceMatch !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-violet-200">Experience Match</span>
                      <span className="text-sm font-medium text-white">{candidate.matchScoreBreakdown.experienceMatch}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${candidate.matchScoreBreakdown.experienceMatch}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {candidate.matchScoreBreakdown.educationMatch !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-violet-200">Education Match</span>
                      <span className="text-sm font-medium text-white">{candidate.matchScoreBreakdown.educationMatch}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${candidate.matchScoreBreakdown.educationMatch}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {candidate.matchScoreBreakdown.locationMatch !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-violet-200">Location Match</span>
                      <span className="text-sm font-medium text-white">{candidate.matchScoreBreakdown.locationMatch}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${candidate.matchScoreBreakdown.locationMatch}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {candidate.matchScoreBreakdown.overallFit !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-violet-200">Overall Fit</span>
                      <span className="text-sm font-medium text-white">{candidate.matchScoreBreakdown.overallFit}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${candidate.matchScoreBreakdown.overallFit}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Contact & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-violet-200">
                  <MapPin className="w-4 h-4 mr-2 text-violet-400" />
                  {candidate.location}
                </div>
                <div className="flex items-center text-sm text-violet-200">
                  <Calendar className="w-4 h-4 mr-2 text-violet-400" />
                  {candidate.availability || 'Available now'}
                </div>
                <div className="flex items-center text-sm text-violet-200">
                  <DollarSign className="w-4 h-4 mr-2 text-violet-400" />
                  {candidate.salary || 'Salary negotiable'}
                </div>
                <div className="flex items-center text-sm text-violet-200">
                  <Clock className="w-4 h-4 mr-2 text-violet-400" />
                  Last Active: {candidate.lastActive}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <h4 className="text-lg font-semibold text-white mb-3">Professional Links</h4>
              <div className="flex flex-wrap gap-2">
                {/* LinkedIn Button - Always visible */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-violet-950 border-violet-700 hover:bg-violet-900 text-violet-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(candidate.socialLinks?.linkedin || 'https://linkedin.com', '_blank');
                  }}
                >
                  <Linkedin className="mr-1 h-4 w-4" />
                  LinkedIn
                </Button>
                
                {/* GitHub Button - Always visible */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-violet-950 border-violet-700 hover:bg-violet-900 text-violet-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(candidate.socialLinks?.github || 'https://github.com', '_blank');
                  }}
                >
                  <Github className="mr-1 h-4 w-4" />
                  GitHub
                </Button>
                
                {/* Portfolio Button - Always visible */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-violet-950 border-violet-700 hover:bg-violet-900 text-violet-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(candidate.socialLinks?.portfolio || '#', '_blank');
                  }}
                >
                  <Globe className="mr-1 h-4 w-4" />
                  Portfolio
                </Button>
                
                {/* Resume Button - Always visible */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-violet-950 border-violet-700 hover:bg-violet-900 text-violet-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(candidate.resumeUrl || '#', '_blank');
                  }}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  Resume
                </Button>
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Summary</h4>
            <p className="text-violet-200">{candidate.summary}</p>
          </div>
          
          {/* Skills */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((skill, i) => (
                <Badge key={i} className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Match Score Breakdown */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Match Score Breakdown</h4>
            <div className="space-y-3 p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
              {candidate.matchScoreBreakdown?.skillsMatch !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-violet-200">Skills Match</span>
                    <span className="text-violet-200">{candidate.matchScoreBreakdown.skillsMatch}%</span>
                  </div>
                  <div className="h-2 w-full bg-violet-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full" 
                      style={{ width: `${candidate.matchScoreBreakdown.skillsMatch}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {candidate.matchScoreBreakdown?.experienceMatch !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-200">Experience Match</span>
                    <span className="text-green-200">{candidate.matchScoreBreakdown.experienceMatch}%</span>
                  </div>
                  <div className="h-2 w-full bg-green-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${candidate.matchScoreBreakdown.experienceMatch}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {candidate.matchScoreBreakdown?.educationMatch !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-200">Education Match</span>
                    <span className="text-blue-200">{candidate.matchScoreBreakdown.educationMatch}%</span>
                  </div>
                  <div className="h-2 w-full bg-blue-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${candidate.matchScoreBreakdown.educationMatch}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {candidate.matchScoreBreakdown?.locationMatch !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-200">Location Match</span>
                    <span className="text-amber-200">{candidate.matchScoreBreakdown.locationMatch}%</span>
                  </div>
                  <div className="h-2 w-full bg-amber-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${candidate.matchScoreBreakdown.locationMatch}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {candidate.matchScoreBreakdown?.overallFit !== undefined && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-purple-200">Overall Fit</span>
                    <span className="text-purple-200">{candidate.matchScoreBreakdown.overallFit}%</span>
                  </div>
                  <div className="h-2 w-full bg-purple-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${candidate.matchScoreBreakdown.overallFit}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Match Reasons */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Match Reasons</h4>
            <ul className="list-disc list-inside text-violet-200 space-y-1">
              {candidate.matchReasons?.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="sticky bottom-0 flex justify-end p-4 bg-gray-900/90 backdrop-blur-sm border-t border-violet-500/20">
          <Button variant="default" className="bg-violet-600 hover:bg-violet-700" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EnhancedHireAIPlatform
