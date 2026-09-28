import uuid
from decimal import Decimal
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from server.db.session import get_db
from server.models.transaction import Transaction
from server.models.wallet import Wallet
from server.models.category import Category
from server.schemas.transaction import TransactionCreate, TransactionResponse
from server.schemas.common import APIResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])

def map_tx_response(tx: Transaction) -> TransactionResponse:
    return TransactionResponse(
        id=tx.id,
        wallet_id=tx.wallet_id,
        category_id=tx.category_id,
        amount=tx.amount,
        transaction_type=tx.transaction_type,
        transaction_date=tx.transaction_date,
        description=tx.description or "",
        input_method=tx.input_method,
        ai_confidence_score=tx.ai_confidence_score,
        created_at=tx.created_at,
        wallet_name=tx.wallet.name if tx.wallet else "Unknown Wallet",
        category_name=tx.category.name if tx.category else "Miscellaneous",
        category_icon=tx.category.icon if tx.category else "📦",
        category_color=tx.category.color if tx.category else "bg-slate-500"
    )

@router.get("", response_model=APIResponse[List[TransactionResponse]])
def get_transactions(
    wallet_id: Optional[uuid.UUID] = Query(None),
    category_id: Optional[uuid.UUID] = Query(None),
    type: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).options(
        joinedload(Transaction.wallet),
        joinedload(Transaction.category)
    )

    if wallet_id:
        query = query.filter(Transaction.wallet_id == wallet_id)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if type:
        query = query.filter(Transaction.transaction_type == type.upper())

    transactions = query.order_by(Transaction.transaction_date.desc()).limit(limit).all()
    data = [map_tx_response(tx) for tx in transactions]

    return APIResponse(
        data=data,
        message=f"Retrieved {len(data)} transactions successfully"
    )

@router.post("", response_model=APIResponse[TransactionResponse], status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    wallet = db.query(Wallet).filter(Wallet.id == payload.wallet_id).first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Selected wallet not found")

    if payload.transaction_type.upper() == "EXPENSE":
        wallet.balance -= payload.amount
    else:
        wallet.balance += payload.amount

    new_tx = Transaction(
        id=uuid.uuid4(),
        wallet_id=payload.wallet_id,
        category_id=payload.category_id,
        amount=payload.amount,
        transaction_type=payload.transaction_type.upper(),
        transaction_date=payload.transaction_date or datetime.utcnow(),
        description=payload.description,
        input_method=payload.input_method or "MANUAL",
        ai_confidence_score=payload.ai_confidence_score
    )

    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)

    return APIResponse(
        data=map_tx_response(new_tx),
        message="Transaction created successfully"
    )

@router.delete("/{tx_id}", response_model=APIResponse[dict])
def delete_transaction(tx_id: uuid.UUID, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    wallet = db.query(Wallet).filter(Wallet.id == tx.wallet_id).first()
    if wallet:
        if tx.transaction_type == "EXPENSE":
            wallet.balance += tx.amount
        else:
            wallet.balance -= tx.amount

    db.delete(tx)
    db.commit()

    return APIResponse(
        data={"deleted_id": str(tx_id)},
        message="Transaction deleted successfully"
    )
