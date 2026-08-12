import os
from typing import Any, Dict, Optional

from langchain_chroma import Chroma
from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings,
)

from ai_workflows.query_classification.rbac_classifier import (
    QueryRBACClassifier,
)

from ai_workflows.citation_builder.citation_formatter import (
    GroundedResponseSchema,
    CitationContextBuilder,
)


# ============================================================
# CONFIGURATION
# ============================================================

def get_google_api_key() -> str:
    """
    Get Gemini API key from environment variables.
    Supports both GEMINI_API_KEY and GOOGLE_API_KEY.
    """

    api_key = (
        os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
    )

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY or GOOGLE_API_KEY is not configured."
        )

    return api_key


def get_chroma_path() -> str:
    """
    Use the same ChromaDB directory as indexing_service.py.

    Current structure:

    project/
    ├── ai_workflows/
    └── backend/
        ├── chroma_db/
        └── services/
    """

    configured_path = os.getenv("CHROMA_DB_PATH")

    if configured_path:
        return configured_path

    # synthesis_engine.py is inside:
    # ai_workflows/grounded_synthesis/

    script_dir = os.path.dirname(
        os.path.abspath(__file__)
    )

    project_root = os.path.abspath(
        os.path.join(
            script_dir,
            "..",
            ".."
        )
    )

    chroma_path = os.path.join(
        project_root,
        "backend",
        "chroma_db"
    )

    os.makedirs(
        chroma_path,
        exist_ok=True
    )

    return chroma_path


# ============================================================
# ENTERPRISE GROUNDED ENGINE
# ============================================================

class EnterpriseGroundedEngine:

    def __init__(
        self,
        vector_db_path: Optional[str] = None,
        google_api_key: Optional[str] = None,
    ):
        """
        Initialize the Enterprise Grounded AI engine.
        """

        # ----------------------------------------------------
        # API KEY
        # ----------------------------------------------------

        api_key = (
            google_api_key
            or get_google_api_key()
        )

        # ----------------------------------------------------
        # CHROMA PATH
        # ----------------------------------------------------

        if vector_db_path is None:
            vector_db_path = get_chroma_path()

        os.makedirs(
            vector_db_path,
            exist_ok=True
        )

        print(
            f"Using ChromaDB path: {vector_db_path}"
        )

        # ----------------------------------------------------
        # GEMINI EMBEDDINGS
        # ----------------------------------------------------

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2",
            google_api_key=api_key,
        )

        # ----------------------------------------------------
        # CHROMA VECTOR DATABASE
        # ----------------------------------------------------

        self.vector_db = Chroma(
            collection_name="documents",
            persist_directory=vector_db_path,
            embedding_function=self.embeddings,
        )

        # ----------------------------------------------------
        # GEMINI LLM
        # ----------------------------------------------------

        self.llm = (
            ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                temperature=0.0,
                google_api_key=api_key,
            )
            .with_structured_output(
                GroundedResponseSchema
            )
        )

        print(
            "EnterpriseGroundedEngine initialized successfully."
        )


    # ========================================================
    # GENERATE RESPONSE
    # ========================================================

    def generate_response(
        self,
        query: str,
        designation: str = "Software Engineer",
    ) -> Dict[str, Any]:
        """
        Generate a grounded enterprise response.

        The response is restricted to documents that the
        employee's designation is allowed to access.
        """

        # ----------------------------------------------------
        # 1. EMPTY QUERY GUARDRAIL
        # ----------------------------------------------------

        if not query or not query.strip():

            return {
                "answer": (
                    "Please enter a valid search query."
                ),

                "confidence_score": 0.0,

                "citations": [],

                "recommended_action": (
                    "Type a specific question regarding "
                    "internal policies or SOPs."
                ),
            }

        query = query.strip()

        # ----------------------------------------------------
        # 2. RBAC DEPARTMENT FILTER
        # ----------------------------------------------------

        allowed_depts = (
            QueryRBACClassifier.get_allowed_departments(
                designation
            )
        )

        if not allowed_depts:

            return {
                "answer": (
                    f"Access Denied: No permitted "
                    f"departments are configured for "
                    f"the role '{designation}'."
                ),

                "confidence_score": 0.0,

                "citations": [],

                "recommended_action": (
                    "Contact your HR representative "
                    "or IT Admin."
                ),
            }

        # ----------------------------------------------------
        # 3. SEARCH VECTOR DATABASE
        # ----------------------------------------------------

        try:

            results_with_scores = (
                self.vector_db.similarity_search_with_score(
                    query=query,
                    k=5,
                    filter={
                        "department": {
                            "$in": allowed_depts
                        }
                    },
                )
            )

        except Exception as exc:

            print(
                f"Vector search error: {exc}"
            )

            return {
                "answer": (
                    "Unable to search the enterprise "
                    "knowledge base at this time."
                ),

                "confidence_score": 0.0,

                "citations": [],

                "recommended_action": (
                    "Please try again later or "
                    "contact the system administrator."
                ),
            }

        # ----------------------------------------------------
        # 4. NO RESULTS / ACCESS DENIED
        # ----------------------------------------------------

        if not results_with_scores:

            return {
                "answer": (
                    f"Access Denied: As a "
                    f"'{designation}', you do not have "
                    f"security clearance to view "
                    f"documentation for this domain."
                ),

                "confidence_score": 0.0,

                "citations": [],

                "recommended_action": (
                    "Contact your HR representative "
                    "or IT Admin to request elevated "
                    "role permissions."
                ),
            }

        # ----------------------------------------------------
        # 5. FILTER RELEVANT DOCUMENTS
        # ----------------------------------------------------

        valid_docs = []

        for doc, score in results_with_scores:

            if doc is None:
                continue

            if not doc.page_content:
                continue

            # Chroma distance is used here.
            if score <= 0.85:
                valid_docs.append(doc)

        # ----------------------------------------------------
        # FALLBACK TO BEST RESULT
        # ----------------------------------------------------

        if not valid_docs:

            best_doc = results_with_scores[0][0]

            if best_doc is not None:
                valid_docs = [best_doc]

        # ----------------------------------------------------
        # 6. NO VALID DOCUMENTS
        # ----------------------------------------------------

        if not valid_docs:

            return {
                "answer": (
                    "Access Denied / Insufficient "
                    "domain context available for "
                    "your role clearance."
                ),

                "confidence_score": 0.0,

                "citations": [],

                "recommended_action": (
                    "Try a more specific question."
                ),
            }

        # ----------------------------------------------------
        # 7. BUILD VERIFIED CONTEXT
        # ----------------------------------------------------

        context_str = (
            CitationContextBuilder.build_context_block(
                valid_docs
            )
        )

        # ----------------------------------------------------
        # 8. GROUNDED SYSTEM PROMPT
        # ----------------------------------------------------

        system_prompt = f"""
You are an elite Enterprise AI Knowledge Assistant.

SYSTEM MANDATES:

1. GROUNDING RULE
Answer the employee query ONLY using the
verified context snippets provided below.

2. ZERO EXTRAPOLATION
Do NOT use:
- External knowledge
- Internet knowledge
- Personal assumptions
- General knowledge
- Information not present in the context

3. SECURITY BOUNDARY
If the provided context does not contain
enough information to answer the question,
respond exactly with:

"Access Denied / Insufficient domain context available for your role clearance."

4. CITATIONS
Map citations accurately to the document
metadata provided in the context.

5. DO NOT INVENT INFORMATION
Never create:
- Policies
- Rules
- Dates
- Names
- Numbers
- Procedures
- Benefits
- Permissions

unless they are explicitly present in
the provided context.

6. ANSWER CLEARLY
Use simple professional language.

7. EMPLOYEE ROLE
Employee designation:

{designation}

8. ALLOWED DEPARTMENTS

{allowed_depts}


============================================================
VERIFIED CONTEXT
============================================================

{context_str}


============================================================
EMPLOYEE QUERY
============================================================

{query}
"""

        # ----------------------------------------------------
        # 9. GENERATE RESPONSE
        # ----------------------------------------------------

        try:

            response = self.llm.invoke(
                system_prompt
            )

        except Exception as exc:

            print(
                f"LLM generation error: {exc}"
            )

            return {
                "answer": (
                    "Unable to generate a response "
                    "at this time."
                ),

                "confidence_score": 0.0,

                "citations": [],

                "recommended_action": (
                    "Please try again later."
                ),
            }

        # ----------------------------------------------------
        # 10. RETURN STRUCTURED RESPONSE
        # ----------------------------------------------------

        if hasattr(
            response,
            "model_dump"
        ):

            return response.model_dump()

        if isinstance(
            response,
            dict
        ):

            return response

        return {
            "answer": str(response),
            "confidence_score": 0.0,
            "citations": [],
            "recommended_action": "",
        }