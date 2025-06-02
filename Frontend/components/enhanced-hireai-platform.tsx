"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
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
  ChevronDown,
  ChevronUp,
  LogOut,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  email: string
  phone?: string
  yearsInAI?: number
  status: "new" | "contacted" | "interviewing" | "hired" | "rejected"
  resumeUrl?: string
}

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    experience: 7,
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL'],
    score: 98,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    summary: 'Senior frontend developer with 7+ years of experience building scalable web applications. Specialized in React ecosystem and modern JavaScript frameworks.',
    salary: '$140,000 - $160,000',
    availability: '2 weeks',
    lastActive: '2 days ago',
    matchReasons: ['Strong React experience', 'TypeScript expert', 'Experience with Next.js'],
    githubStars: 24,
    publications: 3,
    languages: ['English', 'Spanish'],
    education: 'MSc in Computer Science, Stanford University',
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    projects: ['E-commerce platform', 'Real-time dashboard', 'Design system'],
    socialLinks: {
      github: 'https://github.com/sarahj',
      linkedin: 'https://linkedin.com/in/sarahj',
      portfolio: 'https://sarahj.dev'
    },
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    resumeUrl: 'https://example.com/resumes/sarah_johnson.pdf',
    status: 'new',
    yearsInAI: 3
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'New York, NY',
    experience: 5,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'AWS'],
    score: 95,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    summary: 'Machine learning engineer with expertise in deep learning and production ML systems. Passionate about NLP and computer vision applications.',
    salary: '$150,000 - $180,000',
    availability: '1 month',
    lastActive: '1 week ago',
    matchReasons: ['Strong ML background', 'Experience with MLOps', 'Cloud expertise'],
    githubStars: 156,
    publications: 8,
    languages: ['English', 'Mandarin'],
    education: 'PhD in Machine Learning, MIT',
    certifications: ['AWS ML Specialty', 'TensorFlow Developer'],
    projects: ['Recommendation system', 'Image classification', 'Chatbot'],
    socialLinks: {
      github: 'https://github.com/michaelc',
      linkedin: 'https://linkedin.com/in/michaelc',
      twitter: 'https://twitter.com/michaelc'
    },
    email: 'michael.c@example.com',
    resumeUrl: 'https://example.com/resumes/michael_chen.pdf',
    status: 'new',
    yearsInAI: 5
  },
  {
    id: '3',
    name: 'Priya Patel',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Remote',
    experience: 6,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker'],
    score: 92,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    summary: 'DevOps professional with extensive experience in cloud infrastructure and automation. Specialized in building scalable and secure cloud architectures.',
    salary: '$145,000 - $170,000',
    availability: 'Immediate',
    lastActive: '3 days ago',
    matchReasons: ['Cloud expertise', 'Infrastructure as Code', 'CI/CD pipelines'],
    githubStars: 42,
    publications: 1,
    languages: ['English', 'Hindi', 'Gujarati'],
    education: 'BSc in Computer Engineering, University of Mumbai',
    certifications: ['AWS Solutions Architect', 'CKA', 'Terraform Associate'],
    projects: ['Multi-cloud migration', 'Kubernetes cluster setup', 'Security hardening'],
    socialLinks: {
      github: 'https://github.com/priyap',
      linkedin: 'https://linkedin.com/in/priyap',
      portfolio: 'https://priyap.dev'
    },
    email: 'priya.p@example.com',
    phone: '(555) 987-6543',
    resumeUrl: 'https://example.com/resumes/priya_patel.pdf',
    status: 'new',
    yearsInAI: 2
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Full Stack Developer',
    company: 'WebCraft',
    location: 'Seattle, WA',
    experience: 4,
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'GraphQL'],
    score: 89,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    summary: 'Full stack developer with experience in building modern web applications. Passionate about clean code and user experience.',
    salary: '$120,000 - $140,000',
    availability: '3 weeks',
    lastActive: '5 days ago',
    matchReasons: ['Full stack experience', 'JavaScript expert', 'Database skills'],
    githubStars: 78,
    publications: 0,
    languages: ['English', 'Korean'],
    education: 'BSc in Computer Science, University of Washington',
    certifications: ['MongoDB Certified Developer'],
    projects: ['Social media platform', 'E-learning system', 'API development'],
    socialLinks: {
      github: 'https://github.com/davidk',
      linkedin: 'https://linkedin.com/in/davidk',
      twitter: 'https://twitter.com/davidk'
    },
    email: 'david.k@example.com',
    resumeUrl: 'https://example.com/resumes/david_kim.pdf',
    status: 'new',
    yearsInAI: 1
  },
  {
    id: '5',
    name: 'Emily Rodriguez',
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'Austin, TX',
    experience: 8,
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'UI/UX'],
    score: 91,
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    summary: 'Senior UX/UI designer with a passion for creating intuitive and beautiful user experiences. Strong background in user research and interaction design.',
    salary: '$130,000 - $150,000',
    availability: '2 months',
    lastActive: '1 day ago',
    matchReasons: ['Extensive design experience', 'User research skills', 'Prototyping expertise'],
    githubStars: 12,
    publications: 2,
    languages: ['English', 'Spanish'],
    education: 'BFA in Design, Rhode Island School of Design',
    certifications: ['NN/g UX Certification'],
    projects: ['Mobile app redesign', 'Design system', 'User research study'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilyr',
      portfolio: 'https://emilyr.design',
      twitter: 'https://twitter.com/emilyr'
    },
    email: 'emily.r@example.com',
    phone: '(555) 456-7890',
    resumeUrl: 'https://example.com/resumes/emily_rodriguez.pdf',
    status: 'new',
    yearsInAI: 0
  },
  {
    id: '6',
    name: 'James Wilson',
    title: 'Data Scientist',
    company: 'DataInsights',
    location: 'Boston, MA',
    experience: 5,
    skills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Data Visualization'],
    score: 93,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    summary: 'Data scientist with strong analytical skills and experience in building predictive models. Passionate about deriving insights from complex datasets.',
    salary: '$135,000 - $160,000',
    availability: '1 month',
    lastActive: '4 days ago',
    matchReasons: ['Data analysis skills', 'Machine learning experience', 'Data visualization'],
    githubStars: 64,
    publications: 5,
    languages: ['English'],
    education: 'MSc in Data Science, Harvard University',
    certifications: ['Data Science Professional Certificate'],
    projects: ['Predictive maintenance', 'Customer segmentation', 'Sales forecasting'],
    socialLinks: {
      github: 'https://github.com/jamesw',
      linkedin: 'https://linkedin.com/in/jamesw',
      portfolio: 'https://jamesw.ds'
    },
    email: 'james.w@example.com',
    resumeUrl: 'https://example.com/resumes/james_wilson.pdf',
    status: 'new',
    yearsInAI: 4
  },
  {
    id: '7',
    name: 'Olivia Chen',
    title: 'Product Manager',
    company: 'ProductLabs',
    location: 'San Francisco, CA',
    experience: 7,
    skills: ['Product Strategy', 'Agile', 'User Stories', 'Roadmapping', 'Analytics'],
    score: 94,
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    summary: 'Product manager with experience in both B2B and B2C products. Strong background in user research and data-driven decision making.',
    salary: '$150,000 - $180,000',
    availability: '3 weeks',
    lastActive: '2 days ago',
    matchReasons: ['Product strategy', 'Agile methodology', 'Analytical skills'],
    githubStars: 8,
    publications: 0,
    languages: ['English', 'Mandarin'],
    education: 'MBA, UC Berkeley',
    certifications: ['Pragmatic Institute Certification'],
    projects: ['Product launch', 'Feature optimization', 'User research study'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/oliviac',
      twitter: 'https://twitter.com/oliviac'
    },
    email: 'olivia.c@example.com',
    phone: '(555) 789-0123',
    resumeUrl: 'https://example.com/resumes/olivia_chen.pdf',
    status: 'new',
    yearsInAI: 3
  },
  {
    id: '8',
    name: 'Ryan Park',
    title: 'iOS Developer',
    company: 'AppCraft',
    location: 'New York, NY',
    experience: 6,
    skills: ['Swift', 'iOS', 'SwiftUI', 'Objective-C', 'XCTest'],
    score: 90,
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    summary: 'iOS developer with experience in building high-quality mobile applications. Passionate about clean code and great user experiences.',
    salary: '$140,000 - $165,000',
    availability: '2 months',
    lastActive: '1 week ago',
    matchReasons: ['iOS development', 'Swift expertise', 'Mobile app experience'],
    githubStars: 37,
    publications: 1,
    languages: ['English', 'Korean'],
    education: 'BSc in Computer Science, NYU',
    certifications: ['Apple Certified iOS Developer'],
    projects: ['Fitness app', 'E-commerce app', 'Social media app'],
    socialLinks: {
      github: 'https://github.com/ryanp',
      linkedin: 'https://linkedin.com/in/ryanp',
      portfolio: 'https://ryanp.dev'
    },
    email: 'ryan.p@example.com',
    resumeUrl: 'https://example.com/resumes/ryan_park.pdf',
    status: 'new',
    yearsInAI: 2
  },
  {
    id: '9',
    name: 'Sophia Martinez',
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'Washington, DC',
    experience: 8,
    skills: ['Security Analysis', 'Penetration Testing', 'SIEM', 'Incident Response', 'CISSP'],
    score: 96,
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    summary: 'Cybersecurity professional with extensive experience in threat detection and incident response. Specialized in network security and vulnerability assessment.',
    salary: '$145,000 - $175,000',
    availability: '1 month',
    lastActive: '3 days ago',
    matchReasons: ['Security expertise', 'Incident response', 'Compliance knowledge'],
    githubStars: 15,
    publications: 3,
    languages: ['English', 'Spanish'],
    education: 'MSc in Cybersecurity, George Washington University',
    certifications: ['CISSP', 'CEH', 'Security+'],
    projects: ['Security audit', 'Incident response plan', 'Security awareness training'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sophiam',
      twitter: 'https://twitter.com/sophiam'
    },
    email: 'sophia.m@example.com',
    phone: '(555) 234-5678',
    resumeUrl: 'https://example.com/resumes/sophia_martinez.pdf',
    status: 'new',
    yearsInAI: 6
  },
  {
    id: '10',
    name: 'Daniel Brown',
    title: 'Cloud Architect',
    company: 'CloudScale',
    location: 'Remote',
    experience: 10,
    skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'DevOps'],
    score: 97,
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    summary: 'Seasoned cloud architect with expertise in designing and implementing scalable cloud solutions. Strong background in multi-cloud environments and infrastructure as code.',
    salary: '$180,000 - $220,000',
    availability: '1 month',
    lastActive: '2 days ago',
    matchReasons: ['Cloud architecture', 'Multi-cloud experience', 'Infrastructure as Code'],
    githubStars: 89,
    publications: 2,
    languages: ['English', 'French'],
    education: 'MSc in Computer Science, University of Toronto',
    certifications: ['AWS Solutions Architect Pro', 'Azure Solutions Architect', 'CKA'],
    projects: ['Cloud migration', 'Multi-region deployment', 'Cost optimization'],
    socialLinks: {
      github: 'https://github.com/danielb',
      linkedin: 'https://linkedin.com/in/danielb',
      twitter: 'https://twitter.com/danielb'
    },
    email: 'daniel.b@example.com',
    resumeUrl: 'https://example.com/resumes/daniel_brown.pdf',
    status: 'new',
    yearsInAI: 5
  }
]

export function EnhancedHireAIPlatform() {
  const { user, isAuthenticated, isGuestMode, logout, messageCount, incrementMessageCount, hasReachedMessageLimit } =
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
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false)
  const [outreachMessages, setOutreachMessages] = useState<Record<string, string>>({})
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [sendingCandidate, setSendingCandidate] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // This is the chat message handler
  // This function is passed down to the OutreachGeneratorTab
  const handleSendMessage = (candidateId: string, callback: () => void): boolean => {
    setSendingCandidate(candidateId);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setNotificationMessage('Message sent successfully!');
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      // Call the callback to handle any additional logic
      callback();
      setSendingCandidate(null);
    }, 1000);
    
    return true; // Indicate that the message is being sent
  };

  // This is the chat message handler
  const handleChatMessage = async () => {
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

    // Get the current candidate ID
    const candidateId = searchResults[currentCandidateIndex].id
    
    // Add the candidate to selected candidates if swiped right
    if (direction === "right") {
      if (!selectedCandidates.includes(candidateId)) {
        setSelectedCandidates((prev) => [...prev, candidateId])
      }
    }
    
    // Add the candidate to swiped cards
    setSwipedCardIds((prev) => [...prev, candidateId])

    // Add a timeout to reset the swipe direction and move to the next card
    setTimeout(() => {
      setSwipeDirection(null)
      if (currentCandidateIndex < searchResults.length - 1) {
        setCurrentCandidateIndex(currentCandidateIndex + 1)
      }
    }, 300) // Short delay to allow animation to complete
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
      setUploadedFile(file)
    }
  }

  const generateOutreach = async () => {
    if (selectedCandidates.length === 0) return
    setIsGeneratingOutreach(true)

    try {
      const messages: Record<string, string> = {}
      
      // Get user's company and personal info for personalization
      const companyName = user?.companyName || 'our company'
      const recruiterName = user?.name || 'a recruiter'
      const industrySector = user?.industrySector ? ` in the ${user.industrySector} sector` : ''
      
      // Get the selected candidates from searchResults
      for (const candidateId of selectedCandidates) {
        const candidate = searchResults.find((c) => c.id === candidateId)
        if (candidate) {
          // Generate personalized outreach message based on candidate and user data
          messages[candidateId] = `Hi ${candidate.name || 'there'},

I hope this email finds you well. I came across your impressive profile${candidate.skills?.length > 0 ? ` and was particularly drawn to your expertise in ${candidate.skills[0]}${candidate.skills.length > 1 ? ` and ${candidate.skills[1]}` : ''}` : ''}.

At ${companyName}${industrySector}, we're building cutting-edge AI solutions, and we believe your background${candidate.title ? ` in ${candidate.title}` : ''} would be a perfect fit for our team.${candidate.skills?.length > 0 ? ` Your experience with ${candidate.skills.slice(0, Math.min(3, candidate.skills.length)).join(", ")} aligns perfectly with what we're looking for.` : ''}

Would you be interested in a brief conversation about an exciting opportunity? I'd love to learn more about your career goals and share how you could make a significant impact with us.

Best regards,
${recruiterName}
${companyName ? companyName + '\n' : ''}${user?.email || ''}`
        }
      }
      
      setOutreachMessages(messages)
    } catch (error) {
      console.error('Error generating outreach messages:', error)
    } finally {
      setIsGeneratingOutreach(false)
    }
  }

  const navigationItems = [
    { id: "peoplegpt", label: "Scoutly", icon: Brain, description: "AI-powered candidate search" },
    { id: "search", label: "Advanced Search", icon: Search, description: "Detailed search filters" },
    { id: "browse", label: "Browse Candidates", icon: Users, description: "Swipe through profiles" },
    { id: "parser", label: "Resume Parser", icon: FileText, description: "AI resume analysis" },
    { id: "ranking", label: "AI Ranking", icon: TrendingUp, description: "Smart candidate ranking" },
    { id: "enrichment", label: "Web Enrichment", icon: Globe, description: "Profile enhancement" },
    { id: "outreach", label: "Outreach Generator", icon: MessageSquare, description: "Personalized messages" },
    { id: "analytics", label: "Analytics", icon: BarChart3, description: "Recruitment insights" },
  ]

  const [profileOpen, setProfileOpen] = useState(false);

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

      {/* Enhanced Header */}
      <header className="relative z-10 border-b border-violet-500/20 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-violet-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-pink-200 bg-clip-text text-transparent">
                    HireAI Platform
                  </h1>
                  <p className="text-xs text-violet-300">Next-Generation AI Recruitment</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                AI Online
              </Badge>
              {selectedCandidates.length > 0 && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                  {selectedCandidates.length} Selected
                </Badge>
              )}
              {!isAuthenticated && isGuestMode && messageCount > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-3 py-1">
                  {messageCount}/3 Messages
                </Badge>
              )}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-violet-800/50">
                        <User className="h-5 w-5 text-violet-200" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-800 border-violet-600/50 text-white" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name || user?.email || 'User'}
                          </p>
                          {user?.email && (
                            <p className="text-xs leading-none text-violet-200">
                              {user.email}
                            </p>
                          )}
                          {user?.companyName && (
                            <p className="text-xs leading-none text-violet-300 mt-1">
                              {user.companyName}
                            </p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-violet-600/30" />
                      <DropdownMenuItem className="focus:bg-violet-700/50 focus:text-white">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-violet-700/50 focus:text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-violet-600/30" />
                      <DropdownMenuItem 
                        className="text-red-400 focus:bg-red-900/30 focus:text-red-300"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : isGuestMode ? (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">Guest Mode</Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-3 py-1">Not Logged In</Badge>
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
                      <div className="font-medium">Scoutly</div>
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
                    handleSendMessage={handleChatMessage}
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
                    <AIRankingTab candidates={mockCandidates} selectedCandidates={selectedCandidates} />
                  </TabsContent>

                  {/* Web Enrichment Tab */}
                  <TabsContent value="enrichment">
                    <WebEnrichmentTab candidates={mockCandidates} />
                  </TabsContent>

                  {/* Outreach Generator Tab */}
                  <TabsContent value="outreach">
                    <OutreachGeneratorTab
                      selectedCandidates={selectedCandidates}
                      candidates={searchResults.length > 0 ? searchResults : mockCandidates}
                      generateOutreach={generateOutreach}
                      isGeneratingOutreach={isGeneratingOutreach}
                      outreachMessages={outreachMessages}
                      onSendMessage={handleSendMessage}
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

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
        Scoutly Assistant
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
                }, [searchResults, swipedCardIds, swipeDirection])
                }
                {/* Fixed positioning for swipe buttons - moved outside card content for better placement */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6 z-50">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-16 h-16 bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:text-red-400 shadow-lg"
                    onClick={() => handleSwipe("left")}
                  >
                    <X className="w-7 h-7" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-16 h-16 bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20 hover:text-green-400 shadow-lg"
                    onClick={() => handleSwipe("right")}
                  >
                    <Check className="w-7 h-7" />
                  </Button>
                </div>
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

  // Memoize animation values to prevent unnecessary re-renders
  const animationValues = useMemo(() => ({
    x: direction === "left" ? -1000 : direction === "right" ? 1000 : dragX,
    rotate: rotation,
    opacity: opacity,
    scale: scale,
  }), [direction, dragX, rotation, opacity, scale])

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ 
        zIndex,
        willChange: "transform", // Hardware acceleration hint
      }}
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
      animate={animationValues}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        translateX: { type: "spring", stiffness: 300, damping: 30 },
        rotate: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 300, damping: 30 },
      }}
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
                <div className="text-lg font-bold text-white">{candidate.githubStars || 0}</div>
                <div className="text-xs text-violet-300">Stars</div>
              </div>
              <div className="text-center p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{candidate.publications || 0}</div>
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
                {candidate.availability || 'Available now'}
              </div>
              <div className="flex items-center text-sm text-violet-200">
                <DollarSign className="w-4 h-4 mr-2 text-violet-400" />
                {candidate.salary || 'Salary negotiable'}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-violet-300 mb-2">Top Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.slice(0, 5).map((skill, i) => (
                  <Badge key={i} className="bg-violet-500/20 text-violet-200 border-violet-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-sm font-medium text-violet-300 mb-2">Summary</h4>
              <p className="text-sm text-violet-100">{candidate.summary}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-violet-500/20 flex justify-between items-center">
            <div className="flex space-x-2">
              {candidate.socialLinks?.github && (
                <Button size="sm" variant="ghost" className="text-violet-400 hover:text-white p-1">
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {candidate.socialLinks?.linkedin && (
                <Button size="sm" variant="ghost" className="text-violet-400 hover:text-white p-1">
                  <Linkedin className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center text-xs text-violet-300">
              <Clock className="w-3 h-3 mr-1" />
              Last active: {candidate.lastActive || 'Recently'}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
                {currentIndex + 1} / {candidates.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add this new component after the imports
type CollapsibleSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-violet-500/20 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-black/40 hover:bg-black/60 transition-colors"
      >
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-violet-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-violet-400" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 bg-black/20">
          {children}
        </div>
      )}
    </div>
  );
};

// Modify the ResumeParserTab component to use CollapsibleSection
function ResumeParserTab({ uploadedFile, handleFileUpload, fileInputRef }: any) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedResume, setSelectedResume] = useState<number>(0)

  const handleProcess = async () => {
    if (!uploadedFile) {
      setError("Please upload a resume file first");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setParsedData([]);
    setSelectedResume(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("http://localhost:8000/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to parse resume");
      }

      const responseData = await response.json();
      setParsedData(responseData);
    } catch (err) {
      console.error("Error processing resume:", err);
      setError(err instanceof Error ? err.message : "Failed to process resume");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          AI Resume Parser
        </h2>
        <p className="text-xl text-violet-200/80">Upload resumes and extract structured data with AI</p>
      </motion.div>

      <CollapsibleSection title="Upload Resume" defaultExpanded={true}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-300">Upload a single resume or a ZIP file containing multiple resumes</p>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-violet-500/30 rounded-xl p-6 text-center cursor-pointer hover:border-violet-500/50 transition-colors w-64"
          >
            <FileText className="w-12 h-12 text-violet-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-white mb-2">
              {uploadedFile ? uploadedFile.name : "Click to upload"}
            </h4>
            <p className="text-violet-300 text-sm">Supports PDF, DOC, DOCX files</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.zip"
          onChange={handleFileUpload}
          className="hidden"
        />

        {uploadedFile && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleProcess}
              disabled={isProcessing}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Parse Resume{parsedData.length > 0 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </CollapsibleSection>

      {parsedData.length > 0 && (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <CollapsibleSection title={`Parsed Resumes (${parsedData.length})`} defaultExpanded={true}>
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {parsedData.map((resume, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedResume(index)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedResume === index
                        ? "bg-violet-500/20 border-violet-500/50"
                        : "bg-gray-900/50 border-gray-700/50 hover:bg-gray-900/70"
                    } border`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-white">{resume.name}</h4>
                        <p className="text-violet-300 text-sm">{resume.title}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">
                        {resume.overallScore}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {resume.topSkills.slice(0, 2).map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </div>

          <div className="col-span-9">
            <CollapsibleSection title="Resume Details" defaultExpanded={true}>
              {parsedData[selectedResume] && (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-violet-500/20 pb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white">{parsedData[selectedResume].name}</h3>
                      <p className="text-xl text-violet-300 mt-1">{parsedData[selectedResume].title}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-violet-500/20 text-violet-300 px-4 py-2">
                        {parsedData[selectedResume].workPreference}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-300 px-4 py-2">
                        Score: {parsedData[selectedResume].overallScore}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-violet-500/10 rounded-xl p-4">
                      <h5 className="text-sm font-medium text-violet-300 mb-2">Location</h5>
                      <p className="text-white text-lg">{parsedData[selectedResume].location}</p>
                    </div>
                    <div className="bg-violet-500/10 rounded-xl p-4">
                      <h5 className="text-sm font-medium text-violet-300 mb-2">Experience</h5>
                      <p className="text-white text-lg">{parsedData[selectedResume].yearsOfExperience} years</p>
                    </div>
                    <div className="bg-violet-500/10 rounded-xl p-4">
                      <h5 className="text-sm font-medium text-violet-300 mb-2">Education</h5>
                      <p className="text-white text-lg">{parsedData[selectedResume].education}</p>
                    </div>
                    <div className="bg-violet-500/10 rounded-xl p-4">
                      <h5 className="text-sm font-medium text-violet-300 mb-2">Salary Estimate</h5>
                      <p className="text-white text-lg">
                        {parsedData[selectedResume].salaryEstimate.currency} {parsedData[selectedResume].salaryEstimate.min.toLocaleString()} - {parsedData[selectedResume].salaryEstimate.max.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Skills */}
                      <div>
                        <h5 className="text-lg font-medium text-violet-300 mb-3">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {parsedData[selectedResume].skills.map((skill: string, index: number) => (
                            <Badge key={index} className="bg-violet-500/20 text-violet-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Past Companies */}
                      <div>
                        <h5 className="text-lg font-medium text-violet-300 mb-3">Past Companies</h5>
                        <div className="space-y-3">
                          {parsedData[selectedResume].pastCompanies.map((company: string, index: number) => (
                            <div key={index} className="flex items-center space-x-3 bg-violet-500/10 rounded-lg p-3">
                              <Briefcase className="w-5 h-5 text-violet-400" />
                              <span className="text-white">{company}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Summary */}
                      <div>
                        <h5 className="text-lg font-medium text-violet-300 mb-3">Professional Summary</h5>
                        <p className="text-white leading-relaxed">{parsedData[selectedResume].summary}</p>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h5 className="text-lg font-medium text-violet-300 mb-3">Key Strengths</h5>
                        <div className="grid grid-cols-2 gap-3">
                          {parsedData[selectedResume].strengths.map((strength: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 bg-violet-500/10 rounded-lg p-3">
                              <Check className="w-5 h-5 text-green-400" />
                              <span className="text-white">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Role Recommendations */}
                      <div>
                        <h5 className="text-lg font-medium text-violet-300 mb-3">Recommended Roles</h5>
                        <div className="flex flex-wrap gap-2">
                          {parsedData[selectedResume].roleRecommendations.map((role: string, index: number) => (
                            <Badge key={index} className="bg-blue-500/20 text-blue-300">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CollapsibleSection>
          </div>
        </div>
      )}
    </div>
  )
}

// AI Ranking Tab - Complete Implementation
function AIRankingTab({ candidates, selectedCandidates }: any) {
  const [sortBy, setSortBy] = useState("score")
  const [filterBy, setFilterBy] = useState("all")

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score
    if (sortBy === "experience") return b.experience - a.experience
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return 0
  })

  const filteredCandidates = sortedCandidates.filter((candidate) => {
    if (filterBy === "all") return true
    if (filterBy === "high") return candidate.score >= 90
    if (filterBy === "medium") return candidate.score >= 70 && candidate.score < 90
    if (filterBy === "low") return candidate.score < 70
    return true
  })

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
          AI-Powered Ranking
        </h2>
        <p className="text-xl text-violet-200/80">Intelligent candidate scoring and ranking system</p>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white"
          >
            <option value="score">Sort by Score</option>
            <option value="experience">Sort by Experience</option>
            <option value="name">Sort by Name</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-violet-500/30 rounded-lg text-white"
          >
            <option value="all">All Candidates</option>
            <option value="high">High Score (90+)</option>
            <option value="medium">Medium Score (70-89)</option>
            <option value="low">Low Score (&lt;70)</option>
          </select>
        </div>

        <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 px-3 py-1">
          {filteredCandidates.length} candidates
        </Badge>
      </div>

      {/* Ranking List */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate, index) => (
          <Card key={candidate.id} className="bg-black/40 border-violet-500/20 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-violet-400">#{index + 1}</div>
                  <div className="text-sm text-violet-300">Rank</div>
                </div>

                <Avatar className="w-16 h-16">
                  <img src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{candidate.name}</h3>
                  <p className="text-violet-300">
                    {candidate.title} at {candidate.company}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {candidate.score}% Match
                    </Badge>
                    <span className="text-sm text-violet-200">{candidate.experience} years exp</span>
                    <span className="text-sm text-violet-200">{candidate.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{candidate.score}</div>
                  <div className="text-sm text-violet-300">AI Score</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-400">85</div>
                  <div className="text-xs text-blue-300">Technical</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">92</div>
                  <div className="text-xs text-green-300">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-400">78</div>
                  <div className="text-xs text-purple-300">Culture Fit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-400">88</div>
                  <div className="text-xs text-yellow-300">Communication</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Web Enrichment Tab - Complete Implementation
function WebEnrichmentTab({ candidates }: any) {
  const [enrichmentStatus, setEnrichmentStatus] = useState<Record<string, string>>({})
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
                  <Avatar className="w-12 h-12">
                    <img src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{candidate.name}</h4>
                    <p className="text-violet-300">{candidate.title}</p>
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

interface OutreachGeneratorTabProps {
  selectedCandidates: string[]
  candidates: Candidate[]
  generateOutreach: () => void
  isGeneratingOutreach: boolean
  outreachMessages: Record<string, string>
  onSendMessage: (candidateId: string, callback: () => void) => boolean
}

// Outreach Generator Tab - Complete Implementation
function OutreachGeneratorTab({
  selectedCandidates = [],
  candidates = [],
  generateOutreach,
  isGeneratingOutreach = false,
  outreachMessages = {},
  onSendMessage,
}: OutreachGeneratorTabProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendingCandidate, setSendingCandidate] = useState<string | null>(null);

  // This function is passed down to the OutreachGeneratorTab
  const handleSendMessage = (candidateId: string, callback: () => void): boolean => {
    setSendingCandidate(candidateId);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setNotificationMessage('Message sent successfully!');
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      // Call the callback to handle any additional logic
      callback();
      setSendingCandidate(null);
    }, 1000);
    
    return true; // Indicate that the message is being sent
  };
  console.log('OutreachGeneratorTab - selectedCandidates:', selectedCandidates);
  console.log('OutreachGeneratorTab - all candidates:', candidates);

  const [messageType, setMessageType] = useState("email")
  const [tone, setTone] = useState("professional")
  const [customPrompt, setCustomPrompt] = useState("")

  // Filter candidates to only include those that are selected
  const selectedCandidateData = candidates.filter((c: Candidate) => 
    selectedCandidates.includes(c.id)
  )

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
                    Generate Messages ({selectedCandidates.length})
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

              {selectedCandidates.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select candidates to generate personalized messages</p>
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
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              onSendMessage(candidate.id, () => {
                                generateOutreach();
                              });
                            }}
                            disabled={sendingCandidate === candidate.id}
                          >
                            {sendingCandidate === candidate.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              'Send Message'
                            )}
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
  }

  const dragTransition = {
    damping: 10,
    stiffness: 200,
  }

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
              {candidate.salary || 'Salary negotiable'}
            </div>
          </div>

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
              {candidate.socialLinks?.github && (
                <Button size="sm" variant="ghost" className="text-violet-400 hover:text-white p-1">
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {candidate.socialLinks?.linkedin && (
                <Button size="sm" variant="ghost" className="text-violet-400 hover:text-white p-1">
                  <Linkedin className="w-4 h-4" />
                </Button>
              )}
              {candidate.socialLinks?.portfolio && (
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

export default EnhancedHireAIPlatform
