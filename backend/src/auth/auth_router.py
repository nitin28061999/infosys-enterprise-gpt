"""Authentication API routes."""
from fastapi import APIRouter, Depends
from .auth_schema import UserCreate, UserLogin, signupResponse, signinResponse
from .auth_service import AuthService

router = APIRouter(prefix='/auth', tags=['Auth'])

@router.post('/signup', status_code=201, response_model=signupResponse)
def createEmployee(payload: UserCreate, service: AuthService = Depends()):
    """Create an employee user."""
    user = service.signup(payload)

    return {
        "success": True,
        "message": "Employee created successfully",
        "data": user,
    }


@router.post('/signup/admin', status_code=201, response_model=signupResponse)
def createAdmin(payload: UserCreate, service: AuthService = Depends()):
    """Create an admin user."""
    user = service.create_admin(payload)

    return {
        "success": True,
        "message": "Admin created successfully",
        "data": user,
    }

@router.post('/signup/knowledgeOwner', status_code=201, response_model=signupResponse)
def createKnowledgeOwner(payload: UserCreate, service: AuthService = Depends()):
    """Create a knowledge owner user."""
    user = service.create_knowledgeOwner(payload)

    return {
        "success": True,
        "message": "Knowledge Owner created successfully",
        "data": user,
    }


@router.post('/signin', status_code=200, response_model=signinResponse)
def loginUser(payload: UserLogin, service: AuthService = Depends()):
    """Authenticate a user and return a token."""
    token = service.signin(payload)

    return {
        "success": True,
        "message": "Login successfully",
        "data": {
            "access_token": token,
            "token_type": "Bearer",
        },
    }