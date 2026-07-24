
from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvConfig(BaseSettings):

    # database
    DATABASE_URL: str 

    # jwt
    SECRET_KEY: str 
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # supabase 
    SUPABASE_URL:str 
    SUPABASE_KEY: str 
    SUPABASE_BUCKET: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


envConfig = EnvConfig()