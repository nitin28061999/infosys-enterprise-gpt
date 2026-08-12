from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import model.main_model
from routes.main_route import router as main_router
from utils.exception_handler import register_exception_handlers


app = FastAPI()

# Do not create database tables during startup.
# This prevents Render from timing out before the API binds to $PORT.


app.add_middleware(
    CORSMiddleware,
    allow_origins # pyright: ignore[reportUndefinedVariable]
)