"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import {
  Search,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  Menu,
  X,
  MapPin,
  Briefcase,
  Star,
  Github,
  Linkedin,
  Mail,
  Award,
  Code,
  Heart,
  Eye,
  Download,
  Send,
  Bot,
  Grid3X3,
  List,
  TrendingUp,
  Activity,
  Clock,
  MousePointer,
  Play,
  Layers,
  FilterIcon as Funnel,
  Users2,
  Percent,
  ArrowUp,
  ArrowDown,
  Brain,
  Paperclip,
  Loader,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

interface Candidate {
  id: string
  name: string
  title: string
  location: string
  experience: number
  skills: string[]
  score: number
  availability: string
  email: string
  phone?: string
  github?: string
  linkedin?: string
  summary: string
  projects: string[]
  education: string
  lastActive: string
  avatar?: string
  salary?: string
  status: "new" | "contacted" | "interviewing" | "hired" | "rejected"
  publications?: number
  githubStars?: number
  yearsInAI?: number
  languages?: string[]
  interests?: string[]
  achievements?: string[]
  certifications?: string[]
}

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  searchResults?: Candidate[]
  resultCount?: number
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior AI Engineer",
    location: "Berlin, Germany",
    experience: 6,
    skills: ["LangChain", "RAG", "Python", "TensorFlow", "Vector Databases", "OpenAI API"],
    score: 95,
    email: "sarah.chen@email.com",
    github: "https://github.com/sarahchen",
    linkedin: "https://linkedin.com/in/sarahchen",
    summary:
      "Experienced AI engineer specializing in RAG systems and LangChain applications. Built production-scale AI systems for fintech and healthcare.",
    projects: ["RAG-powered customer support system", "Multi-modal AI assistant", "Vector search optimization"],
    education: "MS Computer Science, TU Berlin",
    lastActive: "2 days ago",
    availability: "Open to contract work",
    avatar: "/placeholder.svg?height=400&width=400",
    salary: "€80-120k",
    status: "new",
    publications: 3,
    githubStars: 1200,
    yearsInAI: 4,
    languages: ["English", "Mandarin", "German"],
    interests: ["Open source", "AI ethics", "Quantum computing"],
    achievements: ["Best Paper Award at NeurIPS 2022", "Led team of 5 engineers at TechCorp"],
    certifications: ["AWS Machine Learning Specialty", "Google Cloud Professional ML Engineer"],
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    title: "GenAI Research Scientist",
    location: "Amsterdam, Netherlands",
    experience: 8,
    skills: ["Transformers", "LangChain", "PyTorch", "Hugging Face", "MLOps", "RAG"],
    score: 92,
    email: "marcus.r@email.com",
    github: "https://github.com/marcusr",
    linkedin: "https://linkedin.com/in/marcusrodriguez",
    summary:
      "Research scientist with deep expertise in transformer architectures and retrieval-augmented generation. Published 15+ papers in top AI conferences.",
    projects: [
      "Novel RAG architecture for code generation",
      "Multi-agent LangChain system",
      "Efficient transformer fine-tuning",
    ],
    education: "PhD AI, University of Amsterdam",
    lastActive: "1 day ago",
    availability: "Available for consulting",
    avatar: "/placeholder.svg?height=400&width=400",
    salary: "€90-130k",
    status: "contacted",
    publications: 15,
    githubStars: 5000,
    yearsInAI: 6,
    languages: ["English", "Spanish", "Dutch"],
    interests: ["Research", "Open source", "Teaching"],
    achievements: ["Published in NeurIPS, ICML, and ACL", "Created popular open-source RAG framework"],
    certifications: ["NVIDIA Deep Learning Institute", "Meta AI Research Certification"],
  },
  {
    id: "3",
    name: "Elena Kowalski",
    title: "AI Product Engineer",
    location: "Warsaw, Poland",
    experience: 5,
    skills: ["LangChain", "FastAPI", "React", "Vector Databases", "AWS", "Docker"],
    score: 88,
    email: "elena.k@email.com",
    github: "https://github.com/elenakowalski",
    linkedin: "https://linkedin.com/in/elenakowalski",
    summary:
      "Full-stack AI engineer building user-facing AI products. Expert in integrating LLMs into production applications.",
    projects: [
      "AI-powered content management system",
      "Real-time RAG chat application",
      "LangChain workflow automation",
    ],
    education: "BS Software Engineering, Warsaw University",
    lastActive: "3 hours ago",
    availability: "Open to full-time and contract",
    avatar: "/placeholder.svg?height=400&width=400",
    salary: "€60-90k",
    status: "interviewing",
    publications: 1,
    githubStars: 800,
    yearsInAI: 3,
    languages: ["English", "Polish", "Russian"],
    interests: ["Product design", "UX", "AI accessibility"],
    achievements: ["Built AI products used by 500K+ users", "Reduced inference costs by 40%"],
    certifications: ["AWS Solutions Architect", "MongoDB Certified Developer"],
  },
  {
    id: "4",
    name: "Raj Patel",
    title: "AI Research Engineer",
    location: "Bangalore, India",
    experience: 4,
    skills: ["PyTorch", "LangChain", "Transformers", "CUDA", "Triton", "FastAPI"],
    score: 91,
    email: "raj.patel@email.com",
    github: "https://github.com/rajpatel",
    linkedin: "https://linkedin.com/in/rajpatel",
    summary:
      "AI research engineer with expertise in model optimization and deployment. Specialized in making large language models faster and more efficient.",
    projects: [
      "Model quantization framework reducing inference time by 3x",
      "Distributed training system for large language models",
      "Real-time AI inference engine with sub-100ms latency",
    ],
    education: "BTech Computer Science, IIT Bangalore",
    lastActive: "1 day ago",
    availability: "Open to remote work",
    avatar: "/placeholder.svg?height=400&width=400",
    salary: "₹25-40L",
    status: "new",
    publications: 4,
    githubStars: 2500,
    yearsInAI: 3,
    languages: ["English", "Hindi", "Gujarati"],
    interests: ["Model optimization", "Edge AI", "Open source"],
    achievements: ["Created popular LLM optimization library", "Speaker at AI DevCon 2023"],
    certifications: ["NVIDIA CUDA Programming", "PyTorch Certified Engineer"],
  },
  {
    id: "5",
    name: "Aisha Khan",
    title: "ML Infrastructure Engineer",
    location: "Dubai, UAE",
    experience: 7,
    skills: ["Kubernetes", "MLOps", "TensorFlow", "AWS", "Docker", "CI/CD", "Kubeflow"],
    score: 89,
    email: "aisha.k@email.com",
    github: "https://github.com/aishakhan",
    linkedin: "https://linkedin.com/in/aishakhan",
    summary:
      "MLOps specialist focused on building scalable infrastructure for AI systems. Expert in Kubernetes and cloud-native ML deployments.",
    projects: [
      "Enterprise MLOps platform serving 50+ data scientists",
      "Multi-region model deployment pipeline",
      "Automated ML monitoring and observability system",
    ],
    education: "MS Cloud Computing, University of Manchester",
    lastActive: "5 days ago",
    availability: "Considering new opportunities",
    avatar: "/placeholder.svg?height=400&width=400",
    salary: "$90-120k",
    status: "new",
    publications: 2,
    githubStars: 1800,
    yearsInAI: 5,
    languages: ["English", "Arabic", "French"],
    interests: ["Cloud infrastructure", "DevOps", "Automation"],
    achievements: [
      "Reduced model deployment time from days to minutes",
      "Built ML platform used by Fortune 500 company",
    ],
    certifications: ["Kubernetes Administrator (CKA)", "AWS DevOps Professional", "Google Cloud Architect"],
  },
]

function SwipeableCard({
  candidate,
  isCurrent,
  zIndex,
  onSwipe,
  direction,
  onCardClick,
}: {
  candidate: Candidate
  isCurrent: boolean
  zIndex: number
  onSwipe: (direction: "left" | "right") => void
  direction: "left" | "right" | null
  onCardClick: () => void
}) {
  const [dragX, setDragX] = useState(0)

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe(info.offset.x > 0 ? "right" : "left")
    }
    setDragX(0)
  }

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

  const getY = () => {
    if (!isCurrent) return (zIndex - 1) * 10
    return 0
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ zIndex }}
      drag={isCurrent ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={(event, info) => setDragX(info.offset.x)}
      onDragEnd={handleDragEnd}
      animate={{
        x: direction === "left" ? -1000 : direction === "right" ? 1000 : dragX,
        rotate: getRotation(),
        opacity: getOpacity(),
        scale: getScale(),
        y: getY(),
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      whileHover={isCurrent ? { scale: 1.02 } : {}}
    >
      <Card className="h-full bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700 shadow-2xl overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                <span className="text-sm font-bold text-yellow-400">{candidate.score}</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-center space-x-3">
                <Avatar className="w-16 h-16 border-2 border-white/20">
                  <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">{candidate.name}</h3>
                  <p className="text-gray-300 text-sm truncate">{candidate.title}</p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{candidate.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{candidate.experience}</div>
                <div className="text-xs text-gray-400">Years Exp</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <Code className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{candidate.githubStars || 0}</div>
                <div className="text-xs text-gray-400">GitHub ⭐</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{candidate.publications || 0}</div>
                <div className="text-xs text-gray-400">Papers</div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Summary</h4>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{candidate.summary}</p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, 6).map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                  >
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 6 && (
                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-400">
                    +{candidate.skills.length - 6}
                  </Badge>
                )}
              </div>
            </div>

            {/* Key Projects */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Projects</h4>
              <div className="space-y-2">
                {candidate.projects.slice(0, 2).map((project, index) => (
                  <div key={index} className="text-sm text-gray-400 flex items-start">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span className="line-clamp-2">{project}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability & Salary */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 mb-1">Availability</h4>
                <p className="text-sm text-green-400">{candidate.availability}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-400 mb-1">Expected Salary</h4>
                <p className="text-sm text-white font-medium">{candidate.salary}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-center space-x-4 pt-2 border-t border-gray-700">
              {candidate.email && (
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <Mail className="w-4 h-4" />
                </Button>
              )}
              {candidate.github && (
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {candidate.linkedin && (
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <Linkedin className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onCardClick()
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
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
                  className={`text-6xl font-bold ${dragX > 0 ? "text-green-500" : "text-red-500"} transform rotate-12`}
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

export function HireAIDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState("copilot")
  const [showFilters, setShowFilters] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showCandidateDetail, setShowCandidateDetail] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  // Chat-related state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI hiring copilot. I can help you find the perfect candidates for your team. What kind of talent are you looking for today?",
      timestamp: new Date(),
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [searchResults, setSearchResults] = useState<Candidate[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const stats = [
    { label: "Total Candidates", value: "2,847", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Active Searches", value: "23", change: "+5%", icon: Search, color: "text-green-500" },
    { label: "Interviews Scheduled", value: "8", change: "+25%", icon: Calendar, color: "text-purple-500" },
    { label: "Hires This Month", value: "4", change: "+100%", icon: CheckCircle, color: "text-emerald-500" },
  ]

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I found ${mockCandidates.length} candidates matching your criteria. Here are some top matches based on your requirements for "${currentMessage}". Would you like to view them as cards for quick swiping or as a detailed list?`,
        timestamp: new Date(),
        searchResults: mockCandidates,
        resultCount: mockCandidates.length,
      }

      setChatMessages((prev) => [...prev, assistantMessage])
      setSearchResults(mockCandidates)
      setShowResults(true)
      setIsTyping(false)
    }, 2000)
  }

  const handleViewModeSelect = (mode: "cards" | "list") => {
    setViewMode(mode)
    setActiveTab(mode === "cards" ? "swipe" : "candidates")
  }

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId],
    )
  }

  const handleSwipe = (direction: "left" | "right") => {
    setDirection(direction)

    if (direction === "right") {
      const candidateId = candidates[currentCandidateIndex].id
      if (!selectedCandidates.includes(candidateId)) {
        setSelectedCandidates((prev) => [...prev, candidateId])
      }
    }

    setTimeout(() => {
      setCurrentCandidateIndex((prev) => (prev + 1) % candidates.length)
      setDirection(null)
    }, 300)
  }

  const openCandidateDetail = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowCandidateDetail(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setShowMobileSidebar(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HireAI</span>
            </div>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Pro Plan
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {showMobileSidebar && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMobileSidebar(false)}
              />
              <div className="absolute top-0 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">HireAI</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowMobileSidebar(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <nav className="p-4 space-y-2">
                  {[
                    { id: "copilot", label: "AI Copilot", icon: Bot },
                    { id: "swipe", label: "Swipe Candidates", icon: Zap },
                    { id: "candidates", label: "Candidate List", icon: Users },
                    { id: "analytics", label: "PostHog Analytics", icon: BarChart3 },
                    { id: "messages", label: "Messages", icon: MessageSquare },
                    { id: "pipeline", label: "Pipeline", icon: Target },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setShowMobileSidebar(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <nav className="p-4 space-y-2">
            {[
              { id: "copilot", label: "AI Copilot", icon: Bot },
              { id: "swipe", label: "Swipe Candidates", icon: Zap },
              { id: "candidates", label: "Candidate List", icon: Users },
              { id: "analytics", label: "PostHog Analytics", icon: BarChart3 },
              { id: "messages", label: "Messages", icon: MessageSquare },
              { id: "pipeline", label: "Pipeline", icon: Target },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* AI Copilot Tab */}
            <TabsContent value="copilot" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AI Hiring Copilot
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Online
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-2">
                  <Card className="bg-gray-900/50 border-gray-800 h-[700px] flex flex-col">
                    <CardHeader className="border-b border-gray-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">HireAI Assistant</CardTitle>
                          <p className="text-sm text-gray-400">Your intelligent hiring companion</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0">
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                              <div
                                className={`rounded-2xl px-4 py-3 ${
                                  message.type === "user"
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-800 text-gray-100 border border-gray-700"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                {message.searchResults && (
                                  <div className="mt-4 space-y-3">
                                    <div className="text-xs text-gray-400">Found {message.resultCount} candidates</div>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleViewModeSelect("cards")}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                      >
                                        <Grid3X3 className="w-4 h-4 mr-2" />
                                        View as Cards
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewModeSelect("list")}
                                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                      >
                                        <List className="w-4 h-4 mr-2" />
                                        View as List
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 px-2">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user" ? "order-1 ml-3" : "order-2 mr-3"}`}
                            >
                              {message.type === "user" ? (
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                  <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <Brain className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
                              </div>
                              <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  />
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="border-t border-gray-800 p-4">
                        <div className="flex space-x-3">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Paperclip className="w-5 h-5" />
                          </Button>
                          <div className="flex-1 relative">
                            <Textarea
                              placeholder="Describe the candidate you're looking for..."
                              value={currentMessage}
                              onChange={(e) => setCurrentMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault()
                                  handleSendMessage()
                                }
                              }}
                              className="min-h-[44px] max-h-32 resize-none bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!currentMessage.trim() || isTyping}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {isTyping ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats & Suggestions */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {stats.slice(0, 2).map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-sm text-gray-300">{stat.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                            <div className={`text-xs ${stat.color}`}>{stat.change}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300">
                        <Search className="w-4 h-4 mr-2" />
                        Find ML Engineers
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300">
                        <Users className="w-4 h-4 mr-2" />
                        Browse AI Researchers
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Generate Outreach
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Searches */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Searches</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {["Senior LangChain developers", "Computer vision engineers", "MLOps specialists in Europe"].map(
                        (search, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                            onClick={() => setCurrentMessage(search)}
                          >
                            {search}
                          </button>
                        ),
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Swipe Interface */}
            <TabsContent value="swipe" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Candidate Swiping
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {selectedCandidates.length} Selected
                  </Badge>
                  {selectedCandidates.length > 0 && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Generate Outreach
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Swipe Cards */}
                <div className="lg:w-2/3">
                  <div className="relative h-[700px] max-w-md mx-auto">
                    {candidates.map((candidate, index) => {
                      if (index < currentCandidateIndex || index > currentCandidateIndex + 2) return null

                      const isCurrent = index === currentCandidateIndex
                      const zIndex = candidates.length - index

                      return (
                        <SwipeableCard
                          key={candidate.id}
                          candidate={candidate}
                          isCurrent={isCurrent}
                          zIndex={zIndex}
                          onSwipe={handleSwipe}
                          direction={isCurrent ? direction : null}
                          onCardClick={() => openCandidateDetail(candidate)}
                        />
                      )
                    })}

                    {/* Swipe Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-16 h-16 rounded-full border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:scale-110 transition-all"
                        onClick={() => handleSwipe("left")}
                      >
                        <XCircle className="w-8 h-8" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-16 h-16 rounded-full border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:scale-110 transition-all"
                        onClick={() => handleSwipe("right")}
                      >
                        <CheckCircle className="w-8 h-8" />
                      </Button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
                        <span className="text-sm text-gray-300">
                          {currentCandidateIndex + 1} / {candidates.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Candidates */}
                <div className="lg:w-1/3 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Selected Candidates</h3>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {selectedCandidates.length}
                    </Badge>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {selectedCandidates.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium mb-2">No candidates selected yet</p>
                        <p className="text-sm">Swipe right on candidates you're interested in</p>
                      </div>
                    ) : (
                      candidates
                        .filter((c) => selectedCandidates.includes(c.id))
                        .map((candidate) => (
                          <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer border border-gray-700/50"
                            onClick={() => openCandidateDetail(candidate)}
                          >
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate">{candidate.name}</p>
                              <p className="text-sm text-gray-400 truncate">{candidate.title}</p>
                              <div className="flex items-center mt-1">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                                <span className="text-xs text-yellow-400 font-medium">{candidate.score}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCandidates((prev) => prev.filter((id) => id !== candidate.id))
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Candidate List Tab */}
            <TabsContent value="candidates" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Candidate List ({candidates.length})</h3>
                <div className="flex items-center space-x-2">
                  {selectedCandidates.length > 0 && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Generate Outreach ({selectedCandidates.length})
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {candidates.map((candidate, index) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    index={index}
                    isSelected={selectedCandidates.includes(candidate.id)}
                    onToggleSelect={() => toggleCandidateSelection(candidate.id)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* PostHog Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  PostHog Analytics Dashboard
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    <Activity className="w-3 h-3 mr-1" />
                    Live Data
                  </Badge>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    label: "Active Users",
                    value: "1,247",
                    change: "+12.5%",
                    icon: Users2,
                    color: "text-blue-500",
                    trend: "up",
                  },
                  {
                    label: "Session Duration",
                    value: "8m 32s",
                    change: "+5.2%",
                    icon: Clock,
                    color: "text-green-500",
                    trend: "up",
                  },
                  {
                    label: "Conversion Rate",
                    value: "23.4%",
                    change: "-2.1%",
                    icon: Percent,
                    color: "text-red-500",
                    trend: "down",
                  },
                  {
                    label: "Feature Adoption",
                    value: "67.8%",
                    change: "+8.9%",
                    icon: TrendingUp,
                    color: "text-purple-500",
                    trend: "up",
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">{metric.label}</p>
                            <p className="text-2xl font-bold text-white">{metric.value}</p>
                            <div className="flex items-center mt-1">
                              {metric.trend === "up" ? (
                                <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                              ) : (
                                <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
                              )}
                              <span className={`text-sm ${metric.color}`}>{metric.change}</span>
                            </div>
                          </div>
                          <metric.icon className={`w-8 h-8 ${metric.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Behavior Flow */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Funnel className="w-5 h-5 text-purple-400" />
                      <span>User Journey Funnel</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { stage: "Landing Page", users: 2847, percentage: 100, dropOff: 0 },
                        { stage: "AI Copilot Interaction", users: 2134, percentage: 75, dropOff: 25 },
                        { stage: "Search Results View", users: 1708, percentage: 60, dropOff: 20 },
                        { stage: "Candidate Selection", users: 1139, percentage: 40, dropOff: 33 },
                        { stage: "Outreach Generation", users: 569, percentage: 20, dropOff: 50 },
                        { stage: "Message Sent", users: 284, percentage: 10, dropOff: 50 },
                      ].map((item, index) => (
                        <div key={item.stage} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.stage}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">{item.users.toLocaleString()}</span>
                              {item.dropOff > 0 && <span className="text-red-400 text-xs">-{item.dropOff}%</span>}
                            </div>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Feature Engagement */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MousePointer className="w-5 h-5 text-blue-400" />
                      <span>Feature Engagement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { feature: "AI Copilot Chat", usage: 89, trend: "+12%" },
                        { feature: "Candidate Swiping", usage: 76, trend: "+8%" },
                        { feature: "List View", usage: 64, trend: "+5%" },
                        { feature: "Outreach Generation", usage: 45, trend: "+15%" },
                        { feature: "Analytics Dashboard", usage: 23, trend: "+3%" },
                        { feature: "Pipeline Management", usage: 18, trend: "-2%" },
                      ].map((item) => (
                        <div key={item.feature} className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">{item.feature}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${item.usage}%` }}
                              />
                            </div>
                            <span className="text-white font-medium text-sm w-8">{item.usage}%</span>
                            <span
                              className={`text-xs w-12 ${item.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                            >
                              {item.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Session Recordings */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-green-400" />
                      <span>Recent Session Recordings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "rec_001",
                          user: "john.doe@company.com",
                          duration: "12m 34s",
                          actions: 47,
                          status: "completed",
                        },
                        {
                          id: "rec_002",
                          user: "jane.smith@startup.io",
                          duration: "8m 12s",
                          actions: 23,
                          status: "dropped_off",
                        },
                        {
                          id: "rec_003",
                          user: "mike.wilson@corp.com",
                          duration: "15m 45s",
                          actions: 62,
                          status: "converted",
                        },
                        { id: "rec_004", user: "sarah.lee@tech.ai", duration: "6m 28s", actions: 18, status: "active" },
                      ].map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                session.status === "completed"
                                  ? "bg-green-500"
                                  : session.status === "converted"
                                    ? "bg-purple-500"
                                    : session.status === "dropped_off"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                              }`}
                            />
                            <div>
                              <p className="text-sm text-white font-medium">{session.user}</p>
                              <p className="text-xs text-gray-400">
                                {session.duration} • {session.actions} actions
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* A/B Testing Results */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-orange-400" />
                      <span>A/B Testing Results</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          test: "Swipe vs List Default View",
                          variant_a: "Swipe First",
                          variant_b: "List First",
                          winner: "A",
                          improvement: "+23%",
                          confidence: 95,
                        },
                        {
                          test: "AI Chat Suggestions",
                          variant_a: "3 Suggestions",
                          variant_b: "5 Suggestions",
                          winner: "B",
                          improvement: "+8%",
                          confidence: 87,
                        },
                        {
                          test: "Outreach Button Color",
                          variant_a: "Green",
                          variant_b: "Purple",
                          winner: "A",
                          improvement: "+12%",
                          confidence: 92,
                        },
                      ].map((test, index) => (
                        <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-white">{test.test}</h4>
                            <Badge
                              className={`${test.winner === "A" ? "bg-green-500/20 text-green-300" : "bg-purple-500/20 text-purple-300"}`}
                            >
                              Winner: {test.winner}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-2">
                            <div>A: {test.variant_a}</div>
                            <div>B: {test.variant_b}</div>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-400">{test.improvement} improvement</span>
                            <span className="text-gray-400">{test.confidence}% confidence</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Event Tracking */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>Real-time Event Stream</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {[
                      {
                        event: "candidate_swiped_right",
                        user: "john@company.com",
                        timestamp: "2s ago",
                        data: "Sarah Chen",
                      },
                      {
                        event: "ai_chat_message_sent",
                        user: "jane@startup.io",
                        timestamp: "5s ago",
                        data: "Looking for ML engineers",
                      },
                      {
                        event: "outreach_generated",
                        user: "mike@corp.com",
                        timestamp: "12s ago",
                        data: "3 candidates",
                      },
                      {
                        event: "candidate_profile_viewed",
                        user: "sarah@tech.ai",
                        timestamp: "18s ago",
                        data: "Marcus Rodriguez",
                      },
                      {
                        event: "search_results_filtered",
                        user: "alex@dev.com",
                        timestamp: "25s ago",
                        data: "Location: Europe",
                      },
                      {
                        event: "candidate_swiped_left",
                        user: "lisa@agency.co",
                        timestamp: "31s ago",
                        data: "Elena Kowalski",
                      },
                      {
                        event: "pipeline_stage_updated",
                        user: "tom@hiring.io",
                        timestamp: "45s ago",
                        data: "Interview scheduled",
                      },
                      {
                        event: "analytics_dashboard_viewed",
                        user: "emma@growth.com",
                        timestamp: "52s ago",
                        data: "PostHog tab",
                      },
                    ].map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-2 bg-gray-800/30 rounded text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <span className="text-cyan-400 font-mono">{event.event}</span>
                          <span className="text-gray-400">{event.user}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300">{event.data}</span>
                          <span className="text-gray-500">{event.timestamp}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Candidate Detail Modal */}
      <AnimatePresence>
        {showCandidateDetail && selectedCandidate && (
          <CandidateDetailModal candidate={selectedCandidate} onClose={() => setShowCandidateDetail(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function CandidateCard({
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "contacted":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "interviewing":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "hired":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group cursor-pointer transition-all duration-300 ${isSelected ? "ring-2 ring-purple-500/50" : ""}`}
      onClick={onToggleSelect}
    >
      <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-gray-700 transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-400">{candidate.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{candidate.score}</span>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <Badge className={getStatusColor(candidate.status)}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              {candidate.location}
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Briefcase className="w-4 h-4 mr-2" />
              {candidate.experience} years experience
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {candidate.availability}
            </div>
            {candidate.salary && (
              <div className="flex items-center text-sm text-gray-400">
                <Target className="w-4 h-4 mr-2" />
                {candidate.salary}
              </div>
            )}
          </div>

          {/* Summary */}
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{candidate.summary}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-4">
            {candidate.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center space-x-2">
              {candidate.email && (
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                  <Mail className="w-4 h-4" />
                </Button>
              )}
              {candidate.github && (
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {candidate.linkedin && (
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                  <Linkedin className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CandidateDetailModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Candidate Profile</h2>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
              <p className="text-gray-400">{candidate.title}</p>
              <div className="flex items-center justify-center mt-2">
                <Star className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" />
                <span className="text-lg font-bold text-yellow-400">{candidate.score}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail className="w-4 h-4 mr-2" />
                    {candidate.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    {candidate.location}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-lg font-bold text-white">{candidate.experience}</div>
                    <div className="text-xs text-gray-400">Years Exp</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-lg font-bold text-white">{candidate.publications || 0}</div>
                    <div className="text-xs text-gray-400">Papers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Columns - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Summary</h4>
              <p className="text-gray-300 leading-relaxed">{candidate.summary}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Key Projects</h4>
              <div className="space-y-3">
                {candidate.projects.map((project, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-gray-300">{project}</p>
                  </div>
                ))}
              </div>
            </div>

            {candidate.achievements && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Achievements</h4>
                <div className="space-y-2">
                  {candidate.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start">
                      <Award className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Education</h4>
                <p className="text-gray-300">{candidate.education}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Availability</h4>
                <p className="text-green-400">{candidate.availability}</p>
                {candidate.salary && <p className="text-gray-300 mt-1">Expected: {candidate.salary}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-800">
          <Button variant="outline" className="border-gray-700 text-gray-300">
            Save for Later
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
