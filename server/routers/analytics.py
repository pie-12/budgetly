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
from server.models.user import User
from server.core.deps import get_current_user
from server.schemas.analytics import AnalyticsSummaryResponse, CategoryBreakdownItem
from server.schemas.common import APIResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=APIResponse[AnalyticsSummaryResponse])
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total balance across the user's wallets
    total_balance = db.query(func.coalesce(func.sum(Wallet.balance), 0)).filter(
        Wallet.user_id == current_user.id
    ).scalar()

    user_transactions = db.query(Transaction).join(
        Wallet, Transaction.wallet_id == Wallet.id
    ).filter(Wallet.user_id == current_user.id)

    # Monthly income & expense
    monthly_income = user_transactions.filter(
        Transaction.transaction_type == "INCOME"
    ).with_entities(func.coalesce(func.sum(Transaction.amount), 0)).scalar()

    monthly_expense = user_transactions.filter(
        Transaction.transaction_type == "EXPENSE"
    ).with_entities(func.coalesce(func.sum(Transaction.amount), 0)).scalar()

    # Monthly budget
    current_month = datetime.utcnow().strftime("%Y-%m")
    monthly_budget = db.query(func.coalesce(func.sum(Budget.amount_limit), Decimal("0"))).filter(
        Budget.user_id == current_user.id,
        Budget.month_year == current_month
    ).scalar()

    remaining_budget = max(Decimal(str(monthly_budget)) - Decimal(str(monthly_expense)), Decimal("0"))

    # Category breakdown
    cat_breakdown_raw = db.query(
        Category.name,
        Category.icon,
        Category.color,
        func.sum(Transaction.amount).label("total")
    ).join(Transaction, Transaction.category_id == Category.id)\
     .join(Wallet, Transaction.wallet_id == Wallet.id)\
     .filter(
         Wallet.user_id == current_user.id,
         Transaction.transaction_type == "EXPENSE"
     )\
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
