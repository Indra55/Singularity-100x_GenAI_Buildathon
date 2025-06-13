const { GoogleGenerativeAI } = require('@google/generative-ai');

class ResumeService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async parseResumeText(resumeText) {
    const prompt = `
   You are a resume parser. Given a resume (plain text or extracted from a PDF), return a JSON object where each field exactly matches the following table columns. If data is missing, return "null" or an empty string ("") as appropriate. Do not skip any field. Keep formatting consistent and minimal.

The expected fields are:

- name
- email
- phone
- photo
- title
- location
- years_of_experience
- skills (comma-separated string)
- work_preference (e.g., remote, onsite, hybrid)
- education (single string summary of highest education)
- past_companies (comma-separated string or list)
- linkedin_url
- portfolio_url
- status (e.g., active, passive)
- resume_summary (brief 2–3 line summary of the entire resume content)

Now parse the following resume accordingly:


    Resume text:
    ${resumeText}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      // Parse and validate JSON
      const parsedData = JSON.parse(cleanedText);
      
      return parsedData;
    } catch (error) {
      console.error('Error parsing resume with Gemini:', error);
      throw new Error('Failed to parse resume content');
    }
  }

  async enhanceResumeData(parsedData, additionalContext = '') {
    const prompt = `
    Please enhance and standardize the following resume data. Add any missing fields with empty values, 
    standardize date formats (YYYY-MM), and improve the structure. Return only valid JSON.

    Additional context: ${additionalContext}

    Current data:
    ${JSON.stringify(parsedData, null, 2)}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const enhancedData = JSON.parse(cleanedText);
      
      return enhancedData;
    } catch (error) {
      console.error('Error enhancing resume data:', error);
      return parsedData; // Return original data if enhancement fails
    }
  }
}

module.exports = new ResumeService();