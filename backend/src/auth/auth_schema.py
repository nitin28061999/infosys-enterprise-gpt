from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from src.users.user_model import Department


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr 
    department: Department


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr 
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    department: Department | None = None


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"

class ApiResponse(BaseModel):
    success: bool
    message: str

class signupResponse(ApiResponse):
    data: UserResponse

class signinResponse(ApiResponse):
    data: TokenResponse