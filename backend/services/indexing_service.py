"""Indexing utilities."""
from io import BytesIO
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb





def create_texts(filebyte):

    reader = PdfReader(BytesIO(filebyte))
    text = ""
    pages = []

    for page_no, page in enumerate(reader.pages, start=1):
        pages.append({
            "page_number": page_no,
            "text": page.extract_text() + "\n"

        })

    return pages


def create_chunks(pages):

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    chunks = []

    for page in pages:
        docs = splitter.create_documents([page["text"]])
        for doc in docs:
            doc.metadata["page_number"] = page["page_number"]
            chunks.append(doc)

    return chunks



class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def create_embedding(self, chunks):

        texts = [chunk.page_content for chunk in chunks]

        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings

    def create_query_embedding(self, texts: list[str]):
        return self.model.encode(
            texts,
            convert_to_numpy=True
        )




class VectorService:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = self.client.get_or_create_collection(name="documents")

    def store_vector_db(self, document_id, chunks, embeddings, title: str, department: str, owner: str, access_scope: str, confidentiality: str):
        ids = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):
            ids.append(f"{document_id}_{index}")
            documents.append(chunk.page_content)
            metadatas.append({
                "document_id": document_id,
                "document_name": title,
                "department": department,
                "owner": owner,
                "access_scope": access_scope,
                "confidentiality": confidentiality,
                "page_number": chunk.metadata.get("page_number"),
                "chunk_index": index,
            })

        if metadatas:
            for key, value in metadatas[0].items():
                print(key, value, type(value))

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings.tolist(),
            metadatas=metadatas,
        )
        print(self.collection.get(ids=[ids[0]], include=["metadatas"]))
