import axios from 'axios';
import { backendUrl } from "../lib/config";

const API_URL = backendUrl;

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