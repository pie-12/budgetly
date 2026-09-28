from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel

class CategoryBreakdownItem(BaseModel):
    name: str
    amount: Decimal
    percentage: float
    color: str
    icon: str

class AnalyticsSummaryResponse(BaseModel):
    total_balance: Decimal
    monthly_income: Decimal
    monthly_expense: Decimal
    monthly_budget: Decimal
    remaining_budget: Decimal
    category_breakdown: List[CategoryBreakdownItem]
