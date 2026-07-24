from config.db_config import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, UploadFile, HTTPException
from config.supabase_config import supabase_upload
from .document_model import Document
from .document_schema import UpdateDocument
import supabase
from config.env_config import envConfig


class DocumentService:

    def __init__(self, db: Session=Depends(get_db)):
        self.db = db

    async def upload_file(self, title:str, department:str, owner:str, file: UploadFile):
        
        file_path = await supabase_upload(file)

        document = Document(title=title, department=department, owner=owner, file_path=file_path, status="ACTIVE")
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


    

    def indexing(self, id):

        document = (self.db.query(Document).filter(Document.id == id).first())

        if not document:
            raise Exception("Document not found")

        file_bytes = (supabase.storage .from_(envConfig.SUPABASE_BUCKET).download(document.file_path))

        # text = extract_pdf(file_bytes)

        # chunks = chunk_text(text)

        # embeddings = embedding_model.embed_documents(chunks)

        # vector_db.add_documents(
        #     chunks,
        #     embeddings,
        #     metadata={
        #         "document_id": document.id,
        #         "department": document.department,
        #         "owner": document.owner,
        #     }
        # ) 


    def ingestion_status():
        pass 
