from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Thao tác thành công"

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class APIErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
