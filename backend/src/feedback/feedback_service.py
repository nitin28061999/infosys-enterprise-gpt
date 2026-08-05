from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException 
from config.db_config import get_db
from .feedback_model import Feedback
from .feedback_schema import FeedbackRequest
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from src.audit.audit_model import Audit
from config.logger_config import logger



class FeedbackService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db


    def save_feedback(self, data: FeedbackRequest, curr_user):

        try:

            # Check audit exists and belongs to current user
            audit = self.db.query(Audit).filter(Audit.id == data.audit_id, Audit.user_id == curr_user["id"]).first()

            if not audit:
                raise HTTPException(status_code=404, detail="Audit not found.")


            feed = Feedback(**data.model_dump(), user_id=curr_user["id"])

            self.db.add(feed)
            self.db.commit()
            self.db.refresh(feed)

            return feed

        except SQLAlchemyError as e:
            self.db.rollback()
            logger.exception("Failed to save feedback")
            raise HTTPException(status_code=500, detail="Failed to save feedback.")


    def get_user_feedbacks(self, user_id:int, page:int):
        limit = 10
        offset = (page - 1) * limit

        total = self.db.query(Feedback).filter(Feedback.user_id == user_id).count()

        feedbacks = self.db.query(Feedback).filter(Feedback.user_id == user_id).order_by(Feedback.created_at.desc()).offset(offset).limit(limit).all()

        return feedbacks, total
    

    def get_feedback_details(self, feedback_id: int, user_id: int):

        feedback = self.db.query(Feedback).options(joinedload(Feedback.audit)).filter(Feedback.id == feedback_id, Feedback.user_id == user_id).first()

        if not feedback:
            raise HTTPException(status_code=404, detail="Feedback not found")

        return feedback

    

    def get_feedback_admin(self, page: int):

        limit = 10 
        offset = (page - 1) * limit 

        total = self.db.query(Feedback).count()
        feedbacks = self.db.query(Feedback).order_by(Feedback.created_at.desc()).offset(offset).limit(limit).all()

        return feedbacks, total