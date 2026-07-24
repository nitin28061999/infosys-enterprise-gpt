from fastapi import APIRouter, Form, File, UploadFile, Depends, status
from .document_schema import DocumentRequest, ListResponse , ApiResponse, UpdateDocument
from .document_service import DocumentService
from utils.rbac_util import admin_only, knowledge_owner_only

router = APIRouter(prefix='/document', tags=['Documents'], dependencies=[Depends(knowledge_owner_only)])


@router.post('/', status_code=201, response_model=ApiResponse)
async def upload(
    title: str = Form(...),
    department: str= Form(...),
    owner: str = Form(...),
    file: UploadFile = File(...),
    service: DocumentService = Depends()
    ):

    document = await service.upload_file(title=title, department=department, owner=owner, file=file)
    return {"success": True, "message": "File uploaded successfully", "data": document}


@router.get('/all', status_code=200, response_model=ListResponse)
def get_all(service: DocumentService = Depends()):
    resp = service.get_documents()
    return {"success": True, "message": "Dcouments fetched successfully", "data": resp}

@router.get('/{id}', status_code=200, response_model=ApiResponse)
def get_one( id:int, service: DocumentService = Depends()):
    document = service.get_document(id)

    return {"success": True, "message": "Document fetched successfully", "data": document} 


@router.patch('/{id}', status_code=200, response_model=ApiResponse)
def update(id:int, payload: UpdateDocument, service:DocumentService = Depends()):
    document =  service.update_document(id, payload)

    return {"success": True, "message": "Document Updated successfully", "data": document}


@router.delete('/{id}', status_code=200, response_model=ApiResponse, dependencies=[Depends(admin_only)])
def delete(id:int, service: DocumentService = Depends()):
    result = service.delete_document(id)

    return {"success": True, "message": "Document deleted successfully.", "data": None}