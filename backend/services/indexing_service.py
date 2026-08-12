import os
from io import BytesIO
from typing import Any, Dict, List, Optional, Union

import chromadb
from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter


# ============================================================
# CONFIGURATION
# ============================================================

def get_google_api_key() -> str:
    """
    Get Gemini/Google API key from environment variables.
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
    Return the ChromaDB storage path.

    You can override this with CHROMA_DB_PATH.
    """

    configured_path = os.getenv("CHROMA_DB_PATH")

    if configured_path:
        os.makedirs(configured_path, exist_ok=True)
        return configured_path

    # backend/services/indexing_service.py
    # -> backend/services
    # -> backend
    backend_dir = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    chroma_path = os.path.join(
        backend_dir,
        "chroma_db"
    )

    os.makedirs(chroma_path, exist_ok=True)

    return chroma_path


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def create_texts(filebyte: bytes) -> List[Dict[str, Any]]:
    """
    Extract text from every page of a PDF.

    Args:
        filebyte: PDF file as bytes.

    Returns:
        List of dictionaries containing:
        - page_number
        - text
    """

    if not filebyte:
        raise ValueError("PDF file is empty.")

    reader = PdfReader(BytesIO(filebyte))

    pages: List[Dict[str, Any]] = []

    for page_no, page in enumerate(
        reader.pages,
        start=1
    ):
        text = page.extract_text() or ""

        pages.append({
            "page_number": page_no,
            "text": text + "\n"
        })

    return pages


# ============================================================
# TEXT CHUNKING
# ============================================================

def create_chunks(
    pages: List[Dict[str, Any]]
) -> List[Document]:
    """
    Split PDF pages into smaller chunks.

    Each chunk keeps the original page number.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks: List[Document] = []

    for page in pages:

        page_number = page.get(
            "page_number",
            0
        )

        page_text = page.get(
            "text",
            ""
        )

        if not page_text.strip():
            continue

        docs = splitter.create_documents(
            [page_text]
        )

        for doc in docs:

            if not doc.page_content.strip():
                continue

            doc.metadata["page_number"] = int(
                page_number
            )

            chunks.append(doc)

    return chunks


# ============================================================
# EMBEDDING SERVICE
# ============================================================

class EmbeddingService:

    def __init__(self):
        """
        Initialize Gemini Embeddings.

        Uses the stable Gemini Embedding 2 model.
        """

        api_key = get_google_api_key()

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2",
            google_api_key=api_key
        )

    # --------------------------------------------------------
    # DOCUMENT EMBEDDINGS
    # --------------------------------------------------------

    def create_embedding(
        self,
        chunks: List[Document]
    ) -> List[List[float]]:
        """
        Create embeddings for document chunks.
        """

        if not chunks:
            return []

        texts: List[str] = []

        for chunk in chunks:

            text = chunk.page_content

            if text and text.strip():
                texts.append(text)

        if not texts:
            return []

        embeddings = self.embeddings.embed_documents(
            texts
        )

        return embeddings

    # --------------------------------------------------------
    # QUERY EMBEDDING
    # --------------------------------------------------------

    def create_query_embedding(
        self,
        text: Union[str, List[str]]
    ):
        """
        Create embedding for a user query.

        Supports:
            create_query_embedding("What is leave policy?")

        or:

            create_query_embedding(
                ["What is leave policy?"]
            )
        """

        if isinstance(text, str):

            if not text.strip():
                return []

            return self.embeddings.embed_query(
                text
            )

        if isinstance(text, list):

            valid_texts = [
                item
                for item in text
                if item and item.strip()
            ]

            if not valid_texts:
                return []

            return self.embeddings.embed_documents(
                valid_texts
            )

        raise TypeError(
            "Query must be a string or list of strings."
        )


# ============================================================
# VECTOR DATABASE SERVICE
# ============================================================

class VectorService:

    def __init__(self):
        """
        Initialize persistent ChromaDB.
        """

        chroma_path = get_chroma_path()

        print(
            f"Initializing ChromaDB at: {chroma_path}"
        )

        self.client = chromadb.PersistentClient(
            path=chroma_path
        )

        self.collection = (
            self.client.get_or_create_collection(
                name="documents"
            )
        )

        print(
            f"ChromaDB collection ready: "
            f"{self.collection.name}"
        )

    # --------------------------------------------------------
    # STORE VECTORS
    # --------------------------------------------------------

    def store_vectorDb(
        self,
        document_id: str,
        chunks: List[Document],
        embeddings: List[List[float]],
        title: str,
        department: str,
        owner: str,
        access_scope: str,
        confidentiality: str
    ) -> None:
        """
        Store document chunks, embeddings and metadata
        inside ChromaDB.
        """

        if not chunks:
            print(
                "No chunks available to store."
            )
            return

        if not embeddings:
            print(
                "No embeddings available to store."
            )
            return

        if len(chunks) != len(embeddings):
            raise ValueError(
                "Chunk count and embedding count "
                "must be identical. "
                f"Chunks={len(chunks)}, "
                f"Embeddings={len(embeddings)}"
            )

        ids: List[str] = []
        documents: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        for index, chunk in enumerate(chunks):

            chunk_text = (
                chunk.page_content or ""
            ).strip()

            if not chunk_text:
                continue

            ids.append(
                f"{document_id}_{index}"
            )

            documents.append(
                chunk_text
            )

            page_number = chunk.metadata.get(
                "page_number",
                0
            )

            metadatas.append({
                "document_id": str(
                    document_id
                ),

                "document_name": str(
                    title
                ),

                "department": str(
                    department
                ),

                "owner": str(
                    owner
                ),

                "access_scope": str(
                    access_scope
                ),

                "confidentiality": str(
                    confidentiality
                ),

                "page_number": int(
                    page_number
                ),

                "chunk_index": int(
                    index
                )
            })

        if not ids:
            print(
                "No valid document chunks found."
            )
            return

        # The chunk list was filtered above.
        # Make sure embeddings still match.
        if len(ids) != len(embeddings):
            raise ValueError(
                "After filtering empty chunks, "
                "embedding count does not match "
                "document count."
            )

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

        print(
            f"Successfully stored "
            f"{len(ids)} chunks "
            f"for document {document_id}"
        )

    # --------------------------------------------------------
    # SEARCH
    # --------------------------------------------------------

    def search(
        self,
        query_embedding: List[float],
        n_results: int = 5,
        where: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
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

        query_kwargs: Dict[str, Any] = {
            "query_embeddings": [
                query_embedding
            ],
            "n_results": n_results
        }

        if where:
            query_kwargs["where"] = where

        return self.collection.query(
            **query_kwargs
        )

    # --------------------------------------------------------
    # DELETE DOCUMENT
    # --------------------------------------------------------

    def delete_document(
        self,
        document_id: str
    ) -> None:
        """
        Delete all chunks belonging
        to a document.
        """

        self.collection.delete(
            where={
                "document_id": str(
                    document_id
                )
            }
        )

        print(
            f"Deleted document: {document_id}"
        )

    # --------------------------------------------------------
    # GET DOCUMENT
    # --------------------------------------------------------

    def get_document(
        self,
        document_id: str
    ):
        """
        Get all chunks belonging
        to a document.
        """

        return self.collection.get(
            where={
                "document_id": str(
                    document_id
                )
            }
        )

    # --------------------------------------------------------
    # COUNT
    # --------------------------------------------------------

    def count(self) -> int:
        """
        Return total number of vectors.
        """

        return self.collection.count()

    # --------------------------------------------------------
    # DELETE ALL VECTORS
    # --------------------------------------------------------

    def clear_collection(self) -> None:
        """
        Delete all vectors from the collection.

        IMPORTANT:
        Use this once when changing embedding models
        and rebuilding the document index.
        """

        existing = self.collection.get()

        ids = existing.get(
            "ids",
            []
        )

        if ids:
            self.collection.delete(
                ids=ids
            )

            print(
                f"Deleted {len(ids)} existing vectors."
            )
        else:
            print(
                "Collection is already empty."
            )