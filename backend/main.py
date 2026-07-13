from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from backend.models import ResumeRequest
from backend.utils import extract_text_from_pdf, calculate_match
from backend.ai_service import get_ai_feedback

app = FastAPI()

# ----------------------------
# CORS
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Home
# ----------------------------
@app.get("/")
def home():
    return {"message": "Welcome to AI Resume Reviewer 🚀"}

# ----------------------------
# Analyze Text Resume
# ----------------------------
@app.post("/analyze")
def analyze_resume(data: ResumeRequest):

    return calculate_match(
        data.resume,
        data.job_description
    )

# ----------------------------
# Upload Resume
# ----------------------------
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    text = extract_text_from_pdf(await file.read())

    return {
        "filename": file.filename,
        "text": text
    }

# ----------------------------
# Analyze Resume PDF
# ----------------------------
@app.post("/analyze-resume")
async def analyze_resume_file(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    resume_text = extract_text_from_pdf(await file.read())

    analysis = calculate_match(
        resume_text,
        job_description
    )

    # AI Feedback
    try:
        ai_feedback = get_ai_feedback(
            resume_text,
            job_description
        )

    except Exception as e:
        ai_feedback = f"AI Feedback is temporarily unavailable.\n\nError:\n{str(e)}"

    return {
        "filename": file.filename,
        "analysis": analysis,
        "ai_feedback": ai_feedback
    }