
from fastapi import Depends 
from sqlalchemy.orm import Session
from config.db_config import get_db
from src.documents.document_model import Document, DocumentStatus
from src.audit.audit_model import Audit, AuditStatus
from src.feedback.feedback_model import Feedback, RatingEnum
from sqlalchemy import func



class AnalyticsService:

    def __init__(self, db: Session = Depends(get_db)): # pyright: ignore[reportArgumentType]
        self.db = db


    def metrics(self):

        # documents
        total_documents = self.db.query(Document).count()
        completed_documents = self.db.query(Document).filter(Document.status == DocumentStatus.COMPLETED).count()
        failed_documents = self.db.query(Document).filter(Document.status == DocumentStatus.FAILED).count()

        # query
        total_queries = self.db.query(Audit).count()
        successful_answers = self.db.query(Audit).filter(Audit.status == AuditStatus.SUCCESS).count()
        no_answers = self.db.query(Audit).filter(Audit.status == AuditStatus.NO_ANSWER).count()

        # feedback 
        total_feedback = self.db.query(Feedback).count()
        helpful = self.db.query(Feedback).filter(Feedback.rating == RatingEnum.HELPFUL).count()
        not_helpful = self.db.query(Feedback).filter(Feedback.rating == RatingEnum.NOT_HELPFUL).count()

        # response time 
        avg_time = self.db.query(func.avg(Audit.response_time_ms)).scalar()

        return {
                "total_documents": total_documents,
                "completed_documents": completed_documents,
                "failed_documents": failed_documents,
                "total_queries": total_queries,
                "successful_answers": successful_answers,
                "no_answer": no_answers,
                "total_feedback": total_feedback,
                "helpful_feedback": helpful,
                "not_helpful_feedback": not_helpful,
                "average_response_time": round(avg_time or 0, 2)
                }