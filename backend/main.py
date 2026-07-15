from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from backend.models import ResumeRequest
from backend.utils import extract_text_from_pdf, calculate_match
from backend.ai_service import get_ai_feedback

app = FastAPI()

# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow requests from any frontend
    allow_credentials=False,      # Must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Home Route
# ----------------------------
@app.get("/")
def home():
    return {
        "message": "Welcome to AI Resume Reviewer 🚀"
    }

# ----------------------------
# Analyze Resume Text
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

    resume_text = extract_text_from_pdf(
        await file.read()
    )

    return {
        "filename": file.filename,
        "text": resume_text
    }

# ----------------------------
# Analyze Resume PDF
# ----------------------------
@app.post("/analyze-resume")
async def analyze_resume_file(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    # Extract resume text
    resume_text = extract_text_from_pdf(
        await file.read()
    )

    # Calculate ATS score
    analysis = calculate_match(
        resume_text,
        job_description
    )

    # Generate AI feedback
    try:
        ai_feedback = get_ai_feedback(
            resume_text,
            job_description
        )

    except Exception as e:
        ai_feedback = (
            "⚠ AI Feedback is temporarily unavailable.\n\n"
            f"Reason:\n{str(e)}"
        )

    return {
        "filename": file.filename,
        "analysis": analysis,
        "ai_feedback": ai_feedback
    }