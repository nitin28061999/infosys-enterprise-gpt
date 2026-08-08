from config.db_config import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, UploadFile, HTTPException
from services.uploadDocument_service import supabase_upload
from .document_model import Document
from .document_schema import UpdateDocument
from config.env_config import envConfig
from services.background_service import index_document
from .document_model import DocumentStatus
from config.arq_config import ArqService
import chromadb
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config.env_config import envConfig
from src.users.user_model import Role


class DocumentService:

    def __init__(self, db: Session=Depends(get_db)):
        self.db = db
        self.arq_service = ArqService()
        self.embeddings = GoogleGenerativeAIEmbeddings(
                            model="gemini-embedding-2-preview",
                            google_api_key=envConfig.GEMINI_API_KEY
                        )


# ADMIN → can upload documents for any department
# KNOWLEDGE_OWNER → can upload documents only for their own department
# EMPLOYEE → cannot upload

    async def upload_file(self, data, file: UploadFile, owner_id: int, departmentRequired: str, departmentAsked: str, role: str):

        if role != Role.ADMIN:
            if departmentRequired != departmentAsked:
                raise HTTPException(status_code=403, detail="You are not authorized to upload another department document")

               
        file_path = await supabase_upload(file)

        document_data = data.model_dump()
        document_data["file_path"] = file_path

        document = Document(**document_data, department=departmentAsked, owner_id=owner_id)
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


    async def update_document(self, id:int, data: UpdateDocument, file: UploadFile):

        document = self.db.query(Document).filter(Document.id == id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        try:
            if file:
                file_path = await supabase_upload(file)
                document.file_path = file_path

            document_data = data.model_dump(exclude_unset=True, exclude_none=True)

            for key, val in document_data.items():
                setattr(document, key, val)

            self.db.commit()
            self.db.refresh(document)

        except Exception:
            self.db.rollback()
            raise
        

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

        if document.status in [DocumentStatus.PROCESSING]:
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



    # def get_chromaDB(self):
    #     client = chromadb.PersistentClient(path="./chroma_db")
    #     collection = client.get_collection("documents")

    #     data = collection.get(
    #         include=["documents", "metadatas"]
    #     )

    #     return data


    def get_chromaDB(self):

        vector_store = Chroma(
        persist_directory="./genAI/vector_db",
        embedding_function=self.embeddings,
        collection_name="documents"
    )

        data = vector_store.get()

        return data
        

 