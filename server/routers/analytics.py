from decimal import Decimal
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.db.session import get_db
from server.models.wallet import Wallet
from server.models.transaction import Transaction
from server.models.budget import Budget
from server.models.category import Category
from server.schemas.analytics import AnalyticsSummaryResponse, CategoryBreakdownItem
from server.schemas.common import APIResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=APIResponse[AnalyticsSummaryResponse])
def get_analytics_summary(db: Session = Depends(get_db)):
    # Total Balance
    total_balance = db.query(func.coalesce(func.sum(Wallet.balance), 0)).scalar()

    # Monthly Income & Expense
    monthly_income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.transaction_type == "INCOME"
    ).scalar()

    monthly_expense = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.transaction_type == "EXPENSE"
    ).scalar()

    # Monthly Budget
    current_month = datetime.utcnow().strftime("%Y-%m")
    monthly_budget = db.query(func.coalesce(func.sum(Budget.amount_limit), Decimal("15000000"))).filter(
        Budget.month_year == current_month
    ).scalar()

    remaining_budget = max(Decimal(str(monthly_budget)) - Decimal(str(monthly_expense)), Decimal("0"))

    # Category Breakdown
    cat_breakdown_raw = db.query(
        Category.name,
        Category.icon,
        Category.color,
        func.sum(Transaction.amount).label("total")
    ).join(Transaction, Transaction.category_id == Category.id)\
     .filter(Transaction.transaction_type == "EXPENSE")\
     .group_by(Category.name, Category.icon, Category.color).all()

    breakdown_items = []
    total_exp = float(monthly_expense) if float(monthly_expense) > 0 else 1.0

    for item in cat_breakdown_raw:
        item_amount = float(item.total)
        percentage = round((item_amount / total_exp) * 100, 1)
        breakdown_items.append(
            CategoryBreakdownItem(
                name=item.name,
                amount=Decimal(str(item.total)),
                percentage=percentage,
                color=item.color or "bg-blue-500",
                icon=item.icon or "📦"
            )
        )

    breakdown_items.sort(key=lambda x: x.amount, reverse=True)

    summary_data = AnalyticsSummaryResponse(
        total_balance=Decimal(str(total_balance)),
        monthly_income=Decimal(str(monthly_income)),
        monthly_expense=Decimal(str(monthly_expense)),
        monthly_budget=Decimal(str(monthly_budget)),
        remaining_budget=Decimal(str(remaining_budget)),
        category_breakdown=breakdown_items
    )

    return APIResponse(
        data=summary_data,
        message="Financial analytics summary retrieved successfully"
    )
