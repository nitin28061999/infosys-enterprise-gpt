from fastapi import APIRouter, Depends
from .retrieval_schema import QueryRequest
from .retrieval_service import QueryService


router = APIRouter(prefix='/query', tags=['Query'])


@router.post('/', status_code=200)
def retrieve_info(data: QueryRequest, service: QueryService = Depends()):

    result = service.retrieveInfo(data.question)

    return result



