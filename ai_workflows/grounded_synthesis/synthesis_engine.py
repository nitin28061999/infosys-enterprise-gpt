import os
from typing import Dict, Any
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

# Import modular components
from ai_workflows.query_classification.rbac_classifier import QueryRBACClassifier
from ai_workflows.citation_builder.citation_formatter import GroundedResponseSchema, CitationContextBuilder

class EnterpriseGroundedEngine:
    def __init__(self, vector_db_path: str = None, google_api_key: str = None):
        if vector_db_path is None:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
            vector_db_path = os.path.join(project_root, "vector_db")

        api_key = google_api_key or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set your environment variable.")

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=api_key
        )

        self.vector_db = Chroma(
            persist_directory=vector_db_path,
            embedding_function=self.embeddings
        )

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.0,
            google_api_key=api_key
        ).with_structured_output(GroundedResponseSchema)

    def generate_response(self, query: str, designation: str = "Software Engineer") -> Dict[str, Any]:
        # 1. Empty / Whitespace Input Guardrail
        if not query or not query.strip():
            return {
                "answer": "Please enter a valid search query.",
                "confidence_score": 0.0,
                "citations": [],
                "recommended_action": "Type a specific question regarding internal policies or SOPs."
            }

        allowed_depts = QueryRBACClassifier.get_allowed_departments(designation)

        # 2. Perform RBAC-filtered similarity search
        results_with_scores = self.vector_db.similarity_search_with_score(
            query=query,
            k=5,
            filter={"department": {"$in": allowed_depts}}
        )

        # 3. Explicit Access Denied Fallback if zero permitted documents match
        if not results_with_scores:
            return {
                "answer": f"Access Denied: As a '{designation}', you do not have security clearance to view documentation for this domain.",
                "confidence_score": 0.0,
                "citations": [],
                "recommended_action": "Contact your HR representative or IT Admin to request elevated role permissions."
            }

        valid_docs = [doc for doc, score in results_with_scores if score <= 0.85]
        if not valid_docs:
            valid_docs = [results_with_scores[0][0]]

        context_str = CitationContextBuilder.build_context_block(valid_docs)

        system_prompt = f"""You are an elite Enterprise AI Knowledge Assistant.
SYSTEM MANDATES:
1. Grounding Rule: Answer the query using ONLY the verified context snippets provided below.
2. Zero Extrapolation: Do NOT bring in external memory, general internet knowledge, or assumptions.
3. Security Boundary: If the provided document snippets do not contain direct facts to answer the question, state: "Access Denied / Insufficient domain context available for your role clearance."
4. Citations: Map citations accurately to the document metadata provided in context.

CONTEXT SNIPPETS:
{context_str}

EMPLOYEE QUERY: {query}
"""
        response = self.llm.invoke(system_prompt)
        return response.model_dump()
