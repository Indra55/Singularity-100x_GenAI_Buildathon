"use client"

import type React from "react"

import type { FC } from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Brain,
  TrendingUp,
  BarChart3,
  Search,
  ArrowUp,
  ArrowDown,
  Settings,
  HelpCircle,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Target,
  Zap,
  CheckCircle,
  X,
  Plus,
  MessageSquare,
  Eye,
  FileText,
  Heart,
  BarChart,
  Github,
  Linkedin,
  Globe,
  Grid,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RankingCriteria {
  id: string
  name: string
  weight: number
  description: string
  icon: React.ReactNode
  color: string
}

interface CandidateScore {
  candidateId: string
  scores: Record<string, number>
  overallScore: number
  rank: number
  explanation: string[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

interface RankedCandidate {
  id: string
  name: string
  title: string
  company: string
  location: string
  experience: number
  skills: string[]
  avatar: string
  summary: string
  salary: string
  availability: string
  lastActive: string
  score: CandidateScore
  matchPercentage: number
  confidenceLevel: number
  riskFactors: string[]
  growthPotential: number
  cultureFit: number
  technicalFit: number
  experienceFit: number
  salaryFit: number
  locationFit: number
  availabilityFit: number
  portfolioQuality: number
  communicationSkills: number
  leadershipPotential: number
  learningAgility: number
  industryExperience: number
  projectComplexity: number
  teamCollaboration: number
  problemSolving: number
  innovation: number
  reliability: number
  adaptability: number
  motivation: number
  careerProgression: number
  educationQuality: number
  certificationRelevance: number
  publicationsImpact: number
  openSourceContributions: number
  communityInvolvement: number
  mentorshipExperience: number
  diversityValue: number
  remoteWorkReadiness: number
  timeZoneCompatibility: number
  languageSkills: number
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    portfolio?: string
  }
  aiInsights: {
    keyStrengths: string[]
    potentialConcerns: string[]
    bestFitRoles: string[]
    developmentAreas: string[]
    interviewQuestions: string[]
    onboardingRecommendations: string[]
  }
}

interface JobRequirement {
  id: string
  name: string
  importance: "required" | "preferred" | "bonus"
  description: string
}

const CandidateRankingPage: FC = () => {
  const [candidates, setCandidates] = useState<RankedCandidate[]>([])
  const [rankingCriteria, setRankingCriteria] = useState<RankingCriteria[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCriteriaEditor, setShowCriteriaEditor] = useState(false)
  const [activeTab, setActiveTab] = useState("ranking")
  const [sortBy, setSortBy] = useState("score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterMinScore, setFilterMinScore] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table" | "comparison">("cards")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [jobRequirements, setJobRequirements] = useState<JobRequirement[]>([])
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [showCandidateDetail, setShowCandidateDetail] = useState(false)

  // Initialize with mock data
  useEffect(() => {
    // Mock ranking criteria
    const mockCriteria: RankingCriteria[] = [
      {
        id: "technical",
        name: "Technical Skills",
        weight: 30,
        description: "Evaluation of technical skills and expertise relevant to the role",
        icon: <Zap className="w-5 h-5" />,
        color: "text-blue-500",
      },
      {
        id: "experience",
        name: "Experience",
        weight: 25,
        description: "Relevant work experience and past achievements",
        icon: <Briefcase className="w-5 h-5" />,
        color: "text-green-500",
      },
      {
        id: "culture",
        name: "Culture Fit",
        weight: 15,
        description: "Alignment with company values and team dynamics",
        icon: <Heart className="w-5 h-5" />,
        color: "text-pink-500",
      },
      {
        id: "communication",
        name: "Communication",
        weight: 10,
        description: "Written and verbal communication skills",
        icon: <MessageSquare className="w-5 h-5" />,
        color: "text-purple-500",
      },
      {
        id: "education",
        name: "Education",
        weight: 10,
        description: "Academic background and qualifications",
        icon: <Award className="w-5 h-5" />,
        color: "text-yellow-500",
      },
      {
        id: "potential",
        name: "Growth Potential",
        weight: 10,
        description: "Capacity for learning and career development",
        icon: <TrendingUp className="w-5 h-5" />,
        color: "text-orange-500",
      },
    ]

    // Mock job requirements
    const mockRequirements: JobRequirement[] = [
      {
        id: "req1",
        name: "5+ years of experience with AI/ML technologies",
        importance: "required",
        description: "Must have extensive experience building and deploying AI systems",
      },
      {
        id: "req2",
        name: "Proficiency in Python and TensorFlow/PyTorch",
        importance: "required",
        description: "Strong programming skills with major ML frameworks",
      },
      {
        id: "req3",
        name: "Experience with LangChain and RAG systems",
        importance: "required",
        description: "Building production-ready LLM applications",
      },
      {
        id: "req4",
        name: "Cloud platform experience (AWS/GCP/Azure)",
        importance: "preferred",
        description: "Deploying and scaling AI systems in cloud environments",
      },
      {
        id: "req5",
        name: "Experience with vector databases",
        importance: "preferred",
        description: "Working with Pinecone, Weaviate, or similar technologies",
      },
      {
        id: "req6",
        name: "Research publications or open source contributions",
        importance: "bonus",
        description: "Demonstrated expertise through published work",
      },
    ]

    // Mock candidates with detailed scoring
    const mockCandidates: RankedCandidate[] = [
      {
        id: "1",
        name: "Sarah Chen",
        title: "Senior AI Engineer",
        company: "TechCorp",
        location: "San Francisco, CA",
        experience: 6,
        skills: ["LangChain", "RAG", "Python", "TensorFlow", "Vector Databases", "AWS"],
        avatar: "/placeholder.svg?height=400&width=400",
        summary:
          "Experienced AI engineer specializing in RAG systems and LangChain applications. Built production-scale AI systems for fintech and healthcare.",
        salary: "$140,000 - $180,000",
        availability: "2 weeks notice",
        lastActive: "2 days ago",
        score: {
          candidateId: "1",
          scores: {
            technical: 92,
            experience: 88,
            culture: 85,
            communication: 90,
            education: 95,
            potential: 87,
          },
          overallScore: 90,
          rank: 1,
          explanation: [
            "Exceptional technical skills in required areas",
            "Strong experience with RAG systems and LangChain",
            "Excellent educational background",
            "Good cultural alignment based on past roles",
          ],
          strengths: [
            "Deep expertise in LangChain and RAG",
            "Production experience with AI systems",
            "Strong academic credentials",
            "Excellent communication skills",
          ],
          weaknesses: ["Limited experience with GCP/Azure", "Could benefit from more team leadership experience"],
          recommendations: [
            "Excellent fit for the Senior AI Engineer role",
            "Consider for technical leadership positions",
            "Would benefit from mentorship opportunities",
          ],
        },
        matchPercentage: 90,
        confidenceLevel: 95,
        riskFactors: ["Competitive market for AI talent", "May have multiple offers"],
        growthPotential: 88,
        cultureFit: 85,
        technicalFit: 92,
        experienceFit: 88,
        salaryFit: 85,
        locationFit: 90,
        availabilityFit: 80,
        portfolioQuality: 90,
        communicationSkills: 90,
        leadershipPotential: 82,
        learningAgility: 88,
        industryExperience: 85,
        projectComplexity: 90,
        teamCollaboration: 85,
        problemSolving: 92,
        innovation: 88,
        reliability: 90,
        adaptability: 85,
        motivation: 90,
        careerProgression: 88,
        educationQuality: 95,
        certificationRelevance: 90,
        publicationsImpact: 85,
        openSourceContributions: 80,
        communityInvolvement: 75,
        mentorshipExperience: 70,
        diversityValue: 85,
        remoteWorkReadiness: 90,
        timeZoneCompatibility: 100,
        languageSkills: 95,
        socialLinks: {
          github: "https://github.com/sarahchen",
          linkedin: "https://linkedin.com/in/sarahchen",
          portfolio: "https://sarahchen.dev",
        },
        aiInsights: {
          keyStrengths: [
            "Exceptional technical depth in RAG systems",
            "Strong production experience with LangChain",
            "Excellent problem-solving abilities",
            "Good communication skills",
          ],
          potentialConcerns: [
            "May need support in leadership development",
            "Could face retention challenges due to competitive market",
          ],
          bestFitRoles: ["Senior AI Engineer", "ML Engineering Lead", "AI Architect"],
          developmentAreas: ["Leadership skills", "Cross-functional collaboration", "Cloud platform diversity"],
          interviewQuestions: [
            "Describe your most complex RAG implementation and challenges faced",
            "How have you optimized vector search in production environments?",
            "What leadership experiences have been most formative for you?",
          ],
          onboardingRecommendations: [
            "Pair with senior architects in first month",
            "Provide early opportunities to contribute to architecture decisions",
            "Connect with cross-functional teams to build relationships",
          ],
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
        avatar: "/placeholder.svg?height=400&width=400",
        summary:
          "Research scientist with deep expertise in transformer architectures and retrieval-augmented generation. Published 15+ papers in top AI conferences.",
        salary: "$160,000 - $220,000",
        availability: "1 month notice",
        lastActive: "1 day ago",
        score: {
          candidateId: "2",
          scores: {
            technical: 95,
            experience: 90,
            culture: 80,
            communication: 85,
            education: 98,
            potential: 90,
          },
          overallScore: 89,
          rank: 2,
          explanation: [
            "Outstanding technical expertise in AI research",
            "Extensive publication record demonstrates deep knowledge",
            "Strong experience with transformer models and fine-tuning",
            "Excellent educational background with PhD",
          ],
          strengths: [
            "World-class expertise in transformer architectures",
            "Strong research background with publications",
            "Deep theoretical understanding of LLMs",
            "Experience with RLHF and fine-tuning",
          ],
          weaknesses: [
            "Less production engineering experience",
            "May prefer research over product development",
            "Higher salary expectations",
          ],
          recommendations: [
            "Great fit for research-oriented AI roles",
            "Consider for AI innovation leadership",
            "May need support transitioning to product-focused work",
          ],
        },
        matchPercentage: 89,
        confidenceLevel: 92,
        riskFactors: ["Research vs. product orientation", "Higher compensation expectations", "Academic interests"],
        growthPotential: 90,
        cultureFit: 80,
        technicalFit: 95,
        experienceFit: 90,
        salaryFit: 75,
        locationFit: 85,
        availabilityFit: 75,
        portfolioQuality: 95,
        communicationSkills: 85,
        leadershipPotential: 85,
        learningAgility: 95,
        industryExperience: 80,
        projectComplexity: 95,
        teamCollaboration: 80,
        problemSolving: 95,
        innovation: 95,
        reliability: 85,
        adaptability: 80,
        motivation: 90,
        careerProgression: 90,
        educationQuality: 98,
        certificationRelevance: 85,
        publicationsImpact: 95,
        openSourceContributions: 90,
        communityInvolvement: 85,
        mentorshipExperience: 80,
        diversityValue: 80,
        remoteWorkReadiness: 85,
        timeZoneCompatibility: 95,
        languageSkills: 90,
        socialLinks: {
          github: "https://github.com/marcusr",
          linkedin: "https://linkedin.com/in/marcusrodriguez",
          twitter: "https://twitter.com/marcusr",
        },
        aiInsights: {
          keyStrengths: [
            "World-class expertise in transformer architectures",
            "Impressive research publication record",
            "Deep theoretical understanding of LLMs",
            "Strong innovation capabilities",
          ],
          potentialConcerns: [
            "May prefer research over product development",
            "Could require adjustment to product-focused timelines",
            "Higher compensation expectations",
          ],
          bestFitRoles: ["AI Research Lead", "ML Architect", "Innovation Director"],
          developmentAreas: ["Product development focus", "Business impact orientation", "Agile development practices"],
          interviewQuestions: [
            "How do you balance research interests with product delivery timelines?",
            "Describe how you've translated research innovations into practical applications",
            "What aspects of product development do you find most challenging?",
          ],
          onboardingRecommendations: [
            "Pair with product managers to align on business objectives",
            "Provide opportunities to continue some research activities",
            "Create clear expectations around product delivery timelines",
          ],
        },
      },
      {
        id: "3",
        name: "Elena Kowalski",
        title: "AI Product Engineer",
        company: "StartupAI",
        location: "Austin, TX",
        experience: 5,
        skills: ["LangChain", "FastAPI", "React", "Vector Databases", "AWS", "Docker"],
        avatar: "/placeholder.svg?height=400&width=400",
        summary:
          "Full-stack AI engineer building user-facing AI products. Expert in integrating LLMs into production applications with focus on scalability and UX.",
        salary: "$120,000 - $160,000",
        availability: "Immediately",
        lastActive: "3 hours ago",
        score: {
          candidateId: "3",
          scores: {
            technical: 88,
            experience: 82,
            culture: 92,
            communication: 95,
            education: 85,
            potential: 90,
          },
          overallScore: 87,
          rank: 3,
          explanation: [
            "Strong technical skills with full-stack expertise",
            "Excellent product development experience",
            "Outstanding communication skills",
            "Great cultural fit with startup experience",
          ],
          strengths: [
            "End-to-end product development experience",
            "Strong UX focus for AI applications",
            "Excellent communication skills",
            "Full-stack capabilities",
          ],
          weaknesses: [
            "Less experience than other candidates",
            "Fewer publications and research credentials",
            "Could benefit from more specialized AI expertise",
          ],
          recommendations: [
            "Excellent fit for product-focused AI roles",
            "Consider for user-facing AI applications",
            "Would excel in collaborative team environments",
          ],
        },
        matchPercentage: 87,
        confidenceLevel: 90,
        riskFactors: ["Less specialized AI experience", "May have multiple opportunities"],
        growthPotential: 90,
        cultureFit: 92,
        technicalFit: 88,
        experienceFit: 82,
        salaryFit: 90,
        locationFit: 85,
        availabilityFit: 95,
        portfolioQuality: 88,
        communicationSkills: 95,
        leadershipPotential: 85,
        learningAgility: 90,
        industryExperience: 85,
        projectComplexity: 85,
        teamCollaboration: 92,
        problemSolving: 88,
        innovation: 85,
        reliability: 90,
        adaptability: 92,
        motivation: 95,
        careerProgression: 85,
        educationQuality: 85,
        certificationRelevance: 88,
        publicationsImpact: 70,
        openSourceContributions: 85,
        communityInvolvement: 90,
        mentorshipExperience: 80,
        diversityValue: 90,
        remoteWorkReadiness: 95,
        timeZoneCompatibility: 90,
        languageSkills: 90,
        socialLinks: {
          github: "https://github.com/elenakowalski",
          linkedin: "https://linkedin.com/in/elenakowalski",
          portfolio: "https://elenakowalski.dev",
        },
        aiInsights: {
          keyStrengths: [
            "Strong product development focus",
            "Excellent full-stack capabilities",
            "Great communication skills",
            "User experience orientation",
          ],
          potentialConcerns: [
            "Less specialized AI research experience",
            "May need mentoring in advanced AI techniques",
          ],
          bestFitRoles: ["AI Product Engineer", "Full-Stack AI Developer", "AI UX Specialist"],
          developmentAreas: ["Advanced AI research techniques", "System architecture at scale", "Technical leadership"],
          interviewQuestions: [
            "How do you balance user experience with AI capabilities in product development?",
            "Describe your approach to optimizing AI systems for production",
            "What challenges have you faced integrating LLMs into user-facing applications?",
          ],
          onboardingRecommendations: [
            "Pair with AI research specialists to deepen technical knowledge",
            "Leverage product development strengths in cross-functional teams",
            "Provide opportunities to lead user experience initiatives",
          ],
        },
      },
      {
        id: "4",
        name: "David Thompson",
        title: "ML Infrastructure Engineer",
        company: "TechGiant",
        location: "Seattle, WA",
        experience: 7,
        skills: ["Kubernetes", "MLOps", "TensorFlow", "AWS", "Docker", "CI/CD", "Kubeflow"],
        avatar: "/placeholder.svg?height=400&width=400",
        summary:
          "MLOps specialist focused on building scalable infrastructure for AI systems. Expert in Kubernetes and cloud-native ML deployments.",
        salary: "$150,000 - $190,000",
        availability: "3 weeks notice",
        lastActive: "5 days ago",
        score: {
          candidateId: "4",
          scores: {
            technical: 90,
            experience: 85,
            culture: 80,
            communication: 82,
            education: 85,
            potential: 85,
          },
          overallScore: 85,
          rank: 4,
          explanation: [
            "Strong technical skills in ML infrastructure",
            "Excellent experience with scaling AI systems",
            "Good educational background",
            "Solid but not exceptional cultural fit",
          ],
          strengths: [
            "Deep expertise in MLOps and infrastructure",
            "Strong experience with Kubernetes and cloud platforms",
            "Excellent scaling and optimization skills",
            "Good system architecture capabilities",
          ],
          weaknesses: [
            "Less experience with LangChain specifically",
            "Communication skills could be stronger",
            "Less focus on research aspects",
          ],
          recommendations: [
            "Good fit for infrastructure and MLOps roles",
            "Consider for scaling and deployment leadership",
            "Would benefit from LangChain-specific training",
          ],
        },
        matchPercentage: 85,
        confidenceLevel: 88,
        riskFactors: ["Less experience with LangChain", "May prefer pure infrastructure roles"],
        growthPotential: 85,
        cultureFit: 80,
        technicalFit: 90,
        experienceFit: 85,
        salaryFit: 85,
        locationFit: 80,
        availabilityFit: 85,
        portfolioQuality: 85,
        communicationSkills: 82,
        leadershipPotential: 85,
        learningAgility: 85,
        industryExperience: 90,
        projectComplexity: 90,
        teamCollaboration: 80,
        problemSolving: 88,
        innovation: 80,
        reliability: 92,
        adaptability: 85,
        motivation: 85,
        careerProgression: 85,
        educationQuality: 85,
        certificationRelevance: 90,
        publicationsImpact: 70,
        openSourceContributions: 85,
        communityInvolvement: 75,
        mentorshipExperience: 80,
        diversityValue: 80,
        remoteWorkReadiness: 90,
        timeZoneCompatibility: 85,
        languageSkills: 85,
        socialLinks: {
          github: "https://github.com/davidthompson",
          linkedin: "https://linkedin.com/in/davidthompson",
        },
        aiInsights: {
          keyStrengths: [
            "Exceptional MLOps and infrastructure expertise",
            "Strong experience scaling AI systems",
            "Excellent Kubernetes and cloud platform knowledge",
            "Solid system architecture capabilities",
          ],
          potentialConcerns: [
            "Less experience with LangChain specifically",
            "May need support with communication skills",
            "Could require training on specific RAG implementations",
          ],
          bestFitRoles: ["ML Infrastructure Lead", "MLOps Engineer", "DevOps for AI"],
          developmentAreas: ["LangChain and RAG-specific knowledge", "Communication skills", "Research orientation"],
          interviewQuestions: [
            "How have you optimized infrastructure for large language models?",
            "Describe your experience with vector databases and retrieval systems",
            "What challenges have you faced in scaling AI systems?",
          ],
          onboardingRecommendations: [
            "Provide training on LangChain and RAG systems",
            "Leverage infrastructure expertise for scaling challenges",
            "Create opportunities for cross-functional communication",
          ],
        },
      },
      {
        id: "5",
        name: "Aisha Khan",
        title: "AI Research Engineer",
        company: "Research Institute",
        location: "Remote (GMT+5)",
        experience: 4,
        skills: ["PyTorch", "LangChain", "Transformers", "CUDA", "Triton", "FastAPI"],
        avatar: "/placeholder.svg?height=400&width=400",
        summary:
          "AI research engineer with expertise in model optimization and deployment. Specialized in making large language models faster and more efficient.",
        salary: "$130,000 - $160,000",
        availability: "1 month notice",
        lastActive: "1 week ago",
        score: {
          candidateId: "5",
          scores: {
            technical: 85,
            experience: 75,
            culture: 85,
            communication: 80,
            education: 90,
            potential: 95,
          },
          overallScore: 83,
          rank: 5,
          explanation: [
            "Strong technical skills in model optimization",
            "Less experience than other candidates",
            "Excellent growth potential",
            "Good educational background",
          ],
          strengths: [
            "Deep expertise in model optimization",
            "Strong research orientation",
            "Excellent growth potential",
            "Good technical foundation",
          ],
          weaknesses: [
            "Less overall experience",
            "Remote location with time zone challenges",
            "Less production deployment experience",
          ],
          recommendations: [
            "Good fit for research-oriented roles",
            "Consider for model optimization tasks",
            "Would benefit from mentorship in production systems",
          ],
        },
        matchPercentage: 83,
        confidenceLevel: 85,
        riskFactors: ["Time zone compatibility", "Less production experience", "Remote collaboration challenges"],
        growthPotential: 95,
        cultureFit: 85,
        technicalFit: 85,
        experienceFit: 75,
        salaryFit: 90,
        locationFit: 70,
        availabilityFit: 75,
        portfolioQuality: 85,
        communicationSkills: 80,
        leadershipPotential: 80,
        learningAgility: 95,
        industryExperience: 75,
        projectComplexity: 85,
        teamCollaboration: 80,
        problemSolving: 90,
        innovation: 90,
        reliability: 85,
        adaptability: 85,
        motivation: 90,
        careerProgression: 80,
        educationQuality: 90,
        certificationRelevance: 85,
        publicationsImpact: 80,
        openSourceContributions: 90,
        communityInvolvement: 85,
        mentorshipExperience: 70,
        diversityValue: 90,
        remoteWorkReadiness: 85,
        timeZoneCompatibility: 70,
        languageSkills: 85,
        socialLinks: {
          github: "https://github.com/aishakhan",
          linkedin: "https://linkedin.com/in/aishakhan",
          twitter: "https://twitter.com/aishakhan",
        },
        aiInsights: {
          keyStrengths: [
            "Strong model optimization expertise",
            "Excellent research orientation",
            "High growth potential",
            "Good innovation capabilities",
          ],
          potentialConcerns: [
            "Less production experience",
            "Time zone compatibility challenges",
            "May need mentoring in large-scale systems",
          ],
          bestFitRoles: ["AI Research Engineer", "Model Optimization Specialist", "LLM Performance Engineer"],
          developmentAreas: ["Production deployment experience", "Remote collaboration skills", "System architecture"],
          interviewQuestions: [
            "How have you optimized transformer models for production?",
            "Describe your experience with remote collaboration tools and practices",
            "What challenges do you anticipate in working across time zones?",
          ],
          onboardingRecommendations: [
            "Create clear communication protocols for remote work",
            "Provide mentorship in production deployment practices",
            "Establish regular synchronization meetings that work with time zone differences",
          ],
        },
      },
    ]

    setRankingCriteria(mockCriteria)
    setCandidates(mockCandidates)
    setJobRequirements(mockRequirements)
    setIsLoading(false)
  }, [])

  const handleCriteriaWeightChange = (criteriaId: string, newWeight: number) => {
    setRankingCriteria((prev) => prev.map((c) => (c.id === criteriaId ? { ...c, weight: newWeight } : c)))
  }

  const handleAddCriteria = () => {
    const newCriteria: RankingCriteria = {
      id: `criteria-${Date.now()}`,
      name: "New Criteria",
      weight: 10,
      description: "Description for new criteria",
      icon: <Target className="w-5 h-5" />,
      color: "text-gray-500",
    }
    setRankingCriteria([...rankingCriteria, newCriteria])
  }

  const handleRemoveCriteria = (criteriaId: string) => {
    setRankingCriteria((prev) => prev.filter((c) => c.id !== criteriaId))
  }

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("desc")
    }
  }

  const handleToggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId],
    )
  }

  const handleGenerateAIInsights = () => {
    setIsGeneratingInsights(true)
    // Simulate AI insight generation
    setTimeout(() => {
      setIsGeneratingInsights(false)
      setShowAIInsights(true)
    }, 2000)
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    let valueA, valueB

    switch (sortBy) {
      case "score":
        valueA = a.score.overallScore
        valueB = b.score.overallScore
        break
      case "experience":
        valueA = a.experience
        valueB = b.experience
        break
      case "technical":
        valueA = a.score.scores.technical
        valueB = b.score.scores.technical
        break
      case "culture":
        valueA = a.score.scores.culture
        valueB = b.score.scores.culture
        break
      case "name":
        valueA = a.name
        valueB = b.name
        break
      default:
        valueA = a.score.overallScore
        valueB = b.score.overallScore
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    return sortOrder === "asc" ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number)
  })

  const filteredCandidates = sortedCandidates.filter(
    (candidate) =>
      candidate.score.overallScore >= filterMinScore &&
      (searchQuery === "" ||
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500/20 text-green-300 border-green-500/30"
    if (score >= 80) return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    if (score >= 70) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    return "bg-red-500/20 text-red-300 border-red-500/30"
  }

  const getImportanceBadgeColor = (importance: string) => {
    switch (importance) {
      case "required":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "preferred":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "bonus":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

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
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Candidate Ranking</Badge>
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
              Candidate Ranking
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Evaluate and compare candidates with advanced AI analysis. Customize ranking criteria, visualize
            comparisons, and get intelligent insights to make the best hiring decisions.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
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
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-white">Loading candidates...</h3>
              <p className="text-gray-400">Analyzing profiles and generating rankings</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                <TabsTrigger value="ranking">Candidate Ranking</TabsTrigger>
                <TabsTrigger value="criteria">Ranking Criteria</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              {/* Ranking Tab */}
              <TabsContent value="ranking" className="space-y-6">
                {/* Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Min Score:</span>
                      <select
                        value={filterMinScore}
                        onChange={(e) => setFilterMinScore(Number(e.target.value))}
                        className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="0">All</option>
                        <option value="70">70+</option>
                        <option value="80">80+</option>
                        <option value="90">90+</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="score">Overall Score</option>
                        <option value="technical">Technical Skills</option>
                        <option value="experience">Experience</option>
                        <option value="culture">Culture Fit</option>
                        <option value="name">Name</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="text-gray-400 hover:text-white"
                      >
                        {sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === "cards" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("cards")}
                        className={viewMode === "cards" ? "bg-gray-700" : "text-gray-400 hover:text-white"}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "table" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={viewMode === "table" ? "bg-gray-700" : "text-gray-400 hover:text-white"}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Selected Candidates Actions */}
                <AnimatePresence>
                  {selectedCandidates.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        <span className="text-white">
                          <span className="font-semibold">{selectedCandidates.length}</span> candidates selected
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                          onClick={() => setViewMode("comparison")}
                        >
                          <BarChart className="w-4 h-4 mr-2" />
                          Compare
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Generate Outreach
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => setSelectedCandidates([])}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Job Requirements */}
                <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-xl shadow-2xl mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>Job Requirements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {jobRequirements.map((req) => (
                        <div
                          key={req.id}
                          className="flex items-start space-x-3 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30"
                        >
                          <Badge className={getImportanceBadgeColor(req.importance)}>
                            {req.importance.charAt(0).toUpperCase() + req.importance.slice(1)}
                          </Badge>
                          <div>
                            <p className="text-white font-medium">{req.name}</p>
                            <p className="text-sm text-gray-400">{req.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Candidates Grid */}
                {viewMode === "cards" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map((candidate) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className={`cursor-pointer ${
                          selectedCandidates.includes(candidate.id) ? "ring-2 ring-purple-500/50" : ""
                        }`}
                        onClick={() => {
                          setSelectedCandidate(candidate)
                          setShowCandidateDetail(true)
                        }}
                      >
                        <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/70 hover:border-gray-700/50 transition-all duration-300 h-full">
                          <CardContent className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <Avatar className="w-16 h-16 ring-2 ring-purple-500/30">
                                    <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                      {candidate.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="absolute -top-1 -right-1">
                                    <Badge className="bg-gray-800 text-white border-gray-700">
                                      #{candidate.score.rank}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                                  <p className="text-gray-400">{candidate.title}</p>
                                  <p className="text-sm text-gray-500">{candidate.company}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div
                                  className={`flex items-center justify-center w-12 h-12 rounded-full ${getScoreBgColor(
                                    candidate.score.overallScore,
                                  )}`}
                                >
                                  <span className="text-white font-bold text-lg">
                                    {Math.round(candidate.score.overallScore)}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Overall Score</div>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4 mb-6">
                              <div className="flex items-center text-sm text-gray-400">
                                <MapPin className="w-4 h-4 mr-2" />
                                {candidate.location}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Briefcase className="w-4 h-4 mr-2" />
                                {candidate.experience} years experience
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

                            {/* Skills */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {candidate.skills.slice(0, 5).map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-400">
                                    +{candidate.skills.length - 5}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Score Breakdown */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Score Breakdown</h4>
                              <div className="space-y-2">
                                {Object.entries(candidate.score.scores)
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                      <span className="text-sm text-gray-300 capitalize">{key}</span>
                                      <div className="flex items-center space-x-2">
                                        <Progress value={value} className="w-24 h-2" />
                                        <span className={`text-sm font-medium ${getScoreColor(value)}`}>{value}</span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Strengths */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Strengths</h4>
                              <div className="space-y-1">
                                {candidate.score.strengths.slice(0, 2).map((strength, idx) => (
                                  <div key={idx} className="text-xs text-green-400 flex items-start">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                    {strength}
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
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-700 text-gray-300"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleCandidateSelection(candidate.id)
                                  }}
                                >
                                  {selectedCandidates.includes(candidate.id) ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Candidates Table */}
                {viewMode === "table" && (
                  <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-xl shadow-2xl">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="p-4 text-left text-gray-400 font-medium">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedCandidates.length > 0 &&
                                      filteredCandidates.every((c) => selectedCandidates.includes(c.id))
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCandidates(filteredCandidates.map((c) => c.id))
                                      } else {
                                        setSelectedCandidates([])
                                      }
                                    }}
                                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                                  />
                                  <span>Candidate</span>
                                </div>
                              </th>
                              <th className="p-4 text-left text-gray-400 font-medium">Experience</th>
                              <th className="p-4 text-left text-gray-400 font-medium">Location</th>
                              <th className="p-4 text-left text-gray-400 font-medium">Availability</th>
                              <th className="p-4 text-left text-gray-400 font-medium">Technical</th>
                              <th className="p-4 text-left text-gray-400 font-medium">Culture</th>
                              <th className="p-4 text-left text-gray-400 font-medium">Overall</th>
                              <th className="p-4 text-left text-gray-400 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCandidates.map((candidate) => (
                              <tr
                                key={candidate.id}
                                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                                onClick={() => {
                                  setSelectedCandidate(candidate)
                                  setShowCandidateDetail(true)
                                }}
                              >
                                <td className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedCandidates.includes(candidate.id)}
                                      onChange={(e) => {
                                        e.stopPropagation()
                                        handleToggleCandidateSelection(candidate.id)
                                      }}
                                      className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                                    />
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                        {candidate.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-white">{candidate.name}</p>
                                      <p className="text-xs text-gray-400">{candidate.title}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-300">{candidate.experience} years</td>
                                <td className="p-4 text-gray-300">{candidate.location}</td>
                                <td className="p-4 text-gray-300">{candidate.availability}</td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <Progress
                                      value={candidate.score.scores.technical}
                                      className="w-16 h-2"
                                      indicatorClassName={getScoreBgColor(candidate.score.scores.technical)}
                                    />
                                    <span className={`text-sm ${getScoreColor(candidate.score.scores.technical)}`}>
                                      {candidate.score.scores.technical}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <Progress
                                      value={candidate.score.scores.culture}
                                      className="w-16 h-2"
                                      indicatorClassName={getScoreBgColor(candidate.score.scores.culture)}
                                    />
                                    <span className={`text-sm ${getScoreColor(candidate.score.scores.culture)}`}>
                                      {candidate.score.scores.culture}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge className={getScoreBadgeColor(candidate.score.overallScore)}>
                                    {candidate.score.overallScore}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                      <MessageSquare className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Criteria Tab */}
              <TabsContent value="criteria" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-white">Ranking Criteria</h3>
                  <Button onClick={handleAddCriteria} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Criteria
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rankingCriteria.map((criteria) => (
                    <Card key={criteria.id} className="bg-gray-900/50 border-gray-800/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={criteria.color}>{criteria.icon}</div>
                            <div>
                              <h4 className="font-semibold text-white">{criteria.name}</h4>
                              <p className="text-sm text-gray-400">{criteria.description}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCriteria(criteria.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Weight</span>
                            <span className="text-sm font-medium text-white">{criteria.weight}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={criteria.weight}
                            onChange={(e) => handleCriteriaWeightChange(criteria.id, Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Comparison Tab */}
              <TabsContent value="comparison" className="space-y-6">
                {selectedCandidates.length < 2 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">Select Candidates to Compare</h3>
                    <p className="text-gray-400">
                      Choose at least 2 candidates from the ranking tab to see detailed comparisons
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white">
                      Comparing {selectedCandidates.length} Candidates
                    </h3>

                    {/* Comparison Chart */}
                    <Card className="bg-gray-900/50 border-gray-800/50">
                      <CardHeader>
                        <CardTitle>Score Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {rankingCriteria.map((criteria) => (
                            <div key={criteria.id}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-300">{criteria.name}</span>
                              </div>
                              <div className="space-y-2">
                                {selectedCandidates.map((candidateId) => {
                                  const candidate = candidates.find((c) => c.id === candidateId)
                                  if (!candidate) return null
                                  const score = candidate.score.scores[criteria.id] || 0
                                  return (
                                    <div key={candidateId} className="flex items-center space-x-3">
                                      <div className="w-32 text-sm text-gray-300 truncate">{candidate.name}</div>
                                      <Progress value={score} className="flex-1 h-2" />
                                      <div className="w-12 text-sm text-right text-white">{score}</div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-white">AI Insights</h3>
                  <Button
                    onClick={handleGenerateAIInsights}
                    disabled={isGeneratingInsights}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isGeneratingInsights ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4 mr-2" />
                    )}
                    Generate Insights
                  </Button>
                </div>

                {showAIInsights ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-900/50 border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-green-400">Top Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {candidates.slice(0, 3).map((candidate, idx) => (
                            <div
                              key={candidate.id}
                              className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg"
                            >
                              <div className="text-lg font-bold text-green-400">#{idx + 1}</div>
                              <div>
                                <p className="font-medium text-white">{candidate.name}</p>
                                <p className="text-sm text-gray-400">Score: {candidate.score.overallScore}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-blue-400">Hiring Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm text-gray-300">
                          <p>• Focus on candidates with 85+ overall scores</p>
                          <p>• Sarah Chen shows exceptional technical fit</p>
                          <p>• Consider culture fit for long-term success</p>
                          <p>• Marcus Rodriguez brings research expertise</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">Generate AI Insights</h3>
                    <p className="text-gray-400">
                      Get intelligent recommendations and analysis for your candidate pool
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Candidate Detail Modal */}
            <AnimatePresence>
              {showCandidateDetail && selectedCandidate && (
                <motion.div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCandidateDetail(false)}
                >
                  <motion.div
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">{selectedCandidate.name}</h2>
                      <Button variant="ghost" onClick={() => setShowCandidateDetail(false)}>
                        <X className="w-6 h-6" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-green-400 mb-2">Key Strengths</h4>
                            <ul className="space-y-1">
                              {selectedCandidate.aiInsights.keyStrengths.map((strength, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start">
                                  <CheckCircle className="w-3 h-3 text-green-400 mt-1 mr-2 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-yellow-400 mb-2">Development Areas</h4>
                            <ul className="space-y-1">
                              {selectedCandidate.aiInsights.developmentAreas.map((area, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start">
                                  <Target className="w-3 h-3 text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Interview Questions</h3>
                        <div className="space-y-2">
                          {selectedCandidate.aiInsights.interviewQuestions.map((question, idx) => (
                            <div key={idx} className="p-3 bg-gray-800/30 rounded-lg">
                              <p className="text-sm text-gray-300">{question}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  )
}

export default CandidateRankingPage
