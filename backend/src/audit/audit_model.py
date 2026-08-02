from config.db_config import Base
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from enum import Enum 
from datetime import datetime, UTC
from typing import TYPE_CHECKING, Any


if TYPE_CHECKING:
    from src.users.user_model import User
    from src.feedback.feedback_model import Feedback


class AuditStatus(str, Enum):
    SUCCESS = "SUCCESS"
    NO_ANSWER = "NO_ANSWER"
    FAILED = "FAILED"




class Audit(Base):
    __tablename__="audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=True)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=True)
    retrieved_documents: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONB, nullable=True) 
    response_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[AuditStatus] = mapped_column(SQLEnum(AuditStatus), default=AuditStatus.SUCCESS, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(UTC), nullable=False)

    # relationship
    user:Mapped["User"] = relationship('User', back_populates="audit_logs")
    feedback: Mapped[list["Feedback"]] = relationship("Feedback", back_populates="audit")