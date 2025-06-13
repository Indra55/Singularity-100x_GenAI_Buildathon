import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4100';

export interface CandidateInteraction {
  id: number;
  user_id: string;
  candidate_id: string;
  interaction_type: 'VIEW' | 'SWIPE_LEFT' | 'SWIPE_RIGHT';
  created_at: string;
}

export const recordInteraction = async (
  userId: string,
  candidateId: string,
  interactionType: 'VIEW' | 'SWIPE_LEFT' | 'SWIPE_RIGHT'
): Promise<CandidateInteraction> => {
  try {
    const response = await axios.post(`${API_URL}/candidate-interactions`, {
      user_id: userId,
      candidate_id: candidateId,
      interaction_type: interactionType,
    });
    return response.data;
  } catch (error) {
    console.error('Error recording interaction:', error);
    throw error;
  }
};

export const getUserInteractions = async (userId: string): Promise<CandidateInteraction[]> => {
  try {
    const response = await axios.get(`${API_URL}/candidate-interactions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    throw error;
  }
};

export const getCandidateInteractions = async (candidateId: string): Promise<{ interaction_type: string; count: number }[]> => {
  try {
    const response = await axios.get(`${API_URL}/candidate-interactions/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate interactions:', error);
    throw error;
  }
}; 