from config.supabase_config import supabase
from config.env_config import envConfig
from config.db_config import SessionLocal
from src.documents.document_model import Document, DocumentStatus
import logging

logger = logging.getLogger(__name__)

  


async def index_document(ctx, id: int):


    db = SessionLocal()

    document = db.query(Document).filter(Document.id == id).first()

    if not document:
        return

    try:

        document.status = DocumentStatus.PROCESSING
        db.commit()

        file_bytes = (supabase.storage .from_(envConfig.SUPABASE_BUCKET).download(document.file_path))
    
            
        # Background Indexing (Extract → Chunk → Embed)
        
        document.status = DocumentStatus.COMPLETED
        db.commit()
            
    except Exception as e:
        logger.exception("Document indexing failed")
        document.status = DocumentStatus.FAILED
        db.commit()
        raise

    finally:
        db.close()