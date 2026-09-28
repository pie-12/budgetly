from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class CategoryBase(BaseModel):
    name: str
    type: str  # "INCOME" or "EXPENSE"
    icon: Optional[str] = "💰"
    color: Optional[str] = "bg-blue-500"
    is_default: bool = False

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: UUID
    user_id: Optional[UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
