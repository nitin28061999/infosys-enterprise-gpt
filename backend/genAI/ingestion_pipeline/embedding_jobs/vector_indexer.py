import os
import tempfile
from typing import List, Dict, Any
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# import chromadb
from config.env_config import envConfig




class EnterprisePDFIndexer:
    def __init__(self, data_root_path: str = None, vector_db_path: str = "./genAI/vector_db", google_api_key: str = None):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
        self.data_root = data_root_path or os.path.join(project_root, "data")
        self.vector_db_path = os.path.join(project_root, "vector_db")

        api_key = envConfig.GEMINI_API_KEY

        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set your environment variable.")

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=api_key
        )

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

        self.vector_store = Chroma(
            persist_directory=self.vector_db_path,
            embedding_function=self.embeddings,
            collection_name="documents"
            )



    # def _get_department_from_path(self, file_path: str) -> str:
    #     # Check folder hierarchy or filename keywords
    #     lower_path = file_path.lower()
    #     if "hr" in lower_path or "leave" in lower_path:
    #         return "Human Resources"
    #     elif "sales" in lower_path or "transformation" in lower_path or "pitch" in lower_path:
    #         return "Sales"
    #     elif "sops" in lower_path or "incident" in lower_path or "delivery" in lower_path:
    #         return "Delivery Operations"
    #     elif "engineering" in lower_path or "microservices" in lower_path or "arch" in lower_path:
    #         return "Engineering"
    #     elif "project_manuals" in lower_path or "agile" in lower_path or "pmo" in lower_path:
    #         return "PMO"
    #     return "Human Resources"



    # def process_and_index(self):
    #     pdf_files = glob.glob(os.path.join(self.data_root, "**", "*.pdf"), recursive=True)
    #     print(f"\nSearching in: {self.data_root}")
    #     print(f"Found {len(pdf_files)} PDF documents to index...\n")

    #     all_chunks = []
    #     for pdf_path in pdf_files:
    #         file_name = os.path.basename(pdf_path)
    #         department = self._get_department_from_path(pdf_path)
    #         print(f" Parsing: {file_name} -> Tagged Department: '{department}'")

    #         loader = PyMuPDFLoader(pdf_path)
    #         docs = loader.load()

    #         for doc in docs:
    #             page_num = doc.metadata.get("page", 0) + 1
    #             chunks = self.text_splitter.split_text(doc.page_content)

    #             for chunk_idx, chunk_text in enumerate(chunks):
    #                 chunk_meta = {
    #                     "source_document": file_name,
    #                     "page_number": page_num,
    #                     "department": department,
    #                     "chunk_id": f"{file_name}_p{page_num}_c{chunk_idx}"
    #                 }
    #                 all_chunks.append({
    #                     "text": chunk_text,
    #                     "metadata": chunk_meta
    #                 })

    #     print(f"\nGenerated {len(all_chunks)} total vector chunks.")
    #     print("Indexing chunks into ChromaDB...")

    #     texts = [c["text"] for c in all_chunks]
    #     metadatas = [c["metadata"] for c in all_chunks]

    #     Chroma.from_texts(
    #         texts=texts,
    #         embedding=self.embeddings,
    #         metadatas=metadatas,
    #         persist_directory=self.vector_db_path
    #     )
    #     print(f" Successfully indexed and saved to '{self.vector_db_path}'!")




    def process_and_index(self, document, file_bytes: bytes):

     # Save Supabase bytes to a temporary PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(file_bytes)
            temp_pdf_path = temp_file.name

        try:
            loader = PyMuPDFLoader(temp_pdf_path)
            docs = loader.load()

            all_chunks = []

            for doc in docs:

                page_num = doc.metadata.get("page", 0) + 1

                chunks = self.text_splitter.split_text(doc.page_content)

                for chunk_idx, chunk_text in enumerate(chunks):

                    metadata = {
                        "document_id": document.id,
                        "title": document.title,
                        "department": document.department,
                        "owner_id": document.owner_id,
                        "access_scope": document.access_scope,
                        "confidentiality": document.confidentiality,
                        "page_number": page_num,
                        "chunk_id": f"{document.id}_{page_num}_{chunk_idx}"
                    }

                    all_chunks.append({
                        "text": chunk_text,
                        "metadata": metadata
                    })

            ids = [chunk["metadata"]["chunk_id"] for chunk in all_chunks ]
            texts = [c["text"] for c in all_chunks]
            metadatas = [c["metadata"] for c in all_chunks]

            self.vector_store.add_texts(
                texts=texts,
                metadatas=metadatas,
                ids=ids
                    )
            

            # Chroma.from_texts(
            #     texts=texts,
            #     embedding=self.embeddings,
            #     metadatas=metadatas,
            #     persist_directory=self.vector_db_path
            # )

            print(f"Indexed {document.title}")

        finally:
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)





# if __name__ == "__main__":
#     api_key = os.getenv("GOOGLE_API_KEY")
#     indexer = EnterprisePDFIndexer(google_api_key=api_key)
#     indexer.process_and_index()
