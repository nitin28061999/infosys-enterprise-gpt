# ?? Infosys AI Knowledge Assistant (Enterprise RAG System)

An end-to-end Enterprise Retrieval-Augmented Generation (RAG) platform powered by **LangChain**, **Google Gemini 2.5 Flash**, **ChromaDB**, and **Streamlit**. 

This platform enables secure, role-restricted internal knowledge discovery with strict citation grounding, structured JSON schemas, and Zero-Extrapolation guardrails.

---

## ?? Architecture & System Workflow

`	ext
[ User Query ]
       �
       ?
[ Sidebar Identity (Designation) ]
       �
       ?
[ Query RBAC Classifier ] --(Filters allowed departments)--? [ ChromaDB Vector Search ]
                                                                      �
                                                               (Top K Chunks)
                                                                      �
                                                                      ?
                                                       [ Grounded Prompt Builder ]
                                                                      �
                                                                      ?
                                                        [ Gemini 2.5 Flash (T=0.0) ]
                                                                      �
                                                           (Structured Response)
                                                                      �
                                                                      ?
                                                       [ Streamlit Workspace & UI ]


# 🤖 Infosys AI Knowledge Assistant (Enterprise RAG System)

An end-to-end Enterprise Retrieval-Augmented Generation (RAG) platform powered by **LangChain**, **Google Gemini 2.5 Flash**, **ChromaDB**, and **Streamlit**. 

This platform enables secure, role-restricted internal knowledge discovery with strict citation grounding, structured JSON schemas, and Zero-Extrapolation guardrails.

---

## 🔒 Role-Based Access Control (RBAC) Matrix

The system enforces fine-grained access control based on user employee designations before retrieving document chunks from ChromaDB:

| Employee Designation | Permitted Department Clearance Domains |
| :--- | :--- |
| **Software Engineer** | `Engineering`, `Delivery Operations`, `PMO` |
| **Senior Software Engineer** | `Engineering`, `Delivery Operations`, `PMO` |
| **DevOps Lead** | `Engineering`, `Delivery Operations` |
| **Solutions Architect** | `Engineering`, `Delivery Operations`, `PMO` |
| **Sales Executive** | `Sales`, `Human Resources` |
| **Business Development Manager** | `Sales`, `PMO` |
| **HR Associate / Lead** | `Human Resources` |
| **Senior Manager** | **FULL ACCESS** (`Engineering`, `Delivery Operations`, `PMO`, `Human Resources`, `Sales`) |

---

## 📂 Project Structure

```text
langchain and rag final/
│
├── app.py                             # Main Streamlit Web Application entry point
├── README.md                          # Project documentation
├── requirments.txt                    # System dependencies
├── .env                               # Environment configurations (Google API Key)
│
├── ai_workflows/                      # Core AI workflows and logic modules
│   ├── __init__.py
│   ├── citation_builder/
│   │   ├── __init__.py
│   │   └── citation_formatter.py     # Pydantic schemas & context builder
│   ├── grounded_synthesis/
│   │   ├── __init__.py
│   │   └── synthesis_engine.py        # Gemini grounding engine & similarity search
│   ├── query_classification/
│   │   ├── __init__.py
│   │   └── rbac_classifier.py         # Department clearance RBAC matrix
│   └── rag_retrieval/
│       ├── __init__.py
│       └── hybrid_search.py           # CLI hybrid search retriever testing script
│
├── ingestion_pipeline/                # Ingestion and indexing pipeline
│   └── embedding_jobs/
│       ├── __init__.py
│       └── vector_indexer.py          # PDF document parser & ChromaDB vector indexer
│
├── data/                              # Source PDF documents organized by category
│   ├── engineering_guides/
│   ├── hr_policies/
│   ├── project_manuals/
│   ├── sales_assets/
│   └── sops/
│
└── vector_db/                         # Persistent ChromaDB vector store


Prerequisites & Setup
1. Environment Configuration
Ensure your Google Gemini API key is set in a .env file in the root folder:

Code snippet
GOOGLE_API_KEY=your_google_gemini_api_key_here

Execution Pipeline
Step 1: Ingest & Index PDF Documentation
Parse documents inside data/ and store vector embeddings in ChromaDB:

PowerShell
$env:PYTHONPATH="."
python ingestion_pipeline/embedding_jobs/vector_indexer.py

Test Retrieval Logic (CLI)
Verify vector similarity search and department metadata filters:

PowerShell
$env:PYTHONPATH="."
python ai_workflows/rag_retrieval/hybrid_search.py


Launch Streamlit Web UI
Start the user-facing web application:

PowerShell
$env:PYTHONPATH="."
python -m streamlit run app.py


