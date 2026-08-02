
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from .feedback_model import RatingEnum


    

class FeedbackRequest(BaseModel):
    audit_id: int | None = None 
    rating: RatingEnum 
    comment: str | None = None 



class FeedbackData(BaseModel):
    id: int
    user_id: int 
    audit_id: int | None = None 
    rating: RatingEnum 
    comment: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
    

class FeedbackResponse(BaseModel):
    success: bool 
    message: str 
    data: FeedbackData    
