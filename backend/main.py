from fastapi import FastAPI, UploadFile, File, Form
import fitz
from backend.models import ResumeRequest
from backend.utils import extract_text_from_pdf, calculate_match
app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to AI Resume Reviewer 🚀"}

@app.post("/analyze")
def analyze_resume(data: ResumeRequest):

    return calculate_match(
        data.resume,
        data.job_description
    )
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    text = extract_text_from_pdf(await file.read())

    return {
        "filename": file.filename,
        "text": text
    }

from fastapi import Form

@app.post("/analyze-resume")
async def analyze_resume_file(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    resume_text = extract_text_from_pdf(await file.read())

    result = calculate_match(resume_text, job_description)

    return {
        "filename": file.filename,
        "analysis": result
    }