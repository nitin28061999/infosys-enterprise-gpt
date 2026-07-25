# 🚀 Infosys AI Knowledge Assistant – Enterprise GPT

An enterprise-grade AI-powered Knowledge Assistant that enables Infosys employees to securely search, retrieve, and interact with organizational knowledge using **Retrieval-Augmented Generation (RAG)**, **Google Gemini**, **Supabase**, and **Model Context Protocol (MCP)**.

The platform transforms enterprise documents such as SOPs, HR policies, engineering manuals, project documentation, and knowledge bases into an intelligent conversational assistant with citation-backed responses and role-based access control.

---

# 📑 Table of Contents

- Features
- Tech Stack
- Project Architecture
- Project Structure
- Prerequisites
- Installation
- Environment Variables
- Database Setup
- Running the Application
- API Documentation
- Testing
- Deployment
- Roadmap
- Contributing
- License

---

# ✨ Features

## 🤖 Enterprise AI Assistant

- Natural language enterprise search
- Multi-turn conversations
- Citation-backed answers
- Confidence scores
- Source previews
- Conversation history

## 📚 Knowledge Management

- Upload PDF, DOCX and TXT files
- Automatic document parsing
- Metadata tagging
- Department assignment
- Version management

## 🧠 Retrieval-Augmented Generation (RAG)

- Semantic search
- Vector embeddings
- Context retrieval
- Grounded AI responses
- Citation generation

## 🔐 Enterprise Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- Department-level permissions
- Secure API keys
- Audit logging

## 📊 Analytics

- Query analytics
- User activity
- Failed search tracking
- Retrieval quality metrics
- Feedback dashboard

## 🔌 MCP Connectors

- File System
- SharePoint *(Planned)*
- Jira *(Planned)*
- GitHub *(Planned)*
- Confluence *(Planned)*

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ShadCN UI

## Backend

- FastAPI
- Python 3.11+
- SQLAlchemy
- JWT Authentication

## AI

- Google Gemini
- LangChain
- LangGraph

## Vector Database

- ChromaDB

## Database

- Supabase PostgreSQL

## Document Processing

- PyPDF
- python-docx
- Unstructured

## Deployment

- Vercel
- Render

---

# 🏗 Project Architecture

```
                Frontend (Next.js)
                        │
                        ▼
                 FastAPI Backend
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
 Supabase DB      Google Gemini      ChromaDB
      │                                  │
      └──────────────RAG Pipeline────────┘
```

---

# 📂 Project Structure

```text
infosys-ai-knowledge-assistant-enterprise-gpt/

├── frontend/
│   ├── app/
│   ├── component/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── api/
│   ├── auth/
│   ├── services/
│   ├── connectors/
│   ├── database/
│   ├── audit/
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
│
├── docs/
├── tests/
├── deployment/
└── README.md
```

---

# 📋 Prerequisites

Install:

- Node.js 20+
- Python 3.11+
- Git
- Supabase Account
- Google AI Studio Account

---

# ⚡ Installation

## 1. Clone Repository

```bash
git clone https://github.com/nitin28061999/infosys-enterprise-gpt

cd infosys-ai-knowledge-assistant-enterprise-gpt
```

---

## 2. Frontend Setup

```bash
cd frontend

npm install
```

---

## 3. Backend Setup

```bash
cd ../backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

# ☁️ Supabase Setup

Create a new project from the Supabase Dashboard.

Collect the following values:

- Project URL
- Project Reference
- Database Password
- Anon Key
- Service Role Key
- Database Connection String

---

# 🔑 Environment Variables

## Frontend

Create

```
frontend/.env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL= https://supabase.com/dashboard/project/hgpwqlzbmpbesbmrpaoo

NEXT_PUBLIC_SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncHdxbHpibXBiZXNibXJwYW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjk1ODAsImV4cCI6MjA5OTk0NTU4MH0.iEdP7Db9sxIGKFcl3c3jvlD0-VXRqd_QnpNgsdCD4DA

NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Backend

Create

```
backend/.env
```

```env
# Gemini

GEMINI_API_KEY= AQ.Ab8RN6IJFaPYN7CVfRtrmwXCRNx0fjN7RrMBh0T6tIZwGs_k1Q

# Supabase

DATABASE_URL=postgresql://postgres:Edgpt@2026@db.hgpwqlzbmpbesbmrpaoo.supabase.co:5432/postgres

SUPABASE_URL=https://hgpwqlzbmpbesbmrpaoo.supabase.co

SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncHdxbHpibXBiZXNibXJwYW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjk1ODAsImV4cCI6MjA5OTk0NTU4MH0.iEdP7Db9sxIGKFcl3c3jvlD0-VXRqd_QnpNgsdCD4DA

SUPABASE_SERVICE_ROLE_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncHdxbHpibXBiZXNibXJwYW9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDM2OTU4MCwiZXhwIjoyMDk5OTQ1NTgwfQ.xT0vtblwpIVREuWAuGaciRpLAawJ0scP1KzkIrLjc4Y

# Chroma

CHROMA_DB_PATH=./vector_store

# JWT

JWT_SECRET_KEY= dc6d956e-8e75-4b18-abfe-82035d2da9ca

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

# Uploads

UPLOAD_DIRECTORY=uploads
```

Create directories

```bash
mkdir uploads

mkdir vector_store
```

---

# 🗄 Database Setup

Open the Supabase SQL Editor.

Run the migration scripts located in

```
backend/database/migrations
```

This creates:

- Users
- Documents
- Metadata
- Departments
- Audit Logs
- Query History
- Feedback
- Knowledge Sources

---

# ▶ Running the Backend

```bash
cd backend

uvicorn main:app --reload
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

ReDoc

```
http://localhost:8000/redoc
```

---

# ▶ Running the Frontend

```bash
cd frontend

npm run dev
```

Frontend

```
http://localhost:3000
```

---

# 🔐 User Roles

| Role | Permissions |
|------|-------------|
| Administrator | Full System Access |
| Knowledge Owner | Manage Documents |
| Employee | Search & Chat |

---

# 🧪 Testing

## Frontend

```bash
npm run lint
```

*(Add `npm test` after configuring a test framework.)*

## Backend

```bash
pytest
```

---

# 🚀 Deployment

## Frontend

- Vercel

## Backend

- Render

## Database

- Supabase PostgreSQL

## Vector Database

- ChromaDB

---

# 📈 Roadmap

- SharePoint Connector
- Jira Connector
- GitHub Connector
- Confluence Connector
- OCR Support
- Hybrid Search
- Streaming Responses
- Voice Search
- Multi-language Support

---

# 🤝 Contributing

1. Fork the repository

2. Create a branch

```bash
git checkout -b feature/my-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 📄 License

This project was developed as part of the **Infosys Enterprise GPT Capstone/Hackathon Project** for educational and demonstration purposes.

---

# 👨‍💻 Team

- Product Engineering
- Frontend Development
- Backend Development
- AI/ML Engineering
- Database Engineering
- QA & Testing
- Documentation

---

⭐ If you found this project useful, consider giving it a star on GitHub.