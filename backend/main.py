from fastapi import FastAPI 
from config.db_config import createTable
from routes.main_route import router as main_router
from utils.exception_handler import register_exception_handlers
from fastapi.middleware.cors import CORSMiddleware
import model.main_model


app = FastAPI()

createTable()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", status_code=200)
def server_health():
    return {"server is in good health"}


app.include_router(main_router)

register_exception_handlers(app)
