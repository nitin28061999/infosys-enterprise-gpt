import os
from typing import Dict, Any
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

# Import modular components
from genAI.ai_workflows.query_classification.rbac_classifier import QueryRBACClassifier
from genAI.ai_workflows.citation_builder.citation_formatter import GroundedResponseSchema, CitationContextBuilder


from config.env_config import envConfig
from src.audit.audit_model import Audit, AuditStatus
from src.audit.audit_service import AuditService
import time
from config.logger_config import logger
from config.db_config import SessionLocal
from utils.permission_util import permission_context_builder, can_access_document



class EnterpriseGroundedEngine:
    def __init__(self, vector_db_path: str = None, google_api_key: str = None):
        if vector_db_path is None:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
            vector_db_path = os.path.join(project_root, "vector_db")

        api_key = envConfig.GEMINI_API_KEY

        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set your environment variable.")

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=api_key
        )

        self.vector_db = Chroma(
            persist_directory=vector_db_path,
            embedding_function=self.embeddings,
            collection_name="documents"
        )

        self.llm = ChatGoogleGenerativeAI(
            # model="gemini-2.5-flash",
            model="gemini-3.5-flash-lite",
            temperature=0.0,
            google_api_key=api_key
        ).with_structured_output(GroundedResponseSchema)

        db = SessionLocal()
        self.audit_service = AuditService(db)



#     def generate_response(self, query: str, designation: str = "Software Engineer") -> Dict[str, Any]:
#         # 1. Empty / Whitespace Input Guardrail
#         if not query or not query.strip():
#             return {
#                 "answer": "Please enter a valid search query.",
#                 "confidence_score": 0.0,
#                 "citations": [],
#                 "recommended_action": "Type a specific question regarding internal policies or SOPs."
#             }

#         allowed_depts = QueryRBACClassifier.get_allowed_departments(designation)

#         # 2. Perform RBAC-filtered similarity search
#         results_with_scores = self.vector_db.similarity_search_with_score(
#             query=query,
#             k=5,
#             filter={"department": {"$in": allowed_depts}}
#         )

#         # 3. Explicit Access Denied Fallback if zero permitted documents match
#         if not results_with_scores:
#             return {
#                 "answer": f"Access Denied: As a '{designation}', you do not have security clearance to view documentation for this domain.",
#                 "confidence_score": 0.0,
#                 "citations": [],
#                 "recommended_action": "Contact your HR representative or IT Admin to request elevated role permissions."
#             }

#         valid_docs = [doc for doc, score in results_with_scores if score <= 0.85]
#         if not valid_docs:
#             valid_docs = [results_with_scores[0][0]]

#         context_str = CitationContextBuilder.build_context_block(valid_docs)

#         system_prompt = f"""You are an elite Enterprise AI Knowledge Assistant.
# SYSTEM MANDATES:
# 1. Grounding Rule: Answer the query using ONLY the verified context snippets provided below.
# 2. Zero Extrapolation: Do NOT bring in external memory, general internet knowledge, or assumptions.
# 3. Security Boundary: If the provided document snippets do not contain direct facts to answer the question, state: "Access Denied / Insufficient domain context available for your role clearance."
# 4. Citations: Map citations accurately to the document metadata provided in context.

# CONTEXT SNIPPETS:
# {context_str}

# EMPLOYEE QUERY: {query}
# """
#         response = self.llm.invoke(system_prompt)
#         return response.model_dump()


    def generate_response(
        self,
        query: str,
        department: str,
        id: int,
        role: str
    ) -> Dict[str, Any]:


        start = time.perf_counter()

        response = None
        status = AuditStatus.SUCCESS
        retrieved_documents = None
        results_with_scores = None


        try:

            # 1. Empty / Whitespace Input Guardrail
            if not query or not query.strip():
                status = AuditStatus.NO_ANSWER

                return {
                    "answer": "Please enter a valid search query.",
                    "confidence_score": 0.0,
                    "citations": [],
                    "recommended_action": "Type a specific question regarding internal policies or SOPs."
                }

            # 2. Search 
            results_with_scores = self.vector_db.similarity_search_with_score(
                query=query,
                k=20,
            )


            # 3. No documents found for this department
            if not results_with_scores:
                status = AuditStatus.NO_ANSWER
                return {
                    "answer": f"No documents found for the '{department}' department.",
                    "confidence_score": 0.0,
                    "citations": [],
                    "recommended_action": "Please contact your administrator if you believe documents should exist for this department."
                }



            # permission filtering
            curr_user = {"id": id, "role": role, "department": department}
            permission_context = permission_context_builder(curr_user)
            authorized_results = []

            for doc, score in results_with_scores:

                allowed = can_access_document(doc.metadata, permission_context)

                print(
                        f"DOCUMENT={doc.metadata.get('title')} "
                        f"ID={doc.metadata.get('document_id')} "
                        f"DEPARTMENT={doc.metadata.get('department')} "
                        f"SCORE={score} "
                        f"ALLOWED={allowed}"
                    )

                if allowed:
                    authorized_results.append((doc, score))

            # 5. No authorized documents
            if not authorized_results:
                staus = AuditStatus.NO_ANSWER
                return {
                    "answer": "I couldn't find any documents that you " "are authorized to access." ,
                    "confidence_score": 0.0,
                    "citations": [],
                    "recommended_action": (
                        "Please contact your administrator if you "
                        "believe you should have access."
                    )
    }



            # 4. Filter by similarity score
            valid_docs = [ doc for doc, score in authorized_results]

            print("******** valid docs ******************")
            for doc in valid_docs:
                print(doc.metadata)

            if not valid_docs:
                valid_docs = [authorized_results[0][0]]

            # 5. Build context
            context_str = CitationContextBuilder.build_context_block(valid_docs)

            # 6. Create prompt
            system_prompt = f"""
                            You are an Enterprise AI Knowledge Assistant.

                            Rules:
                            1. Answer ONLY using the provided context.
                            2. Do not use outside knowledge.
                            3. If the answer is not present in the context, reply:
                               "I couldn't find this information in the indexed documents."
                            4. Cite the source documents whenever possible.

                            Context:
                            {context_str}

                            Question:
                            {query}
                        """

            # print("\n========== CONTEXT ==========")
            # print(context_str)

            # print("\n========== QUERY ==========")
            # print(query)

            # print("\n========== PROMPT ==========")
            # print(system_prompt)

            # 7. Generate answer
            response = self.llm.invoke(system_prompt)

            answer = response.answer

            if "I couldn't find this information in the indexed documents." in answer.lower():
                status = AuditStatus.NO_ANSWER

            return response.model_dump()
        except Exception:
            status = AuditStatus.FAILED
            raise

        finally:

            end = time.perf_counter()

            response_time = int((end - start) * 1000)

            if results_with_scores:

                retrieved_documents = []

                for rank, (doc, score) in enumerate(results_with_scores, start=1):

                    meta = doc.metadata

                    retrieved_documents.append({

                        "rank": rank,

                        "document_id": meta.get("document_id"),

                        "document_name": meta.get("title"),

                        "department": meta.get("department"),

                        "owner": meta.get("owner_id"),

                        "page_number": meta.get("page_number"),

                        "chunk_id": meta.get("chunk_id"),

                        "distance": score,

                        "text": doc.page_content[:300]

                    })

            audit = Audit(

                user_id=id,

                question=query,

                answer=response.answer if response else None,

                retrieved_documents=retrieved_documents,

                response_time_ms=response_time,

                status=status

            )

            try:
                self.audit_service.create(audit)
            except Exception:
                logger.exception("Failed to save audit log")