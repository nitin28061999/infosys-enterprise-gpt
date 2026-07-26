from fastapi import Depends
from sqlalchemy.orm import Session
from config.db_config import get_db
from services.indexing_service import EmbeddingService
import chromadb


class QueryService:
    def __init__(self, db : Session = Depends(get_db)):
        self.db = db 
        self.embedding = EmbeddingService()
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.client.get_or_create_collection(name="documents")


    def retrieveInfo(self, question: str):

        query_embedding = self.embedding.create_query_embedding([question])

        result = self.collection.query(
            query_embeddings=query_embedding.tolist(),
            n_results=5
        )

        return result


    