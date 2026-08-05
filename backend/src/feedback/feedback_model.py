from config.db_config import Base 
from sqlalchemy import String, Integer, ForeignKey, Text, Enum as SQLEnum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum
from datetime import datetime
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from src.users.user_model import User 
    from src.audit.audit_model import Audit

class RatingEnum(str, Enum):
    HELPFUL="HELPFUL"
    NOT_HELPFUL="NOT_HELPFUL"



class Feedback(Base):
    __tablename__="feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True) 
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    audit_id: Mapped[int] = mapped_column(Integer, ForeignKey('audit_logs.id', ondelete="CASCADE"), nullable=False, index=True)
    rating: Mapped[RatingEnum] = mapped_column(SQLEnum(RatingEnum), nullable=False)
    comment : Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at : Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # relationships 
    user: Mapped["User"] = relationship("User", back_populates="feedback")
    audit: Mapped["Audit"] = relationship("Audit", back_populates="feedback")
