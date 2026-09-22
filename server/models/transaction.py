import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Column, String, Numeric, DateTime, Text, Float, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from server.db.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_id = Column(Uuid(as_uuid=True), ForeignKey("wallets.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Uuid(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    transaction_type = Column(String(20), nullable=False)  # "INCOME" or "EXPENSE"
    transaction_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    description = Column(Text, nullable=True)
    input_method = Column(String(20), default="MANUAL", nullable=False)  # "MANUAL", "NLP", "OCR"
    ai_confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    wallet = relationship("Wallet", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
