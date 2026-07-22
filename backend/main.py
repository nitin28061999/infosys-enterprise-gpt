from fastapi import FastAPI 
from config.db_config import createTable
from routes.main_route import router as main_router
from utils.exception_handler import register_exception_handlers

app = FastAPI()

createTable()


app.include_router(main_router)

register_exception_handlers(app)
