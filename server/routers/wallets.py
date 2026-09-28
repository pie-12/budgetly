import uuid
from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.db.session import get_db
from server.models.wallet import Wallet
from server.models.user import User
from server.schemas.wallet import WalletCreate, WalletResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/wallets", tags=["Wallets"])

def get_demo_user(db: Session) -> User:
    user = db.query(User).filter(User.email == "demo@budgetly.app").first()
    if not user:
        user = User(
            id=uuid.uuid4(),
            email="demo@budgetly.app",
            password_hash="mock",
            full_name="Nguyen Tung Lam & Le Huu Anh Tu"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("", response_model=APIResponse[List[WalletResponse]])
def get_wallets(db: Session = Depends(get_db)):
    user = get_demo_user(db)
    wallets = db.query(Wallet).filter(Wallet.user_id == user.id).all()
    return APIResponse(
        data=wallets,
        message="Wallets retrieved successfully"
    )

@router.post("", response_model=APIResponse[WalletResponse], status_code=status.HTTP_201_CREATED)
def create_wallet(payload: WalletCreate, db: Session = Depends(get_db)):
    user = get_demo_user(db)
    new_wallet = Wallet(
        id=uuid.uuid4(),
        user_id=user.id,
        name=payload.name,
        balance=payload.balance,
        currency=payload.currency
    )
    db.add(new_wallet)
    db.commit()
    db.refresh(new_wallet)
    return APIResponse(
        data=new_wallet,
        message="Wallet created successfully"
    )

@router.delete("/{wallet_id}", response_model=APIResponse[dict])
def delete_wallet(wallet_id: uuid.UUID, db: Session = Depends(get_db)):
    wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    db.delete(wallet)
    db.commit()
    return APIResponse(
        data={"deleted_id": str(wallet_id)},
        message="Wallet deleted successfully"
    )
