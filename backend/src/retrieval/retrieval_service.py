"""Retrieval service: handles user queries, document retrieval, and auditing.

This module provides QueryService which performs vector search, builds prompts,
queries the LLM, and records audit logs.
"""

import time
from typing import Any, Dict, List, Optional

from fastapi import Depends
from sqlalchemy.orm import Session
import chromadb

from config.db_config import get_db
from config.logger_config import logger
from services.indexing_service import EmbeddingService, VectorService
from services.llm_service import GeminiService
from src.audit.audit_model import Audit, AuditStatus
from src.audit.audit_service import AuditService
from utils.prompt_util import prompt_inbuilt


class QueryService:
    """Service for querying documents and recording audit information."""

    def __init__(self, db: Session = Depends(get_db)) -> None:
        """Initialize the service with DB session and dependent services."""
        self.db = db
        self.embedding = EmbeddingService()
        self.vector_service = VectorService()
        self.gemini_service = GeminiService()
        self.audit_service = AuditService(db)

    def build_context(self, result: Dict[str, Any]) -> str:
        """Build a text context from search results for the LLM prompt.

        Args:
            result: The vector store query result containing documents and metadatas.

        Returns:
            A concatenated string containing document fragments and metadata.
        """
        context_parts: List[str] = []

        for doc, meta in zip(result["documents"][0], result["metadatas"][0]):
            part = (
                f"Document : {meta['document_name']}\n"
                f"Page : {meta['page_number']}\n\n"
                f"{doc}\n\n"
                "--------------------\n"
            )
            context_parts.append(part)

        return "\n".join(context_parts)

    def build_prompt(self, context: str, question: str) -> str:
        """Create the LLM prompt from the context and user question."""
        prompt = prompt_inbuilt(context, question)

        return prompt

    def retrieve_info(
        self, question: str, curr_user: Dict[str, Any], _permission_context: Any
    ) -> Optional[str]:
        """Retrieve an answer for the question using vector search and the LLM.

        This method also records an audit entry with retrieved documents, response
        time and status.

        Args:
            question: User question to answer.
            curr_user: Current user information (dict with at least "id").
            _permission_context: Permission/context information (unused).

        Returns:
            The generated answer string if any, otherwise None.
        """
        start = time.perf_counter()
        result: Optional[Dict[str, Any]] = None
        answer: Optional[str] = None
        status = AuditStatus.SUCCESS
        retrieved_documents: Optional[List[Dict[str, Any]]] = None

        try:
            query_embedding = self.embedding.create_query_embedding([question])

            result = self.vector_service.collection.query(
                query_embeddings=query_embedding.tolist(),
                n_results=5,
                include=["documents", "metadatas", "distances"],
            )

            if not result["documents"][0]:
                status = AuditStatus.NO_ANSWER
            else:
                context = self.build_context(result)
                prompt = self.build_prompt(context, question)
                answer = self.gemini_service.generate(prompt)

            if answer is not None and "Not Found" in answer.strip():
                status = AuditStatus.NO_ANSWER

            return answer

        except Exception as exc:  # Catch specific exceptions if possible
            status = AuditStatus.FAILED
            logger.exception("Retrieval failed: %s", exc)
            raise

        finally:
            end = time.perf_counter()
            response_time = int((end - start) * 1000)

            if result:
                retrieved_documents = []

                for i, (doc, meta, distance) in enumerate(
                    zip(result["documents"][0], result["metadatas"][0], result["distances"][0])
                ):
                    item: Dict[str, Any] = {
                        "rank": i + 1,
                        "document_id": meta.get("document_id"),
                        "owner": meta.get("owner"),
                        "document_name": meta.get("document_name"),
                        "department": meta.get("department"),
                        "page_number": meta.get("page_number"),
                        "distance": distance,
                        "chunk_index": meta.get("chunk_index"),
                        "text": doc[:300],
                    }
                    retrieved_documents.append(item)

            audit = Audit(
                user_id=curr_user.get("id"),
                question=question,
                answer=answer,
                retrieved_documents=retrieved_documents,
                response_time_ms=response_time,
                status=status,
            )

            try:
                self.audit_service.create(audit)
            except Exception as exc:
                logger.exception("Failed to save audit log: %s", exc)
