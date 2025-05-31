"use client"

import { useState, useRef, useEffect } from "react"
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
  Star,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Github,
  Linkedin,
  Eye,
  MessageSquare,
  ChevronRight,
  Target,
  Award,
  Code,
  CheckCircle,
  XCircle,
  Globe,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

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
  socialLinks: {
    github?: string
    linkedin?: string
    portfolio?: string
  }
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior AI Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    experience: 6,
    skills: ["LangChain", "RAG", "Python", "TensorFlow", "OpenAI API", "Vector Databases"],
    score: 95,
    avatar: "/placeholder.svg?height=400&width=400",
    summary:
      "Experienced AI engineer specializing in RAG systems and LangChain applications. Built production-scale AI systems for fintech and healthcare with 99.9% uptime.",
    salary: "$140,000 - $180,000",
    availability: "Open to new opportunities",
    lastActive: "2 hours ago",
    matchReasons: [
      "Expert in LangChain and RAG systems",
      "6+ years of AI/ML experience",
      "Strong Python and TensorFlow background",
      "Production experience with vector databases",
    ],
    githubStars: 1200,
    publications: 3,
    socialLinks: {
      github: "https://github.com/sarahchen",
      linkedin: "https://linkedin.com/in/sarahchen",
      portfolio: "https://sarahchen.dev",
    },
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    title: "GenAI Research Scientist",
    company: "AI Research Lab",
    location: "New York, NY",
    experience: 8,
    skills: ["Transformers", "LangChain", "PyTorch", "Hugging Face", "RLHF", "Fine-tuning"],
    score: 92,
    avatar: "/placeholder.svg?height=400&width=400",
    summary:
      "Research scientist with deep expertise in transformer architectures and retrieval-augmented generation. Published 15+ papers in top AI conferences.",
    salary: "$160,000 - $220,000",
    availability: "Available for consulting",
    lastActive: "1 day ago",
    matchReasons: [
      "PhD in AI with 15+ publications",
      "Expert in transformer architectures",
      "Strong LangChain and RAG experience",
      "Research background in RLHF and fine-tuning",
    ],
    githubStars: 5000,
    publications: 15,
    socialLinks: {
      github: "https://github.com/marcusr",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
    },
  },
  {
    id: "3",
    name: "Elena Kowalski",
    title: "AI Product Engineer",
    company: "StartupAI",
    location: "Austin, TX",
    experience: 5,
    skills: ["LangChain", "FastAPI", "React", "Vector Databases", "AWS", "Product Development"],
    score: 88,
    avatar: "/placeholder.svg?height=400&width=400",
    summary:
      "Full-stack AI engineer building user-facing AI products. Expert in integrating LLMs into production applications with focus on scalability and UX.",
    salary: "$120,000 - $160,000",
    availability: "Open to full-time and contract",
    lastActive: "3 hours ago",
    matchReasons: [
      "Strong product engineering background",
      "Experience with LangChain in production",
      "Full-stack development skills",
      "Proven track record with AI products",
    ],
    githubStars: 800,
    publications: 1,
    socialLinks: {
      github: "https://github.com/elenakowalski",
      linkedin: "https://linkedin.com/in/elenakowalski",
      portfolio: "https://elenakowalski.dev",
    },
  },
]

export function PeopleGPTInterface() {
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
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [showCandidates, setShowCandidates] = useState(false)
  const [searchResults, setSearchResults] = useState<Candidate[]>([])
  const [messageCount, setMessageCount] = useState(0)
  const [hasReachedMessageLimit, setHasReachedMessageLimit] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsTyping(true)
    setMessageCount((prevCount) => prevCount + 1)

    if (messageCount >= 3) {
      setHasReachedMessageLimit(true)
    }

    // Simulate AI processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I found ${mockCandidates.length} excellent candidates matching your criteria for "${currentMessage}". These professionals have strong backgrounds in the areas you mentioned. Would you like to view them as cards for quick swiping or as a detailed list?`,
        timestamp: new Date(),
        candidates: mockCandidates,
        showViewOptions: true,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setSearchResults(mockCandidates)
      setIsTyping(false)
    }, 2000)
  }

  const handleViewModeSelect = (mode: "cards" | "list") => {
    setViewMode(mode)
    setShowCandidates(true)
  }

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)

    if (direction === "right") {
      const candidateId = searchResults[currentCandidateIndex].id
      if (!selectedCandidates.includes(candidateId)) {
        setSelectedCandidates((prev) => [...prev, candidateId])
      }
    }

    setTimeout(() => {
      setCurrentCandidateIndex((prev) => (prev + 1) % searchResults.length)
      setSwipeDirection(null)
    }, 300)
  }

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId],
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-violet-950/20 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px] animate-pulse delay-500" />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-violet-500/20 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                  PeopleGPT
                </h1>
                <p className="text-xs text-violet-300">AI-Powered Talent Search</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
              {selectedCandidates.length > 0 && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                  {selectedCandidates.length} Selected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {!showCandidates ? (
          /* Chat Interface */
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
          /* Candidate Results */
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
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    </div>
  )
}

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

        {/* {!isAuthenticated && ( */}
        <div className="mt-4 inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-300 text-sm">
              {messageCount}/3 messages used {hasReachedMessageLimit && "- Limit reached"}
            </span>
            <div className="w-24 bg-gray-700 h-1 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-red-500 h-full rounded-full"
                style={{ width: `${(messageCount / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        {/* )} */}
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
                      <div className="w-full h-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
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
                  placeholder={
                    hasReachedMessageLimit
                      ? "Message limit reached. Please sign in to continue."
                      : "Describe your ideal candidate..."
                  }
                  className="min-h-[60px] bg-gray-900/50 border-violet-500/30 text-white placeholder:text-violet-300/50 resize-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={hasReachedMessageLimit}
                />

                {hasReachedMessageLimit && (
                  <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-md">
                    <div className="text-center p-4">
                      <span className="text-red-400 font-medium">Message limit reached</span>
                      <p className="text-xs text-gray-400 mt-1">Please sign in to continue</p>
                    </div>
                  </div>
                )}
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
                  disabled={hasReachedMessageLimit}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping || hasReachedMessageLimit}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* {!isAuthenticated && ( */}
            <div className="mt-4 text-center">
              <p className="text-sm text-violet-300">
                <span className="text-yellow-300">{messageCount}/3</span> messages used.{" "}
                <span className="text-violet-200 font-medium">Sign in for unlimited access.</span>
              </p>
            </div>
            {/* )} */}
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
            disabled={hasReachedMessageLimit}
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
  isAuthenticated,
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
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className={viewMode === "cards" ? "bg-violet-600 text-white" : "text-violet-300 hover:text-white"}
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

      {viewMode === "cards" ? (
        <div className="flex justify-center">
          <div className="relative w-full max-w-md h-[700px]">
            {searchResults.map((candidate: Candidate, index: number) => {
              if (index < currentCandidateIndex || index > currentCandidateIndex + 2) return null

              const isCurrent = index === currentCandidateIndex
              const zIndex = searchResults.length - index

              return (
                <SwipeCard
                  key={candidate.id}
                  candidate={candidate}
                  isCurrent={isCurrent}
                  zIndex={zIndex}
                  direction={isCurrent ? swipeDirection : null}
                  onSwipe={handleSwipe}
                />
              )
            })}

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6">
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleSwipe("left")}
                className="w-16 h-16 rounded-full border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all"
              >
                <XCircle className="w-8 h-8" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleSwipe("right")}
                className="w-16 h-16 rounded-full border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:scale-110 transition-all"
              >
                <CheckCircle className="w-8 h-8" />
              </Button>
            </div>

            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-500/30">
                <span className="text-violet-200 text-sm">
                  {currentCandidateIndex + 1} / {searchResults.length}
                </span>
              </div>
            </div>
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
            />
          ))}
        </div>
      )}

      {/* {!isAuthenticated && ( */}
      <div className="mt-8 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg text-center">
        <p className="text-violet-200 mb-2">Sign in to save candidates and generate personalized outreach messages.</p>
        <p className="text-sm text-violet-300">You're currently in limited preview mode.</p>
      </div>
      {/* )} */}
    </div>
  )
}

function SwipeCard({
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

  const getRotation = () => {
    if (direction === "left") return -30
    if (direction === "right") return 30
    return dragX * 0.1
  }

  const getOpacity = () => {
    if (direction) return 0
    return 1 - Math.abs(dragX) * 0.001
  }

  const getScale = () => {
    if (!isCurrent) return 0.95 - (zIndex - 1) * 0.05
    return 1
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ zIndex }}
      drag={isCurrent ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={(_, info) => setDragX(info.offset.x)}
      onDragEnd={(_, info) => {
        const threshold = 100
        if (Math.abs(info.offset.x) > threshold) {
          onSwipe(info.offset.x > 0 ? "right" : "left")
        }
        setDragX(0)
      }}
      animate={{
        x: direction === "left" ? -1000 : direction === "right" ? 1000 : dragX,
        rotate: getRotation(),
        opacity: getOpacity(),
        scale: getScale(),
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="h-full bg-gradient-to-b from-gray-900/90 to-black/90 border-violet-500/20 backdrop-blur-xl shadow-2xl shadow-violet-500/10 overflow-hidden">
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
                <div className="text-lg font-bold text-white">{candidate.githubStars}</div>
                <div className="text-xs text-violet-300">Stars</div>
              </div>
              <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{candidate.publications}</div>
                <div className="text-xs text-violet-300">Papers</div>
              </div>
            </div>

            {/* Location & Availability */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-violet-200">
                <MapPin className="w-4 h-4 mr-2 text-violet-400" />
                {candidate.location}
              </div>
              <div className="flex items-center text-sm text-violet-200">
                <Calendar className="w-4 h-4 mr-2 text-violet-400" />
                {candidate.availability}
              </div>
              <div className="flex items-center text-sm text-violet-200">
                <DollarSign className="w-4 h-4 mr-2 text-violet-400" />
                {candidate.salary}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-sm font-semibold text-violet-300 mb-2">Summary</h4>
              <p className="text-sm text-violet-100 leading-relaxed line-clamp-3">{candidate.summary}</p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-violet-300 mb-2">Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, 6).map((skill) => (
                  <Badge key={skill} className="text-xs bg-violet-500/20 text-violet-200 border-violet-500/30">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 6 && (
                  <Badge className="text-xs bg-gray-700/50 text-gray-300">+{candidate.skills.length - 6}</Badge>
                )}
              </div>
            </div>

            {/* Match Reasons */}
            <div>
              <h4 className="text-sm font-semibold text-violet-300 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Why this candidate matches:
              </h4>
              <div className="space-y-1">
                {candidate.matchReasons.slice(0, 2).map((reason, idx) => (
                  <div key={idx} className="text-xs text-green-300 flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Swipe Indicators */}
          <AnimatePresence>
            {dragX !== 0 && (
              <motion.div
                className={`absolute inset-0 flex items-center justify-center ${
                  dragX > 0 ? "bg-green-500/20" : "bg-red-500/20"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.abs(dragX) / 100 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className={`text-6xl font-bold ${dragX > 0 ? "text-green-400" : "text-red-400"} transform rotate-12`}
                >
                  {dragX > 0 ? "LIKE" : "PASS"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CandidateListCard({
  candidate,
  index,
  isSelected,
  onToggleSelect,
}: {
  candidate: Candidate
  index: number
  isSelected: boolean
  onToggleSelect: () => void
}) {
  return (
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
              {candidate.salary}
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-violet-100 mb-4 line-clamp-2">{candidate.summary}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-4">
            {candidate.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} className="text-xs bg-violet-500/20 text-violet-200 border-violet-500/30">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 4 && (
              <Badge className="text-xs bg-gray-700/50 text-gray-300">+{candidate.skills.length - 4}</Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-violet-500/20">
            <div className="flex items-center space-x-2">
              {candidate.socialLinks.github && (
                <Button size="sm" variant="ghost" className="text-violet-400 hover:text-white p-1">
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {candidate.socialLinks.linkedin && (
                <Button size="sm" variant="ghost" className="text-violet-400 hover:text-white p-1">
                  <Linkedin className="w-4 h-4" />
                </Button>
              )}
              {candidate.socialLinks.portfolio && (
                <Button size="sm" variant="ghost" className="text-violet-400 hover:text-white p-1">
                  <Globe className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="border-violet-500/30 text-violet-300 hover:text-white">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
