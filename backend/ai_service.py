import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_ai_feedback(resume_text, job_description):

    prompt = f"""
You are a Senior Technical Recruiter with over 15 years of hiring experience.

Your task is to analyze the candidate's resume against the given job description.

### Resume
{resume_text}

### Job Description
{job_description}

Generate a professional report with the following sections:

# ATS Score (0-100)

# Skills Matched
- List the matching technical skills.

# Missing Skills
- List the important missing skills.

# Resume Strengths
- Mention the strongest parts of the resume.

# Resume Weaknesses
- Mention areas that reduce interview chances.

# Project Review
- Review the projects mentioned.
- Suggest improvements if needed.

# Resume Improvement Suggestions
- Give 5 actionable suggestions.

# Interview Chances
- Estimate the interview selection probability.

# Final Verdict
- Conclude whether the candidate is a Strong Match, Moderate Match, or Weak Match.

Use professional formatting with headings and bullet points.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"⚠️ AI Feedback is temporarily unavailable.\n\nReason:\n{str(e)}"