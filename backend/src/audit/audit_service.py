from fastapi import Depends
from sqlalchemy.orm import Session 
from config.db_config import get_db
from src.audit.audit_model import Audit


class AuditService:
    def __init__(self, db: Session):
        self.db = db 


    def create(self, audit: Audit):
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(audit)
        return audit
