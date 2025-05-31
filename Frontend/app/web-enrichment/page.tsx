"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Globe,
  Linkedin,
  Github,
  Twitter,
  MapPin,
  Building,
  RefreshCw,
  Zap,
  Plus,
  X,
  Clock,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EnrichmentSource {
  id: string
  name: string
  icon: React.ReactNode
  status: "active" | "inactive" | "error"
  lastSync: string
  recordsFound: number
  confidence: number
}

interface EnrichedProfile {
  id: string
  name: string
  email: string
  avatar: string
  confidence: number
  lastUpdated: string
  sources: string[]
  basicInfo: {
    title: string
    company: string
    location: string
    experience: number
    skills: string[]
  }
  socialProfiles: {
    linkedin?: { url: string; verified: boolean; followers: number }
    github?: { url: string; verified: boolean; repos: number; stars: number }
    twitter?: { url: string; verified: boolean; followers: number }
    portfolio?: { url: string; verified: boolean }
  }
  professionalData: {
    currentRole: string
    previousRoles: Array<{ company: string; title: string; duration: string }>
    education: Array<{ institution: string; degree: string; year: string }>
    certifications: Array<{ name: string; issuer: string; year: string }>
    publications: Array<{ title: string; venue: string; year: string }>
  }
  technicalProfile: {
    programmingLanguages: Array<{ name: string; level: number }>
    frameworks: string[]
    tools: string[]
    githubStats: {
      totalRepos: number
      totalStars: number
      totalCommits: number
      languages: Array<{ name: string; percentage: number }>
    }
  }
  insights: {
    careerProgression: number
    skillDiversity: number
    industryExperience: number
    leadershipIndicators: string[]
    riskFactors: string[]
    recommendations: string[]
  }
}

export default function WebEnrichmentPage() {
  const [enrichmentSources, setEnrichmentSources] = useState<EnrichmentSource[]>([])
  const [enrichedProfiles, setEnrichedProfiles] = useState<EnrichedProfile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<EnrichedProfile | null>(null)
  const [isEnriching, setIsEnriching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("profiles")

  useEffect(() => {
    // Mock data
    const mockSources: EnrichmentSource[] = [
      {
        id: "linkedin",
        name: "LinkedIn",
        icon: <Linkedin className="w-5 h-5" />,
        status: "active",
        lastSync: "2 hours ago",
        recordsFound: 1247,
        confidence: 95,
      },
      {
        id: "github",
        name: "GitHub",
        icon: <Github className="w-5 h-5" />,
        status: "active",
        lastSync: "1 hour ago",
        recordsFound: 892,
        confidence: 88,
      },
      {
        id: "twitter",
        name: "Twitter/X",
        icon: <Twitter className="w-5 h-5" />,
        status: "active",
        lastSync: "30 minutes ago",
        recordsFound: 634,
        confidence: 72,
      },
      {
        id: "crunchbase",
        name: "Crunchbase",
        icon: <Building className="w-5 h-5" />,
        status: "active",
        lastSync: "4 hours ago",
        recordsFound: 156,
        confidence: 85,
      },
    ]

    const mockProfiles: EnrichedProfile[] = [
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        avatar: "/placeholder.svg?height=400&width=400",
        confidence: 92,
        lastUpdated: "2 hours ago",
        sources: ["linkedin", "github", "twitter"],
        basicInfo: {
          title: "Senior AI Engineer",
          company: "TechCorp",
          location: "San Francisco, CA",
          experience: 6,
          skills: ["Python", "TensorFlow", "LangChain", "AWS", "Docker"],
        },
        socialProfiles: {
          linkedin: { url: "https://linkedin.com/in/sarahchen", verified: true, followers: 2847 },
          github: { url: "https://github.com/sarahchen", verified: true, repos: 47, stars: 1203 },
          twitter: { url: "https://twitter.com/sarahchen", verified: false, followers: 892 },
          portfolio: { url: "https://sarahchen.dev", verified: true },
        },
        professionalData: {
          currentRole: "Senior AI Engineer at TechCorp",
          previousRoles: [
            { company: "AI Startup", title: "ML Engineer", duration: "2019-2021" },
            { company: "DataCorp", title: "Data Scientist", duration: "2017-2019" },
          ],
          education: [
            { institution: "Stanford University", degree: "MS Computer Science", year: "2017" },
            { institution: "UC Berkeley", degree: "BS Computer Science", year: "2015" },
          ],
          certifications: [
            { name: "AWS Machine Learning Specialty", issuer: "Amazon", year: "2023" },
            { name: "TensorFlow Developer", issuer: "Google", year: "2022" },
          ],
          publications: [
            { title: "Efficient RAG Systems for Production", venue: "NeurIPS", year: "2023" },
            { title: "Scaling LangChain Applications", venue: "ICML", year: "2022" },
          ],
        },
        technicalProfile: {
          programmingLanguages: [
            { name: "Python", level: 95 },
            { name: "JavaScript", level: 78 },
            { name: "Go", level: 65 },
          ],
          frameworks: ["TensorFlow", "PyTorch", "LangChain", "React", "FastAPI"],
          tools: ["Docker", "Kubernetes", "AWS", "Git", "PostgreSQL"],
          githubStats: {
            totalRepos: 47,
            totalStars: 1203,
            totalCommits: 2847,
            languages: [
              { name: "Python", percentage: 68 },
              { name: "JavaScript", percentage: 22 },
              { name: "Go", percentage: 10 },
            ],
          },
        },
        insights: {
          careerProgression: 88,
          skillDiversity: 85,
          industryExperience: 92,
          leadershipIndicators: ["Mentored 5+ junior engineers", "Led 3 major projects", "Speaker at conferences"],
          riskFactors: ["High demand in market", "Multiple job offers likely"],
          recommendations: [
            "Strong technical leader candidate",
            "Excellent for senior engineering roles",
            "Consider for AI team lead position",
          ],
        },
      },
    ]

    setEnrichmentSources(mockSources)
    setEnrichedProfiles(mockProfiles)
  }, [])

  const handleEnrichProfile = async (email: string) => {
    setIsEnriching(true)
    // Simulate enrichment process
    setTimeout(() => {
      setIsEnriching(false)
    }, 3000)
  }

  const handleBulkEnrichment = async () => {
    setIsEnriching(true)
    setTimeout(() => {
      setIsEnriching(false)
    }, 5000)
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
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">HireAI</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Web Enrichment</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Web Enrichment
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Automatically enrich candidate profiles with data from LinkedIn, GitHub, and other professional platforms.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 mb-8">
            <TabsTrigger value="profiles">Enriched Profiles</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="enrichment">Bulk Enrichment</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Enriched Profiles ({enrichedProfiles.length})</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search profiles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                  />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Enrich New Profile
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrichedProfiles.map((profile) => (
                <Card
                  key={profile.id}
                  className="bg-gray-900/50 border-gray-800/50 hover:bg-gray-900/70 transition-all cursor-pointer"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white">{profile.name}</h3>
                          <p className="text-sm text-gray-400">{profile.basicInfo.title}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {profile.confidence}% match
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Building className="w-4 h-4 mr-2" />
                        {profile.basicInfo.company}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {profile.basicInfo.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        Updated {profile.lastUpdated}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      {profile.sources.map((source) => {
                        const sourceData = enrichmentSources.find((s) => s.id === source)
                        return sourceData ? (
                          <div key={source} className="text-gray-400">
                            {sourceData.icon}
                          </div>
                        ) : null
                      })}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {profile.basicInfo.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.basicInfo.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.basicInfo.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <h2 className="text-2xl font-semibold">Data Sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {enrichmentSources.map((source) => (
                <Card key={source.id} className="bg-gray-900/50 border-gray-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-400">{source.icon}</div>
                        <h3 className="font-semibold text-white">{source.name}</h3>
                      </div>
                      <Badge
                        className={
                          source.status === "active"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : source.status === "error"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                        }
                      >
                        {source.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Records Found</span>
                        <span className="text-white font-medium">{source.recordsFound.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white font-medium">{source.confidence}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Sync</span>
                        <span className="text-white font-medium">{source.lastSync}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enrichment" className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Bulk Enrichment</h2>
              <p className="text-gray-400 mb-8">Enrich multiple candidate profiles simultaneously</p>

              <Card className="bg-gray-900/50 border-gray-800/50 max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Upload CSV File</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Upload a CSV file with candidate emails to enrich their profiles
                        </p>
                        <Button variant="outline" className="border-gray-700">
                          Choose File
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={handleBulkEnrichment}
                        disabled={isEnriching}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isEnriching ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        Start Bulk Enrichment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Profile Detail Modal */}
        <AnimatePresence>
          {selectedProfile && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)}
            >
              <motion.div
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedProfile.name}</h2>
                  <Button variant="ghost" onClick={() => setSelectedProfile(null)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Social Profiles</h3>
                    <div className="space-y-3">
                      {selectedProfile.socialProfiles.linkedin && (
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Linkedin className="w-5 h-5 text-blue-400" />
                            <span className="text-white">LinkedIn</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {selectedProfile.socialProfiles.linkedin.followers} followers
                          </div>
                        </div>
                      )}
                      {selectedProfile.socialProfiles.github && (
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Github className="w-5 h-5 text-gray-400" />
                            <span className="text-white">GitHub</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {selectedProfile.socialProfiles.github.stars} stars
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
                    <div className="space-y-3">
                      {selectedProfile.insights.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-sm text-gray-300">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
