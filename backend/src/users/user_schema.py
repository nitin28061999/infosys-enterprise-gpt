from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from .user_model import Department


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: Department


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    department: Department | None = None


class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: UserResponse

class ApiGetResponse(ApiResponse):
    data: list[UserResponse]

class UpdateResponse(ApiResponse):
    data: None
