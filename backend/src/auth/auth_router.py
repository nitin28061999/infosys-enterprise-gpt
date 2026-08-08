from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from .auth_schema import UserCreate, TokenResponse, signupResponse, signinResponse
from .auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", status_code=201, response_model=signupResponse)
def createEmployee(
    payload: UserCreate,
    service: AuthService = Depends()
):
    user = service.signup(payload)

    return {
        "success": True,
        "message": "Employee created successfully",
        "data": user,
    }


@router.post("/signup/admin", status_code=201, response_model=signupResponse)
def createAdmin(
    payload: UserCreate,
    service: AuthService = Depends()
):
    user = service.create_admin(payload)

    return {
        "success": True,
        "message": "Admin created successfully",
        "data": user,
    }


@router.post(
    "/signup/knowledgeOwner",
    status_code=201,
    response_model=signupResponse
)
def createKnowledgeOwner(
    payload: UserCreate,
    service: AuthService = Depends()
):
    user = service.create_knowledgeOwner(payload)

    return {
        "success": True,
        "message": "Knowledge Owner created successfully",
        "data": user,
    }


@router.post("/signin", response_model=signinResponse)
def loginUser(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(),
):
    token = service.signin(form_data)

    return {
        "success": True,
        "message": "Login successfully",
        "data": {
            "access_token": token,
            "token_type": "Bearer",
        },
    }


# Swagger OAuth2 login endpoint
@router.post(
    "/token",
    include_in_schema=False,
    response_model=TokenResponse
)
def swagger_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(),
):
    token = service.signin(form_data)

    return {
        "access_token": token,
        "token_type": "bearer",
    }