from fastapi import APIRouter, UploadFile, Depends, File, Form
from .document_schema import DocumentRequest, ListResponse , ApiResponse, UpdateDocument, IngestionResponse
from .document_service import DocumentService
from utils.rbac_util import admin_only, knowledge_owner_only

router = APIRouter(prefix='/document', tags=['Documents'], dependencies=[Depends(knowledge_owner_only)])


@router.post('/', status_code=201, response_model=ApiResponse)
async def upload(
    data: DocumentRequest = Depends(DocumentRequest.as_form),
    department= Form(...),
    file: UploadFile = File(...),
    service: DocumentService = Depends(),
    curr_user: dict = Depends(knowledge_owner_only)
    ):

    document = await service.upload_file(data, file, curr_user["id"], curr_user['department'], department, curr_user['role'])
    return {"success": True, "message": "File uploaded successfully", "data": document}


@router.get('/', status_code=200, response_model=ListResponse)
def get_all(service: DocumentService = Depends()):
    resp = service.get_documents()
    return {"success": True, "message": "Dcouments fetched successfully", "data": resp}


@router.get('/vector-db', status_code=200)
def vector_db(service: DocumentService = Depends()):
    return service.get_chromaDB()


@router.get('/{id}', status_code=200, response_model=ApiResponse)
def get_one( id:int, service: DocumentService = Depends()):
    document = service.get_document(id)

    return {"success": True, "message": "Document fetched successfully", "data": document} 


@router.patch('/{id}', status_code=200, response_model=ApiResponse)
async def update(id:int, 
           payload: UpdateDocument = Depends(UpdateDocument.as_form),
           file: UploadFile | None = File(None), 
           service:DocumentService = Depends()):
    document =  await service.update_document(id, payload, file)

    return {"success": True, "message": "Document Updated successfully", "data": document}


@router.delete('/{id}', status_code=200, response_model=ApiResponse, dependencies=[Depends(admin_only)])
def delete(id:int, service: DocumentService = Depends()):
    result = service.delete_document(id)

    return {"success": True, "message": "Document deleted successfully.", "data": None}


@router.post('/indexing/{id}', status_code=202, response_model=ApiResponse)
async def document_indexing(id: int, service: DocumentService = Depends()):

    mssg = await service.indexing(id)

    return {
        "success": True,
        "message": mssg['message'],
        "data": None
    }

@router.get("/ingestion-status/{document_id}", status_code=200, response_model=IngestionResponse)
def ingestion_status(document_id: int, service: DocumentService = Depends()):
    status = service.ingestion_status(document_id)

    return {
        "success": True,
        "message": "Status fetched successfully",
        "data": {
            "document_id": document_id,
            "status": status
        }
    }


