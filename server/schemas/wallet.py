from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict

class WalletBase(BaseModel):
    name: str
    balance: Decimal = Decimal("0.0")
    currency: str = "VND"

class WalletCreate(WalletBase):
    pass

class WalletUpdate(BaseModel):
    name: Optional[str] = None
    balance: Optional[Decimal] = None
    currency: Optional[str] = None

class WalletResponse(WalletBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
