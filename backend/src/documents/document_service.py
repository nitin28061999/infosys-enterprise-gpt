from fastapi import Depends, HTTPException, UploadFile # type: ignore
from sqlalchemy.orm import Session

from config.db_config import get_db
from config.env_config import envConfig
from config.arq_config import ArqService

from services.uploadDocument_service import supabase_upload

from services.background_service import index_document

from .document_model import Document, DocumentStatus
from .document_schema import UpdateDocument

from src.users.user_model import Role

from langchain_chroma import Chroma # pyright: ignore[reportMissingImports]
from langchain_google_genai import GoogleGenerativeAIEmbeddings # pyright: ignore[reportMissingImports]


class DocumentService:

    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
        self.arq_service = ArqService()

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=envConfig.GEMINI_API_KEY,
        )

    # ============================================================
    # UPLOAD DOCUMENT
    # ============================================================

    # ADMIN:
    #   Can upload documents for any department.
    #
    # KNOWLEDGE_OWNER:
    #   Can upload documents only for their own department.
    #
    # EMPLOYEE:
    #   Cannot upload.

    async def upload_file(
        self,
        data,
        file: UploadFile,
        owner_id: int,
        departmentRequired: str,
        departmentAsked: str,
        role: str,
    ):

        # --------------------------------------------------------
        # Authorization
        # --------------------------------------------------------

        if role != Role.ADMIN and departmentRequired != departmentAsked:
            raise HTTPException(
                status_code=403,
                detail="You are not authorized to upload another department document",
            )

        # --------------------------------------------------------
        # Upload file to Supabase
        # --------------------------------------------------------

        file_path = await supabase_upload(file)

        # --------------------------------------------------------
        # Create database document
        # --------------------------------------------------------

        document_data = data.model_dump()

        document_data["file_path"] = file_path

        document = Document(
            **document_data,
            department=departmentAsked,
            owner_id=owner_id,
        )

        self.db.add(document)

        # Save document first so that it gets an ID
        self.db.commit()

        # Refresh so document.id is available
        self.db.refresh(document)
        try:
            document.status = DocumentStatus.QUEUED
            self.db.commit()


            await self.arq_service.enqueue_index_job(document.id)


            self.db.refresh(document)


        except Exception:
            document.status = DocumentStatus.FAILED
            self.db.commit()
            raise

        return document

    # ============================================================
    # GET ALL DOCUMENTS
    # ============================================================

    def get_documents(self):

        return (
            self.db
            .query(Document)
            .order_by(Document.uploaded_at.desc())
            .all()
        )

    # ============================================================
    # GET SINGLE DOCUMENT
    # ============================================================

    def get_document(self, id: int):
        # sourcery skip: reintroduce-else, swap-if-else-branches, use-named-expression

        document = (
            self.db
            .query(Document)
            .filter(Document.id == id)
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found",
            )

        return document

    # ============================================================
    # UPDATE DOCUMENT
    # ============================================================

    async def update_document(
        self,
        id: int,
        data: UpdateDocument,
        file: UploadFile,
    ):

        document = (
            self.db
            .query(Document)
            .filter(Document.id == id)
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found",
            )

        try:

            # ----------------------------------------------------
            # Replace file if a new file was uploaded
            # ----------------------------------------------------

            if file:

                file_path = await supabase_upload(file)

                document.file_path = file_path

            # ----------------------------------------------------
            # Update other fields
            # ----------------------------------------------------

            document_data = data.model_dump(
                exclude_unset=True,
                exclude_none=True,
            )

            for key, val in document_data.items():
                setattr(document, key, val)

            self.db.commit()

            self.db.refresh(document)

        except Exception:

            self.db.rollback()

            raise

        return document

    # ============================================================
    # DELETE DOCUMENT
    # ============================================================

    def delete_document(self, id: int):

        document = (
            self.db
            .query(Document)
            .filter(Document.id == id)
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found.",
            )

        self.db.delete(document)

        self.db.commit()

        return

    # ============================================================
    # MANUAL INDEXING
    # ============================================================

    async def indexing(self, id: int):

        document = (
            self.db
            .query(Document)
            .filter(Document.id == id)
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found",
            )

        if document.status == DocumentStatus.PROCESSING:

            raise HTTPException(
                status_code=409,
                detail=f"Document is already {document.status.lower()}.",
            )

        try:

            # ----------------------------------------------------
            # Mark document as queued
            # ----------------------------------------------------

            document.status = DocumentStatus.QUEUED

            self.db.commit()

            # ----------------------------------------------------
            # Add indexing job to ARQ queue
            # ----------------------------------------------------

            await self.arq_service.enqueue_index_job(document.id)

            return {
                "message": "Indexing job queued successfully"
            }

        except Exception as e:

            print(e)

            document.status = DocumentStatus.FAILED

            self.db.commit()

            raise

    # ============================================================
    # INGESTION STATUS
    # ============================================================

    def ingestion_status(self, document_id: int):
        # sourcery skip: reintroduce-else, swap-if-else-branches, use-named-expression

        document = (
            self.db
            .query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found",
            )

        return document.status

    # ============================================================
    # CHROMA DATABASE
    # ============================================================

    def get_chromaDB(self):
        # sourcery skip: inline-immediately-returned-variable

        vector_store = Chroma(
            persist_directory="./genAI/vector_db",
            embedding_function=self.embeddings,
            collection_name="documents",
        )

        data = vector_store.get()

        return data