"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  Brain,
  Filter,
  MapPin,
  Briefcase,
  Star,
  Clock,
  TrendingUp,
  Target,
  RefreshCw,
  Download,
  Share2,
  Bookmark,
  Eye,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Settings,
  HelpCircle,
  Lightbulb,
  Globe,
  Code,
  Award,
  Calendar,
  DollarSign,
  GraduationCap,
  Database,
  Cloud,
  Smartphone,
  Github,
  Linkedin,
  LayoutList,
  LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface SearchSuggestion {
  id: string
  text: string
  category: string
  icon: React.ReactNode
  popularity: number
  examples: string[]
}

interface VoiceRecognition {
  isListening: boolean
  transcript: string
  confidence: number
  isSupported: boolean
}

interface SearchFilter {
  id: string
  label: string
  type: "range" | "select" | "multiselect" | "toggle"
  value: any
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  icon: React.ReactNode
}

interface SearchResult {
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
}

const followUpQuestions = [
  "Show me candidates with experience in AI/ML.",
  "Find candidates open to remote work.",
  "What about candidates with leadership experience?",
  "Any candidates with experience in the healthcare industry?",
]

export default function NaturalLanguageSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition>({
    isListening: false,
    transcript: "",
    confidence: 0,
    isSupported: false,
  })
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const searchInputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize particles for background animation
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }))
    setParticles(newParticles)

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.vx + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.vy + window.innerHeight) % window.innerHeight,
        })),
      )
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("")

        setVoiceRecognition((prev) => ({
          ...prev,
          transcript,
          confidence: event.results[event.results.length - 1][0].confidence,
        }))

        if (event.results[event.results.length - 1].isFinal) {
          setSearchQuery(transcript)
          setVoiceRecognition((prev) => ({ ...prev, isListening: false }))
        }
      }

      setVoiceRecognition((prev) => ({ ...prev, isSupported: true }))
    }
  }, [])

  const searchSuggestionsData: SearchSuggestion[] = [
    {
      id: "1",
      text: "Senior GenAI engineers with LangChain experience",
      category: "AI/ML",
      icon: <Brain className="w-4 h-4" />,
      popularity: 95,
      examples: ["LangChain", "RAG", "Vector databases", "OpenAI API"],
    },
    {
      id: "2",
      text: "Full-stack developers with React and Node.js",
      category: "Web Development",
      icon: <Code className="w-4 h-4" />,
      popularity: 88,
      examples: ["React", "Node.js", "TypeScript", "Next.js"],
    },
    {
      id: "3",
      text: "Data scientists with Python and ML experience",
      category: "Data Science",
      icon: <Database className="w-4 h-4" />,
      popularity: 82,
      examples: ["Python", "TensorFlow", "PyTorch", "Pandas"],
    },
    {
      id: "4",
      text: "DevOps engineers with Kubernetes and AWS",
      category: "Infrastructure",
      icon: <Cloud className="w-4 h-4" />,
      popularity: 76,
      examples: ["Kubernetes", "AWS", "Docker", "Terraform"],
    },
    {
      id: "5",
      text: "Mobile developers with React Native",
      category: "Mobile",
      icon: <Smartphone className="w-4 h-4" />,
      popularity: 71,
      examples: ["React Native", "iOS", "Android", "Flutter"],
    },
  ]

  const searchFilters: SearchFilter[] = [
    {
      id: "experience",
      label: "Years of Experience",
      type: "range",
      value: [0, 15],
      min: 0,
      max: 15,
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "location",
      label: "Location",
      type: "multiselect",
      value: [],
      options: [
        { label: "Remote", value: "remote" },
        { label: "United States", value: "us" },
        { label: "Europe", value: "eu" },
        { label: "Asia", value: "asia" },
        { label: "India", value: "india" },
        { label: "Canada", value: "canada" },
      ],
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: "salary",
      label: "Expected Salary (USD)",
      type: "range",
      value: [50000, 200000],
      min: 30000,
      max: 300000,
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: "availability",
      label: "Availability",
      type: "select",
      value: "any",
      options: [
        { label: "Any", value: "any" },
        { label: "Immediately", value: "immediate" },
        { label: "Within 2 weeks", value: "2weeks" },
        { label: "Within 1 month", value: "1month" },
        { label: "Open to opportunities", value: "open" },
      ],
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "skills",
      label: "Required Skills",
      type: "multiselect",
      value: [],
      options: [
        { label: "JavaScript", value: "javascript" },
        { label: "Python", value: "python" },
        { label: "React", value: "react" },
        { label: "Node.js", value: "nodejs" },
        { label: "TypeScript", value: "typescript" },
        { label: "AWS", value: "aws" },
        { label: "Docker", value: "docker" },
        { label: "Kubernetes", value: "kubernetes" },
        { label: "Machine Learning", value: "ml" },
        { label: "AI/LLM", value: "ai" },
      ],
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: "education",
      label: "Education Level",
      type: "select",
      value: "any",
      options: [
        { label: "Any", value: "any" },
        { label: "Bachelor's", value: "bachelors" },
        { label: "Master's", value: "masters" },
        { label: "PhD", value: "phd" },
        { label: "Bootcamp", value: "bootcamp" },
        { label: "Self-taught", value: "selftaught" },
      ],
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ]

  const mockSearchResults: SearchResult[] = [
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
      languages: ["English", "Mandarin", "Spanish"],
      education: "MS Computer Science, Stanford University",
      certifications: ["AWS Machine Learning Specialty", "Google Cloud Professional ML Engineer"],
      projects: [
        "RAG-powered customer support system handling 10K queries/day",
        "Multi-modal AI assistant with voice and image capabilities",
        "Vector search optimization reducing latency by 60%",
      ],
      socialLinks: {
        github: "https://github.com/sarahchen",
        linkedin: "https://linkedin.com/in/sarahchen",
        twitter: "https://twitter.com/sarahchen",
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
      languages: ["English", "Spanish", "Portuguese"],
      education: "PhD Artificial Intelligence, MIT",
      certifications: ["NVIDIA Deep Learning Institute", "Meta AI Research Certification"],
      projects: [
        "Novel RAG architecture for code generation (SOTA results)",
        "Multi-agent LangChain system for enterprise workflows",
        "Open-source transformer fine-tuning framework",
      ],
      socialLinks: {
        github: "https://github.com/marcusr",
        linkedin: "https://linkedin.com/in/marcusrodriguez",
        twitter: "https://twitter.com/marcusr",
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
      languages: ["English", "Polish", "German"],
      education: "BS Software Engineering, University of Texas",
      certifications: ["AWS Solutions Architect", "MongoDB Certified Developer"],
      projects: [
        "AI-powered content management system for media companies",
        "Real-time RAG chat application with 99.9% uptime",
        "LangChain workflow automation platform",
      ],
      socialLinks: {
        github: "https://github.com/elenakowalski",
        linkedin: "https://linkedin.com/in/elenakowalski",
        portfolio: "https://elenakowalski.dev",
      },
    },
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowSuggestions(false)

    // Add to search history
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 9)])
    }

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults)
      setIsSearching(false)
    }, 2000)
  }

  const startVoiceRecognition = () => {
    if (recognitionRef.current && voiceRecognition.isSupported) {
      setVoiceRecognition((prev) => ({ ...prev, isListening: true, transcript: "" }))
      recognitionRef.current.start()
    }
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setVoiceRecognition((prev) => ({ ...prev, isListening: false }))
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text)
    setShowSuggestions(false)
    handleSearch()
  }

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId],
    )
  }

  const saveSearch = () => {
    if (searchQuery && !savedSearches.includes(searchQuery)) {
      setSavedSearches((prev) => [searchQuery, ...prev])
    }
  }

  const handleFollowUp = (question: string) => {
    setSearchQuery(question)
    handleSearch()
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-pink-500/5 rounded-full mix-blend-normal filter blur-[200px] animate-pulse delay-1000" />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.id * 0.1,
            }}
          />
        ))}

        {/* Mouse Follow Effect */}
        <motion.div
          className="absolute w-[30rem] h-[30rem] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full filter blur-[120px] pointer-events-none"
          animate={{
            x: mousePosition.x - 240,
            y: mousePosition.y - 240,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  HireAI
                </span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">PeopleGPT</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Talk to AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Find Perfect Talent
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Describe your ideal candidate in natural language and let our AI assistant find the best matches for you.
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8">
              {/* Search Input */}
              <div className="relative mb-6">
                <div className="relative">
                  <Textarea
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSuggestions(e.target.value.length > 2)
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 2)}
                    placeholder="Describe the perfect candidate... e.g., 'Senior GenAI engineers with LangChain + RAG experience in Europe, open to contract work'"
                    className="w-full min-h-[120px] bg-gray-800/50 border-gray-700/50 text-white text-lg placeholder:text-gray-400 resize-none rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSearch()
                      }
                    }}
                  />

                  {/* Voice Recognition Indicator */}
                  <AnimatePresence>
                    {voiceRecognition.isListening && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          className="w-2 h-2 bg-red-500 rounded-full"
                        />
                        <span className="text-red-400 text-sm font-medium">Listening...</span>
                        <div className="text-red-400 text-xs">{Math.round(voiceRecognition.confidence * 100)}%</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Voice Transcript Preview */}
                  <AnimatePresence>
                    {voiceRecognition.transcript && voiceRecognition.isListening && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-4 left-4 right-4 bg-gray-800/80 border border-gray-700/50 rounded-lg p-3"
                      >
                        <div className="text-sm text-gray-300">{voiceRecognition.transcript}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && searchSuggestionsData.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 border border-gray-700/50 rounded-xl backdrop-blur-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="p-4">
                        <div className="text-sm text-gray-400 mb-3 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Popular searches
                        </div>
                        <div className="space-y-2">
                          {searchSuggestionsData.map((suggestion, index) => (
                            <motion.button
                              key={suggestion.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="text-purple-400">{suggestion.icon}</div>
                                  <div>
                                    <div className="text-white group-hover:text-purple-300 transition-colors">
                                      {suggestion.text}
                                    </div>
                                    <div className="text-xs text-gray-500">{suggestion.category}</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs text-gray-500">{suggestion.popularity}% match</div>
                                  <TrendingUp className="w-3 h-3 text-green-400" />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {suggestion.examples.slice(0, 3).map((example) => (
                                  <Badge
                                    key={example}
                                    variant="secondary"
                                    className="text-xs bg-gray-800/50 text-gray-400"
                                  >
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Voice Input */}
                  {voiceRecognition.isSupported && (
                    <Button
                      variant={voiceRecognition.isListening ? "destructive" : "outline"}
                      size="lg"
                      onClick={voiceRecognition.isListening ? stopVoiceRecognition : startVoiceRecognition}
                      className="border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                    >
                      {voiceRecognition.isListening ? (
                        <MicOff className="w-5 h-5 mr-2" />
                      ) : (
                        <Mic className="w-5 h-5 mr-2" />
                      )}
                      {voiceRecognition.isListening ? "Stop" : "Voice"}
                    </Button>
                  )}

                  {/* Advanced Filters Toggle */}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                    {showAdvancedFilters ? (
                      <ChevronUp className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-2" />
                    )}
                  </Button>

                  {/* Save Search */}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={saveSearch}
                    className="border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <Bookmark className="w-5 h-5 mr-2" />
                    Save
                  </Button>
                </div>

                {/* Search Button */}
                <Button
                  size="lg"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-gray-700/50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchFilters.map((filter) => (
                        <div key={filter.id} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="text-purple-400">{filter.icon}</div>
                            <label className="text-sm font-medium text-gray-300">{filter.label}</label>
                          </div>

                          {filter.type === "range" && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{filter.min}</span>
                                <span>{filter.max}</span>
                              </div>
                              <div className="relative">
                                <input
                                  type="range"
                                  min={filter.min}
                                  max={filter.max}
                                  value={Array.isArray(filter.value) ? filter.value[1] : filter.value}
                                  onChange={(e) => {
                                    const value = Number.parseInt(e.target.value)
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      [filter.id]: [filter.min, value],
                                    }))
                                  }}
                                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                />
                              </div>
                              <div className="text-xs text-gray-400 text-center">
                                {Array.isArray(filter.value) ? `${filter.value[0]} - ${filter.value[1]}` : filter.value}
                                {filter.id === "salary" && " USD"}
                                {filter.id === "experience" && " years"}
                              </div>
                            </div>
                          )}

                          {filter.type === "select" && (
                            <select
                              value={selectedFilters[filter.id] || filter.value}
                              onChange={(e) => setSelectedFilters((prev) => ({ ...prev, [filter.id]: e.target.value }))}
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                            >
                              {filter.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}

                          {filter.type === "multiselect" && (
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {filter.options?.map((option) => (
                                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={(selectedFilters[filter.id] || []).includes(option.value)}
                                    onChange={(e) => {
                                      const currentValues = selectedFilters[filter.id] || []
                                      const newValues = e.target.checked
                                        ? [...currentValues, option.value]
                                        : currentValues.filter((v: any) => v !== option.value)
                                      setSelectedFilters((prev) => ({ ...prev, [filter.id]: newValues }))
                                    }}
                                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                                  />
                                  <span className="text-sm text-gray-300">{option.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedFilters({})}
                        className="border-gray-700/50 text-gray-300"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        onClick={() => setShowAdvancedFilters(false)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search History & Saved Searches */}
        {(searchHistory.length > 0 || savedSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-gray-400" />
                      Recent Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {searchHistory.slice(0, 5).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-sm text-gray-300 hover:text-white"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Saved Searches */}
              {savedSearches.length > 0 && (
                <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Bookmark className="w-5 h-5 mr-2 text-purple-400" />
                      Saved Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {savedSearches.slice(0, 5).map((search, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <button
                            onClick={() => setSearchQuery(search)}
                            className="flex-1 text-left p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-sm text-gray-300 hover:text-white"
                          >
                            {search}
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSavedSearches((prev) => prev.filter((s) => s !== search))}
                            className="text-gray-500 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-6"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">AI is analyzing your request...</h3>
              <p className="text-gray-400">Searching through thousands of candidate profiles</p>
              <div className="mt-6 max-w-md mx-auto">
                <Progress value={75} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Parsing query</span>
                  <span>Matching candidates</span>
                  <span>Ranking results</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {searchResults.length > 0 && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Search Results</h2>
                  <p className="text-gray-400">
                    Found <span className="text-purple-400 font-semibold">{searchResults.length}</span> candidates
                    matching your criteria
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {selectedCandidates.length > 0 && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {selectedCandidates.length} selected
                    </Badge>
                  )}
                  <Button variant="outline" className="border-gray-700/50 text-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" className="border-gray-700/50 text-gray-300">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Separator orientation="vertical" className="h-6 bg-gray-700" />
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className="text-gray-400 hover:text-white"
                  >
                    {viewMode === "grid" ? <LayoutList className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Results Grid */}
              <div
                className={`grid ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"} gap-8`}
              >
                {searchResults.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`group cursor-pointer transition-all duration-300 ${
                      selectedCandidates.includes(candidate.id) ? "ring-2 ring-purple-500/50" : ""
                    }`}
                    onClick={() => toggleCandidateSelection(candidate.id)}
                  >
                    <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/70 hover:border-gray-700/50 transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16 ring-2 ring-purple-500/30">
                              <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                {candidate.name}
                              </h3>
                              <p className="text-gray-400">{candidate.title}</p>
                              <p className="text-sm text-gray-500">{candidate.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                              <span className="text-sm font-bold text-yellow-400">{candidate.score}</span>
                            </div>
                            {selectedCandidates.includes(candidate.id) && (
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-white text-xs"
                                >
                                  ✓
                                </motion.div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <Briefcase className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                            <div className="text-lg font-bold text-white">{candidate.experience}</div>
                            <div className="text-xs text-gray-400">Years</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <Github className="w-5 h-5 text-green-400 mx-auto mb-1" />
                            <div className="text-lg font-bold text-white">{candidate.githubStars}</div>
                            <div className="text-xs text-gray-400">Stars</div>
                          </div>
                          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                            <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                            <div className="text-lg font-bold text-white">{candidate.publications}</div>
                            <div className="text-xs text-gray-400">Papers</div>
                          </div>
                        </div>

                        {/* Location & Availability */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            {candidate.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            {candidate.availability}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {candidate.salary}
                          </div>
                        </div>

                        {/* Summary */}
                        <p className="text-sm text-gray-300 mb-4 line-clamp-3">{candidate.summary}</p>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 4).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 4 && (
                              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-400">
                                +{candidate.skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="mb-6">
                          <div className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            Why this candidate matches:
                          </div>
                          <div className="space-y-1">
                            {candidate.matchReasons.slice(0, 2).map((reason, idx) => (
                              <div key={idx} className="text-xs text-green-400 flex items-start">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                {reason}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                          <div className="flex items-center space-x-2">
                            {candidate.socialLinks.github && (
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                                <Github className="w-4 h-4" />
                              </Button>
                            )}
                            {candidate.socialLinks.linkedin && (
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                                <Linkedin className="w-4 h-4" />
                              </Button>
                            )}
                            {candidate.socialLinks.portfolio && (
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                                <Globe className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
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
                ))}
              </div>

              {/* Follow Up Questions */}
              <div className="mt-12">
                <h4 className="text-xl font-semibold text-white mb-4">Any other questions?</h4>
                <div className="flex flex-wrap gap-3">
                  {followUpQuestions.map((question, index) => (
                    <Button key={index} variant="outline" onClick={() => handleFollowUp(question)}>
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bulk Actions */}
              <AnimatePresence>
                {selectedCandidates.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
                  >
                    <Card className="bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-300">
                            <span className="font-semibold text-purple-400">{selectedCandidates.length}</span>{" "}
                            candidates selected
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Send className="w-4 h-4 mr-2" />
                              Generate Outreach
                            </Button>
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
