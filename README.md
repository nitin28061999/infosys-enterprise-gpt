# 🚀 Infosys AI Knowledge Assistant – Enterprise GPT

An enterprise-grade AI-powered Knowledge Assistant that enables Infosys employees to securely search, retrieve, and interact with internal organizational knowledge using Retrieval-Augmented Generation (RAG), Google Gemini, and Model Context Protocol (MCP).

The platform transforms enterprise documents such as SOPs, HR policies, project manuals, engineering guides, and sales assets into a searchable knowledge base, providing fast, reliable, and citation-backed answers while enforcing role-based access control.

---

# 🛠️ Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- ShadCN UI

### Backend
- FastAPI
- Python
- SQLAlchemy
- JWT Authentication

### AI & RAG
- Google Gemini
- LangChain
- LangGraph
- ChromaDB

### Database
- Supabase PostgreSQL

### Document Processing
- PyPDF
- python-docx
- Unstructured

### Deployment
- Vercel
- Render

---

# ⚡ Quick Start

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/infosys-ai-knowledge-assistant-enterprise-gpt.git

cd infosys-ai-knowledge-assistant-enterprise-gpt
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend

npm install
```

---

## 3. Install Backend Dependencies

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

# ☁️ Set Up Supabase

1. Go to the **Supabase Dashboard**
2. Create a new project
3. Wait until provisioning finishes
4. Open

```
Settings
    ├── API
    └── Database
```

Copy the following values:

- Project URL
- Anon Key
- Service Role Key
- Database Connection String

---

# 🔑 Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Supabase
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co

SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vector Database
CHROMA_DB_PATH=./vector_store

# Authentication
JWT_SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

# Uploads
UPLOAD_DIRECTORY=uploads
```

---

# 🗄️ Database Setup

Create a new SQL script inside the Supabase SQL Editor.

The application will create tables for:

- Users
- Documents
- Metadata
- Departments
- Feedback
- Audit Logs
- Query History
- Knowledge Sources

Run the SQL migration before starting the application.

---

# ▶️ Run the Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Backend will start at

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

# ▶️ Run the Frontend

```bash
cd frontend

npm run dev
```

Frontend will start at

```
http://localhost:3000
```

---

# ✨ Features

## Enterprise AI Assistant

- Natural language search
- Context-aware conversations
- Citation-backed answers
- Source previews
- Confidence scores

---

## Knowledge Management

- Upload PDF, DOCX, TXT
- Automatic document parsing
- Metadata tagging
- Department assignment
- Version management

---

## Retrieval-Augmented Generation (RAG)

- Semantic document search
- Vector embeddings
- Context retrieval
- Grounded AI responses
- Citation generation

---

## MCP Connectors

- File System
- SharePoint (Planned)
- Jira (Planned)
- GitHub (Planned)
- Confluence (Planned)

---

## Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- Department-level permissions
- Secure API keys
- Audit logging

---

## Analytics

- Query analytics
- Citation coverage
- Retrieval quality
- Failed search tracking
- Feedback dashboard

---

# 📂 Project Structure

```
infosys-ai-knowledge-assistant-enterprise-gpt/

├── frontend/
├── backend/
├── ingestion_pipeline/
├── ai_workflows/
├── data/
├── docs/
├── tests/
└── deployment/
```

---

# 🔐 Authentication

The platform supports three user roles:

- Administrator
- Knowledge Owner
- Employee

Each role has different permissions for document management, administration, and knowledge retrieval.

---

# 🧪 Testing

Run frontend tests

```bash
npm test
```

Run backend tests

```bash
pytest
```

The project includes:

- Functional Tests
- Ingestion Tests
- Retrieval Tests
- AI Output Tests
- Access Control Tests

---

# 🚀 Deployment

### Frontend

Deploy using:

- Vercel

### Backend

Deploy using:

- Render

### Database

- Supabase PostgreSQL

### Vector Store

- ChromaDB

---

# 📈 Future Enhancements

- SharePoint Integration
- Jira Integration
- Confluence Integration
- GitHub Connector
- Hybrid Search
- OCR for Scanned Documents
- Voice-based Queries
- Streaming AI Responses
- Multi-language Support

---

# 🤝 Contributing

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/feature-name
```

5. Open a Pull Request

---

# 📄 License

This project was developed as part of the **Infosys Enterprise GPT Capstone/Hackathon Project** for educational and demonstration purposes.

---

# 👥 Team

- Product Engineering
- Frontend Development
- Backend Development
- AI/ML Engineering
- Database Engineering
- QA & Testing
- Documentation