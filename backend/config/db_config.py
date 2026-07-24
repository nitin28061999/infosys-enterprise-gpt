
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .env_config import envConfig

engine = create_engine(envConfig.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False )


class Base(DeclarativeBase):
    pass 


def get_db():
    db = SessionLocal()
    try:
        yield db 
    
    finally:
        db.close()

def createTable():
    Base.metadata.create_all(bind=engine)