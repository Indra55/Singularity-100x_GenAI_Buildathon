import { NextResponse } from 'next/server';

// Mock candidate data for fallback when backend is unavailable
const mockCandidates = [
  {
    id: "1",
    name: "John Smith",
    title: "Senior AI Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    experience: 7,
    sector: "tech",
    skills: ["python", "machine learning", "tensorflow", "langchain"],
    score: 92,
    avatar: "/avatars/male1.png",
    summary: "Experienced AI engineer with a focus on NLP and large language models.",
    matchScoreBreakdown: {
      skillsMatch: 95,
      experienceMatch: 90,
      sectorMatch: 100,
      educationMatch: 85,
      overallFit: 92
    },
    email: "john.smith@example.com",
    status: "new",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johnsmith",
      github: "https://github.com/johnsmith",
      twitter: "https://twitter.com/johnsmith",
      portfolio: "https://johnsmith.dev"
    },
    resumeUrl: "/resumes/john-smith.pdf"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    title: "Machine Learning Specialist",
    company: "AI Solutions Inc",
    location: "Boston, MA",
    experience: 5,
    sector: "tech",
    skills: ["python", "pytorch", "computer vision", "data science"],
    score: 88,
    avatar: "/avatars/female1.png",
    summary: "ML specialist with expertise in computer vision and neural networks.",
    matchScoreBreakdown: {
      skillsMatch: 90,
      experienceMatch: 85,
      sectorMatch: 100,
      educationMatch: 90,
      overallFit: 88
    },
    email: "sarah.johnson@example.com",
    status: "new",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
      portfolio: "https://sarahjohnson.dev"
    },
    resumeUrl: "/resumes/sarah-johnson.pdf"
  },
  {
    id: "3",
    name: "Michael Chen",
    title: "Data Scientist",
    company: "FinTech Solutions",
    location: "New York, NY",
    experience: 6,
    sector: "finance",
    skills: ["python", "r", "sql", "machine learning", "statistics"],
    score: 85,
    avatar: "/avatars/male2.png",
    summary: "Data scientist with strong background in financial modeling and risk assessment.",
    matchScoreBreakdown: {
      skillsMatch: 88,
      experienceMatch: 85,
      sectorMatch: 100,
      educationMatch: 80,
      overallFit: 85
    },
    email: "michael.chen@example.com",
    status: "new",
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelchen",
      github: "https://github.com/michaelchen"
    },
    resumeUrl: "/resumes/michael-chen.pdf"
  }
];

// Filter mock candidates based on sector, experience, and skills
function filterMockCandidates(sector: string, min_experience: number, skills: string[]) {
  return mockCandidates.filter(candidate => {
    // Filter by sector if provided
    if (sector && candidate.sector !== sector) {
      return false;
    }
    
    // Filter by minimum experience if provided
    if (min_experience && candidate.experience < min_experience) {
      return false;
    }
    
    // Filter by skills if provided
    if (skills && skills.length > 0) {
      const candidateSkills = candidate.skills.map(s => s.toLowerCase());
      const requiredSkills = skills.map(s => s.toLowerCase());
      const hasAllSkills = requiredSkills.every(skill => candidateSkills.includes(skill));
      if (!hasAllSkills) {
        return false;
      }
    }
    
    return true;
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sector, min_experience, skills, top_k } = body;

    // Call the actual backend Flask API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5001';
    console.log(`Calling backend API at ${backendUrl}/sector_ranking`);
    
    try {
      const response = await fetch(`${backendUrl}/sector_ranking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sector,
          min_experience,
          skills,
          top_k: top_k || 10
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (backendError) {
      console.warn('Backend API unavailable, using mock data:', backendError);
      
      // Fallback to mock data
      const filteredCandidates = filterMockCandidates(sector, min_experience, skills);
      
      return NextResponse.json({
        candidates: filteredCandidates,
        query: { sector, min_experience, skills }
      });
    }
  } catch (error) {
    console.error('Error in sector ranking:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
