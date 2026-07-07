from fastapi import FastAPI

# Create the FastAPI application
app = FastAPI()

# Home route
@app.get("/")
def home():
    return {"message": "Welcome to AI Resume Reviewer 🚀"}