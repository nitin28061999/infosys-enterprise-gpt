from enum import Enum as enum
from sqlalchemy import Column, String, Integer, Enum 
from sqlalchemy.orm import Mapped, mapped_column 
from config.db_config import Base 


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
    __tablename__= "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.EMPLOYEE, nullable=False)
    department: Mapped[Department] = mapped_column(Enum(Department), nullable=False)


