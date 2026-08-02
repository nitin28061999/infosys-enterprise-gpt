from fastapi import APIRouter, Depends
from .analytics_service import AnalyticsService
from utils.rbac_util import admin_only


router = APIRouter(prefix="/analytics", tags=['Analytics'], dependencies=[Depends(admin_only)])


@router.get("/", status_code=200)
def analytics_metrics(service: AnalyticsService = Depends()):
    return service.metrics()

