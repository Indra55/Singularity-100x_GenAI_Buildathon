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
  model: "models/gemini-2.0-flash-lite",
  apiKey: GEMINI_API_KEY,
});

const parser = new StringOutputParser();
const sessionHistories = {};

// Enhanced Templates
const SYSTEM_PROMPT = `You are an expert AI Interview Coach specializing in technical recruitment. Your role is to help recruiters and hiring managers improve their interviewing skills through realistic practice scenarios and personalized feedback.

Key Principles:
1. Focus on structured, behavior-based interviewing techniques
2. Emphasize technical assessment best practices
3. Guide on evaluating both technical and soft skills
4. Provide actionable, specific feedback
5. Maintain a professional yet supportive tone

Response Guidelines:
- Keep responses concise and to the point
- Use markdown for formatting (bold, lists, code blocks)
- Provide specific examples when giving feedback
- Focus on one key learning point at a time
- Include relevant industry best practices`;

const COACHING_PROMPT = `# Interview Coach Response

## Context
- **Coach Style**: {coach_personality}
- **Difficulty**: {level}
- **Focus Area**: {focus_area}
- **Scenario**: {scenario_type}

## Conversation History
{previous_response}

## Current Interaction
**User**: {query}

## Your Task
1. Analyze the user's message for:
   - Technical accuracy
   - Interview technique
   - Question quality
   - Bias awareness
   - Candidate experience

2. Provide:
   - Specific, actionable feedback
   - Alternative approaches
   - Relevant examples
   - Next steps for improvement

## Response Format
- Use markdown for formatting
- Keep it concise (2-3 paragraphs max)
- Focus on 1-2 key learning points
- Include a clear call-to-action or question to continue the learning`;

const REPORT_PROMPT = `# Interview Performance Analysis

## Session Summary
- **Date**: {date}
- **Duration**: {duration}
- **Scenario**: {scenario_type}
- **Focus Areas**: {focus_areas}

## Performance Metrics
- **Question Quality**: {quality_score}/10
- **Technical Depth**: {tech_score}/10
- **Candidate Experience**: {exp_score}/10
- **Bias Awareness**: {bias_score}/10

## Key Strengths
1. {strength1}
2. {strength2}

## Areas for Improvement
1. {improvement1}
2. {improvement2}

## Detailed Feedback
{feedback}

## Recommended Next Steps
1. {next_step1}
2. {next_step2}
3. {next_step3}

## Resources
- [Structured Interview Guide](https://example.com/structured-interviewing)
- [Technical Assessment Best Practices](https://example.com/tech-assessments)
- [Reducing Bias in Hiring](https://example.com/reducing-bias)`;

const passingPrompt = PromptTemplate.fromTemplate(COACHING_PROMPT);
const reportPrompt = PromptTemplate.fromTemplate(REPORT_PROMPT);

const llmChain = passingPrompt.pipe(llm).pipe(parser);
const reportChain = reportPrompt.pipe(llm).pipe(parser);

// Strip Markdown/LaTeX
function stripFormatting(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/`+/g, "")
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+\*?/g, "")
    .trim();
}

// POST: evaluate question
router.post("/", async (req, res) => {
  const {
    session_id,
    coach_personality,
    level,
    focus_area,
    scenario_type,
    query,
  } = req.body;

  const history = sessionHistories[session_id] || [];
  const previous_response = history.join("\n");

  try {
    const response = await llmChain.invoke({
      coach_personality,
      level,
      focus_area,
      scenario_type,
      query,
      previous_response,
    });

    history.push(`Q: ${query}\nA: ${response}`);
    sessionHistories[session_id] = history;

    res.json({ response, history });
  } catch (error) {
    res.status(500).json({ error: "Failed to process question.", detail: error.message });
  }
});

// GET: report
router.get("/report", async (req, res) => {
  const sessionId = req.query.session_id;
  const history = sessionHistories[sessionId];

  if (!history) {
    return res.status(404).json({ error: "No session found with that ID." });
  }

  const logText = history.join("\n");
  try {
    let report = await reportChain.invoke({ log: logText });
    report = stripFormatting(report);

    const doc = new PDFDocument();
    const tmpPath = os.tmpdir() + `/report_${sessionId}.pdf`;
    const stream = fs.createWriteStream(tmpPath);
    doc.pipe(stream);
    doc.font("Times-Roman").fontSize(12);
    report.split("\n").forEach((line) => {
      doc.text(line, { paragraphGap: 10 });
    });
    doc.end();

    stream.on("finish", () => {
      res.download(tmpPath, `Interview_Report_${sessionId}.pdf`);
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report.", detail: error.message });
  }
});

module.exports = router;