from fastapi import APIRouter, Depends 
from .user_schema import ApiResponse, ApiGetResponse, UserUpdate, UpdateResponse
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

@router.get('/', status_code=200, response_model=ApiGetResponse)
def get_employees(service: UserService = Depends()):
    users = service.get_users()
    return {
        "success": True,
        "message": "Users fetched successfully",
        "data": users
    }


@router.patch('/{id}', status_code=200, response_model=ApiResponse)
def update(id: int, data: UserUpdate, service: UserService = Depends()):
    user = service.update_user(id, data) 
    return {
        "success": True,
        "message": "User updated successfully. ",
        "data": user
    }


@router.delete('/{id}', status_code=200, response_model=UpdateResponse)
def delete(id: int, service: UserService = Depends()):
    service.delete_user(id)
    return {
        "success": True,
        "message": "User deleted successfully. ",
        "data": None
    }