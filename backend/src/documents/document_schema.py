from pydantic import BaseModel, ConfigDict 
from .document_model import DocumentStatus, DocumentType, Confidentiality, AccessScope
from datetime import datetime
from fastapi import Form



class DocumentRequest(BaseModel):
    title: str 
    document_type: DocumentType
    confidentiality: Confidentiality
    access_scope: AccessScope
    source_system: str | None = None

    @classmethod
    def as_form(
        cls,
        title: str = Form(...),
        document_type: DocumentType = Form(...),
        confidentiality: Confidentiality = Form(...),
        access_scope: AccessScope = Form(...),
        source_system: str | None = Form(None),
    ) -> "DocumentRequest":
        return cls(
            title=title,
            document_type=document_type,
            confidentiality=confidentiality,
            access_scope=access_scope,
            source_system=source_system,
        )


class DocumentData(DocumentRequest):
    id: int
    file_path: str
    status: DocumentStatus
    department: str
    owner_id: int
    uploaded_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ApiResponse(BaseModel):
    success: bool 
    message: str 
    data: DocumentData | None = None

class ListResponse(BaseModel):
    success: bool 
    message: str 
    data: list[DocumentData]

class UpdateDocument(BaseModel):
    title : str | None = None 
    document_type: DocumentType | None = None
    confidentiality: Confidentiality | None = None
    access_scope: AccessScope | None = None
    source_system: str | None = None

    @classmethod
    def as_form(
        cls,
        title: str | None = Form(None),
        document_type: DocumentType | None = Form(None),
        confidentiality: Confidentiality | None = Form(None),
        access_scope: AccessScope | None = Form(None),
        source_system: str | None = Form(None),
    ):
        return cls(
            title=title,
            document_type=document_type,
            confidentiality=confidentiality,
            access_scope=access_scope,
            source_system=source_system,
        )

    

class IngestionData(BaseModel):
    document_id: int
    status: str
    
class IngestionResponse(BaseModel):
    success: bool 
    message: str 
    data: IngestionData
