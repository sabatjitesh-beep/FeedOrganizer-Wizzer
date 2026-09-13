from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

# Define request body
class Post(BaseModel):
    text: str

app = FastAPI()

# Load a sentiment model (lightweight for demo)
sentiment_analyzer = pipeline("sentiment-analysis")

@app.get("/")
def root():
    return {"message": "Feed AI backend is running!"}

@app.post("/classify")
def classify_post(post: Post):
    result = sentiment_analyzer(post.text)[0]
    return {
        "label": result["label"],
        "score": result["score"]
    }
