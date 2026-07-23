from fastapi import APIRouter
from src.auth.auth_router import router as auth_router 
from src.users.users_router import router as user_router 
from src.documents.document_router import router as document_router

router = APIRouter(prefix='/api')

router.include_router(auth_router)
router.include_router(user_router)
router.include_router(document_router)