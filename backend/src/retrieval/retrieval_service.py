from fastapi import Depends
from sqlalchemy.orm import Session
from config.db_config import get_db
from services.indexing_service import EmbeddingService, VectorService
from services.llm_service import GeminiService
from src.audit.audit_model import Audit, AuditStatus
from src.audit.audit_service import AuditService
from config.logger_config import logger
from utils.prompt_util import prompt_inbuilt
import chromadb
import time




class QueryService:
    def __init__(self, db : Session = Depends(get_db)):
        self.db = db 
        self.embedding = EmbeddingService()
        self.vector_service = VectorService()
        self.gemini_service = GeminiService()
        self.audit_service = AuditService(db)


    def build_context(self, result):
        context = ""

        for doc, meta in zip( result["documents"][0], result["metadatas"][0]):
            context += f"""
                        Document : {meta['document_name']}
                        Page : {meta['page_number']}

                        {doc}

                        --------------------
          
                        """
        return context

    def build_prompt(self, context: str, question: str):

        prompt = prompt_inbuilt(context, question)

        return prompt
        

    def retrieveInfo(self, question: str, curr_user, permission_context):

        start = time.perf_counter()
        try:
            result=None 
            answer=None 
            status=AuditStatus.SUCCESS
            retrieved_documents = None

            query_embedding = self.embedding.create_query_embedding([question])

            result = self.vector_service.collection.query(
                query_embeddings=query_embedding.tolist(),
                n_results=5,
                include=["documents","metadatas","distances"]
            )

            if not result["documents"][0]:
                status=AuditStatus.NO_ANSWER
            else:
                context = self.build_context(result)
                prompt = self.build_prompt(context, question)
                answer = self.gemini_service.generate(prompt)

            if "Not Found" in answer.strip() :
                status = AuditStatus.NO_ANSWER
            return answer


        except Exception:
            status = AuditStatus.FAILED
            raise
        finally:
            end = time.perf_counter()
            response_time = int((end - start) * 1000)

            if result:
                retrieved_documents = [
                    {
                        "rank": i + 1,
                        "document_id": meta["document_id"],
                        "owner": meta["owner"],
                        "document_name": meta["document_name"],
                        "deparment": meta["department"],
                        "page_number": meta["page_number"],
                        "distance": distance,
                        "chunk_index": meta["chunk_index"],
                        "text": doc[:300]  # optional
                    }
                    for i, (doc, meta, distance) in enumerate(
                        zip(
                            result["documents"][0],
                            result["metadatas"][0],
                            result["distances"][0]
                        )
                    )
                    ]

            audit = Audit(user_id=curr_user["id"], 
                          question=question, 
                          answer=answer, 
                          retrieved_documents=retrieved_documents, 
                          response_time_ms=response_time,
                          status=status)

            try:
                self.audit_service.create(audit)
            except:
                logger.exception("Failed to save audit log")

    