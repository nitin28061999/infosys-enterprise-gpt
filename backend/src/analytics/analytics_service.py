"""Analytics service providing metrics."""
try:
    from fastapi import Depends
except Exception:  # pylint: disable=broad-exception-caught
    # Fallback for environments where FastAPI isn't installed (linting/static analysis).
    # Provide a minimal Depends substitute so the module can be imported.
    def Depends(dep=None):  # pylint: disable=invalid-name
        """Fallback Depends used when FastAPI is not available.

        This mirrors FastAPI's Depends signature sufficiently for static
        analysis and linting environments where fastapi isn't installed.
        """
        return dep

from sqlalchemy.orm import Session
from sqlalchemy import func

from config.db_config import get_db
from src.documents.document_model import Document, DocumentStatus
from src.audit.audit_model import Audit, AuditStatus
from src.feedback.feedback_model import Feedback, RatingEnum


class AnalyticsService:
    """Service that computes analytics metrics from the database."""

    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def metrics(self) -> dict:
        """Return a dictionary of analytics metrics."""

        # documents
        total_documents = self.db.query(Document).count()
        completed_documents = (
            self.db.query(Document)
            .filter(Document.status == DocumentStatus.COMPLETED)
            .count()
        )
        failed_documents = (
            self.db.query(Document)
            .filter(Document.status == DocumentStatus.FAILED)
            .count()
        )

        # queries
        total_queries = self.db.query(Audit).count()
        successful_answers = (
            self.db.query(Audit)
            .filter(Audit.status == AuditStatus.SUCCESS)
            .count()
        )
        no_answers = (
            self.db.query(Audit)
            .filter(Audit.status == AuditStatus.NO_ANSWER)
            .count()
        )

        # feedback
        helpful = (
            self.db.query(Feedback)
            .filter(Feedback.rating == RatingEnum.HELPFUL)
            .count()
        )
        not_helpful = (
            self.db.query(Feedback)
            .filter(Feedback.rating == RatingEnum.NOT_HELPFUL)
            .count()
        )

        # response time
        avg_time = self.db.query(func.avg(Audit.response_time_ms)).scalar()

        return {
            "total_documents": total_documents,
            "completed_documents": completed_documents,
            "failed_documents": failed_documents,
            "total_queries": total_queries,
            "successful_answers": successful_answers,
            "no_answer": no_answers,
            "helpful_feedback": helpful,
            "not_helpful_feedback": not_helpful,
            "average_response_time": round(avg_time or 0, 2),
        }
