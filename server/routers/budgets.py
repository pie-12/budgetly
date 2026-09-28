import uuid
from decimal import Decimal
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from server.db.session import get_db
from server.models.budget import Budget
from server.models.transaction import Transaction
from server.models.category import Category
from server.models.user import User
from server.schemas.budget import BudgetCreate, BudgetResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/budgets", tags=["Budgets"])

@router.get("", response_model=APIResponse[List[BudgetResponse]])
def get_budgets(month: str = Query(None), db: Session = Depends(get_db)):
    if not month:
        month = datetime.utcnow().strftime("%Y-%m")

    budgets = db.query(Budget).options(joinedload(Budget.category)).filter(Budget.month_year == month).all()

    result = []
    for b in budgets:
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
            Transaction.category_id == b.category_id,
            Transaction.transaction_type == "EXPENSE"
        ).scalar()

        result.append(
            BudgetResponse(
                id=b.id,
                user_id=b.user_id,
                category_id=b.category_id,
                amount_limit=b.amount_limit,
                month_year=b.month_year,
                category_name=b.category.name if b.category else "Category",
                category_icon=b.category.icon if b.category else "💰",
                category_color=b.category.color if b.category else "bg-blue-500",
                spent_amount=Decimal(str(spent)),
                created_at=b.created_at
            )
        )

    return APIResponse(
        data=result,
        message="Budgets retrieved successfully"
    )

@router.post("", response_model=APIResponse[BudgetResponse], status_code=status.HTTP_201_CREATED)
def create_or_update_budget(payload: BudgetCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@budgetly.app").first()
    if not user:
        raise HTTPException(status_code=400, detail="Demo user does not exist")

    existing = db.query(Budget).filter(
        Budget.category_id == payload.category_id,
        Budget.month_year == payload.month_year
    ).first()

    if existing:
        existing.amount_limit = payload.amount_limit
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        new_b = Budget(
            id=uuid.uuid4(),
            user_id=user.id,
            category_id=payload.category_id,
            amount_limit=payload.amount_limit,
            month_year=payload.month_year
        )
        db.add(new_b)
        db.commit()
        db.refresh(new_b)
        target = new_b

    category = db.query(Category).filter(Category.id == target.category_id).first()
    return APIResponse(
        data=BudgetResponse(
            id=target.id,
            user_id=target.user_id,
            category_id=target.category_id,
            amount_limit=target.amount_limit,
            month_year=target.month_year,
            category_name=category.name if category else "Category",
            category_icon=category.icon if category else "💰",
            category_color=category.color if category else "bg-blue-500",
            spent_amount=Decimal("0.0"),
            created_at=target.created_at
        ),
        message="Budget configured successfully"
    )
