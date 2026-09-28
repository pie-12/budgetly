from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict

class BudgetBase(BaseModel):
    category_id: UUID
    amount_limit: Decimal
    month_year: str  # "YYYY-MM"

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: UUID
    user_id: UUID
    category_name: Optional[str] = None
    category_icon: Optional[str] = None
    category_color: Optional[str] = None
    spent_amount: Optional[Decimal] = Decimal("0.0")
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
