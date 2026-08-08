from config.db_config import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, func, Enum as sqlEnum, Boolean, ForeignKey
from enum import Enum
from datetime import datetime
import src.users.user_model 



class DocumentStatus(str, Enum):
    UPLOADED = "UPLOADED"
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class DocumentType(str, Enum):
    SOP = "SOP"
    HR_POLICY = "HR_POLICY"
    PROJECT_MANUAL = "PROJECT_MANUAL"
    ENGINEERING_GUIDE = "ENGINEERING_GUIDE"
    SALES_DOCUMENT = "SALES_DOCUMENT"
    OTHER = "OTHER"


class Confidentiality(str, Enum):
    PUBLIC = "PUBLIC"
    INTERNAL = "INTERNAL"
    CONFIDENTIAL = "CONFIDENTIAL"
    RESTRICTED = "RESTRICTED"


class AccessScope(str, Enum):
    ALL = "ALL"
    DEPARTMENT = "DEPARTMENT"
    OWNER = "OWNER"


class Document(Base):
    __tablename__ = "documents"
    id : Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    department : Mapped[str] = mapped_column(String(255))
    owner_id : Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), nullable=False)
    file_path : Mapped[str] = mapped_column(String(500))
    status: Mapped[DocumentStatus] = mapped_column(sqlEnum(DocumentStatus), default=DocumentStatus.UPLOADED, nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(sqlEnum(DocumentType), nullable=False)
    confidentiality: Mapped[Confidentiality] = mapped_column(sqlEnum(Confidentiality), nullable=False)
    access_scope: Mapped[AccessScope] = mapped_column(sqlEnum(AccessScope), nullable=False)
    source_system: Mapped[str | None] = mapped_column(String, nullable=True)  
    is_deleted : Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

