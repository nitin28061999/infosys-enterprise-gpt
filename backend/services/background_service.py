from config.supabase_config import supabase
from config.env_config import envConfig
from config.db_config import SessionLocal
from src.documents.document_model import Document, DocumentStatus
import logging
from services.indexing_service import create_texts, create_chunks, EmbeddingService, VectorService
from genAI.ingestion_pipeline.embedding_jobs.vector_indexer import EnterprisePDFIndexer

logger = logging.getLogger(__name__)

  


class IndexingService:

     def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_service = VectorService()

     def indexingDoc(self, document, file_bytes):
         pages = create_texts(file_bytes)
         chunks = create_chunks(pages)
         embeddings = self.embedding_service.create_embedding(chunks)
         self.vector_service.store_vectorDb(document.id, chunks, embeddings, document.title, document.department, document.owner, document.access_scope, document.confidentiality)
    

indexingService = IndexingService()


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
        # indexingService.indexingDoc(document, file_bytes)
        enterprise = EnterprisePDFIndexer()
        enterprise.process_and_index(document, file_bytes)
        
        
        document.status = DocumentStatus.COMPLETED
        db.commit()
            
    except Exception as e:
        logger.exception("Document indexing failed")
        document.status = DocumentStatus.FAILED
        db.commit()
        raise

    finally:
        db.close()


    