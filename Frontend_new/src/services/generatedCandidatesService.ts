import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4100';

export interface GeneratedCandidate {
  id: number;
  user_id: string;
  candidate_data: any; // This will match your Candidate interface
  source_type: 'AI_GENERATED' | 'RESUME_PARSED' | 'MANUAL_ENTRY';
  created_at: string;
  updated_at: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
}

export const storeGeneratedCandidate = async (
  userId: string,
  candidateData: any,
  sourceType: 'AI_GENERATED' | 'RESUME_PARSED' | 'MANUAL_ENTRY'
): Promise<GeneratedCandidate> => {
  try {
    const response = await axios.post(`${API_URL}/generated-candidates`, {
      user_id: userId,
      candidate_data: candidateData,
      source_type: sourceType,
    });
    return response.data;
  } catch (error) {
    console.error('Error storing generated candidate:', error);
    throw error;
  }
};

export const getUserGeneratedCandidates = async (
  userId: string,
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED' = 'ACTIVE'
): Promise<GeneratedCandidate[]> => {
  try {
    const response = await axios.get(`${API_URL}/generated-candidates/user/${userId}`, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching generated candidates:', error);
    throw error;
  }
};

export const updateCandidateStatus = async (
  candidateId: number,
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED'
): Promise<GeneratedCandidate> => {
  try {
    const response = await axios.patch(`${API_URL}/generated-candidates/${candidateId}/status`, {
      status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating candidate status:', error);
    throw error;
  }
};

export const updateCandidateData = async (
  candidateId: number,
  candidateData: any
): Promise<GeneratedCandidate> => {
  try {
    const response = await axios.patch(`${API_URL}/generated-candidates/${candidateId}`, {
      candidate_data: candidateData
    });
    return response.data;
  } catch (error) {
    console.error('Error updating candidate data:', error);
    throw error;
  }
}; 