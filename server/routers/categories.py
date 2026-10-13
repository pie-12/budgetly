import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server.db.session import get_db
from server.models.category import Category
from server.models.user import User
from server.core.deps import get_current_user
from server.schemas.category import CategoryCreate, CategoryResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=APIResponse[List[CategoryResponse]])
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    categories = db.query(Category).filter(Category.user_id == current_user.id).all()
    return APIResponse(
        data=categories,
        message="Categories retrieved successfully"
    )

@router.post("", response_model=APIResponse[CategoryResponse], status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_cat = Category(
        id=uuid.uuid4(),
        user_id=current_user.id,
        name=payload.name,
        type=payload.type.upper(),
        icon=payload.icon or "🏷️",
        color=payload.color or "bg-blue-500",
        is_default=False
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return APIResponse(
        data=new_cat,
        message="Category created successfully"
    )
