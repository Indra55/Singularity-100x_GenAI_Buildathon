import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4100';

export const talentPoolService = {
  // Add a single candidate to talent pool
  addCandidate: async (candidate: any) => {
    try {
      const response = await axios.post(`${API_URL}/talent-pool/add-candidate`, candidate);
      return response.data;
    } catch (error) {
      console.error('Error adding candidate to talent pool:', error);
      throw error;
    }
  },

  // Add multiple candidates to talent pool
  addCandidates: async (candidates: any[]) => {
    try {
      const response = await axios.post(`${API_URL}/talent-pool/add-candidates`, candidates);
      return response.data;
    } catch (error) {
      console.error('Error adding candidates to talent pool:', error);
      throw error;
    }
  }
}; 