from pydantic import BaseModel

class ResumeRequest(BaseModel):
    resume: str
    job_description: str