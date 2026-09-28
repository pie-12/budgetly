from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict
from server.schemas.wallet import WalletResponse
from server.schemas.category import CategoryResponse

class TransactionBase(BaseModel):
    wallet_id: UUID
    category_id: Optional[UUID] = None
    amount: Decimal
    transaction_type: str  # "INCOME" or "EXPENSE"
    transaction_date: Optional[datetime] = None
    description: Optional[str] = ""
    input_method: Optional[str] = "MANUAL"
    ai_confidence_score: Optional[float] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: UUID
    created_at: datetime
    wallet_name: Optional[str] = None
    category_name: Optional[str] = None
    category_icon: Optional[str] = None
    category_color: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
