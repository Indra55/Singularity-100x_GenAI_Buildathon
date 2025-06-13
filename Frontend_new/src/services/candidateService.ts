const API_BASE_URL = 'http://localhost:5001'; // Your Node.js backend URL
const INTERACTIONS_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4100';

export interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  years_of_experience: number;
  skills: string[];
  work_preference: string;
  summary: string;
  status: string;
  available_from: string;
  match_score?: number;
  matchScore?: number; // Alias for match_score for backward compatibility
  resume_url?: string;
  avatar?: string; // For UI avatar display
  social_links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface SearchFilters {
  min_experience?: number;
  max_experience?: number;
  work_preference?: string;
  location?: string;
  status?: string;
  available_from?: string;
  min_score?: number;
  skills?: string[];
}

export const searchCandidates = async (query: string, filters: SearchFilters = {}, topK: number = 10): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        top_k: topK,
        ...filters,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error searching candidates: ${error}`);
    }

    const data = await response.json();
    return data.candidates || [];
  } catch (error) {
    console.error('Error searching candidates:', error);
    throw error;
  }
};

export const recordCandidateInteraction = async (
  userId: string,
  candidateId: string,
  interactionType: 'VIEW' | 'SWIPE_LEFT' | 'SWIPE_RIGHT'
) => {
  try {
    const response = await fetch(`${INTERACTIONS_API_URL}/candidate-interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        candidate_id: candidateId,
        interaction_type: interactionType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record interaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error recording candidate interaction:', error);
    throw error;
  }
};

export const getCandidateInteractionStats = async (candidateId: string) => {
  try {
    const response = await fetch(`${INTERACTIONS_API_URL}/candidate-interactions/candidate/${candidateId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch candidate interaction stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching candidate interaction stats:', error);
    throw error;
  }
};