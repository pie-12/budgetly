from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Budgetly AI Engine", version="1.0.0")

class TextPayload(BaseModel):
    description: str

@app.get("/api/v1/ai/health")
def health_check():
    return {"status": "ok", "service": "budgetly-ai-engine"}

@app.post("/api/v1/ai/categorize")
def categorize_transaction(payload: TextPayload):
    # TODO: Implement LangChain / NLP classification
    return {
        "amount": 50000, 
        "category": "Ăn uống", 
        "confidence": 0.85
    }

