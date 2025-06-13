const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateJD(jobDetails) {
    try {
        if (!jobDetails || typeof jobDetails !== 'object') {
            throw new Error('Invalid job details provided');
        }

        const {
            job_title = '',
            department = '',
            company_overview = '',
            responsibilities = '',
            required_skills = '',
            preferred_skills = 'Not specified',
            work_type = '',
            location = '',
            employment_type = '',
            seniority_level = '',
            salary_range = 'Competitive',
            perks = 'Not specified',
            tone = 'Professional'
        } = jobDetails;

        const prompt = `
Generate a compelling and well-structured Job Description using the following details:

- **Job Title**: ${job_title}
- **Department/Team**: ${department}
- **Company Overview**: ${company_overview}
- **Key Responsibilities**: 
  ${responsibilities.split('\n').filter(Boolean).map(r => `- ${r}`).join('\n  ')}
- **Required Skills/Qualifications**: 
  ${required_skills.split('\n').filter(Boolean).map(s => `- ${s}`).join('\n  ')}
- **Preferred Skills/Qualifications**: 
  ${preferred_skills === 'Not specified' ? 'Not specified' : preferred_skills.split('\n').filter(Boolean).map(s => `- ${s}`).join('\n  ')}
- **Work Type**: ${work_type}
- **Location**: ${location}
- **Employment Type**: ${employment_type}
- **Seniority Level**: ${seniority_level}
- **Salary Range**: ${salary_range}
- **Perks and Benefits**: 
  ${perks === 'Not specified' ? 'Not specified' : perks.split('\n').filter(Boolean).map(p => `- ${p}`).join('\n  ')}
- **Preferred Tone/Style**: ${tone}

**Output Requirements**:
- Format the output as a job listing suitable for use on job boards and company career pages.
- Begin with an engaging summary that attracts the right candidates.
- Ensure clarity, inclusivity, and a consistent tone throughout the description.
- Do not include any placeholders or template markers in the final output.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        if (!response || !response.text) {
            throw new Error('No response from AI model');
        }

        return response.text();
    } catch (error) {
        console.error("Error in generateJD:", error);
        throw new Error(`Failed to generate job description: ${error.message}`);
    }
}

module.exports = { generateJD };