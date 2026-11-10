import re
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

class AdminUserItem(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    status: str
    balance: float
    wallets_count: int
    transactions_count: int
    joined_date: str
    created_at: datetime

    class Config:
        from_attributes = True

class CreateUserByAdminRequest(BaseModel):
    email: str = Field(..., description="Email address")
    password: str = Field(..., min_length=6, description="Password, at least 6 characters")
    full_name: Optional[str] = Field(None, max_length=100)
    role: Optional[str] = Field("Free User", description="User role")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean):
            raise ValueError("Invalid email address format")
        return clean

class UpdateUserByAdminRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)
