"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Users,
  FileText,
  TrendingUp,
  Globe,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Briefcase,
  Mail,
  Linkedin,
  Github,
  Twitter,
  Upload,
  Eye,
  Heart,
  X,
  Zap,
  Settings,
  RefreshCw,
  Send,
  Copy,
  Edit,
  Sparkles,
} from "lucide-react"

interface Candidate {
  id: string
  name: string
  title: string
  company: string
  location: string
  experience: string
  skills: string[]
  avatar: string
  matchScore: number
  salary: string
  education: string
  email: string
  linkedin?: string
  github?: string
  twitter?: string
  summary: string
  isLiked?: boolean
  isViewed?: boolean
}

interface OutreachMessage {
  id: string
  candidateId: string
  type: "email" | "linkedin" | "twitter"
  subject: string
  content: string
  personalization: string[]
  confidence: number
  responseRate: number
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Next.js", "GraphQL"],
    avatar: "/placeholder.svg?height=100&width=100",
    matchScore: 95,
    salary: "$120k - $150k",
    education: "BS Computer Science, Stanford",
    email: "sarah.chen@email.com",
    linkedin: "linkedin.com/in/sarahchen",
    github: "github.com/sarahchen",
    summary: "Passionate frontend developer with expertise in modern React ecosystem and performance optimization.",
    isLiked: false,
    isViewed: false,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    experience: "4+ years",
    skills: ["Node.js", "Python", "AWS", "Docker"],
    avatar: "/placeholder.svg?height=100&width=100",
    matchScore: 88,
    salary: "$110k - $140k",
    education: "MS Software Engineering, MIT",
    email: "marcus.johnson@email.com",
    linkedin: "linkedin.com/in/marcusjohnson",
    summary: "Full-stack engineer with strong backend expertise and cloud architecture experience.",
    isLiked: false,
    isViewed: false,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Austin, TX",
    experience: "6+ years",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    avatar: "/placeholder.svg?height=100&width=100",
    matchScore: 92,
    salary: "$95k - $125k",
    education: "BFA Design, RISD",
    email: "emily.rodriguez@email.com",
    linkedin: "linkedin.com/in/emilyrodriguez",
    summary: "Creative UI/UX designer with a focus on user-centered design and accessibility.",
    isLiked: false,
    isViewed: false,
  },
  {
    id: "4",
    name: "David Kim",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    experience: "7+ years",
    skills: ["Kubernetes", "Terraform", "Jenkins", "Monitoring"],
    avatar: "/placeholder.svg?height=100&width=100",
    matchScore: 85,
    salary: "$130k - $160k",
    education: "BS Computer Engineering, UC Berkeley",
    email: "david.kim@email.com",
    github: "github.com/davidkim",
    summary: "DevOps engineer specializing in container orchestration and infrastructure automation.",
    isLiked: false,
    isViewed: false,
  },
  {
    id: "5",
    name: "Lisa Wang",
    title: "Data Scientist",
    company: "DataCorp",
    location: "Boston, MA",
    experience: "5+ years",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    avatar: "/placeholder.svg?height=100&width=100",
    matchScore: 90,
    salary: "$125k - $155k",
    education: "PhD Data Science, Harvard",
    email: "lisa.wang@email.com",
    linkedin: "linkedin.com/in/lisawang",
    summary: "Data scientist with expertise in machine learning and predictive analytics.",
    isLiked: false,
    isViewed: false,
  },
]

export default function EnhancedHireAIInterface() {
  const [activeTab, setActiveTab] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [outreachMessages, setOutreachMessages] = useState<OutreachMessage[]>([])
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false)
  const [searchResults, setSearchResults] = useState<Candidate[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    skills: "",
    salary: "",
  })

  // Outreach configuration
  const [outreachConfig, setOutreachConfig] = useState({
    type: "email" as "email" | "linkedin" | "twitter",
    tone: "professional" as "professional" | "casual" | "enthusiastic" | "direct",
    length: "medium" as "short" | "medium" | "long",
    customInstructions: "",
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      const filtered = mockCandidates.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          candidate.company.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filtered)
      setIsSearching(false)
    }, 1500)
  }

  const handleCandidateAction = (action: "like" | "pass", candidateId: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, isLiked: action === "like", isViewed: true } : candidate,
      ),
    )

    if (action === "like") {
      setSelectedCandidates((prev) => [...prev, candidateId])
    }

    // Move to next candidate (with bounds checking)
    if (currentCandidateIndex < candidates.length - 1) {
      setCurrentCandidateIndex((prev) => prev + 1)
    }
  }

  const navigateCandidate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentCandidateIndex > 0) {
      setCurrentCandidateIndex((prev) => prev - 1)
    } else if (direction === "next" && currentCandidateIndex < candidates.length - 1) {
      setCurrentCandidateIndex((prev) => prev + 1)
    }
  }

  const generateOutreach = async () => {
    if (selectedCandidates.length === 0) return

    setIsGeneratingOutreach(true)

    // Simulate AI generation
    setTimeout(() => {
      const newMessages: OutreachMessage[] = selectedCandidates.map((candidateId) => {
        const candidate = candidates.find((c) => c.id === candidateId)!
        return {
          id: `msg-${candidateId}-${Date.now()}`,
          candidateId,
          type: outreachConfig.type,
          subject: `Exciting ${candidate.title} Opportunity at Our Company`,
          content: generateMessageContent(candidate, outreachConfig),
          personalization: [
            `Mentioned ${candidate.company} experience`,
            `Referenced ${candidate.skills[0]} expertise`,
            `Highlighted location match`,
          ],
          confidence: Math.floor(Math.random() * 20) + 80,
          responseRate: Math.floor(Math.random() * 30) + 15,
        }
      })

      setOutreachMessages(newMessages)
      setIsGeneratingOutreach(false)
    }, 2000)
  }

  const generateMessageContent = (candidate: Candidate, config: any) => {
    const toneMap = {
      professional: "I hope this message finds you well.",
      casual: "Hey there!",
      enthusiastic: "I'm excited to reach out to you!",
      direct: "I'll get straight to the point.",
    }

    const lengthMap = {
      short: `${toneMap[config.tone]} We have an amazing ${candidate.title} opportunity that matches your ${candidate.skills[0]} background. Interested in learning more?`,
      medium: `${toneMap[config.tone]} I came across your profile and was impressed by your experience at ${candidate.company}. We have an exciting ${candidate.title} position that would be perfect for someone with your ${candidate.skills[0]} and ${candidate.skills[1]} expertise. Would you be open to a brief conversation about this opportunity?`,
      long: `${toneMap[config.tone]} I hope you're doing well. I'm reaching out because I came across your impressive background as a ${candidate.title} at ${candidate.company}. Your expertise in ${candidate.skills.join(", ")} caught my attention, and I believe you'd be a fantastic fit for a role we're looking to fill. Our company is growing rapidly, and we're seeking talented individuals like yourself to join our team. The position offers competitive compensation, excellent benefits, and the opportunity to work on cutting-edge projects. Would you be interested in learning more about this opportunity?`,
    }

    return lengthMap[config.length]
  }

  const currentCandidate = candidates[currentCandidateIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HireAI Platform
              </h1>
              <p className="text-slate-600 mt-2">AI-powered recruitment made simple</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Zap className="w-3 h-3 mr-1" />
                AI Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="parser" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Parser
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="enrichment" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Enrichment
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Outreach
            </TabsTrigger>
          </TabsList>

          {/* Natural Language Search */}
          <TabsContent value="search">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Natural Language Search
                  </CardTitle>
                  <CardDescription>Search for candidates using natural language queries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="e.g., 'Find React developers in San Francisco with 5+ years experience'"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
                      {isSearching ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      Search
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-4 gap-4">
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="san-francisco">San Francisco</SelectItem>
                        <SelectItem value="new-york">New York</SelectItem>
                        <SelectItem value="austin">Austin</SelectItem>
                        <SelectItem value="seattle">Seattle</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.experience}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, experience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Skills"
                      value={filters.skills}
                      onChange={(e) => setFilters((prev) => ({ ...prev, skills: e.target.value }))}
                    />
                    <Input
                      placeholder="Salary range"
                      value={filters.salary}
                      onChange={(e) => setFilters((prev) => ({ ...prev, salary: e.target.value }))}
                    />
                  </div>

                  {/* Search Results */}
                  {isSearching && (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-slate-600">Searching candidates...</p>
                      </div>
                    </div>
                  )}

                  {searchResults.length > 0 && !isSearching && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((candidate) => (
                        <motion.div
                          key={candidate.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-lg p-4 shadow-lg border border-slate-200"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                              <p className="text-sm text-slate-600">{candidate.title}</p>
                              <p className="text-xs text-slate-500">{candidate.company}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-slate-600">{candidate.matchScore}% match</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm" className="w-full mt-3" variant="outline">
                            View Profile
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Candidate Browser */}
          <TabsContent value="browse">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Candidate Browser
                  </CardTitle>
                  <CardDescription>Browse and evaluate candidates with AI-powered matching</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentCandidate && (
                    <div className="max-w-2xl mx-auto">
                      {/* Navigation */}
                      <div className="flex items-center justify-between mb-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateCandidate("prev")}
                          disabled={currentCandidateIndex === 0}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <span className="text-sm text-slate-600">
                          {currentCandidateIndex + 1} of {candidates.length}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateCandidate("next")}
                          disabled={currentCandidateIndex === candidates.length - 1}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>

                      {/* Candidate Card */}
                      <motion.div
                        key={currentCandidate.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-white rounded-xl p-6 shadow-xl border border-slate-200"
                      >
                        <div className="text-center mb-6">
                          <Avatar className="w-24 h-24 mx-auto mb-4">
                            <AvatarImage src={currentCandidate.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg">
                              {currentCandidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h2 className="text-2xl font-bold text-slate-900">{currentCandidate.name}</h2>
                          <p className="text-lg text-slate-600">{currentCandidate.title}</p>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <Briefcase className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-600">{currentCandidate.company}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-600">{currentCandidate.location}</span>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">AI Match Score</span>
                            <span className="text-sm font-bold text-blue-600">{currentCandidate.matchScore}%</span>
                          </div>
                          <Progress value={currentCandidate.matchScore} className="h-2" />
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Experience</h4>
                            <p className="text-slate-600">{currentCandidate.experience}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Salary</h4>
                            <p className="text-slate-600">{currentCandidate.salary}</p>
                          </div>
                          <div className="col-span-2">
                            <h4 className="font-semibold text-slate-700 mb-2">Education</h4>
                            <p className="text-slate-600">{currentCandidate.education}</p>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-slate-700 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentCandidate.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-slate-700 mb-2">Summary</h4>
                          <p className="text-slate-600">{currentCandidate.summary}</p>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-slate-700 mb-2">Contact</h4>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-600">{currentCandidate.email}</span>
                            </div>
                            {currentCandidate.linkedin && (
                              <div className="flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-slate-600">LinkedIn</span>
                              </div>
                            )}
                            {currentCandidate.github && (
                              <div className="flex items-center gap-2">
                                <Github className="w-4 h-4 text-slate-800" />
                                <span className="text-sm text-slate-600">GitHub</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleCandidateAction("pass", currentCandidate.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Pass
                          </Button>
                          <Button
                            size="lg"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleCandidateAction("like", currentCandidate.id)}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Interested
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Resume Parser */}
          <TabsContent value="parser">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    AI Resume Parser
                  </CardTitle>
                  <CardDescription>Upload and parse resumes with AI-powered extraction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Upload Resume</h3>
                    <p className="text-slate-600 mb-4">Drag and drop files or click to browse</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>

                  {/* Parsing Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Extracted Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Name</Label>
                          <Input value="John Doe" readOnly />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <Input value="john.doe@email.com" readOnly />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <Input value="+1 (555) 123-4567" readOnly />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Skills</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {["JavaScript", "React", "Node.js", "Python"].map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">AI Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Experience Level</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={75} className="flex-1" />
                            <span className="text-sm text-slate-600">Senior</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Match Score</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={88} className="flex-1" />
                            <span className="text-sm text-slate-600">88%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Key Strengths</Label>
                          <ul className="text-sm text-slate-600 mt-1 space-y-1">
                            <li>• Strong full-stack development experience</li>
                            <li>• Leadership and team management skills</li>
                            <li>• Modern technology stack expertise</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Candidate Ranking */}
          <TabsContent value="ranking">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    AI Candidate Ranking
                  </CardTitle>
                  <CardDescription>AI-powered ranking based on job requirements and candidate profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidates
                      .sort((a, b) => b.matchScore - a.matchScore)
                      .map((candidate, index) => (
                        <motion.div
                          key={candidate.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                              {index + 1}
                            </div>
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
                              <p className="text-sm text-slate-600">
                                {candidate.title} at {candidate.company}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500" />
                                  <span className="text-xs text-slate-600">{candidate.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3 text-slate-500" />
                                  <span className="text-xs text-slate-600">{candidate.experience}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-bold text-slate-900">{candidate.matchScore}%</span>
                              </div>
                              <Progress value={candidate.matchScore} className="w-24" />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Web Enrichment */}
          <TabsContent value="enrichment">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Web Enrichment
                  </CardTitle>
                  <CardDescription>
                    Automatically enrich candidate profiles with data from LinkedIn, GitHub, and other platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enrichment Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Linkedin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">LinkedIn</h4>
                            <p className="text-sm text-slate-600">85% enriched</p>
                          </div>
                        </div>
                        <Progress value={85} className="mt-3" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Github className="w-5 h-5 text-slate-800" />
                          </div>
                          <div>
                            <h4 className="font-semibold">GitHub</h4>
                            <p className="text-sm text-slate-600">72% enriched</p>
                          </div>
                        </div>
                        <Progress value={72} className="mt-3" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                            <Twitter className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Twitter</h4>
                            <p className="text-sm text-slate-600">45% enriched</p>
                          </div>
                        </div>
                        <Progress value={45} className="mt-3" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bulk Enrichment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Bulk Enrichment</CardTitle>
                      <CardDescription>Upload a CSV file with candidate emails for bulk enrichment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-600 mb-2">Upload CSV file with candidate emails</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                      <Button className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Start Enrichment
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Enriched Profiles */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recently Enriched Profiles</h3>
                    {candidates.slice(0, 3).map((candidate) => (
                      <Card key={candidate.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{candidate.name}</h4>
                              <p className="text-sm text-slate-600">{candidate.title}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Linkedin className="w-3 h-3 mr-1" />
                                  LinkedIn ✓
                                </Badge>
                                {candidate.github && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Github className="w-3 h-3 mr-1" />
                                    GitHub ✓
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  95% confidence
                                </Badge>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Outreach Generator */}
          <TabsContent value="outreach">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    AI Outreach Generator
                  </CardTitle>
                  <CardDescription>Generate personalized outreach messages for selected candidates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Message Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Message Type</Label>
                          <Select
                            value={outreachConfig.type}
                            onValueChange={(value: any) => setOutreachConfig((prev) => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Tone</Label>
                          <Select
                            value={outreachConfig.tone}
                            onValueChange={(value: any) => setOutreachConfig((prev) => ({ ...prev, tone: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                              <SelectItem value="direct">Direct</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Length</Label>
                          <Select
                            value={outreachConfig.length}
                            onValueChange={(value: any) => setOutreachConfig((prev) => ({ ...prev, length: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="long">Long</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Custom Instructions</Label>
                          <Textarea
                            placeholder="Add any specific instructions for personalization..."
                            value={outreachConfig.customInstructions}
                            onChange={(e) =>
                              setOutreachConfig((prev) => ({ ...prev, customInstructions: e.target.value }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Selected Candidates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedCandidates.length === 0 ? (
                          <p className="text-slate-600 text-center py-8">
                            No candidates selected. Go to the Browse tab to select candidates.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {selectedCandidates.map((candidateId) => {
                              const candidate = candidates.find((c) => c.id === candidateId)!
                              return (
                                <div key={candidateId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {candidate.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{candidate.name}</p>
                                    <p className="text-xs text-slate-600">{candidate.title}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      setSelectedCandidates((prev) => prev.filter((id) => id !== candidateId))
                                    }
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        <Button
                          className="w-full mt-4"
                          onClick={generateOutreach}
                          disabled={selectedCandidates.length === 0 || isGeneratingOutreach}
                        >
                          {isGeneratingOutreach ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          Generate Messages
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Generated Messages */}
                  {outreachMessages.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Generated Messages</h3>
                      {outreachMessages.map((message) => {
                        const candidate = candidates.find((c) => c.id === message.candidateId)!
                        return (
                          <Card key={message.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>
                                      {candidate.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-semibold">{candidate.name}</h4>
                                    <p className="text-sm text-slate-600">{message.type} message</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{message.confidence}% confidence</Badge>
                                  <Badge variant="outline">{message.responseRate}% response rate</Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Subject</Label>
                                <Input value={message.subject} readOnly className="mt-1" />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Message</Label>
                                <Textarea value={message.content} readOnly className="mt-1 min-h-[120px]" />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Personalization</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {message.personalization.map((item, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button size="sm">
                                  <Send className="w-4 h-4 mr-2" />
                                  Send
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
