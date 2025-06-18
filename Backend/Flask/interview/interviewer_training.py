from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
import os
from typing import  Annotated
from dotenv import load_dotenv
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi.responses import FileResponse
from fpdf import FPDF
import tempfile
import re 

load_dotenv()
GEMINI_API = os.getenv("GEMINI_KEY")

llm = ChatGoogleGenerativeAI(model='models/gemini-2.0-flash-lite', google_api_key=GEMINI_API)
parser = StrOutputParser()
app = FastAPI()

session_histories = {}

# class Interview(BaseModel):
#     level : str = Field("What level is the job for entry, senior, etc")
#     role : str = Field("What kind of role we are hiring for ex web dev, AI engineer, etc")
#     previous_response : Optional[list[str]] = None
#     query : Optional[str] = None

prompt = """You are an expert interviewer tasked with grading the questions given by our new interviewer. Respond in plain text.

Coach Personality: {coach_personality}
Difficulty Level: {level}
Focus Area: {focus_area}
Scenario Type: {scenario_type}

Previous Conversation:
{previous_response}

New Question: {query}
"""


passing_prompt = PromptTemplate.from_template(prompt)

llm_chain = passing_prompt | llm | parser

report_prompt = PromptTemplate.from_template(
    """You are a professional interviewer evaluator.
Based on the following conversation log between an interviewer and a candidate, write a comprehensive summary evaluating the quality of the interview questions asked.
Assess the depth, clarity, relevance, and overall flow of the interview. Mention areas of strength and areas of improvement.

Conversation Log:
{log}

Output a formal PDF-style report summarizing your assessment, report should be in plain text no highlights or any other format is appreciated."""
)

report_chain = report_prompt | llm | parser


@app.post("/")
def send_questions(
    session_id: Annotated[str, Form()],
    coach_personality: Annotated[str, Form()],
    level: Annotated[str, Form()],
    focus_area: Annotated[str, Form()],
    scenario_type: Annotated[str, Form()],
    query: Annotated[str, Form()]
):
    history = session_histories.get(session_id, [])
    previous_response_text = "\n".join(history) if history else ""

    response = llm_chain.invoke({
        "coach_personality": coach_personality,
        "level": level,
        "focus_area": focus_area,
        "scenario_type": scenario_type,
        "query": query,
        "previous_response": previous_response_text
    })

    history.append(f"Q: {query}\nA: {response}")
    session_histories[session_id] = history

    return {"response": response, "history": history}

def strip_formatting(text: str) -> str:
    # --- Strip Markdown ---
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)  # **bold**
    text = re.sub(r"\*(.*?)\*", r"\1", text)      # *italic*
    text = re.sub(r"^#+\s*", "", text, flags=re.MULTILINE)  # headers like ### Heading
    text = re.sub(r"`+", "", text)  # inline code `...`

    # --- Strip LaTeX ---
    text = re.sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", text)  # \textbf{...} → ...
    text = re.sub(r"\\[a-zA-Z]+\*?", "", text)  # commands like \begin, \end, \textit, etc.

    return text.strip()

@app.get("/report")
def get_report(session_id: str):
    history = session_histories.get(session_id)
    if not history:
        return {"error": "No session found with that ID."}

    log_text = "\n".join(history)
    report = report_chain.invoke({"log": log_text})

    # Clean markdown and LaTeX
    report = strip_formatting(report)

    # PDF writing
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Arial", size=12)

    for line in report.split("\n"):
        pdf.multi_cell(0, 10, txt=line)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        pdf.output(tmp_file.name)
        tmp_file_path = tmp_file.name

    return FileResponse(tmp_file_path, media_type="application/pdf", filename=f"Interview_Report_{session_id}.pdf")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if __name__ == "__main__":
    uvicorn.run(app, port=5400)