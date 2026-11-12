import uuid
from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.db.session import get_db
from server.models.user import User
from server.models.wallet import Wallet
from server.models.category import Category
from server.models.transaction import Transaction
from server.core.security import hash_password
from server.core.deps import get_current_admin_user, ADMIN_EMAILS
from server.schemas.users import (
    AdminUserItem,
    CreateUserByAdminRequest,
    UpdateUserByAdminRequest,
)
from server.schemas.common import APIResponse

router = APIRouter(prefix="/users", tags=["Users Management"])

STARTER_CATEGORIES = [
    {"name": "Food & Dining", "type": "EXPENSE", "icon": "🍲", "color": "bg-amber-500"},
    {"name": "Transportation", "type": "EXPENSE", "icon": "🚗", "color": "bg-blue-500"},
    {"name": "Shopping", "type": "EXPENSE", "icon": "🛍️", "color": "bg-purple-500"},
    {"name": "Utilities", "type": "EXPENSE", "icon": "⚡", "color": "bg-teal-500"},
    {"name": "Entertainment", "type": "EXPENSE", "icon": "🎬", "color": "bg-rose-500"},
    {"name": "Salary & Income", "type": "INCOME", "icon": "💵", "color": "bg-emerald-500"},
]


def determine_role(email: str) -> str:
    clean = email.lower().strip()
    if clean == "admin@budgetly.app":
        return "Super Admin"
    if clean == "demo@budgetly.app":
        return "Admin"
    return "Free User"


@router.get("", response_model=APIResponse[List[AdminUserItem]])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Fetch all users directly from the PostgreSQL database with aggregated stats."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    result: List[AdminUserItem] = []

    for u in users:
        # Calculate total wallet balance
        total_balance = sum((w.balance or Decimal("0")) for w in u.wallets) if u.wallets else Decimal("0")
        
        # Count transactions across user wallets
        wallet_ids = [w.id for w in u.wallets]
        tx_count = 0
        if wallet_ids:
            tx_count = db.query(Transaction).filter(Transaction.wallet_id.in_(wallet_ids)).count()

        result.append(
            AdminUserItem(
                id=str(u.id),
                email=u.email,
                full_name=u.full_name or u.email.split("@")[0],
                role=determine_role(u.email),
                status="Active",
                balance=float(total_balance),
                wallets_count=len(u.wallets),
                transactions_count=tx_count,
                joined_date=u.created_at.strftime("%Y-%m-%d"),
                created_at=u.created_at,
            )
        )

    return APIResponse(
        data=result,
        message=f"Retrieved {len(result)} users from PostgreSQL database successfully."
    )


@router.post("", response_model=APIResponse[AdminUserItem], status_code=status.HTTP_201_CREATED)
def create_user_by_admin(
    req: CreateUserByAdminRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Create a new user directly in PostgreSQL with default wallet and categories."""
    email_clean = str(req.email).lower().strip()

    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists in the database."
        )

    new_user = User(
        id=uuid.uuid4(),
        email=email_clean,
        password_hash=hash_password(req.password),
        full_name=req.full_name.strip() if req.full_name else email_clean.split("@")[0]
    )
    db.add(new_user)
    db.flush()

    # Seed starter categories
    for cat in STARTER_CATEGORIES:
        db.add(Category(
            id=uuid.uuid4(),
            user_id=new_user.id,
            name=cat["name"],
            type=cat["type"],
            icon=cat["icon"],
            color=cat["color"],
            is_default=True
        ))

    # Seed initial Cash wallet
    db.add(Wallet(
        id=uuid.uuid4(),
        user_id=new_user.id,
        name="Cash Wallet",
        balance=Decimal("0"),
        currency="VND"
    ))

    db.commit()
    db.refresh(new_user)

    item = AdminUserItem(
        id=str(new_user.id),
        email=new_user.email,
        full_name=new_user.full_name,
        role=determine_role(new_user.email) if not req.role else req.role,
        status="Active",
        balance=0.0,
        wallets_count=1,
        transactions_count=0,
        joined_date=new_user.created_at.strftime("%Y-%m-%d"),
        created_at=new_user.created_at,
    )

    return APIResponse(
        data=item,
        message="User created successfully in PostgreSQL."
    )


@router.put("/{user_id}", response_model=APIResponse[AdminUserItem])
def update_user_by_admin(
    user_id: str,
    req: UpdateUserByAdminRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Update user information (e.g. name, password) in PostgreSQL."""
    try:
        u_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")

    target_user = db.query(User).filter(User.id == u_uuid).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if req.full_name is not None:
        target_user.full_name = req.full_name.strip()
    if req.password:
        target_user.password_hash = hash_password(req.password)

    db.commit()
    db.refresh(target_user)

    total_balance = sum((w.balance or Decimal("0")) for w in target_user.wallets) if target_user.wallets else Decimal("0")
    wallet_ids = [w.id for w in target_user.wallets]
    tx_count = 0
    if wallet_ids:
        tx_count = db.query(Transaction).filter(Transaction.wallet_id.in_(wallet_ids)).count()

    item = AdminUserItem(
        id=str(target_user.id),
        email=target_user.email,
        full_name=target_user.full_name,
        role=determine_role(target_user.email) if not req.role else req.role,
        status="Active",
        balance=float(total_balance),
        wallets_count=len(target_user.wallets),
        transactions_count=tx_count,
        joined_date=target_user.created_at.strftime("%Y-%m-%d"),
        created_at=target_user.created_at,
    )

    return APIResponse(
        data=item,
        message="User updated successfully."
    )


@router.delete("/{user_id}", response_model=APIResponse[dict])
def delete_user_by_admin(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Delete a user account and all associated records from PostgreSQL."""
    try:
        u_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")

    target_user = db.query(User).filter(User.id == u_uuid).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Protection: Do not allow deleting system administrators
    if target_user.email.lower().strip() in ADMIN_EMAILS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="System administrator accounts (Admin/Demo) cannot be deleted."
        )

    db.delete(target_user)
    db.commit()

    return APIResponse(
        data={"deleted_id": user_id},
        message=f"User {target_user.email} deleted successfully."
    )
