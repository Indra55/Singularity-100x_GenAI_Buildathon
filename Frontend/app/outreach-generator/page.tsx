"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Send,
  Copy,
  RefreshCw,
  Brain,
  Mail,
  CheckCircle,
  Plus,
  Edit,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OutreachTemplate {
  id: string
  name: string
  type: "email" | "linkedin" | "twitter" | "phone"
  subject?: string
  content: string
  tone: "professional" | "casual" | "enthusiastic" | "direct"
  length: "short" | "medium" | "long"
  useCase: string
  successRate: number
  responseRate: number
  lastUsed: string
}

interface GeneratedMessage {
  id: string
  candidateId: string
  candidateName: string
  type: "email" | "linkedin" | "twitter"
  subject?: string
  content: string
  tone: string
  personalization: string[]
  confidence: number
  estimatedResponseRate: number
  status: "draft" | "sent" | "responded" | "no_response"
  sentAt?: string
  respondedAt?: string
  feedback?: "positive" | "negative"
}

interface Candidate {
  id: string
  name: string
  title: string
  company: string
  email: string
  avatar: string
  skills: string[]
  experience: number
  location: string
  linkedinUrl?: string
  githubUrl?: string
  interests: string[]
  recentActivity: string[]
  mutualConnections: number
  companyInfo: {
    size: string
    industry: string
    recentNews: string[]
  }
}

export default function OutreachGeneratorPage() {
  const [templates, setTemplates] = useState<OutreachTemplate[]>([])
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessage[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("generator")
  const [selectedTemplate, setSelectedTemplate] = useState<OutreachTemplate | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [messageType, setMessageType] = useState<"email" | "linkedin" | "twitter">("email")
  const [messageTone, setMessageTone] = useState<"professional" | "casual" | "enthusiastic" | "direct">("professional")
  const [messageLength, setMessageLength] = useState<"short" | "medium" | "long">("medium")

  useEffect(() => {
    // Mock data
    const mockTemplates: OutreachTemplate[] = [
      {
        id: "1",
        name: "AI Engineer Outreach",
        type: "email",
        subject: "Exciting AI Engineering Opportunity at {company}",
        content:
          "Hi {name},\n\nI came across your profile and was impressed by your work on {recent_project}. We're looking for a talented AI engineer to join our team at {company}.\n\nWould you be interested in learning more?\n\nBest regards,\n{sender_name}",
        tone: "professional",
        length: "medium",
        useCase: "AI/ML roles",
        successRate: 85,
        responseRate: 42,
        lastUsed: "2 days ago",
      },
      {
        id: "2",
        name: "LinkedIn Connection",
        type: "linkedin",
        content:
          "Hi {name}, I noticed your expertise in {skill}. I'd love to connect and discuss potential opportunities in AI engineering. Looking forward to connecting!",
        tone: "casual",
        length: "short",
        useCase: "Initial connection",
        successRate: 78,
        responseRate: 65,
        lastUsed: "1 week ago",
      },
    ]

    const mockCandidates: Candidate[] = [
      {
        id: "1",
        name: "Sarah Chen",
        title: "Senior AI Engineer",
        company: "TechCorp",
        email: "sarah.chen@email.com",
        avatar: "/placeholder.svg?height=400&width=400",
        skills: ["Python", "TensorFlow", "LangChain", "AWS"],
        experience: 6,
        location: "San Francisco, CA",
        linkedinUrl: "https://linkedin.com/in/sarahchen",
        githubUrl: "https://github.com/sarahchen",
        interests: ["AI research", "Open source", "Mentoring"],
        recentActivity: [
          "Published paper on RAG systems",
          "Spoke at AI conference",
          "Contributed to LangChain project",
        ],
        mutualConnections: 12,
        companyInfo: {
          size: "1000-5000 employees",
          industry: "Technology",
          recentNews: ["Raised Series C funding", "Launched new AI product"],
        },
      },
    ]

    setTemplates(mockTemplates)
    setSelectedCandidates(mockCandidates)
  }, [])

  const handleGenerateMessages = async () => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const newMessages: GeneratedMessage[] = selectedCandidates.map((candidate) => ({
        id: Math.random().toString(36).substr(2, 9),
        candidateId: candidate.id,
        candidateName: candidate.name,
        type: messageType,
        subject: messageType === "email" ? `Exciting AI Engineering Opportunity at HireAI` : undefined,
        content: generatePersonalizedMessage(candidate),
        tone: messageTone,
        personalization: [
          `Referenced their work on ${candidate.recentActivity[0]}`,
          `Mentioned their expertise in ${candidate.skills[0]}`,
          `Noted their ${candidate.experience} years of experience`,
        ],
        confidence: 85 + Math.random() * 15,
        estimatedResponseRate: 35 + Math.random() * 30,
        status: "draft",
      }))

      setGeneratedMessages(newMessages)
      setIsGenerating(false)
    }, 3000)
  }

  const generatePersonalizedMessage = (candidate: Candidate): string => {
    const templates = {
      email: {
        professional: `Subject: Exciting AI Engineering Opportunity at HireAI

Hi ${candidate.name},

I hope this email finds you well. I came across your profile and was particularly impressed by your recent work on ${candidate.recentActivity[0]}.

At HireAI, we're building the future of AI-powered recruitment, and we're looking for a talented ${candidate.title} to join our growing team. Given your expertise in ${candidate.skills.slice(0, 2).join(" and ")}, I believe you'd be a perfect fit for our mission.

What caught my attention:
• Your ${candidate.experience} years of experience in AI/ML
• Your contributions to ${candidate.recentActivity[1]}
• Your strong background in ${candidate.skills[0]}

We offer:
• Competitive compensation package
• Opportunity to work on cutting-edge AI technology
• Remote-first culture with flexible working arrangements
• Equity participation in a fast-growing startup

Would you be interested in a brief 15-minute call to discuss this opportunity? I'd love to learn more about your career goals and share how you could make a significant impact at HireAI.

Best regards,
[Your Name]
Senior Technical Recruiter, HireAI`,
        casual: `Hey ${candidate.name}! 👋

Saw your awesome work on ${candidate.recentActivity[0]} - really impressive stuff!

We're building something pretty cool at HireAI (AI-powered recruitment platform) and think you'd be a great fit. Your ${candidate.skills[0]} skills are exactly what we need.

Quick question - would you be up for a quick chat about an exciting AI engineering role? No pressure, just thought it might be interesting given your background.

Cheers!
[Your Name]`,
      },
      linkedin: {
        professional: `Hi ${candidate.name},

I noticed your impressive work in AI engineering, particularly your recent ${candidate.recentActivity[0]}. Your expertise in ${candidate.skills[0]} aligns perfectly with an exciting opportunity I have at HireAI.

We're revolutionizing recruitment with AI, and I'd love to discuss how your skills could contribute to our mission. Would you be open to a brief conversation?

Best regards,
[Your Name]`,
        casual: `Hey ${candidate.name}! Love your work on ${candidate.recentActivity[0]}. We're doing some cool AI stuff at HireAI and think you'd dig it. Quick chat? 🚀`,
      },
    }

    return templates[messageType][messageTone] || templates.email.professional
  }

  const handleSendMessage = (messageId: string) => {
    setGeneratedMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, status: "sent", sentAt: new Date().toISOString() } : msg)),
    )
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full mix-blend-normal filter blur-[160px] animate-pulse delay-700" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">HireAI</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Outreach Generator</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              AI Outreach
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Generate personalized outreach messages using AI. Increase response rates with intelligent personalization.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 mb-8">
            <TabsTrigger value="generator">Message Generator</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="sent">Sent Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-900/50 border-gray-800/50">
                  <CardHeader>
                    <CardTitle>Message Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Message Type</label>
                      <select
                        value={messageType}
                        onChange={(e) => setMessageType(e.target.value as any)}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="email">Email</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter/X</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Tone</label>
                      <select
                        value={messageTone}
                        onChange={(e) => setMessageTone(e.target.value as any)}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="direct">Direct</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Length</label>
                      <select
                        value={messageLength}
                        onChange={(e) => setMessageLength(e.target.value as any)}
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Custom Instructions</label>
                      <Textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Add specific instructions for personalization..."
                        className="bg-gray-800/50 border-gray-700/50 text-white"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleGenerateMessages}
                      disabled={isGenerating || selectedCandidates.length === 0}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Brain className="w-4 h-4 mr-2" />
                      )}
                      Generate Messages ({selectedCandidates.length})
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Generated Messages */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/50 border-gray-800/50">
                  <CardHeader>
                    <CardTitle>Generated Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isGenerating ? (
                      <div className="text-center py-12">
                        <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                        <h3 className="text-lg font-semibold text-white mb-2">Generating personalized messages...</h3>
                        <p className="text-gray-400">
                          AI is analyzing candidate profiles and creating tailored outreach
                        </p>
                      </div>
                    ) : generatedMessages.length > 0 ? (
                      <div className="space-y-6">
                        {generatedMessages.map((message) => (
                          <div key={message.id} className="border border-gray-700/50 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback>
                                    {message.candidateName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-white">{message.candidateName}</h4>
                                  <p className="text-sm text-gray-400">
                                    {message.type} • {message.tone}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                  {Math.round(message.confidence)}% confidence
                                </Badge>
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                  {Math.round(message.estimatedResponseRate)}% response rate
                                </Badge>
                              </div>
                            </div>

                            {message.subject && (
                              <div className="mb-4">
                                <label className="text-sm font-medium text-gray-400">Subject:</label>
                                <p className="text-white mt-1">{message.subject}</p>
                              </div>
                            )}

                            <div className="mb-4">
                              <label className="text-sm font-medium text-gray-400">Message:</label>
                              <div className="mt-2 p-4 bg-gray-800/30 rounded-lg">
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                                  {message.content}
                                </pre>
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="text-sm font-medium text-gray-400">Personalization:</label>
                              <ul className="mt-2 space-y-1">
                                {message.personalization.map((item, idx) => (
                                  <li key={idx} className="text-sm text-green-400 flex items-start">
                                    <CheckCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCopyMessage(message.content)}
                                  className="border-gray-700 text-gray-300"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleSendMessage(message.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No messages generated yet</h3>
                        <p className="text-gray-400">
                          Configure your message settings and click generate to create personalized outreach
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Message Templates</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="bg-gray-900/50 border-gray-800/50 hover:bg-gray-900/70 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-400">{template.useCase}</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{template.type}</Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Success Rate</span>
                        <span className="text-green-400 font-medium">{template.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Response Rate</span>
                        <span className="text-blue-400 font-medium">{template.responseRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Used</span>
                        <span className="text-gray-300">{template.lastUsed}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 flex-1">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-6">
            <h2 className="text-2xl font-semibold">Sent Messages</h2>
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No sent messages yet</h3>
              <p className="text-gray-400">Messages you send will appear here with tracking information</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">Outreach Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Messages Sent", value: "0", icon: Send, color: "text-blue-500" },
                { label: "Response Rate", value: "0%", icon: TrendingUp, color: "text-green-500" },
                { label: "Avg. Response Time", value: "0h", icon: Clock, color: "text-purple-500" },
                { label: "Positive Responses", value: "0", icon: ThumbsUp, color: "text-yellow-500" },
              ].map((stat, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gray-900/50 border-gray-800/50">
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No data available</h3>
                  <p className="text-gray-400">Start sending messages to see analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
