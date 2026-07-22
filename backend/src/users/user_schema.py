from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: UserResponse


