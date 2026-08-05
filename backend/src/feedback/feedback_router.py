from fastapi import APIRouter,Depends, Query
from .feedback_service import FeedbackService
from .feedback_schema import FeedbackRequest, FeedbackResponse, FeedbackListResponse, FeedbackDetailResponse
from utils.rbac_util import employee_only, admin_only


router = APIRouter(prefix="/feedback", tags=['Feedback'])

@router.post('/', status_code=201, response_model=FeedbackResponse)
def create_feedback(data: FeedbackRequest, service: FeedbackService = Depends(), curr_user = Depends(employee_only)):

    result = service.save_feedback(data, curr_user)

    return {
        "success": True,
        "message": "successfuly stored feedback",
        "data": result
    }

@router.get('/', status_code=200, response_model=FeedbackListResponse)
def get_my_feedback(service: FeedbackService = Depends(), curr_user = Depends(employee_only), page: int = Query(1, ge=1)):

    feedbacks, total = service.get_user_feedbacks(curr_user["id"], page)

    return {
        "success": True,
        "message": "Feedback list retrieved successfully.",
        "total": total,
        "page": page,
        "limit": 10,
        "data": feedbacks
    }


@router.get("/admin", status_code=200, response_model=FeedbackListResponse)
def get_all_feedbacks(service: FeedbackService = Depends(), curr_user = Depends(admin_only), page: int = Query(1, ge=1)):

    feedbacks, total = service.get_feedback_admin(page)

    return {
        "success": True,
        "message": "Feedback list retrieved successfully.",
        "total": total,
        "page": page,
        "limit": 10,
        "data": feedbacks
    }


@router.get('/details/{feedback_id}', status_code=200, response_model=FeedbackDetailResponse)
def get_feedback_details(feedback_id: int, service: FeedbackService = Depends(), curr_user = Depends(employee_only)):

    feedback = service.get_feedback_details(feedback_id, curr_user["id"])

    return {
         "success": True,
        "message": "Feedback retrieved successfully.",
        "data": feedback
    }


