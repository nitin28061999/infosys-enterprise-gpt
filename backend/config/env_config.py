from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve absolute path to the .env file located in the backend root directory
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"


class EnvConfig(BaseSettings):

    # database
    DATABASE_URL: str 

    # jwt
    SECRET_KEY: str 
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # supabase 
    SUPABASE_URL: str 
    SUPABASE_KEY: str 
    SUPABASE_BUCKET: str

    # background job
    REDIS_HOST: str 
    REDIS_PORT: int 
    REDIS_LOCAL_HOST: str

    # llm 
    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )


envConfig = EnvConfig() # pyright: ignore[reportCallIssue]