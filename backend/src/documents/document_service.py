from config.db_config import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, UploadFile, HTTPException
from config.supabase_config import supabase_upload
from .document_model import Document
from .document_schema import UpdateDocument
from config.env_config import envConfig
from services.background_service import index_document
from .document_model import DocumentStatus
from config.arq_config import ArqService





class DocumentService:

    def __init__(self, db: Session=Depends(get_db)):
        self.db = db
        self.arq_service = ArqService()

    async def upload_file(self, title:str, department:str, owner:str, file: UploadFile):
        
        file_path = await supabase_upload(file)

        document = Document(title=title, department=department, owner=owner, file_path=file_path)
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)

        return document



    

    def get_documents(self):

        return self.db.query(Document).order_by(Document.uploaded_at.desc()).all()


    def get_document(self, id):

        document = self.db.query(Document).filter(Document.id == id).first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        return document


    def update_document(self, id:int, data: UpdateDocument):

        document = self.db.query(Document).filter(Document.id == id).first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        for key, val in data.model_dump(exclude_unset=True).items():
            setattr(document, key, val)

        self.db.commit()
        self.db.refresh(document)
        return document



    def delete_document(self, id : int):

        document = self.db.query(Document).filter(Document.id == id).first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found.")

        self.db.delete(document)
        self.db.commit()

        return


    

    async def indexing(self, id):

        document = (self.db.query(Document).filter(Document.id == id).first())

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        if document.status in [DocumentStatus.QUEUED, DocumentStatus.PROCESSING]:
            raise HTTPException(status_code=409, detail=f"Document is already {document.status.lower()}.")
        
        try:

            document.status = DocumentStatus.QUEUED
            self.db.commit()

            # Publish job
            await self.arq_service.enqueue_index_job(document.id)

            return { "message": "Indexing job queued successfully" }

        except Exception as e: 
            print(e)
            document.status = DocumentStatus.FAILED
            self.db.commit()
            raise


    def ingestion_status(self, document_id: int):

        document = self.db.query(Document).filter(Document.id == document_id).first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        return document.status
