from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import model.main_model
from routes.main_route import router as main_router
from utils.exception_handler import register_exception_handlers

app = FastAPI()
@app.get("/health")
def health_check():
    return {"status": "healthy"}

allow_origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main_router)

register_exception_handlers(app)