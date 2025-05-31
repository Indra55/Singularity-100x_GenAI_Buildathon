"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Edit,
  Save,
  RefreshCw,
  Zap,
  Target,
  Award,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Calendar,
  DollarSign,
  Languages,
  Code,
  Settings,
  HelpCircle,
  Share2,
  Star,
  TrendingUp,
  Users,
  Building,
  Clock,
  Search,
  Grid,
  List,
  type File,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ParsedResume {
  id: string
  fileName: string
  fileSize: string
  uploadDate: Date
  status: "parsing" | "completed" | "error"
  confidence: number
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    portfolio?: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    duration: string
    location: string
    description: string
    skills: string[]
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    duration: string
    gpa?: string
    achievements: string[]
  }>
  skills: {
    technical: Array<{ name: string; level: number; category: string }>
    soft: Array<{ name: string; level: number }>
    languages: Array<{ name: string; level: string }>
    certifications: Array<{ name: string; issuer: string; date: string; expiry?: string }>
  }
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    duration: string
    url?: string
    github?: string
  }>
  achievements: string[]
  publications: Array<{
    title: string
    venue: string
    date: string
    url?: string
  }>
  aiAnalysis: {
    overallScore: number
    strengths: string[]
    improvements: string[]
    roleRecommendations: string[]
    salaryEstimate: { min: number; max: number; currency: string }
    experienceLevel: string
    topSkills: string[]
    industryFit: Array<{ industry: string; score: number }>
  }
}

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "parsing" | "completed" | "error"
  error?: string
}

export default function ResumeParserPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [parsedResumes, setParsedResumes] = useState<ParsedResume[]>([])
  const [selectedResume, setSelectedResume] = useState<ParsedResume | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf" || file.type.startsWith("image/") || file.name.endsWith(".docx")) {
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: "uploading",
        }

        setUploadedFiles((prev) => [...prev, uploadedFile])

        // Simulate upload progress
        const uploadInterval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => {
              if (f.id === uploadedFile.id) {
                const newProgress = Math.min(f.progress + Math.random() * 20, 100)
                if (newProgress >= 100) {
                  clearInterval(uploadInterval)
                  return { ...f, progress: 100, status: "parsing" }
                }
                return { ...f, progress: newProgress }
              }
              return f
            }),
          )
        }, 200)

        // Simulate parsing
        setTimeout(
          () => {
            setUploadedFiles((prev) => prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: "completed" } : f)))

            // Generate mock parsed resume
            const mockParsedResume: ParsedResume = {
              id: uploadedFile.id,
              fileName: file.name,
              fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              uploadDate: new Date(),
              status: "completed",
              confidence: 85 + Math.random() * 15,
              personalInfo: {
                name: "Sarah Chen",
                email: "sarah.chen@email.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA",
                linkedin: "https://linkedin.com/in/sarahchen",
                github: "https://github.com/sarahchen",
                portfolio: "https://sarahchen.dev",
                summary:
                  "Experienced AI engineer with 6+ years specializing in machine learning, natural language processing, and scalable AI systems. Proven track record of building production-grade AI applications that serve millions of users.",
              },
              experience: [
                {
                  id: "exp1",
                  company: "TechCorp",
                  position: "Senior AI Engineer",
                  duration: "2021 - Present",
                  location: "San Francisco, CA",
                  description:
                    "Lead development of AI-powered recommendation systems and natural language processing pipelines. Managed a team of 5 engineers and delivered 3 major product features.",
                  skills: ["Python", "TensorFlow", "PyTorch", "AWS", "Kubernetes", "LangChain"],
                  achievements: [
                    "Improved recommendation accuracy by 35%",
                    "Reduced model inference time by 60%",
                    "Led migration to microservices architecture",
                  ],
                },
                {
                  id: "exp2",
                  company: "AI Startup",
                  position: "Machine Learning Engineer",
                  duration: "2019 - 2021",
                  location: "Palo Alto, CA",
                  description:
                    "Developed computer vision models for autonomous vehicles and implemented real-time object detection systems.",
                  skills: ["Python", "OpenCV", "TensorFlow", "Docker", "GCP"],
                  achievements: [
                    "Built real-time object detection with 99.2% accuracy",
                    "Optimized model performance for edge devices",
                    "Published 2 research papers",
                  ],
                },
              ],
              education: [
                {
                  id: "edu1",
                  institution: "Stanford University",
                  degree: "Master of Science",
                  field: "Computer Science",
                  duration: "2017 - 2019",
                  gpa: "3.8",
                  achievements: ["Dean's List", "AI Research Fellowship", "Outstanding Graduate Award"],
                },
                {
                  id: "edu2",
                  institution: "UC Berkeley",
                  degree: "Bachelor of Science",
                  field: "Computer Science",
                  duration: "2013 - 2017",
                  gpa: "3.7",
                  achievements: ["Magna Cum Laude", "CS Honor Society"],
                },
              ],
              skills: {
                technical: [
                  { name: "Python", level: 95, category: "Programming" },
                  { name: "TensorFlow", level: 90, category: "ML Framework" },
                  { name: "PyTorch", level: 85, category: "ML Framework" },
                  { name: "AWS", level: 80, category: "Cloud" },
                  { name: "Kubernetes", level: 75, category: "DevOps" },
                  { name: "LangChain", level: 88, category: "AI/LLM" },
                  { name: "React", level: 70, category: "Frontend" },
                  { name: "Node.js", level: 65, category: "Backend" },
                ],
                soft: [
                  { name: "Leadership", level: 90 },
                  { name: "Communication", level: 85 },
                  { name: "Problem Solving", level: 95 },
                  { name: "Team Collaboration", level: 88 },
                ],
                languages: [
                  { name: "English", level: "Native" },
                  { name: "Mandarin", level: "Fluent" },
                  { name: "Spanish", level: "Conversational" },
                ],
                certifications: [
                  {
                    name: "AWS Machine Learning Specialty",
                    issuer: "Amazon Web Services",
                    date: "2023",
                    expiry: "2026",
                  },
                  {
                    name: "Google Cloud Professional ML Engineer",
                    issuer: "Google Cloud",
                    date: "2022",
                    expiry: "2025",
                  },
                ],
              },
              projects: [
                {
                  id: "proj1",
                  name: "AI-Powered Code Assistant",
                  description: "Built an intelligent code completion and review system using large language models",
                  technologies: ["Python", "Transformers", "FastAPI", "React", "PostgreSQL"],
                  duration: "6 months",
                  github: "https://github.com/sarahchen/ai-code-assistant",
                },
                {
                  id: "proj2",
                  name: "Real-time Sentiment Analysis",
                  description: "Developed a scalable sentiment analysis system for social media monitoring",
                  technologies: ["Python", "Apache Kafka", "Redis", "Docker", "AWS"],
                  duration: "4 months",
                  url: "https://sentiment-analyzer.demo.com",
                },
              ],
              achievements: [
                "Published 3 papers in top-tier AI conferences",
                "Winner of AI Innovation Award 2023",
                "Speaker at 5 international tech conferences",
                "Mentor for 10+ junior engineers",
              ],
              publications: [
                {
                  title: "Efficient Neural Architecture Search for Transformer Models",
                  venue: "NeurIPS 2023",
                  date: "2023",
                  url: "https://papers.neurips.cc/paper/2023/hash/abc123.html",
                },
                {
                  title: "Scalable Real-time Recommendation Systems",
                  venue: "ICML 2022",
                  date: "2022",
                  url: "https://proceedings.mlr.press/v162/chen22a.html",
                },
              ],
              aiAnalysis: {
                overallScore: 92,
                strengths: [
                  "Strong technical expertise in AI/ML",
                  "Proven leadership and team management skills",
                  "Excellent track record of delivering production systems",
                  "Strong educational background from top universities",
                  "Active in research and publications",
                ],
                improvements: [
                  "Could benefit from more frontend development experience",
                  "Consider expanding cloud platform expertise beyond AWS",
                  "Opportunity to gain more product management skills",
                ],
                roleRecommendations: [
                  "Senior AI Engineer",
                  "ML Engineering Manager",
                  "AI Research Scientist",
                  "Principal ML Engineer",
                  "AI Product Manager",
                ],
                salaryEstimate: { min: 180000, max: 250000, currency: "USD" },
                experienceLevel: "Senior",
                topSkills: ["Python", "TensorFlow", "AI/ML", "Leadership", "System Design"],
                industryFit: [
                  { industry: "Technology", score: 95 },
                  { industry: "AI/ML", score: 98 },
                  { industry: "Fintech", score: 85 },
                  { industry: "Healthcare", score: 80 },
                  { industry: "Automotive", score: 75 },
                ],
              },
            }

            setParsedResumes((prev) => [...prev, mockParsedResume])
          },
          3000 + Math.random() * 2000,
        )
      }
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    setParsedResumes((prev) => prev.filter((r) => r.id !== fileId))
    if (selectedResume?.id === fileId) {
      setSelectedResume(null)
    }
  }

  const getSkillColor = (level: number) => {
    if (level >= 90) return "bg-green-500"
    if (level >= 75) return "bg-blue-500"
    if (level >= 60) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const filteredResumes = parsedResumes.filter((resume) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        resume.personalInfo.name.toLowerCase().includes(query) ||
        resume.personalInfo.email.toLowerCase().includes(query) ||
        resume.skills.technical.some((skill) => skill.name.toLowerCase().includes(query))
      )
    }
    if (filterBy === "all") return true
    if (filterBy === "high-score") return resume.aiAnalysis.overallScore >= 85
    if (filterBy === "recent") return new Date().getTime() - resume.uploadDate.getTime() < 24 * 60 * 60 * 1000
    return true
  })

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-pink-500/5 rounded-full mix-blend-normal filter blur-[200px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  HireAI
                </span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Resume Parser & AI Analysis
              </Badge>
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
              AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Resume Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upload resumes and get instant AI-powered analysis with skill extraction, experience evaluation, and
            intelligent recommendations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-xl shadow-2xl mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-purple-400" />
                    <span>Upload Resumes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Drop Zone */}
                  <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragOver
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/30"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />

                    <motion.div animate={isDragOver ? { scale: 1.1 } : { scale: 1 }} className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white mb-2">
                          {isDragOver ? "Drop files here" : "Upload Resume Files"}
                        </p>
                        <p className="text-sm text-gray-400">
                          Drag & drop or click to select
                          <br />
                          PDF, DOC, DOCX, or images
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Upload Progress */}
                  <AnimatePresence>
                    {uploadedFiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-3"
                      >
                        {uploadedFiles.map((file) => (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-800/50 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <div>
                                  <p className="text-sm font-medium text-white truncate max-w-[200px]">
                                    {file.file.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="text-gray-400 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            {file.status === "uploading" && (
                              <div className="space-y-2">
                                <Progress value={file.progress} className="h-2" />
                                <p className="text-xs text-gray-400">Uploading... {Math.round(file.progress)}%</p>
                              </div>
                            )}

                            {file.status === "parsing" && (
                              <div className="flex items-center space-x-2">
                                <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                                <p className="text-xs text-purple-400">AI is analyzing resume...</p>
                              </div>
                            )}

                            {file.status === "completed" && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <p className="text-xs text-green-400">Analysis completed</p>
                              </div>
                            )}

                            {file.status === "error" && (
                              <div className="flex items-center space-x-2">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <p className="text-xs text-red-400">{file.error || "Upload failed"}</p>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Resume List */}
              {parsedResumes.length > 0 && (
                <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span>Parsed Resumes ({parsedResumes.length})</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                          className="text-gray-400 hover:text-white"
                        >
                          {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search resumes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                        />
                      </div>
                      <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="all">All</option>
                        <option value="high-score">High Score (85+)</option>
                        <option value="recent">Recent</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredResumes.map((resume) => (
                        <motion.div
                          key={resume.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedResume?.id === resume.id
                              ? "bg-purple-500/20 border border-purple-500/50"
                              : "bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30"
                          }`}
                          onClick={() => setSelectedResume(resume)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                                  {resume.personalInfo.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-white">{resume.personalInfo.name}</p>
                                <p className="text-xs text-gray-400">{resume.fileName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1 mb-1">
                                <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                                <span className="text-sm font-bold text-yellow-400">
                                  {resume.aiAnalysis.overallScore}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{resume.uploadDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Analysis Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {selectedResume ? (
                <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-xl shadow-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
                            {selectedResume.personalInfo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedResume.personalInfo.name}</h2>
                          <p className="text-gray-400">{selectedResume.personalInfo.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                              <span className="text-lg font-bold text-yellow-400">
                                {selectedResume.aiAnalysis.overallScore}
                              </span>
                              <span className="text-sm text-gray-400">/100</span>
                            </div>
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              {selectedResume.aiAnalysis.experienceLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          className="border-gray-700 text-gray-300"
                        >
                          {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                          {isEditing ? "Save" : "Edit"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-6 mt-6">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                              <Users className="w-5 h-5 mr-2 text-purple-400" />
                              Personal Information
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{selectedResume.personalInfo.email}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{selectedResume.personalInfo.phone}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{selectedResume.personalInfo.location}</span>
                              </div>
                              {selectedResume.personalInfo.linkedin && (
                                <div className="flex items-center space-x-3">
                                  <Linkedin className="w-4 h-4 text-blue-400" />
                                  <a
                                    href={selectedResume.personalInfo.linkedin}
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    LinkedIn Profile
                                  </a>
                                </div>
                              )}
                              {selectedResume.personalInfo.github && (
                                <div className="flex items-center space-x-3">
                                  <Github className="w-4 h-4 text-gray-400" />
                                  <a
                                    href={selectedResume.personalInfo.github}
                                    className="text-gray-300 hover:text-white"
                                  >
                                    GitHub Profile
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                              <Target className="w-5 h-5 mr-2 text-green-400" />
                              Quick Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                                <Briefcase className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{selectedResume.experience.length}</div>
                                <div className="text-sm text-gray-400">Positions</div>
                              </div>
                              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                                <Code className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">
                                  {selectedResume.skills.technical.length}
                                </div>
                                <div className="text-sm text-gray-400">Skills</div>
                              </div>
                              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                                <GraduationCap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{selectedResume.education.length}</div>
                                <div className="text-sm text-gray-400">Degrees</div>
                              </div>
                              <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">
                                  {selectedResume.publications.length}
                                </div>
                                <div className="text-sm text-gray-400">Publications</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-400" />
                            Professional Summary
                          </h3>
                          {isEditing ? (
                            <Textarea
                              value={selectedResume.personalInfo.summary}
                              className="bg-gray-800/50 border-gray-700/50 text-white"
                              rows={4}
                            />
                          ) : (
                            <p className="text-gray-300 leading-relaxed bg-gray-800/30 rounded-lg p-4">
                              {selectedResume.personalInfo.summary}
                            </p>
                          )}
                        </div>

                        {/* Top Skills */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                            Top Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedResume.aiAnalysis.topSkills.map((skill) => (
                              <Badge key={skill} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Salary Estimate */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                            Salary Estimate
                          </h3>
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-400">
                              ${selectedResume.aiAnalysis.salaryEstimate.min.toLocaleString()} - $
                              {selectedResume.aiAnalysis.salaryEstimate.max.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Based on skills, experience, and market data
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="experience" className="space-y-6 mt-6">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
                          Work Experience
                        </h3>
                        <div className="space-y-6">
                          {selectedResume.experience.map((exp) => (
                            <motion.div
                              key={exp.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-xl font-semibold text-white">{exp.position}</h4>
                                  <p className="text-purple-400 font-medium">{exp.company}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>{exp.duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{exp.location}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>

                              {exp.achievements.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements:</h5>
                                  <ul className="space-y-1">
                                    {exp.achievements.map((achievement, idx) => (
                                      <li key={idx} className="text-sm text-gray-300 flex items-start">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                                        {achievement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div>
                                <h5 className="text-sm font-semibold text-gray-400 mb-2">Technologies Used:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {exp.skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="text-xs bg-gray-700 text-gray-300"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="skills" className="space-y-6 mt-6">
                        {/* Technical Skills */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Code className="w-5 h-5 mr-2 text-green-400" />
                            Technical Skills
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedResume.skills.technical.map((skill) => (
                              <div key={skill.name} className="bg-gray-800/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-white">{skill.name}</span>
                                  <span className="text-sm text-gray-400">{skill.level}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className={`h-2 rounded-full ${getSkillColor(skill.level)}`}
                                  />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{skill.category}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Soft Skills */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-purple-400" />
                            Soft Skills
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedResume.skills.soft.map((skill) => (
                              <div key={skill.name} className="bg-gray-800/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-white">{skill.name}</span>
                                  <span className="text-sm text-gray-400">{skill.level}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                    className="h-2 rounded-full bg-purple-500"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Languages */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Languages className="w-5 h-5 mr-2 text-blue-400" />
                            Languages
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {selectedResume.skills.languages.map((lang) => (
                              <div key={lang.name} className="bg-gray-800/30 rounded-lg p-4 text-center">
                                <div className="font-medium text-white">{lang.name}</div>
                                <div className="text-sm text-blue-400 mt-1">{lang.level}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Certifications */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-yellow-400" />
                            Certifications
                          </h3>
                          <div className="space-y-3">
                            {selectedResume.skills.certifications.map((cert) => (
                              <div key={cert.name} className="bg-gray-800/30 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-white">{cert.name}</div>
                                    <div className="text-sm text-gray-400">{cert.issuer}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-300">{cert.date}</div>
                                    {cert.expiry && <div className="text-xs text-gray-500">Expires: {cert.expiry}</div>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="education" className="space-y-6 mt-6">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2 text-purple-400" />
                          Education
                        </h3>
                        <div className="space-y-6">
                          {selectedResume.education.map((edu) => (
                            <motion.div
                              key={edu.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
                                  <p className="text-purple-400 font-medium">{edu.field}</p>
                                  <p className="text-gray-400">{edu.institution}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>{edu.duration}</span>
                                    </div>
                                    {edu.gpa && (
                                      <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4" />
                                        <span>GPA: {edu.gpa}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {edu.achievements.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-semibold text-gray-400 mb-2">Achievements:</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {edu.achievements.map((achievement, idx) => (
                                      <Badge
                                        key={idx}
                                        className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                      >
                                        {achievement}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="projects" className="space-y-6 mt-6">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Rocket className="w-5 h-5 mr-2 text-orange-400" />
                          Projects
                        </h3>
                        <div className="space-y-6">
                          {selectedResume.projects.map((project) => (
                            <motion.div
                              key={project.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="text-xl font-semibold text-white">{project.name}</h4>
                                  <p className="text-gray-300 mt-2 leading-relaxed">{project.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{project.duration}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h5 className="text-sm font-semibold text-gray-400 mb-2">Technologies:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                {project.url && (
                                  <a
                                    href={project.url}
                                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                                  >
                                    <Globe className="w-4 h-4" />
                                    <span>Live Demo</span>
                                  </a>
                                )}
                                {project.github && (
                                  <a
                                    href={project.github}
                                    className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm"
                                  >
                                    <Github className="w-4 h-4" />
                                    <span>Source Code</span>
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="analysis" className="space-y-6 mt-6">
                        {/* AI Analysis Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30">
                            <div className="flex items-center space-x-3 mb-4">
                              <TrendingUp className="w-8 h-8 text-green-400" />
                              <div>
                                <div className="text-2xl font-bold text-green-400">
                                  {selectedResume.aiAnalysis.overallScore}
                                </div>
                                <div className="text-sm text-green-300">Overall Score</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">Based on skills, experience, and market demand</div>
                          </div>

                          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-6 border border-blue-500/30">
                            <div className="flex items-center space-x-3 mb-4">
                              <Briefcase className="w-8 h-8 text-blue-400" />
                              <div>
                                <div className="text-2xl font-bold text-blue-400">
                                  {selectedResume.aiAnalysis.experienceLevel}
                                </div>
                                <div className="text-sm text-blue-300">Experience Level</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              Determined by years of experience and skill depth
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30">
                            <div className="flex items-center space-x-3 mb-4">
                              <DollarSign className="w-8 h-8 text-purple-400" />
                              <div>
                                <div className="text-lg font-bold text-purple-400">
                                  ${selectedResume.aiAnalysis.salaryEstimate.min}k - $
                                  {Math.round(selectedResume.aiAnalysis.salaryEstimate.max / 1000)}k
                                </div>
                                <div className="text-sm text-purple-300">Salary Range</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">Market-based compensation estimate</div>
                          </div>
                        </div>

                        {/* Strengths */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                            Key Strengths
                          </h3>
                          <div className="space-y-3">
                            {selectedResume.aiAnalysis.strengths.map((strength, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start space-x-3 bg-green-500/10 rounded-lg p-4 border border-green-500/20"
                              >
                                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300">{strength}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Areas for Improvement */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Target className="w-5 h-5 mr-2 text-yellow-400" />
                            Areas for Improvement
                          </h3>
                          <div className="space-y-3">
                            {selectedResume.aiAnalysis.improvements.map((improvement, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start space-x-3 bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20"
                              >
                                <Target className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300">{improvement}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Role Recommendations */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Rocket className="w-5 h-5 mr-2 text-purple-400" />
                            Recommended Roles
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedResume.aiAnalysis.roleRecommendations.map((role, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center"
                              >
                                <span className="text-purple-300 font-medium">{role}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Industry Fit */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Building className="w-5 h-5 mr-2 text-blue-400" />
                            Industry Fit Analysis
                          </h3>
                          <div className="space-y-4">
                            {selectedResume.aiAnalysis.industryFit.map((industry) => (
                              <div key={industry.industry} className="bg-gray-800/30 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-white">{industry.industry}</span>
                                  <span className="text-sm text-gray-400">{industry.score}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${industry.score}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className={`h-2 rounded-full ${getSkillColor(industry.score)}`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-xl shadow-2xl">
                  <CardContent className="p-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Resume Selected</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                          Upload a resume or select one from the list to see detailed AI-powered analysis and insights.
                        </p>
                      </div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Resume
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
