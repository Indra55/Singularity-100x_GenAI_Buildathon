const express = require("express");
const fs = require("fs");
const os = require("os");
const PDFDocument = require("pdfkit");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-exp", // Updated model name
  apiKey: GEMINI_API_KEY,
  temperature: 0.7, // Add some creativity
});

const parser = new StringOutputParser();
const sessionHistories = {};

// Improved System Prompt - More conversational and scenario-driven
const COACHING_PROMPT = `You are an expert AI Interview Coach helping recruiters practice their interviewing skills. You're conducting a realistic training session.

## Current Training Context:
- **Coach Style**: {coach_personality}
- **Difficulty Level**: {level}
- **Focus Area**: {focus_area}
- **Scenario Type**: {scenario_type}

## Previous Conversation:
{previous_response}

## Recruiter's Input:
{query}

## Your Role:
Act as both a coach AND the candidate being interviewed (when appropriate). Provide realistic responses and immediate feedback.

## Instructions:
1. If the recruiter asks a question, respond AS THE CANDIDATE first, then provide coaching feedback
2. If the recruiter needs guidance, provide specific, actionable advice
3. Keep responses conversational and engaging
4. Point out both strengths and areas for improvement
5. Suggest better question alternatives when needed

## Response Format:
**[CANDIDATE RESPONSE]:** [Realistic candidate answer based on scenario]

**[COACH FEEDBACK]:** [Your analysis and suggestions]

**[NEXT SUGGESTION]:** [What to try next or ask]

Be encouraging but honest about areas needing improvement.`;

// Simplified report prompt with actual variables
const REPORT_PROMPT = `Generate a comprehensive interview coaching report based on this conversation log:

{log}

Include:
1. Overall performance summary
2. Key strengths demonstrated
3. Areas needing improvement
4. Specific examples from the conversation
5. Actionable recommendations
6. Suggested next steps

Format as a professional report with clear sections.`;

const passingPrompt = PromptTemplate.fromTemplate(COACHING_PROMPT);
const reportPrompt = PromptTemplate.fromTemplate(REPORT_PROMPT);

const llmChain = passingPrompt.pipe(llm).pipe(parser);
const reportChain = reportPrompt.pipe(llm).pipe(parser);

// Initialize session with welcome message
function initializeSession(sessionId, config) {
  if (!sessionHistories[sessionId]) {
    const welcomeMessage = `Welcome to your interview training session! 

**Scenario**: You're interviewing a ${config.scenario_type} candidate for a ${config.focus_area} position.
**Difficulty**: ${config.level}
**Coach Style**: ${config.coach_personality}

I'll play the role of the candidate and provide coaching feedback. Start by introducing yourself and asking your first question!`;
    
    sessionHistories[sessionId] = [welcomeMessage];
  }
}

// Strip Markdown/LaTeX for PDF
function stripFormatting(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/`+/g, "")
    .replace(/\[[^\]]*\]:/g, "")
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+\*?/g, "")
    .trim();
}

// POST: Handle conversation
router.post("/", async (req, res) => {
  try {
    const {
      session_id,
      coach_personality = "supportive",
      level = "intermediate",
      focus_area = "technical skills",
      scenario_type = "software engineer",
      query,
    } = req.body;

    // Validate required fields
    if (!session_id || !query) {
      return res.status(400).json({ 
        error: "Missing required fields: session_id and query are required" 
      });
    }

    // Initialize session if needed
    initializeSession(session_id, { coach_personality, level, focus_area, scenario_type });

    const history = sessionHistories[session_id] || [];
    const previous_response = history.slice(-3).join("\n"); // Only use last 3 exchanges to avoid token limits

    console.log("Processing query:", query);
    console.log("Session history length:", history.length);

    const response = await llmChain.invoke({
      coach_personality,
      level,
      focus_area,
      scenario_type,
      query,
      previous_response,
    });

    // Store the interaction
    const interaction = `RECRUITER: ${query}\nCOACH: ${response}`;
    history.push(interaction);
    sessionHistories[session_id] = history;

    console.log("Generated response:", response.substring(0, 100) + "...");

    res.json({ 
      response, 
      session_id,
      history_length: history.length,
      success: true 
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ 
      error: "Failed to process your input", 
      detail: error.message,
      success: false 
    });
  }
});

// GET: Generate and download report
router.get("/report", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    
    if (!sessionId) {
      return res.status(400).json({ error: "session_id is required" });
    }

    const history = sessionHistories[sessionId];

    if (!history || history.length === 0) {
      return res.status(404).json({ error: "No session found or session is empty" });
    }

    const logText = history.join("\n\n");
    console.log("Generating report for session:", sessionId);

    let report = await reportChain.invoke({ log: logText });
    report = stripFormatting(report);

    // Generate PDF
    const doc = new PDFDocument();
    const tmpPath = `${os.tmpdir()}/interview_report_${sessionId}_${Date.now()}.pdf`;
    const stream = fs.createWriteStream(tmpPath);
    
    doc.pipe(stream);
    
    // Add title
    doc.fontSize(16).text("Interview Training Report", { align: 'center' });
    doc.moveDown();
    
    // Add content
    doc.fontSize(12);
    const lines = report.split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        doc.text(line, { paragraphGap: 5 });
      }
    });
    
    doc.end();

    stream.on("finish", () => {
      res.download(tmpPath, `Interview_Training_Report_${sessionId}.pdf`, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
        }
        // Clean up temp file
        fs.unlink(tmpPath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
        });
      });
    });

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ 
      error: "Failed to generate report", 
      detail: error.message 
    });
  }
});

// GET: Get session history (for debugging)
router.get("/session/:session_id", (req, res) => {
  const sessionId = req.params.session_id;
  const history = sessionHistories[sessionId];
  
  if (!history) {
    return res.status(404).json({ error: "Session not found" });
  }
  
  res.json({ 
    session_id: sessionId, 
    history, 
    message_count: history.length 
  });
});

// DELETE: Clear session (for testing)
router.delete("/session/:session_id", (req, res) => {
  const sessionId = req.params.session_id;
  delete sessionHistories[sessionId];
  res.json({ message: "Session cleared", session_id: sessionId });
});

module.exports = router;