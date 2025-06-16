import axios from 'axios';
import { backendUrl } from "../lib/config";

const API_URL = backendUrl;

export const resumeService = {
  parseSingleResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await axios.post(`${API_URL}/resume/parse`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  parseZipResume: async (file: File) => {
    const formData = new FormData();
    formData.append('zipFile', file);
    const response = await axios.post(`${API_URL}/resume/parse-batch`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  parseMultipleResumes: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('resumes', file));
    const response = await axios.post(`${API_URL}/resume/parse-multiple`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
}; 