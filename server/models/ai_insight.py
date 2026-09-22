import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, JSON, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from server.db.base import Base

class AIInsightsLog(Base):
    __tablename__ = "ai_insights_log"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    insight_type = Column(String(50), nullable=False)  # "OVERSPEND_WARNING", "ANOMALY_DETECTED"
    message = Column(Text, nullable=False)
    metrics_data = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="ai_insights")
