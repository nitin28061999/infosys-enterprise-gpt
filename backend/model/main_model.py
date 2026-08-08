from src.audit.audit_model import Audit 
from src.feedback.feedback_model import Feedback 
from src.users.user_model import User
from src.documents.document_model import Document
from config.db_config import Base

print("========== SQLALCHEMY MODELS ==========")
print(Base.metadata.tables.keys())
print("=======================================")