from fastapi import APIRouter, Depends
from .retrieval_schema import QueryRequest
from .retrieval_service import QueryService
from utils.rbac_util import employee_only
from fastapi.responses import PlainTextResponse
from utils.permission_util import permission_context_builder

router = APIRouter(prefix='/query', tags=['Query'])


@router.post('/', status_code=200)
def retrieve_info(data: QueryRequest, service: QueryService = Depends(), curr_user = Depends(employee_only)):
    print("user", curr_user)
    permission_context = permission_context_builder(curr_user)
    return service.retrieveInfo(data.question, curr_user, permission_context)




