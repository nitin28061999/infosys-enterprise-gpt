from fastapi import APIRouter,Depends
from .feedback_service import FeedbackService
from .feedback_schema import FeedbackRequest, FeedbackResponse
from utils.rbac_util import employee_only


router = APIRouter(prefix="/feedback", tags=['Feedback'])

@router.post('/', status_code=201, response_model=FeedbackResponse)
def create_feedback(data: FeedbackRequest, service: FeedbackService = Depends(), curr_user = Depends(employee_only)):

    result = service.save_feedback(data, curr_user)

    return {
        "success": True,
        "message": "successfuly stored feedback",
        "data": result
    }

