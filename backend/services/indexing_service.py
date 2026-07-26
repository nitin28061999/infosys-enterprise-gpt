from io import BytesIO
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb





def create_texts(filebyte):

    reader = PdfReader(BytesIO(filebyte))
    text = ""

    for page in reader.pages:
        text += page.extract_text() + "\n"

    return text


def create_chunks(text):

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.create_documents([text])
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


    def store_vectorDb(self, document_id, chunks, embeddings):    

        ids = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):
            ids.append(f"{document_id}_{index}")
            documents.append(chunk.page_content)
            metadatas.append({
                "document_id": document_id,
                "chunk_index": index,
            })

        self.collection.add(
                ids=ids,
                documents=documents,
                embeddings=embeddings.tolist(),
                metadatas=metadatas,)
