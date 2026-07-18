# Infosys AI Knowledge Assistant – Enterprise GPT

An enterprise-grade AI Knowledge Assistant that enables Infosys employees to securely search, retrieve, and interact with internal knowledge using Retrieval-Augmented Generation (RAG), Model Context Protocol (MCP), and Large Language Models (LLMs).

The platform ingests enterprise documents such as SOPs, HR policies, project manuals, engineering guides, and sales assets, indexes them into a vector database, and provides citation-backed answers while enforcing role-based access control.

---

# Features

- Enterprise AI Assistant
- Retrieval-Augmented Generation (RAG)
- Document Upload & Knowledge Ingestion
- Semantic Search using ChromaDB
- Citation-Based Answers
- Role-Based Access Control (RBAC)
- MCP Connector Architecture
- Analytics Dashboard
- Knowledge Governance
- Audit Logging
- Feedback Collection
- Department-specific Knowledge Workspaces

---

# Architecture

```
Employee Query
        │
        ▼
Query Classification
        │
        ▼
MCP Tool Selection
        │
        ▼
Document Retrieval (RAG)
        │
        ▼
LLM Synthesis (Gemini)
        │
        ▼
Citation Builder
        │
        ▼
Enterprise GPT Response
```

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI

## Backend

- FastAPI
- Python
- SQLAlchemy
- JWT Authentication

## AI

- Google Gemini
- LangChain
- LangGraph

## Database

- Supabase PostgreSQL
- ChromaDB

## Document Processing

- PyPDF
- python-docx
- Unstructured

## Deployment

- Vercel
- Render

---

# Repository Structure

```
infosys-ai-knowledge-assistant-enterprise-gpt/

├── README.md
├── .env.example

├── frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   └── styles/

├── backend/
│   ├── api/
│   ├── auth/
│   ├── services/
│   ├── connectors/
│   ├── database/
│   └── audit/

├── ingestion_pipeline/
│   ├── upload/
│   ├── document_parsing/
│   ├── chunking/
│   ├── metadata_tagging/
│   ├── embedding_jobs/
│   └── refresh_jobs/

├── ai_workflows/
│   ├── query_classification/
│   ├── mcp_tool_selection/
│   ├── rag_retrieval/
│   ├── grounded_synthesis/
│   ├── citation_builder/
│   └── evaluation/

├── data/
│   ├── sample_sops/
│   ├── sample_hr_policies/
│   ├── sample_project_manuals/
│   ├── sample_engineering_guides/
│   └── sample_sales_assets/

├── docs/
│   ├── architecture.md
│   ├── api_documentation.md
│   ├── connector_setup.md
│   ├── security_notes.md
│   ├── demo_script.md
│   └── screenshots/

├── tests/
│   ├── functional_tests/
│   ├── ingestion_tests/
│   ├── retrieval_tests/
│   ├── ai_output_tests/
│   └── access_control_tests/

└── deployment/
    ├── vercel_notes.md
    ├── netlify_notes.md
    ├── backend_hosting_notes.md
    └── environment_setup.md
```

---

# Project Workflow

```
Upload Documents

↓

Validate Documents

↓

Extract Text

↓

Chunk Documents

↓

Generate Embeddings

↓

Store in ChromaDB

↓

Employee Query

↓

Intent Classification

↓

MCP Tool Selection

↓

Semantic Retrieval

↓

Gemini Response Generation

↓

Citation Builder

↓

Final Answer
```

---

# AI Workflow

The AI workflow consists of:

- Query Classification
- Intent Detection
- MCP Tool Selection
- Retrieval-Augmented Generation
- Grounded Response Generation
- Citation Generation
- Confidence Scoring
- Feedback Collection

---

# Modules

## Document Upload

- Upload PDF
- Upload DOCX
- Upload TXT
- Metadata Validation
- Department Assignment

---

## Knowledge Processing

- Text Extraction
- Document Chunking
- Metadata Tagging
- Embedding Generation
- Vector Storage

---

## Enterprise GPT

- Natural Language Queries
- Context Retrieval
- Citation Support
- Confidence Indicators
- Source Preview

---

## Administration

- User Management
- Document Management
- Knowledge Governance
- MCP Connector Management
- Analytics Dashboard

---

# Security

- JWT Authentication
- Role-Based Access Control
- Department-Based Authorization
- Secure API Keys
- Audit Logging
- Permission-aware Retrieval

---

# Environment Variables

Create a `.env` file using `.env.example`.

Example:

```env
GEMINI_API_KEY=

DATABASE_URL=

SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

CHROMA_DB_PATH=./vector_store

JWT_SECRET_KEY=

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

UPLOAD_DIRECTORY=uploads
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/infosys-ai-knowledge-assistant-enterprise-gpt.git

cd infosys-ai-knowledge-assistant-enterprise-gpt
```

---

## Backend

```bash
cd backend

python -m venv venv
```

Activate environment

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# API Modules

- Authentication
- Document Upload
- Indexing
- Query Processing
- Retrieval
- Citation Generation
- Feedback
- Analytics

---

# Database

Supabase PostgreSQL stores:

- Users
- Documents
- Metadata
- Departments
- Feedback
- Audit Logs
- Query History

ChromaDB stores:

- Embeddings
- Document Chunks
- Semantic Indexes

---

# Testing

```
tests/

functional_tests/

ingestion_tests/

retrieval_tests/

ai_output_tests/

access_control_tests/
```

---

# Deployment

Frontend

- Vercel

Backend

- Render

Database

- Supabase PostgreSQL

Vector Database

- ChromaDB

---

# Future Enhancements

- SharePoint Connector
- Jira Connector
- Confluence Connector
- GitHub Connector
- Hybrid Search
- Semantic Caching
- OCR Support
- Voice Assistant
- Streaming Responses
- Multi-language Support

---

# Contributors

Team Members

- Product
- Frontend
- Backend
- AI/ML
- Database
- Testing
- Documentation

---

# License

This project is developed for the Infosys Enterprise GPT Hackathon/Capstone Project and is intended for educational and demonstration purposes.