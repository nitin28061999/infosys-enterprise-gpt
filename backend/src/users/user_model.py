from enum import Enum as enum
from sqlalchemy import Column, String, Integer, Enum, Boolean 
from sqlalchemy.orm import Mapped, mapped_column, relationship
from config.db_config import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.audit.audit_model import Audit
    from src.feedback.feedback_model import Feedback


class Role(str, enum):
    ADMIN = "ADMIN"
    KNOWLEDGE_OWNER = "KNOWLEDGE_OWNER"
    EMPLOYEE = "EMPLOYEE"


class Department(str, enum):
    HR = "HR"
    ENGINEERING = "ENGINEERING"
    FINANCE = "FINANCE"
    SALES = "SALES"
    MARKETING = "MARKETING"
    LEGAL = "LEGAL"
    OPERATIONS = "OPERATIONS"
    IT = "IT"
    PROCUREMENT = "PROCUREMENT"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.EMPLOYEE, nullable=False)
    department: Mapped[Department] = mapped_column(Enum(Department), nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # ADD THIS FIELD
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    audit_logs: Mapped[list["Audit"]] = relationship(
        "Audit", back_populates="user"
    )
    feedback: Mapped[list["Feedback"]] = relationship(
        "Feedback", back_populates="user"
    )