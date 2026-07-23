from config.db_config import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, func, Enum as sqlEnum
from enum import Enum
from datetime import datetime



class DocumentStatus(str, Enum):
     ACTIVE = "ACTIVE"
     INACTIVE = "INACTIVE"

class Document(Base):
    __tablename__ = "documents"
    id : Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    department : Mapped[str] = mapped_column(String(255))
    owner : Mapped[str] = mapped_column(String(255))
    file_path : Mapped[str] = mapped_column(String(500))
    status: Mapped[DocumentStatus] = mapped_column(sqlEnum(DocumentStatus), default=DocumentStatus.ACTIVE, nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


