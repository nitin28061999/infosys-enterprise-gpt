# 🚀 Infosys AI Knowledge Assistant – Enterprise GPT

An enterprise-grade AI-powered knowledge management platform that enables organizations to securely search, retrieve, and interact with internal knowledge using **Generative AI, Retrieval-Augmented Generation (RAG), Google Gemini, and MCP-based integrations**.

The system converts enterprise documents such as:

- HR Policies
- SOPs
- Engineering Documents
- Project Manuals
- Technical Guides
- Business Documents

into an intelligent searchable knowledge base.

Employees can ask questions in natural language and receive **context-aware, citation-backed AI responses** while maintaining enterprise security through **authentication and role-based access control (RBAC).**

---

# 📌 Project Overview

Traditional enterprise knowledge systems suffer from:

- Information scattered across multiple platforms
- Difficulty finding relevant documents
- Manual searching through large files
- Lack of intelligent assistance

The Infosys AI Knowledge Assistant solves this problem by combining:

- Large Language Models (LLMs)
- Vector Search
- Document Intelligence
- Secure Enterprise Access Control

to provide an AI-powered organizational assistant.

---

# ✨ Key Features

## 🤖 AI Knowledge Assistant

- Natural language conversations
- Context-aware responses
- Retrieval-Augmented Generation (RAG)
- Citation-based answers
- Source document references
- Reduced AI hallucination

---

## 📚 Knowledge Management

Users can upload and manage:

- PDF files
- DOCX documents
- TXT files

Features:

- Automatic document processing
- Metadata extraction
- Document categorization
- Knowledge indexing
- Version management

---

## 🔎 Intelligent Search

The platform provides:

- Semantic document search
- Vector similarity retrieval
- Relevant context extraction
- AI-generated summaries

---

## 🔐 Enterprise Security

Implemented security features:

- JWT authentication
- Role-Based Access Control (RBAC)
- Department-level permissions
- Secure API communication
- Audit logging

Supported roles:

| Role | Permission |
|---|---|
| Administrator | Full system management |
| Knowledge Owner | Manage documents |
| Employee | Search and query knowledge |

---

## 📊 Analytics Dashboard

Provides insights into:

- User activity
- Query history
- Document usage
- Retrieval performance
- Feedback analysis

---

# 🏗️ System Architecture

```
                 User
                  |
                  |
            Next.js Frontend
                  |
                  |
             FastAPI Backend
                  |
        ----------------------
        |                    |
 Authentication          AI Engine
        |                    |
        |              RAG Pipeline
        |                    |
        |        --------------------
        |        |                  |
   PostgreSQL  ChromaDB        Gemini LLM
        |
     Supabase
```

---

# 🛠️ Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- JWT Authentication

---

## Artificial Intelligence

- Google Gemini
- LangChain
- LangGraph
- Retrieval-Augmented Generation (RAG)

---

## Database

- Supabase PostgreSQL

---

## Vector Database

- ChromaDB

---

## Document Processing

- PyPDF
- python-docx
- Unstructured

---

## Deployment

- Vercel (Frontend)
- Render (Backend)
- Supabase (Database)

---

# 📂 Project Structure

```
infosys-enterprise-gpt/

│
├── frontend/
│   ├── app/
│   ├── component/
│   ├── hooks/
│   ├── lib/
│   └── styles/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│
├── ingestion_pipeline/
│
├── ai_workflows/
│
├── data/
│
├── docs/
│
├── tests/
│
├── deployment/
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

# ⚡ Installation Guide

## Clone Repository

```bash
git clone https://github.com/nitin28061999/infosys-enterprise-gpt.git

cd infosys-enterprise-gpt
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create environment file:

```
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

# Backend Setup

Navigate:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

Install packages:

```bash
pip install -r requirements.txt
```

Create:

```
backend/.env
```

Example:

```env
GEMINI_API_KEY=your_api_key

DATABASE_URL=your_database_url

SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_key

JWT_SECRET_KEY=your_secret

CHROMA_DB_PATH=./vector_store
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Backend:

```
http://localhost:8000
```

API Documentation:

```
http://localhost:8000/docs
```

---

# 🔄 RAG Workflow

```
Document Upload
       |
       |
Document Processing
       |
       |
Text Extraction
       |
       |
Embedding Generation
       |
       |
Vector Storage
       |
       |
User Query
       |
       |
Semantic Retrieval
       |
       |
Gemini Response Generation
       |
       |
Citation-backed Answer
```

---

# 🔌 MCP Integrations

Future supported connectors:

- File System
- SharePoint
- Jira
- GitHub
- Confluence

---

# 🧪 Testing

## Frontend Testing

```bash
npm test
```

## Backend Testing

```bash
pytest
```

Testing includes:

- API testing
- Authentication testing
- Document ingestion testing
- Retrieval testing
- AI response validation

---

# 🚀 Deployment

## Frontend

Platform:

```
Vercel
```

---

## Backend

Platform:

```
Render
```

---

## Database

Platform:

```
Supabase PostgreSQL
```

---

# 🔒 Security Guidelines

Never commit:

```
.env
.env.local
node_modules/
venv/
*.key
*.pem
```

Use:

- Environment variables
- Secret management
- API key rotation

---

# 📈 Future Enhancements

Planned improvements:

- SharePoint integration
- Jira integration
- Confluence integration
- Hybrid search
- OCR document processing
- Voice assistant
- Multi-language support
- Streaming AI responses

---

# 👥 Team Contribution

## Frontend Team

Responsible for:

- User Interface
- Dashboard
- Authentication pages
- Chat interface
- Admin interface
- Responsive design


## Backend Team

Responsible for:

- APIs
- Authentication
- Database
- Document services


## AI/ML Team

Responsible for:

- RAG pipeline
- Embeddings
- Gemini integration
- Retrieval optimization


## DevOps Team

Responsible for:

- Deployment
- CI/CD
- Documentation
- Security

---

# 📄 License

This project is developed as part of the **Infosys Enterprise GPT Capstone/Hackathon Project** for educational and demonstration purposes.

---

# ⭐ Acknowledgement

Built using modern AI technologies to demonstrate how enterprise organizations can transform internal knowledge management using Generative AI.
