from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import model.main_model
from routes.main_route import router as main_router
from utils.exception_handler import register_exception_handlers


app = FastAPI()


# ============================================================
# CORS CONFIGURATION
# ============================================================

allow_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://infosy-enterprise-gpt-nwrf.onrender.com",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ROUTES

app.include_router(main_router)


# EXCEPTION HANDLERS

register_exception_handlers(app)



# HEALTH CHECK

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Infosys Enterprise GPT API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }