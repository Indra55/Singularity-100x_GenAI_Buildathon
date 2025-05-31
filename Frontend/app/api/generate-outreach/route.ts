import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Enhanced candidate data for outreach generation
const mockCandidates = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior AI Engineer",
    location: "Berlin, Germany",
    experience: 6,
    skills: ["LangChain", "RAG", "Python", "TensorFlow", "Vector Databases", "OpenAI API"],
    summary:
      "Experienced AI engineer specializing in RAG systems and LangChain applications. Built production-scale AI systems for fintech and healthcare.",
    projects: ["RAG-powered customer support system", "Multi-modal AI assistant", "Vector search optimization"],
    education: "MS Computer Science, TU Berlin",
    availability: "Open to contract work",
    publications: 3,
    githubStars: 1200,
    currentCompany: "TechCorp Berlin",
    interests: ["Open source", "AI research", "Sustainable tech"],
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    title: "GenAI Research Scientist",
    location: "Amsterdam, Netherlands",
    experience: 8,
    skills: ["Transformers", "LangChain", "PyTorch", "Hugging Face", "MLOps", "RAG"],
    summary:
      "Research scientist with deep expertise in transformer architectures and retrieval-augmented generation. Published 15+ papers in top AI conferences.",
    projects: [
      "Novel RAG architecture for code generation",
      "Multi-agent LangChain system",
      "Efficient transformer fine-tuning",
    ],
    education: "PhD AI, University of Amsterdam",
    availability: "Available for consulting",
    publications: 15,
    githubStars: 5000,
    currentCompany: "AI Research Institute",
    interests: ["Academic research", "Open source AI", "Mentoring"],
  },
  {
    id: "3",
    name: "Elena Kowalski",
    title: "AI Product Engineer",
    location: "Warsaw, Poland",
    experience: 5,
    skills: ["LangChain", "FastAPI", "React", "Vector Databases", "AWS", "Docker"],
    summary:
      "Full-stack AI engineer building user-facing AI products. Expert in integrating LLMs into production applications.",
    projects: [
      "AI-powered content management system",
      "Real-time RAG chat application",
      "LangChain workflow automation",
    ],
    education: "BS Software Engineering, Warsaw University",
    availability: "Open to full-time and contract",
    publications: 1,
    githubStars: 800,
    currentCompany: "StartupAI",
    interests: ["Product development", "User experience", "Startup culture"],
  },
]

export async function POST(request: NextRequest) {
  try {
    const { candidateIds, jobQuery, companyInfo, roleDetails } = await request.json()

    const messages: Record<string, string> = {}

    // Generate personalized messages for each candidate
    for (const candidateId of candidateIds) {
      const candidate = mockCandidates.find((c) => c.id === candidateId)
      if (!candidate) continue

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `You are an expert technical recruiter writing a highly personalized outreach email to a top AI talent.

ROLE REQUIREMENTS: ${jobQuery}

CANDIDATE PROFILE:
- Name: ${candidate.name}
- Current Title: ${candidate.title}
- Location: ${candidate.location}
- Experience: ${candidate.experience} years
- Current Company: ${candidate.currentCompany}
- Key Skills: ${candidate.skills.join(", ")}
- Summary: ${candidate.summary}
- Notable Projects: ${candidate.projects.join(", ")}
- Education: ${candidate.education}
- Publications: ${candidate.publications}
- GitHub Stars: ${candidate.githubStars}
- Availability: ${candidate.availability}
- Interests: ${candidate.interests.join(", ")}

COMPANY INFO: ${companyInfo || "Innovative AI startup building the future of intelligent systems"}
ROLE DETAILS: ${roleDetails || "Exciting opportunity to work on cutting-edge AI projects"}

Write a compelling, highly personalized outreach email that:

1. **Subject Line**: Create an attention-grabbing subject line that references their specific work
2. **Personal Connection**: Reference specific projects, publications, or achievements from their profile
3. **Value Proposition**: Clearly explain why this role is perfect for their career trajectory
4. **Technical Relevance**: Connect their exact skills to the role requirements
5. **Company Appeal**: Highlight what makes this opportunity unique
6. **Clear CTA**: Include a specific, low-pressure call to action
7. **Professional Tone**: Warm but professional, showing genuine interest

REQUIREMENTS:
- Keep under 250 words (excluding subject line)
- Include subject line at the top
- Reference at least 2 specific details from their profile
- Avoid generic recruiting language
- Show you've done your research
- Make it feel like a personal invitation, not mass outreach

Format:
Subject: [Your subject line]

[Email body]

Best regards,
[Recruiter name will be added]`,
        system: `You are a world-class technical recruiter known for writing personalized outreach messages that achieve 40%+ response rates. Your messages are:
- Highly specific and researched
- Technically accurate
- Genuinely compelling
- Respectful of the candidate's time
- Focused on mutual value creation

You never use generic templates or mass-email language. Every message feels like it was written specifically for that individual.`,
      })

      messages[candidateId] = text
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Message generation error:", error)
    return NextResponse.json({ error: "Failed to generate messages" }, { status: 500 })
  }
}
