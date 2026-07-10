import fitz


def extract_text_from_pdf(file_bytes):

    pdf = fitz.open(stream=file_bytes, filetype="pdf")

    text = ""

    for page in pdf:
        text += page.get_text()

    return text

def calculate_match(resume_text, job_description):

    resume = resume_text.lower()
    job = job_description.lower()

    skills = ["python", "fastapi", "sql", "docker", "git"]

    matched = []
    missing = []

    for skill in skills:
        if skill in resume and skill in job:
            matched.append(skill)
        elif skill in job:
            missing.append(skill)

    score = (len(matched) / len(skills)) * 100

    return {
        "match_score": score,
        "matched_skills": matched,
        "missing_skills": missing
    }