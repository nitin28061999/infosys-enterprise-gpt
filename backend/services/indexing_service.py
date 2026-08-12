import os
from io import BytesIO

import chromadb
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def create_texts(filebyte):
    """
    Extract text from every page of a PDF.

    Args:
        filebyte: PDF file as bytes

    Returns:
        List of dictionaries containing page number and text.
    """

    reader = PdfReader(BytesIO(filebyte))

    pages = []

    for page_no, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        pages.append({
            "page_number": page_no,
            "text": text + "\n"
        })

    return pages


# ============================================================
# TEXT CHUNKING
# ============================================================

def create_chunks(pages):
    """
    Split PDF pages into smaller chunks for embedding.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = []

    for page in pages:

        page_text = page.get("text", "")

        if not page_text.strip():
            continue

        docs = splitter.create_documents([page_text])

        for doc in docs:
            doc.metadata["page_number"] = page["page_number"]
            chunks.append(doc)

    return chunks


# ============================================================
# EMBEDDING SERVICE
# ============================================================

class EmbeddingService:

    def __init__(self):

        # Support both names so existing local configuration
        # and Render configuration can work.
        api_key = (
            os.getenv("GEMINI_API_KEY")
            or os.getenv("GOOGLE_API_KEY")
        )

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY or GOOGLE_API_KEY is not configured."
            )

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview",
            google_api_key=api_key
        )

    def create_embedding(self, chunks):
        """
        Create embeddings for document chunks.
        """

        if not chunks:
            return []

        texts = [
            chunk.page_content
            for chunk in chunks
            if chunk.page_content and chunk.page_content.strip()
        ]

        if not texts:
            return []

        embeddings = self.embeddings.embed_documents(texts)

        return embeddings

    def create_query_embedding(self, text):
        """
        Create embedding for a user query.
        """

        if not text or not text.strip():
            return []

        return self.embeddings.embed_query(text)


# ============================================================
# VECTOR DATABASE SERVICE
# ============================================================

class VectorService:

    def __init__(self):

        # Keep Chroma database inside the backend directory.
        base_dir = os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )

        chroma_path = os.path.join(
            base_dir,
            "chroma_db"
        )

        os.makedirs(chroma_path, exist_ok=True)

        self.client = chromadb.PersistentClient(
            path=chroma_path
        )

        self.collection = (
            self.client.get_or_create_collection(
                name="documents"
            )
        )

    def store_vectorDb(
        self,
        document_id,
        chunks,
        embeddings,
        title: str,
        department: str,
        owner: str,
        access_scope: str,
        confidentiality: str
    ):
        """
        Store document chunks, embeddings and metadata
        inside ChromaDB.
        """

        if not chunks:
            print("No chunks available to store.")
            return

        if not embeddings:
            print("No embeddings available to store.")
            return

        ids = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):

            ids.append(
                f"{document_id}_{index}"
            )

            documents.append(
                chunk.page_content
            )

            metadatas.append({
                "document_id": str(document_id),
                "document_name": str(title),
                "department": str(department),
                "owner": str(owner),
                "access_scope": str(access_scope),
                "confidentiality": str(confidentiality),
                "page_number": int(
                    chunk.metadata.get(
                        "page_number",
                        0
                    )
                ),
                "chunk_index": int(index)
            })

        # Make sure number of embeddings matches
        # number of documents.
        if len(embeddings) != len(documents):
            raise ValueError(
                f"Embedding count ({len(embeddings)}) "
                f"does not match chunk count ({len(documents)})."
            )

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

        print(
            f"Successfully stored {len(ids)} chunks "
            f"for document {document_id}"
        )

    def search(
        self,
        query_embedding,
        n_results=5,
        where=None
    ):
        """
        Search ChromaDB using an embedding.
        """

        if not query_embedding:
            return {
                "ids": [[]],
                "documents": [[]],
                "metadatas": [[]],
                "distances": [[]]
            }

        query_kwargs = {
            "query_embeddings": [query_embedding],
            "n_results": n_results
        }

        if where:
            query_kwargs["where"] = where

        return self.collection.query(
            **query_kwargs
        )

    def delete_document(self, document_id):
        """
        Delete all chunks belonging to a document.
        """

        self.collection.delete(
            where={
                "document_id": str(document_id)
            }
        )

        print(
            f"Deleted document: {document_id}"
        )

    def get_document(self, document_id):
        """
        Get all stored chunks belonging to a document.
        """

        return self.collection.get(
            where={
                "document_id": str(document_id)
            }
        )

    def count(self):
        """
        Return total number of vectors in ChromaDB.
        """

        return self.collection.count()