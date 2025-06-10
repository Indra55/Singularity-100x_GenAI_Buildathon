const {GoogleGenerativeAI} = require("@google/generative-ai")

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = gemini.getGenerativeModel({model: "gemini-2.0-flash"})

async function generateOutreachMsg(candidate, recruiter){
    const prompt = `
You are a recruiter named ${recruiter.name}, working at ${recruiter.company_name} as a ${recruiter.hiring_role}. You are reaching out to a candidate for a potential opportunity.

Based on the candidate’s profile, write a complete, professional, and friendly **outreach email** encouraging them to connect or apply. Make the message warm, respectful, and clearly highlight the candidate’s background and why they are a good fit. Include a strong but non-pushy call to action.

**Important Instructions**:
- Format the output like a real email.
- Include: subject line, greeting, body, closing, and signature.
- Avoid preambles or explanations. Only return the email content.
- Do NOT write "Dear Candidate" — use their real name.
- Write in first-person voice as the recruiter.

Candidate Details:
- Name: ${candidate.name}
- Title: ${candidate.title}
- Skills: ${candidate.skills}
- Experience: ${candidate.experience} years
- Location: ${candidate.location}

Recruiter Details:
- Name: ${recruiter.name}
- Company: ${recruiter.company_name}
- Hiring Role: ${recruiter.hiring_role}
`;

try{
    const result = await model.generateContent(prompt)
    const response = await result.response
    const message = response.text()
    return message
}catch(error){
    console.error("Gemini API error:", error);
    return "⚠️ Failed to generate message.";
}
}
module.exports = {generateOutreachMsg}