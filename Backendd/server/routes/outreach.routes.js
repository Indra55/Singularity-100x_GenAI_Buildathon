const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();



// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI('AIzaSyB6w1fjSlyPVUFbOUk7Crd1WHq5uN5bOqA');


/**
 * Generate personalized outreach messages using Google Gemini AI
 * POST /api/outreach/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { candidate, messageType = 'email', tone = 'professional', customPrompt = '', senderInfo = {} } = req.body;
    
    if (!candidate) {
      return res.status(400).json({ success: false, message: 'Candidate data is required' });
    }
    
    // Extract candidate details
    const { 
      name = '', 
      title = '', 
      company = '', 
      skills = [], 
      experience = '',
      location = '',
      summary = ''
    } = candidate;
    
    // Extract sender company information
    const { 
      name: senderName = '',
      email: senderEmail = '',
      companyName = '',
      industrySector = '',
      companySize = '',
      officeLocations = [],
      keyDepartments = []
    } = senderInfo;
    
    // Create prompt for Gemini
    const prompt = `
      Generate a personalized ${messageType} outreach message to a potential job candidate with the following details:
      
      CANDIDATE INFORMATION:
      Name: ${name}
      Current Title: ${title}
      Current Company: ${company}
      Skills: ${skills.join(', ')}
      Years of Experience: ${experience}
      Location: ${location}
      Summary: ${summary}
      
      SENDER INFORMATION:
      Sender Name: ${senderName}
      Sender Email: ${senderEmail}
      Company Name: ${companyName}
      Industry/Sector: ${industrySector}
      Company Size: ${companySize} employees
      Office Locations: ${officeLocations.join(', ')}
      Key Departments: ${keyDepartments.join(', ')}
      
      The message should be in a ${tone} tone.
      
      Additional instructions: ${customPrompt}
      
      The message should be personalized based on the candidate's skills and experience, 
      mentioning specific aspects of their background that make them a good fit for ${companyName}.
      Include relevant details about the sender's company such as industry, size, or key departments that would be relevant to this candidate.
      Sign the message with the sender's name and company.
      Keep the message concise, engaging, and persuasive.
    `;
    
    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedMessage = response.text();
    
    return res.json({
      success: true,
      message: generatedMessage
    });
    
  } catch (error) {
    console.error('Error generating outreach message:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to generate outreach message',
      error: error.message 
    });
  }
});

module.exports = router;
