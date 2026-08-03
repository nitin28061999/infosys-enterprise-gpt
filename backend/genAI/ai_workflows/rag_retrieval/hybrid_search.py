import os
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class EnterpriseSearchRetriever:
    def __init__(self, vector_db_path: str = None, google_api_key: str = None):
        if vector_db_path is None:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
            vector_db_path = os.path.join(project_root, "vector_db")

        api_key = google_api_key or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set your environment variable or pass explicitly.")

        print("Loading Embedding Model (Google Generative AI)...")
        # Updated to active Gemini embedding model name
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-2-preview", 
            google_api_key=api_key
        )
        
        print(f"Connecting to Vector DB at: {vector_db_path}")
        self.vector_db = Chroma(
            persist_directory=vector_db_path,
            embedding_function=self.embeddings
        )

    def search(self, query: str, top_k: int = 3, department_filter: str = None):
        print(f"\n🔍 Query: '{query}'")
        
        # Optional Department Metadata Filter
        filter_dict = {}
        if department_filter:
            filter_dict = {"department": department_filter}

        results = self.vector_db.similarity_search_with_score(
            query=query,
            k=top_k,
            filter=filter_dict if filter_dict else None
        )

        print(f"Found {len(results)} relevant chunks:\n" + "="*50)
        for idx, (doc, score) in enumerate(results, 1):
            meta = doc.metadata
            print(f"[{idx}] Source: {meta.get('source_document')} (Page {meta.get('page_number')})")
            print(f"    Department: {meta.get('department')}")
            print(f"    Relevance Score (Distance): {round(score, 4)}")
            print(f"    Content Snippet: {doc.page_content[:180]}...")
            print("-" * 50)



if __name__ == "__main__":
    api_key = os.getenv("GOOGLE_API_KEY")
    retriever = EnterpriseSearchRetriever(google_api_key=api_key)
    
    # Test Query 1: HR Policy
    retriever.search("How many casual leaves do employees get annually?")
    
    # Test Query 2: SOP Escalation
    retriever.search("What is the response SLA for Severity 1 incidents?")
