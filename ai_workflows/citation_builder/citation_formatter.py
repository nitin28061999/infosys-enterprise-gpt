from typing import List, Any
from pydantic import BaseModel, Field


class Citation(BaseModel):
    document_name: str = Field(description="Name of the source PDF document")
    page_number: int = Field(description="Page number where the matched text was found")
    department: str = Field(description="Department domain of the document")
    matched_passage: str = Field(description="Direct snippet from the document")


class GroundedResponseSchema(BaseModel):
    answer: str = Field(description="Synthesized factual answer strictly based on context")
    confidence_score: float = Field(description="Confidence score between 0.0 and 1.0")
    citations: List[Citation] = Field(description="List of explicit citations")
    recommended_action: str = Field(description="Next actionable step for the employee")


class CitationContextBuilder:
    @staticmethod
    def build_context_block(docs: List[Any]) -> str:
        context_blocks = []
        for idx, doc in enumerate(docs, 1):
            meta = doc.metadata
            block = (
                f"[Source Document {idx}]\n"
                f"File: {meta.get('source_document', 'Unknown')}\n"
                f"Page: {meta.get('page_number', 'N/A')}\n"
                f"Department: {meta.get('department', 'General')}\n"
                f"Content Snippet: {doc.page_content.strip()}\n"
            )
            context_blocks.append(block)
        return "\n".join(context_blocks)
