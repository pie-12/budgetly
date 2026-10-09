from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel

class SmartInputRequest(BaseModel):
    raw_text: str

class SmartInputResponse(BaseModel):
    description: str
    amount: Decimal
    category: str
    type: str  # "INCOME" or "EXPENSE"
    suggested_wallet: Optional[str] = "Cash Wallet"
    confidence_score: float

class OCRScanResponse(BaseModel):
    merchant: Optional[str] = None
    date: Optional[str] = None
    total_amount: Decimal
    confidence_score: float
    items: Optional[List[str]] = []
    suggested_category: str = "Food & Dining"

class AIForecastResponse(BaseModel):
    forecast_total: Decimal
    budget_limit: Decimal
    is_at_risk: bool
    risk_percentage: float
    message: str
