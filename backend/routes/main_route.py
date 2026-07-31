from fastapi import APIRouter
from src.auth.auth_router import router as auth_router 
from src.users.users_router import router as user_router 
from src.documents.document_router import router as document_router
from src.retrieval.retrieval_router import router as query_router
from src.feedback.feedback_router import router as feedback_router
from src.analytics.analytics_router import router as analytics_router

router = APIRouter(prefix='/api')

router.include_router(auth_router)
router.include_router(user_router)
router.include_router(document_router)
router.include_router(query_router)
router.include_router(feedback_router)
router.include_router(analytics_router)