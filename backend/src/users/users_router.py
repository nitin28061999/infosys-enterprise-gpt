from fastapi import APIRouter, Depends 
from .user_schema import ApiResponse
from .user_service import UserService
from utils.rbac_util import employee_only

router = APIRouter(prefix='/user', tags=['User'])


@router.get('/{id}', status_code=200, response_model=ApiResponse)
def getUser(id: int, service: UserService = Depends(), curr_user= Depends(employee_only)):

    print("payload", curr_user)    
    user = service.get_user(id)

    return {
        "success": True,
        "message": "User found successfully",
        "data": user
    }