from pydantic import BaseModel, ConfigDict 
from .document_model import DocumentStatus
from datetime import datetime




class DocumentRequest(BaseModel):
    title: str 
    department: str 
    owner: str 


class DocumentData(DocumentRequest):
    id: int
    file_path: str
    status: DocumentStatus
    uploaded_at: datetime

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
    department: str | None = None 
    owner: str | None = None 
    status: DocumentStatus | None = None 


