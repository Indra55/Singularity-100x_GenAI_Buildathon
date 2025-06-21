import axios from 'axios';

const API_BASE_URL = 'https://singularity-100x-genai-buildathon.onrender.com/interview';

export type CoachPersonality = 'mentor' | 'expert' | 'supportive' | 'challenging';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type FocusArea = 'questioning' | 'bias-detection' | 'time-management' | 'communication' | 'all';

export const evaluateQuestion = async ({
  sessionId,
  coachPersonality,
  level,
  focusArea,
  scenarioType,
  query,
}: {
  sessionId: string;
  coachPersonality: CoachPersonality;
  level: DifficultyLevel;
  focusArea: FocusArea;
  scenarioType: string;
  query: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, {
      session_id: sessionId,
      coach_personality: coachPersonality,
      level,
      focus_area: focusArea,
      scenario_type: scenarioType,
      query,
    });
    return response.data;
  } catch (error) {
    console.error('Error evaluating question:', error);
    throw error;
  }
};

export const generateReport = async (sessionId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/report`, {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};
