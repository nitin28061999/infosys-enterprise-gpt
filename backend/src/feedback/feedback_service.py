from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException 
from config.db_config import get_db
from .feedback_model import Feedback
from .feedback_schema import FeedbackRequest
from sqlalchemy.exc import SQLAlchemyError
from config.logger_config import logger



class FeedbackService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db


    def save_feedback(self, data: FeedbackRequest, curr_user):

        try:
            feed = Feedback(**data.model_dump(), user_id=curr_user["id"])

            self.db.add(feed)
            self.db.commit()
            self.db.refresh(feed)

            return feed

        except SQLAlchemyError as e:
            self.db.rollback()
            logger.exception("Failed to save feedback")
            raise HTTPException(status_code=500, detail="Failed to save feedback.")