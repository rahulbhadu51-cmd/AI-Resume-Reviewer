import fitz
import re


def extract_text_from_pdf(file_bytes):

    pdf = fitz.open(stream=file_bytes, filetype="pdf")

    text = ""

    for page in pdf:
        text += page.get_text()

    return text


# Common technical skills

KNOWN_SKILLS = {

    "python",
    "java",
    "c",
    "c++",
    "javascript",
    "typescript",

    "html",
    "css",

    "react",
    "angular",
    "vue",

    "node",
    "nodejs",
    "express",

    "fastapi",
    "flask",
    "django",

    "sql",
    "mysql",
    "postgresql",
    "mongodb",

    "docker",
    "kubernetes",

    "git",
    "github",

    "aws",
    "azure",
    "gcp",

    "linux",

    "rest",
    "rest api",

    "machine learning",
    "artificial intelligence",

    "data structures",
    "algorithms",

    "oop",

    "redis",

    "firebase"
}


def extract_skills(text):

    text = text.lower()

    found = set()

    for skill in KNOWN_SKILLS:

        if re.search(r"\b" + re.escape(skill) + r"\b", text):

            found.add(skill)

    return found


def calculate_match(resume_text, job_description):

    resume_skills = extract_skills(resume_text)

    jd_skills = extract_skills(job_description)

    matched = sorted(list(resume_skills & jd_skills))

    missing = sorted(list(jd_skills - resume_skills))

    if len(jd_skills) == 0:
        score = 0
    else:
        score = round(
            (len(matched) / len(jd_skills)) * 100,
            2
        )

    return {

        "match_score": score,

        "matched_skills": matched,

        "missing_skills": missing

    }