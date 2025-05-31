import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Enhanced mock candidate database with more realistic data
const mockCandidates = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior AI Engineer",
    location: "Berlin, Germany",
    experience: 6,
    skills: ["LangChain", "RAG", "Python", "TensorFlow", "Vector Databases", "OpenAI API", "Pinecone", "Chroma"],
    email: "sarah.chen@email.com",
    github: "https://github.com/sarahchen",
    linkedin: "https://linkedin.com/in/sarahchen",
    summary:
      "Experienced AI engineer specializing in RAG systems and LangChain applications. Built production-scale AI systems for fintech and healthcare. Led a team of 5 engineers in developing a multi-modal AI assistant that serves 100K+ users daily.",
    projects: [
      "RAG-powered customer support system handling 10K queries/day",
      "Multi-modal AI assistant with voice and image capabilities",
      "Vector search optimization reducing latency by 60%",
      "LangChain-based document analysis pipeline",
    ],
    education: "MS Computer Science, TU Berlin",
    lastActive: "2 days ago",
    availability: "Open to contract work",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: "€80-120k",
    status: "new",
    publications: 3,
    githubStars: 1200,
    yearsInAI: 4,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    title: "GenAI Research Scientist",
    location: "Amsterdam, Netherlands",
    experience: 8,
    skills: ["Transformers", "LangChain", "PyTorch", "Hugging Face", "MLOps", "RAG", "RLHF", "Fine-tuning"],
    email: "marcus.r@email.com",
    github: "https://github.com/marcusr",
    linkedin: "https://linkedin.com/in/marcusrodriguez",
    summary:
      "Research scientist with deep expertise in transformer architectures and retrieval-augmented generation. Published 15+ papers in top AI conferences including NeurIPS, ICML, and ACL. Expert in RLHF and model fine-tuning.",
    projects: [
      "Novel RAG architecture for code generation (SOTA results)",
      "Multi-agent LangChain system for enterprise workflows",
      "Efficient transformer fine-tuning with LoRA",
      "Open-source RAG framework with 5K+ GitHub stars",
    ],
    education: "PhD AI, University of Amsterdam",
    lastActive: "1 day ago",
    availability: "Available for consulting",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: "€90-130k",
    status: "contacted",
    publications: 15,
    githubStars: 5000,
    yearsInAI: 6,
  },
  {
    id: "3",
    name: "Elena Kowalski",
    title: "AI Product Engineer",
    location: "Warsaw, Poland",
    experience: 5,
    skills: ["LangChain", "FastAPI", "React", "Vector Databases", "AWS", "Docker", "Kubernetes", "TypeScript"],
    email: "elena.k@email.com",
    github: "https://github.com/elenakowalski",
    linkedin: "https://linkedin.com/in/elenakowalski",
    summary:
      "Full-stack AI engineer building user-facing AI products. Expert in integrating LLMs into production applications with focus on scalability and user experience. Built AI products used by 500K+ users.",
    projects: [
      "AI-powered content management system for media companies",
      "Real-time RAG chat application with 99.9% uptime",
      "LangChain workflow automation platform",
      "Voice-enabled AI assistant for mobile apps",
    ],
    education: "BS Software Engineering, Warsaw University",
    lastActive: "3 hours ago",
    availability: "Open to full-time and contract",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: "€60-90k",
    status: "interviewing",
    publications: 1,
    githubStars: 800,
    yearsInAI: 3,
  },
  {
    id: "4",
    name: "David Thompson",
    title: "Machine Learning Engineer",
    location: "London, UK",
    experience: 7,
    skills: ["Python", "TensorFlow", "Kubernetes", "MLOps", "LangChain", "Pinecone", "Weaviate", "Elasticsearch"],
    email: "david.t@email.com",
    github: "https://github.com/davidthompson",
    linkedin: "https://linkedin.com/in/davidthompson",
    summary:
      "MLOps specialist with experience deploying large-scale AI systems. Expert in vector databases and retrieval systems. Built infrastructure serving 1M+ AI requests daily with 99.99% availability.",
    projects: [
      "Scalable RAG infrastructure on AWS serving 1M+ requests/day",
      "Multi-tenant AI platform with dynamic scaling",
      "Real-time embedding pipeline processing 100K docs/hour",
      "Vector database optimization reducing costs by 40%",
    ],
    education: "MS Machine Learning, Imperial College London",
    lastActive: "1 week ago",
    availability: "Considering new opportunities",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: "£70-100k",
    status: "new",
    publications: 2,
    githubStars: 600,
    yearsInAI: 5,
  },
  {
    id: "5",
    name: "Anna Petrov",
    title: "AI Solutions Architect",
    location: "Stockholm, Sweden",
    experience: 9,
    skills: ["LangChain", "Azure OpenAI", "System Design", "RAG", "Microservices", "GraphQL", "Redis", "PostgreSQL"],
    email: "anna.petrov@email.com",
    github: "https://github.com/annapetrov",
    linkedin: "https://linkedin.com/in/annapetrov",
    summary:
      "Senior architect designing enterprise AI solutions. Specialized in RAG systems and LangChain-based applications for Fortune 500 companies. Led digital transformation initiatives worth $50M+.",
    projects: [
      "Enterprise knowledge management system for 10K+ employees",
      "Multi-modal AI assistant platform with 99.9% uptime",
      "Federated learning infrastructure across 5 countries",
      "AI governance framework adopted by 20+ companies",
    ],
    education: "MS Computer Science, KTH Royal Institute",
    lastActive: "5 days ago",
    availability: "Open to contract projects",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: "€100-150k",
    status: "new",
    publications: 8,
    githubStars: 2000,
    yearsInAI: 7,
  },
  {
    id: "6",
    name: "Raj Patel",
    title: "AI Research Engineer",
    location: "Bangalore, India",
    experience: 4,
    skills: ["PyTorch", "LangChain", "Transformers", "CUDA", "Triton", "FastAPI", "Redis", "MongoDB"],
    email: "raj.patel@email.com",
    github: "https://github.com/rajpatel",
    linkedin: "https://linkedin.com/in/rajpatel",
    summary:
      "AI research engineer with expertise in model optimization and deployment. Specialized in making large language models faster and more efficient. Contributed to multiple open-source AI projects.",
    projects: [
      "Model quantization framework reducing inference time by 3x",
      "Distributed training system for large language models",
      "Real-time AI inference engine with sub-100ms latency",
      "Open-source LangChain extensions with 2K+ stars",
    ],
    education: "BTech Computer Science, IIT Bangalore",
    lastActive: "1 day ago",
    availability: "Open to remote work",
    avatar: "/placeholder.svg?height=40&width=40",
    salary: "₹25-40L",
    status: "new",
    publications: 4,
    githubStars: 2500,
    yearsInAI: 3,
  },
]

const searchResultSchema = z.object({
  relevantSkills: z.array(z.string()).describe("Skills most relevant to the query"),
  locationPreferences: z.array(z.string()).describe("Preferred locations mentioned"),
  experienceLevel: z.string().describe("Required experience level (junior, mid, senior, etc.)"),
  workType: z.string().describe("Type of work (full-time, contract, remote, etc.)"),
  specializations: z.array(z.string()).describe("Specific AI/ML specializations mentioned"),
  scoringCriteria: z.object({
    skillMatch: z.number().describe("Weight for skill matching (0-1)"),
    locationMatch: z.number().describe("Weight for location matching (0-1)"),
    experienceMatch: z.number().describe("Weight for experience matching (0-1)"),
    availabilityMatch: z.number().describe("Weight for availability matching (0-1)"),
    specializationMatch: z.number().describe("Weight for specialization matching (0-1)"),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    const startTime = Date.now()

    // Use AI to parse the search query and extract requirements
    const { object: searchCriteria } = await generateObject({
      model: openai("gpt-4o"),
      prompt: `Parse this hiring query and extract the key requirements: "${query}"
      
      Focus on:
      - Technical skills mentioned (especially AI/ML related like LangChain, RAG, transformers, etc.)
      - Location preferences (countries, cities, remote work)
      - Experience level requirements (years, seniority)
      - Work arrangement preferences (full-time, contract, remote, etc.)
      - AI/ML specializations (NLP, computer vision, MLOps, research, etc.)
      - Define scoring weights for matching candidates (should sum to 1.0)
      
      Example: For "Find senior GenAI engineers with LangChain + RAG experience in Europe", extract:
      - Skills: ["LangChain", "RAG", "GenAI", "AI Engineering"]
      - Locations: ["Europe"]
      - Experience: "senior"
      - Specializations: ["GenAI", "RAG Systems"]`,
      schema: searchResultSchema,
    })

    // Advanced scoring algorithm
    const scoredCandidates = mockCandidates.map((candidate) => {
      let score = 0

      // Skill matching with fuzzy matching
      const skillMatches = searchCriteria.relevantSkills.filter((skill) =>
        candidate.skills.some(
          (candidateSkill) =>
            candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(candidateSkill.toLowerCase()) ||
            // Add fuzzy matching for similar skills
            (skill.toLowerCase().includes("ai") && candidateSkill.toLowerCase().includes("artificial")) ||
            (skill.toLowerCase().includes("ml") && candidateSkill.toLowerCase().includes("machine learning")),
        ),
      ).length
      const skillScore = Math.min((skillMatches / Math.max(searchCriteria.relevantSkills.length, 1)) * 100, 100)
      score += skillScore * searchCriteria.scoringCriteria.skillMatch

      // Location matching with region awareness
      const locationMatch = searchCriteria.locationPreferences.some((loc) => {
        const location = loc.toLowerCase()
        const candidateLocation = candidate.location.toLowerCase()
        return (
          candidateLocation.includes(location) ||
          // European countries matching
          (location.includes("europe") &&
            ["germany", "netherlands", "poland", "sweden", "uk", "france", "spain"].some((country) =>
              candidateLocation.includes(country),
            ))
        )
      })
      const locationScore = locationMatch ? 100 : candidate.availability.toLowerCase().includes("remote") ? 70 : 0
      score += locationScore * searchCriteria.scoringCriteria.locationMatch

      // Experience matching with level mapping
      const experienceMapping = {
        junior: [0, 3],
        mid: [3, 6],
        senior: [5, 10],
        lead: [7, 15],
        principal: [10, 20],
      }

      const requiredLevel = searchCriteria.experienceLevel.toLowerCase()
      let experienceScore = 50 // default score

      if (experienceMapping[requiredLevel]) {
        const [minExp, maxExp] = experienceMapping[requiredLevel]
        if (candidate.experience >= minExp && candidate.experience <= maxExp) {
          experienceScore = 100
        } else if (candidate.experience >= minExp - 1 && candidate.experience <= maxExp + 2) {
          experienceScore = 80
        }
      }
      score += experienceScore * searchCriteria.scoringCriteria.experienceMatch

      // Availability matching
      const workTypeMatch =
        candidate.availability.toLowerCase().includes(searchCriteria.workType.toLowerCase()) ||
        (searchCriteria.workType.toLowerCase().includes("remote") &&
          candidate.availability.toLowerCase().includes("remote"))
      const availabilityScore = workTypeMatch ? 100 : 60
      score += availabilityScore * searchCriteria.scoringCriteria.availabilityMatch

      // Specialization matching
      const specializationMatches = searchCriteria.specializations.filter(
        (spec) =>
          candidate.summary.toLowerCase().includes(spec.toLowerCase()) ||
          candidate.projects.some((project) => project.toLowerCase().includes(spec.toLowerCase())) ||
          candidate.title.toLowerCase().includes(spec.toLowerCase()),
      ).length
      const specializationScore =
        searchCriteria.specializations.length > 0
          ? (specializationMatches / searchCriteria.specializations.length) * 100
          : 50
      score += specializationScore * searchCriteria.scoringCriteria.specializationMatch

      // Bonus factors
      let bonusScore = 0
      if (candidate.publications > 5) bonusScore += 5
      if (candidate.githubStars > 1000) bonusScore += 5
      if (candidate.yearsInAI >= 5) bonusScore += 3
      if (candidate.lastActive.includes("hour") || candidate.lastActive.includes("day")) bonusScore += 2

      return {
        ...candidate,
        score: Math.min(Math.round(score + bonusScore), 100),
        matchDetails: {
          skillMatch: skillScore,
          locationMatch: locationScore,
          experienceMatch: experienceScore,
          availabilityMatch: availabilityScore,
          specializationMatch: specializationScore,
          bonusScore,
        },
      }
    })

    // Sort by score and return top candidates
    const rankedCandidates = scoredCandidates.sort((a, b) => b.score - a.score).slice(0, 20) // Return top 20 candidates

    const searchTime = Date.now() - startTime

    return NextResponse.json({
      query,
      candidates: rankedCandidates,
      totalFound: rankedCandidates.length,
      searchTime,
      searchCriteria,
      summary: {
        averageScore: Math.round(rankedCandidates.reduce((sum, c) => sum + c.score, 0) / rankedCandidates.length),
        topSkills: searchCriteria.relevantSkills,
        matchingLocations: rankedCandidates.filter((c) => c.matchDetails.locationMatch > 50).length,
        experienceRange: {
          min: Math.min(...rankedCandidates.map((c) => c.experience)),
          max: Math.max(...rankedCandidates.map((c) => c.experience)),
        },
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
