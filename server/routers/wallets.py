import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.db.session import get_db
from server.models.wallet import Wallet
from server.models.user import User
from server.core.deps import get_current_user
from server.schemas.wallet import WalletCreate, WalletResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/wallets", tags=["Wallets"])

@router.get("", response_model=APIResponse[List[WalletResponse]])
def get_wallets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    wallets = db.query(Wallet).filter(Wallet.user_id == current_user.id).all()
    return APIResponse(
        data=wallets,
        message="Wallets retrieved successfully"
    )

@router.post("", response_model=APIResponse[WalletResponse], status_code=status.HTTP_201_CREATED)
def create_wallet(
    payload: WalletCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_wallet = Wallet(
        id=uuid.uuid4(),
        user_id=current_user.id,
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
def delete_wallet(
    wallet_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    wallet = db.query(Wallet).filter(
        Wallet.id == wallet_id,
        Wallet.user_id == current_user.id
    ).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    db.delete(wallet)
    db.commit()
    return APIResponse(
        data={"deleted_id": str(wallet_id)},
        message="Wallet deleted successfully"
    )
