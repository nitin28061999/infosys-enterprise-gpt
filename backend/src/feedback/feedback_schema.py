
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from .feedback_model import RatingEnum
from src.audit.audit_model import AuditStatus


    

class FeedbackRequest(BaseModel):
    audit_id: int | None = None 
    rating: RatingEnum 
    comment: str | None = None 


class AuditInfo(BaseModel):
    question: str 
    answer: str 

class FeedbackData(BaseModel):
    id: int
    user_id: int 
    audit_id: int | None = None 
    rating: RatingEnum 
    comment: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
    


class FeedbackResponse(BaseModel):
    success: bool 
    message: str 
    data: FeedbackData    


class FeedbackListResponse(BaseModel):
    success: bool 
    message: str 
    total: int 
    page: int 
    limit: int
    data : list[FeedbackData]

class AuditInfo(BaseModel):
    question: str 
    answer: str 
    status: AuditStatus


class FeedbackDetail(FeedbackData):
    audit: AuditInfo

class FeedbackDetailResponse(BaseModel):
    success: bool 
    message: str 
    data: FeedbackDetail