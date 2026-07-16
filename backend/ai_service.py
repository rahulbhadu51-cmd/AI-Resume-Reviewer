import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_ai_feedback(resume_text, job_description):

    prompt = f"""
You are an expert ATS Resume Reviewer.

Resume:
{resume_text}

Job Description:
{job_description}

Provide:
1. Resume Score
2. Strengths
3. Missing Skills
4. Suggestions
5. Overall Verdict
"""

    try:
        response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
)

        return response.text

    except Exception as e:
        return f"⚠️ AI Feedback is temporarily unavailable.\n\nReason:\n{str(e)}"